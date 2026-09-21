"use client";

import React, { useState } from "react";
import Image from "next/image";

import { getInitials } from "@/lib/utils";
import { cn } from "@/lib/utils";

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  src?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  indicatorColor?: string;
}

export function Avatar({
  name,
  src,
  size = "md",
  indicatorColor,
  className,
  ...props
}: AvatarProps) {
  const [imageError, setImageError] = useState(false);

  const sizeClasses = {
    xs: "h-6 w-6 text-[10px]",
    sm: "h-8 w-8 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-12 w-12 text-base",
    xl: "h-16 w-16 text-lg",
  };

  const indicatorSizes = {
    xs: "h-1.5 w-1.5 bottom-0 right-0",
    sm: "h-2 w-2 bottom-0 right-0",
    md: "h-2.5 w-2.5 bottom-0 right-0",
    lg: "h-3 w-3 bottom-0.5 right-0.5",
    xl: "h-3.5 w-3.5 bottom-1 right-1",
  };

  const colors = [
    "bg-indigo-500",
    "bg-violet-500",
    "bg-sky-500",
    "bg-emerald-500",
    "bg-amber-500",
    "bg-rose-500",
    "bg-teal-500",
    "bg-fuchsia-500",
  ];

  const getColorFromName = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % colors.length;
    return colors[index];
  };

  const bgColor = getColorFromName(name || "User");
  const initials = getInitials(name || "U");

  return (
    <div
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center rounded-full font-bold select-none",
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {src && !imageError ? (
        <Image
          src={src}
          alt={name}
          fill
          sizes="(max-width: 768px) 48px, 64px"
          className="rounded-full object-cover"
          onError={() => setImageError(true)}
          unoptimized
        />
      ) : (
        <div
          className={cn(
            "flex h-full w-full items-center justify-center rounded-full text-white font-semibold shadow-xs",
            bgColor
          )}
        >
          {initials}
        </div>
      )}

      {indicatorColor && (
        <span
          className={cn(
            "absolute rounded-full ring-2 ring-white dark:ring-slate-900",
            indicatorSizes[size]
          )}
          style={{ backgroundColor: indicatorColor }}
        />
      )}
    </div>
  );
}
