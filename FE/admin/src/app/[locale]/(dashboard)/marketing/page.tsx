"use client";
import { useRouter } from "next/navigation";

export default function Marketing() {
  const router = useRouter()
  router.push('/marketing/campaigns')
}