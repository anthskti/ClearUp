import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";

const buttonVariants = cva(
  // className
  `
    inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md 
    font-medium transition-all 
    disabled:pointer-events-none disabled:opacity-50 
    [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 
    outline-none focus-visible:border-ring focus-visible:ring-ring/50 
    focus-visible:ring-[3px] aria-invalid:ring-destructive/20 
    dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive
    `,
  {
    variants: {
      variant: {
        default:
          "bg-white text-black font-semibold border border-white hover:bg-[#F8F8F8]/80 shadow-xs",
        secondary:
          "bg-[#0E4B84] text-white font-semibold hover:bg-[#0a345c] shadow-xs",
        outline:
          "text-black px-2 py-2 transition-all duration-300 rounded-md border border-gray-400 hover:bg-gray-200",
        destructive:
          "bg-red-700/20 border-1 border-red-700/80 text-black shadow-xs hover:bg-red-700/50 hover:border-red-700 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60 duration-300",
      },
      size: {
        default: "h-9 px-4 py-2 text-sm has-[>svg]:px-3",
        sm: "h-8 rounded-md text-xs gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md text-md px-6 has-[>svg]:px-4",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp className={buttonVariants({ variant, size, className })} {...props} />
  );
}

export { Button, buttonVariants };
