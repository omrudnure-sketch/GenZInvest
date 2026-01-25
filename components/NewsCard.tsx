"use client";

import { motion } from "framer-motion";
import { Calendar, Tag, ArrowRight } from "lucide-react";
import Link from "next/link";
import { NewsItem } from "@/lib/data";

interface NewsCardProps {
    news: NewsItem;
}

export default function NewsCard({ news }: NewsCardProps) {
    return (
        <Link href={`/news/${news.id}`}>
            <motion.div
                whileHover={{ y: -5 }}
                className="glass-card rounded-xl overflow-hidden cursor-pointer relative group h-full flex flex-col p-6 min-h-[220px] bg-gradient-to-br from-white/5 to-white/0 border border-white/10 hover:border-primary/50 transition-colors"
            >
                <div className="flex items-center gap-2 mb-4">
                    <span className="px-2 py-1 rounded bg-secondary/20 text-secondary text-[10px] font-bold uppercase tracking-wider border border-secondary/20 flex items-center gap-1">
                        <Tag size={10} /> {news.category}
                    </span>
                    <span className="text-xs text-gray-500 flex items-center gap-1 ml-auto">
                        <Calendar size={10} /> {news.date}
                    </span>
                </div>

                {news.imageUrl && (
                    <div className="relative w-full h-40 mb-4 rounded-lg overflow-hidden border border-white/5">
                        <img
                            src={news.imageUrl}
                            alt={news.title}
                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                            loading="lazy"
                            onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none';
                                (e.target as HTMLImageElement).parentElement!.style.display = 'none';
                            }}
                        />
                    </div>
                )}

                <h3 className="text-xl font-bold mb-3 leading-tight group-hover:text-primary transition-colors line-clamp-3">
                    {news.title}
                </h3>

                <p className="text-sm text-gray-400 line-clamp-3 mb-6 grow">
                    {news.summary}
                </p>

                <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
                    <span className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">
                        {news.source}
                    </span>
                    <span className="text-primary text-xs font-bold flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-[-10px] group-hover:translate-x-0 duration-300">
                        Read Analysis <ArrowRight size={12} />
                    </span>
                </div>
            </motion.div>
        </Link>
    );
}
