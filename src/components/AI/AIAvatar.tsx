/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, AnimatePresence } from "motion/react";

interface AIAvatarProps {
  status?: "idle" | "speaking" | "thinking" | "encouraging";
  message?: string;
}

export function AIAvatar({ message }: AIAvatarProps) {
  return (
    <div className="flex flex-col items-center justify-start p-4 lg:p-6 space-y-6 h-full min-h-[600px]">
      <div className="relative w-full bg-slate-900 rounded-[2rem] overflow-hidden shadow-2xl border-4 border-slate-50">
        <iframe 
          src="https://bey.chat/700574d2-d244-4cb5-944d-8e3afed85408" 
          title="Teacher Noor Avatar"
          className="w-full h-[350px] md:h-[500px]"
          frameBorder="0"
          allowFullScreen
          allow="camera; microphone; fullscreen"
          style={{ border: 'none', maxWidth: '100%' }}
        />
      </div>

      <AnimatePresence mode="wait">
        {message && (
          <motion.div
            key={message}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex-1 w-full bg-brand-blue/5 p-6 rounded-[2rem] border-2 border-brand-blue/10 overflow-y-auto max-h-[250px] relative scrollbar-hide"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-brand-blue animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest text-brand-blue/40">Teacher Noor says:</span>
            </div>
            <p className="text-slate-700 font-bold text-base leading-relaxed">
              {message}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
