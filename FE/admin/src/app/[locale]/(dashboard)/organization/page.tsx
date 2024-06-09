"use client";
import { useRouter } from "next/navigation";

export default function Organization() {
  const router = useRouter()
  router.push('/organization/employees')
}