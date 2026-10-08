"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Compass, MapPin, Clock, Sparkles, Filter, ChevronRight, ArrowLeft } from "lucide-react";
import { apiFetch } from "@/lib/api";

interface Opportunity {
  id: number;
  title: string;
  description: string;
  category: string;
  location_name: string;
  time_needed_minutes: number;
  urgency: string;
  skills_needed: string;
  distance_km: number;
  match_reason: string;
  visibility: string;
}

const CATEGORIES = ["All", "Digital Seva", "Companionship", "Teaching", "Medical Accompaniment", "Form Help", "Environmental"];

export default function RadarPage() {
  const router = useRouter();
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [locationUrl, setLocationUrl] = useState("https://maps.google.com/maps?q=Connaught%20Place,%20New%20Delhi&t=&z=15&ie=UTF8&iwloc=&output=embed");
  const [activeOpp, setActiveOpp] = useState<Opportunity | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          setLocationUrl(`https://maps.google.com/maps?q=${lat},${lng}&t=&z=15&ie=UTF8&iwloc=&output=embed`);
        },
        (err) => {
          console.warn("Geolocation denied or failed. Using fallback location.");
        }
      );
    }
  }, []);

  useEffect(() => {
    loadRadar();
  }, [selectedCategory]);

  const loadRadar = async () => {
    setLoading(true);
    try {
      const url = selectedCategory === "All"
        ? "/opportunities/radar"
        : `/opportunities/radar?category=${encodeURIComponent(selectedCategory)}`;
      const data = await apiFetch(url);
      
      const dummyOpportunities: Opportunity[] = [
        { id: 999, title: "Help Senior Citizen with Groceries", description: "Looking for someone to help an elderly neighbor pick up weekly groceries from the local market. They have trouble walking long distances.", category: "Companionship", location_name: "Connaught Place", time_needed_minutes: 45, urgency: "medium", skills_needed: "Patience", distance_km: 1.2, match_reason: "Matches your Sankalp of Compassion", visibility: "local" },
        { id: 998, title: "Online Math Tutoring for 8th Grader", description: "A student needs help understanding basic algebra concepts for their upcoming exams.", category: "Teaching", location_name: "Online", time_needed_minutes: 60, urgency: "high", skills_needed: "Math, Teaching", distance_km: 0, match_reason: "Matches your registered skills", visibility: "online" },
        { id: 997, title: "Organize Community Cleanup", description: "Join our weekly neighborhood cleanup drive. We provide gloves and bags.", category: "Environmental", location_name: "Lodhi Gardens", time_needed_minutes: 120, urgency: "low", skills_needed: "Physical work", distance_km: 3.5, match_reason: "High community impact", visibility: "local" },
        { id: 996, title: "Assist with Govt Forms", description: "Help daily wage workers fill out digital forms for government schemes.", category: "Form Help", location_name: "Okhla Phase 2", time_needed_minutes: 90, urgency: "high", skills_needed: "Digital Literacy", distance_km: 5.1, match_reason: "High local need", visibility: "local" },
        { id: 995, title: "Hospital Accompaniment", description: "Need someone to accompany an elderly patient to AIIMS for a routine checkup.", category: "Medical Accompaniment", location_name: "AIIMS New Delhi", time_needed_minutes: 180, urgency: "high", skills_needed: "Empathy, Patience", distance_km: 4.2, match_reason: "Matches your Sankalp of Service", visibility: "local" },
        { id: 994, title: "Website Fixes for NGO", description: "A local animal shelter needs help fixing bugs on their WordPress site.", category: "Digital Seva", location_name: "Online", time_needed_minutes: 120, urgency: "medium", skills_needed: "Web Development", distance_km: 0, match_reason: "Matches your registered skills", visibility: "online" },
        { id: 1000, title: "[SPOTTED] Homeless person needs warm blankets", description: "Photo uploaded by a third party. A person is sleeping on the pavement without adequate blankets near the metro station.", category: "Companionship", location_name: "Near Gate 2, Metro", time_needed_minutes: 30, urgency: "critical", skills_needed: "None", distance_km: 0.8, match_reason: "Urgent Photo Report", visibility: "local" },
        { id: 1001, title: "[SPOTTED] Injured Stray Dog", description: "A stray dog has a severe leg injury. Needs someone with a vehicle to take it to the nearest vet. Photo attached.", category: "Medical Accompaniment", location_name: "Sector 14 Market", time_needed_minutes: 60, urgency: "critical", skills_needed: "Vehicle, Compassion", distance_km: 1.5, match_reason: "Urgent Photo Report", visibility: "local" },
      ];
      
      const reportedLocalNeeds = JSON.parse(localStorage.getItem("reported_needs") || "[]");
      const allOps = [...reportedLocalNeeds, ...data, ...dummyOpportunities];
      
      if (selectedCategory === "All") {
        setOpportunities(allOps);
      } else {
        setOpportunities(allOps.filter(o => o.category === selectedCategory));
      }
    } catch (err: any) {
      setErrorMsg("Please sign in to view matched opportunities.");
      setTimeout(() => router.push("/welcome"), 1500);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-amber-50/50 text-stone-800 p-4 sm:p-6 max-w-6xl mx-auto space-y-5">
      {/* Top Navigation Bar */}
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={() => router.push("/home")}
          className="flex items-center gap-1 text-xs text-stone-600 hover:text-stone-900 bg-white/80 px-3 py-1.5 rounded-full border border-amber-200/60 shadow-sm"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Home</span>
        </button>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-medium border border-amber-200">
          <Compass className="w-3.5 h-3.5 text-amber-600" />
          <span>Opportunity Radar</span>
        </div>
        <div className="w-12" />
      </div>

      <header className="space-y-1 text-center">
        <h1 className="text-2xl md:text-3xl font-serif font-bold text-stone-900">Seva Radar</h1>
        <p className="text-xs md:text-sm text-stone-600 max-w-md mx-auto">
          Dignified opportunities matched with your daily Sankalp and skills near you.
        </p>
      </header>

      {/* Visual Radar Map */}
      <div className="flex justify-center my-8">
        <div className="relative w-72 h-72 md:w-96 md:h-96 rounded-full border-4 border-emerald-700 overflow-hidden shadow-2xl shadow-emerald-900/20 flex items-center justify-center bg-stone-200">
          
          {/* Actual Map Background (Real Location) */}
          <iframe 
            src={locationUrl}
            title="Local Map Area"
            className="absolute inset-0 w-[150%] h-[150%] -top-[25%] -left-[25%] object-cover opacity-60 mix-blend-multiply pointer-events-none"
            style={{ border: 0 }}
            aria-hidden="false"
            tabIndex={-1}
          />

          {/* Grid circles */}
          <div className="absolute w-3/4 h-3/4 rounded-full border border-emerald-600/40 pointer-events-none" />
          <div className="absolute w-2/4 h-2/4 rounded-full border border-emerald-600/40 pointer-events-none" />
          <div className="absolute w-1/4 h-1/4 rounded-full border border-emerald-600/40 pointer-events-none" />
          
          {/* Crosshairs */}
          <div className="absolute w-full h-[1px] bg-emerald-600/40 pointer-events-none" />
          <div className="absolute h-full w-[1px] bg-emerald-600/40 pointer-events-none" />

          {/* Sweeping Radar Beam (Conic Gradient) */}
          <div className="absolute inset-0 rounded-full animate-[spin_4s_linear_infinite] pointer-events-none" 
               style={{ background: 'conic-gradient(from 0deg, transparent 0deg, transparent 270deg, rgba(16, 185, 129, 0.4) 360deg)' }} 
          />

          {/* Interactive Red Points */}
          {opportunities.slice(0, 5).map((opp, index) => {
            const positions = [
              { top: "25%", left: "35%", delay: "0s" },
              { top: "65%", left: "75%", delay: "1s" },
              { top: "45%", left: "85%", delay: "2s" },
              { top: "75%", left: "30%", delay: "0.5s" },
              { top: "35%", left: "60%", delay: "1.5s" },
            ];
            const pos = positions[index];
            return (
              <div key={opp.id}>
                <div 
                  className="absolute w-3.5 h-3.5 bg-red-600 rounded-full animate-ping pointer-events-none" 
                  style={{ top: pos.top, left: pos.left, animationDelay: pos.delay }} 
                />
                <button
                  onClick={() => setActiveOpp(opp)}
                  className="absolute w-4 h-4 bg-red-600 hover:bg-red-500 rounded-full shadow-[0_0_8px_rgba(239,68,68,1)] border-2 border-white transition-colors hover:scale-125 z-10 cursor-pointer"
                  style={{ top: pos.top, left: pos.left }}
                />
              </div>
            );
          })}

          {/* Active Opportunity Popup */}
          {activeOpp && (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white/95 backdrop-blur-sm p-4 rounded-xl shadow-2xl border border-stone-200 z-20 w-56 text-center">
              <h4 className="font-bold text-stone-900 text-sm mb-1">{activeOpp.title}</h4>
              <p className="text-xs text-stone-600 mb-3">{activeOpp.category}</p>
              <div className="flex gap-2 justify-center">
                <Link href={`/opportunity/${activeOpp.id}`} className="px-3 py-1.5 bg-amber-600 text-white text-xs font-bold rounded-lg hover:bg-amber-700">
                  View
                </Link>
                <button onClick={() => setActiveOpp(null)} className="px-3 py-1.5 bg-stone-200 text-stone-700 text-xs font-bold rounded-lg hover:bg-stone-300">
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Category Pills Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? "bg-amber-600 text-white shadow-sm"
                : "bg-white/80 text-stone-600 border border-stone-200 hover:bg-amber-100/50"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="py-12 text-center text-xs text-stone-500">
          Searching for nearby opportunities...
        </div>
      ) : errorMsg ? (
        <div className="p-4 rounded-xl bg-red-50 text-red-700 text-xs border border-red-100 text-center">
          {errorMsg}
        </div>
      ) : opportunities.length === 0 ? (
        <div className="py-12 text-center text-xs text-stone-500 bg-white/60 rounded-2xl border border-amber-100 p-6 space-y-2">
          <p className="font-semibold text-stone-700">No opportunities found in this category.</p>
          <p>Try selecting "All" or check back later.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 items-stretch">
          {opportunities.map((opp) => (
            <Link
              key={opp.id}
              href={`/opportunity/${opp.id}`}
              className="block p-4 bg-white/90 backdrop-blur-md rounded-2xl border border-amber-100 shadow-sm hover:shadow-md transition-all group space-y-3"
            >
              {/* Match Reason Banner */}
              <div className="flex items-center gap-1.5 text-[11px] font-medium text-amber-800 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200/60 w-fit">
                <Sparkles className="w-3 h-3 text-amber-600 shrink-0" />
                <span className="truncate">{opp.match_reason}</span>
              </div>

              {/* Title & Description */}
              <div>
                <h3 className="font-serif font-semibold text-stone-900 text-base group-hover:text-amber-700 transition-colors">
                  {opp.title}
                </h3>
                <p className="text-xs text-stone-600 mt-1 line-clamp-2 leading-relaxed">
                  {opp.description}
                </p>
              </div>

              {/* Metadata Badges */}
              <div className="flex items-center justify-between pt-2 border-t border-stone-100 text-xs text-stone-500">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-amber-600" />
                    {opp.visibility === "online" ? "Online" : `${opp.distance_km} km`}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-stone-400" />
                    {opp.time_needed_minutes} mins
                  </span>
                </div>

                <div className="flex items-center gap-1 text-amber-700 font-medium group-hover:translate-x-0.5 transition-transform">
                  <span>View & Respond</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
