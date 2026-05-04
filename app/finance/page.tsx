import { Banknote, TrendingUp, TrendingDown } from 'lucide-react';
import StatCard from '@/components/stat-card';
import { groups, teachers, subjects, academicYears, sessions, payments, getTotalRevenue, getTeacherCost } from '@/lib/data';

export default function FinancePage() {
  const revenue = getTotalRevenue();
  const cost = getTeacherCost();
  const profit = revenue - cost;

  const byYear = academicYears.map(year => {
    const yearGroups = groups.filter(g => g.yearId === year.id);
    const rev = payments.filter(p => yearGroups.find(g => g.id === p.groupId)).reduce((a, b) => a + b.amount, 0);
    const ses = sessions.filter(s => yearGroups.find(g => g.id === s.groupId));
    const c = ses.reduce((sum, s) => {
      const grp = yearGroups.find(g => g.id === s.groupId);
      const t = grp ? teachers.find(t => t.id === grp.teacherId) : null;
      return sum + (t?.salary ?? 0);
    }, 0);
    return { ...year, revenue: rev, cost: c, profit: rev - c };
  });

  const bySubject = subjects.map(sub => {
    const subGroups = groups.filter(g => g.subjectId === sub.id);
    const rev = payments.filter(p => subGroups.find(g => g.id === p.groupId)).reduce((a, b) => a + b.amount, 0);
    const ses = sessions.filter(s => subGroups.find(g => g.id === s.groupId));
    const c = ses.reduce((sum, s) => {
      const grp = subGroups.find(g => g.id === s.groupId);
      const t = grp ? teachers.find(t => t.id === grp.teacherId) : null;
      return sum + (t?.salary ?? 0);
    }, 0);
    return { ...sub, revenue: rev, cost: c, profit: rev - c };
  });

  const byTeacher = teachers.map(teacher => {
    const tGroups = groups.filter(g => g.teacherId === teacher.id);
    const rev = payments.filter(p => tGroups.find(g => g.id === p.groupId)).reduce((a, b) => a + b.amount, 0);
    const ses = sessions.filter(s => tGroups.find(g => g.id === s.groupId));
    const c = ses.length * teacher.salary;
    return { ...teacher, revenue: rev, cost: c, profit: rev - c };
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold">الأرباح والمالية</h2>
        <p className="text-sm text-muted-foreground mt-0.5">تقارير مالية تفصيلية للسنتر</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard title="إجمالي الإيرادات" value={`${revenue.toLocaleString()} ج`} sub="من كل الحصص" icon={Banknote} color="green" />
        <StatCard title="مصاريف المدرسين" value={`${cost.toLocaleString()} ج`} sub="رواتب جميع المدرسين" icon={TrendingDown} color="amber" />
        <StatCard title="صافي الربح" value={`${profit.toLocaleString()} ج`} sub="الربح الفعلي للسنتر" icon={TrendingUp} color="blue" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-xl border bg-card overflow-hidden">
          <div className="p-4 border-b"><h3 className="font-semibold">الأرباح بالسنوات الدراسية</h3></div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-4 py-2.5 text-right font-medium">السنة</th>
                  <th className="px-4 py-2.5 text-center font-medium">الإيرادات</th>
                  <th className="px-4 py-2.5 text-center font-medium">المصاريف</th>
                  <th className="px-4 py-2.5 text-center font-medium">الربح</th>
                </tr>
              </thead>
              <tbody>
                {byYear.map(y => (
                  <tr key={y.id} className="border-t">
                    <td className="px-4 py-3 font-medium text-xs">{y.name}</td>
                    <td className="px-4 py-3 text-center text-emerald-600 dark:text-emerald-400">{y.revenue.toLocaleString()}</td>
                    <td className="px-4 py-3 text-center text-rose-600 dark:text-rose-400">{y.cost.toLocaleString()}</td>
                    <td className="px-4 py-3 text-center font-semibold text-blue-600 dark:text-blue-400">{y.profit.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-xl border bg-card overflow-hidden">
          <div className="p-4 border-b"><h3 className="font-semibold">الأرباح بالمواد</h3></div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-4 py-2.5 text-right font-medium">المادة</th>
                  <th className="px-4 py-2.5 text-center font-medium">الإيرادات</th>
                  <th className="px-4 py-2.5 text-center font-medium">المصاريف</th>
                  <th className="px-4 py-2.5 text-center font-medium">الربح</th>
                </tr>
              </thead>
              <tbody>
                {bySubject.map(s => (
                  <tr key={s.id} className="border-t">
                    <td className="px-4 py-3 font-medium">{s.name}</td>
                    <td className="px-4 py-3 text-center text-emerald-600 dark:text-emerald-400">{s.revenue.toLocaleString()}</td>
                    <td className="px-4 py-3 text-center text-rose-600 dark:text-rose-400">{s.cost.toLocaleString()}</td>
                    <td className="px-4 py-3 text-center font-semibold text-blue-600 dark:text-blue-400">{s.profit.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="rounded-xl border bg-card overflow-hidden">
        <div className="p-4 border-b"><h3 className="font-semibold">الأرباح بالمدرسين</h3></div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-4 py-2.5 text-right font-medium">المدرس</th>
                <th className="px-4 py-2.5 text-center font-medium">إيرادات مجموعاته</th>
                <th className="px-4 py-2.5 text-center font-medium">مستحقاته</th>
                <th className="px-4 py-2.5 text-center font-medium">صافي الربح من مجموعاته</th>
                <th className="px-4 py-2.5 text-center font-medium">نسبة الربح</th>
              </tr>
            </thead>
            <tbody>
              {byTeacher.map(t => (
                <tr key={t.id} className="border-t hover:bg-muted/20">
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium">{t.name}</p>
                      <p className="text-xs text-muted-foreground">{t.phone}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center text-emerald-600 dark:text-emerald-400">{t.revenue.toLocaleString()} ج</td>
                  <td className="px-4 py-3 text-center text-rose-600 dark:text-rose-400">{t.cost.toLocaleString()} ج</td>
                  <td className="px-4 py-3 text-center font-semibold text-blue-600 dark:text-blue-400">{t.profit.toLocaleString()} ج</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`text-xs px-2 py-1 rounded-full ${t.revenue > 0 ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400' : 'bg-muted text-muted-foreground'}`}>
                      {t.revenue > 0 ? `${Math.round((t.profit / t.revenue) * 100)}%` : '-'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-muted/30 font-semibold">
              <tr className="border-t">
                <td className="px-4 py-3">الإجمالي</td>
                <td className="px-4 py-3 text-center text-emerald-600 dark:text-emerald-400">{revenue.toLocaleString()} ج</td>
                <td className="px-4 py-3 text-center text-rose-600 dark:text-rose-400">{cost.toLocaleString()} ج</td>
                <td className="px-4 py-3 text-center text-blue-600 dark:text-blue-400">{profit.toLocaleString()} ج</td>
                <td className="px-4 py-3 text-center">{Math.round((profit / revenue) * 100)}%</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}
