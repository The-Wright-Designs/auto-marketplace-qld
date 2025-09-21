import * as React from "react";

import { cn } from "@/_lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "border-2 border-grey/50 rounded px-3 py-2 w-full min-h-16",
        "focus:outline-none focus:ring-2 focus:ring-blue",
        className
      )}
      {...props}
    />
  );
}

export { Textarea };
