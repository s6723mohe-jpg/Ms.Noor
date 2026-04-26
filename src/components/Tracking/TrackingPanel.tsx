/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "motion/react";
import { Star, Zap, Trophy, Flame, Target } from "lucide-react";

interface TrackingPanelProps {
  stats: {
    messagesSent: number;
    filesUploaded: number;
    voiceRecordings: number;
    starsEarned: number;
    streak: number;
  };
}

export function TrackingPanel({ stats }: TrackingPanelProps) {
  const levelProgress = (stats.messagesSent % 10) * 10;
  const currentLevel = Math.floor(stats.messagesSent / 10) + 1;

  return (
    <div className="bg-white rounded-[3rem] p-8 border-4 border-slate-50 shadow-xl shadow-slate-200/50 space-y-8 h-full">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-black text-slate-800 tracking-tighter">Your Progress 🏆</h2>
        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Hero Stats</p>
      </div>

      {/* Level Card */}
      <div className="bg-brand-blue rounded-[2.5rem] p-6 text-white shadow-xl shadow-brand-blue/20 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:rotate-12 transition-transform">
          <Trophy size={80} strokeWidth={1} />
        </div>
        <div className="relative z-10">
          <div className="flex justify-between items-end mb-4">
            <div>
              <p className="text-xs font-black text-white/70 uppercase tracking-widest">Level</p>
              <h3 className="text-5xl font-black">{currentLevel}</h3>
            </div>
            <div className="text-right">
              <p className="text-xs font-black text-white/70 uppercase tracking-widest">Mastery</p>
              <p className="text-xl font-black">{levelProgress}%</p>
            </div>
          </div>
          <div className="w-full h-4 bg-white/20 rounded-full overflow-hidden shadow-inner border border-white/10">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${levelProgress}%` }}
              className="h-full bg-brand-yellow rounded-full"
            />
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-brand-green/10 p-5 rounded-[2rem] text-center border-2 border-brand-green/20 group hover:scale-105 transition-transform">
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-brand-green shadow-sm mx-auto mb-3">
            <Star size={24} className="fill-brand-green" />
          </div>
          <p className="text-2xl font-black text-slate-800">{stats.starsEarned}</p>
          <p className="text-[10px] font-black text-brand-green uppercase tracking-widest">Stars</p>
        </div>

        <div className="bg-brand-orange/10 p-5 rounded-[2rem] text-center border-2 border-brand-orange/20 group hover:scale-105 transition-transform">
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-brand-orange shadow-sm mx-auto mb-3">
            <Flame size={24} className="fill-brand-orange" />
          </div>
          <p className="text-2xl font-black text-slate-800">{stats.streak}</p>
          <p className="text-[10px] font-black text-brand-orange uppercase tracking-widest">Streak</p>
        </div>

        <div className="bg-brand-purple/10 p-5 rounded-[2rem] text-center border-2 border-brand-purple/20 group hover:scale-105 transition-transform">
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-brand-purple shadow-sm mx-auto mb-3">
            <Zap size={24} className="fill-brand-purple" />
          </div>
          <p className="text-2xl font-black text-slate-800">{stats.messagesSent}</p>
          <p className="text-[10px] font-black text-brand-purple uppercase tracking-widest">Quests</p>
        </div>

        <div className="bg-brand-pink/10 p-5 rounded-[2rem] text-center border-2 border-brand-pink/20 group hover:scale-105 transition-transform">
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-brand-pink shadow-sm mx-auto mb-3">
            <Target size={24} />
          </div>
          <p className="text-2xl font-black text-slate-800">{stats.filesUploaded + stats.voiceRecordings}</p>
          <p className="text-[10px] font-black text-brand-pink uppercase tracking-widest">Evidence</p>
        </div>
      </div>

      {/* Badges Preview */}
      <div className="space-y-4">
        <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Unlocked Badges</p>
        <div className="flex flex-wrap gap-3">
          {['🚀', '📚', '🎙️', '🖼️'].map((emoji, i) => (
            <div 
              key={i}
              className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-md border-2 border-slate-50 ${
                i < 2 ? 'bg-white opacity-100' : 'bg-slate-50 opacity-30 grayscale'
              }`}
            >
              {emoji}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
