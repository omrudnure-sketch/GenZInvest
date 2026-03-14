import Link from "next/link";
import { GraduationCap, Smartphone, Swords } from "lucide-react";
import NewsFeed from "@/components/NewsFeed";
import { fetchLiveNews, generateHoroscope } from "@/lib/news";
import MarketDashboard from "@/components/MarketDashboard";
import FinancialHoroscope from "@/components/FinancialHoroscope";
import ProtectedRoute from "@/components/ProtectedRoute";
import ThreeDLogo from "@/components/ThreeDLogo";
import UserProfile from "@/components/UserProfile";

// Force dynamic rendering to ensure fresh news on every request
export const dynamic = 'force-dynamic';

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
          {/* Sticky Header with Glassmorphism */}
          <header className="sticky top-4 z-50 mb-16 flex flex-col md:flex-row justify-between items-center gap-4 px-6 py-4 glass rounded-3xl mx-2 md:mx-0 shadow-lg shadow-black/20">
            <div className="flex items-center gap-6">
              <ThreeDLogo size="w-16 h-16 md:w-20 md:h-20" />
              <div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter mb-1 font-display drop-shadow-[0_0_15px_rgba(204,255,0,0.4)]">
                  <span className="text-primary">G</span>en<span className="text-secondary">Z</span> <span className="text-foreground">Invest</span>
                </h1>
                <p className="text-foreground/70 text-xs md:text-sm font-medium tracking-wide max-w-sm uppercase opacity-80">
                  Your daily market alpha. No boomer jargon.
                </p>
              </div>
            </div>
            {/* Action Buttons Container */}
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

              <UserProfile />
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

          <section className="mb-20">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-2 h-8 bg-gradient-to-b from-primary to-accent rounded-full shadow-[0_0_10px_rgba(204,255,0,0.5)] animate-pulse" />
              <h2 className="text-3xl md:text-4xl font-bold font-display text-transparent bg-clip-text bg-gradient-to-r from-primary via-white to-accent drop-shadow-md">
                Live Market News
              </h2>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-500/10 text-red-500 border border-red-500/20 shadow-[0_0_10px_rgba(239,68,68,0.3)] animate-pulse">LIVE</span>
            </div>

            <NewsFeed newsItems={news} />
          </section>
        </div>
      </ProtectedRoute>
    </main>
  );
}
