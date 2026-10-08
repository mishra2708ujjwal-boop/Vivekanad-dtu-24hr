"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Camera, MapPin, AlertCircle, Sparkles, UploadCloud, CheckCircle2 } from "lucide-react";

export default function SpotAndReportPage() {
  const router = useRouter();
  const [photo, setPhoto] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPhoto(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleUseGPS = () => {
    if (navigator.geolocation) {
      setLocation("Getting GPS location...");
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocation(`${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)} (Current Location)`);
        },
        (err) => {
          setLocation("GPS Failed. Please type manually.");
        }
      );
    } else {
      setLocation("GPS not supported by browser.");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description) return;
    
    setLoading(true);
    
    // Save to localStorage to reflect on Radar
    const newNeed = {
      id: Date.now(), // Unique ID
      title: "[NEW SPOTTED ALERT]",
      description: description,
      category: "Urgent Alert",
      location_name: location || "Unknown Location",
      time_needed_minutes: 30,
      urgency: "critical",
      skills_needed: "Compassion",
      distance_km: 0.1,
      match_reason: "Freshly Reported",
      visibility: "local"
    };

    const existingNeeds = JSON.parse(localStorage.getItem("reported_needs") || "[]");
    localStorage.setItem("reported_needs", JSON.stringify([newNeed, ...existingNeeds]));

    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1500);
  };

  if (submitted) {
    return (
      <main className="min-h-screen bg-amber-50/50 p-6 flex items-center justify-center">
        <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-xl border border-emerald-100 text-center space-y-6">
          <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-12 h-12 text-emerald-600" />
          </div>
          <h2 className="text-3xl font-serif font-bold text-stone-900">Need Reported!</h2>
          <p className="text-stone-600 text-lg">
            Thank you for spotting a need in the community. This opportunity has been broadcasted on the Radar for nearby givers to help.
          </p>
          <button
            onClick={() => router.push("/radar")}
            className="w-full py-4 bg-stone-900 text-white font-bold rounded-xl shadow-lg hover:bg-stone-800 transition-colors mt-6"
          >
            Go to Radar
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-amber-50/50 p-6 space-y-8">
      <div className="max-w-2xl mx-auto space-y-8">
        
        {/* Header */}
        <header className="text-center space-y-4 py-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-100/80 text-red-800 text-sm font-bold border border-red-200/60 shadow-sm mx-auto">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <span>Spot & Help</span>
          </div>
          <h1 className="text-5xl font-serif font-bold text-stone-900 tracking-tight leading-tight">
            Report a Local Need
          </h1>
          <p className="text-stone-600 max-w-xl mx-auto text-lg leading-relaxed">
            See someone or something that needs help? Click a photo and report it anonymously. We will alert nearby volunteers to fulfill the need.
          </p>
        </header>

        {/* Reporting Form */}
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xl border border-stone-200 relative overflow-hidden">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Photo Upload Area */}
            <div className="space-y-2">
              <label className="text-lg font-bold text-stone-800 flex items-center gap-2">
                <Camera className="w-6 h-6 text-stone-600" />
                Upload Photo Evidence
              </label>
              
              <div className="relative w-full h-64 border-4 border-dashed border-stone-200 rounded-3xl bg-stone-50 flex flex-col items-center justify-center overflow-hidden hover:bg-stone-100 transition-colors">
                {photo ? (
                  <img src={photo} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
                ) : (
                  <div className="text-center space-y-3 pointer-events-none p-4">
                    <UploadCloud className="w-12 h-12 text-stone-400 mx-auto" />
                    <p className="text-stone-500 font-bold text-lg">Click to capture or upload photo</p>
                  </div>
                )}
                <input 
                  type="file" 
                  accept="image/*"
                  capture="environment"
                  onChange={handlePhotoUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
            </div>

            {/* Location Input */}
            <div className="space-y-2">
              <label className="text-lg font-bold text-stone-800 flex items-center gap-2">
                <MapPin className="w-6 h-6 text-stone-600" />
                Exact Location
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  required
                  placeholder="E.g., Near Metro Station Gate 2"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full p-4 bg-stone-50 border border-stone-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-lg"
                />
                <button 
                  type="button" 
                  onClick={handleUseGPS}
                  className="px-6 py-4 bg-stone-200 text-stone-800 font-bold rounded-2xl hover:bg-stone-300 transition-colors shrink-0"
                >
                  Use GPS
                </button>
              </div>
            </div>
            
            {/* Description */}
            <div className="space-y-2">
              <label className="text-lg font-bold text-stone-800 flex items-center gap-2">
                <AlertCircle className="w-6 h-6 text-stone-600" />
                Describe the Need
              </label>
              <textarea
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="E.g., A stray dog is injured and needs immediate medical attention..."
                className="w-full h-32 p-4 bg-stone-50 border border-stone-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none text-lg"
              />
            </div>
            
            <button
              type="submit"
              disabled={loading || !description || !location}
              className="w-full py-5 bg-red-600 hover:bg-red-700 disabled:bg-stone-400 text-white font-bold text-xl rounded-2xl shadow-xl shadow-red-600/30 transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Submitting Alert...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-6 h-6" />
                  <span>Alert Local Givers</span>
                </>
              )}
            </button>
          </form>
        </div>
        
      </div>
    </main>
  );
}
