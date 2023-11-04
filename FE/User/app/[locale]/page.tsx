"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";

export default function Home({ params }: { params: { locale: string } }) {
    const t = useTranslations("Home");
    return <div className='h-screen'>Home</div>;
}
