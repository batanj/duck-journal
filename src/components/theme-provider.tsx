import { useEffect } from "react";
import { Toaster } from "sonner";
import { isDark, useThemeStore } from "@/lib/theme";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const mode = useThemeStore((s) => s.mode);
  const hydrate = useThemeStore((s) => s.hydrate);

  useEffect(() => {
    hydrate();
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      const current = useThemeStore.getState().mode;
      if (current === "system") hydrate();
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [hydrate]);

  return (
    <>
      {children}
      <Toaster theme={isDark(mode) ? "dark" : "light"} position="bottom-right" richColors={false} />
    </>
  );
}
