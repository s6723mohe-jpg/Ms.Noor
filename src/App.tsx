/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { User, ChatMessage } from "./types";
import { AIAvatar } from "./components/AI/AIAvatar";
import { AIChat } from "./components/AI/AIChat";
import { TrackingPanel } from "./components/Tracking/TrackingPanel";
import { 
  Users, 
  Settings, 
  LayoutDashboard,
  GraduationCap,
  Star,
  Award,
  BookOpen,
  Mic,
  Home,
  Volume2,
  VolumeX,
  Sparkles,
  ChevronRight,
  RefreshCcw,
  X,
  Globe,
  Trophy,
  Flame,
  BarChart2,
  MessageCircle,
  Aperture,
  Clock,
  HelpCircle,
  TrendingUp,
  Zap
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useEffect } from "react";

// Themes Configuration
const THEMES = {
  hobbies: {
    title: "Hobbies",
    icon: "⚽",
    simplePrompts: [
      "Teach me hobbies",
      "I can play chess",
      "Can you ask me questions?",
      "What hobbies do you like?",
      "I can skip and run"
    ]
  },
  town: {
    title: "Our Town",
    icon: "🏘️",
    simplePrompts: [
      "Describe my town",
      "What is a mosque?",
      "Is the mall big?",
      "Was the town busy?",
      "Tell me about places"
    ]
  },
  history: {
    title: "Oman History",
    icon: "🏰",
    simplePrompts: [
      "What is a khanjar?",
      "Tell me about coins",
      "What is silver?",
      "Did people live before?",
      "Teach me history words"
    ]
  },
  celebrations: {
    title: "Celebrations",
    icon: "🎉",
    simplePrompts: [
      "Tell me about parties",
      "Did you eat cake?",
      "What is a present?",
      "What did you wear?",
      "I went to a party"
    ]
  }
};

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
  const [view, setView] = useState<'home' | 'classroom' | 'talk-only' | 'chat-only'>('home');
  const [currentUser] = useState<User>(MOCK_USER);
  const [aiStatus, setAiStatus] = useState<"idle" | "speaking" | "thinking" | "encouraging">("idle");
  const [aiMessage, setAiMessage] = useState("Hi! I'm Teacher Noor. Ready for a new adventure?");
  const [lastAiResponse, setLastAiResponse] = useState("");
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [activeTheme, setActiveTheme] = useState<keyof typeof THEMES | null>(null);
  const [isMeetNoorOpen, setIsMeetNoorOpen] = useState(false);
  const [isProgressOpen, setIsProgressOpen] = useState(false);
  const [noorLang, setNoorLang] = useState<'en' | 'ar'>('en');
  const [stats, setStats] = useState({
    totalPoints: 1250,
    weeklyStreak: 4,
    questionsAsked: 42,
    sessionsCompleted: 12,
    learningMinutes: 185,
    chatMessages: 85,
    lastActive: Date.now(),
    level: 4,
    progressToNextLevel: 65,
    dailyPoints: 120,
    dailyMinutes: 25,
    weeklyQuestions: 15,
    weeklySessions: 3,
    messagesSent: 5,
    filesUploaded: 2,
    voiceRecordings: 1
  });

  const handleStatUpdate = (type: 'text' | 'file' | 'voice') => {
    setStats(prev => ({
      ...prev,
      messagesSent: type === 'text' ? prev.messagesSent + 1 : prev.messagesSent,
      chatMessages: type === 'text' ? prev.chatMessages + 1 : prev.chatMessages,
      filesUploaded: type === 'file' ? prev.filesUploaded + 1 : prev.filesUploaded,
      voiceRecordings: type === 'voice' ? prev.voiceRecordings + 1 : prev.voiceRecordings,
      totalPoints: prev.totalPoints + 15,
      dailyPoints: prev.dailyPoints + 15,
      questionsAsked: type === 'text' ? prev.questionsAsked + 1 : prev.questionsAsked
    }));
    if (type !== 'text') {
      setAiStatus("encouraging");
      setTimeout(() => setAiStatus("idle"), 2000);
    }
  };

  const handleStartSession = (type: 'talk' | 'chat') => {
    if (type === 'talk') {
      setView('talk-only');
      setAiStatus("speaking");
      setAiMessage("I'm ready! Let's talk together.");
    } else {
      setView('chat-only');
      setAiStatus("thinking");
      setAiMessage("How can I help you in chat today?");
    }
    setStats(prev => ({
      ...prev,
      weeklySessions: prev.weeklySessions + 1,
      sessionsCompleted: prev.sessionsCompleted + 1,
      totalPoints: prev.totalPoints + 30,
      dailyPoints: prev.dailyPoints + 30
    }));
  };

  if (view === 'home') {
    const mainActions = [
      { 
        id: 'talk', 
        icon: "🎤", 
        label: "Talk to Noor", 
        color: "bg-brand-soft/20 text-brand-purple",
        message: "I love talking with you! Just click the microphone to practice your English with me." 
      },
      { 
        id: 'chat', 
        icon: "💬", 
        label: "Ask Noor", 
        color: "bg-brand-lavender/20 text-brand-purple",
        message: "Use the chat anytime you have a question or need a quick hint!" 
      }
    ];

    return (
      <div className="min-h-screen bg-brand-light flex flex-col items-center justify-center p-6 font-sans relative overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute top-[-10%] left-[-5%] w-64 h-64 bg-brand-purple/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-5%] w-96 h-96 bg-brand-soft/10 rounded-full blur-3xl animate-pulse" />

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-6xl w-full flex flex-col items-center space-y-12 relative z-10"
        >
          {/* Main Hero Section */}
          <div className="flex flex-col items-center text-center space-y-10 w-full">
            {/* Static Image Section */}
            <div className="relative group">
              <div className="absolute inset-0 bg-brand-purple/20 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity animate-pulse" />
              <div className="relative w-64 h-64 md:w-80 md:h-80 bg-white rounded-full p-2 shadow-[0_20px_50px_rgba(108,74,182,0.15)] border-8 border-white flex items-center justify-center overflow-hidden">
                <span className="text-9xl animate-float select-none">👩🏻‍🏫</span>
                {/* Decorative badge */}
                <div className="absolute bottom-4 right-4 bg-brand-purple text-white p-3 rounded-2xl shadow-lg border-4 border-white rotate-12 group-hover:rotate-0 transition-transform">
                  <GraduationCap size={24} />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <motion.h1 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-5xl lg:text-7xl font-black text-slate-800 tracking-tighter"
              >
                Hi! I’m Teacher Noor 👩🏻‍🏫
              </motion.h1>
              <p className="text-slate-400 font-bold text-xl uppercase tracking-widest">Your Private English Tutor</p>
              
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(108, 74, 182, 0.4)" }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsMeetNoorOpen(true)}
                className="mt-4 bg-white border-2 border-brand-purple/30 text-brand-purple px-6 py-3 rounded-full font-black text-sm uppercase tracking-widest flex items-center gap-2 mx-auto shadow-sm hover:border-brand-purple hover:bg-brand-purple/5 transition-all"
              >
                <Sparkles size={16} className="text-brand-yellow" />
                ✨ About Teacher Noor
              </motion.button>
            </div>

            {/* Meet Teacher Noor Modal */}
            <AnimatePresence>
              {isMeetNoorOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setIsMeetNoorOpen(false)}
                    className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
                  />
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="relative w-full max-w-2xl bg-white rounded-[3rem] shadow-2xl overflow-hidden border-8 border-white"
                  >
                    {/* Header with Background */}
                    <div className="bg-brand-purple p-8 text-white relative">
                      <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                        <GraduationCap size={120} />
                      </div>
                      
                      <div className="flex justify-between items-start relative z-10">
                        <div className="space-y-1">
                          <h2 className={`text-4xl font-black tracking-tight ${noorLang === 'ar' ? 'text-right' : 'text-left'}`}>
                            {noorLang === 'en' ? 'About Teacher Noor 🌟' : 'تعرّف على المعلمة نور 🌟'}
                          </h2>
                          <div className={`flex items-center gap-2 ${noorLang === 'ar' ? 'flex-row-reverse' : ''}`}>
                            <div className="w-2 h-2 rounded-full bg-brand-green animate-pulse" />
                            <span className="text-[10px] font-black uppercase tracking-widest opacity-70">
                              {noorLang === 'en' ? 'Your AI Companion' : 'رفيقتك الذكية'}
                            </span>
                          </div>
                        </div>
                        <button 
                          onClick={() => setIsMeetNoorOpen(false)}
                          className="bg-white/20 hover:bg-white/30 p-2 rounded-full transition-colors"
                        >
                          <X size={20} />
                        </button>
                      </div>

                      {/* Lang Toggle */}
                      <div className="flex gap-2 mt-8 bg-white/10 p-1 rounded-2xl w-fit">
                        <button
                          onClick={() => setNoorLang('en')}
                          className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 ${
                            noorLang === 'en' ? 'bg-white text-brand-purple shadow-lg' : 'text-white/60 hover:text-white'
                          }`}
                        >
                          🇬🇧 English
                        </button>
                        <button
                          onClick={() => setNoorLang('ar')}
                          className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 ${
                            noorLang === 'ar' ? 'bg-white text-brand-purple shadow-lg' : 'text-white/60 hover:text-white'
                          }`}
                        >
                          🇴🇲 العربية
                        </button>
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className={`p-10 space-y-8 ${noorLang === 'ar' ? 'text-right' : 'text-left'} max-h-[60vh] overflow-y-auto scrollbar-hide`} dir={noorLang === 'ar' ? 'rtl' : 'ltr'}>
                      {noorLang === 'en' ? (
                        <div className="space-y-6">
                          <p className="text-xl font-bold text-slate-700 leading-relaxed">
                            Teacher Noor is your smart AI learning companion designed to help students learn independently, confidently, and interactively.
                          </p>
                          
                          <div className="space-y-4">
                            <h3 className="text-sm font-black uppercase tracking-widest text-brand-purple">Teacher Noor can:</h3>
                            <ul className="space-y-3">
                              {[
                                'Explain lessons step by step',
                                'Answer students’ questions instantly',
                                'Correct mistakes kindly',
                                'Encourage students to think independently',
                                'Make learning more fun and engaging'
                              ].map((item, i) => (
                                <li key={i} className="flex items-center gap-3 text-slate-600 font-medium bg-slate-50 p-3 rounded-2xl border border-slate-100">
                                  <span className="text-brand-purple text-lg">•</span>
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </div>

                          <p className="text-slate-500 font-medium">
                            The purpose of Teacher Noor is to support students inside and outside the classroom while reducing the need for constant parental help.
                          </p>
                          
                          <div className="p-6 bg-brand-yellow/10 rounded-3xl border-2 border-brand-yellow/20">
                            <p className="text-amber-900 font-bold text-sm">
                              Teacher Noor is specially designed to match the Omani school curriculum and create a safe, friendly, and motivating learning environment for every student.
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-6">
                          <p className="text-xl font-bold text-slate-700 leading-relaxed font-arabic">
                            المعلمة نور هي رفيقة تعليم ذكية تعمل بالذكاء الاصطناعي، صُممت لمساعدة الطلاب على التعلّم باستقلالية وثقة وبطريقة تفاعلية ممتعة.
                          </p>
                          
                          <div className="space-y-4">
                            <h3 className="text-sm font-black uppercase tracking-widest text-brand-blue">تستطيع المعلمة نور أن:</h3>
                            <ul className="space-y-3">
                              {[
                                'تشرح الدروس خطوة بخطوة',
                                'تجيب على أسئلة الطلاب فورًا',
                                'تصحح الأخطاء بطريقة لطيفة وواضحة',
                                'تشجع الطالب على التفكير والاستقلالية',
                                'تجعل التعلّم أكثر متعة وتفاعلًا'
                              ].map((item, i) => (
                                <li key={i} className="flex items-center gap-3 text-slate-600 font-medium bg-slate-50 p-3 rounded-2xl border border-slate-100">
                                  <span className="text-brand-blue text-lg">•</span>
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </div>

                          <p className="text-slate-500 font-medium">
                            الهدف من المعلمة نور هو دعم الطلاب داخل وخارج الصف وتقليل الحاجة إلى التدخل المستمر من أولياء الأمور.
                          </p>
                          
                          <div className="p-6 bg-brand-yellow/10 rounded-3xl border-2 border-brand-yellow/20">
                            <p className="text-amber-900 font-bold text-sm">
                              تم تصميم المعلمة نور لتناسب المنهج العُماني وتوفر بيئة تعليمية آمنة ومشجعة لكل طالب.
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>
            
            {/* Progress Dashboard Modal */}
            <AnimatePresence>
              {isProgressOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setIsProgressOpen(false)}
                    className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
                  />
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="relative w-full max-w-4xl bg-slate-50 rounded-[3rem] shadow-2xl overflow-hidden border-8 border-white flex flex-col h-[90vh] md:h-auto md:max-h-[85vh]"
                  >
                    {/* Header: Gamified Stats */}
                    <div className="bg-brand-purple p-8 md:p-10 text-white flex flex-col md:flex-row justify-between items-center gap-8 relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-10 opacity-10 pointer-events-none">
                        <Trophy size={160} />
                      </div>
                      
                      <div className="flex flex-col md:flex-row items-center gap-6 relative z-10 w-full md:w-auto">
                        <div className="w-24 h-24 rounded-3xl bg-white/20 backdrop-blur-md flex items-center justify-center border-2 border-white/30 shadow-inner group transition-transform hover:rotate-3">
                          <Star size={48} className="text-brand-yellow fill-brand-yellow animate-pulse" />
                        </div>
                        <div className="text-center md:text-left space-y-2">
                          <h2 className="text-4xl font-black tracking-tighter">Student Progress</h2>
                          <div className="flex flex-wrap justify-center md:justify-start gap-4">
                            <div className="flex items-center gap-2 bg-white/10 px-4 py-1.5 rounded-full border border-white/20">
                              <Flame size={14} className="text-orange-400" />
                              <span className="text-[10px] font-black uppercase tracking-widest">{stats.weeklyStreak} Day Streak</span>
                            </div>
                            <div className="flex items-center gap-2 bg-white/10 px-4 py-1.5 rounded-full border border-white/20">
                              <Trophy size={14} className="text-brand-yellow" />
                              <span className="text-[10px] font-black uppercase tracking-widest">Level {stats.level} Explorer</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white/10 backdrop-blur-md rounded-[2.5rem] p-6 border border-white/20 w-fit relative z-10">
                        <div className="flex items-center gap-4">
                          <div className="text-center">
                            <p className="text-[10px] font-black uppercase tracking-tighter opacity-100">Total Points</p>
                            <p className="text-4xl font-black text-brand-yellow drop-shadow-lg leading-none">{stats.totalPoints.toLocaleString()}</p>
                          </div>
                          <div className="w-[1px] h-10 bg-white/20" />
                          <div className="text-center">
                            <p className="text-[10px] font-black uppercase tracking-tighter opacity-100">Daily Goal</p>
                            <p className="text-4xl font-black text-white/90 leading-none">{stats.dailyPoints}/200</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Content Grid */}
                    <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-10 scrollbar-hide">
                      
                      {/* Weekly Summary Card */}
                      <motion.div 
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="bg-brand-purple/5 border-2 border-brand-purple/10 rounded-[2.5rem] p-8 flex flex-col md:flex-row items-center gap-8"
                      >
                        <div className="flex-1 space-y-4 text-center md:text-left">
                          <h3 className="text-2xl font-black text-slate-800 tracking-tight">Amazing work this week! 🌟</h3>
                          <p className="text-slate-500 font-medium leading-relaxed">
                            This week you learned for <span className="text-brand-purple font-black">{Math.floor(stats.learningMinutes / 60)} hours</span>, 
                            asked <span className="text-brand-purple font-black">{stats.weeklyQuestions} questions</span>, 
                            and earned <span className="text-brand-purple font-black">{(stats.weeklyQuestions * 10).toLocaleString()} points</span>!
                          </p>
                          <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-2">
                             {['Fast Learner', 'Curious mind', 'Top Speaker'].map(badge => (
                               <span key={badge} className="px-4 py-2 bg-white rounded-2xl shadow-sm border border-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-400">
                                 🏆 {badge}
                               </span>
                             ))}
                          </div>
                        </div>
                        <div className="shrink-0 w-32 h-32 md:w-40 md:h-40 relative">
                          <svg className="w-full h-full transform -rotate-90">
                            <circle cx="50%" cy="50%" r="45%" fill="none" stroke="#e2e8f0" strokeWidth="8" />
                            <circle cx="50%" cy="50%" r="45%" fill="none" stroke="#6C4AB6" strokeWidth="8" strokeDasharray="283" strokeDashoffset={283 - (283 * stats.progressToNextLevel) / 100} strokeLinecap="round" className="transition-all duration-1000" />
                          </svg>
                          <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-2xl font-black text-brand-purple leading-none">{stats.progressToNextLevel}%</span>
                            <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">To Lvl {stats.level + 1}</span>
                          </div>
                        </div>
                      </motion.div>

                      {/* Main Stats Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Weekly Stats Section */}
                        <div className="space-y-6">
                          <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2 px-2">
                             <BarChart2 size={14} className="text-brand-purple" /> Weekly Performance
                          </h3>
                          <div className="grid grid-cols-2 gap-4">
                            {[
                              { label: 'Conversations', val: stats.chatMessages, icon: <MessageCircle size={20} />, color: 'purple' },
                              { label: 'Avatar Sessions', val: stats.weeklySessions, icon: <Aperture size={20} />, color: 'purple' },
                              { label: 'Minutes Active', val: stats.learningMinutes, icon: <Clock size={20} />, color: 'green' },
                              { label: 'Total Questions', val: stats.questionsAsked, icon: <HelpCircle size={20} />, color: 'orange' }
                            ].map((item, i) => (
                              <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-shadow group">
                                <div className={`w-10 h-10 rounded-2xl bg-${item.color === 'blue' ? 'brand-purple' : item.color === 'purple' ? 'brand-purple' : item.color === 'green' ? 'emerald-500' : 'orange-500'}/10 text-${item.color === 'blue' ? 'brand-purple' : item.color === 'purple' ? 'brand-purple' : item.color === 'green' ? 'emerald-600' : 'orange-600'} flex items-center justify-center mb-4 transition-transform group-hover:-translate-y-1`}>
                                  {item.icon}
                                </div>
                                <p className="text-2xl font-black text-slate-800">{item.val}</p>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">{item.label}</p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Daily Stats Section */}
                        <div className="space-y-6">
                           <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2 px-2">
                             <TrendingUp size={14} className="text-brand-purple" /> Today's Focus
                          </h3>
                          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8 space-y-8">
                            <div className="space-y-6">
                               {[
                                 { label: 'Learning Minutes', current: stats.dailyMinutes, max: 60, icon: '⏱️' },
                                 { label: 'Point Bonus', current: stats.dailyPoints, max: 200, icon: '⭐' },
                                 { label: 'Accuracy', current: 92, max: 100, icon: '🎯' }
                               ].map((bar, i) => (
                                 <div key={i} className="space-y-2">
                                   <div className="flex justify-between items-center px-1">
                                      <span className="text-xs font-black text-slate-700 flex items-center gap-2">
                                        <span>{bar.icon}</span> {bar.label}
                                      </span>
                                      <span className="text-[10px] font-black text-slate-400">{bar.current}/{bar.max}</span>
                                   </div>
                                   <div className="h-3 bg-slate-50 rounded-full overflow-hidden border border-slate-100 p-0.5">
                                      <motion.div 
                                        initial={{ width: 0 }}
                                        animate={{ width: `${(bar.current / bar.max) * 100}%` }}
                                        transition={{ duration: 1, delay: i * 0.1 }}
                                        className="h-full bg-brand-purple rounded-full shadow-[0_0_10px_rgba(108,74,182,0.3)]"
                                      />
                                   </div>
                                 </div>
                               ))}
                            </div>
                            
                            <div className="p-6 bg-brand-green/5 rounded-3xl border-2 border-brand-green/10">
                              <p className="text-brand-green font-black text-xs uppercase tracking-widest mb-1 items-center flex gap-2">
                                <Zap size={12} fill="currentColor" /> Smart Insight
                              </p>
                              <p className="text-slate-600 font-bold text-sm">
                                You are becoming more independent every day! Your favorite feature is the interactive classroom.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <button 
                        onClick={() => setIsProgressOpen(false)}
                        className="w-full bg-slate-900 text-white p-6 rounded-[2rem] font-black uppercase tracking-[0.2em] hover:bg-slate-800 transition-all active:scale-[0.98]"
                      >
                        Keep Learning!
                      </button>
                    </div>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>

            {/* Quick Actions */}
            <div className="flex justify-center gap-8 md:gap-12 w-full">
              {mainActions.map((action, idx) => (
                <motion.button
                  key={action.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * idx }}
                  onClick={() => handleStartSession(action.id as 'talk' | 'chat')}
                  className="flex flex-col items-center gap-4 group"
                >
                  <div className={`w-20 h-20 md:w-28 md:h-28 ${action.color} rounded-[2.5rem] flex items-center justify-center text-4xl md:text-5xl shadow-xl border-4 border-white transform transition-all group-hover:scale-110 group-hover:rotate-3 group-active:scale-95`}>
                    {action.icon}
                  </div>
                  <span className="text-sm md:text-base font-black text-slate-700 tracking-tight transition-all group-hover:text-brand-purple">
                    {action.label}
                  </span>
                </motion.button>
              ))}
            </div>

            {/* Points Button (Upgraded to Dashboard Trigger) */}
            <motion.button 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              onClick={() => setIsProgressOpen(true)}
              className="bg-brand-yellow hover:bg-amber-400 px-8 py-4 rounded-full shadow-lg border-4 border-white transform -rotate-2 hover:rotate-0 transition-all active:scale-95 group"
            >
              <div className="flex items-center gap-3">
                <span className="text-white font-black text-2xl drop-shadow-sm">
                  ⭐ {stats.totalPoints.toLocaleString()} Points
                </span>
                <div className="bg-white/20 p-1.5 rounded-full group-hover:bg-white/30 transition-colors">
                   <ChevronRight size={18} className="text-white" />
                </div>
              </div>
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (view === 'talk-only') {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col p-4 md:p-8 font-sans items-center justify-center relative overflow-hidden">
        {/* Minimal Floating Top Bar */}
        <div className="absolute top-8 left-8 right-8 z-50 flex justify-between items-center pointer-events-none">
          <div className="flex gap-4 pointer-events-auto">
            <button 
              onClick={() => {
                setView('home');
                setActiveTheme(null);
              }}
              className="bg-white/10 hover:bg-white/20 text-white w-12 h-12 rounded-full flex items-center justify-center transition-all backdrop-blur-md border border-white/10 group shadow-2xl"
            >
              <Home size={20} className="group-hover:scale-110 transition-transform" />
            </button>
          </div>
          
          <div className="flex items-center gap-4 bg-black/40 backdrop-blur-md px-6 py-2 rounded-full border border-white/5 shadow-2xl pointer-events-auto">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-brand-green animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest text-white/60">Noor is Live</span>
            </div>
          </div>
        </div>

        <div className="w-full h-full max-w-[1800px] flex flex-col gap-6 md:gap-8 relative overflow-y-auto scrollbar-hide">
          {/* TOP ROW: AVATAR + PROMPTS */}
          <div className="flex flex-col lg:grid lg:grid-cols-12 gap-6 md:gap-8 shrink-0">
            {/* AVATAR IFRAME */}
            <div className="lg:col-span-7 min-h-[400px] lg:h-[700px] bg-slate-900 rounded-[3rem] overflow-hidden shadow-2xl relative border-4 border-white/5 flex items-center justify-center">
              <AIAvatar status={aiStatus} message={aiMessage} hideBubble voiceEnabled={voiceEnabled} />
            </div>

            {/* PROMPT SELECTION */}
            <div className="lg:col-span-5 flex flex-col h-full lg:h-[700px]">
              {!activeTheme ? (
                <div className="flex-1 bg-white/5 backdrop-blur-md rounded-[3rem] p-8 border border-white/10 flex flex-col items-center justify-center text-center space-y-6">
                  <Sparkles className="text-brand-yellow w-12 h-12 animate-bounce" />
                  <div className="space-y-2">
                    <h2 className="text-2xl font-black text-white tracking-tighter">What shall we learn?</h2>
                    <p className="text-white/60 text-xs font-bold">Pick a topic to start!</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 w-full">
                    {(Object.keys(THEMES) as Array<keyof typeof THEMES>).map(key => (
                      <button
                        key={key}
                        onClick={() => {
                          setActiveTheme(key);
                          setAiMessage(`Let's learn about ${THEMES[key].title}! I'm ready.`);
                          setAiStatus("speaking");
                        }}
                        className="p-6 bg-white/10 hover:bg-white/20 border border-white/10 rounded-[2rem] flex flex-col items-center gap-3 transition-all group active:scale-95"
                      >
                        <span className="text-3xl group-hover:scale-110 transition-transform">{THEMES[key].icon}</span>
                        <span className="text-[10px] font-black uppercase tracking-widest text-white">{THEMES[key].title}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex-1 bg-white/5 backdrop-blur-md rounded-[3rem] border border-white/10 p-8 space-y-6 flex flex-col h-full">
                  <div className="flex items-center justify-between">
                     <div className="flex items-center gap-3">
                       <span className="text-3xl">{THEMES[activeTheme].icon}</span>
                       <h3 className="font-black text-white uppercase tracking-widest text-sm">
                         {THEMES[activeTheme].title}
                       </h3>
                     </div>
                     <div className="flex items-center gap-3">
                       <button 
                         onClick={() => setVoiceEnabled(!voiceEnabled)}
                         className={`px-4 py-2 rounded-full border flex items-center gap-2 transition-all active:scale-95 ${
                           voiceEnabled 
                             ? 'bg-brand-purple/20 text-brand-purple border-brand-purple/30' 
                             : 'bg-white/10 text-white/60 border-white/10'
                         }`}
                       >
                         {voiceEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
                         <span className="text-[10px] font-black uppercase tracking-widest">
                           Voice {voiceEnabled ? 'ON' : 'OFF'}
                         </span>
                       </button>

                       <button 
                         onClick={() => setActiveTheme(null)}
                         className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white/60 hover:text-white rounded-full border border-white/10 transition-all active:scale-95 group"
                       >
                         <RefreshCcw size={12} className="group-hover:rotate-180 transition-transform duration-500" />
                         <span className="text-[10px] font-black uppercase tracking-widest">Change Topic</span>
                       </button>
                     </div>
                  </div>

                  <div className="flex flex-col gap-3 overflow-y-auto pr-2 scrollbar-hide">
                    {THEMES[activeTheme].simplePrompts.map((text, idx) => (
                      <motion.button
                        key={idx}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        onClick={() => {
                          const handlePrompt = () => {
                            setAiMessage(text);
                            setLastAiResponse(text);
                            setAiStatus("thinking");
                          };

                          if (voiceEnabled && window.speechSynthesis) {
                            const utterance = new SpeechSynthesisUtterance(text);
                            utterance.rate = 0.8; // Slow and clear for Grade 4
                            utterance.pitch = 1.1; // Slightly friendly pitch
                            utterance.onend = handlePrompt;
                            window.speechSynthesis.speak(utterance);
                          } else {
                            handlePrompt();
                          }
                        }}
                        className="w-full text-left px-6 py-4 bg-white/10 hover:bg-brand-purple hover:text-white border border-white/10 rounded-2xl text-xs font-black text-white/80 transition-all active:scale-95 group flex items-center justify-between"
                      >
                        {text}
                        <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0" />
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (view === 'chat-only') {
    return (
      <div className="min-h-screen bg-brand-light flex flex-col p-4 md:p-8 font-sans">
        <div className="max-w-4xl mx-auto w-full flex-1 flex flex-col gap-4">
          <div className="flex items-center justify-between bg-white p-4 px-6 rounded-[2.5rem] shadow-sm border-4 border-slate-50 relative">
            <button 
              onClick={() => setView('home')}
              className="p-3 hover:bg-slate-100 text-slate-600 rounded-2xl transition-all flex items-center justify-center shrink-0 border-2 border-transparent hover:border-slate-200 shadow-sm"
              aria-label="Back to Home"
            >
              <Home size={24} />
            </button>
            
            <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-3">
              <div className="w-10 h-10 bg-brand-purple rounded-xl flex items-center justify-center text-white font-black text-lg shadow-lg overflow-hidden rotate-3 group-hover:rotate-0 transition-all">
                <span className="text-2xl">👩🏻‍🏫</span>
              </div>
              <h2 className="font-black text-slate-800 text-xl tracking-tighter">Chat with Noor</h2>
            </div>

            <div className="flex items-center gap-2 pr-2">
              <div className="w-2 h-2 rounded-full bg-brand-green animate-pulse" />
              <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest hidden sm:block">Online</span>
            </div>
          </div>
          
          <div className="flex-1 min-h-0 bg-white rounded-[3rem] shadow-2xl border-4 border-slate-50 overflow-hidden">
            <AIChat 
              userRole={currentUser.role} 
              userLevel={currentUser.level} 
              showInternalHeader={false}
              onAnalysisStart={() => setAiStatus("thinking")}
              onAnalysisEnd={(type, response) => {
                handleStatUpdate(type as any);
                setAiStatus("idle");
              }}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-light flex text-slate-900 font-sans selection:bg-brand-purple/30">
      {/* Sidebar Navigation */}
      <aside className="w-24 lg:w-72 bg-white border-r-4 border-slate-100 py-10 flex flex-col justify-between items-center lg:items-start lg:px-8 fixed h-full z-10 transition-all">
        <div className="space-y-12 w-full text-center lg:text-left">
          <button 
            onClick={() => setView('home')}
            className="flex items-center gap-4 px-2 hover:scale-105 transition-transform group"
          >
            <div className="w-12 h-12 bg-brand-purple rounded-2xl flex items-center justify-center text-white shadow-xl rotate-6 group-hover:rotate-0 transition-all">
              <GraduationCap size={28} />
            </div>
            <span className="hidden lg:block font-black text-2xl tracking-tighter text-slate-800">Noor</span>
          </button>

          <nav className="space-y-4">
            {[
              { icon: LayoutDashboard, label: "Home", active: true, color: 'text-brand-purple bg-brand-purple/10' },
              { icon: BookOpen, label: "Library", color: 'text-brand-soft hover:bg-brand-soft/5' },
              { icon: Award, label: "Badges", color: 'text-brand-lavender hover:bg-brand-lavender/5' },
            ].map((item) => (
              <button
                key={item.label}
                className={`w-full flex items-center gap-4 p-4 rounded-3xl transition-all btn-bouncy ${
                  item.active 
                    ? item.color + " shadow-lg shadow-brand-purple/10" 
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
          <button 
            onClick={() => setIsProgressOpen(true)}
            className="w-full bg-brand-yellow/10 p-4 rounded-3xl border-2 border-brand-yellow/20 flex flex-col items-center hover:bg-brand-yellow/20 transition-all active:scale-95 group"
          >
             <span className="text-brand-yellow font-black text-xl group-hover:scale-110 transition-transform">⭐ {stats.totalPoints.toLocaleString()}</span>
             <span className="text-[8px] font-black uppercase tracking-widest text-brand-yellow/60 mt-1">View Stats</span>
          </button>
          <div className="w-full p-4 bg-slate-50 rounded-[2.5rem] flex flex-col lg:flex-row items-center gap-4 border-4 border-slate-100/50">
            <div className="w-12 h-12 rounded-2xl bg-brand-purple/10 flex items-center justify-center font-black text-brand-purple text-lg shadow-inner">
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
                {/* Teacher Section - Static Identity */}
                <div className="w-full flex flex-col gap-6">
                  <div className="bg-white rounded-[3rem] border-4 border-slate-50 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)] p-8 flex flex-col items-center justify-center text-center space-y-6 h-full min-h-[500px]">
                    <div className="relative group">
                      <div className="absolute inset-0 bg-brand-purple/5 rounded-full blur-2xl group-hover:bg-brand-purple/10 transition-colors" />
                      <div className="w-40 h-40 relative z-10 animate-float flex items-center justify-center text-8xl">
                        👩🏻‍🏫
                      </div>
                    </div>
                    <div className="space-y-2">
                       <h3 className="text-2xl font-black text-slate-800 tracking-tight">Teacher Noor</h3>
                       <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Your English Guide</p>
                    </div>
                    <div className="bg-brand-purple/10 px-6 py-2 rounded-full border-2 border-brand-purple/5">
                      <span className="text-brand-purple font-black text-sm">Online</span>
                    </div>
                  </div>
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
