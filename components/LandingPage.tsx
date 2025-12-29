"use client";

import { signIn } from "next-auth/react";
import { 
  Mic, ScanLine, Search, MapPin, MessageCircle, 
  LayoutGrid, Database, ArrowRight, ShieldCheck 
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#FDFBF7] relative overflow-hidden font-sans selection:bg-rose-100">
      
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-40 pb-20">
        
        {/* 1. HERO SECTION */}
        <div className="text-center mb-16 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 border border-rose-100 text-rose-600 text-xs font-bold uppercase tracking-widest mb-4">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
            </span>
            Live for 1.4 Billion Indians
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-slate-900 leading-[0.9]">
            Sahayak<span className="text-rose-500">X</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-500 font-medium max-w-2xl mx-auto leading-relaxed">
            The all-in-one AI platform to discover schemes, track benefits, and connect with your government.
          </p>

          {/* Login Button */}
          <div className="pt-4">
            <button
              onClick={() => signIn("google")}
              className="group relative inline-flex items-center gap-3 bg-slate-900 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/20 hover:scale-[1.02] active:scale-[0.98]"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Continue with Google
              <ArrowRight className="w-4 h-4 opacity-50 group-hover:translate-x-1 transition-transform" />
            </button>
            <p className="mt-4 text-xs text-slate-400 font-medium">
              Secure access via Google Cloud Identity
            </p>
          </div>
        </div>

        {/* 2. FEATURES GRID (The Update) */}
        <div className="grid md:grid-cols-3 gap-6">
          
          {/* Card 1: Vaani */}
          <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:scale-[1.01] transition-all">
             <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center text-orange-600 mb-6">
                <Mic size={24} />
             </div>
             <h3 className="text-xl font-bold text-slate-900 mb-2">Project Vaani</h3>
             <p className="text-sm text-slate-500 font-medium leading-relaxed">
               Speak in Hinglish. Our Llama-3 engine understands 12+ Indian dialects instantly to fill forms for you.
             </p>
          </div>

          {/* Card 2: Netra */}
          <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:scale-[1.01] transition-all">
             <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600 mb-6">
                <ScanLine size={24} />
             </div>
             <h3 className="text-xl font-bold text-slate-900 mb-2">Project Netra</h3>
             <p className="text-sm text-slate-500 font-medium leading-relaxed">
               Upload blurry IDs. We extract data with 99% accuracy using Computer Vision to verify eligibility.
             </p>
          </div>

          {/* Card 3: Vector Search */}
          <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:scale-[1.01] transition-all">
             <div className="w-12 h-12 bg-rose-100 rounded-2xl flex items-center justify-center text-rose-600 mb-6">
                <Search size={24} />
             </div>
             <h3 className="text-xl font-bold text-slate-900 mb-2">Vector Engine</h3>
             <p className="text-sm text-slate-500 font-medium leading-relaxed">
               Semantic search finds schemes based on 'meaning', not just keywords. Try "I need money for crops".
             </p>
          </div>

          {/* Card 4: Kendra (New) */}
          <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:scale-[1.01] transition-all">
             <div className="w-12 h-12 bg-cyan-100 rounded-2xl flex items-center justify-center text-cyan-600 mb-6">
                <MapPin size={24} />
             </div>
             <h3 className="text-xl font-bold text-slate-900 mb-2">Sahayak Kendra</h3>
             <p className="text-sm text-slate-500 font-medium leading-relaxed">
               Locate nearby Common Service Centers (CSCs) and government offices with real-time navigation.
             </p>
          </div>

          {/* Card 5: Jan-Manch (New) */}
          <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:scale-[1.01] transition-all">
             <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center text-purple-600 mb-6">
                <MessageCircle size={24} />
             </div>
             <h3 className="text-xl font-bold text-slate-900 mb-2">Jan-Manch</h3>
             <p className="text-sm text-slate-500 font-medium leading-relaxed">
               A community forum to discuss schemes, raise grievances, and get help from fellow citizens.
             </p>
          </div>

          {/* Card 6: Vault (New) */}
          <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:scale-[1.01] transition-all">
             <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-600 mb-6">
                <Database size={24} />
             </div>
             <h3 className="text-xl font-bold text-slate-900 mb-2">Doc Vault</h3>
             <p className="text-sm text-slate-500 font-medium leading-relaxed">
               Secure offline storage for your verified documents. Access your certificates without internet.
             </p>
          </div>

        </div>

        {/* Footer Trust Badge */}
        <div className="mt-16 text-center">
            <div className="inline-flex items-center gap-2 text-slate-400 font-bold text-xs uppercase tracking-widest bg-white px-4 py-2 rounded-full border border-slate-100 shadow-sm">
                <ShieldCheck size={14} />
                Govt. of India Standard Encryption
            </div>
        </div>

      </div>
    </div>
  );
}