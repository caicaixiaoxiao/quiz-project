import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "你的咖啡性格是什么？",
  description: "5道题，找到最适合你的咖啡",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh">
      <body>{children}</body>
    </html>
  );
}
