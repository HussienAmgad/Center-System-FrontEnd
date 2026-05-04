import type { User, Subject, AcademicYear, Teacher, Student, Group, Session, Payment } from './types';

export const users: User[] = [
  { id: 'u1', name: 'أحمد محمد', email: 'admin@center.com', role: 'admin', phone: '01012345678', createdAt: '2024-09-01' },
  { id: 'u2', name: 'سارة علي', email: 'sara@center.com', role: 'assistant', phone: '01098765432', createdAt: '2024-09-15' },
  { id: 'u3', name: 'محمود حسن', email: 'mahmoud@center.com', role: 'assistant', phone: '01155554433', createdAt: '2024-10-01' },
];

export const subjects: Subject[] = [
  { id: 's1', name: 'الرياضيات', color: 'blue' },
  { id: 's2', name: 'الفيزياء', color: 'emerald' },
  { id: 's3', name: 'الكيمياء', color: 'amber' },
  { id: 's4', name: 'اللغة العربية', color: 'rose' },
  { id: 's5', name: 'اللغة الإنجليزية', color: 'violet' },
];

export const academicYears: AcademicYear[] = [
  { id: 'y1', name: 'الصف الأول الثانوي', startDate: '2024-09-01', endDate: '2025-06-30' },
  { id: 'y2', name: 'الصف الثاني الثانوي', startDate: '2024-09-01', endDate: '2025-06-30' },
  { id: 'y3', name: 'الصف الثالث الثانوي', startDate: '2024-09-01', endDate: '2025-06-30' },
];

export const teachers: Teacher[] = [
  { id: 't1', name: 'أ. كريم إبراهيم', phone: '01011112222', subjectId: 's1', salary: 50, joinDate: '2024-09-01' },
  { id: 't2', name: 'أ. نهى سامي', phone: '01033334444', subjectId: 's2', salary: 60, joinDate: '2024-09-01' },
  { id: 't3', name: 'أ. طارق يوسف', phone: '01055556666', subjectId: 's3', salary: 55, joinDate: '2024-10-01' },
  { id: 't4', name: 'أ. هالة رمضان', phone: '01077778888', subjectId: 's4', salary: 45, joinDate: '2024-09-15' },
];

export const groups: Group[] = [
  { id: 'g1', name: 'مجموعة A - رياضيات أولى', teacherId: 't1', subjectId: 's1', yearId: 'y1', sessionPrice: 120, schedule: 'الأحد - 5م' },
  { id: 'g2', name: 'مجموعة B - رياضيات ثانية', teacherId: 't1', subjectId: 's1', yearId: 'y2', sessionPrice: 130, schedule: 'الإثنين - 6م' },
  { id: 'g3', name: 'مجموعة A - فيزياء ثالثة', teacherId: 't2', subjectId: 's2', yearId: 'y3', sessionPrice: 150, schedule: 'الثلاثاء - 5م' },
  { id: 'g4', name: 'مجموعة B - فيزياء ثانية', teacherId: 't2', subjectId: 's2', yearId: 'y2', sessionPrice: 140, schedule: 'الأربعاء - 4م' },
  { id: 'g5', name: 'مجموعة A - كيمياء ثالثة', teacherId: 't3', subjectId: 's3', yearId: 'y3', sessionPrice: 130, schedule: 'الخميس - 5م' },
  { id: 'g6', name: 'مجموعة A - عربي أولى', teacherId: 't4', subjectId: 's4', yearId: 'y1', sessionPrice: 100, schedule: 'الجمعة - 4م' },
];

export const students: Student[] = [
  { id: 'st1', name: 'علي أحمد', phone: '01211112222', barcode: 'BC001', groupIds: ['g1', 'g3'], balance: 0 },
  { id: 'st2', name: 'مريم حسين', phone: '01233334444', barcode: 'BC002', groupIds: ['g1', 'g6'], balance: 120 },
  { id: 'st3', name: 'عمر خالد', phone: '01255556666', barcode: 'BC003', groupIds: ['g2', 'g4'], balance: 0 },
  { id: 'st4', name: 'فاطمة محمود', phone: '01277778888', barcode: 'BC004', groupIds: ['g2'], balance: 260 },
  { id: 'st5', name: 'يوسف سامي', phone: '01299990000', barcode: 'BC005', groupIds: ['g3', 'g5'], balance: 0 },
  { id: 'st6', name: 'نور إبراهيم', phone: '01011119999', barcode: 'BC006', groupIds: ['g4', 'g5'], balance: 130 },
  { id: 'st7', name: 'آدم عادل', phone: '01033331111', barcode: 'BC007', groupIds: ['g1', 'g2'], balance: 0 },
  { id: 'st8', name: 'لين طارق', phone: '01055557777', barcode: 'BC008', groupIds: ['g6'], balance: 200 },
  { id: 'st9', name: 'زياد مصطفى', phone: '01077773333', barcode: 'BC009', groupIds: ['g3'], balance: 0 },
  { id: 'st10', name: 'دينا وليد', phone: '01099995555', barcode: 'BC010', groupIds: ['g5', 'g6'], balance: 100 },
];

