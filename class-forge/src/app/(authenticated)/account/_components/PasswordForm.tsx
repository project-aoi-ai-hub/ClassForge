"use client";

import { useActionState, useRef, useEffect } from "react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { updatePassword, type ActionResult } from "../actions";

const initialState: ActionResult = { success: false };

export default function PasswordForm() {
  const [state, action, isPending] = useActionState(updatePassword, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success) {
      formRef.current?.reset();
    }
  }, [state]);

  return (
    <form ref={formRef} action={action} className="space-y-4">
      <Input
        label="現在のパスワード"
        name="currentPassword"
        type="password"
        placeholder="現在のパスワードを入力"
        required
      />
      <Input
        label="新しいパスワード"
        name="newPassword"
        type="password"
        placeholder="英大文字・数字・記号を含む8文字以上"
        helperText="英大文字、数字、記号をそれぞれ1文字以上含む8文字以上で設定してください"
        required
      />
      <Input
        label="新しいパスワード（確認）"
        name="confirmPassword"
        type="password"
        placeholder="新しいパスワードを再入力"
        required
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
        パスワードを変更する
      </Button>
    </form>
  );
}
