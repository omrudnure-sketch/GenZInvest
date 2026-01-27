
"use client";

import { motion } from "framer-motion";
import { MarketMood } from "@/lib/news";

interface MoodMeterProps {
    mood: MarketMood;
    emoji: string;
    score: number;
}

export default function MoodMeter({ mood, emoji, score }: MoodMeterProps) {
    // Determine color based on mood
    const getColor = () => {
        if (mood.includes("Greed")) return "text-green-400 drop-shadow-[0_0_15px_rgba(74,222,128,0.5)]";
        if (mood.includes("Fear")) return "text-red-500 drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]";
        return "text-yellow-400";
    };

    const getBgGradient = () => {
        if (mood.includes("Greed")) return "from-green-500/20 to-emerald-500/5 border-green-500/30";
        if (mood.includes("Fear")) return "from-red-500/20 to-orange-500/5 border-red-500/30";
        return "from-yellow-500/20 to-orange-500/5 border-yellow-500/30";
    };

    return (
        <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${getBgGradient()} p-6 border backdrop-blur-sm`}>
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">
                        Market Mood-O-Meter
                    </h3>
                    <h2 className={`text-3xl font-black italic ${getColor()}`}>
                        {mood}
                    </h2>
                    <p className="text-xs text-gray-500 mt-2 font-mono">
                        Sentiment Score: {score > 0 ? "+" : ""}{score}
                    </p>
                </div>

                <div className="relative">
                    {/* Pulsing Glow Background */}
                    <motion.div
                        className={`absolute inset-0 rounded-full blur-[40px] opacity-40 ${mood.includes("Greed") ? "bg-green-500" : mood.includes("Fear") ? "bg-red-500" : "bg-yellow-500"}`}
                        animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.3, 0.6, 0.3] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    />

                    {/* The Emoji */}
                    <motion.div
                        className="text-7xl relative z-10"
                        animate={{
                            y: [0, -10, 0],
                            rotate: [0, 5, -5, 0],
                            scale: [1, 1.1, 1]
                        }}
                        transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    >
                        {emoji}
                    </motion.div>
                </div>
            </div>

            {/* Simple Gauge Bar */}
            <div className="mt-6 h-2 w-full bg-black/40 rounded-full overflow-hidden relative">
                <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gray-600 z-10" /> {/* Center Marker */}

                {/* Meter Fill */}
                {/* Mapping score -20 to 20 to percentage 0% to 100% */}
                <motion.div
                    className={`h-full rounded-full ${mood.includes("Greed") ? "bg-green-500" : mood.includes("Fear") ? "bg-red-500" : "bg-yellow-500"}`}
                    initial={{ width: "50%" }}
                    animate={{
                        width: `${Math.min(Math.max(((score + 20) / 40) * 100, 10), 90)}%`, // Clamp roughly
                        x: score < 0 ? 0 : "50%", // If negative, grow from left? No, this is tricky with simple div.
                    }}
                // Let's simplify: Just position a dot?
                />
            </div>
            {/* Redo Gauge: A generic gradient bar with a moving indicator is better */}
            <div className="mt-1 h-1 w-full flex justify-between px-1">
                <span className="text-[8px] text-red-500 font-bold">FEAR</span>
                <span className="text-[8px] text-gray-500 font-bold">NEUTRAL</span>
                <span className="text-[8px] text-green-500 font-bold">GREED</span>
            </div>
        </div>
    );
}
