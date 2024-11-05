"use client";

import { ReactNode, useEffect } from "react";
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ClerkProvider, useAuth } from "@clerk/clerk-react";
import {useTheme } from 'next-themes'
import { dark } from '@clerk/themes'

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export const ConvexProviders = ({
  children
}: {
  children: ReactNode;
}) => {
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
    >
      
      <ConvexProviderWithClerk
        useAuth={useAuth}
        client={convex}
      >
        {children}
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
};
