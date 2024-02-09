import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import dynamic from "next/dynamic"

const DatePicker = dynamic(() => import("@/components/ui/datepicker"), {ssr: false})

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
    title: "Daily Shaders",
    description: "I'm going to make a shader every day."
}

export default function RootLayout({
        children,
    }: Readonly<{
        children: React.ReactNode
    }>) {
    return <html lang="en" style={{ width: '100%', height: '100%' }}>
        <body style={{ width: '100%', height: '100%', pointerEvents: 'none' }} className={inter.className}>
            <nav>
                <DatePicker/>
            </nav>
            {children}
        </body>
    </html>
}
