import { cn } from "@/_lib/utils";

function FormLabel({ className, ...props }: React.ComponentProps<"label">) {
  return (
    <label
      data-slot="label"
      className={cn("block text-sm font-medium text-black mb-2", className)}
      {...props}
    />
  );
}

export { FormLabel };
