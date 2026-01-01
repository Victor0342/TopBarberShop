import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type DotPatternProps = HTMLAttributes<HTMLDivElement>;

export default function DotPattern({ className, style, ...props }: DotPatternProps) {
  const backgroundImage = "radial-gradient(var(--pattern-dot) 1px, transparent 1px)";

  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none fixed inset-0 -z-10 opacity-70", className)}
      style={{
        backgroundImage,
        backgroundSize: "22px 22px",
        backgroundPosition: "0 0",
        ...style,
      }}
      {...props}
    />
  );
}
