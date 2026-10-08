import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/providers/Providers";
import Chatbot from "@/components/Chatbot";
import AuthButton from "@/components/AuthButton";

export const metadata: Metadata = {
  title: "Seva-Sadhana | Technology as Seva",
  description: "A dignity-first community service and reflection platform where technology serves as an enabler.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-bg text-ink flex flex-col font-sans">
        <Providers>
          <header className="w-full bg-[#FDFBF7] border-b border-[#E5DDD0] sticky top-0 z-50">
            <nav className="flex items-center justify-between px-8 py-4 max-w-screen-2xl mx-auto">
              <a href="/" className="flex items-center gap-3 group">
                <svg className="w-10 h-10 text-[#D35D22]" viewBox="0 0 24 24" fill="currentColor"><path d="M12 22C12 22 12 12 12 12M12 12C12 12 5 12 5 17C5 20.3 8.1 22 12 22ZM12 12C12 12 19 12 19 17C19 20.3 15.9 22 12 22ZM12 12C12 12 12 2 12 2M12 2C12 2 5 2 5 7C5 10.3 8.1 12 12 12ZM12 2C12 2 19 2 19 7C19 10.3 15.9 12 12 12Z"/></svg>
                <span className="text-3xl font-serif font-bold text-[#3E342B] tracking-tight group-hover:text-[#D35D22] transition-colors">Seva-Sadhana</span>
                <span className="text-sm px-3 py-1 rounded-full bg-[#FCECD9] text-[#D35D22] border border-[#F2DEB4] font-bold uppercase tracking-wider">PWA</span>
              </a>
              
              <div className="hidden md:flex gap-8 text-lg font-bold items-center text-[#4A4035]">
                <a href="/" className="text-[#D35D22] border-b-2 border-[#D35D22] pb-1">Home</a>
                <a href="/radar" className="hover:text-[#D35D22] transition-colors pb-1">Radar</a>
                <a href="/report" className="hover:text-[#D35D22] transition-colors pb-1">Spot a Need</a>
                <a href="/barter" className="hover:text-[#D35D22] transition-colors pb-1">Barter Match</a>
                <a href="/sankalp" className="hover:text-[#D35D22] transition-colors pb-1">Sankalp</a>
              </div>

              <div className="flex items-center gap-6">
                <button className="text-[#4A4035] hover:text-[#D35D22] transition-colors">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                </button>
                <AuthButton />
              </div>
            </nav>
          </header>
          <main className="flex-1">
            {children}
          </main>
          <footer className="bg-[#F5F0E6] py-6 px-8 border-t border-[#E5DDD0] flex items-center justify-center gap-3 mt-auto">
            <svg className="w-6 h-6 text-[#8B7C6E]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
            <p className="text-base text-[#6B5A4B] font-sans">
              <strong className="text-lg">Dignity Rule:</strong> Seva-Sadhana does not track public leaderboards or point counts. Every action is a private mirror for personal reflection.
            </p>
          </footer>
          <Chatbot />
        </Providers>
      </body>
    </html>
  );
}
