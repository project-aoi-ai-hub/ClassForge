// ===========================================
// ルートレイアウト
// ===========================================

import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "ClassForge - オンライン講座プラットフォーム",
    template: "%s | ClassForge",
  },
  description:
    "ClassForgeは、AIを活用したスキルを学べるオンライン講座プラットフォームです。ChatGPT、AI副業、業務自動化などの実践的な講座を提供しています。",
  keywords: ["オンライン講座", "AI学習", "ChatGPT", "副業", "自動化", "LMS"],
  openGraph: {
    title: "ClassForge - オンライン講座プラットフォーム",
    description: "AIを活用したスキルを学べるオンライン講座プラットフォーム",
    type: "website",
    locale: "ja_JP",
    siteName: "ClassForge",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <body className="min-h-screen bg-white text-gray-900 antialiased">
        {children}
      </body>
    </html>
  );
}
