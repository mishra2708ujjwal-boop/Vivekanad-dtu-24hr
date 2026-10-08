"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User, Clock, BookOpen, Plus, Trash2, Check, ArrowLeft, HeartHandshake, LogOut } from "lucide-react";

interface SkillItem {
  skill_name: string;
  level: string;
  wants_to_learn: boolean;
}

export default function ProfilePage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [cityArea, setCityArea] = useState("");
  const [timeAvailability, setTimeAvailability] = useState("");
  const [learningInterests, setLearningInterests] = useState("");
  const [resourcesOffered, setResourcesOffered] = useState("");
  const [skills, setSkills] = useState<SkillItem[]>([]);
  
  const [newSkillName, setNewSkillName] = useState("");
  const [newSkillLevel, setNewSkillLevel] = useState("Intermediate");
  const [newWantsToLearn, setNewWantsToLearn] = useState(false);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = () => {
    setLoading(true);
    
    // Fallback if not logged in
    const userName = localStorage.getItem("user_name");
    if (!userName) {
      setErrorMsg("Please log in to view your profile.");
      setTimeout(() => router.push("/auth"), 1500);
      return;
    }

    try {
      const stored = localStorage.getItem("user_profile");
      if (stored) {
        const data = JSON.parse(stored);
        setName(data.name || userName);
        setCityArea(data.cityArea || "");
        setTimeAvailability(data.timeAvailability || "");
        setLearningInterests(data.learningInterests || "");
        setResourcesOffered(data.resourcesOffered || "");
        
        if (data.primarySkill) {
          setSkills([{ skill_name: data.primarySkill, level: "Intermediate", wants_to_learn: false }]);
        }
        if (data.skills) {
          setSkills(data.skills);
        }
      } else {
        setName(userName);
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addSkill = () => {
    if (!newSkillName.trim()) return;
    setSkills([
      ...skills,
      { skill_name: newSkillName.trim(), level: newSkillLevel, wants_to_learn: newWantsToLearn }
    ]);
    setNewSkillName("");
    setNewWantsToLearn(false);
  };

  const removeSkill = (index: number) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg("");
    setErrorMsg("");

    try {
      localStorage.setItem("user_profile", JSON.stringify({
        name,
        cityArea,
        timeAvailability,
        learningInterests,
        resourcesOffered,
        skills
      }));
      localStorage.setItem("user_name", name); // sync global name
      window.dispatchEvent(new Event('auth-change'));
      
      setSuccessMsg("Contribution Profile updated successfully!");
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user_name");
    localStorage.removeItem("user_profile");
    window.dispatchEvent(new Event('auth-change'));
    router.push("/auth");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-amber-50/50 flex items-center justify-center text-stone-600 text-sm">
        Loading profile...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-amber-50/50 text-stone-800 p-4 sm:p-6 max-w-lg mx-auto">
      {/* Top Bar */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1 text-xs text-stone-600 hover:text-stone-900 bg-white/80 px-3 py-1.5 rounded-full border border-amber-200/60 shadow-sm"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back</span>
        </button>
        <h1 className="text-base font-semibold text-stone-900">Contribution Profile</h1>
        <div className="w-12" />
      </div>

      {successMsg && (
        <div className="mb-4 p-3 rounded-xl bg-emerald-50 text-emerald-800 text-xs border border-emerald-200 flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="mb-4 p-3 rounded-xl bg-red-50 text-red-800 text-xs border border-red-200">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-5">
        {/* Basic Info Card */}
        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-5 border border-amber-100 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-stone-900 font-medium text-sm pb-2 border-b border-stone-100">
            <User className="w-4 h-4 text-amber-600" />
            <span>Personal Details</span>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium text-stone-600">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full mt-1 px-3 py-2 text-sm rounded-lg border border-stone-200 focus:ring-2 focus:ring-amber-500/40 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-stone-600">City / Area</label>
              <input
                type="text"
                placeholder="e.g. South Delhi, Lajpat Nagar"
                value={cityArea}
                onChange={(e) => setCityArea(e.target.value)}
                className="w-full mt-1 px-3 py-2 text-sm rounded-lg border border-stone-200 focus:ring-2 focus:ring-amber-500/40 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Contribution & Time Availability Card */}
        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-5 border border-amber-100 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-stone-900 font-medium text-sm pb-2 border-b border-stone-100">
            <Clock className="w-4 h-4 text-amber-600" />
            <span>Time & Availability</span>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium text-stone-600">Time Availability</label>
              <input
                type="text"
                placeholder="e.g. 2 hours on weekends, Friday evenings"
                value={timeAvailability}
                onChange={(e) => setTimeAvailability(e.target.value)}
                className="w-full mt-1 px-3 py-2 text-sm rounded-lg border border-stone-200 focus:ring-2 focus:ring-amber-500/40 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-stone-600">Learning Interests</label>
              <input
                type="text"
                placeholder="e.g. Basic healthcare, Digital literacy"
                value={learningInterests}
                onChange={(e) => setLearningInterests(e.target.value)}
                className="w-full mt-1 px-3 py-2 text-sm rounded-lg border border-stone-200 focus:ring-2 focus:ring-amber-500/40 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-stone-600">Resources You Can Offer</label>
              <input
                type="text"
                placeholder="e.g. Teaching materials, Laptop for digital desk"
                value={resourcesOffered}
                onChange={(e) => setResourcesOffered(e.target.value)}
                className="w-full mt-1 px-3 py-2 text-sm rounded-lg border border-stone-200 focus:ring-2 focus:ring-amber-500/40 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Skills & Learning Toggle Card */}
        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-5 border border-amber-100 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-stone-900 font-medium text-sm pb-2 border-b border-stone-100">
            <BookOpen className="w-4 h-4 text-amber-600" />
            <span>Skills & Mutual Learning</span>
          </div>
          
          <p className="text-xs text-stone-500 leading-relaxed">
            Dignity rule: Check <strong className="text-stone-700 font-medium">"I want to learn"</strong> if you'd like to receive guidance in a skill instead of teaching it.
          </p>

          {/* Skill Items List */}
          <div className="space-y-2">
            {skills.map((skill, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2.5 rounded-xl bg-amber-50/60 border border-amber-100 text-xs"
              >
                <div className="space-y-0.5">
                  <span className="font-semibold text-stone-800">{skill.skill_name}</span>
                  <div className="flex items-center gap-2 text-stone-500">
                    <span>{skill.level}</span>
                    {skill.wants_to_learn && (
                      <span className="inline-flex items-center gap-1 text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full font-medium">
                        <HeartHandshake className="w-3 h-3" /> Wants to learn
                      </span>
                    )}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeSkill(index)}
                  className="text-stone-400 hover:text-red-600 p-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          {/* Add Skill Form */}
          <div className="pt-3 border-t border-stone-100 space-y-2">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="New skill (e.g. Teaching, Gardening)"
                value={newSkillName}
                onChange={(e) => setNewSkillName(e.target.value)}
                className="flex-1 px-3 py-2 text-xs rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500/40"
              />
              <select
                value={newSkillLevel}
                onChange={(e) => setNewSkillLevel(e.target.value)}
                className="px-2 py-2 text-xs rounded-lg border border-stone-200 bg-white"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 text-xs text-stone-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={newWantsToLearn}
                  onChange={(e) => setNewWantsToLearn(e.target.checked)}
                  className="rounded text-amber-600 focus:ring-amber-500"
                />
                <span>I want to learn this skill</span>
              </label>

              <button
                type="button"
                onClick={addSkill}
                className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg text-xs font-medium flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <button
          type="submit"
          disabled={saving}
          className="w-full py-4 bg-amber-600 hover:bg-amber-700 text-white font-bold text-lg rounded-xl shadow-md transition-all disabled:opacity-50 font-serif"
        >
          {saving ? "Saving Changes..." : "Save Contribution Profile"}
        </button>

        {/* Logout Button */}
        <button
          type="button"
          onClick={handleLogout}
          className="w-full py-4 mt-6 bg-stone-100 hover:bg-red-50 text-red-600 font-bold text-lg rounded-xl transition-all border-2 border-stone-200 hover:border-red-200 flex items-center justify-center gap-2"
        >
          <LogOut className="w-5 h-5" />
          Log Out
        </button>
      </form>
    </main>
  );
}
