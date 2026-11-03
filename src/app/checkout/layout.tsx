import type { Metadata } from "next";

// The page is a client component, so its metadata lives here.
export const metadata: Metadata = { title: "Checkout", robots: { index: false } };

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
