import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Provider from "@/components/SessionProvider";
import AuthButton from "@/components/AuthButton";
import Footer from "@/components/Footer";
import TransitionProvider from "@/components/TransitionProvider";
import ChatBot from "@/components/ChatBot";
import SyncManager from "@/components/SyncManager";
import { Toaster } from "sonner";
import { getServerSession } from "next-auth"; // 1. Import Server Session

const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sahayak X",
  description: "Next-Gen Scheme Discovery",
  manifest: "/manifest.json",
};

// 2. Make RootLayout async
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  // 3. Fetch Session
  const session = await getServerSession(); 

  return (
    <html lang="en">
      <body className={`${jakarta.className} bg-[#FDFBF7]`}>
        <Provider>
          <TransitionProvider>
            {/* Floating Nav */}
            <div className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
              <nav className="pointer-events-auto bg-white/70 backdrop-blur-2xl border border-white/60 shadow-xl shadow-black/5 rounded-full px-2 py-2 flex items-center justify-between gap-6 w-full max-w-4xl transition-all hover:bg-white/90">
                <div className="flex items-center gap-3 pl-4">
                  <div className="w-9 h-9 bg-gradient-to-br from-rose-500 to-orange-500 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-rose-500/30">
                    S
                  </div>
                  <span className="text-xl font-extrabold tracking-tight text-slate-900">
                    Sahayak <span className="text-rose-500">X</span>
                  </span>
                </div>
                <div className="flex items-center gap-2 pr-1">
                  <div className="h-6 w-px bg-slate-200 hidden sm:block"></div>
                  <AuthButton />
                </div>
              </nav>
            </div>

            <div className="min-h-screen flex flex-col">
              <div className="flex-grow">{children}</div>
              <Footer />
            </div>

            {/* 4. CONDITIONAL RENDER: Only show if session exists */}
            {session && <ChatBot />}
            
            <SyncManager />
          </TransitionProvider>
        </Provider>

        <Toaster
          position="top-center"
          richColors
          toastOptions={{
            style: {
              background: "rgba(255, 255, 255, 0.8)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255, 255, 255, 0.5)",
              borderRadius: "1.5rem",
              fontSize: "14px",
              fontWeight: 500,
              boxShadow: "0 10px 40px -10px rgba(0,0,0,0.1)",
            },
          }}
        />
      </body>
    </html>
  );
}