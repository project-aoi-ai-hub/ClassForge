import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import NameForm from "./_components/NameForm";
import PasswordForm from "./_components/PasswordForm";

export const metadata: Metadata = {
  title: "アカウント設定 | ClassForge",
};

export default async function AccountPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  // セッション情報は更新が遅れることがあるため、DBから最新の情報を直接取得する
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { name: true },
  });

  const currentName = user?.name ?? session.user.name ?? "";

  return (
    <div className="max-w-2xl mx-auto py-10 px-4 sm:px-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">アカウント設定</h1>
      <p className="text-sm text-gray-500 mb-8">プロフィールとパスワードを管理します</p>

      <div className="space-y-6">
        <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-1">プロフィール</h2>
          <p className="text-sm text-gray-500 mb-5">表示名を変更します</p>
          <NameForm currentName={currentName} />
        </section>

        <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-1">パスワード変更</h2>
          <p className="text-sm text-gray-500 mb-5">現在のパスワードを確認してから変更します</p>
          <PasswordForm />
        </section>
      </div>
    </div>
  );
}
