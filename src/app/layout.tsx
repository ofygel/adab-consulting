import '@/styles/globals.css';
import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ADAB CONSULTING',
  description: 'Шариат-комплаенс для ваших договоров',
  keywords: 'шариат, комплаенс, консалтинг, исламские финансы',
};

// Добавлено управление viewport
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <head>
        {/* Добавлен favicon для всех устройств */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body className={`${inter.className} bg-dark-bg min-h-screen flex flex-col`}>
        {children}
      </body>
    </html>
  );
}