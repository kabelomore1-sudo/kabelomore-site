import { cn } from "@/lib/cn";
import { type HTMLAttributes } from "react";
import { Container } from "./container";

interface SectionProps extends HTMLAttributes<HTMLElement> {
  variant?: "default" | "tinted" | "ink";
  containerSize?: "default" | "narrow" | "wide";
  padding?: "default" | "sm" | "lg";
}

export function Section({
  className,
  variant = "default",
  containerSize = "default",
  padding = "default",
  children,
  ...props
}: SectionProps) {
  return (
    <section
      className={cn(
        "relative",
        variant === "default" && "bg-white text-ink-900",
        variant === "tinted" && "bg-section-gradient text-ink-900",
        variant === "ink" && "bg-ink-gradient text-white",
        // Tightened spacing per UI/UX polish sprint — was sm:py-12/16,
        // default:py-16/24, lg:py-24/32. Reduced ~30% to remove dead air
        // before content while preserving section breathing room.
        padding === "sm" && "py-8 md:py-12",
        padding === "default" && "py-10 md:py-16",
        padding === "lg" && "py-14 md:py-20",
        className,
      )}
      {...props}
    >
      <Container size={containerSize}>{children}</Container>
    </section>
  );
}

export function Eyebrow({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-accent-600",
        className,
      )}
    >
      <span className="h-1 w-1 rounded-full bg-accent-500" />
      {children}
    </div>
  );
}
