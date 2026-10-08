"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Mic, MicOff, Video, VideoOff, PhoneMissed, MessageSquare, Users, ScreenShare, ShieldAlert, Radio } from "lucide-react";

export default function LiveRoomPage() {
  const router = useRouter();
  const [micOn, setMicOn] = useState(true);
  const [videoOn, setVideoOn] = useState(true);
  const [time, setTime] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  useEffect(() => {
    const timer = setInterval(() => setTime(t => t + 1), 1000);
    
    // Request camera and microphone permissions
    let stream: MediaStream | null = null;
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((s) => {
        stream = s;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch((err) => {
        console.log("Permission denied or error accessing media devices:", err);
      });

    return () => {
      clearInterval(timer);
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Update video/audio tracks based on state
  useEffect(() => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getVideoTracks().forEach(track => {
        track.enabled = videoOn;
      });
      stream.getAudioTracks().forEach(track => {
        track.enabled = micOn;
      });
    }
  }, [videoOn, micOn]);
  
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <main className="min-h-screen bg-amber-50/50 text-stone-800 flex flex-col h-screen overflow-hidden">
      {/* Header */}
      <header className="p-4 border-b border-amber-200/60 flex items-center justify-between shrink-0 bg-white/60 backdrop-blur-md shadow-sm">
        <div className="flex items-center gap-3">
          <div className="bg-red-50 text-red-600 text-xs font-bold px-2 py-1 rounded flex items-center gap-1.5 border border-red-200">
             <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
             REC {formatTime(time)}
          </div>
          <h1 className="font-serif font-bold text-lg text-stone-900">Live Seva</h1>
        </div>
        
        <div className="flex items-center gap-3 text-xs text-stone-600">
           <div className="flex items-center gap-1 bg-white px-2 py-1 rounded-md border border-amber-200 shadow-sm font-medium">
              <Users className="w-3.5 h-3.5 text-amber-600" /> 15 Viewers
           </div>
           <div className="flex items-center gap-1 bg-emerald-50 text-emerald-800 px-2 py-1 rounded-md border border-emerald-200 font-medium">
              <ShieldAlert className="w-3.5 h-3.5" /> Safe Mode On
           </div>
        </div>
      </header>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
         {/* Video Area */}
         <div className="flex-1 p-4 flex flex-col relative">
            <div className="flex-1 bg-stone-900 rounded-2xl border border-amber-200 overflow-hidden relative flex items-center justify-center shadow-inner">
               
               {videoOn ? (
                 <video 
                   ref={videoRef}
                   autoPlay
                   playsInline
                   muted
                   className="w-full h-full object-cover"
                 />
               ) : (
                 <div className="text-center">
                   <div className="w-24 h-24 rounded-full bg-stone-800 border-4 border-stone-700 flex items-center justify-center mx-auto shadow-2xl">
                     <VideoOff className="w-8 h-8 text-stone-500" />
                   </div>
                   <p className="text-stone-400 mt-3 font-medium">Camera is off</p>
                 </div>
               )}
               
               <div className="absolute bottom-24 left-4 bg-black/60 px-3 py-1.5 rounded-lg text-xs font-medium text-white backdrop-blur-sm shadow-sm">
                 Priya K. (Host)
               </div>
               
               {/* Controls */}
               <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-white/10 backdrop-blur-md p-2 rounded-full border border-white/20">
                  <button 
                    onClick={() => setMicOn(!micOn)}
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors shadow-sm ${micOn ? 'bg-white text-stone-800 hover:bg-stone-100' : 'bg-red-500 text-white hover:bg-red-600'}`}
                  >
                    {micOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
                  </button>
                  <button 
                    onClick={() => setVideoOn(!videoOn)}
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors shadow-sm ${videoOn ? 'bg-white text-stone-800 hover:bg-stone-100' : 'bg-red-500 text-white hover:bg-red-600'}`}
                  >
                    {videoOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
                  </button>
                  <button className="hidden md:flex w-12 h-12 rounded-full items-center justify-center bg-white text-stone-800 hover:bg-stone-100 transition-colors shadow-sm">
                    <ScreenShare className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => router.push('/live')}
                    className="w-16 h-12 rounded-full flex items-center justify-center bg-red-600 hover:bg-red-700 text-white transition-colors shadow-lg ml-2"
                  >
                    <PhoneMissed className="w-5 h-5" />
                  </button>
               </div>
            </div>
         </div>
         
         {/* Sidebar Chat */}
         <div className="w-full md:w-80 h-64 md:h-auto border-t md:border-t-0 md:border-l border-amber-200/60 flex flex-col bg-white/60 backdrop-blur-md">
            <div className="p-4 border-b border-amber-200/60 font-semibold text-sm flex items-center gap-2 text-stone-900 bg-white/40">
              <MessageSquare className="w-4 h-4 text-amber-600" /> Live Chat
            </div>
            
            <div className="flex-1 p-4 space-y-4 overflow-y-auto">
               <div className="text-xs space-y-1">
                 <span className="font-bold text-emerald-600">Ravi:</span>
                 <span className="text-stone-700 ml-2">Sir, can you explain the formula again?</span>
               </div>
               <div className="text-xs space-y-1">
                 <span className="font-bold text-amber-600">Amit:</span>
                 <span className="text-stone-700 ml-2">Yes, the second step was confusing.</span>
               </div>
               <div className="text-xs space-y-1">
                 <span className="font-bold text-indigo-600">Host:</span>
                 <span className="text-stone-700 ml-2">Sure, let me share my screen and go over it.</span>
               </div>
            </div>
            
            <div className="p-4 border-t border-amber-200/60 bg-white/40">
               <input 
                 type="text" 
                 placeholder="Ask a question..."
                 className="w-full bg-white border border-amber-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 shadow-sm"
               />
            </div>
         </div>
      </div>
    </main>
  );
}
