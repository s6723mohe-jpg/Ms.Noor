/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Send, Upload, Mic, Video, Paperclip, X } from "lucide-react";
import { ChatMessage } from "../../types";
import { ai, MODELS, AI_CONFIG } from "../../services/geminiService";

interface AIChatProps {
  userRole: string;
  userLevel: string;
  onAnalysisStart?: () => void;
  onAnalysisEnd?: () => void;
}

export function AIChat({ userRole, userLevel, onAnalysisStart, onAnalysisEnd }: AIChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);
    onAnalysisStart?.();

    try {
      const chat = ai.chats.create({
        model: MODELS.flash,
        config: {
          systemInstruction: AI_CONFIG.systemInstruction(userRole, userLevel),
        },
      });

      const result = await chat.sendMessage({
        message: input,
      });

      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: result.text || "I'm sorry, I couldn't process that.",
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (error) {
      console.error("AI Chat Error:", error);
    } finally {
      setIsTyping(false);
      onAnalysisEnd?.();
    }
  };

  return (
    <div className="flex flex-col h-[600px] bg-white rounded-[2.5rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.05)] border-4 border-slate-100">
      {/* Header */}
      <div className="bg-brand-blue p-5 flex items-center justify-between border-b-4 border-black/5">
        <h3 className="text-white font-black text-xl flex items-center gap-3">
          <div className="w-4 h-4 rounded-full bg-brand-green border-2 border-white shadow-sm" />
          Ms. Noor's Chat
        </h3>
        <div className="bg-white/20 px-3 py-1 rounded-full text-xs text-white font-bold tracking-wider">
          {userLevel.toUpperCase()}
        </div>
      </div>

      {/* Messages */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50 scroll-smooth"
      >
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, scale: 0.8, x: msg.role === "user" ? 20 : -20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] p-5 rounded-[2rem] shadow-sm relative ${
                  msg.role === "user"
                    ? "bg-brand-purple text-white rounded-tr-none"
                    : "bg-white text-slate-700 rounded-tl-none border-2 border-slate-100 font-medium"
                }`}
              >
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                <span className={`text-[10px] mt-2 block opacity-50 font-bold ${
                  msg.role === "user" ? "text-right" : "text-left"
                }`}>
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
                
                {/* Visual accent bubbles */}
                <div className={`absolute -bottom-1 ${msg.role === 'user' ? '-right-1' : '-left-1'} w-3 h-3 rounded-full bg-inherit`} />
              </div>
            </motion.div>
          ))}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="bg-white p-4 rounded-3xl flex gap-2 border-2 border-slate-50">
                <span className="w-2 h-2 rounded-full bg-brand-blue animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-brand-green animate-bounce [animation-delay:0.2s]" />
                <span className="w-2 h-2 rounded-full bg-brand-orange animate-bounce [animation-delay:0.4s]" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Input */}
      <div className="p-6 bg-white border-t-2 border-slate-50">
        <div className="flex items-center gap-3 mb-4">
          <button className="p-3 bg-brand-pink/10 text-brand-pink rounded-2xl hover:bg-brand-pink/20 transition-all btn-bouncy">
            <Paperclip size={24} />
          </button>
          <button className="p-3 bg-brand-orange/10 text-brand-orange rounded-2xl hover:bg-brand-orange/20 transition-all btn-bouncy">
            <Mic size={24} />
          </button>
          <button className="p-3 bg-brand-green/10 text-brand-green rounded-2xl hover:bg-brand-green/20 transition-all btn-bouncy">
            <Video size={24} />
          </button>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Type your question..."
            className="flex-1 bg-slate-100 border-none rounded-2xl px-6 py-4 text-sm font-bold placeholder:text-slate-400 focus:ring-4 focus:ring-brand-blue/10 transition-all outline-none"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="bg-brand-blue text-white p-4 rounded-2xl hover:bg-sky-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-sky-200 btn-bouncy"
          >
            <Send size={24} />
          </button>
        </div>
      </div>
    </div>
  );
}
