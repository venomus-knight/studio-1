import type {Metadata} from 'next';
import { Inter, Lora } from 'next/font/google';
import './globals.css';
import {Toaster} from '@/components/ui/toaster';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const lora = Lora({
  subsets: ['latin'],
  variable: '--font-lora',
  weight: ['400', '700'],
});

export const metadata: Metadata = {
  title: 'LegalPrecedentAI - The Precedent Research Platform',
  description:
    'Access landmark judgments from the Supreme Court of India and High Courts. Find relevant case precedents with advanced AI powered by Indian legal knowledge.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${lora.variable} antialiased`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
