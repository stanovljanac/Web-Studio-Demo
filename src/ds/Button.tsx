import type { ElementType, ReactNode } from "react";

type ButtonProps = {
  children?: ReactNode;
  variant?: "primary" | "secondary";
  size?: "sm" | "md" | "lg";
  block?: boolean;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
  as?: ElementType;
  className?: string;
  [key: string]: unknown;
};

export function Button({
  children,
  variant = "primary",
  size = "md",
  block = false,
  leadingIcon,
  trailingIcon,
  as,
  className = "",
  ...rest
}: ButtonProps) {
  const Tag = (as || "button") as ElementType;
  const cls = ["mb-btn", `mb-btn--${variant}`, `mb-btn--${size}`, block ? "mb-btn--block" : "", className]
    .filter(Boolean)
    .join(" ");
  return (
    <Tag className={cls} {...rest}>
      {leadingIcon ? <span className="mb-btn__icon">{leadingIcon}</span> : null}
      {children}
      {trailingIcon ? <span className="mb-btn__icon">{trailingIcon}</span> : null}
    </Tag>
  );
}
