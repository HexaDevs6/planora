import { useTheme } from "../hooks/useTheme";
import { Moon, Sun } from "lucide-react";
import { Button } from "./ui/button";

// A reusable ThemeToggle component that cycles through light, dark, and system.
// It relies on the useTheme hook, which applies/removes the `dark` class on <html>
// and stores preference in localStorage.

export default function ThemeToggle() {
    const { preference, effectiveTheme, cycleTheme } = useTheme();

    // Icons: minimalist characters to avoid extra deps
    const icon = effectiveTheme === "dark" ? <Moon /> : <Sun />;

    {
        /* Main button: cycles through light -> dark -> system */
    }
    return (
        <Button
            variant='glass'
            size='sm'
            type='button'
            onClick={cycleTheme}
            className='flex gap-2 items-center text-foreground w-fit'
            aria-label='Toggle theme'
            title={`Theme: ${preference} (click to cycle)`}
        >
            <span className=''>{icon}</span>
            {/* <span className='uppercase'>{preference}</span> */}
        </Button>
    );
}
