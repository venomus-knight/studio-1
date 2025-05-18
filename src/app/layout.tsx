import type {Metadata} from 'next';
import { Inter, Lora } from 'next/font/google';
import './globals.css';
import {Toaster} from '@/components/ui/toaster';
import { AuthProvider } from '@/contexts/auth-context';
import { HistoryProvider } from '@/contexts/history-context';
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
  title: 'NYAI - The Precedent Research Platform',
  description:
    'Access landmark judgments from the Supreme Court of India and High Courts. Find relevant case precedents with advanced AI powered by Indian legal knowledge.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <HistoryProvider>
            {children}
          </HistoryProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
