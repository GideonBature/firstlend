import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export const ThemeToggle = () => {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="rounded-full" disabled>
        <Loader2 className="h-4 w-4 animate-spin" />
        <span className="sr-only">Loading theme toggle</span>
      </Button>
    );
  }

  const currentTheme = theme === "system" ? resolvedTheme : theme;
  const isDark = currentTheme === "dark";

  const handleToggle = () => {
    setTheme(isDark ? "light" : "dark");
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className="relative rounded-full"
      onClick={handleToggle}
      aria-label="Toggle theme"
    >
      <Sun className={`h-5 w-5 transition-all ${isDark ? "scale-0 opacity-0" : "scale-100 opacity-100"}`} />
      <Moon className={`absolute h-5 w-5 transition-all ${isDark ? "scale-100 opacity-100" : "scale-0 opacity-0"}`} />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
};
