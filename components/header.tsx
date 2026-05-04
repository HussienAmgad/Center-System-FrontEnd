'use client';
import { Menu, Sun, Moon, Bell } from 'lucide-react';
import { useTheme } from './theme-provider';
import { Button } from './ui/button';

interface Props { onMenuClick: () => void; title: string; }

export default function Header({ onMenuClick, title }: Props) {
  const { theme, toggle } = useTheme();
  return (
    <header className="h-18 border-b bg-card flex items-center justify-between px-4 lg:px-6 shrink-0">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="lg:hidden" onClick={onMenuClick}>
          <Menu className="w-5 h-5" />
        </Button>
        <h1 className="text-lg font-semibold">{title}</h1>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={toggle}>
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </Button>
        <Button variant="ghost" size="icon">
          <Bell className="w-4 h-4" />
        </Button>
      </div>
    </header>
  );
}
