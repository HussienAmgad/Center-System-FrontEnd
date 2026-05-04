import './globals.css';
import type { Metadata } from 'next';
import { Cairo } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import ShellWrapper from '@/components/shell-wrapper';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // هام جداً لتنسيق التنبيهات

const cairo = Cairo({ subsets: ['arabic', 'latin'] });

export const metadata: Metadata = {
  title: 'سنتر نجاح',
  description: 'نظام إدارة المراكز التعليمية',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body className={cairo.className}>
        <ThemeProvider>
          <ShellWrapper>{children}</ShellWrapper>
        </ThemeProvider>
        <ToastContainer />
      </body>
    </html>
  );
}
