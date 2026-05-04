'use client';
import { useState } from 'react';
import { QrCode, Check, X, UserPlus, ChevronRight, CircleAlert as AlertCircle } from 'lucide-react';
import { groups, students, sessions, teachers, payments } from '@/lib/data';
import type { Session, Student } from '@/lib/types';

type View = 'groups' | 'session' | 'addStudent' | 'payment';

export default function AssistantPage() {
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [view, setView] = useState<View>('groups');
  const [barcode, setBarcode] = useState('');
  const [barcodeMsg, setBarcodeMsg] = useState<{ type: 'success' | 'error' | 'new'; msg: string } | null>(null);
  const [sessionStudents, setSessionStudents] = useState<string[]>([]);
  const [addName, setAddName] = useState('');
  const [addPhone, setAddPhone] = useState('');
  const [payStudent, setPayStudent] = useState<Student | null>(null);
  const [payAmount, setPayAmount] = useState('');

  const group = groups.find(g => g.id === selectedGroup);
  const openSession = selectedGroup ? sessions.find(s => s.groupId === selectedGroup && s.status === 'open') : null;
  const groupStudents = selectedGroup ? students.filter(s => s.groupIds.includes(selectedGroup)) : [];
  const teacher = group ? teachers.find(t => t.id === group.teacherId) : null;

  const handleGroupSelect = (gid: string) => {
    setSelectedGroup(gid);
    setSessionStudents([]);
    setBarcode('');
    setBarcodeMsg(null);
    setView('session');
  };

  const handleBarcode = () => {
    if (!barcode.trim()) return;
    const student = students.find(s => s.barcode === barcode.trim());
    if (!student) {
      setBarcodeMsg({ type: 'error', msg: `لا يوجد طالب بالباركود: ${barcode}` });
    } else if (!student.groupIds.includes(selectedGroup!)) {
      setBarcodeMsg({ type: 'new', msg: `${student.name} غير مسجل في هذه المجموعة. هل تريد إضافته؟` });
    } else if (sessionStudents.includes(student.id)) {
      setBarcodeMsg({ type: 'error', msg: `${student.name} تم تسجيل حضوره مسبقاً` });
    } else {
      setSessionStudents(prev => [...prev, student.id]);
      setBarcodeMsg({ type: 'success', msg: `تم تسجيل حضور ${student.name}` });
    }
    setBarcode('');
    setTimeout(() => setBarcodeMsg(null), 3000);
  };

  if (view === 'groups') {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold">واجهة الأسيستنت</h2>
          <p className="text-sm text-muted-foreground mt-0.5">اختر مجموعة لإدارة الحضور</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {groups.map(g => {
            const gTeacher = teachers.find(t => t.id === g.teacherId);
            const openSes = sessions.find(s => s.groupId === g.id && s.status === 'open');
            const gStudents = students.filter(s => s.groupIds.includes(g.id));
            return (
              <button key={g.id} onClick={() => handleGroupSelect(g.id)}
                className="rounded-xl border bg-card p-5 text-right hover:shadow-md hover:border-primary/50 transition-all group">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-950/40 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold">
                    {gStudents.length}
                  </div>
                  {openSes ? (
                    <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400">حصة مفتوحة</span>
                  ) : (
                    <span className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground">لا توجد حصة</span>
                  )}
                </div>
                <h3 className="font-semibold mb-1">{g.name}</h3>
                <p className="text-xs text-muted-foreground">{gTeacher?.name} • {g.schedule}</p>
                <div className="flex items-center justify-between mt-3 pt-3 border-t">
                  <span className="text-xs text-muted-foreground">{gStudents.length} طالب</span>
                  <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  if (view === 'session' && group) {
    const presentStudents = sessionStudents.map(id => students.find(s => s.id === id)!).filter(Boolean);
    const absentStudents = groupStudents.filter(s => !sessionStudents.includes(s.id));

    return (
      <div className="space-y-5 max-w-2xl mx-auto">
        <div className="flex items-center gap-2">
          <button onClick={() => { setView('groups'); setSelectedGroup(null); }} className="text-muted-foreground hover:text-foreground text-sm">المجموعات</button>
          <span className="text-muted-foreground">/</span>
          <span className="text-sm font-medium">{group.name}</span>
        </div>

        <div className="rounded-xl border bg-card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold">{group.name}</h3>
              <p className="text-xs text-muted-foreground">{teacher?.name} • {group.schedule}</p>
            </div>
            {openSession ? (
              <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400">حصة مفتوحة</span>
            ) : (
              <button className="px-3 py-1.5 bg-green-600 text-white rounded-lg text-xs font-medium hover:bg-green-700 transition-colors">
                بدء حصة جديدة
              </button>
            )}
          </div>

          <div className="flex gap-2">
            <input
              value={barcode}
              onChange={e => setBarcode(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleBarcode()}
              placeholder="امسح الباركود أو اكتبه..."
              className="flex-1 px-3 py-2.5 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <button onClick={handleBarcode} className="px-4 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 flex items-center gap-2">
              <QrCode className="w-4 h-4" /> سجّل
            </button>
          </div>

          {barcodeMsg && (
            <div className={`mt-3 p-3 rounded-lg flex items-start gap-2 text-sm ${
              barcodeMsg.type === 'success' ? 'bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400' :
              barcodeMsg.type === 'new' ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400' :
              'bg-rose-50 text-rose-700 dark:bg-rose-950/30 dark:text-rose-400'
            }`}>
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p>{barcodeMsg.msg}</p>
                {barcodeMsg.type === 'new' && (
                  <button className="mt-1 text-xs underline font-medium">نعم، أضفه للمجموعة</button>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="rounded-xl border bg-card p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-medium text-green-600 dark:text-green-400">حضر ({presentStudents.length})</h4>
              <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
            </div>
            <div className="space-y-1.5">
              {presentStudents.length === 0 && <p className="text-xs text-muted-foreground">لا يوجد حضور بعد</p>}
              {presentStudents.map(s => (
                <div key={s.id} className="flex items-center justify-between px-3 py-2 rounded-lg bg-green-50 dark:bg-green-950/20 text-sm">
                  <span className="font-medium">{s.name}</span>
                  <div className="flex items-center gap-2">
                    {s.balance > 0 && (
                      <button onClick={() => { setPayStudent(s); setPayAmount(String(s.balance)); setView('payment'); }}
                        className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400">
                        باقي {s.balance} ج
                      </button>
                    )}
                    <span className="text-xs text-green-600 dark:text-green-400">{group.sessionPrice} ج</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border bg-card p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-medium text-rose-600 dark:text-rose-400">غاب ({absentStudents.length})</h4>
              <X className="w-4 h-4 text-rose-600 dark:text-rose-400" />
            </div>
            <div className="space-y-1.5">
              {absentStudents.map(s => (
                <div key={s.id} className="flex items-center justify-between px-3 py-2 rounded-lg bg-rose-50 dark:bg-rose-950/20 text-sm">
                  <span>{s.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between p-4 rounded-xl border bg-card">
          <div>
            <p className="text-sm text-muted-foreground">إيرادات هذه الحصة</p>
            <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">{(presentStudents.length * group.sessionPrice).toLocaleString()} ج</p>
          </div>
          <button onClick={() => setView('addStudent')} className="flex items-center gap-2 px-4 py-2 rounded-lg border hover:bg-muted transition-colors text-sm">
            <UserPlus className="w-4 h-4" /> إضافة طالب جديد
          </button>
        </div>
      </div>
    );
  }

  if (view === 'addStudent' && group) {
    return (
      <div className="max-w-md mx-auto space-y-5">
        <div className="flex items-center gap-2">
          <button onClick={() => setView('session')} className="text-muted-foreground hover:text-foreground text-sm">الحصة</button>
          <span className="text-muted-foreground">/</span>
          <span className="text-sm font-medium">إضافة طالب</span>
        </div>
        <div className="rounded-xl border bg-card p-5 space-y-4">
          <h3 className="font-semibold">إضافة طالب جديد</h3>
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium mb-1 block">الاسم</label>
              <input value={addName} onChange={e => setAddName(e.target.value)} placeholder="اسم الطالب" className="w-full px-3 py-2.5 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">التليفون</label>
              <input value={addPhone} onChange={e => setAddPhone(e.target.value)} placeholder="01xxxxxxxxx" className="w-full px-3 py-2.5 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">المجموعة</label>
              <input readOnly value={group.name} className="w-full px-3 py-2.5 rounded-lg border bg-muted text-sm" />
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setView('session')} className="flex-1 px-4 py-2.5 rounded-lg border text-sm hover:bg-muted transition-colors">إلغاء</button>
            <button onClick={() => { setView('session'); setAddName(''); setAddPhone(''); }} className="flex-1 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">إضافة</button>
          </div>
        </div>
      </div>
    );
  }

  if (view === 'payment' && payStudent) {
    return (
      <div className="max-w-md mx-auto space-y-5">
        <div className="flex items-center gap-2">
          <button onClick={() => { setView('session'); setPayStudent(null); }} className="text-muted-foreground hover:text-foreground text-sm">الحصة</button>
          <span className="text-muted-foreground">/</span>
          <span className="text-sm font-medium">استلام دفعة</span>
        </div>
        <div className="rounded-xl border bg-card p-5 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-linear-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-lg">{payStudent.name[0]}</div>
            <div>
              <h3 className="font-semibold">{payStudent.name}</h3>
              <p className="text-xs text-muted-foreground">الرصيد المتبقي: {payStudent.balance} ج</p>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">المبلغ</label>
            <input value={payAmount} onChange={e => setPayAmount(e.target.value)} type="number" className="w-full px-3 py-2.5 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <div className="flex gap-3">
            <button onClick={() => { setView('session'); setPayStudent(null); }} className="flex-1 px-4 py-2.5 rounded-lg border text-sm hover:bg-muted transition-colors">إلغاء</button>
            <button onClick={() => { setView('session'); setPayStudent(null); }} className="flex-1 px-4 py-2.5 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors">تأكيد الاستلام</button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
