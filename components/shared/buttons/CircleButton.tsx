import { AriaAttributes, ButtonHTMLAttributes } from "react";

import { PaperAirplaneIcon } from "@heroicons/react/20/solid";
import cx from "classnames";

interface ButtonProps
  extends AriaAttributes,
    ButtonHTMLAttributes<HTMLButtonElement> {
  size?: "sm" | "md" | "lg";
}

const sizes = {
  sm: "p-1",
  md: "p-1.5",
  lg: "p-2",
} as const;

export default function CircleButton({ size = "md", onClick }: ButtonProps) {
  return (
    <div>
      <button
        type="button"
        className={cx(
          "aspect-square rounded-full bg-indigo-600 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600",
          sizes[size],
        )}
        onClick={onClick}
      >
        <PaperAirplaneIcon className="h-5 w-5" aria-hidden="true" />
      </button>
    </div>
  );
}
