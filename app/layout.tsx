import type React from "react"
import type { Metadata } from "next"
import { Geist } from 'next/font/google'
import "./globals.css"

const geist = Geist({
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "CriptoMaxi Tracker",
  description: "Gerencie seus investimentos em criptomoedas de forma anônima e segura",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={geist.className}>{children}</body>
    </html>
  )
}
