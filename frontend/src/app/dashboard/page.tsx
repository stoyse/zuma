"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    const userid = localStorage.getItem('zuma_userid');
    const token = localStorage.getItem('zuma_token');
    if (!userid || !token) {
      router.replace('/login');
    }
  }, [router]);

  return null;
}