export const sessions: Session[] = [
  { id: 'ses1', groupId: 'g1', date: '2025-04-20', status: 'closed', attendees: ['st1','st2','st7'], absentees: [] },
  { id: 'ses2', groupId: 'g1', date: '2025-04-27', status: 'closed', attendees: ['st1','st2','st7'], absentees: [] },
  { id: 'ses3', groupId: 'g1', date: '2025-05-01', status: 'open', attendees: ['st1','st7'], absentees: ['st2'] },
  { id: 'ses4', groupId: 'g2', date: '2025-04-21', status: 'closed', attendees: ['st3','st4','st7'], absentees: [] },
  { id: 'ses5', groupId: 'g2', date: '2025-04-28', status: 'closed', attendees: ['st3','st7'], absentees: ['st4'] },
  { id: 'ses6', groupId: 'g3', date: '2025-04-22', status: 'closed', attendees: ['st1','st5','st9'], absentees: [] },
  { id: 'ses7', groupId: 'g3', date: '2025-04-29', status: 'closed', attendees: ['st1','st5'], absentees: ['st9'] },
  { id: 'ses8', groupId: 'g4', date: '2025-04-23', status: 'closed', attendees: ['st3','st6'], absentees: [] },
  { id: 'ses9', groupId: 'g5', date: '2025-04-24', status: 'closed', attendees: ['st5','st6','st10'], absentees: [] },
  { id: 'ses10', groupId: 'g6', date: '2025-04-25', status: 'closed', attendees: ['st2','st8','st10'], absentees: [] },
];

export const payments: Payment[] = [
  { id: 'p1', studentId: 'st1', groupId: 'g1', amount: 120, date: '2025-04-20', sessionId: 'ses1' },
  { id: 'p2', studentId: 'st2', groupId: 'g1', amount: 120, date: '2025-04-20', sessionId: 'ses1' },
  { id: 'p3', studentId: 'st7', groupId: 'g1', amount: 120, date: '2025-04-20', sessionId: 'ses1' },
  { id: 'p4', studentId: 'st1', groupId: 'g1', amount: 120, date: '2025-04-27', sessionId: 'ses2' },
  { id: 'p5', studentId: 'st7', groupId: 'g1', amount: 120, date: '2025-04-27', sessionId: 'ses2' },
  { id: 'p6', studentId: 'st3', groupId: 'g2', amount: 130, date: '2025-04-21', sessionId: 'ses4' },
  { id: 'p7', studentId: 'st4', groupId: 'g2', amount: 130, date: '2025-04-21', sessionId: 'ses4' },
  { id: 'p8', studentId: 'st7', groupId: 'g2', amount: 130, date: '2025-04-21', sessionId: 'ses4' },
  { id: 'p9', studentId: 'st1', groupId: 'g3', amount: 150, date: '2025-04-22', sessionId: 'ses6' },
  { id: 'p10', studentId: 'st5', groupId: 'g3', amount: 150, date: '2025-04-22', sessionId: 'ses6' },
  { id: 'p11', studentId: 'st9', groupId: 'g3', amount: 150, date: '2025-04-22', sessionId: 'ses6' },
  { id: 'p12', studentId: 'st3', groupId: 'g4', amount: 140, date: '2025-04-23', sessionId: 'ses8' },
  { id: 'p13', studentId: 'st6', groupId: 'g4', amount: 140, date: '2025-04-23', sessionId: 'ses8' },
  { id: 'p14', studentId: 'st5', groupId: 'g5', amount: 130, date: '2025-04-24', sessionId: 'ses9' },
  { id: 'p15', studentId: 'st6', groupId: 'g5', amount: 130, date: '2025-04-24', sessionId: 'ses9' },
  { id: 'p16', studentId: 'st10', groupId: 'g5', amount: 130, date: '2025-04-24', sessionId: 'ses9' },
  { id: 'p17', studentId: 'st2', groupId: 'g6', amount: 100, date: '2025-04-25', sessionId: 'ses10' },
  { id: 'p18', studentId: 'st8', groupId: 'g6', amount: 100, date: '2025-04-25', sessionId: 'ses10' },
  { id: 'p19', studentId: 'st10', groupId: 'g6', amount: 100, date: '2025-04-25', sessionId: 'ses10' },
];

// Helpers
export function getTeacher(id: string) { return teachers.find(t => t.id === id); }
export function getSubject(id: string) { return subjects.find(s => s.id === id); }
export function getYear(id: string) { return academicYears.find(y => y.id === id); }
export function getGroup(id: string) { return groups.find(g => g.id === id); }
export function getStudent(id: string) { return students.find(s => s.id === id); }
export function getGroupSessions(groupId: string) { return sessions.filter(s => s.groupId === groupId); }
export function getGroupStudents(groupId: string) { return students.filter(s => s.groupIds.includes(groupId)); }
export function getGroupPayments(groupId: string) { return payments.filter(p => p.groupId === groupId); }
export function getTotalRevenue() { return payments.reduce((sum, p) => sum + p.amount, 0); }
export function getTeacherCost() {
  return sessions.reduce((sum, ses) => {
    const group = groups.find(g => g.id === ses.groupId);
    const teacher = group ? teachers.find(t => t.id === group.teacherId) : null;
    return sum + (teacher?.salary ?? 0);
  }, 0);
}
