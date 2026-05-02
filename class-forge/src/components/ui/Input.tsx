// ===========================================
// 汎用インプットコンポーネント
// ===========================================

import { cn } from "@/lib/utils";
import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, id, ...props }, ref) => {
    const inputId = id || props.name;

    return (
      <div className="space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-gray-700"
          >
            {label}
          </label>
        )}
        <input
          id={inputId}
          className={cn(
            "w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900",
            "placeholder:text-gray-400",
            "transition-all duration-200",
            "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500",
            "hover:border-gray-300",
            "disabled:opacity-50 disabled:bg-gray-50",
            error && "border-error-500 focus:ring-error-500 focus:border-error-500",
            className
          )}
          ref={ref}
          {...props}
        />
        {error && (
          <p className="text-sm text-error-600 flex items-center gap-1">
            <svg
              className="w-4 h-4 shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            {error}
          </p>
        )}
        {helperText && !error && (
          <p className="text-sm text-gray-500">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
