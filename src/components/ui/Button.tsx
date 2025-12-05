import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
};

export function Button({ children, className = "", ...props }: ButtonProps) {
  const baseClasses =
    "flex items-center justify-center gap-1 rounded-md border border-stone-600/60 bg-stone-300 px-3 py-2 text-sm text-stone-700 shadow-[inset_0_2px_0_rgba(255,255,255,0.4),inset_0_-1px_0_rgba(0,0,0,0.3)] hover:cursor-pointer hover:bg-stone-400/70 active:scale-[0.98] active:bg-stone-500/70 active:shadow-none";

  return (
    <button className={`${baseClasses} ${className}`.trim()} {...props}>
      {children}
    </button>
  );
}
