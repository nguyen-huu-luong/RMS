"use client";
import { useRouter } from "next/navigation";

export default function Business() {
  const router = useRouter()
  router.push('/bussiness/products')
}