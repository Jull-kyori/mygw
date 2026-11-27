import type { Metadata } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import './globals.css';
import { site } from '@/config/site';

const inter = Inter({ subsets: ['latin'], variable: '--font-body', display: 'swap' });
const space = Space_Grotesk({ subsets: ['latin'], variable: '--font-display', display: 'swap' });
export const metadata: Metadata = {
  title: 'Faza Ilmal Mughni — Portofolio', description: site.description,
  metadataBase: new URL(site.url), openGraph: { title: 'Faza Ilmal Mughni — Portofolio', description: site.description, type: 'website', locale: 'id_ID', images: [{ url: '/og-image.svg', width: 1200, height: 630, alt: 'Portofolio Faza Ilmal Mughni' }] },
  robots: { index: true, follow: true },
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="id"><body className={`${inter.variable} ${space.variable}`}>{children}</body></html>;
}
