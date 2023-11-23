import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import Footer from "../components/footer/footer";
import NavBar from "../components/header/navbar";
import Container from "../components/container";
import "../globals.css";
//Internationalization
import { NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import ChatIcon from "../components/chaticon";
import Provider from "../components/SessionProvider";

export function generateStaticParams() {
    return [{ locale: "vi" }, { locale: "en" }];
}

const roboto = Roboto({ subsets: ["latin"], weight: ["400", "700"] });
export const metadata: Metadata = {
    title: "Home Cuisine",
    description: "A restaurant",
};

export default async function RootLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: { locale: string };
}) {
    let messages;
    try {
        messages = (await import(`../../messages/${params.locale}.json`)).default;
    } catch (error) {
        notFound();
    }
    return (
        <html lang={params.locale}>
            <body className={`${roboto.className} text-slate-800`}>
                <NextIntlClientProvider
                    locale={params.locale}
                    messages={messages}
                >
                   <Provider>
                        <div className='flex flex-col min-h-screen'>
                            <NavBar/>
                            <main className='flex-grow overflow-hidden'>
                                <Container>
                                    <div className='w-full h-full py-4'>
                                        {children}
                                    </div>
                                </Container>
                            </main>
                            <ChatIcon />
                            <Footer/>
                        </div>
                   </Provider>
                </NextIntlClientProvider>
            </body>
        </html>
    );
}
