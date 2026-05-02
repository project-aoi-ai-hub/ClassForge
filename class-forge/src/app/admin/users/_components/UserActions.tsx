"use client";

import { useTransition } from "react";
import { toggleUserRole, deleteUser } from "../actions";

interface UserActionsProps {
  userId: string;
  role: "ADMIN" | "USER";
  isSelf: boolean;
}

export default function UserActions({ userId, role, isSelf }: UserActionsProps) {
  const [isPending, startTransition] = useTransition();

  if (isSelf) {
    return <span className="text-xs text-gray-400">（自分）</span>;
  }

  const handleToggleRole = () => {
    startTransition(async () => {
      const result = await toggleUserRole(userId);
      if (!result.success) alert(result.error);
    });
  };

  const handleDelete = () => {
    if (!confirm("このユーザーを削除しますか？この操作は取り消せません。")) return;
    startTransition(async () => {
      const result = await deleteUser(userId);
      if (!result.success) alert(result.error);
    });
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleToggleRole}
        disabled={isPending}
        className="text-xs font-medium px-2.5 py-1 rounded-lg border border-gray-200 text-gray-600 hover:border-primary-300 hover:text-primary-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {role === "ADMIN" ? "一般に変更" : "管理者に変更"}
      </button>
      <button
        onClick={handleDelete}
        disabled={isPending}
        className="text-xs font-medium px-2.5 py-1 rounded-lg border border-gray-200 text-error-600 hover:border-error-300 hover:bg-error-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        削除
      </button>
    </div>
  );
}
