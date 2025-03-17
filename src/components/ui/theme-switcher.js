"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeSwitcher() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Pastikan komponen sudah di-mount sebelum membaca theme
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; // Hindari error saat SSR (Server-Side Rendering)

  return (
    <button
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className="p-2 bg-gray-200 dark:bg-gray-700 rounded-full"
    >
      {resolvedTheme === "dark" ? "🌙" : "☀️ "}
    </button>
  );
}

