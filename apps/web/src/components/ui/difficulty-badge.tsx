import { Difficulty } from "../../types/assignment";
import { cn } from "../../lib/utils";

interface DifficultyBadgeProps {
  difficulty: Difficulty;
}

const difficultyConfig: Record<
  Difficulty,
  {
    label: string;
    className: string;
  }
> = {
  easy: {
    label: "Easy",
    className: "bg-[#e9f8ef] text-[#22733d]",
  },
  medium: {
    label: "Moderate",
    className: "bg-[#fff3db] text-[#9b6400]",
  },
  hard: {
    label: "Hard",
    className: "bg-[#ffecec] text-[#a32525]",
  },
};

export function DifficultyBadge({ difficulty }: DifficultyBadgeProps) {
  const config = difficultyConfig[difficulty];

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