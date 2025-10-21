import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ScrollToHash from '@/components/ScrollToHash';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Vimos Mart cửa hàng tiện ích Dr Giang",
  description: "Vimos Mart cửa hàng tiện ích Dr Giang. Khám phá các sản phẩm chất lượng cao với ưu đãi đặc biệt.",
  keywords: "vimos mart, cửa hàng tiện ích, dr giang, sản phẩm chất lượng",
  authors: [{ name: "Vimos Mart" }],
  creator: "Vimos Mart",
  publisher: "Vimos Mart",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: "Vimos Mart cửa hàng tiện ích Dr Giang",
    description: "Vimos Mart cửa hàng tiện ích Dr Giang. Khám phá các sản phẩm chất lượng cao với ưu đãi đặc biệt.",
    type: "website",
    locale: "vi_VN",
    url: "https://vimosmart.vn",
    siteName: "Vimos Mart",
    images: [
      {
        url: "https://vimosmart.vn/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Vimos Mart cửa hàng tiện ích Dr Giang",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Vimos Mart cửa hàng tiện ích Dr Giang",
    description: "Vimos Mart cửa hàng tiện ích Dr Giang",
    images: ["https://vimosmart.vn/og-image.jpg"],
  },
  verification: {
    google: "your-google-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <head>
        <meta charSet="utf-8" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
  <Header />
  <main>{children}</main>
  <Footer />
  <ScrollToHash />
      </body>
    </html>
  );
}
