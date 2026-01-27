
"use client";

import { useEffect, useState } from "react";
import { TrendingUp, RefreshCw, Activity } from "lucide-react";
import { motion } from "framer-motion";

interface MarketIndex {
    name: string;
    value: number | string;
    change: string;
}

export default function MarketDashboard() {
    const [indices, setIndices] = useState<MarketIndex[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchMarketData = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/market");
            const data = await res.json();
            if (data.indices) {
                setIndices(data.indices);
            }
        } catch (error) {
            console.error("Failed to fetch market data", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMarketData();
        // Refresh every 60 seconds
        const interval = setInterval(fetchMarketData, 60000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="w-full mb-8">
            <div className="flex items-center justify-between mb-4 px-2">
                <div className="flex items-center gap-2">
                    <Activity className="text-primary animate-pulse" size={20} />
                    <h2 className="text-xl font-bold font-display uppercase tracking-wider text-white">
                        Live Market
                    </h2>
                </div>
                <button
                    onClick={fetchMarketData}
                    disabled={loading}
                    className="p-2 hover:bg-white/10 rounded-full transition-colors disabled:opacity-50"
                >
                    <RefreshCw size={16} className={loading ? "animate-spin text-primary" : "text-gray-400"} />
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {loading && indices.length === 0 ? (
                    // Skeleton Loader
                    [1, 2, 3].map((i) => (
                        <div key={i} className="h-24 rounded-xl bg-white/5 animate-pulse border border-white/5" />
                    ))
                ) : (
                    indices.map((item, idx) => (
                        <motion.div
                            key={item.name}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="bg-surface border border-white/10 p-5 rounded-xl hover:bg-white/5 transition-all group relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                                <TrendingUp size={48} />
                            </div>

                            <h3 className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">
                                {item.name}
                            </h3>
                            <div className="flex items-end gap-3">
                                <span className="text-2xl font-black font-mono text-white">
                                    {typeof item.value === 'number' ? item.value.toLocaleString('en-IN') : item.value}
                                </span>
                                <span className={`text-sm font-bold mb-1 ${item.change.includes('-') ? 'text-red-400' : 'text-green-400'}`}>
                                    {item.change}
                                </span>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>
        </div>
    );
}
