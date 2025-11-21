import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';

export const metadata: Metadata = {
  title: 'Turbo Starter - Modern Full-Stack Monorepo',
  description:
    'A modern full-stack monorepo starter with NestJS, Next.js, Prisma, PostgreSQL, and shadcn/ui. Features blazing-fast development with Vite HMR and Turborepo caching.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <html lang="en" suppressHydrationWarning>
        <head />
        <body>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            {children}
          </ThemeProvider>
        </body>
      </html>
    </>
  );
}
