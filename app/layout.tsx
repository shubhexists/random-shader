import type React from "react";
import "@/app/globals.css";
import { Toaster } from "@/components/toaster";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <title>Shader Playground</title>
        <meta
          name="description"
          content="Crea y experimenta con shaders GLSL"
        />
      </head>
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  );
}

export const metadata = {
  title: "Shader Playground",
  description: "Create and experiment with GLSL shaders in real time.",
  generator: "Next.js",
  applicationName: "Shader Playground",
  referrer: "origin-when-cross-origin",
  keywords: [
    "GLSL",
    "Shaders",
    "WebGL",
    "Fragment Shader",
    "Vertex Shader",
    "Monaco Editor",
    "Graphics Programming",
    "Shader Playground",
  ],
  authors: [{ name: "Shubham Singh", url: "https://github.com/shubhexists" }],
  creator: "Shubham Singh",
  publisher: "Shubham Singh",
  metadataBase: new URL("https://random-shader.shubh.sh"),
  openGraph: {
    title: "Shader Playground",
    description: "Write and visualize GLSL shaders directly from your browser.",
    url: "https://random-shader.shubh.sh",
    siteName: "Shader Playground",
    images: [
      {
        url: "https://random-shader.shubh.sh/og.png",
        width: 1200,
        height: 630,
        alt: "Shader Playground OG Image",
      },
    ],
    locale: "es_ES",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Shader Playground",
    description: "Write and visualize GLSL shaders directly from your browser.",
    creator: "@shubh_exists",
    images: ["https://random-shader.shubh.sh/og.png"],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  themeColor: "#0f172a",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
};
