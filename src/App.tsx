/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { User, Assignment, CalendarEvent, ClassInsight } from "./types";
import { AIAvatar } from "./components/AI/AIAvatar";
import { AIChat } from "./components/AI/AIChat";
import { StudentDashboard } from "./components/Dashboard/StudentDashboard";
import { TeacherDashboard } from "./components/Dashboard/TeacherDashboard";
import { 
  Users, 
  Settings, 
  LogOut, 
  LayoutDashboard,
  GraduationCap
} from "lucide-react";

// Mock Data
const MOCK_USER_STUDENT: User = {
  id: "S001",
  name: "Leo",
  role: "student",
  level: "beginner",
  xp: 1250,
  badges: ["Active Learner"]
};

const MOCK_USER_TEACHER: User = {
  id: "T001",
  name: "Dr. Sarah",
  role: "teacher",
  level: "advanced",
  xp: 5000,
  badges: ["Master Educator"]
};

const MOCK_ASSIGNMENTS: Assignment[] = [
  { id: "A1", title: "Past Tense Essay", status: "graded", dueDate: "Yesterday", type: "writing", grade: "A-", feedback: "Well done, Leo!" },
  { id: "A2", title: "Pronunciation Practice", status: "pending", dueDate: "In 2 days", type: "speaking" },
  { id: "A3", title: "Vocabulary Flashcards", status: "submitted", dueDate: "Today", type: "vocabulary" },
];

const MOCK_EVENTS: CalendarEvent[] = [
  { id: "E1", title: "Grammar Final Exam", start: "Apr 20 • 9:00 AM", type: "exam", description: "All topics included." },
  { id: "E2", title: "Conversation Club", start: "Apr 21 • 2:00 PM", type: "class", description: "Topic: Travel." },
  { id: "E3", title: "Vocabulary Review", start: "Apr 18 • 4:00 PM", type: "study", description: "Prepare for exam." },
];

const MOCK_INSIGHTS: ClassInsight = {
  commonMistakes: ["Article usage (a/an/the)", "Irregular verbs", "Prepositions of time"],
  strugglingStudents: ["Bob Smith", "Jane Doe"],
  topPerformers: ["Alice Johnson", "Leo"],
  summary: "The class overall is improving in grammar fluency, but we should focus more on irregular verb patterns next week. Two students need extra support with speaking confidence."
};

export default function App() {
  const [currentUser, setCurrentUser] = useState<User>(MOCK_USER_STUDENT);
  const [aiStatus, setAiStatus] = useState<"idle" | "speaking" | "thinking" | "encouraging">("idle");
  const [aiMessage, setAiMessage] = useState("Hi! I'm Ms. Noor, your AI coach. Ready to learn?");

  const toggleUserRole = () => {
    setCurrentUser(currentUser.role === 'student' ? MOCK_USER_TEACHER : MOCK_USER_STUDENT);
    setAiMessage(currentUser.role === 'student' ? "Welcome back, Professor Sarah." : "Hi Leo! Let's get to work.");
  };

  return (
    <div className="min-h-screen bg-[#FFF9F0] flex text-slate-900 font-sans selection:bg-brand-blue/30">
      {/* Sidebar Navigation */}
      <aside className="w-24 lg:w-72 bg-white border-r-4 border-slate-100 py-10 flex flex-col justify-between items-center lg:items-start lg:px-8 fixed h-full z-10 transition-all">
        <div className="space-y-12 w-full">
          <div className="flex items-center gap-4 px-2 hover:scale-105 transition-transform cursor-pointer">
            <div className="w-12 h-12 bg-brand-blue rounded-2xl flex items-center justify-center text-white shadow-xl rotate-6">
              <GraduationCap size={28} />
            </div>
            <span className="hidden lg:block font-black text-2xl tracking-tighter text-slate-800">LUMINA</span>
          </div>

          <nav className="space-y-4">
            {[
              { icon: LayoutDashboard, label: "Home", active: true, color: 'text-brand-blue bg-brand-blue/10' },
              { icon: Users, label: currentUser.role === 'teacher' ? "Class" : "Friends", color: 'text-brand-purple hover:bg-brand-purple/5' },
              { icon: Settings, label: "Magic", color: 'text-brand-pink hover:bg-brand-pink/5' },
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
            <button 
              onClick={toggleUserRole}
              className="w-full flex items-center gap-4 p-4 rounded-3xl text-brand-orange hover:bg-brand-orange/5 transition-all btn-bouncy"
            >
              <LogOut size={26} strokeWidth={2.5} />
              <span className="hidden lg:block font-black text-base">{currentUser.role === 'student' ? 'Teacher' : 'Student'} Mode</span>
            </button>
          </nav>
        </div>

        <div className="w-full p-4 bg-slate-50 rounded-[2.5rem] hidden lg:flex items-center gap-4 border-4 border-slate-100/50">
          <div className="w-12 h-12 rounded-2xl bg-brand-blue/10 flex items-center justify-center font-black text-brand-blue text-lg shadow-inner">
            {currentUser.name.charAt(0)}
          </div>
          <div>
            <p className="text-sm font-black text-slate-800">{currentUser.name}</p>
            <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest">{currentUser.role}</p>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 ml-24 lg:ml-72 p-10">
        <div className="max-w-7xl mx-auto">
          
          <div className="flex flex-col xl:flex-row gap-12">
            {/* AI Coaching Sidebar */}
            <div className="xl:w-80 flex flex-col gap-10 shrink-0">
               <div className="sticky top-10">
                <div className="bg-white rounded-[3rem] border-4 border-slate-50 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)] overflow-hidden mb-10">
                  <AIAvatar status={aiStatus} message={aiMessage} />
                </div>
                <AIChat 
                  userRole={currentUser.role} 
                  userLevel={currentUser.level} 
                  onAnalysisStart={() => {
                    setAiStatus("thinking");
                    setAiMessage("Let me use my magic...");
                  }}
                  onAnalysisEnd={() => {
                    setAiStatus("speaking");
                    setAiMessage("I found the answer!");
                    setTimeout(() => setAiStatus("idle"), 3000);
                  }}
                />
               </div>
            </div>

            {/* Main Dashboard View */}
            <div className="flex-1 min-w-0">
              {currentUser.role === 'student' ? (
                <StudentDashboard 
                  user={currentUser} 
                  assignments={MOCK_ASSIGNMENTS} 
                  events={MOCK_EVENTS} 
                />
              ) : (
                <TeacherDashboard 
                  user={currentUser} 
                  insights={MOCK_INSIGHTS} 
                />
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

