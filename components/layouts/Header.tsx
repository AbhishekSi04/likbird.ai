"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Moon, Sun, LogOut, ChevronDown, Home, ChevronRight } from "lucide-react";

async function fetchCurrentUser() {
  const res = await fetch("/api/me");
  if (!res.ok) throw new Error("Failed to fetch user");
  return res.json();
}

export function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [loggingOut, setLoggingOut] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  
  const { data: user, isLoading } = useQuery({
    queryKey: ["currentUser"],
    queryFn: fetchCurrentUser,
  });

  const crumbs = useMemo(() => {
    const parts = pathname.split("/").filter(Boolean);
    const acc = [];
    let current = "";
    
    // Always include Home as the first breadcrumb
    if (pathname !== "/") {
      acc.push({ label: "Home", href: "/", icon: Home });
    }
    
    for (const p of parts) {
      current += `/${p}`;
      acc.push({ 
        label: p.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
        href: current 
      });
    }
    return acc;
  }, [pathname]);

  const toggleTheme = () => {
    const root = document.documentElement;
    const isDark = root.classList.contains("dark");
    const newTheme = isDark ? "light" : "dark";
    
    root.classList.toggle("dark", !isDark);
    localStorage.setItem("theme", newTheme);
    setTheme(newTheme);
  };

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      await fetch("/api/auth/logout", { method: "POST" });
      router.replace("/login");
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <header className="flex h-14 items-center justify-between border-b bg-card px-6">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center text-sm">
        {crumbs.map((crumb, i) => (
          <div key={i} className="flex items-center">
            {i > 0 && <ChevronRight className="mx-2 h-4 w-4 text-muted-foreground" />}
            <Link 
              href={crumb.href} 
              className={cn(
                "flex items-center gap-1 text-sm transition-colors hover:text-foreground",
                i === crumbs.length - 1 ? "font-medium text-foreground" : "text-muted-foreground"
              )}
            >
              {crumb.icon && <crumb.icon className="h-4 w-4" />}
              <span className="whitespace-nowrap">{crumb.label}</span>
            </Link>
          </div>
        ))}
      </nav>

      {/* Right Side Actions */}
      <div className="flex items-center gap-3">
        {/* Theme Toggle */}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleTheme}
          className="h-8 w-8"
          aria-label="Toggle theme"
        >
          {theme === "dark" ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
        </Button>

        {/* User Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 gap-2 px-2">
              <Avatar className="h-7 w-7">
                <AvatarImage src={user?.image} />
                <AvatarFallback className="text-xs">
                  {isLoading ? "..." : user?.name ? user.name.split(' ').map((n: string) => n[0]).join('').toUpperCase() : "U"}
                </AvatarFallback>
              </Avatar>
              <span className="hidden sm:inline">
                {isLoading ? "Loading..." : user?.name || "User"}
              </span>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem>
              <Link href="/dashboard/profile" className="flex w-full items-center">
                <span>Profile</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href="/dashboard/settings" className="flex w-full items-center">
                <span>Settings</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={handleLogout}
              disabled={loggingOut}
              className="text-destructive focus:text-destructive"
            >
              <LogOut className="mr-2 h-4 w-4" />
              {loggingOut ? "Logging out..." : "Logout"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
