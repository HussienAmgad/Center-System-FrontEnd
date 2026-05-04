'use client';
import { usePathname } from 'next/navigation';
import Shell from './shell';

export default function ShellWrapper({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  return <Shell path={path}>{children}</Shell>;
}
