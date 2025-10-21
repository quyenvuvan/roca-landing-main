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
  title: "Xuyên Việt Coop - Sản phẩm Việt - Giá Trị Việt | Duy Nhất Tại Hội Nghị",
  description: "Xuyên Việt Coop - Sản phẩm Việt - Giá Trị Việt. Khám phá các sản phẩm chất lượng cao với ưu đãi đặc biệt. MUA 2 TẶNG 1 duy nhất tại hội nghị!",
  keywords: "xuyên việt coop, sản phẩm việt, giá trị việt, cooperative, ưu đãi hội nghị, ocean park, sản phẩm chất lượng",
  authors: [{ name: "Xuyên Việt Coop" }],
  creator: "Xuyên Việt Coop",
  publisher: "Xuyên Việt Coop",
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
    title: "Xuyên Việt Coop - Sản phẩm Việt - Giá Trị Việt | Duy Nhất Tại Hội Nghị",  
    description: "Xuyên Việt Coop - Sản phẩm Việt - Giá Trị Việt. Khám phá các sản phẩm chất lượng cao với ưu đãi đặc biệt. MUA 2 TẶNG 1 duy nhất tại hội nghị!",
    type: "website",
    locale: "vi_VN",
    url: "https://xuyenvietcoop.vn",
    siteName: "Xuyên Việt Coop",
    images: [
      {
        url: "https://xuyenvietcoop.vn/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Xuyên Việt Coop - Sản phẩm Việt - Giá Trị Việt",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Xuyên Việt Coop - Sản phẩm Việt - Giá Trị Việt",
    description: "Sản phẩm Việt - Giá Trị Việt duy nhất tại hội nghị Ocean Park 1",
    images: ["https://xuyenvietcoop.vn/og-image.jpg"],
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
