"use client";

import { useActionState } from "react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { updateName, type ActionResult } from "../actions";

const initialState: ActionResult = { success: false };

export default function NameForm({ currentName }: { currentName: string }) {
  const [state, action, isPending] = useActionState(updateName, initialState);

  return (
    <form action={action} className="space-y-4">
      <Input
        key={currentName}
        label="表示名"
        name="name"
        defaultValue={currentName}
        placeholder="お名前を入力してください"
        required
        disabled={isPending}
        error={state.success === false && state.error ? state.error : undefined}
      />
      {state.success && state.message && (
        <p className="text-sm text-green-600 flex items-center gap-1.5">
          <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          {state.message}
        </p>
      )}
      <Button type="submit" variant="primary" size="md" isLoading={isPending}>
        保存する
      </Button>
    </form>
  );
}
