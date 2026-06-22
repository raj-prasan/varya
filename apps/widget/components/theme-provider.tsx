"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes"
import { ConvexProvider, ConvexReactClient } from "convex/react"
import { Provider } from "jotai"
const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL || "");

function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return (
    <ConvexProvider client={convex}>
      <Provider>
        {children}
      </Provider>

    </ConvexProvider>
  )
}

export { ThemeProvider }
