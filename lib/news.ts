import { NewsItem } from "./data";

const API_KEY = "d22434d07f1b4800868ef7b61dbffaf6";

export async function fetchLiveNews(): Promise<NewsItem[]> {
    let articles: any[] = [];

    try {
        // STRATEGY: High Volume + Historical Context

        // 1. Fetch Top Business Headlines (approx 30 results)
        // Explicitly asking for 100 items to maximize reach
        const headlinesPromise = fetch(
            `https://newsapi.org/v2/top-headlines?country=in&category=business&pageSize=100&apiKey=${API_KEY}`,
            { cache: 'no-store' }
        );

        // 2. Fetch Broader Finance News 
        // Using relaxed date sorting to ensure we get volume
        const everythingPromise = fetch(
            `https://newsapi.org/v2/everything?q="indian stock market" OR "nifty" OR "sensex" OR "mutual funds"&language=en&sortBy=publishedAt&pageSize=100&apiKey=${API_KEY}`,
            { cache: 'no-store' }
        );

        const [headlinesRes, everythingRes] = await Promise.all([headlinesPromise, everythingPromise]);

        const headlinesData = await headlinesRes.json();
        const everythingData = await everythingRes.json();

        const headlines = headlinesData.articles || [];
        const bulkNews = everythingData.articles || [];

        // Merge arrays (Headlines first for priority)
        articles = [...headlines, ...bulkNews];
        console.log(`NewsAPI Fetched: ${headlines.length} headlines + ${bulkNews.length} bulk = ${articles.length} total`);

    } catch (e) {
        console.error("NewsAPI Fetch Error", e);
    }

    // 3. Process & Filter
    // Date Filter: Relaxed to last 7 days to ensure volume
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000));

    const uniqueTitles = new Set();
    const reliableImages = [
        "https://images.unsplash.com/photo-1611974765270-ca12586343bb?w=800&q=80",
        "https://images.unsplash.com/photo-1601597111158-2fceff292cdc?w=800&q=80",
        "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80",
        "https://images.unsplash.com/photo-1610375461246-83df859d849d?w=800&q=80",
        "https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=800&q=80",
        "https://images.unsplash.com/photo-1559136555-930d72f18613?w=800&q=80",
        "https://images.unsplash.com/photo-1582234372722-50d7ccc30ebd?w=800&q=80",
        "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=800&q=80",
        "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80"
    ];

    let liveNews = articles
        .filter((article: any) => {
            if (!article.title || article.title === "[Removed]") return false;

            const pubDate = new Date(article.publishedAt);
            if (pubDate < sevenDaysAgo) return false;

            // Deduplication
            const cleanTitle = (article.title || "").split(" - ")[0].trim().toLowerCase();
            if (uniqueTitles.has(cleanTitle)) return false;

            uniqueTitles.add(cleanTitle);
            return true;
        })
        .map((article: any, index: number) => {
            const source = article.source?.name || "Market News";
            const title = article.title || "Market Update";
            const description = article.description || title;
            const cleanTitle = title.split(" - ")[0];

            // Use real API image if available, else cycle through reliable fallbacks
            const fallbackImg = reliableImages[index % reliableImages.length];
            const hasValidApiImage = article.urlToImage && article.urlToImage.startsWith("http");

            return {
                id: index + 200, // IDs to avoid key collisions
                title: cleanTitle,
                summary: getSimpleSummary(cleanTitle, source),
                source: source,
                date: new Date(article.publishedAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
                imageUrl: hasValidApiImage ? article.urlToImage : fallbackImg,
                category: getCategory(cleanTitle, description),
                content: getSimpleContent(cleanTitle, description, source),
                impact: getSimpleImpact(cleanTitle, description),
                url: article.url || "https://economictimes.indiatimes.com/"
            };
        });

    // 4. FALLBACK / FILLER
    // If we have fewer than 10 items (e.g. API Blocked on Vercel), use Backup Data to ensure page doesn't look empty
    if (liveNews.length < 10) {
        console.log("API returned very few items. Merging Backup Data.");
        const backup = getBackupNews();
        liveNews = [...liveNews, ...backup];
    }

    // Return all items
    return liveNews;
}


