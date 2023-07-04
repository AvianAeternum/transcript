"use client";

import '../styles/globals.scss'
import localFont from 'next/font/local';
import {ContentHookProvider} from "@/hook/ContentHook";

const berkeleyMono = localFont({
    src: [
        {
            path: '/fonts/BerkeleyMono-Regular.woff2',
            weight: '400',
            style: 'normal',
        },
        {
            path: '/fonts/BerkeleyMono-Bold.woff2',
            weight: '700',
            style: 'normal',
        },
        {
            path: '/fonts/BerkeleyMono-Italic.woff2',
            weight: '400',
            style: 'italic',
        },
        {
            path: '/fonts/BerkeleyMono-BoldItalic.woff2',
            weight: '700',
            style: 'italic',
        }
    ]
});

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
        <body className={berkeleyMono.className}>
        <ContentHookProvider>
            {children}
        </ContentHookProvider>
        </body>
        </html>
    )
}
