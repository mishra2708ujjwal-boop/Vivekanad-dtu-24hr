"use client";

import Link from "next/link";
import { Compass, Camera, HeartHandshake, Eye, Users, Heart, BookOpen, Quote } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#3E342B] font-serif overflow-x-hidden">
      
      {/* Hero Section */}
      <section className="relative h-[80vh] min-h-[600px] w-full flex flex-col justify-center px-8 md:px-16 overflow-hidden">
        {/* Background Image Setup */}
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center"
          style={{ 
            backgroundImage: "url('https://t3.ftcdn.net/jpg/18/55/99/88/360_F_1855998825_yuCniDuHihELAZT4jVHfDcD6ss48MaRh.jpg')",
            opacity: 0.8
          }}
        />
        {/* Gradient Overlay to ensure text readability like the image */}
        <div className="absolute inset-0 z-0 bg-gradient-to-r from-[#FDFBF7] via-[#FDFBF7]/90 to-transparent" />
        <div className="absolute inset-0 z-0 bg-gradient-to-t from-[#FDFBF7] via-transparent to-transparent" />

        <div className="relative z-10 max-w-4xl mt-12">
          <p className="text-lg font-sans font-bold text-[#C75A22] tracking-[0.2em] uppercase mb-4">
            Service • Connection • Growth
          </p>
          
          <h1 className="text-7xl md:text-[6.5rem] font-bold leading-[1.1] mb-8 text-[#2A231C]">
            Seva begins where <br/>
            <span className="text-[#D35D22]">awareness</span> meets <span className="text-[#2A231C]">action.</span>
          </h1>

          <div className="mb-8 space-y-2">
            <p className="text-4xl font-bold italic text-[#2A231C]">
              "They alone live who live for others."
            </p>
            <p className="text-[#4A4035] text-2xl">— Swami Vivekananda</p>
          </div>

          <p className="text-2xl text-[#4A4035] max-w-2xl mb-12 leading-relaxed font-medium">
            Discover where you can serve, offer what you know, and turn everyday moments into meaningful action.
          </p>

          <div className="flex flex-wrap gap-6 font-sans font-semibold">
            <Link 
              href="/radar" 
              className="px-10 py-5 text-xl bg-[#D35D22] text-white rounded-full flex items-center gap-3 hover:bg-[#B34D18] transition-colors shadow-lg"
            >
              <Compass className="w-6 h-6" />
              Find a Seva Opportunity <span className="ml-1 text-2xl">→</span>
            </Link>
            <Link 
              href="/report" 
              className="px-10 py-5 text-xl bg-white text-[#5C4D3C] border-2 border-[#E8D9C8] rounded-full flex items-center gap-3 hover:bg-[#F5EFE6] transition-colors shadow-sm"
            >
              <Camera className="w-6 h-6 text-[#8A3A19]" />
              Spot Someone in Need <span className="ml-1 text-2xl">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Sankalp Overlapping Bar */}
      <div className="relative z-20 px-4 md:px-16 -mt-10">
        <div className="max-w-6xl mx-auto bg-gradient-to-r from-[#FFF9EE] to-[#FFEED4] border border-[#F2DEB4] rounded-3xl p-8 shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-8">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-sm text-[#D35D22]">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22C12 22 12 12 12 12M12 12C12 12 5 12 5 17C5 20.3 8.1 22 12 22ZM12 12C12 12 19 12 19 17C19 20.3 15.9 22 12 22ZM12 12C12 12 12 2 12 2M12 2C12 2 5 2 5 7C5 10.3 8.1 12 12 12ZM12 2C12 2 19 2 19 7C19 10.3 15.9 12 12 12Z"/></svg>
            </div>
            <div>
              <h4 className="text-base font-sans font-bold text-[#A87B51] uppercase tracking-widest mb-1">Today's Sankalp</h4>
              <div className="flex items-baseline gap-2">
                <h2 className="text-4xl font-bold text-[#3E342B]">Dhairya — Patience</h2>
              </div>
              <p className="text-[#6B5A4B] text-lg mt-2 italic">
                "Let this quality guide every service moment and interaction today."
              </p>
            </div>
          </div>
          <button className="px-8 py-4 bg-white border border-[#F2DEB4] text-[#8C6239] font-sans font-bold text-lg rounded-full flex items-center gap-3 hover:bg-[#FFFDF9] transition-colors shadow-sm whitespace-nowrap">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
            Change
          </button>
        </div>
      </div>

      {/* Main Action Cards */}
      <section className="px-4 md:px-16 py-16 max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Seva Radar */}
          <Link href="/radar" className="bg-[#FDFAEB] border border-[#F3EAC2] rounded-3xl p-10 hover:shadow-xl transition-all group relative overflow-hidden">
            <div className="absolute top-6 right-6 px-4 py-1.5 bg-white border border-[#E5DBAC] rounded-full flex items-center gap-2 shadow-sm">
              <span className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-sm font-sans font-bold text-emerald-800 uppercase tracking-wider">Live</span>
            </div>
            <div className="w-20 h-20 bg-white border border-[#F3EAC2] rounded-full flex items-center justify-center mb-8 text-[#9A7D3C] shadow-sm">
              <Compass className="w-10 h-10" />
            </div>
            <h3 className="text-4xl font-bold text-[#3E342B] mb-4">Seva Radar</h3>
            <p className="text-xl text-[#6B5A4B] leading-relaxed">
              Discover opportunities around you.<br/>Find where your contribution matters.
            </p>
            <div className="mt-10 w-16 h-16 bg-[#E1823C] rounded-full flex items-center justify-center text-white group-hover:scale-110 transition-transform shadow-md ml-auto">
              <span className="text-2xl">→</span>
            </div>
          </Link>

          {/* Barter Seva */}
          <Link href="/barter" className="bg-[#F0F8F4] border border-[#D5E9DE] rounded-3xl p-10 hover:shadow-xl transition-all group">
            <div className="w-20 h-20 bg-white border border-[#D5E9DE] rounded-full flex items-center justify-center mb-8 text-[#4B8C6C] shadow-sm">
              <HeartHandshake className="w-10 h-10" />
            </div>
            <h3 className="text-4xl font-bold text-[#3E342B] mb-4">Barter Seva</h3>
            <p className="text-xl text-[#6B5A4B] leading-relaxed">
              Offer your skills, get what you need.<br/>Skill exchange for a stronger community.
            </p>
            <div className="mt-10 w-16 h-16 bg-[#1B8954] rounded-full flex items-center justify-center text-white group-hover:scale-110 transition-transform shadow-md ml-auto">
              <span className="text-2xl">→</span>
            </div>
          </Link>

          {/* Spot a Need */}
          <Link href="/report" className="bg-[#FFF0F2] border border-[#FAD3D9] rounded-3xl p-10 hover:shadow-xl transition-all group">
            <div className="w-20 h-20 bg-white border border-[#FAD3D9] rounded-full flex items-center justify-center mb-8 text-[#D0455B] shadow-sm">
              <Camera className="w-10 h-10 fill-current" />
            </div>
            <h3 className="text-4xl font-bold text-[#3E342B] mb-4">Spot a Need</h3>
            <p className="text-xl text-[#6B5A4B] leading-relaxed">
              Click a photo and report a genuine need.<br/>Help bring it to the right people.
            </p>
            <div className="mt-10 w-16 h-16 bg-[#D72344] rounded-full flex items-center justify-center text-white group-hover:scale-110 transition-transform shadow-md ml-auto">
              <span className="text-2xl">→</span>
            </div>
          </Link>
        </div>
      </section>

      {/* How It Works (Timeline) */}
      <section className="px-4 md:px-16 pb-16 max-w-[1400px] mx-auto">
        <h2 className="text-5xl font-bold text-center text-[#2A231C] mb-16">How Seva-Sadhana Works</h2>
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-0">
          
          <div className="flex items-center gap-6 flex-1">
            <div className="w-20 h-20 bg-[#F6E9D5] rounded-full flex items-center justify-center text-[#956127]">
              <Eye className="w-10 h-10" />
            </div>
            <div>
              <p className="text-base font-sans font-bold text-[#A87B51] mb-1">01</p>
              <h4 className="text-3xl font-bold text-[#3E342B] leading-tight">Notice</h4>
              <p className="text-lg text-[#6B5A4B] leading-snug max-w-[180px] mt-2">See a genuine need around you.</p>
            </div>
          </div>
          
          <div className="text-[#D35D22] text-3xl hidden md:block">→</div>

          <div className="flex items-center gap-6 flex-1 justify-center">
            <div className="w-20 h-20 bg-[#F6E9D5] rounded-full flex items-center justify-center text-[#956127]">
              <Users className="w-10 h-10" />
            </div>
            <div>
              <p className="text-base font-sans font-bold text-[#A87B51] mb-1">02</p>
              <h4 className="text-3xl font-bold text-[#3E342B] leading-tight">Connect</h4>
              <p className="text-lg text-[#6B5A4B] leading-snug max-w-[180px] mt-2">Find the right person or skill.</p>
            </div>
          </div>

          <div className="text-[#D35D22] text-3xl hidden md:block">→</div>

          <div className="flex items-center gap-6 flex-1 justify-center">
            <div className="w-20 h-20 bg-[#F6E9D5] rounded-full flex items-center justify-center text-[#956127]">
              <Heart className="w-10 h-10" />
            </div>
            <div>
              <p className="text-base font-sans font-bold text-[#A87B51] mb-1">03</p>
              <h4 className="text-3xl font-bold text-[#3E342B] leading-tight">Serve</h4>
              <p className="text-lg text-[#6B5A4B] leading-snug max-w-[180px] mt-2">Take meaningful action.</p>
            </div>
          </div>

          <div className="text-[#D35D22] text-3xl hidden md:block">→</div>

          <div className="flex items-center gap-6 flex-1 justify-end">
            <div className="w-20 h-20 bg-[#F6E9D5] rounded-full flex items-center justify-center text-[#956127]">
              <BookOpen className="w-10 h-10" />
            </div>
            <div>
              <p className="text-base font-sans font-bold text-[#A87B51] mb-1">04</p>
              <h4 className="text-3xl font-bold text-[#3E342B] leading-tight">Reflect</h4>
              <p className="text-lg text-[#6B5A4B] leading-snug max-w-[180px] mt-2">Record what you learned.</p>
            </div>
          </div>

        </div>
      </section>

      {/* Philosophy Quote Box */}
      <section className="px-4 md:px-16 pb-16 max-w-[1400px] mx-auto">
        <div className="bg-[#FCF4E5] border border-[#F3EAC2] rounded-3xl p-14 flex flex-col md:flex-row gap-12 items-center relative overflow-hidden">
          {/* Faint leaf pattern */}
          <div className="absolute -bottom-10 -right-10 opacity-20 pointer-events-none">
            <svg width="300" height="300" viewBox="0 0 100 100" fill="none"><path d="M50 100C50 100 20 80 20 50C20 20 50 0 50 0C50 0 80 20 80 50C80 80 50 100 50 100Z" fill="#D35D22"/></svg>
          </div>
          
          <div className="flex-1 relative z-10 pl-8 border-l-8 border-[#D35D22]">
            <Quote className="absolute -top-6 -left-12 w-16 h-16 text-[#E8D4BB] -z-10" />
            <h3 className="text-4xl font-bold text-[#2A231C] leading-snug mb-4">
              Seva is not about being a saviour.<br/>
              It is about recognising the <span className="text-[#D35D22]">divinity in service.</span>
            </h3>
            <p className="text-[#6B5A4B] text-xl italic">— Swami Vivekananda</p>
          </div>

          <div className="hidden md:block w-px h-32 bg-[#E8D4BB]" />

          <div className="flex-1 relative z-10 text-2xl text-[#4A4035] leading-relaxed">
            At Seva-Sadhana, service is not just an act, but a practice for inner growth. When we help others, we also discover a better version of ourselves.
          </div>
        </div>
      </section>

      {/* Explore & Practice Grid */}
      <section className="px-4 md:px-16 pb-20 max-w-[1400px] mx-auto">
        <h3 className="text-3xl font-bold text-[#2A231C] mb-8">Explore & Practice</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          
          <Link href="/radar" className="bg-white border border-[#E5DDD0] rounded-3xl p-6 flex items-center justify-between hover:shadow-lg transition-shadow group">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-[#FFF7E8] rounded-full flex items-center justify-center text-[#B3792A]">
                <Compass className="w-7 h-7" />
              </div>
              <div>
                <h4 className="font-bold text-[#3E342B] text-lg">Opportunity Radar</h4>
                <p className="text-sm text-[#8B7C6E] leading-snug mt-1">Discover local & online Seva<br/>matching your Sankalp.</p>
              </div>
            </div>
            <span className="text-[#C1B5A6] text-2xl group-hover:text-[#D35D22] transition-colors">→</span>
          </Link>

          <Link href="/journey" className="bg-white border border-[#E5DDD0] rounded-3xl p-6 flex items-center justify-between hover:shadow-lg transition-shadow group">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-[#FFF7E8] rounded-full flex items-center justify-center text-[#B3792A]">
                <BookOpen className="w-7 h-7" />
              </div>
              <div>
                <h4 className="font-bold text-[#3E342B] text-lg">Personal Journey</h4>
                <p className="text-sm text-[#8B7C6E] leading-snug mt-1">Private timeline of Sankalps,<br/>Moments & Reflections.</p>
              </div>
            </div>
            <span className="text-[#C1B5A6] text-2xl group-hover:text-[#D35D22] transition-colors">→</span>
          </Link>

          <Link href="/circle" className="bg-white border border-[#E5DDD0] rounded-3xl p-6 flex items-center justify-between hover:shadow-lg transition-shadow group">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-[#FFF7E8] rounded-full flex items-center justify-center text-[#B3792A]">
                <Users className="w-7 h-7" />
              </div>
              <div>
                <h4 className="font-bold text-[#3E342B] text-lg">Seva Circles</h4>
                <p className="text-sm text-[#8B7C6E] leading-snug mt-1">Create or join recurring<br/>community groups.</p>
              </div>
            </div>
            <span className="text-[#C1B5A6] text-2xl group-hover:text-[#D35D22] transition-colors">→</span>
          </Link>

          <Link href="/inbox" className="bg-white border border-[#E5DDD0] rounded-3xl p-6 flex items-center justify-between hover:shadow-lg transition-shadow group">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-[#FFF0F2] rounded-full flex items-center justify-center text-[#D0455B]">
                <Heart className="w-7 h-7 fill-current" />
              </div>
              <div>
                <h4 className="font-bold text-[#3E342B] text-lg">Blessing Inbox</h4>
                <p className="text-sm text-[#8B7C6E] leading-snug mt-1">Read gratitude notes from<br/>people you helped.</p>
              </div>
            </div>
            <span className="text-[#C1B5A6] text-2xl group-hover:text-[#D35D22] transition-colors">→</span>
          </Link>

        </div>
      </section>
    </div>
  );
}
