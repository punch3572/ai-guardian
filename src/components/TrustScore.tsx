import { motion } from "motion/react";
import { cn } from "@/src/lib/utils";

interface TrustScoreProps {
  score: number;
  label?: string;
  size?: "sm" | "md" | "lg";
}

export function TrustScore({ score, label = "Trust Score", size = "md" }: TrustScoreProps) {
  const getColor = (s: number) => {
    if (s >= 80) return "bg-green-500";
    if (s >= 50) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getTextColor = (s: number) => {
    if (s >= 80) return "text-green-500";
    if (s >= 50) return "text-yellow-500";
    return "text-red-500";
  };

  const sizes = {
    sm: "h-1.5 text-xs",
    md: "h-3 text-sm",
    lg: "h-6 text-lg",
  };

  return (
    <div className="w-full space-y-2">
      <div className="flex justify-between items-end">
        <span className="text-muted-foreground font-medium">{label}</span>
        <span className={cn("font-bold tabular-nums", getTextColor(score))}>
          {score}%
        </span>
      </div>
      <div className={cn("w-full bg-secondary rounded-full overflow-hidden", sizes[size].split(' ')[0])}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={cn("h-full rounded-full", getColor(score))}
        />
      </div>
    </div>
  );
}
