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
    <aside
      className={cn(
        "flex h-full flex-col border-r bg-card/95 backdrop-blur-sm text-card-foreground transition-all",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="flex items-center justify-between p-4 border-b border-border/50">
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-blue-600 to-blue-500 flex items-center justify-center shadow-md">
            <span className="text-white font-bold text-sm">LB</span>
          </div>
          {!collapsed && <span className="font-bold text-xl bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">LinkBird</span>}
        </div>
      </div>

      {/* User Profile */}
      <div className="px-3 py-4 border-b border-border/50">
        <DropdownMenu>
          <DropdownMenuTrigger className="flex w-full items-center gap-3 rounded-lg p-2 hover:bg-accent/50 transition-colors">
            <Avatar className="h-9 w-9 border-2 border-background shadow">
              <AvatarImage src={user?.image || ""} />
              <AvatarFallback className="bg-gradient-to-br from-blue-600 to-blue-500 text-white font-medium text-sm">
                {isLoading ? "..." : user?.name ? user.name.split(' ').map((n: string) => n[0]).join('').toUpperCase() : "U"}
              </AvatarFallback>
            </Avatar>
            {!collapsed && (
              <>
                <div className="flex-1 text-left overflow-hidden">
                  <div className="text-sm font-semibold truncate">
                    {isLoading ? "Loading..." : user?.name || "User"}
                  </div>
                  <div className="text-xs text-muted-foreground truncate">View Profile</div>
                </div>
                <ChevronDown className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              </>
            )}
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            <DropdownMenuItem>View Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-2 overflow-y-auto">
        {/* Overview Section */}
        <div className="space-y-1">
          {!collapsed && (
            <div className="px-3 py-2.5 text-[11px] font-semibold text-muted-foreground/70 uppercase tracking-wider">
              Overview
            </div>
          )}
          {overviewNav.map((item) => {
            const active = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                  active 
                    ? "bg-primary/10 text-primary [&_svg]:text-primary" 
                    : "text-muted-foreground hover:bg-accent/50 hover:text-foreground [&:not(:hover)_svg]:text-muted-foreground"
                )}
              >
                <Icon className="h-5 w-5 flex-shrink-0 transition-colors" />
                {!collapsed && (
                  <>
                    <span className="flex-1">{item.label}</span>
                    {item.badge && (
                      <Badge className="bg-blue-600/90 text-white text-xs font-medium px-1.5 py-0.5">
                        {item.badge}
                      </Badge>
                    )}
                  </>
                )}
              </Link>
            );
          })}
        </div>

        {/* Settings Section */}
        <div className="space-y-1 pt-2">
          {!collapsed && (
            <div className="px-3 py-2.5 text-[11px] font-semibold text-muted-foreground/70 uppercase tracking-wider">
              Settings
            </div>
          )}
          {settingsNav.map((item) => {
            const active = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                  active 
                    ? "bg-primary/10 text-primary [&_svg]:text-primary" 
                    : "text-muted-foreground hover:bg-accent/50 hover:text-foreground [&:not(:hover)_svg]:text-muted-foreground"
                )}
              >
                <Icon className="h-5 w-5 flex-shrink-0 transition-colors" />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </div>

        {/* Admin Panel Section */}
        <div className="space-y-1 pt-2">
          {!collapsed && (
            <div className="px-3 py-2.5 text-[11px] font-semibold text-muted-foreground/70 uppercase tracking-wider">
              Admin Panel
            </div>
          )}
          {adminNav.map((item) => {
            const active = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                  active 
                    ? "bg-primary/10 text-primary [&_svg]:text-primary" 
                    : "text-muted-foreground hover:bg-accent/50 hover:text-foreground [&:not(:hover)_svg]:text-muted-foreground"
                )}
              >
                <Icon className="h-5 w-5 flex-shrink-0 transition-colors" />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Bottom User Info */}
      <div className="border-t border-border p-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9 border-2 border-background shadow">
            <AvatarImage src={user?.image || ""} />
            <AvatarFallback className="bg-gradient-to-br from-blue-600 to-blue-500 text-white font-medium text-sm">
              {isLoading ? "..." : user?.name ? user.name.split(' ').map((n: string) => n[0]).join('').toUpperCase() : "U"}
            </AvatarFallback>
          </Avatar>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate">
                {isLoading ? "Loading..." : user?.name || "User"}
              </div>
              <div className="text-xs text-muted-foreground truncate">
                {isLoading ? "..." : user?.email || "user@example.com"}
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
