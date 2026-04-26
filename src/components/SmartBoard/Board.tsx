/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { BookOpen, Sparkles, X, RotateCcw, Volume2 } from "lucide-react";

interface SmartBoardProps {
  onActivity?: (type: string) => void;
  aiResponse?: string;
}

export function SmartBoard({ onActivity, aiResponse }: SmartBoardProps) {
  const [points, setPoints] = useState<string[]>([]);
  const [flashcards, setFlashcards] = useState<string[]>([]);

  // Process AI Response automatically
  useEffect(() => {
    if (aiResponse && aiResponse.trim()) {
      let keypoints: string[] = [];
      let visuals: string[] = [];

      try {
        // Check if the response is our structured JSON
        if (aiResponse.startsWith('{')) {
          const parsed = JSON.parse(aiResponse);
          keypoints = parsed.keypoints || [];
          visuals = parsed.visuals || [];
        }
      } catch (e) {
        // Fallback to text extraction if not JSON
        keypoints = aiResponse
          .split(/[.!?]+/)
          .map(s => s.trim())
          .filter(s => {
            const words = s.split(/\s+/).length;
            return words >= 5 && words <= 20;
          })
          .slice(0, 4);

        const stopWords = new Set(['about', 'their', 'there', 'could', 'would', 'should', 'these', 'those', 'because', 'through']);
        visuals = aiResponse
          .replace(/[.,!?;:()]/g, "")
          .split(/\s+/)
          .filter(w => w.length > 5 && !stopWords.has(w.toLowerCase()) && /^[a-zA-Z]+$/.test(w))
          .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
          .slice(0, 6);
      }

      if (keypoints.length > 0) {
        setPoints(prev => {
          const combined = [...new Set([...keypoints, ...prev])];
          return combined.slice(0, 8);
        });
      }

      if (visuals.length > 0) {
        setFlashcards(prev => {
          const combined = [...new Set([...visuals, ...prev])];
          return combined.slice(0, 12);
        });
      }

      onActivity?.('text');
    }
  }, [aiResponse, onActivity]);

  const clearBoard = () => {
    setPoints([]);
    setFlashcards([]);
  };

  const speak = (text: string) => {
    const response = new SpeechSynthesisUtterance(text);
    response.rate = 0.9;
    window.speechSynthesis.speak(response);
  };

  return (
    <div className="space-y-8 h-full flex flex-col">
      {/* Smart Board Area */}
      <div className="flex-1 bg-white rounded-[3rem] border-8 border-slate-100 shadow-2xl overflow-hidden flex flex-col relative">
        <div className="bg-brand-green p-6 flex justify-between items-center border-b-4 border-black/5">
          <h2 className="text-white font-black text-2xl flex items-center gap-3">
            <Sparkles size={28} strokeWidth={3} className="fill-white/20" />
            Magic Board
          </h2>
          <button 
            onClick={clearBoard}
            className="px-4 py-2 bg-white/20 text-white rounded-2xl font-black text-sm hover:bg-white/30 transition-all border-2 border-white/10"
          >
            Clear
          </button>
        </div>

        <div className="flex-1 p-8 overflow-y-auto space-y-4 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px] scroll-smooth">
          <AnimatePresence initial={false}>
            {points.map((point, i) => (
              <motion.div
                key={point}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className="bg-white p-6 rounded-[2.5rem] shadow-sm border-4 border-slate-50 flex items-center gap-6 group hover:border-brand-blue/20 transition-all cursor-default"
              >
                <div className="w-12 h-12 rounded-2xl bg-brand-green/10 flex items-center justify-center font-black text-brand-green text-xl shrink-0 group-hover:scale-110 transition-transform">
                  {i + 1}
                </div>
                <p className="font-bold text-lg text-slate-800 flex-1 leading-snug">{point}</p>
                <button 
                  onClick={() => speak(point)}
                  className="p-3 opacity-0 group-hover:opacity-100 text-brand-blue bg-brand-blue/5 rounded-xl hover:bg-brand-blue/10 transition-all"
                >
                  <Volume2 size={24} strokeWidth={3} />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>

          {points.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-30 grayscale">
              <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-6">
                <Sparkles size={48} className="text-slate-400" />
              </div>
              <p className="font-black text-2xl tracking-tighter text-slate-800">Ready for class!</p>
              <p className="text-sm font-bold max-w-[200px] mt-2 text-slate-500">I will capture key points while Teacher Noor speaks.</p>
            </div>
          )}
        </div>

        <div className="p-8 bg-slate-50/50 flex justify-center border-t-4 border-white">
          <div className="flex items-center gap-4 px-10 py-5 rounded-[2.5rem] font-black text-xl bg-white border-4 border-brand-blue/10 text-brand-blue shadow-lg">
            <div className="flex gap-1.5 items-end h-6">
              <motion.span 
                animate={{ height: [8, 20, 8] }}
                transition={{ repeat: Infinity, duration: 1 }}
                className="w-1.5 bg-brand-blue rounded-full" 
              />
              <motion.span 
                animate={{ height: [12, 24, 12] }}
                transition={{ repeat: Infinity, duration: 1, delay: 0.2 }}
                className="w-1.5 bg-brand-blue rounded-full" 
              />
              <motion.span 
                animate={{ height: [8, 16, 8] }}
                transition={{ repeat: Infinity, duration: 1, delay: 0.4 }}
                className="w-1.5 bg-brand-blue rounded-full" 
              />
            </div>
            Synced with Teacher Noor
          </div>
        </div>
      </div>

      {/* Flashcards Section */}
      <section>
        <h3 className="text-2xl font-black text-slate-800 flex items-center gap-3 mb-6">
          <Sparkles className="text-brand-yellow fill-brand-yellow" />
          Keywords
        </h3>
        <div className="flex flex-wrap gap-4">
          <AnimatePresence>
            {flashcards.map((word, i) => (
              <motion.div
                key={word}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                whileHover={{ rotate: [-2, 2, -2] }}
                className={`px-8 py-5 rounded-[2rem] shadow-xl border-4 font-black transition-all cursor-pointer relative group flex items-center gap-3 ${
                  i % 3 === 0 ? 'bg-brand-blue/5 border-brand-blue/20 text-brand-blue' :
                  i % 3 === 1 ? 'bg-brand-pink/5 border-brand-pink/20 text-brand-pink' :
                  'bg-brand-purple/5 border-brand-purple/20 text-brand-purple'
                }`}
                onClick={() => speak(word)}
              >
                <span className="text-xl">{word}</span>
                <Volume2 size={16} className="opacity-40 group-hover:opacity-100 transition-opacity" />
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setFlashcards(prev => prev.filter(w => w !== word));
                  }}
                  className="absolute -top-2 -right-2 p-1 bg-white rounded-full shadow-md border-2 border-slate-100 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={12} className="text-slate-400" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
          {flashcards.length === 0 && (
            <p className="text-sm font-bold text-slate-400 italic px-4">Speak to unlock new words!</p>
          )}
        </div>
      </section>
    </div>
  );
}
