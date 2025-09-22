import * as React from "react"
import { cn } from "@/lib/utils/utils"

const Separator = React.forwardRef<
  React.ElementRef<"div">,
  React.ComponentPropsWithoutRef<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("border-t border-border", className)}
    {...props}
  />
))
Separator.displayName = "Separator"

export { Separator }