// Backup Generator - High Quality Mock Data for Fallback
function getBackupNews(): NewsItem[] {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const dayBefore = new Date(today);
    dayBefore.setDate(today.getDate() - 2);

    const d1 = today.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }); // Today
    const d2 = yesterday.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }); // Yesterday
    const d3 = dayBefore.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }); // 2 Days Ago

    // We provide 10 robust items as a baseline safety net with MIXED DATES
    return [
        {
            id: 901,
            title: "Sensex touches new all-time high amid global rally",
            summary: "Indian markets are unstoppable today. Read why this rally matters for your mutual funds.",
            source: "Market Bureau",
            date: d1,
            imageUrl: "https://images.unsplash.com/photo-1611974765270-ca12586343bb?w=800&q=80",
            category: "Stocks",
            content: getSimpleContent("Sensex High", "Indices hit record levels driven by banking and IT stocks.", "Market Bureau"),
            impact: "Great for Index Fund investors.",
            url: "https://www.moneycontrol.com/markets/indian-indices/"
        },
        {
            id: 902,
            title: "RBI hints at pause in interest rates: What it means for loans",
            summary: "Good news for borrowers. EMI burden might not increase further.",
            source: "Banking News",
            date: d2,
            imageUrl: "https://images.unsplash.com/photo-1601597111158-2fceff292cdc?w=800&q=80",
            category: "Finance",
            content: getSimpleContent("RBI Rates", "Central bank keeps repo rate unchanged.", "Banking News"),
            impact: "Banking stocks will stabilize.",
            url: "https://rbi.org.in/"
        },
        {
            id: 903, title: "Tech Giants report strong Q3, IT sector booms",
            summary: "IT stocks are back in action. Is it time to buy Tech Funds?",
            source: "Tech Daily", date: d3, imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80",
            category: "Tech", content: "...", impact: "Positive for NIFTY IT.", url: "https://economictimes.indiatimes.com/tech"
        },
        {
            id: 904, title: "Gold prices drop slightly, perfect buying opportunity?",
            summary: "Smart investors buy dip. Should you add gold to your portfolio?",
            source: "Commodity Watch", date: d2, imageUrl: "https://images.unsplash.com/photo-1610375461246-83df859d849d?w=800&q=80",
            category: "Gold", content: "...", impact: "Good entry point for Gold ETFs.", url: "https://www.moneycontrol.com/news/gold/"
        },
        {
            id: 905, title: "Startups see fresh funding wave in Bangalore",
            summary: "VC activity picks up in Q3. AI startups lead the charge.",
            source: "Startup Insider", date: d1, imageUrl: "https://images.unsplash.com/photo-1559136555-930d72f18613?w=800&q=80",
            category: "Startups", content: "...", impact: "Positive for unlisted space.", url: "https://inc42.com/"
        },
        {
            id: 906, title: "Crypto markets see volatility ahead of ETF decision",
            summary: "Bitcoin hovers around support levels.",
            source: "Crypto Wire", date: d3, imageUrl: "https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=800&q=80",
            category: "Crypto", content: "...", impact: "High risk zone.", url: "https://coinmarketcap.com/"
        },
        {
            id: 907, title: "Oil prices remain stable near $80",
            summary: "Global supply chain issues ease.",
            source: "Energy News", date: d2, imageUrl: "https://images.unsplash.com/photo-1582234372722-50d7ccc30ebd?w=800&q=80",
            category: "Economy", content: "...", impact: "Neutral for Indian Economy.", url: "https://www.moneycontrol.com/news/business/economy/"
        },
        {
            id: 908, title: "EV Sales hit record high in India this month",
            summary: "Tata and Mahindra see massive jump in electric car sales.",
            source: "Auto Weekly", date: d2, imageUrl: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=800&q=80",
            category: "Auto", content: "...", impact: "Buy Auto stocks.", url: "https://www.autocarindia.com/"
        },
        {
            id: 909, title: "Fed Chair Jerome Powell hints at soft landing",
            summary: "US Economy is stronger than expected.",
            source: "Wall St Journal", date: d3, imageUrl: "https://images.unsplash.com/photo-1611974765270-ca12586343bb?w=800&q=80",
            category: "Global", content: "...", impact: "FII Inflow expected.", url: "https://www.wsj.com/"
        },
        {
            id: 910, title: "Real Estate in Tier-2 cities outperforming metros",
            summary: "Invest in Pune, Ahmedabad, and Kochi now.",
            source: "PropIndex", date: d2, imageUrl: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80",
            category: "Real Estate", content: "...", impact: "REITs look good.", url: "https://www.magicbricks.com/"
        }
    ];
}

// ------------------------------------------------------------------
// HELPERS
// ------------------------------------------------------------------

function getSimpleSummary(title: string, source: string): string {
    return `Latest update from ${source}. Read this to know how it changes your money plans today.`;
}

