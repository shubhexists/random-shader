import type React from "react"
import "@/app/globals.css"
import { Toaster } from "@/components/toaster"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <title>Shader Playground</title>
        <meta name="description" content="Crea y experimenta con shaders GLSL" />
      </head>
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  )
}

export const metadata = {
      generator: 'v0.dev'
    };
