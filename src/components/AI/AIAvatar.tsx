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
    <div className="flex flex-col items-center justify-center p-4 lg:p-8 space-y-6">
      <div className="relative w-full max-w-2xl bg-slate-900 rounded-[2.5rem] overflow-hidden shadow-2xl border-8 border-white shadow-brand-blue/20">
        <iframe 
          src="https://embed.liveavatar.com/v1/1a57e87b-50c1-4c49-a1fa-f058d784f138" 
          allow="microphone" 
          title="LiveAvatar Embed" 
          className="w-full"
          style={{ aspectRatio: '16/9' }}
        />
      </div>

      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="bg-white px-8 py-5 rounded-[2rem] shadow-xl border-4 border-brand-blue/10 max-w-sm relative"
          >
            {/* Speech bubble tail */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-white rotate-45 border-l-4 border-t-4 border-brand-blue/10" />
            <p className="text-slate-700 font-bold text-lg text-center leading-tight">
              {message}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
