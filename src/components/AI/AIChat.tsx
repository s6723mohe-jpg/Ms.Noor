/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Send, Upload, Mic, Video, Paperclip, X } from "lucide-react";
import { ChatMessage } from "../../types";
import { ai, MODELS, AI_CONFIG } from "../../services/geminiService";

interface AIChatProps {
  userRole: string;
  userLevel: string;
  onAnalysisStart?: () => void;
  onAnalysisEnd?: (type: 'text' | 'file' | 'voice', response?: string) => void;
}

export function AIChat({ userRole, userLevel, onAnalysisStart, onAnalysisEnd }: AIChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = (reader.result as string).split(',')[1];
        resolve(base64String);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handleSend = async (customConfig?: { audioBase64?: string, fileBase64?: string, mimeType?: string, text?: string }) => {
    const textMsg = customConfig?.text || input;
    if (!textMsg.trim() && !customConfig?.audioBase64 && !customConfig?.fileBase64) return;

    const interactionType: 'text' | 'file' | 'voice' = customConfig?.audioBase64 ? 'voice' : (customConfig?.fileBase64 || attachedFile ? 'file' : 'text');

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: textMsg || (interactionType === 'voice' ? "🎤 Audio message sent" : "📁 File sent"),
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setAttachedFile(null);
    setIsTyping(true);
    onAnalysisStart?.();

    try {
      const parts: any[] = [];
      if (textMsg) parts.push({ text: textMsg });
      
      if (customConfig?.audioBase64) {
        parts.push({
          inlineData: {
            mimeType: customConfig.mimeType || "audio/wav",
            data: customConfig.audioBase64
          }
        });
      }

      if (customConfig?.fileBase64) {
        parts.push({
          inlineData: {
            mimeType: customConfig.mimeType || "application/pdf",
            data: customConfig.fileBase64
          }
        });
      } else if (attachedFile) {
        const base64 = await fileToBase64(attachedFile);
        parts.push({
          inlineData: {
            mimeType: attachedFile.type,
            data: base64
          }
        });
      }

      const result = await ai.models.generateContent({
        model: MODELS.flash,
        contents: { parts },
        config: {
          systemInstruction: AI_CONFIG.systemInstruction(userRole, userLevel),
        },
      });

      let responseContent = result.text || "I'm sorry, I couldn't process that.";
      let parsedResponse: any = null;

      try {
        // Try to parse JSON from the response
        const jsonMatch = responseContent.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          parsedResponse = JSON.parse(jsonMatch[0]);
          responseContent = parsedResponse.speech || responseContent;
        }
      } catch (e) {
        console.warn("Could not parse AI response as JSON", e);
      }

      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: responseContent,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, aiMsg]);
      onAnalysisEnd?.(interactionType, parsedResponse ? JSON.stringify(parsedResponse) : responseContent);
    } catch (error) {
      console.error("AI Chat Error:", error);
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Oops! My magic wand is a bit tired. Can you try again?",
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      audioChunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      recorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = () => {
          const base64 = (reader.result as string).split(',')[1];
          handleSend({ audioBase64: base64, mimeType: 'audio/wav', text: "Analyzing your voice recording..." });
        };
        stream.getTracks().forEach(track => track.stop());
      };

      recorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Microphone error:", err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setAttachedFile(e.target.files[0]);
    }
  };

  return (
    <div className="flex flex-col h-[700px] bg-white rounded-[3rem] overflow-hidden shadow-[0_30px_100px_rgba(0,0,0,0.08)] border-4 border-slate-50">
      {/* Header */}
      <div className="bg-brand-blue p-6 flex flex-col gap-2 border-b-4 border-black/5">
        <div className="flex items-center justify-between">
          <h3 className="text-white font-black text-xl flex items-center gap-3">
            <div className="w-5 h-5 rounded-full bg-brand-green border-4 border-white shadow-sm" />
            Ask Teacher Noor
          </h3>
          <span className="text-[10px] text-white/60 font-black uppercase tracking-widest">Smart Help 🤖</span>
        </div>
        <p className="text-brand-blue-100 text-[10px] font-bold opacity-80 uppercase tracking-tighter">
          Homework • Questions • Image Help • Voice
        </p>
      </div>

      {/* Messages */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-8 space-y-8 bg-slate-50/30 scroll-smooth"
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
                className={`max-w-[85%] p-6 rounded-[2.5rem] shadow-sm relative ${
                  msg.role === "user"
                    ? "bg-brand-purple text-white rounded-tr-none"
                    : "bg-white text-slate-700 rounded-tl-none border-4 border-slate-50 font-bold"
                }`}
              >
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                <span className={`text-[10px] mt-3 block opacity-40 font-black ${
                  msg.role === "user" ? "text-right" : "text-left"
                }`}>
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
                <div className={`absolute -bottom-1 ${msg.role === 'user' ? '-right-1' : '-left-1'} w-4 h-4 rounded-full bg-inherit`} />
              </div>
            </motion.div>
          ))}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="bg-white p-5 rounded-[2rem] flex gap-3 border-4 border-slate-50 shadow-sm">
                <div className="w-3 h-3 rounded-full bg-brand-blue animate-bounce" />
                <div className="w-3 h-3 rounded-full bg-brand-green animate-bounce [animation-delay:0.2s]" />
                <div className="w-3 h-3 rounded-full bg-brand-orange animate-bounce [animation-delay:0.4s]" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Input Section */}
      <div className="p-8 bg-white border-t-4 border-slate-50 space-y-6">
        {attachedFile && (
          <div className="flex items-center justify-between bg-slate-50 p-3 rounded-2xl border-2 border-brand-blue/20 animate-pulse">
            <div className="flex items-center gap-3 overflow-hidden">
              <Paperclip size={20} className="text-brand-blue shrink-0" />
              <span className="text-xs font-black text-slate-600 truncate">{attachedFile.name}</span>
            </div>
            <button onClick={() => setAttachedFile(null)} className="p-1 hover:bg-slate-200 rounded-full transition-colors">
              <X size={18} className="text-slate-400" />
            </button>
          </div>
        )}

        <div className="flex items-center justify-center gap-6">
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={onFileChange} 
            className="hidden" 
            accept="image/*,video/*,application/pdf,.doc,.docx"
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="p-5 bg-brand-pink/10 text-brand-pink rounded-[1.5rem] hover:bg-brand-pink/20 transition-all btn-bouncy group"
          >
            <Paperclip size={28} strokeWidth={3} className="group-hover:rotate-12 transition-transform" />
          </button>
          
          <button 
            onMouseDown={startRecording}
            onMouseUp={stopRecording}
            onMouseLeave={stopRecording}
            onTouchStart={startRecording}
            onTouchEnd={stopRecording}
            className={`p-5 rounded-[1.5rem] transition-all btn-bouncy group ${
              isRecording ? 'bg-red-500 text-white scale-110 shadow-xl shadow-red-200' : 'bg-brand-orange/10 text-brand-orange hover:bg-brand-orange/20'
            }`}
          >
            <Mic size={28} strokeWidth={3} className={isRecording ? 'animate-pulse' : ''} />
          </button>

          <button className="p-5 bg-brand-green/10 text-brand-green rounded-[1.5rem] hover:bg-brand-green/20 transition-all btn-bouncy">
            <Video size={28} strokeWidth={3} />
          </button>
        </div>

        <div className="flex items-center gap-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder={isRecording ? 'Listening...' : 'Ask Teacher Noor anything!'}
            disabled={isRecording}
            className="flex-1 bg-slate-50 border-4 border-transparent rounded-[2rem] px-8 py-5 text-base font-black placeholder:text-slate-300 focus:border-brand-blue/20 transition-all outline-none"
          />
          <button
            onClick={() => handleSend()}
            disabled={(!input.trim() && !attachedFile) || isTyping || isRecording}
            className="bg-brand-blue text-white p-5 rounded-[2rem] shadow-xl shadow-brand-blue/30 disabled:opacity-30 transition-all btn-bouncy"
          >
            <Send size={28} strokeWidth={3} />
          </button>
        </div>
        {isRecording && (
          <p className="text-[10px] text-center font-black text-red-500 uppercase tracking-widest animate-bounce">
            Recording in progress... Release to send!
          </p>
        )}
      </div>
    </div>
  );
}
