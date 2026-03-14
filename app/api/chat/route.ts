
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    let message = "";
    try {
        const body = await req.json();
        message = body.message;
        const history = body.history;
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            throw new Error("API Key Missing");
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        const chat = model.startChat({
            history: history.map((msg: any) => ({
                role: msg.role === "user" ? "user" : "model",
                parts: [{ text: msg.parts[0].text }],
            })),
            generationConfig: {
                maxOutputTokens: 300,
            },
        });

        const prompt = `
    You are "GenZ Bot", a super-smart, witty, and helpful financial advisor for GenZ.
    Your vibe is: informative but chill, uses emojis, avoids heavy jargon.
    User Question: ${message}
    Answer in short, punchy paragraphs.
    `;

        const result = await chat.sendMessage(prompt);
        const response = await result.response;
        const text = response.text();

        return NextResponse.json({ text });
    } catch (error: any) {
        console.error("Chat API Error:", error.message);

        // FAILOVER SYSTEM: Return local response if AI fails
        const fallback = getFallbackResponse(message || "");
        return NextResponse.json({ text: fallback });
    }
}

// Local Knowledge Base for Offline/Error Mode
function getFallbackResponse(query: string): string {
    const lowerQuery = query.toLowerCase();

    if (lowerQuery.includes("sip")) {
        return "🤖 **Auto-Reply**: SIP (Systematic Investment Plan) is like a gym membership for your money! 🏋️‍♂️ You invest a fixed amount (e.g., ₹500) every month. It averages out market highs/lows (Rupee Cost Averaging) and is the BEST way to start wealth creation. 💸";
    }
    if (lowerQuery.includes("crypto") || lowerQuery.includes("bitcoin")) {
        return "🤖 **Auto-Reply**: Crypto is the Wild West! 🤠 High risk, high reward. It's digital currency on the blockchain. \n\n**Rule #1:** Only invest what you can afford to lose. \n**Rule #2:** Not your keys, not your coins!";
    }
    if (lowerQuery.includes("stock") || lowerQuery.includes("share") || lowerQuery.includes("market")) {
        return "🤖 **Auto-Reply**: Stocks = Ownership. Buying a share means you own a tiny piece of a company (like Tata or Reliance). 🏢 Over the long run, stocks beat inflation, but they are volatile daily. Don't panic if they dip!";
    }
    if (lowerQuery.includes("mutual fund") || lowerQuery.includes("fund")) {
        return "🤖 **Auto-Reply**: Mutual Funds are like a potluck. 🍲 Many investors pool money, and a pro manager picks the best dishes (stocks) for everyone. It's safer and easier than picking individual stocks.";
    }
    if (lowerQuery.includes("fd") || lowerQuery.includes("deposit")) {
        return "🤖 **Auto-Reply**: FDs are safe but boring. 😴 They barely beat inflation (~6-7%). Use them for emergency funds, NOT for growing wealth.";
    }
    if (lowerQuery.includes("hello") || lowerQuery.includes("hi") || lowerQuery.includes("hey")) {
        return "Yo! 👋 I'm **GenZ Bot**. My AI brain is currently region-locked 🌍, but I'm running on **Backup Protocols**. \n\nAsk me about **SIP**, **Stocks**, **Crypto**, or **Mutual Funds** and I'll tell you what's up!";
    }

    return "🤖 **System Message**: My connection to the Google AI Brain is weak right now (Region Lock). \n\nTry asking me specifically about: **SIP**, **Stocks**, **Crypto**, or **Mutual Funds**. I have those answers cached locally! 💾";
}
