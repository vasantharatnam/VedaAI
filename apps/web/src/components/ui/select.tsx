import * as React from "react";
import { cn } from "../../lib/utils";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, children, ...props }, ref) => {
    return (
      <label className="block">
        {label ? (
          <span className="mb-2 block text-sm font-semibold text-[#303030]">
            {label}
          </span>
        ) : null}

        <select
          ref={ref}
          className={cn(
            "h-12 w-full rounded-[16px] border border-[#dadada] bg-white px-4 text-[15px] text-[#303030] outline-none transition focus:border-[#ff5623] focus:ring-4 focus:ring-[#ff5623]/10",
            error && "border-[#770d0d] focus:border-[#770d0d]",
            className
          )}
          {...props}
        >
          {children}
        </select>

        {error ? (
          <span className="mt-1 block text-sm font-medium text-[#770d0d]">
            {error}
          </span>
        ) : null}
      </label>
    );
  }
);

Select.displayName = "Select";