import Image from "next/image";
import { cn } from "@/lib/utils";
import { resolveImageSrc } from "@/lib/site";

type SmartImageProps = {
  src?: string | null;
  alt: string;
  className?: string;
  fill?: boolean;
  priority?: boolean;
};

const isExternal = (value: string) => value.startsWith("http://") || value.startsWith("https://");

export default function SmartImage({ src, alt, className, fill, priority }: SmartImageProps) {
  const resolved = resolveImageSrc(src);
  if (isExternal(resolved)) {
    return (
      <img
        src={resolved}
        alt={alt}
        className={cn(
          fill ? "absolute inset-0 h-full w-full object-cover" : "h-auto w-full object-cover",
          className,
        )}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
      />
    );
  }

  return <Image src={resolved} alt={alt} fill={fill} className={className} priority={priority} />;
}
