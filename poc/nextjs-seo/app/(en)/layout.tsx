import type { ReactNode } from 'react';
import '../globals.css';

export default function EnglishRootLayout({ children }: { children: ReactNode }) {
  return <html lang="en" dir="ltr"><body>{children}</body></html>;
}
