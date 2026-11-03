import type { Metadata, Viewport } from "next";
import { Fraunces, Manrope, Noto_Serif_Oriya } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/layout/SmoothScroll";
import Preloader from "@/components/layout/Preloader";
import Header from "@/components/layout/Header";
import MenuOverlay from "@/components/layout/MenuOverlay";
import CartDrawer from "@/components/layout/CartDrawer";
import SearchOverlay from "@/components/layout/SearchOverlay";
import Toast from "@/components/layout/Toast";
import Cursor from "@/components/layout/Cursor";
import Footer from "@/components/layout/Footer";
import { SITE } from "@/lib/seo";

const fraunces = Fraunces({ subsets: ["latin"], axes: ["opsz", "SOFT"], style: ["normal", "italic"], variable: "--font-fraunces" });
const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope" });
const odia = Noto_Serif_Oriya({ subsets: ["oriya"], weight: ["400", "600"], variable: "--font-noto-oriya" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  alternates: { canonical: "/" },
  title: {
    default: "Sachika Spices — Pure spices, finely ground",
    template: "%s · Sachika Spices",
  },
  description: SITE.description,
  applicationName: SITE.name,
  keywords: ["Sachika Spices", "Sachika", "turmeric powder", "chilli powder", "coriander powder", "cumin powder", "maize powder", "millet flour", "Indian spices online", "spice manufacturer"],
  formatDetection: { telephone: false },
  openGraph: {
    title: "Sachika Spices — Pure spices, finely ground",
    description: SITE.description,
    url: "/",
    siteName: SITE.name,
    locale: SITE.locale,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sachika Spices — Pure spices, finely ground",
    description: SITE.description,
  },
};

export const viewport: Viewport = {
  themeColor: "#6d3b07",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${fraunces.variable} ${manrope.variable} ${odia.variable} antialiased`}>
      <body>
        <Preloader />
        <SmoothScroll />
        <Header />
        <MenuOverlay />
        <CartDrawer />
        <SearchOverlay />
        <main>{children}</main>
        <Footer />
        <Toast />
        <Cursor />
      </body>
    </html>
  );
}
