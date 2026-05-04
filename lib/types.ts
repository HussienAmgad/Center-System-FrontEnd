export type Role = 'admin' | 'assistant';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  phone: string;
  createdAt: string;
}

export interface Subject {
  id: string;
  name: string;
  color: string;
}

export interface AcademicYear {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
}

export interface Teacher {
  id: string;
  name: string;
  phone: string;
  subjectId: string;
  salary: number; // per session
  joinDate: string;
}

export interface Student {
  id: string;
  name: string;
  phone: string;
  barcode: string;
  groupIds: string[];
  balance: number;
}

export interface Group {
  id: string;
  name: string;
  teacherId: string;
  subjectId: string;
  yearId: string;
  sessionPrice: number;
  schedule: string; // e.g. "السبت - 4م"
}

export interface Session {
  id: string;
  groupId: string;
  date: string;
  status: 'open' | 'closed';
  attendees: string[]; // student ids
  absentees: string[]; // student ids
}

export interface Payment {
  id: string;
  studentId: string;
  groupId: string;
  amount: number;
  date: string;
  sessionId?: string;
}
