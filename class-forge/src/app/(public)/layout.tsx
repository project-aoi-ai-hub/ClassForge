// ===========================================
// 公開ページ用レイアウト
// ===========================================
// ヘッダー + フッター + SessionProvider

import AuthProvider from "@/components/providers/AuthProvider";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </AuthProvider>
  );
}
