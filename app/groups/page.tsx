"use client";
import { useEffect, useState } from 'react';
import { ChevronDown, ChevronUp, Users, Calendar, PieChart } from 'lucide-react';
import { toast } from 'react-toastify';
import { ErrorBox } from '@/components/error-box';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const DAYS = ["السبت", "الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة"];

export const formatTimeRange = (timeString: string) => {
  if (!timeString) return timeString;

  const formatSingleTime = (timeStr: string) => {
    let [hours, minutes] = timeStr.split(':').map(Number);

    let period = 'ص';
    if (hours >= 12) {
      period = 'م';
      if (hours > 12) {
        hours -= 12;
      }
    } else if (hours === 0) {
      hours = 12;
    }

    const formattedHours = String(hours).padStart(2, '0');
    const formattedMinutes = String(minutes).padStart(2, '0');

    return `${formattedHours}:${formattedMinutes} ${period}`;
  };

  if (timeString.includes('-')) {
    const [startTime, endTime] = timeString.split('-');
    return `من ${formatSingleTime(startTime)} إلى ${formatSingleTime(endTime)}`;
  }

  return formatSingleTime(timeString);
};

export default function GroupsPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [groups, setGroups] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [academicYears, setAcademicYears] = useState<any[]>([]);

  const [formData, setForm] = useState({
    groupName: "",
    dayOfWeek: "",
    time: "14:00",
    teacherId: "",
    academicYearId: ""
  });

  const [error, setError] = useState({
    status: false,
    message: ""
  });

  const fetchData = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/group/get_groups`);
      if (!response.ok) {
        const errorData = await response.json();
        setError({ message: errorData.message || "حدث خطأ غير معروف.", status: true });
        return;
      }
      const data = await response.json();
      setGroups(data.data || []);
      setError({ message: "", status: false });
    } catch (err) {
      console.error("Error fetching groups:", err);
      setError({ message: "فشل الاتصال بالخادم", status: true });
    }
  };

  useEffect(() => {
    const fetchSelectData = async () => {
      try {
        const [teachersRes, yearsRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/teacher/get_teachers`),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/academicyear/get_academic_years`)
        ]);

        if (teachersRes.ok) {
          const tData = await teachersRes.json();
          setTeachers(tData.data || []);
        }
        if (yearsRes.ok) {
          const yData = await yearsRes.json();
          setAcademicYears(yData.data || []);
        }
      } catch (err) {
        console.error("Error fetching select data:", err);
      }
    };

    fetchData();
    fetchSelectData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        groupName: formData.groupName,
        dayOfWeek: formData.dayOfWeek,
        time: formData.time,
        teacherId: Number(formData.teacherId),
        academicYearId: Number(formData.academicYearId)
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/group/add_group`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(errorData.message || "حدث خطأ أثناء الإضافة");
        return;
      }

      const data = await response.json();
      toast.success(data.message || "تمت إضافة المجموعة بنجاح");
      setIsOpen(false);
      setForm({
        groupName: "",
        dayOfWeek: "",
        time: "",
        teacherId: "",
        academicYearId: ""
      });
      fetchData();
    } catch (err) {
      console.error("Error adding group:", err);
      toast.error("فشل الاتصال بالخادم.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">المجموعات</h2>
          <p className="text-sm text-muted-foreground mt-0.5">إدارة المجموعات الدراسية وحصصها</p>
        </div>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <button className="cursor-pointer px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
              + إضافة مجموعة
            </button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] p-6 sm:p-8">
            <DialogHeader className="mb-4">
              <DialogTitle className="text-2xl font-bold text-center">إضافة مجموعة جديدة</DialogTitle>
              <DialogDescription className="text-base text-center mt-2">
                أدخل بيانات المجموعة الدراسية الجديدة لتسجيلها في النظام.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-5">

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">المدرس</Label>
                  <Select value={formData.teacherId} onValueChange={(val) => setForm({ ...formData, teacherId: val })}>
                    <SelectTrigger className="h-12! w-full">
                      <SelectValue placeholder="اختر المدرس" />
                    </SelectTrigger>
                    <SelectContent position="popper" className='w-full'>
                      {teachers.map(t => (
                        <SelectItem key={t.id} value={t.id.toString()}>{t.name} ({t.subjectName})</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">السنة الدراسية</Label>
                  <Select value={formData.academicYearId} onValueChange={(val) => setForm({ ...formData, academicYearId: val })}>
                    <SelectTrigger className="h-12! w-full">
                      <SelectValue placeholder="اختر السنة" />
                    </SelectTrigger>
                    <SelectContent position="popper" className='w-full'>
                      {academicYears.map(y => (
                        <SelectItem key={y.id} value={y.id.toString()}>{y.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">اليوم</Label>
                  <Select value={formData.dayOfWeek} onValueChange={(val) => setForm({ ...formData, dayOfWeek: val })}>
                    <SelectTrigger className="h-12! w-full">
                      <SelectValue placeholder="اختر اليوم" />
                    </SelectTrigger>
                    <SelectContent position="popper" className='w-full'>
                      {DAYS.map(day => (
                        <SelectItem key={day} value={day}>{day}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 w-full">
                  <Label className="text-sm font-semibold">الوقت</Label>
                  <Input
                    type="time"
                    className="h-12 w-full"
                    value={formData.time}
                    onChange={(e) => setForm({ ...formData, time: e.target.value })}
                  />
                </div>
              </div>

              <DialogFooter className="mt-6">
                <button type="submit" className="w-full h-11 cursor-pointer bg-primary text-primary-foreground rounded-lg font-bold hover:bg-primary/90 transition-all shadow-md">
                  حفظ المجموعة
                </button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div>
        {error.status && <ErrorBox message={error.message} />}
      </div>

      {groups.length === 0 && !error.status && (
        <div className="text-center py-20 bg-muted/10 rounded-xl border border-dashed">
          <p className="text-muted-foreground">لا توجد مجموعات دراسية حالياً</p>
        </div>
      )}

      <div className="space-y-3">
        {groups.map((group, idx) => (
          <div key={idx} className="rounded-xl border bg-card overflow-hidden">
            <div
              className="p-4 flex items-center justify-between cursor-pointer hover:bg-muted/30 transition-colors"
              onClick={() => setExpanded(expanded === idx.toString() ? null : idx.toString())}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-sm">
                  {group.studentCount}
                </div>
                <div>
                  <h3 className="font-semibold text-sm">{group.groupName}</h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-muted-foreground">{group.teacherName}</span>
                    <span className="text-xs text-muted-foreground">•</span>
                    <span className="text-xs text-muted-foreground">{group.dayOfWeek + " " + " - " + " " + formatTimeRange(group.time)}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="hidden sm:block text-xs px-2 py-0.5 rounded-full bg-muted">{group.subjectName}</span>
                <span className="hidden md:block text-xs px-2 py-0.5 rounded-full bg-muted">{group.academicYearName}</span>
                {group.sessionLogs.some((session: any) => session.closeTime === null) && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400">حصة مفتوحة</span>
                )}
                {expanded === idx.toString() ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
              </div>
            </div>

            {expanded === idx.toString() && (
              <div className="border-t p-4 space-y-4 bg-muted/20">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="p-3 rounded-lg bg-card border text-center">
                    <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{group.studentCount}</p>
                    <p className="text-xs text-muted-foreground">طالب</p>
                  </div>
                  <div className="p-3 rounded-lg bg-card border text-center">
                    <p className="text-lg font-bold text-amber-600 dark:text-amber-400">{group.sessionCount}</p>
                    <p className="text-xs text-muted-foreground">حصة</p>
                  </div>
                  <div className="p-3 rounded-lg bg-card border text-center">
                    <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{group.totalRevenue.toLocaleString()} ج</p>
                    <p className="text-xs text-muted-foreground">الإيرادات</p>
                  </div>
                  <div className="p-3 rounded-lg bg-card border text-center">
                    <p className="text-lg font-bold text-rose-600 dark:text-rose-400">{group.netProfit.toLocaleString()} ج</p>
                    <p className="text-xs text-muted-foreground">صافي الربح</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-card border">
                    <h4 className="text-sm font-medium mb-3 flex items-center gap-2"><PieChart className="w-4 h-4" /> تحليل المجموعة والطلاب</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">نصيب المدرس:</span>
                        <span className="font-semibold text-amber-600">{group.teacherProfit.toLocaleString()} ج</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">نصيب السنتر:</span>
                        <span className="font-semibold text-blue-600">{group.centerProfit.toLocaleString()} ج</span>
                      </div>
                      <div className="pt-2 border-t flex items-center justify-between">
                        <button className="text-xs flex items-center gap-1 text-blue-600 hover:underline">
                          <Users className="w-3 h-3" /> عرض قائمة الطلاب ({group.studentCount})
                        </button>
                        <span className="text-xs text-muted-foreground italic">
                          متوسط الطالب: {Math.round(group.totalRevenue / (group.studentCount || 1))} ج
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-2 flex items-center gap-2"><Calendar className="w-4 h-4" /> الحصص</h4>
                    <div className="space-y-1 max-h-40 overflow-y-auto">
                      {group.sessionLogs.length === 0 && <div className="py-10 rounded-xl border border-dashed">
                        <p className="text-center text-muted-foreground">لا توجد حصص</p>
                      </div>}
                      {group.sessionLogs.map((ses: any, sIdx: number) => (
                        <div key={sIdx} className="flex items-center justify-between py-1.5 px-3 rounded-lg bg-card border text-xs">
                          <span>{new Date(ses.date).toLocaleDateString('ar-EG')}</span>
                          <span className="text-green-600 dark:text-green-400">حضر {ses.presentCount}</span>
                          {ses.absentCount > 0 && <span className="text-rose-600 dark:text-rose-400">غاب {ses.absentCount}</span>}
                          <span className="font-medium">{ses.netProfit} ج</span>
                          <span className={`px-1.5 py-0.5 rounded-full ${ses.closeTime === null ? 'bg-emerald-500/10 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400' : 'bg-muted text-muted-foreground'}`}>
                            {ses.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}