function getSimpleContent(title: string, desc: string, source: string): string {
    return `Here is the simple breakdown of the news:\n\n1. What is the news?\n"${desc || title}"\n\nThis was just reported by ${source}. It is a fresh update from the market.\n\n2. Why it matters?\nAny change in big companies or government rules affects our mutual funds. As a young investor, you should know this.\n\n3. What to do?\nCheck the 'Market Impact' section below. Usually, for long-term SIP investors, daily news is just noise. Don't stop your SIPs.`;
}

function getSimpleImpact(title: string, desc: string): string {
    const t = (title + " " + desc).toLowerCase();
    if (t.includes("sensex") || t.includes("nifty") || t.includes("market")) return "Direct impact on your Index Funds.";
    if (t.includes("bank") || t.includes("rbi") || t.includes("loan")) return "Banking stocks and debt funds will react.";
    if (t.includes("gold")) return "Gold prices might go up.";
    return "General market news. Keep calm and continue your SIPs.";
}

function getCategory(title: string, desc: string): string {
    const t = (title + " " + desc).toLowerCase();
    if (t.includes("stock") || t.includes("share") || t.includes("market")) return "Stocks";
    if (t.includes("bank") || t.includes("finance") || t.includes("money")) return "Finance";
    if (t.includes("tech") || t.includes("startup") || t.includes("ai")) return "Tech";
    if (t.includes("india") || t.includes("govt")) return "India";
    return "Business";
}

// ------------------------------------------------------------------
// MOOD & HOROSCOPE
// ------------------------------------------------------------------
export type MarketMood = "Extreme Fear" | "Fear" | "Neutral" | "Greed" | "Extreme Greed";

export function calculateMarketMood(articles: NewsItem[]): { mood: MarketMood; score: number; emoji: string } {
    let score = 0;
    const POSITIVE_KEYWORDS = ["rise", "jump", "high", "gain", "boom", "rally", "green", "profit", "bull", "up"];
    const NEGATIVE_KEYWORDS = ["drop", "fall", "crash", "loss", "low", "bear", "red", "down", "crisis"];

    articles.forEach(article => {
        const text = (article.title + " " + article.summary).toLowerCase();
        POSITIVE_KEYWORDS.forEach(word => { if (text.includes(word)) score += 1; });
        NEGATIVE_KEYWORDS.forEach(word => { if (text.includes(word)) score -= 1; });
    });

    let mood: MarketMood = "Neutral";
    let emoji = "😐";
    if (score >= 10) { mood = "Extreme Greed"; emoji = "🚀"; }
    else if (score >= 3) { mood = "Greed"; emoji = "🤑"; }
    else if (score <= -10) { mood = "Extreme Fear"; emoji = "😱"; }
    else if (score <= -3) { mood = "Fear"; emoji = "😨"; }

    return { mood, score, emoji };
}

export type HoroscopeData = { title: string; reading: string; vibe: string; luckyAsset: string; color: string; cosmicEvent: string; };

export function generateHoroscope(articles: NewsItem[]): HoroscopeData {
    const { mood } = calculateMarketMood(articles);
    const topTopic = articles[0]?.category || "Markets";

    // Simple mapped return based on mood
    if (mood === "Extreme Greed") return { title: "Supernova Bull", reading: `Euphoria in ${topTopic}! Ride the wave.`, vibe: "Euphoric 🚀", luckyAsset: "Small Caps", color: "text-green-400", cosmicEvent: "Jupiter Ascending" };
    if (mood === "Greed") return { title: "Rising Phoenix", reading: `Growth in ${topTopic} detected.`, vibe: "Optimistic ✨", luckyAsset: "Blue Chips", color: "text-emerald-400", cosmicEvent: "Solar Flare" };
    if (mood === "Fear") return { title: "Retrograde Shadow", reading: `Caution in ${topTopic}.`, vibe: "Cautious 🛡️", luckyAsset: "Gold", color: "text-orange-400", cosmicEvent: "Mercury Retrograde" };
    if (mood === "Extreme Fear") return { title: "The Great Eclipse", reading: `Panic in ${topTopic}. Buy the dip!`, vibe: "Diamond Hands 💎", luckyAsset: "Index Funds", color: "text-red-500", cosmicEvent: "Total Eclipse" };

    return { title: "The Stagnant Void", reading: `Mixed signals in ${topTopic}. Stay patient.`, vibe: "Meditative 🧘", luckyAsset: "Cash", color: "text-gray-400", cosmicEvent: "Moon in Stasis" };
}
