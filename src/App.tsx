/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { User, ChatMessage } from "./types";
import { AIAvatar } from "./components/AI/AIAvatar";
import { AIChat } from "./components/AI/AIChat";
import { TrackingPanel } from "./components/Tracking/TrackingPanel";
import { SmartBoard } from "./components/SmartBoard/Board";
import { 
  Users, 
  Settings, 
  LayoutDashboard,
  GraduationCap,
  Star,
  Award,
  BookOpen,
  Mic
} from "lucide-react";
import { motion } from "motion/react";

// Mock User
const MOCK_USER: User = {
  id: "S001",
  name: "Leo",
  role: "student",
  level: "Grade 4",
  xp: 1250,
  badges: ["Word Wizard", "Quick Learner"]
};

export default function App() {
  const [view, setView] = useState<'home' | 'classroom'>('home');
  const [currentUser] = useState<User>(MOCK_USER);
  const [aiStatus, setAiStatus] = useState<"idle" | "speaking" | "thinking" | "encouraging">("idle");
  const [aiMessage, setAiMessage] = useState("Hi! I'm Teacher Noor. Ready for a new adventure?");
  const [lastAiResponse, setLastAiResponse] = useState("");
  const [stats, setStats] = useState({
    messagesSent: 5,
    filesUploaded: 2,
    voiceRecordings: 1,
    starsEarned: 120,
    streak: 3
  });

  const handleStatUpdate = (type: 'text' | 'file' | 'voice') => {
    setStats(prev => ({
      ...prev,
      messagesSent: type === 'text' ? prev.messagesSent + 1 : prev.messagesSent,
      filesUploaded: type === 'file' ? prev.filesUploaded + 1 : prev.filesUploaded,
      voiceRecordings: type === 'voice' ? prev.voiceRecordings + 1 : prev.voiceRecordings,
      starsEarned: prev.starsEarned + 10,
    }));
    if (type !== 'text') {
      setAiStatus("encouraging");
      setTimeout(() => setAiStatus("idle"), 2000);
    }
  };

  if (view === 'home') {
    return (
      <div className="min-h-screen bg-[#FFF9F0] flex flex-col items-center justify-center p-6 font-sans">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl w-full text-center space-y-12"
        >
          {/* Logo Section */}
          <div className="flex flex-col items-center gap-4">
            <div className="w-24 h-24 bg-brand-blue rounded-[2.5rem] flex items-center justify-center text-white shadow-2xl rotate-6 animate-float">
              <GraduationCap size={48} strokeWidth={2.5} />
            </div>
            <h1 className="text-6xl font-black text-slate-800 tracking-tighter">Teacher Noor</h1>
            <div className="bg-brand-yellow px-6 py-2 rounded-full shadow-lg -rotate-2">
              <span className="text-white font-black text-xl flex items-center gap-2">
                ⭐ Points: {stats.starsEarned}
              </span>
            </div>
          </div>

          {/* Progress Card */}
          <div className="bg-white rounded-[3rem] p-10 shadow-2xl border-4 border-slate-50 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div className="text-left space-y-4">
              <h2 className="text-3xl font-black text-slate-800">Your Progress</h2>
              <div className="space-y-2">
                <div className="flex justify-between font-black text-slate-400 uppercase tracking-widest text-[10px]">
                  <span>Grade 4 Explorer</span>
                  <span>75% to Level 5</span>
                </div>
                <div className="h-6 bg-slate-100 rounded-full overflow-hidden p-1 shadow-inner">
                  <div className="h-full bg-brand-green rounded-full w-3/4 shadow-lg shadow-brand-green/30" />
                </div>
              </div>
              <div className="flex gap-4 pt-4">
                {currentUser.badges.map(badge => (
                  <div key={badge} className="bg-brand-purple/10 p-3 rounded-2xl flex items-center gap-2">
                    <Star className="text-brand-purple fill-brand-purple" size={20} />
                    <span className="text-brand-purple font-black text-xs">{badge}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-center">
              <div className="relative w-48 h-48">
                 <div className="absolute inset-0 bg-brand-blue/20 rounded-full blur-3xl animate-pulse" />
                 <img src="https://img.icons8.com/bubbles/200/teacher.png" alt="Teacher" className="relative z-10 animate-float" />
              </div>
            </div>
          </div>

          {/* Start Button */}
          <button 
            onClick={() => setView('classroom')}
            className="group relative inline-flex items-center gap-4 px-12 py-6 bg-brand-blue text-white rounded-[3rem] font-black text-2xl shadow-[0_20px_50px_rgba(0,163,255,0.4)] hover:bg-sky-500 transition-all btn-bouncy"
          >
            <Mic size={32} strokeWidth={3} className="group-hover:rotate-12 transition-transform" />
            Start Learning with Teacher Noor
            <div className="absolute -top-4 -right-4 bg-brand-pink text-white text-sm px-4 py-2 rounded-full rotate-12 shadow-lg">
              Class is Open!
            </div>
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF9F0] flex text-slate-900 font-sans selection:bg-brand-blue/30">
      {/* Sidebar Navigation */}
      <aside className="w-24 lg:w-72 bg-white border-r-4 border-slate-100 py-10 flex flex-col justify-between items-center lg:items-start lg:px-8 fixed h-full z-10 transition-all">
        <div className="space-y-12 w-full text-center lg:text-left">
          <button 
            onClick={() => setView('home')}
            className="flex items-center gap-4 px-2 hover:scale-105 transition-transform group"
          >
            <div className="w-12 h-12 bg-brand-blue rounded-2xl flex items-center justify-center text-white shadow-xl rotate-6 group-hover:rotate-0 transition-all">
              <GraduationCap size={28} />
            </div>
            <span className="hidden lg:block font-black text-2xl tracking-tighter text-slate-800">Noor</span>
          </button>

          <nav className="space-y-4">
            {[
              { icon: LayoutDashboard, label: "Home", active: true, color: 'text-brand-blue bg-brand-blue/10' },
              { icon: BookOpen, label: "Library", color: 'text-brand-purple hover:bg-brand-purple/5' },
              { icon: Award, label: "Badges", color: 'text-brand-pink hover:bg-brand-pink/5' },
            ].map((item) => (
              <button
                key={item.label}
                className={`w-full flex items-center gap-4 p-4 rounded-3xl transition-all btn-bouncy ${
                  item.active 
                    ? item.color + " shadow-lg shadow-brand-blue/10" 
                    : "text-slate-400 " + item.color
                }`}
              >
                <item.icon size={26} strokeWidth={2.5} />
                <span className="hidden lg:block font-black text-base">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="w-full space-y-4">
          <div className="bg-brand-yellow/10 p-4 rounded-3xl border-2 border-brand-yellow/20 flex flex-col items-center">
             <span className="text-brand-yellow font-black text-xl">⭐ {stats.starsEarned}</span>
          </div>
          <div className="w-full p-4 bg-slate-50 rounded-[2.5rem] flex flex-col lg:flex-row items-center gap-4 border-4 border-slate-100/50">
            <div className="w-12 h-12 rounded-2xl bg-brand-blue/10 flex items-center justify-center font-black text-brand-blue text-lg shadow-inner">
              {currentUser.name.charAt(0)}
            </div>
            <div className="hidden lg:block overflow-hidden">
              <p className="text-sm font-black text-slate-800 truncate">{currentUser.name}</p>
              <p className="text-[10px] text-slate-400 uppercase font-black uppercase">Grade 4</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 ml-24 lg:ml-72 p-10">
        <div className="max-w-[1700px] mx-auto">
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
            
            {/* 1. INTERACTIVE LEARNING AREA (LEFT + CENTER) */}
            <div className="xl:col-span-8 flex flex-col gap-10 h-full">
              <div className="flex flex-col lg:flex-row gap-10 items-stretch">
                {/* Avatar Section - 50% width on LG */}
                <div className="lg:w-1/2 flex flex-col gap-6">
                  <div className="bg-white rounded-[3rem] border-4 border-slate-50 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)] overflow-hidden h-full">
                    <AIAvatar status={aiStatus} message={aiMessage} />
                  </div>
                </div>

                {/* Magic Board Section - 50% width on LG */}
                <div className="lg:w-1/2 min-h-[700px] lg:h-auto">
                  <SmartBoard 
                    onActivity={() => handleStatUpdate('text')} 
                    aiResponse={lastAiResponse}
                  />
                </div>
              </div>
            </div>

            {/* 2. CHAT & HELP AREA (RIGHT) */}
            <div className="xl:col-span-4 flex flex-col gap-10">
              <AIChat 
                userRole={currentUser.role} 
                userLevel={currentUser.level} 
                onAnalysisStart={() => {
                  setAiStatus("thinking");
                  setAiMessage("Let me use my magic...");
                }}
                onAnalysisEnd={(type, response) => {
                  if (response) {
                    setAiStatus("speaking");
                    let displayMessage = response;
                    try {
                      if (response.startsWith('{')) {
                        const parsed = JSON.parse(response);
                        displayMessage = parsed.speech || response;
                      }
                    } catch (e) {
                      console.warn("Could not parse AI response in App", e);
                    }
                    
                    setAiMessage(displayMessage); 
                    setLastAiResponse(""); // Clear first to trigger effect if same message
                    setTimeout(() => setLastAiResponse(response), 10);
                  }
                  handleStatUpdate(type as any);
                  setTimeout(() => {
                    setAiStatus("idle");
                  }, 8000);
                }}
              />
            </div>
            
          </div>
        </div>
      </main>
    </div>
  );
}
