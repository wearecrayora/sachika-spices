import type { Metadata } from "next";

// The page is a client component, so its metadata lives here.
export const metadata: Metadata = { title: "Order placed", robots: { index: false } };

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
