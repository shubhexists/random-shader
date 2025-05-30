import ShaderPlayground from "@/components/shader-playground"
import { ThemeProvider } from "@/components/theme-provider"

export default function Home() {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <main className="min-h-screen bg-background">
        <ShaderPlayground />
      </main>
    </ThemeProvider>
  )
}
