import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type DotPatternProps = HTMLAttributes<HTMLDivElement>;

export default function DotPattern({ className, style, ...props }: DotPatternProps) {
  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none fixed inset-0 -z-10 opacity-[0.22]", className)}
      style={{
        backgroundImage: 'url("/barber-tools-background.png")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        filter: "grayscale(1) brightness(1.45) contrast(1.08)",
        ...style,
      }}
      {...props}
    />
  );
}
