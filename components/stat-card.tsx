import { Video as LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
  title: string;
  value: string | number;
  sub?: string;
  icon: LucideIcon;
  color?: 'blue' | 'green' | 'amber' | 'rose';
}

const colors = {
  blue: 'bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400',
  green: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400',
  amber: 'bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400',
  rose: 'bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400',
};

export default function StatCard({ title, value, sub, icon: Icon, color = 'blue' }: Props) {
  return (
    <div className="rounded-xl border bg-card p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
          {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
        </div>
        <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center', colors[color])}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
}
