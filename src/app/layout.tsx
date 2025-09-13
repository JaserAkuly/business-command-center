import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import QueryProvider from '@/providers/query-provider'
import { MainNav, MobileNav } from '@/components/ui/nav'

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter"
});

export const metadata: Metadata = {
  title: "Business Command Center",
  description: "AI-powered restaurant portfolio management",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        <QueryProvider>
          <div className="min-h-screen bg-background">
            {/* Desktop Header */}
            <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <div className="container flex h-14 items-center">
                <div className="mr-4 hidden md:flex">
                  <Link href="/" className="mr-6 flex items-center space-x-2">
                    <div className="h-6 w-6 rounded-sm bg-primary" />
                    <span className="hidden font-bold sm:inline-block">BCC</span>
                  </Link>
                  <MainNav />
                </div>
                
                {/* Mobile Header */}
                <div className="flex md:hidden items-center justify-between w-full">
                  <Link href="/" className="flex items-center space-x-2">
                    <div className="h-6 w-6 rounded-sm bg-primary" />
                    <span className="font-bold">BCC</span>
                  </Link>
                </div>

                <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
                  <div className="w-full flex-1 md:w-auto md:flex-none" />
                  <nav className="flex items-center">
                    {/* User menu would go here */}
                  </nav>
                </div>
              </div>
            </header>

            {/* Main Content */}
            <main className="container py-6 pb-20 md:pb-6">
              {children}
            </main>

            {/* Mobile Navigation */}
            <MobileNav />
          </div>
        </QueryProvider>
      </body>
    </html>
  );
}
