import { ReactNode } from "react";

interface SectionProps {
  children: ReactNode;
  className?: string;
  id?: string;
  /** "sm" = py-28, "default" = py-40, "lg" = py-52, "hero" = pt-52 pb-44 lg:pt-64 lg:pb-56 */
  size?: "sm" | "default" | "lg" | "hero";
  border?: boolean;
}

const sizeClasses = {
  sm:      "py-28",
  default: "py-40",
  lg:      "py-52",
  hero:    "pt-52 pb-44 lg:pt-64 lg:pb-56",
};

export default function Section({
  children,
  className = "",
  id,
  size = "default",
  border = false,
}: SectionProps) {
  return (
    <section
      id={id}
      className={`${sizeClasses[size]} ${border ? "border-t border-c-border" : ""} ${className}`}
    >
      <div className="max-w-8xl mx-auto px-8 lg:px-16">{children}</div>
    </section>
  );
}
