import { GraduationCap, Users, BookOpen, UsersRound, TrendingUp, Banknote } from 'lucide-react';
import StatCard from '@/components/stat-card';
import { academicYears, subjects, teachers, groups, students, getTotalRevenue, getTeacherCost, sessions } from '@/lib/data';

export default function Dashboard() {
  const revenue = getTotalRevenue();
  const cost = getTeacherCost();
  const profit = revenue - cost;
  const recentSessions = [...sessions].reverse().slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard title="السنوات الدراسية" value={academicYears.length} icon={GraduationCap} color="blue" />
        <StatCard title="المواد" value={subjects.length} icon={BookOpen} color="green" />
        <StatCard title="المدرسين" value={teachers.length} icon={Users} color="amber" />
        <StatCard title="المجموعات" value={groups.length} icon={UsersRound} color="rose" />
        <StatCard title="الطلاب" value={students.length} icon={Users} color="blue" />
        <StatCard title="إجمالي الحصص" value={sessions.length} icon={TrendingUp} color="green" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard title="إجمالي الإيرادات" value={`${revenue.toLocaleString()} ج`} sub="من كل الحصص" icon={Banknote} color="green" />
        <StatCard title="مصاريف المدرسين" value={`${cost.toLocaleString()} ج`} sub="مجموع الرواتب" icon={Users} color="amber" />
        <StatCard title="صافي الربح" value={`${profit.toLocaleString()} ج`} sub="بعد خصم المدرسين" icon={TrendingUp} color="rose" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-xl border bg-card p-5">
          <h2 className="font-semibold mb-4">أحدث الحصص</h2>
          <div className="space-y-2">
            {recentSessions.map(ses => {
              const group = groups.find(g => g.id === ses.groupId);
              return (
                <div key={ses.id} className="flex items-center justify-between py-2 border-b last:border-0">
                  <div>
                    <p className="text-sm font-medium">{group?.name}</p>
                    <p className="text-xs text-muted-foreground">{ses.date}</p>
                  </div>
                  <div className="flex items-center gap-2 text-left">
                    <span className="text-xs text-green-600 dark:text-green-400">حضر {ses.attendees.length}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${ses.status === 'open' ? 'bg-green-100 text-green-700 dark:bg-green-950/50 dark:text-green-400' : 'bg-muted text-muted-foreground'}`}>
                      {ses.status === 'open' ? 'مفتوحة' : 'مغلقة'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-xl border bg-card p-5">
          <h2 className="font-semibold mb-4">المجموعات الأكثر نشاطاً</h2>
          <div className="space-y-2">
            {groups.map(g => {
              const grpStudents = students.filter(s => s.groupIds.includes(g.id));
              const grpSessions = sessions.filter(s => s.groupId === g.id);
              const teacher = teachers.find(t => t.id === g.teacherId);
              return (
                <div key={g.id} className="flex items-center justify-between py-2 border-b last:border-0">
                  <div>
                    <p className="text-sm font-medium">{g.name}</p>
                    <p className="text-xs text-muted-foreground">{teacher?.name}</p>
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">{grpStudents.length} طالب</p>
                    <p className="text-xs text-muted-foreground">{grpSessions.length} حصة</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
