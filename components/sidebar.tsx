'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { GraduationCap, BookOpen, Users, UsersRound, ChartBar as BarChart3, ShieldCheck, Scan, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const links = [
  { href: '/', label: 'لوحة التحكم', icon: BarChart3 },
  { href: '/years', label: 'السنوات الدراسية', icon: GraduationCap },
  { href: '/subjects', label: 'المواد الدراسية', icon: BookOpen },
  { href: '/teachers', label: 'المدرسين', icon: Users },
  { href: '/groups', label: 'المجموعات', icon: UsersRound },
  { href: '/students', label: 'الطلاب', icon: Users },
  { href: '/finance', label: 'الأرباح والمالية', icon: BarChart3 },
  { href: '/users', label: 'إدارة المستخدمين', icon: ShieldCheck },
  { href: '/assistant', label: 'واجهة الأسيستنت', icon: Scan },
];

interface Props { open: boolean; onClose: () => void; }

export default function Sidebar({ open, onClose }: Props) {
  const path = usePathname();

  return (
    <>
      {open && <div className="fixed inset-0 z-20 bg-black/50 lg:hidden" onClick={onClose} />}
      <aside className={cn(
        'fixed top-0 right-0 z-30 h-full w-64 flex flex-col',
        'bg-[hsl(215,30%,12%)] text-[hsl(210,20%,88%)]',
        'transition-transform duration-300',
        open ? 'translate-x-0' : 'translate-x-full',
        'lg:translate-x-0 lg:static lg:z-auto'
      )}>
        <div className="flex items-center justify-between px-5 py-5 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-white text-lg">سنتر نجاح</span>
          </div>
          <button onClick={onClose} className="lg:hidden text-white/60 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {links.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href} onClick={onClose} className={cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all',
              path === href
                ? 'bg-blue-600 text-white'
                : 'text-[hsl(210,20%,75%)] hover:bg-white/10 hover:text-white'
            )}>
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </Link>
          ))}
        </nav>

        <div className="px-4 py-4 border-t border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-500/30 flex items-center justify-center text-blue-300 text-sm font-bold">أ</div>
            <div>
              <p className="text-sm font-medium text-white">أحمد محمد</p>
              <p className="text-xs text-white/50">مدير النظام</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
