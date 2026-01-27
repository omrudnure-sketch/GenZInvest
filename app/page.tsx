

import Link from "next/link";
import { GraduationCap, Smartphone, Swords } from "lucide-react";
import NewsFeed from "@/components/NewsFeed";
import { fetchLiveNews, generateHoroscope } from "@/lib/news";
import MarketDashboard from "@/components/MarketDashboard";
import FinancialHoroscope from "@/components/FinancialHoroscope";
import ProtectedRoute from "@/components/ProtectedRoute";

import ThreeDLogo from "@/components/ThreeDLogo";

// Force dynamic rendering to ensure fresh news on every request
export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function getData() {
  // Server-side fetch of fresh data from NewsAPI
  const news = await fetchLiveNews();
  const horoscope = generateHoroscope(news);
  return { news, horoscope };
}

export default async function Home() {
  const { news, horoscope } = await getData();

  return (
    <main className="min-h-screen p-4 md:p-8 lg:p-12 relative overflow-hidden">
      <ProtectedRoute>
        {/* Background Gradients */}
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/20 blur-[150px] rounded-full pointer-events-none" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-secondary/20 blur-[150px] rounded-full pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto">
          <header className="mb-12 flex flex-col md:flex-row justify-between items-end gap-4 border-b border-white/10 pb-6">
            <div className="flex items-center gap-6">
              <ThreeDLogo size="w-20 h-20" />
              <div>
                <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-2 font-display">
                  <span className="text-primary">G</span>en<span className="text-secondary">Z</span> <span className="text-white">Invest</span>
                </h1>
                <p className="text-gray-400 max-w-lg">
                  Your daily dose of market alpha, served fresh. No boomer jargon, just gains.
                </p>
              </div>
            </div>
            {/* Refined Buttons with Unified Dark/Neon Aesthetic */}
            <div className="flex flex-wrap gap-4">
              {/* Button 1: Learn Investing */}
              <Link
                href="/learn"
                className="relative group px-6 py-3 rounded-full bg-neutral-900 border border-white/20 text-white font-bold text-lg flex items-center gap-2 overflow-hidden transition-all hover:scale-105 hover:border-lime-400/50 hover:shadow-[0_0_30px_rgba(163,230,53,0.3)] active:scale-95"
              >
                <span className="absolute inset-0 bg-lime-400/10 translate-x-[-100%] active:translate-x-[100%] duration-1000 group-hover:translate-x-[100%] ease-in-out"></span>
                <GraduationCap size={20} className="text-lime-400 group-hover:rotate-12 transition-transform" />
                <span>Learn</span>
              </Link>

              {/* Button 2: Swipe Wisdom */}
              <Link
                href="/flashcards"
                className="relative group px-6 py-3 rounded-full bg-neutral-900 border border-white/20 text-white font-bold text-lg flex items-center gap-2 overflow-hidden transition-all hover:scale-105 hover:border-amber-500/50 hover:shadow-[0_0_30px_rgba(245,158,11,0.3)] active:scale-95"
              >
                <span className="absolute inset-0 bg-amber-500/10 translate-x-[-100%] active:translate-x-[100%] duration-1000 group-hover:translate-x-[100%] ease-in-out"></span>
                <Smartphone size={20} className="text-amber-500 group-hover:rotate-12 transition-transform" />
                <span>Swipe</span>
              </Link>

              {/* Button 3: Brand Wars */}
              <Link
                href="/brand-wars"
                className="relative group px-6 py-3 rounded-full bg-neutral-900 border border-white/20 text-white font-bold text-lg flex items-center gap-2 overflow-hidden transition-all hover:scale-105 hover:border-red-500/50 hover:shadow-[0_0_30px_rgba(239,68,68,0.3)] active:scale-95"
              >
                <span className="absolute inset-0 bg-red-500/10 translate-x-[-100%] active:translate-x-[100%] duration-1000 group-hover:translate-x-[100%] ease-in-out"></span>
                <Swords size={20} className="text-red-500 group-hover:scale-125 transition-transform" />
                <span>Brand Wars</span>
              </Link>
            </div>
          </header>

          <section className="mb-12">
            {/* Market Dashboard - Full Width */}
            <div className="w-full">
              <MarketDashboard />
            </div>
          </section>

          {/* Daily Vibes Section - Middle Banner */}
          <section className="mb-16">
            <FinancialHoroscope data={horoscope} />
          </section>

          <section className="mb-16">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-2 h-8 bg-gradient-to-b from-primary to-secondary rounded-full animate-pulse" />
              <h2 className="text-2xl md:text-3xl font-bold font-display">Live Market News</h2>
              <span className="px-2 py-0.5 rounded text-[10px] bg-red-500/20 text-red-400 border border-red-500/30 animate-pulse">LIVE</span>
            </div>

            <NewsFeed newsItems={news} />
          </section>
        </div>
      </ProtectedRoute>
    </main>
  );
}
