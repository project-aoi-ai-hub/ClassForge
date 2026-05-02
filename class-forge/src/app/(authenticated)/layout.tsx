// ===========================================
// 認証済みページ用レイアウト
// ===========================================

import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import AuthProvider from "@/components/providers/AuthProvider";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default async function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

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
