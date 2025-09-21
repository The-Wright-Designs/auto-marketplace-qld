import { cn } from "@/_lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "border-2 border-grey/50 rounded px-3 py-2 w-full",
        "focus:outline-none focus:ring-2 focus:ring-blue",
        className
      )}
      {...props}
    />
  );
}

export { Input };
