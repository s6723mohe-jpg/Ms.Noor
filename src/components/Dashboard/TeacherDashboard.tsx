/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "motion/react";
import { 
  Users, 
  Lightbulb, 
  FileText, 
  BarChart3, 
  Plus, 
  Search,
  CheckCircle,
  AlertTriangle,
  Send,
  Loader2,
  ChevronRight
} from "lucide-react";
import { User, ClassInsight } from "../../types";
import { useState } from "react";
import { AnimatePresence } from "motion/react";
import { ai, MODELS, AI_CONFIG } from "../../services/geminiService";

interface TeacherDashboardProps {
  user: User;
  insights: ClassInsight;
}

export function TeacherDashboard({ user, insights }: TeacherDashboardProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<string | null>(null);

  const generateQuiz = async () => {
    setIsGenerating(true);
    try {
      const response = await ai.models.generateContent({
        model: MODELS.flash,
        config: {
          systemInstruction: AI_CONFIG.systemInstruction(user.role, "professional"),
        },
        contents: "Generate a 5-question MCQ English quiz about 'Past Continuous Tense' for intermediate students. Format as a readable list.",
      });
      setGeneratedContent(response.text || null);
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 bg-white p-10 rounded-[3rem] border-4 border-slate-50 shadow-xl shadow-slate-200/50">
        <div>
          <h1 className="text-4xl font-black text-slate-800 tracking-tighter">Command Center 🏛️</h1>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-xs mt-2">Managing Class 10-A • English Philology</p>
        </div>
        <div className="flex gap-4">
          <button className="flex items-center gap-3 px-6 py-4 bg-brand-blue text-white rounded-[2rem] font-black shadow-xl shadow-brand-blue/20 hover:bg-sky-500 transition-all btn-bouncy">
            <Plus size={22} strokeWidth={3} /> New Quest
          </button>
          <button className="flex items-center gap-3 px-6 py-4 bg-slate-50 text-slate-600 rounded-[2rem] font-black border-4 border-transparent hover:border-slate-100 transition-all btn-bouncy">
            <Search size={22} strokeWidth={3} /> Seek Student
          </button>
        </div>
      </div>

      {/* Class Statistics & AI Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Core Stats */}
        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-[3rem] border-4 border-brand-green/10 shadow-xl shadow-slate-200/30 group">
            <div className="flex items-center justify-between mb-6">
              <span className="p-4 bg-brand-green/10 text-brand-green rounded-[2rem] group-hover:scale-110 transition-transform">
                <CheckCircle size={28} strokeWidth={3} />
              </span>
              <span className="text-sm font-black text-brand-green bg-brand-green/10 px-3 py-1 rounded-full">+12%</span>
            </div>
            <p className="text-slate-400 font-black text-xs uppercase tracking-widest font-mono">Squad Skill</p>
            <h3 className="text-4xl font-black text-slate-800 mt-2">78.5%</h3>
          </div>
          
          <div className="bg-white p-8 rounded-[3rem] border-4 border-brand-yellow/10 shadow-xl shadow-slate-200/30 group">
            <div className="flex items-center justify-between mb-6">
              <span className="p-4 bg-brand-yellow/10 text-brand-yellow rounded-[2rem] group-hover:scale-110 transition-transform">
                <Users size={28} strokeWidth={3} />
              </span>
              <span className="text-sm font-black text-brand-yellow bg-brand-yellow/10 px-3 py-1 rounded-full">28/30</span>
            </div>
            <p className="text-slate-400 font-black text-xs uppercase tracking-widest font-mono">Present Heroes</p>
            <h3 className="text-4xl font-black text-slate-800 mt-2">93%</h3>
          </div>

          <div className="bg-white p-8 rounded-[3rem] border-4 border-brand-orange/10 shadow-xl shadow-slate-200/30 group">
            <div className="flex items-center justify-between mb-6">
              <span className="p-4 bg-brand-orange/10 text-brand-orange rounded-[2rem] group-hover:scale-110 transition-transform">
                <AlertTriangle size={28} strokeWidth={3} />
              </span>
              <span className="text-sm font-black text-brand-orange bg-brand-orange/10 px-3 py-1 rounded-full text-center">4 ALERT</span>
            </div>
            <p className="text-slate-400 font-black text-xs uppercase tracking-widest font-mono">Action Needed</p>
            <h3 className="text-4xl font-black text-slate-800 mt-2">15</h3>
          </div>
        </div>

        {/* AI Insight Sidebar */}
        <div className="bg-brand-purple text-white rounded-[3rem] p-8 shadow-2xl shadow-brand-purple/30 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:rotate-12 transition-transform">
            <Lightbulb size={140} strokeWidth={1} />
          </div>
          <h3 className="text-xl font-black flex items-center gap-3 mb-6">
            <Lightbulb className="text-brand-yellow fill-brand-yellow" strokeWidth={3} />
            Ms. Noor's Insights
          </h3>
          <p className="text-base font-medium text-brand-purple-100 mb-8 leading-relaxed opacity-90">
            {insights.summary}
          </p>
          <div className="space-y-4">
            <p className="text-xs font-black text-white/50 uppercase tracking-widest">Class Challenges</p>
            <div className="flex flex-wrap gap-2">
              {insights.commonMistakes.map(m => (
                <span key={m} className="bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border border-white/5">{m}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Student Performance List */}
        <section className="bg-white rounded-[3rem] p-10 border-4 border-slate-50 shadow-xl shadow-slate-200/30">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3">
              <BarChart3 className="text-brand-blue" strokeWidth={3} />
              Hero Progress
            </h2>
          </div>
          <div className="space-y-8">
            {[
              { name: "Alice Johnson", score: 95, trending: "up", status: "Top Performer", color: 'brand-green' },
              { name: "Bob Smith", score: 48, trending: "down", status: "Needs Support", color: 'brand-orange' },
              { name: "Charlie Davis", score: 72, trending: "neutral", status: "Stable", color: 'brand-blue' },
              { name: "Diana Prince", score: 88, trending: "up", status: "Rising Star", color: 'brand-purple' },
            ].map((student) => (
              <div key={student.name} className="flex items-center justify-between group cursor-pointer hover:bg-slate-50 p-4 -m-4 rounded-[2rem] transition-colors">
                <div className="flex items-center gap-6">
                  <div className={`w-14 h-14 rounded-2xl bg-brand-blue/10 flex items-center justify-center font-black text-brand-blue text-xl shadow-inner group-hover:scale-110 transition-transform`}>
                    {student.name.charAt(0)}
                  </div>
                  <div>
                    <h5 className="font-black text-lg text-slate-900 leading-none">{student.name}</h5>
                    <p className={`text-[10px] font-black uppercase tracking-widest mt-2 ${
                      student.status === 'Needs Support' ? 'text-brand-orange' : 'text-brand-blue'
                    }`}>
                      {student.status}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="font-black text-xl text-slate-900">{student.score}%</p>
                    <div className="w-32 h-3 bg-slate-100 rounded-full mt-2 overflow-hidden shadow-inner">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${student.score}%` }}
                        className={`h-full bg-brand-blue rounded-full`} 
                      />
                    </div>
                  </div>
                  <div className="p-2 bg-slate-50 rounded-xl group-hover:bg-brand-blue group-hover:text-white transition-colors">
                    <ChevronRight size={20} strokeWidth={3} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* AI Content Generator */}
        <section className="bg-white rounded-[3rem] p-10 border-4 border-slate-50 shadow-xl shadow-slate-200/30 flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3">
              <FileText className="text-brand-orange" strokeWidth={3} />
              Magic Quiz Maker
            </h2>
            <button 
              onClick={generateQuiz}
              disabled={isGenerating}
              className="px-6 py-3 bg-brand-orange/10 text-brand-orange font-black rounded-2xl hover:bg-brand-orange/20 transition-all flex items-center gap-2 disabled:opacity-50 btn-bouncy"
            >
              {isGenerating ? <Loader2 className="animate-spin" size={20} /> : <Plus size={20} strokeWidth={3} />}
              Generate magic!
            </button>
          </div>
          
          <div className="flex-1 min-h-[350px] bg-slate-50 rounded-[2.5rem] p-8 border-4 border-white shadow-inner relative overflow-hidden">
            <AnimatePresence mode="wait">
              {generatedContent ? (
                <motion.div
                  key="content"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="prose prose-sm max-w-none text-slate-700"
                >
                   <div className="bg-white p-6 rounded-3xl border-2 border-slate-100 shadow-sm">
                    <pre className="font-sans whitespace-pre-wrap text-sm font-bold opacity-80">{generatedContent}</pre>
                   </div>
                  <div className="mt-8 flex gap-4">
                    <button className="flex-1 py-4 bg-brand-green text-white font-black rounded-[2rem] shadow-xl shadow-brand-green/20 hover:bg-emerald-500 transition-all flex items-center justify-center gap-2 btn-bouncy">
                      <Send size={18} strokeWidth={3} /> Launch to Class!
                    </button>
                    <button onClick={() => setGeneratedContent(null)} className="px-6 py-4 bg-white border-4 border-slate-100 text-slate-400 font-black rounded-[2rem] hover:bg-slate-50 transition-all btn-bouncy">
                      Try Again
                    </button>
                  </div>
                </motion.div>
              ) : (
                <div key="placeholder" className="h-full flex flex-col items-center justify-center text-center opacity-30">
                  <div className="w-20 h-20 bg-slate-200 rounded-full flex items-center justify-center mb-4">
                    <FileText size={40} />
                  </div>
                  <p className="text-lg font-black tracking-tight">Ready to create some magic?</p>
                  <p className="text-sm font-bold mt-1 max-w-[200px]">Click the button to generate a level-adaptive quiz!</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </section>
      </div>
    </div>
  );
}
