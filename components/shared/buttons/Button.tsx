import { AriaAttributes, ButtonHTMLAttributes } from "react";

import cx from "classnames";

interface ButtonProps
  extends AriaAttributes,
    ButtonHTMLAttributes<HTMLButtonElement> {
  text: string;
  size?: "sm" | "md" | "lg";
}

const sizes = {
  sm: "px-2 py-1 text-xs",
  md: "px-2.5 py-1.5",
  lg: "px-3 py-2",
} as const;

export default function Button({
  text,
  onClick,
  type = "button",
  size = "md",
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cx(
        "rounded-md bg-indigo-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600",
        sizes[size],
      )}
      onClick={onClick}
    >
      {text}
    </button>
  );
}
