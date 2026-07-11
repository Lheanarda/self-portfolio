import type { Metadata } from "next";
import * as stylex from "@stylexjs/stylex";
import { portfolioConfig } from "@/data/portfolio";
import { colors, fonts } from "@/styles/tokens.stylex";
import "./globals.css";

export const metadata: Metadata = {
  title: portfolioConfig.metadata.title,
  description: portfolioConfig.metadata.description,
  authors: [{ name: portfolioConfig.metadata.author }],
  creator: portfolioConfig.metadata.creator,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang={portfolioConfig.document.lang}
      {...stylex.props(styles.document)}
    >
      <body {...stylex.props(styles.body)}>{children}</body>
    </html>
  );
}

const styles = stylex.create({
  document: {
    backgroundColor: colors.midnight,
    scrollBehavior: "smooth",
    scrollbarColor: colors.scrollbar,
  },
  body: {
    backgroundColor: colors.midnight,
    color: colors.bodyText,
    fontFamily: fonts.sans,
    fontWeight: 400,
    minHeight: "100vh",
    minWidth: 320,
    overflowX: "hidden",
  },
});
