import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import "./globals.css";
import { getUser } from "./actions";
import { cacheLife } from "next/cache";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export async function generateMetadata() {
    'use cache';
    cacheLife('hours');
    const user = await getUser();

    const firstName = user.name.split(" ")[0];

    return {
        title: {
            template: `%s | ${user.name}`,
            default: user.name,
        },
        description: `${firstName}. I build things.`
    }
}

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
    return <html lang="en">
        <Analytics />
        <body className={cn("antialiased max-w-full min-w-full min-h-screen flex bg-black", geistSans.variable, geistMono.variable)}>
            {children}
        </body>
    </html>
}
