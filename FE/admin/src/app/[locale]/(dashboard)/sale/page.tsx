"use client";
import { useRouter } from "next/navigation";

export default function Sale() {
  const router = useRouter()
  router.push('/sale/orders')
}