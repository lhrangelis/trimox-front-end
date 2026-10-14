import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/format";
import { Icon, type IconName } from "./Icon";

type Variant = "primary" | "secondary" | "dark" | "light" | "ghost" | "danger";
type Size = "sm" | "md" | "lg" | "xl";

const variants: Record<Variant, string> = {
  primary: "bg-brand text-white hover:bg-brand-ink hover:text-white",
  secondary: "bg-surface text-graphite border border-line hover:border-line-strong hover:text-graphite",
  dark: "bg-graphite text-linen hover:bg-graphite-2 hover:text-linen",
  light: "bg-linen text-graphite hover:bg-white hover:text-graphite",
  ghost: "bg-transparent text-brand hover:text-graphite",
  danger: "bg-surface text-danger-fg border border-danger hover:bg-danger-bg hover:text-danger-fg",
};

const sizes: Record<Size, string> = {
  sm: "min-h-9 px-3 text-[13px] rounded-lg",
  md: "min-h-11 px-4 rounded-[10px]",
  lg: "min-h-12 px-5 rounded-xl",
  xl: "min-h-[52px] px-6 rounded-xl text-base",
};

type Common = {
  variant?: Variant;
  size?: Size;
  icon?: IconName;
  iconRight?: IconName;
  className?: string;
  children?: ReactNode;
};

function classes({ variant = "primary", size = "md", className }: Common) {
  return cn(
    "inline-flex items-center justify-center gap-2 font-semibold no-underline transition-colors cursor-pointer",
    "disabled:cursor-not-allowed disabled:bg-disabled disabled:text-body disabled:border-transparent",
    variants[variant],
    sizes[size],
    className,
  );
}

function Content({ icon, iconRight, children, size }: Common) {
  const iconSize = size === "sm" ? 16 : 18;
  return (
    <>
      {icon && <Icon name={icon} size={iconSize} strokeWidth={2.2} />}
      {children}
      {iconRight && <Icon name={iconRight} size={iconSize} strokeWidth={2.2} />}
    </>
  );
}

export function Button({
  variant,
  size,
  icon,
  iconRight,
  className,
  children,
  type = "button",
  ...rest
}: Common & ComponentProps<"button">) {
  return (
    <button type={type} className={classes({ variant, size, className })} {...rest}>
      <Content icon={icon} iconRight={iconRight} size={size}>
        {children}
      </Content>
    </button>
  );
}

export function ButtonLink({
  variant,
  size,
  icon,
  iconRight,
  className,
  children,
  ...rest
}: Common & ComponentProps<typeof Link>) {
  return (
    <Link className={classes({ variant, size, className })} {...rest}>
      <Content icon={icon} iconRight={iconRight} size={size}>
        {children}
      </Content>
    </Link>
  );
}

/** Botão quadrado só com ícone (ex.: dia anterior / próximo). */
export function IconButton({
  icon,
  label,
  className,
  ...rest
}: { icon: IconName; label: string } & Omit<ComponentProps<"button">, "children">) {
  return (
    <button
      type="button"
      aria-label={label}
      className={cn(
        "inline-flex size-11 items-center justify-center rounded-[10px] border border-line bg-surface text-graphite hover:border-line-strong cursor-pointer disabled:cursor-not-allowed disabled:opacity-40",
        className,
      )}
      {...rest}
    >
      <Icon name={icon} size={18} strokeWidth={2} />
    </button>
  );
}
