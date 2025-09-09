"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Moon, Sun, LogOut, ChevronDown, Home, ChevronRight, User } from "lucide-react";
import { useSidebarStore } from "@/lib/store";

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
  const { collapsed, toggle } = useSidebarStore();
  
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
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      // Add your logout logic here
      // await signOut();
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <header className="flex h-16 w-full items-center justify-between border-b bg-background px-4">
      <div className="flex items-center gap-4">
        {/* Mobile menu button - only shown on small screens */}
        <button 
          onClick={toggle}
          className="rounded-md p-2 text-foreground hover:bg-accent md:hidden"
          aria-label="Toggle menu"
        >
          {collapsed ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          )}
        </button>

        {/* Breadcrumbs - Hide on mobile when sidebar is collapsed */}
        <div className={cn("hidden items-center space-x-2 overflow-x-auto whitespace-nowrap md:flex")}>
          {crumbs.map((crumb, i) => (
            <div key={i} className="flex items-center">
              {i > 0 && (
                <ChevronRight className="mx-2 h-4 w-4 text-muted-foreground" />
              )}
              {i === crumbs.length - 1 ? (
                <span className="text-sm font-medium">{crumb.label}</span>
              ) : (
                <Link
                  href={crumb.href}
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  {i === 0 && crumb.icon ? (
                    <crumb.icon className="h-4 w-4" />
                  ) : (
                    crumb.label
                  )}
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="rounded-full"
          aria-label="Toggle theme"
        >
          {theme === "light" ? (
            <Moon className="h-5 w-5" />
          ) : (
            <Sun className="h-5 w-5" />
          )}
        </Button>

        {/* User Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex h-9 w-9 items-center justify-center rounded-full p-0 md:h-auto md:w-auto md:px-2"
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.image} alt={user?.name} />
                <AvatarFallback>
                  {user?.name
                    ?.split(" ")
                    .map((n: string) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <span className="ml-2 hidden md:block">
                {isLoading ? "Loading..." : user?.name?.split(" ")[0] || "User"}
              </span>
              <ChevronDown className="ml-1 hidden h-4 w-4 md:block" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem onClick={() => router.push("/profile")}>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={toggleTheme}>
              {theme === "light" ? (
                <Moon className="mr-2 h-4 w-4" />
              ) : (
                <Sun className="mr-2 h-4 w-4" />
              )}
              <span>{theme === "light" ? "Dark" : "Light"} Mode</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleLogout} disabled={loggingOut}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>{loggingOut ? "Logging out..." : "Log out"}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
