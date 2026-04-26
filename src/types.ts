/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type UserRole = 'student' | 'teacher' | 'parent';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  level: 'beginner' | 'intermediate' | 'advanced' | 'Grade 4';
  xp: number;
  badges: string[];
}

export interface Assignment {
  id: string;
  title: string;
  status: 'pending' | 'submitted' | 'graded';
  dueDate: string;
  type: 'writing' | 'speaking' | 'reading' | 'vocabulary';
  grade?: string;
  feedback?: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  type: 'exam' | 'assignment' | 'class' | 'study';
  description?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  type?: 'text' | 'hint' | 'explanation' | 'example' | 'answer';
}

export interface ClassInsight {
  commonMistakes: string[];
  strugglingStudents: string[];
  topPerformers: string[];
  summary: string;
}
