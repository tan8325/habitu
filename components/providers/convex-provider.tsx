'use client'

import { ClerkProvider, useAuth } from '@clerk/nextjs'
import { dark } from '@clerk/themes'
import {ConvexReactClient } from 'convex/react'
import { ConvexProviderWithClerk } from 'convex/react-clerk'
import {useTheme } from 'next-themes'
import { ReactNode, useEffect } from 'react'

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!)

export function Providers({ children }: { children: ReactNode }) {
  const { resolvedTheme, setTheme } = useTheme()

  useEffect(() => {
    const actualTheme = localStorage.getItem('habitu-theme')
    setTheme(actualTheme || 'system')
  }, [setTheme])

  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY!}
      appearance={{
        baseTheme: resolvedTheme === 'dark' ? dark : undefined
      }}
      afterSignOutUrl="/"
    >
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        {children}
      </ConvexProviderWithClerk>
    </ClerkProvider>
  )
}