// ===========================================
// 管理画面: 新規講座作成
// ===========================================

import type { Metadata } from "next";
import CourseNewForm from "./CourseNewForm";

export const metadata: Metadata = { title: "新規講座作成" };

export default function AdminCourseNewPage() {
  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">新規講座作成</h1>
        <p className="text-sm text-gray-500 mt-1">基本情報を入力して講座を作成してください。セクション・レッスンは作成後に追加できます。</p>
      </div>
      <CourseNewForm />
    </div>
  );
}
