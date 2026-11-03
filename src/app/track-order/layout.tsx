import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";

// The page is a client component, so its metadata lives here.
export const metadata: Metadata = pageMeta({
  title: "Track your order",
  description: "Follow your Sachika Spices order from our unit in Odisha to your door.",
  path: "/track-order",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
