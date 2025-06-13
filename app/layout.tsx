import type { Metadata } from 'next'
import './globals.css'
import RedirectOnRefresh from './RedirectOnRefresh';

export const metadata: Metadata = {
  title: 'Truedose',
  description: 'Truedose Application',
  generator: 'Truedose',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <RedirectOnRefresh>{children}</RedirectOnRefresh>
      </body>
    </html>
  );
}
