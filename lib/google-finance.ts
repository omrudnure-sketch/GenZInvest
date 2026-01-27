import * as cheerio from 'cheerio';

const SYMBOL_MAP: Record<string, string> = {
    "^NSEI": "NIFTY_50:INDEXNSE",
    "^BSESN": "SENSEX:INDEXBOM",
    "^NSEBANK": "NIFTY_BANK:INDEXNSE"
};

export async function fetchGoogleFinanceData(symbol: string) {
    const googleSymbol = SYMBOL_MAP[symbol];
    if (!googleSymbol) {
        throw new Error(`Symbol ${symbol} not supported for Google Finance`);
    }

    const url = `https://www.google.com/finance/quote/${googleSymbol}`;

    try {
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch Google Finance: ${response.status}`);
        }

        const html = await response.text();
        const $ = cheerio.load(html);

        // Price Class: .YMlKec.fxKbKc (Commonly used by Google Finance)
        const priceText = $('.YMlKec.fxKbKc').first().text().replace(/,/g, '');
        const price = parseFloat(priceText);

        // Change Percentage Class: .JwB6zf (This is a common badge class, might need refinement)
        // Usually looks like <div class="JwB6zf" ...>+0.51%</div>
        // Better selector might be searching for the percentage text near the price

        // Strategy: Look for the element containing '%' that is inside the main header area
        // Or traverse from price.

        // Let's try finding the element with aria-label="Up by" or "Down by" or just the percentage text
        // The detailed change is often in a class like .Cb5w8d or just following the price.

        // Based on common structure:
        // Price container -> sibling -> change container

        // Fallback: finding first text with % symbol in the header section
        let changeStr = "0.00%";

        // Try to find the specific change percentage badge
        // Google Finance usually puts change in a div with specifics.
        // Let's grab specific elements that look like change stats
        const changeElement = $('div[class*="JwB6zf"]').filter((i, el) => $(el).text().includes('%')).first();
        if (changeElement.length) {
            changeStr = changeElement.text();
        } else {
            // Secondary strategy: Regex on the first 2000 chars of body content if cheerio fails specific selector
            // (Not robust but fallback)
        }

        // Clean up change string (remove brackets if any)
        changeStr = changeStr.replace(/[()]/g, '');

        if (isNaN(price)) {
            throw new Error("Failed to parse price");
        }

        return {
            value: price,
            change: changeStr
        };

    } catch (error) {
        console.error(`Google Finance Scraping Error for ${symbol}:`, error);
        throw error;
    }
}
