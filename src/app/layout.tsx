/* eslint-disable react-refresh/only-export-components */
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from './providers';
import Header from '@components/header/Header';
import Footer from '@components/footer/Footer';

import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'REST Client',
  description: 'Final project of the react RS School course',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <Header />
          <main className="flex flex-col items-center justify-self-center">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
