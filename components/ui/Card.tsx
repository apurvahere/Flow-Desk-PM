"use client";

import React from "react";

import { cn } from "@/lib/utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "subtle" | "interactive";
}

export function Card({
  className,
  variant = "default",
  children,
  ...props
}: CardProps) {
  const variants = {
    default:
      "border border-slate-200/80 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900/90",
    subtle:
      "border border-slate-100 bg-slate-50/50 dark:border-slate-800/80 dark:bg-slate-900/40",
    interactive:
      "border border-slate-200/80 bg-white shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900/90 dark:hover:border-indigo-800/80 cursor-pointer",
  };

  return (
    <div
      className={cn("rounded-2xl p-5", variants[variant], className)}
      {...props}
    >
      {children}
    </div>
  );
}
