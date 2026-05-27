import * as React from "react";
import { cn } from "../../lib/utils";

interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <label className="block">
        {label ? (
          <span className="mb-2 block text-sm font-semibold text-[#303030]">
            {label}
          </span>
        ) : null}

        <textarea
          ref={ref}
          className={cn(
            "min-h-[120px] w-full resize-none rounded-[16px] border border-[#dadada] bg-white px-4 py-3 text-[15px] text-[#303030] outline-none transition placeholder:text-[#a9a9a9] focus:border-[#ff5623] focus:ring-4 focus:ring-[#ff5623]/10",
            error && "border-[#770d0d] focus:border-[#770d0d]",
            className
          )}
          {...props}
        />

        {error ? (
          <span className="mt-1 block text-sm font-medium text-[#770d0d]">
            {error}
          </span>
        ) : null}
      </label>
    );
  }
);

Textarea.displayName = "Textarea";