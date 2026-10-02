import { AlertCircle, CheckCircle2, Info } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function FormStatus({ tone, children }: { tone: "info" | "error" | "success"; children: ReactNode }) {
  const Icon = tone === "error" ? AlertCircle : tone === "success" ? CheckCircle2 : Info;
  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      className={cn(
        "flex gap-3 rounded-sm border px-4 py-3 text-[0.95rem]",
        tone === "error" && "border-destructive/40 bg-destructive/5 text-destructive",
        tone === "success" && "border-success/40 bg-success/5 text-success",
        tone === "info" && "border-border bg-stone/60 text-foreground",
      )}
    >
      <Icon className="mt-0.5 size-5 shrink-0" aria-hidden />
      <div>{children}</div>
    </div>
  );
}

export function FieldError({ id, message }: { id: string; message?: string | undefined }) {
  if (!message) return null;
  return <p id={id} className="mt-1.5 text-sm text-destructive">{message}</p>;
}
