import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  className?: string;
};

export default function SectionHeading({
  eyebrow,
  title,
  description,
  className,
}: SectionHeadingProps) {
  return (
    <div className={cn("space-y-2", className)}>
      {eyebrow ? (
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2>
      {description ? (
        <p className="max-w-2xl text-sm text-muted-foreground md:text-base">{description}</p>
      ) : null}
    </div>
  );
}
