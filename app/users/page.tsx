'use client';
import { useState } from 'react';
import { Shield, User, Phone, Mail } from 'lucide-react';
import { users } from '@/lib/data';
import type { User as UserType } from '@/lib/types';

export default function UsersPage() {
  const [list, setList] = useState(users);

  const toggleRole = (id: string) => {
    setList(prev => prev.map(u => u.id === id ? { ...u, role: u.role === 'admin' ? 'assistant' : 'admin' } : u));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">إدارة المستخدمين</h2>
          <p className="text-sm text-muted-foreground mt-0.5">إدارة صلاحيات المستخدمين</p>
        </div>
        <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
          + إضافة مستخدم
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="rounded-xl border bg-card p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-950/40 flex items-center justify-center">
            <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <p className="text-2xl font-bold">{list.filter(u => u.role === 'admin').length}</p>
            <p className="text-xs text-muted-foreground">مدير</p>
          </div>
        </div>
        <div className="rounded-xl border bg-card p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-950/40 flex items-center justify-center">
            <User className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <p className="text-2xl font-bold">{list.filter(u => u.role === 'assistant').length}</p>
            <p className="text-xs text-muted-foreground">أسيستنت</p>
          </div>
        </div>
        <div className="rounded-xl border bg-card p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-950/40 flex items-center justify-center">
            <User className="w-5 h-5 text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <p className="text-2xl font-bold">{list.length}</p>
            <p className="text-xs text-muted-foreground">إجمالي المستخدمين</p>
          </div>
        </div>
      </div>

      <div className="rounded-xl border bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-4 py-3 text-right font-medium">المستخدم</th>
              <th className="px-4 py-3 text-right font-medium hidden sm:table-cell">البريد</th>
              <th className="px-4 py-3 text-right font-medium hidden md:table-cell">التليفون</th>
              <th className="px-4 py-3 text-center font-medium">الصلاحية</th>
              <th className="px-4 py-3 text-center font-medium">الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {list.map(user => (
              <tr key={user.id} className="border-t hover:bg-muted/20 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-sm font-semibold">
                      {user.name[0]}
                    </div>
                    <span className="font-medium">{user.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">{user.email}</td>
                <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">{user.phone}</td>
                <td className="px-4 py-3 text-center">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${user.role === 'admin' ? 'bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400' : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400'}`}>
                    {user.role === 'admin' ? 'مدير' : 'أسيستنت'}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => toggleRole(user.id)}
                    className="text-xs px-3 py-1.5 rounded-lg border hover:bg-muted transition-colors"
                  >
                    تغيير الصلاحية
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
