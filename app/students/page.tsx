'use client';
import { useState } from 'react';
import { Search, Phone, QrCode } from 'lucide-react';
import { students, groups, subjects, payments } from '@/lib/data';

export default function StudentsPage() {
  const [search, setSearch] = useState('');

  const filtered = students.filter(s =>
    s.name.includes(search) || s.phone.includes(search) || s.barcode.includes(search)
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">الطلاب</h2>
          <p className="text-sm text-muted-foreground mt-0.5">إدارة بيانات الطلاب ومتابعة الدفع</p>
        </div>
        <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
          + إضافة طالب
        </button>
      </div>

      <div className="relative">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="ابحث بالاسم أو التليفون أو الباركود..."
          className="w-full pr-10 pl-4 py-2.5 rounded-lg border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map(student => {
          const studentGroups = groups.filter(g => student.groupIds.includes(g.id));
          const studentPayments = payments.filter(p => p.studentId === student.id);
          const totalPaid = studentPayments.reduce((a, b) => a + b.amount, 0);

          return (
            <div key={student.id} className="rounded-xl border bg-card p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-linear-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold">
                    {student.name[0]}
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{student.name}</p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <Phone className="w-3 h-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">{student.phone}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <QrCode className="w-3 h-3" />
                  <span>{student.barcode}</span>
                </div>
              </div>

              <div className="space-y-1 mb-3">
                {studentGroups.map(g => {
                  const sub = subjects.find(s => s.id === g.subjectId);
                  return (
                    <div key={g.id} className="text-xs flex items-center justify-between px-2 py-1 rounded-md bg-muted">
                      <span>{g.name}</span>
                      <span className="text-muted-foreground">{sub?.name}</span>
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center justify-between pt-3 border-t">
                <div>
                  <p className="text-xs text-muted-foreground">إجمالي المدفوع</p>
                  <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">{totalPaid.toLocaleString()} ج</p>
                </div>
                {student.balance > 0 ? (
                  <div className="text-left">
                    <p className="text-xs text-muted-foreground">رصيد متبقي</p>
                    <p className="text-sm font-semibold text-amber-600 dark:text-amber-400">{student.balance} ج</p>
                  </div>
                ) : (
                  <span className="text-xs px-2 py-1 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">سداد كامل</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
