import { cn, initials as toInitials } from "@/lib/format";

type AvatarTone = "dark" | "sage" | "sand" | "warm" | "brand" | "light";

const tones: Record<AvatarTone, string> = {
  dark: "bg-graphite text-linen",
  sage: "bg-sage text-brand-ink",
  sand: "bg-sand text-graphite",
  warm: "bg-warn-bg text-warn-fg",
  brand: "bg-brand text-linen",
  light: "bg-linen text-graphite",
};

export function Avatar({
  name,
  initials,
  size = 34,
  tone = "sand",
  className,
}: {
  name: string;
  initials?: string;
  size?: number;
  tone?: AvatarTone;
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      style={{ width: size, height: size, fontSize: Math.max(10, Math.round(size * 0.36)) }}
      className={cn("flex flex-none items-center justify-center rounded-full font-semibold", tones[tone], className)}
    >
      {initials ?? toInitials(name)}
    </span>
  );
}
