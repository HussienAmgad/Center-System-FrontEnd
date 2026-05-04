'use client';
import { useState } from 'react';
import Sidebar from './sidebar';
import Header from './header';

const titles: Record<string, string> = {
  '/': 'لوحة التحكم',
  '/years': 'السنوات الدراسية',
  '/subjects': 'المواد الدراسية',
  '/teachers': 'المدرسين',
  '/groups': 'المجموعات',
  '/students': 'الطلاب',
  '/finance': 'الأرباح والمالية',
  '/users': 'إدارة المستخدمين',
  '/assistant': 'واجهة الأسيستنت',
};

export default function Shell({ children, path }: { children: React.ReactNode; path: string }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const title = Object.entries(titles).find(([k]) => path === k || path.startsWith(k + '/'))?.[1] ?? 'سنتر نجاح';

  return (
    <div className="flex h-screen overflow-hidden" dir="rtl">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Header onMenuClick={() => setSidebarOpen(true)} title={title} />
        <main className="flex-1 overflow-y-auto bg-background p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
