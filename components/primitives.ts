import { tv } from "tailwind-variants";

export const title = tv({
  base: "font-display tracking-tight inline leading-[1.05]",
  variants: {
    color: {
      ink: "text-foreground",
      clay: "text-primary",
      white: "text-white",
    },
    weight: {
      normal: "font-normal",
      medium: "font-medium",
      semibold: "font-semibold",
    },
    italic: {
      true: "italic",
    },
    size: {
      sm: "text-3xl lg:text-4xl",
      md: "text-[2.3rem] lg:text-5xl",
      lg: "text-4xl lg:text-6xl",
      xl: "text-5xl sm:text-6xl lg:text-7xl",
    },
    fullWidth: {
      true: "w-full block",
    },
  },
  defaultVariants: {
    color: "ink",
    weight: "medium",
    size: "md",
  },
});

export const subtitle = tv({
  base: "w-full md:w-1/2 my-2 text-lg lg:text-xl text-foreground/70 block max-w-full font-sans",
  variants: {
    fullWidth: {
      true: "!w-full",
    },
  },
  defaultVariants: {
    fullWidth: true,
  },
});
