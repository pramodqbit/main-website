"use client";

import { useState, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export type FileInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & { buttonLabel?: string };

/** Native file input styled as a control; shows the chosen file name in mono. */
export function FileInput({ className, onChange, buttonLabel = "Choose file", ...rest }: FileInputProps) {
  const [name, setName] = useState<string>("");
  return (
    <div
      className={cn(
        "relative flex items-center gap-3 border border-line bg-surface px-3.5 py-3 focus-within:border-ink has-[[aria-invalid=true]]:border-danger",
        className,
      )}
    >
      <span aria-hidden="true" className="border border-ink px-2.5 py-1 text-sm">
        {buttonLabel}
      </span>
      <span aria-hidden="true" className="truncate font-mono text-sm text-muted">
        {name || "No file selected"}
      </span>
      <input
        type="file"
        className="absolute inset-0 cursor-pointer opacity-0"
        onChange={(e) => {
          setName(e.currentTarget.files?.[0]?.name ?? "");
          onChange?.(e);
        }}
        {...rest}
      />
    </div>
  );
}

export default FileInput;
