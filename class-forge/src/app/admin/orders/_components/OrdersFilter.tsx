"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useRef } from "react";

type Course = {
  id: string;
  title: string;
};

type Props = {
  courses: Course[];
  defaultFrom?: string;
  defaultTo?: string;
  defaultCourseId?: string;
};

export default function OrdersFilter({ courses, defaultFrom, defaultTo, defaultCourseId }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const fromRef = useRef<HTMLInputElement>(null);
  const toRef = useRef<HTMLInputElement>(null);
  const courseRef = useRef<HTMLSelectElement>(null);

  const hasActiveFilter = !!(defaultFrom || defaultTo || defaultCourseId);

  function applyFilter() {
    const params = new URLSearchParams(searchParams.toString());
    const from = fromRef.current?.value;
    const to = toRef.current?.value;
    const courseId = courseRef.current?.value;

    if (from) {
      params.set("from", from);
    } else {
      params.delete("from");
    }
    if (to) {
      params.set("to", to);
    } else {
      params.delete("to");
    }
    if (courseId) {
      params.set("courseId", courseId);
    } else {
      params.delete("courseId");
    }

    router.push(`${pathname}?${params.toString()}`);
  }

  function resetFilter() {
    router.push(pathname);
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5 mb-6">
      <p className="text-xs font-medium text-gray-500 mb-3">絞り込み</p>
      <div className="flex flex-wrap gap-3 items-end">
        {/* 開始日 */}
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-500">開始日</label>
          <input
            ref={fromRef}
            type="date"
            defaultValue={defaultFrom ?? ""}
            className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        {/* 終了日 */}
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-500">終了日</label>
          <input
            ref={toRef}
            type="date"
            defaultValue={defaultTo ?? ""}
            className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        {/* 講座 */}
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-500">講座</label>
          <select
            ref={courseRef}
            defaultValue={defaultCourseId ?? ""}
            className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white min-w-[180px]"
          >
            <option value="">すべての講座</option>
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.title}
              </option>
            ))}
          </select>
        </div>

        {/* ボタン */}
        <div className="flex gap-2">
          <button
            onClick={applyFilter}
            className="text-sm font-medium bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
          >
            絞り込む
          </button>
          {hasActiveFilter && (
            <button
              onClick={resetFilter}
              className="text-sm font-medium text-gray-500 border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              リセット
            </button>
          )}
        </div>
      </div>

      {hasActiveFilter && (
        <p className="text-xs text-primary-600 mt-3">フィルター適用中</p>
      )}
    </div>
  );
}
