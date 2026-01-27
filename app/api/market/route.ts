import { NextResponse } from 'next/server';
import YahooFinance from 'yahoo-finance2';
import { fetchGoogleFinanceData } from '@/lib/google-finance';

const yahooFinance = new YahooFinance();

const INDICES = [
    { name: "NIFTY 50", symbol: "^NSEI" },
    { name: "SENSEX", symbol: "^BSESN" },
    { name: "BANK NIFTY", symbol: "^NSEBANK" }
];

export async function GET() {
    try {
        const promises = INDICES.map(async (index) => {
            // STRATEGY 1: Google Finance Scraping (Primary)
            try {
                const googleData = await fetchGoogleFinanceData(index.symbol);
                return {
                    name: index.name,
                    value: googleData.value,
                    change: googleData.change
                };
            } catch (googleError) {
                console.warn(`Google Finance failed for ${index.name}, falling back to Yahoo:`, googleError);
            }

            // STRATEGY 2: Yahoo Finance API (Fallback)
            try {
                // 1. Try Quote API
                const quote: any = await yahooFinance.quote(index.symbol);
                let price = quote.regularMarketPrice;
                let prevClose = quote.regularMarketPreviousClose;
                let changePct = quote.regularMarketChangePercent;

                // 2. Fallback to Historical Data if crucial fields are missing
                if (price === undefined || prevClose === undefined || changePct === undefined) {
                    try {
                        const endDate = new Date();
                        const startDate = new Date();
                        startDate.setDate(endDate.getDate() - 7); // Fetch last 7 days to be safe

                        const history = await yahooFinance.historical(index.symbol, {
                            period1: startDate.toISOString().split('T')[0],
                            period2: endDate.toISOString().split('T')[0],
                            interval: '1d'
                        });

                        if (history && history.length > 0) {
                            // Latest available close
                            const latest = history[history.length - 1];
                            price = latest.close;

                            // Previous close (second to last)
                            if (history.length > 1) {
                                prevClose = history[history.length - 2].close;
                            } else {
                                // If only 1 day history, maybe assume no change or use open?
                                prevClose = latest.open; // fallback
                            }
                        }
                    } catch (histErr) {
                        console.error(`Historical fetch failed for ${index.symbol}`, histErr);
                    }
                }

                // 3. Calculate Change explicitly if we have the numbers but no percentage
                if ((changePct === undefined || changePct === 0) && price !== undefined && prevClose !== undefined && prevClose !== 0) {
                    changePct = ((price - prevClose) / prevClose) * 100;
                }

                // Format
                const sign = (changePct !== undefined && changePct >= 0) ? "+" : "";
                const changeStr = (changePct !== undefined) ? `${sign}${changePct.toFixed(2)}%` : "0.00%";

                return {
                    name: index.name,
                    value: price || 0,
                    change: changeStr
                };
            } catch (err) {
                console.error(`Failed to fetch ${index.name} from Yahoo:`, err);
                return {
                    name: index.name,
                    value: 0,
                    change: "Error"
                };
            }
        });

        const indicesData = await Promise.all(promises);

        // Check if all failed
        const allFailed = indicesData.every(item => item.value === 0 && item.change === "Error");
        if (allFailed) {
            throw new Error("Failed to fetch all market indices");
        }

        return NextResponse.json({
            indices: indicesData,
            status: "success",
            source: "Google Finance (Fallback: Yahoo)"
        });

    } catch (error) {
        console.error("Market Data Fetch Error:", error);
        return NextResponse.json({
            status: "error",
            message: error instanceof Error ? error.message : "Unknown error",
            indices: []
        }, { status: 500 });
    }
}
