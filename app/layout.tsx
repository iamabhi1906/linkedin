import type { Metadata } from 'next';
import './globals.css';
import Providers from './providers';
import { ibmPlex } from './ui/fonts';

export const metadata: Metadata = {
  title: 'LinkedIn',
  description: 'A simple clone of linkedin',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${ibmPlex.className}`}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
