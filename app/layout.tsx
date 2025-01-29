import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"], weight: ['300', '400', '500', '600', '700'] });

export const metadata: Metadata = {
  title: "Okwega - Find Your Perfect Mentor",
  description: "Connect with industry experts for personalized mentorship and career growth",
  icons: {
    icon: [
      {
        url: '/favicon.svg',
        type: 'image/svg+xml',
        sizes: 'any', // SVG is scalable, so 'any' is more appropriate
      }
    ],
    apple: {
      url: '/favicon.svg',
      type: 'image/svg+xml', // Add MIME type for SVG
      sizes: 'any', // SVG is scalable
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}