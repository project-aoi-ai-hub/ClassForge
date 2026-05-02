// ===========================================
// 汎用ボタンコンポーネント
// ===========================================

import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer";

    const variants = {
      primary:
        "bg-primary-600 text-white hover:bg-primary-700 active:bg-primary-800 shadow-sm hover:shadow-md",
      secondary:
        "bg-primary-50 text-primary-700 hover:bg-primary-100 active:bg-primary-200",
      outline:
        "border-2 border-gray-200 text-gray-700 hover:border-primary-300 hover:text-primary-600 bg-white",
      ghost:
        "text-gray-600 hover:text-gray-900 hover:bg-gray-100",
      danger:
        "bg-error-600 text-white hover:bg-error-500 active:bg-error-600",
    };

    const sizes = {
      sm: "text-sm px-3 py-1.5 gap-1.5",
      md: "text-sm px-5 py-2.5 gap-2",
      lg: "text-base px-7 py-3.5 gap-2.5",
    };

    return (
      <button
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        disabled={disabled || isLoading}
        ref={ref}
        {...props}
      >
        {isLoading && (
          <svg
            className="animate-spin h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
