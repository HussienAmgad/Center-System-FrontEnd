"use client";

import { AlertCircle, GraduationCap, Users, UsersRound } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { ErrorBox } from "@/components/error-box";

export default function YearsPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [academicYears, setAcademicYears] = useState<any[]>([]);
  const [formData, setForm] = useState({
    name: ""
  });
  const [error, setError] = useState({
    message: "",
    status: false
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/academicyear/add_academic_year`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: formData.name }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(errorData.message || "حدث خطأ أثناء الإضافة");
        return;
      }

      const data = await response.json();

      setAcademicYears([...academicYears, data.data]);
      setIsOpen(false);

      (e.target as HTMLFormElement).reset();
      setForm({ name: "" });
      toast.success(data.message || "تمت الإضافة بنجاح");

    } catch (err) {
      console.error("Error adding academic year:", err);
      toast.error("فشل الاتصال بالخادم.");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/academicyear/get_academic_years`);

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
        setAcademicYears(data.data);
        setError({
          message: "",
          status: false
        });
      } catch (err) {
        console.error("Error fetching academic years:", err);
        toast.error("فشل الاتصال بالخادم.");
        setError({
          message: "فشل الاتصال بالخادم",
          status: true
        });
      }
    };

    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">السنوات الدراسية</h2>
          <p className="text-sm text-muted-foreground mt-0.5">إدارة السنوات الدراسية وتفاصيلها</p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <button className="cursor-pointer px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
              + إضافة سنة
            </button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px] p-6 sm:p-8">
            <DialogHeader className="mb-4">
              <DialogTitle className="text-2xl font-bold text-center">إضافة سنة دراسية جديدة</DialogTitle>
              <DialogDescription className="text-base text-center mt-2">
                املأ بيانات الصف الدراسي واسم السنة الدراسية التي ستعمل معها.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="name" className="text-base font-semibold">الصف الدراسي</Label>
                <Input
                  id="name"
                  placeholder="مثال: الصف الأول الثانوي"
                  required
                  className="h-12 text-base px-4"
                  value={formData.name}
                  onChange={(e) => setForm({ ...formData, name: e.target.value })}
                />
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

      {academicYears.length === 0 && !error.status && (
        <div className="text-center py-20 bg-muted/10 rounded-xl border border-dashed">
          <p className="text-muted-foreground">لا توجد سنوات دراسية</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {academicYears.map(year => (
          <div key={year.id} className="rounded-xl border bg-card p-5 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 rounded-lg bg-primary/10 dark:bg-primary/20 flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-primary" />
              </div>
            </div>
            <h3 className="font-semibold text-base mb-3">{year.name}</h3>
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center p-2 rounded-lg bg-muted">
                <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                  {(year.groups || []).reduce((sum: number, group: any) => sum + (group._count?.students || 0), 0)}
                </p>
                <p className="text-xs text-muted-foreground">طالب</p>
              </div>
              <div className="text-center p-2 rounded-lg bg-muted">
                <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                  {new Set((year.groups || []).map((g: any) => g.teacherId)).size}
                </p>
                <p className="text-xs text-muted-foreground">مدرس</p>
              </div>
              <div className="text-center p-2 rounded-lg bg-muted">
                <p className="text-lg font-bold text-amber-600 dark:text-amber-400">
                  {year.groups?.length || 0}
                </p>
                <p className="text-xs text-muted-foreground">مجموعة</p>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t flex items-center justify-between text-xs text-muted-foreground">
              <span>
                {(year.groups || []).reduce((sum: number, group: any) => sum + (group._count?.lessons || 0), 0)} حصة مُنعقدة
              </span>
              <span className="text-blue-600 dark:text-blue-400 font-medium cursor-pointer hover:underline">
                التفاصيل
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-xl border bg-card overflow-hidden">
        <div className="p-4 border-b">
          <h3 className="font-semibold">جميع السنوات - جدول تفصيلي</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-right font-medium">السنة الدراسية</th>
                <th className="px-4 py-3 text-center font-medium">الطلاب</th>
                <th className="px-4 py-3 text-center font-medium">المدرسين</th>
                <th className="px-4 py-3 text-center font-medium">المجموعات</th>
                <th className="px-4 py-3 text-center font-medium">الحصص</th>
              </tr>
            </thead>
            <tbody>
              {academicYears.map(year => (
                <tr key={year.id} className="border-t hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 font-medium">{year.name}</td>
                  <td className="px-4 py-3 text-center">{(year.groups || []).reduce((sum: number, group: any) => sum + (group._count?.students || 0), 0)}</td>
                  <td className="px-4 py-3 text-center">{new Set((year.groups || []).map((g: any) => g.teacherId)).size}</td>
                  <td className="px-4 py-3 text-center">{year.groups?.length || 0}</td>
                  <td className="px-4 py-3 text-center">{(year.groups || []).reduce((sum: number, group: any) => sum + (group._count?.lessons || 0), 0)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}