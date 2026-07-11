import type { Metadata } from "next";
import { portfolioConfig } from "@/data/portfolio";
import "./globals.css";

export const metadata: Metadata = {
  title: portfolioConfig.metadata.title,
  description: portfolioConfig.metadata.description,
  authors: [{ name: portfolioConfig.metadata.author }],
  creator: portfolioConfig.metadata.creator,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang={portfolioConfig.document.lang}><body>{children}</body></html>;
}
