import { NextResponse } from 'next/server';
import yahooFinance from 'yahoo-finance2';

const INDICES = [
    { name: "NIFTY 50", symbol: "^NSEI" },
    { name: "SENSEX", symbol: "^BSESN" },
    { name: "BANK NIFTY", symbol: "^NSEBANK" }
];

export async function GET() {
    try {
        const promises = INDICES.map(async (index) => {
            try {
                const quote: any = await yahooFinance.quote(index.symbol);
                const price = quote.regularMarketPrice;
                const prevClose = quote.regularMarketPreviousClose;

                // Calculate change explicitly if not provided
                let changePct = quote.regularMarketChangePercent;

                if (changePct === undefined && price !== undefined && prevClose !== undefined && prevClose !== 0) {
                    changePct = ((price - prevClose) / prevClose) * 100;
                }

                const sign = (changePct !== undefined && changePct >= 0) ? "+" : "";
                // Handle cases where changePct might still be undefined (though unlikely with valid price/prevClose)
                const changeStr = (changePct !== undefined) ? `${sign}${changePct.toFixed(2)}%` : "0.00%";

                return {
                    name: index.name,
                    value: price || 0,
                    change: changeStr
                };
            } catch (err) {
                console.error(`Failed to fetch ${index.name}:`, err);
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
            source: "Yahoo Finance (Node.js)"
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
