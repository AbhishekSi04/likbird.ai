"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useSidebarStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { 
  LayoutDashboard, 
  Users, 
  Megaphone, 
  MessageSquare, 
  Linkedin, 
  Settings, 
  List, 
  User,
  ChevronDown,
  LogOut
} from "lucide-react";

async function fetchCurrentUser() {
  const res = await fetch("/api/me");
  if (!res.ok) throw new Error("Failed to fetch user");
  return res.json();
}

const overviewNav = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/leads", label: "Leads", icon: Users },
  { href: "/dashboard/campaigns", label: "Campaign", icon: Megaphone },
  { href: "/dashboard/messages", label: "Messages", icon: MessageSquare, badge: "1" },
  { href: "/dashboard/linkedin", label: "LinkedIn Accounts", icon: Linkedin },
];

const settingsNav = [
  { href: "/dashboard/settings", label: "Setting & Billing", icon: Settings },
];

const adminNav = [
  { href: "/dashboard/activity", label: "Activity logs", icon: List },
  { href: "/dashboard/users", label: "User logs", icon: User },
];

export function Sidebar() {
  const pathname = usePathname();
  const { collapsed, toggle } = useSidebarStore();
  
  const { data: user, isLoading } = useQuery({
    queryKey: ["currentUser"],
    queryFn: fetchCurrentUser,
  });

  return (
    <div className={cn(
      "flex h-full w-64 flex-col border-r bg-background transition-all duration-300 ease-in-out",
      "fixed left-0 top-0 z-40 h-full w-64 md:relative",
      collapsed && "-translate-x-full md:translate-x-0 md:w-20"
    )}>
      {/* Mobile menu button */}
      <button 
        onClick={toggle}
        className="absolute -right-3 top-4 z-50 flex h-6 w-6 items-center justify-center rounded-full border bg-background shadow-md md:hidden"
        aria-label={collapsed ? "Open menu" : "Close menu"}
      >
        {collapsed ? '→' : '←'}
      </button>

      <div className="flex h-16 items-center border-b px-4">
        <Link href="/dashboard" className="flex items-center gap-2">
          <span className={cn(
            "text-lg font-semibold transition-opacity",
            collapsed && "opacity-0 md:opacity-100"
          )}>
            LinkBird
          </span>
        </Link>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-4">
        <div className="space-y-2">
          {overviewNav.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  "hover:bg-accent hover:text-accent-foreground",
                  isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground",
                  collapsed && "justify-center px-0"
                )}
              >
                <Icon className="h-5 w-5" />
                <span className={cn("ml-3 transition-opacity", collapsed && "opacity-0 md:opacity-100")}>
                  {item.label}
                </span>
                {item.badge && (
                  <Badge 
                    variant="secondary" 
                    className={cn("ml-auto", collapsed && "hidden")}
                  >
                    {item.badge}
                  </Badge>
                )}
              </Link>
            );
          })}
        </div>

        <div className="pt-4">
          <div className={cn("mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground", 
            collapsed && "hidden")}>
            Settings
          </div>
          <div className="space-y-1">
            {settingsNav.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    "hover:bg-accent hover:text-accent-foreground",
                    isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground",
                    collapsed && "justify-center px-0"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span className={cn("ml-3 transition-opacity", collapsed && "opacity-0 md:opacity-100")}>
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      <div className="border-t p-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className={cn(
                "flex w-full items-center rounded-md p-2 text-left hover:bg-accent hover:text-accent-foreground",
                collapsed ? "justify-center" : "px-3"
              )}
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
              {!collapsed && (
                <div className="ml-3 flex-1 overflow-hidden">
                  <p className="truncate text-sm font-medium">{user?.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{user?.email}</p>
                </div>
              )}
              {!collapsed && <ChevronDown className="ml-2 h-4 w-4 text-muted-foreground" />}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align={collapsed ? "center" : "start"} side={collapsed ? "right" : "top"}>
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
