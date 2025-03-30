import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { ThemeProvider } from "@/components/theme-provider"
import { Montserrat } from "next/font/google"

// Initialize the Montserrat font
const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  variable: "--font-montserrat",
})

export const metadata: Metadata = {
  title: "Accent Analyzer",
  description: "Record and analyze your speech accent!"
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={montserrat.variable}>
      <body>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}



import './globals.css'