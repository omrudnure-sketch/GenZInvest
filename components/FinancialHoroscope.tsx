
"use client";

import { motion } from "framer-motion";
import { HoroscopeData } from "@/lib/news";
import { Sparkles, Moon, Sun, CloudRain, Zap, TrendingUp, Info } from "lucide-react";
import React from "react";

export default function FinancialHoroscope({ data }: { data: HoroscopeData }) {
    // Determine gradient based on mood/color
    const getGradient = () => {
        if (data.color.includes("green") || data.color.includes("emerald")) return "from-emerald-900/40 via-black/40 to-emerald-900/10 border-emerald-500/30";
        if (data.color.includes("red")) return "from-red-900/40 via-black/40 to-red-900/10 border-red-500/30";
        if (data.color.includes("orange")) return "from-orange-900/40 via-black/40 to-orange-900/10 border-orange-500/30";
        return "from-indigo-900/40 via-black/40 to-indigo-900/10 border-indigo-500/30";
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className={`relative w-full overflow-hidden rounded-[2rem] border bg-gradient-to-r ${getGradient()} backdrop-blur-xl shadow-2xl p-8 group hover:shadow-[0_0_50px_rgba(255,255,255,0.05)] transition-all duration-500`}
        >
            {/* Background Texture/Mesh */}
            <div className="absolute inset-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay pointer-events-none" />
            <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-white/5 to-transparent pointer-events-none" />

            <div className="relative z-10 flex flex-col lg:flex-row items-center gap-8 lg:gap-12">

                {/* Left: Vibe & Title */}
                <div className="flex-shrink-0 text-center lg:text-left min-w-[200px]">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] uppercase tracking-widest font-bold text-gray-300 mb-3">
                        <Sparkles size={12} className="text-primary" />
                        Daily Vibe
                    </span>
                    <h2 className={`text-3xl lg:text-4xl font-black italic tracking-tighter ${data.color} drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)] mb-2`}>
                        {data.title}
                    </h2>
                    <div className="inline-flex items-center gap-2 text-sm text-gray-400 font-medium bg-black/30 px-3 py-1.5 rounded-lg border border-white/5">
                        {data.title.includes("Bull") || data.title.includes("Phoenix") ? (
                            <Sun className="text-yellow-400" size={16} />
                        ) : data.title.includes("Fear") || data.title.includes("Eclipse") ? (
                            <CloudRain className="text-blue-400" size={16} />
                        ) : (
                            <Moon className="text-gray-400" size={16} />
                        )}
                        <span>{data.vibe}</span>
                    </div>
                </div>

                {/* Middle: Reading (Ticker Style or Clean Text) */}
                <div className="flex-grow border-t lg:border-t-0 lg:border-l border-white/10 pt-6 lg:pt-0 lg:pl-8">
                    <p className="text-lg lg:text-xl text-gray-200 font-medium leading-relaxed font-display">
                        "{data.reading}"
                    </p>
                </div>

                {/* Right: Stats pills */}
                <div className="flex flex-col sm:flex-row gap-4 flex-shrink-0 w-full lg:w-auto">
                    <div className="flex-1 bg-black/40 p-4 rounded-2xl border border-white/5 backdrop-blur-md min-w-[140px] group-hover:bg-white/5 transition-colors">
                        <p className="text-[10px] uppercase text-gray-500 font-bold mb-1 flex items-center gap-1">
                            <Zap size={10} className="text-yellow-400" /> Cosmic Event
                        </p>
                        <p className="text-sm text-white font-bold truncate">{data.cosmicEvent}</p>
                    </div>
                    <div className="flex-1 bg-black/40 p-4 rounded-2xl border border-white/5 backdrop-blur-md min-w-[140px] group-hover:bg-white/5 transition-colors">
                        <p className="text-[10px] uppercase text-gray-500 font-bold mb-1 flex items-center gap-1">
                            <TrendingUp size={10} className="text-emerald-400" /> Lucky Asset
                        </p>
                        <p className="text-sm text-white font-bold truncate">{data.luckyAsset}</p>
                    </div>
                </div>
            </div>

            {/* Disclaimer Footer (Subtle) */}
            <div className="absolute bottom-2 right-4 opacity-30 hover:opacity-100 transition-opacity">
                <Info size={12} className="text-white cursor-help" />
            </div>
        </motion.div>
    );
}
