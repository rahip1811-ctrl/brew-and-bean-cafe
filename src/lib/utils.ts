import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * The shadcn `cn` helper: joins conditional class names, then lets later
 * Tailwind utilities win over earlier conflicting ones — so a `className` prop
 * can override a component's own defaults instead of fighting them in the
 * cascade.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
