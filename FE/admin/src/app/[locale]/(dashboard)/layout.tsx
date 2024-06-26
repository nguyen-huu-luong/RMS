import type { Metadata } from "next";
import { Inter } from "next/font/google";
import {Sidebar} from "@/components/Sidebar";
import Header from "@/components/Header";
import "../../globals.css";
import Colors from "@/app/variables.module.scss";
import { ReactNode } from "react";
import { NextIntlClientProvider, useLocale, useMessages } from "next-intl";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { variables } from "@/app";
import Provider from "@/components/SessionProvider/SessionProvider";
import { RootStyleRegistry } from "@/components/RootStyleRegistry";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Home cruise - CRM",
    description: "Restaurent management system",
    icons: {
        icon: "../../favicon.ico"
    }
};

interface LocaleLayoutProps {
    children: ReactNode;
    params: {
        locale: string;
    };
}

export default function LocaleLayout({ children, params }: LocaleLayoutProps) {
    const header = headers();
    const localeHeader = header.get("x-next-intl-locale");
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
        <html lang={locale}>

            <body className={inter.className}>
                <NextIntlClientProvider locale={locale} messages={messages}>
                    <Provider>
                        <RootStyleRegistry>
                            <div
                                className='flex relative justify-center max-h-screen overflow-scroll'
                                style={{
                                    backgroundColor: Colors.defaultBackgroundColor,
                                }}
                            >
                                <Sidebar />
                                <Header />
                                <div
                                    className='ps-sidebar mx-4 flex flex-col items-center w-full space-y-2'
                                    style={{
                                        minHeight: "calc(100vh - var(--header-height))",
                                        marginTop: `calc(${variables.headerHeight} + 8px)`,
                                    }}
                                >
                                    <div className='flex-1 w-full'>
                                        {children}
                                    </div>
                                </div>
                            </div>
                        </RootStyleRegistry>
                    </Provider>
                </NextIntlClientProvider>
            </body>
        </html>
    );
}
