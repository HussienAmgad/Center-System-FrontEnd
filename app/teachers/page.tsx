"use client";

import { useEffect, useState } from 'react';
import { Phone, BookOpen, UsersRound } from 'lucide-react';
import { toast } from 'react-toastify';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ErrorBox } from "@/components/error-box";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function TeachersPage() {
  const [isOpen, setIsOpen] = useState(false);

  const [teachers, setTeachers] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [formData, setForm] = useState({
    name: "",
    phoneNumber: "",
    subjectId: ""
  });
  const [error, setError] = useState({
    message: "",
    status: false
  });

  const fetchData = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/teacher/get_teachers`);

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(errorData.message || "حدث خطأ غير معروف.");
        setError({
          message: errorData.message || "حدث خطأ غير معروف.",
          status: true
        });
        return;
      }

      const data = await response.json();
      setTeachers(data.data || []);
      setError({
        message: "",
        status: false
      });
    } catch (err) {
      console.error("Error fetching teachers:", err);
      toast.error("فشل الاتصال بالخادم.");
      setError({
        message: "فشل الاتصال بالخادم",
        status: true
      });
    }
  };

  useEffect(() => {
    const fetchsubject = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/subject/get_subjects`);

        if (!response.ok) {
          const errorData = await response.json();
          toast.error(errorData.message || "حدث خطأ غير معروف.");
          return;
        }
        const data = await response.json();
        setSubjects(data.data || []);
      } catch (err) {
        console.error("Error fetching subjects:", err);
        toast.error("فشل الاتصال بالخادم.");
      }
    };


    fetchsubject();
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/teacher/add_teacher`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          phoneNumber: formData.phoneNumber,
          subjectId: Number(formData.subjectId)
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(errorData.message || "حدث خطأ أثناء الإضافة");
        return;
      }

      const data = await response.json();

      setTeachers([...teachers, data.data]);
      setIsOpen(false);

      (e.target as HTMLFormElement).reset();
      setForm({ name: "", phoneNumber: "", subjectId: "" });
      toast.success(data.message || "تمت الإضافة بنجاح");
      fetchData();
    } catch (err) {
      console.error("Error adding teacher:", err);
      toast.error("فشل الاتصال بالخادم.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">المدرسين</h2>
          <p className="text-sm text-muted-foreground mt-0.5">إدارة بيانات المدرسين ومجموعاتهم</p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <button className="cursor-pointer px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
              + إضافة مدرس
            </button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px] p-6 sm:p-8">
            <DialogHeader className="mb-4">
              <DialogTitle className="text-2xl font-bold text-center">إضافة مدرس جديد</DialogTitle>
              <DialogDescription className="text-base text-center mt-2">
                أدخل بيانات المدرس الجديد في النظام.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="name" className="text-base font-semibold">اسم المدرس</Label>
                <Input
                  id="name"
                  placeholder="مثال: أحمد محمود"
                  required
                  className="h-12 text-base px-4"
                  value={formData.name}
                  onChange={(e) => setForm({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-5">
                <div className="space-y-3">
                  <Label htmlFor="phoneNumber" className="text-base font-semibold">رقم الهاتف</Label>
                  <Input
                    id="phoneNumber"
                    placeholder="مثال: 01012345678"
                    required
                    className="h-12 text-base px-4"
                    value={formData.phoneNumber}
                    onChange={(e) => setForm({ ...formData, phoneNumber: e.target.value })}
                  />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="subjectId" className="text-base font-semibold">المادة</Label>
                  <Select
                    value={formData.subjectId}
                    onValueChange={(value) => setForm({ ...formData, subjectId: value })}
                  >
                    <SelectTrigger id="subjectId" className="w-full h-12! text-base px-4">
                      <SelectValue placeholder="اختر المادة" />
                    </SelectTrigger>
                    <SelectContent position="popper" className="w-full">
                      {subjects.map(sub => (
                        <SelectItem key={sub.id} value={sub.id.toString()} className="text-base py-2">
                          {sub.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter className="mt-8">
                <button type="submit" className="w-full h-12 text-base cursor-pointer px-4 py-2 bg-primary text-primary-foreground rounded-lg font-bold hover:bg-primary/90 transition-colors shadow-sm">
                  إضافة البيانات
                </button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div>
        {error.status && <ErrorBox message={error.message} />}
      </div>

      {teachers.length === 0 && !error.status && (
        <div className="text-center py-20 bg-muted/10 rounded-xl border border-dashed">
          <p className="text-muted-foreground">لا توجد مدرسين</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {teachers.map((teacher, index) => (
          <div key={teacher.id || index} className="rounded-xl border bg-card p-5 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-blue-700 dark:text-blue-400 font-bold text-lg">
                  {teacher.name ? (teacher.name.split(' ')[1]?.[0] ?? teacher.name[0]) : '?'}
                </div>
                <div>
                  <h3 className="font-semibold">{teacher.name}</h3>
                  <div className="flex items-center gap-1 mt-0.5">
                    <Phone className="w-3 h-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">{teacher.phone || 'غير محدد'}</span>
                  </div>
                </div>
              </div>
              <span className="text-xs px-2 py-1 rounded-full bg-primary/10 dark:bg-primary/20 text-blue-700 dark:text-blue-400">
                {teacher.subjectName || 'غير محدد'}
              </span>
            </div>

            <div className="grid grid-cols-4 gap-2 mb-4">
              <div className="p-2 rounded-lg bg-muted text-center">
                <p className="text-base font-bold">{teacher.totalStudents || 0}</p>
                <p className="text-xs text-muted-foreground">طالب</p>
              </div>
              <div className="p-2 rounded-lg bg-muted text-center">
                <p className="text-base font-bold">{teacher.totalGroups || 0}</p>
                <p className="text-xs text-muted-foreground">مجموعة</p>
              </div>
              <div className="p-2 rounded-lg bg-muted text-center">
                <p className="text-base font-bold">{teacher.totalLessons || 0}</p>
                <p className="text-xs text-muted-foreground">حصة</p>
              </div>
              <div className="p-2 rounded-lg bg-muted text-center">
                <p className="text-base font-bold">{teacher.totalAcademicYears || 0}</p>
                <p className="text-xs text-muted-foreground">سنة</p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t">
              <div>
                <p className="text-xs text-muted-foreground">اجمالي ربح المدرس</p>
                <p className="text-sm font-semibold text-amber-600 dark:text-amber-400">{(teacher.totalTeacherProfit || 0).toLocaleString()} ج</p>
              </div>
              <div className="text-left">
                <p className="text-xs text-muted-foreground">إجمالي ربح السنتر</p>
                <p className="text-sm font-semibold text-rose-600 dark:text-rose-400">{(teacher.totalCenterProfit || 0).toLocaleString()} ج</p>
              </div>
              <div className="text-left">
                <p className="text-xs text-muted-foreground">متوسط ثمن الحصه</p>
                <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">{(teacher.averageLessonPrice || 0).toLocaleString()} ج</p>
              </div>
            </div>

            <div className="mt-3">
              <p className="text-xs text-muted-foreground mb-1.5">المجموعات:</p>
              <div className="flex flex-wrap gap-1">
                {(teacher.groupNames || []).map((gName: string, i: number) => (
                  <span key={i} className="text-xs px-2 py-0.5 rounded-full bg-muted border">{gName}</span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
