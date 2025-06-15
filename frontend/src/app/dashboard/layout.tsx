import ZumaLayout from '@/components/ZumaLayout';
import { ReactNode } from 'react';

export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <ZumaLayout>{children}</ZumaLayout>;
}
