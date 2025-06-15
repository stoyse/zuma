import ZumaLayout from '@/components/ZumaLayout';
import { ReactNode } from 'react';

export default function AgentsLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <ZumaLayout>{children}</ZumaLayout>;
}
