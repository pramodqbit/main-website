import { cva } from "class-variance-authority";

/** Button classes. Kept free of `tailwind-merge` so client components can use them without shipping it. */
export const buttonStyles = cva(
  "inline-flex items-center gap-2.5 rounded-none border font-sans font-medium no-underline transition-colors duration-150 hover:border-brand hover:bg-brand hover:text-on-brand disabled:cursor-not-allowed disabled:opacity-60",
  {
    variants: {
      variant: {
        primary: "border-ink bg-ink text-paper",
        ghost: "border-ink bg-transparent text-ink",
      },
      size: {
        md: "px-[18px] py-3 text-[15px]",
        sm: "px-3.5 py-[9px] text-sm",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);
