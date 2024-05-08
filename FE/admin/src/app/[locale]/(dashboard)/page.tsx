"use client";
import {useTranslations} from 'next-intl';
import { useRouter } from "next/navigation";
export default function Index() {
  const router = useRouter()
  router.push('/overview')
}