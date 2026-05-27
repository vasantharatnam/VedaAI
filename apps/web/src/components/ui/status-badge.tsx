import { AssignmentStatus } from "../../types/assignment";
import { cn } from "../../lib/utils";

interface StatusBadgeProps {
  status: AssignmentStatus;
}

const statusConfig: Record<
  AssignmentStatus,
  {
    label: string;
    className: string;
  }
> = {
  pending: {
    label: "Pending",
    className: "bg-[#fff3db] text-[#9b6400]",
  },
  processing: {
    label: "Generating",
    className: "bg-[#e8f1ff] text-[#1f5fa8]",
  },
  completed: {
    label: "Completed",
    className: "bg-[#e9f8ef] text-[#22733d]",
  },
  failed: {
    label: "Failed",
    className: "bg-[#ffecec] text-[#a32525]",
  },
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <span
      className={cn(
        "inline-flex h-7 items-center rounded-full px-3 text-xs font-bold",
        config.className
      )}
    >
      {config.label}
    </span>
  );
}