import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import {Sidebar} from '@/components/Sidebar'
import {Header} from '@/components/Header'
import '../globals.css'
import Colors  from '@/app/variables.module.scss'
import { ReactNode } from 'react'
import { NextIntlClientProvider, useLocale, useMessages } from 'next-intl'
import { headers } from 'next/headers';
import { notFound } from 'next/navigation'
import { DynamicBreadcrumb } from '@/components'
import {variables} from '@/app'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'RMS',
  description: 'Generated by create next app',
}

interface LocaleLayoutProps {
    children: ReactNode;
    params: {
        locale: string;
    };
}

 

export default function LocaleLayout({children, params}: LocaleLayoutProps) {

    const header = headers();
    const localeHeader = header.get('x-next-intl-locale');
    if (localeHeader === null) {
        notFound();
    }

    const locale = useLocale();
    const messages = useMessages();

    // Validate that the incoming `locale` parameter is a valid locale
    if (params.locale !== locale) {
        notFound();
    }


    return (
        <html lang={locale} >
            <body className={inter.className}>
            <NextIntlClientProvider locale={locale} messages={messages}>
               <div className="flex relative justify-center min-h-screen" style={{backgroundColor: Colors.defaultBackgroundColor }}>
                    <Sidebar />
                    <Header />
                    <div className="min-h-screen  ps-sidebar mx-4 flex flex-col items-center w-full space-y-2" style={{
                        paddingTop: `calc(${variables.headerHeight} + 8px)`
                    }}>
                        <DynamicBreadcrumb />
                        <div className='flex-1 w-full' >{children}  </div>
                    </div>
                </div>
            </NextIntlClientProvider>
            </body>
        </html>
  )
}
