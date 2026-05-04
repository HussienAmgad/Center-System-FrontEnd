"use client";

import { useEffect, useState } from 'react';
import { BookOpen } from 'lucide-react';
import { toast } from 'react-toastify';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ErrorBox } from "@/components/error-box";

const colorMap: Record<string, string> = {
  blue: 'bg-blue-500/10 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400',
  emerald: 'bg-emerald-500/10 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400',
  amber: 'bg-amber-500/10 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400',
  rose: 'bg-rose-500/10 text-rose-700 dark:bg-rose-500/20 dark:text-rose-400',
  violet: 'bg-violet-500/10 text-violet-700 dark:bg-violet-500/20 dark:text-violet-400',
};

// const colorMap: Record<string, string> = {
//   blue: 'bg-blue-500/10 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400',
//   emerald: 'bg-emerald-500/10 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400',
//   amber: 'bg-amber-500/10 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400',
//   rose: 'bg-rose-500/10 text-rose-700 dark:bg-rose-500/20 dark:text-rose-400',
//   violet: 'bg-violet-500/10 text-violet-700 dark:bg-violet-500/20 dark:text-violet-400',
// };

export default function SubjectsPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [formData, setForm] = useState({
    name: ""
  });
  const [error, setError] = useState({
    message: "",
    status: false
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/subject/get_subjects`);

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
        setSubjects(data.data || []);
        setError({
          message: "",
          status: false
        });
      } catch (err) {
        console.error("Error fetching subjects:", err);
        toast.error("فشل الاتصال بالخادم.");
        setError({
          message: "فشل الاتصال بالخادم",
          status: true
        });
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/subject/add_subject`, {
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

      setSubjects([...subjects, data.data]);
      setIsOpen(false);

      (e.target as HTMLFormElement).reset();
      setForm({ name: "" });
      toast.success(data.message || "تمت الإضافة بنجاح");

    } catch (err) {
      console.error("Error adding subject:", err);
      toast.error("فشل الاتصال بالخادم.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">المواد الدراسية</h2>
          <p className="text-sm text-muted-foreground mt-0.5">إدارة المواد وعرض إحصاءاتها</p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <button className="cursor-pointer px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
              + إضافة مادة
            </button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px] p-6 sm:p-8">
            <DialogHeader className="mb-4">
              <DialogTitle className="text-2xl font-bold text-center">إضافة مادة جديدة</DialogTitle>
              <DialogDescription className="text-base text-center mt-2">
                أدخل اسم المادة التي تود إضافتها للنظام.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="name" className="text-base font-semibold">اسم المادة</Label>
                <Input
                  id="name"
                  placeholder="مثال: فيزياء"
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

      {subjects.length === 0 && !error.status && (
        <div className="text-center py-20 bg-muted/10 rounded-xl border border-dashed">
          <p className="text-muted-foreground">لا توجد مواد دراسية حالياً</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {subjects.map((sub, index) => {
          const colorKeys = Object.keys(colorMap);
          const colorClass = colorMap[sub.color] || colorMap[colorKeys[index % colorKeys.length]];

          return (
            <div key={sub.id} className="rounded-xl border bg-card p-5 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colorClass}`}>
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold">{sub.name}</h3>
                  <p className="text-xs text-muted-foreground">{sub.teachers ? sub.teachers.length : 0} مدرس</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-muted text-center">
                  <p className="text-xl font-bold">{sub.totalStudents || 0}</p>
                  <p className="text-xs text-muted-foreground">طالب</p>
                </div>
                <div className="p-3 rounded-lg bg-muted text-center">
                  <p className="text-xl font-bold">{sub.totalGroups || 0}</p>
                  <p className="text-xs text-muted-foreground">مجموعة</p>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t flex items-center justify-between">
                <span className="text-xs text-muted-foreground">الإيرادات</span>
                <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">{(sub.totalRevenue || 0).toLocaleString()} ج</span>
              </div>

              <div className="mt-3">
                <p className="text-xs text-muted-foreground mb-2">المدرسين:</p>
                <div className="flex flex-wrap gap-1">
                  {(sub.teachers || []).map((tName: string, i: number) => (
                    <span key={i} className={`text-xs px-2 py-0.5 rounded-full ${colorClass}`}>{tName}</span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
