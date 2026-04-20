/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "motion/react";
import { 
  Calendar, 
  BookOpen, 
  Award, 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  ChevronRight,
  Star,
  Users,
  MessageSquare,
  Zap
} from "lucide-react";
import { User, Assignment, CalendarEvent } from "../../types";

interface StudentDashboardProps {
  user: User;
  assignments: Assignment[];
  events: CalendarEvent[];
}

export function StudentDashboard({ user, assignments, events }: StudentDashboardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'submitted': return 'bg-brand-blue/10 text-brand-blue';
      case 'graded': return 'bg-brand-green/10 text-brand-green';
      default: return 'bg-brand-yellow/10 text-brand-yellow';
    }
  };

  const currentLevel = Math.floor(user.xp / 1000) + 1;
  const nextLevelXp = currentLevel * 1000;
  const progressPercent = ((user.xp % 1000) / 1000) * 100;

  return (
    <div className="space-y-10">
      {/* Top Banner: Level & XP Progress */}
      <div className="bg-brand-blue rounded-[3rem] p-8 text-white shadow-2xl shadow-brand-blue/30 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-brand-pink/20 rounded-full blur-2xl" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center shadow-xl rotate-3">
              <span className="text-4xl font-black text-brand-blue leading-none">{currentLevel}</span>
            </div>
            <div>
              <h1 className="text-4xl font-black tracking-tight">Super Learner {user.name}! 🚀</h1>
              <p className="text-brand-blue-100 font-bold opacity-80">You're on a learning adventure!</p>
            </div>
          </div>
          
          <div className="w-full md:w-64 space-y-3">
            <div className="flex justify-between font-black text-sm tracking-widest px-1">
              <span>XP: {user.xp}</span>
              <span>LVL {currentLevel + 1}</span>
            </div>
            <div className="h-6 bg-white/20 rounded-full p-1 overflow-hidden backdrop-blur-sm">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                className="h-full bg-brand-yellow rounded-full shadow-[0_0_15px_rgba(251,191,36,0.6)]"
              />
            </div>
            <p className="text-right text-[10px] font-black tracking-widest opacity-60">
              {nextLevelXp - (user.xp % 1000)} XP TO LEVEL UP!
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left Column: Missions & Tests */}
        <div className="lg:col-span-2 space-y-10">
          
          {/* Diagnostic Missions */}
          <section>
            <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3 mb-6">
              <Zap className="text-brand-yellow fill-brand-yellow" />
              Skill Quests
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                { id: 'T1', subject: 'Grammar', score: 85, level: 'Intermediate', date: 'Apr 10', color: 'brand-green' },
                { id: 'T2', subject: 'Vocabulary', score: 42, level: 'Beginner', date: 'Apr 15', color: 'brand-orange' },
              ].map((test) => (
                <motion.div 
                  whileHover={{ y: -8, scale: 1.02 }}
                  key={test.id} 
                  className={`bg-white p-6 rounded-[2.5rem] shadow-xl border-4 border-slate-100 relative overflow-hidden group`}
                >
                  <div className={`absolute top-0 right-0 w-32 h-32 bg-slate-50 -mr-16 -mt-16 rounded-full group-hover:scale-110 transition-transform`} />
                  
                  <div className="relative z-10">
                    <div className="flex justify-between items-start mb-6">
                      <div className={`p-4 rounded-3xl bg-slate-50 text-slate-700`}>
                        <Star className="w-6 h-6 fill-brand-yellow text-brand-yellow" />
                      </div>
                      <span className={`px-4 py-2 rounded-2xl text-xs font-black tracking-widest uppercase bg-slate-100 text-slate-500`}>
                        {test.level}
                      </span>
                    </div>
                    
                    <h4 className="text-2xl font-black text-slate-800 mb-2">{test.subject}</h4>
                    
                    <div className="flex items-end justify-between mt-6">
                      <div>
                        <span className="text-4xl font-black text-slate-900">{test.score}%</span>
                        <div className="w-24 h-2 bg-slate-100 rounded-full mt-2 overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${test.score}%` }}
                            className={`h-full ${test.score > 70 ? 'bg-brand-green' : 'bg-brand-orange'} rounded-full`}
                          />
                        </div>
                      </div>
                      <span className="text-xs font-bold text-slate-400 flex items-center gap-1 bg-slate-50 px-3 py-1.5 rounded-full">
                        <Clock size={14} /> {test.date}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Regular Assignments */}
          <section>
            <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3 mb-6">
              <BookOpen className="text-brand-blue" />
              Active Missions
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {assignments.map((assign) => (
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  key={assign.id} 
                  className="bg-white p-6 rounded-[2.5rem] shadow-xl border-4 border-brand-blue/5 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <div className="p-4 rounded-3xl bg-brand-blue/10">
                        <Zap className="text-brand-blue w-6 h-6 fill-brand-blue" />
                      </div>
                      <span className={`text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-widest ${getStatusColor(assign.status)}`}>
                        {assign.status}
                      </span>
                    </div>
                    <h4 className="text-xl font-black text-slate-900 mb-1">{assign.title}</h4>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">{assign.type} • DUES {assign.dueDate.toUpperCase()}</p>
                  </div>
                  <div className="mt-8 pt-6 border-t-4 border-slate-50 flex justify-between items-center">
                    <button className="text-sm font-black text-brand-blue hover:text-sky-600 transition-colors uppercase tracking-widest btn-bouncy">
                      {assign.status === 'pending' ? 'Go to Mission!' : 'See Awards'}
                    </button>
                    {assign.grade && (
                      <div className="bg-brand-pink text-white w-12 h-12 flex items-center justify-center rounded-2xl font-black text-xl shadow-lg rotate-12">
                        {assign.grade}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Column: Rewards & Calendar */}
        <div className="space-y-10">
          {/* Achievements Portal */}
          <section className="bg-brand-purple rounded-[3rem] p-8 text-white shadow-2xl shadow-brand-purple/30">
             <h2 className="text-2xl font-black flex items-center gap-3 mb-8">
                <Award className="text-brand-yellow fill-brand-yellow" />
                Collection
              </h2>
              <div className="space-y-4">
                {['Grammar Jedi', 'Word Wizard', 'Quick Learner'].map((badge, i) => (
                  <div 
                    key={badge}
                    className="bg-white/10 backdrop-blur-md p-4 rounded-[2rem] flex items-center gap-4 border-2 border-white/10"
                  >
                    <div className={`p-3 rounded-2xl ${i === 0 ? 'bg-brand-yellow' : i === 1 ? 'bg-brand-pink' : 'bg-brand-green'} shadow-lg`}>
                      <Star className="text-white w-6 h-6 fill-white" />
                    </div>
                    <div>
                      <p className="font-black text-lg leading-none">{badge}</p>
                      <p className="text-[10px] uppercase font-black tracking-widest opacity-60 mt-1">Found Apr 18</p>
                    </div>
                  </div>
                ))}
              </div>
          </section>

          {/* Calendar Adventure */}
          <section className="bg-white rounded-[3rem] p-8 shadow-xl border-4 border-slate-100">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-black text-slate-800 flex items-center gap-3">
                <Calendar className="text-brand-pink" />
                Adventure Log
              </h3>
            </div>
            <div className="space-y-6">
              {events.map((event, i) => (
                <div key={event.id} className="flex gap-6 group">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center font-black text-slate-400 group-hover:bg-brand-pink group-hover:text-white transition-all shadow-md group-hover:scale-110">
                      {i + 1}
                    </div>
                    <div className="w-2 h-full bg-slate-50 group-last:bg-transparent -mt-2" />
                  </div>
                  <div className="pb-8">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{event.start}</p>
                    <h5 className="font-black text-lg text-slate-900 mt-1">{event.title}</h5>
                    <p className="text-sm font-medium text-slate-500 mt-1">{event.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
