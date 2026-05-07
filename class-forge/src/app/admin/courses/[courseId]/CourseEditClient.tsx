"use client";

// ===========================================
// 講座編集クライアントコンポーネント
// セクション・レッスン管理 + ドラッグ&ドロップ並び替え
// ===========================================

import { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import ThumbnailUpload from "@/components/admin/ThumbnailUpload";
import { formatPrice } from "@/lib/utils";

interface Lesson {
  id: string;
  title: string;
  slug: string;
  isPreview: boolean;
  duration: number | null;
  sortOrder: number;
}

interface Section {
  id: string;
  title: string;
  sortOrder: number;
  lessons: Lesson[];
}

interface Course {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  thumbnailUrl: string | null;
  price: number;
  status: "DRAFT" | "PUBLISHED";
  sections: Section[];
}

interface Props {
  course: Course;
}

// -------------------------------------------------------
// ドラッグハンドルアイコン
// -------------------------------------------------------
function GripIcon() {
  return (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true">
      <circle cx="5.5" cy="3.5" r="1.3" />
      <circle cx="5.5" cy="8" r="1.3" />
      <circle cx="5.5" cy="12.5" r="1.3" />
      <circle cx="10.5" cy="3.5" r="1.3" />
      <circle cx="10.5" cy="8" r="1.3" />
      <circle cx="10.5" cy="12.5" r="1.3" />
    </svg>
  );
}

// -------------------------------------------------------
// SortableSectionItem — useSortable フックをカプセル化
// -------------------------------------------------------
interface SortableSectionItemProps {
  section: Section;
  sIdx: number;
  courseId: string;
  editingSectionId: string | null;
  editingSectionTitle: string;
  setEditingSectionId: (id: string | null) => void;
  setEditingSectionTitle: (title: string) => void;
  onUpdateSection: (id: string) => void;
  onDeleteSection: (id: string) => void;
  addingLessonSectionId: string | null;
  setAddingLessonSectionId: (id: string | null) => void;
  newLessonTitle: string;
  setNewLessonTitle: (title: string) => void;
  isAddingLesson: boolean;
  onAddLesson: (e: React.FormEvent, sectionId: string) => void;
  onDeleteLesson: (lessonId: string) => void;
}

function SortableSectionItem({
  section,
  sIdx,
  courseId,
  editingSectionId,
  editingSectionTitle,
  setEditingSectionId,
  setEditingSectionTitle,
  onUpdateSection,
  onDeleteSection,
  addingLessonSectionId,
  setAddingLessonSectionId,
  newLessonTitle,
  setNewLessonTitle,
  isAddingLesson,
  onAddLesson,
  onDeleteLesson,
}: SortableSectionItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-white rounded-xl border overflow-hidden ${
        isDragging
          ? "border-primary-300 shadow-lg opacity-70 z-10"
          : "border-gray-100"
      }`}
    >
      {/* セクションヘッダー */}
      <div className="bg-gray-50 px-4 py-3 flex items-center gap-2">
        {/* ドラッグハンドル */}
        <button
          type="button"
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing text-gray-300 hover:text-gray-500 shrink-0 p-1 rounded transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
          aria-label="ドラッグして並び替え"
        >
          <GripIcon />
        </button>

        <span className="text-xs font-medium text-gray-400 w-5 shrink-0">
          {sIdx + 1}
        </span>

        {editingSectionId === section.id ? (
          <div className="flex-1 flex items-center gap-2">
            <input
              value={editingSectionTitle}
              onChange={(e) => setEditingSectionTitle(e.target.value)}
              className="flex-1 px-3 py-1.5 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
              autoFocus
            />
            <Button size="sm" variant="primary" onClick={() => onUpdateSection(section.id)}>
              保存
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setEditingSectionId(null)}>
              キャンセル
            </Button>
          </div>
        ) : (
          <>
            <span className="flex-1 font-semibold text-gray-900 text-sm">
              {section.title}
            </span>
            <span className="text-xs text-gray-400 mr-2">{section.lessons.length}レッスン</span>
            <button
              onClick={() => {
                setEditingSectionId(section.id);
                setEditingSectionTitle(section.title);
              }}
              className="text-xs text-gray-400 hover:text-gray-600 px-2 py-1 rounded transition-colors"
            >
              編集
            </button>
            <button
              onClick={() => onDeleteSection(section.id)}
              className="text-xs text-error-400 hover:text-error-600 px-2 py-1 rounded transition-colors"
            >
              削除
            </button>
          </>
        )}
      </div>

      {/* レッスン一覧 */}
      <div className="divide-y divide-gray-50">
        {section.lessons.map((lesson, lIdx) => (
          <div key={lesson.id} className="flex items-center gap-3 px-5 py-3">
            <span className="w-6 h-6 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center text-xs font-medium shrink-0">
              {lIdx + 1}
            </span>
            <span className="flex-1 text-sm text-gray-700">{lesson.title}</span>
            {lesson.isPreview && (
              <span className="text-xs bg-success-50 text-success-600 px-2 py-0.5 rounded-full font-medium">
                無料
              </span>
            )}
            {lesson.duration && (
              <span className="text-xs text-gray-400">
                {Math.floor(lesson.duration / 60)}分
              </span>
            )}
            <Link
              href={`/admin/courses/${courseId}/lessons/${lesson.id}`}
              className="text-xs text-primary-600 hover:text-primary-700 font-medium px-2 py-1 rounded transition-colors"
            >
              編集
            </Link>
            <button
              onClick={() => onDeleteLesson(lesson.id)}
              className="text-xs text-error-400 hover:text-error-600 px-2 py-1 rounded transition-colors"
            >
              削除
            </button>
          </div>
        ))}

        {/* レッスン追加フォーム */}
        {addingLessonSectionId === section.id ? (
          <form
            onSubmit={(e) => onAddLesson(e, section.id)}
            className="flex items-center gap-2 px-5 py-3 bg-primary-50/30"
          >
            <input
              value={newLessonTitle}
              onChange={(e) => setNewLessonTitle(e.target.value)}
              placeholder="レッスン名を入力..."
              className="flex-1 px-3 py-1.5 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
              autoFocus
            />
            <Button type="submit" size="sm" variant="primary" isLoading={isAddingLesson}>
              追加
            </Button>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => {
                setAddingLessonSectionId(null);
                setNewLessonTitle("");
              }}
            >
              キャンセル
            </Button>
          </form>
        ) : (
          <button
            onClick={() => {
              setAddingLessonSectionId(section.id);
              setNewLessonTitle("");
            }}
            className="w-full text-left px-5 py-2.5 text-sm text-gray-400 hover:text-primary-600 hover:bg-primary-50/30 transition-colors"
          >
            ＋ レッスンを追加
          </button>
        )}
      </div>
    </div>
  );
}

// -------------------------------------------------------
// メインコンポーネント
// -------------------------------------------------------
export default function CourseEditClient({ course: initialCourse }: Props) {
  const router = useRouter();
  const [, startTransition] = useTransition();

  // 基本情報フォーム
  const [title, setTitle] = useState(initialCourse.title);
  const [slug, setSlug] = useState(initialCourse.slug);
  const [description, setDescription] = useState(initialCourse.description ?? "");
  const [price, setPrice] = useState(String(initialCourse.price));
  const [status, setStatus] = useState<"DRAFT" | "PUBLISHED">(initialCourse.status);
  const [isSavingInfo, setIsSavingInfo] = useState(false);
  const [infoMessage, setInfoMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // セクション一覧（D&D楽観的更新のためローカル管理）
  const [sections, setSections] = useState<Section[]>(initialCourse.sections);
  const [reorderError, setReorderError] = useState<string | null>(null);

  // router.refresh() 後にサーバーデータで sections を同期
  useEffect(() => {
    setSections(initialCourse.sections);
  }, [initialCourse]);

  // セクション追加フォーム
  const [newSectionTitle, setNewSectionTitle] = useState("");
  const [isAddingSection, setIsAddingSection] = useState(false);

  // レッスン追加フォーム（セクションIDをキーとして管理）
  const [addingLessonSectionId, setAddingLessonSectionId] = useState<string | null>(null);
  const [newLessonTitle, setNewLessonTitle] = useState("");
  const [isAddingLesson, setIsAddingLesson] = useState(false);

  // セクション編集
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);
  const [editingSectionTitle, setEditingSectionTitle] = useState("");

  const refreshPage = () => {
    startTransition(() => router.refresh());
  };

  // -------------------------------------------------------
  // D&D センサー・ハンドラー
  // -------------------------------------------------------
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 4 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setReorderError(null);

    const prevSections = sections;
    const oldIndex = sections.findIndex((s) => s.id === active.id);
    const newIndex = sections.findIndex((s) => s.id === over.id);
    const reordered = arrayMove(sections, oldIndex, newIndex).map((s, i) => ({
      ...s,
      sortOrder: i,
    }));

    setSections(reordered); // 楽観的更新

    try {
      const res = await fetch(
        `/api/admin/courses/${initialCourse.id}/sections/reorder`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sections: reordered.map(({ id, sortOrder }) => ({ id, sortOrder })),
          }),
        }
      );
      if (!res.ok) throw new Error();
    } catch {
      setSections(prevSections); // ロールバック
      setReorderError("並び替えの保存に失敗しました。もう一度お試しください。");
    }
  };

  // -------------------------------------------------------
  // 基本情報保存
  // -------------------------------------------------------
  const saveInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingInfo(true);
    setInfoMessage(null);

    try {
      const res = await fetch(`/api/admin/courses/${initialCourse.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, slug, description, price: parseInt(price, 10) || 0, status }),
      });
      const data = await res.json();
      if (!res.ok) {
        setInfoMessage({ type: "error", text: data.error || "保存に失敗しました" });
      } else {
        setInfoMessage({ type: "success", text: "保存しました" });
        refreshPage();
      }
    } catch {
      setInfoMessage({ type: "error", text: "通信エラーが発生しました" });
    } finally {
      setIsSavingInfo(false);
    }
  };

  // -------------------------------------------------------
  // セクション追加
  // -------------------------------------------------------
  const addSection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSectionTitle.trim()) return;
    setIsAddingSection(true);

    try {
      const res = await fetch(`/api/admin/courses/${initialCourse.id}/sections`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newSectionTitle }),
      });
      if (res.ok) {
        setNewSectionTitle("");
        refreshPage();
      }
    } finally {
      setIsAddingSection(false);
    }
  };

  // -------------------------------------------------------
  // セクション更新
  // -------------------------------------------------------
  const updateSection = async (sectionId: string) => {
    const res = await fetch(`/api/admin/courses/${initialCourse.id}/sections/${sectionId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: editingSectionTitle }),
    });
    if (res.ok) {
      setEditingSectionId(null);
      refreshPage();
    }
  };

  // -------------------------------------------------------
  // セクション削除
  // -------------------------------------------------------
  const deleteSection = async (sectionId: string) => {
    if (!confirm("このセクションを削除しますか？\n含まれるレッスンもすべて削除されます。")) return;
    const res = await fetch(`/api/admin/courses/${initialCourse.id}/sections/${sectionId}`, {
      method: "DELETE",
    });
    if (res.ok) refreshPage();
  };

  // -------------------------------------------------------
  // レッスン追加
  // -------------------------------------------------------
  const addLesson = async (e: React.FormEvent, sectionId: string) => {
    e.preventDefault();
    if (!newLessonTitle.trim()) return;
    setIsAddingLesson(true);

    try {
      const res = await fetch(
        `/api/admin/courses/${initialCourse.id}/sections/${sectionId}/lessons`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title: newLessonTitle }),
        }
      );
      if (res.ok) {
        setNewLessonTitle("");
        setAddingLessonSectionId(null);
        refreshPage();
      }
    } finally {
      setIsAddingLesson(false);
    }
  };

  // -------------------------------------------------------
  // レッスン削除
  // -------------------------------------------------------
  const deleteLesson = async (lessonId: string) => {
    if (!confirm("このレッスンを削除しますか？")) return;
    const res = await fetch(`/api/admin/courses/${initialCourse.id}/lessons/${lessonId}`, {
      method: "DELETE",
    });
    if (res.ok) refreshPage();
  };

  // -------------------------------------------------------
  // 講座削除
  // -------------------------------------------------------
  const deleteCourse = async () => {
    if (!confirm(`「${initialCourse.title}」を削除しますか？\nこの操作は取り消せません。`)) return;
    const res = await fetch(`/api/admin/courses/${initialCourse.id}`, { method: "DELETE" });
    if (res.ok) router.push("/admin/courses");
  };

  return (
    <div className="space-y-8">
      {/* ===== 基本情報 ===== */}
      <section>
        <h2 className="text-lg font-bold text-gray-900 mb-4">基本情報</h2>
        <form onSubmit={saveInfo} className="bg-white rounded-xl border border-gray-100 p-6 space-y-5">
          {infoMessage && (
            <div className={`text-sm px-4 py-3 rounded-lg ${
              infoMessage.type === "success"
                ? "bg-success-50 text-success-600"
                : "bg-error-50 text-error-600"
            }`}>
              {infoMessage.text}
            </div>
          )}

          <ThumbnailUpload
            courseId={initialCourse.id}
            currentUrl={initialCourse.thumbnailUrl}
          />

          <Input
            label="講座タイトル *"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <Input
            label="スラッグ *"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            helperText={`公開URL: /courses/${slug}`}
            required
          />

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700">説明文</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 hover:border-gray-300 resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="価格（円）"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              min="0"
              step="100"
            />
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">ステータス</label>
              <div className="flex gap-4 pt-2">
                {(["DRAFT", "PUBLISHED"] as const).map((s) => (
                  <label key={s} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      value={s}
                      checked={status === s}
                      onChange={() => setStatus(s)}
                      className="text-primary-600"
                    />
                    <span className="text-sm text-gray-700">
                      {s === "DRAFT" ? "下書き" : "公開"}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <Button type="submit" variant="primary" isLoading={isSavingInfo} size="sm">
              保存する
            </Button>
            <div className="flex items-center gap-3">
              <Link
                href={`/courses/${slug}`}
                target="_blank"
                className="text-sm text-primary-600 hover:text-primary-700 transition-colors"
              >
                公開ページを見る →
              </Link>
              <Button type="button" variant="danger" size="sm" onClick={deleteCourse}>
                講座を削除
              </Button>
            </div>
          </div>
        </form>
      </section>

      {/* ===== セクション・レッスン ===== */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">カリキュラム</h2>
          <span className="text-sm text-gray-500">
            {sections.length}セクション ·{" "}
            {sections.reduce((acc, s) => acc + s.lessons.length, 0)}レッスン
          </span>
        </div>

        {reorderError && (
          <div className="text-sm px-4 py-3 rounded-lg bg-error-50 text-error-600 mb-4">
            {reorderError}
          </div>
        )}

        <div className="space-y-4">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={sections.map((s) => s.id)}
              strategy={verticalListSortingStrategy}
            >
              {sections.map((section, sIdx) => (
                <SortableSectionItem
                  key={section.id}
                  section={section}
                  sIdx={sIdx}
                  courseId={initialCourse.id}
                  editingSectionId={editingSectionId}
                  editingSectionTitle={editingSectionTitle}
                  setEditingSectionId={setEditingSectionId}
                  setEditingSectionTitle={setEditingSectionTitle}
                  onUpdateSection={updateSection}
                  onDeleteSection={deleteSection}
                  addingLessonSectionId={addingLessonSectionId}
                  setAddingLessonSectionId={setAddingLessonSectionId}
                  newLessonTitle={newLessonTitle}
                  setNewLessonTitle={setNewLessonTitle}
                  isAddingLesson={isAddingLesson}
                  onAddLesson={addLesson}
                  onDeleteLesson={deleteLesson}
                />
              ))}
            </SortableContext>
          </DndContext>

          {/* セクション追加フォーム */}
          <form onSubmit={addSection} className="flex gap-2">
            <input
              value={newSectionTitle}
              onChange={(e) => setNewSectionTitle(e.target.value)}
              placeholder="新しいセクション名..."
              className="flex-1 px-4 py-2.5 text-sm rounded-xl border border-dashed border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
            <Button type="submit" variant="outline" size="sm" isLoading={isAddingSection}>
              セクションを追加
            </Button>
          </form>
        </div>
      </section>

      {/* ===== 現在の価格サマリー ===== */}
      <div className="text-xs text-gray-400 pt-2">
        講座価格: {initialCourse.price === 0 ? "無料" : formatPrice(initialCourse.price)} ·
        ステータス: {initialCourse.status === "PUBLISHED" ? "公開中" : "下書き"}
      </div>
    </div>
  );
}
