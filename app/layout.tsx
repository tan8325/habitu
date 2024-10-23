import { Toaster } from "sonner"
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

import { ThemeProvider } from '@/components/providers/theme-provider'
import { Providers } from '@/components/providers/convex-provider'
import { ModalProvider } from "@/components/providers/modal-provider"

import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'HabitU',
  description: 'Smart Habit Tracker',
  icons: {
    icon: [
      {
        media: "(prefers-color-scheme: light)",
        url: "/logo.svg",
        href: "/logo.svg",
      },
      {
        media: "(prefers-color-scheme: dark)",
        url: "/logo-dark.svg",
        href: "/logo-dark.svg",
      }
    ]
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
            storageKey='habitu-theme'
          >
            <Toaster position="bottom-center" />
            <ModalProvider />
            <Providers>{children}</Providers>
            </ThemeProvider>
      </body>
    </html>
  )
}
