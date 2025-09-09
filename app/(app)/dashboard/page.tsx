"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageSquare, Clock, ShieldAlert } from "lucide-react";

type CampaignLite = { id: string; name: string; status: string };
type RecentLead = { id: string; name: string; campaign: string; status: string };

async function fetchDashboard() {
  // minimal dashboard: campaigns list + recent leads
  const [campaignsRes, leadsRes] = await Promise.all([
    fetch("/api/campaigns"),
    fetch("/api/leads?limit=6"),
  ]);
  const campaigns = (await campaignsRes.json()) as any[];
  const leadsJson = (await leadsRes.json()) as { items: any[] };
  const leads = leadsJson.items;
  const campaignsLite: CampaignLite[] = campaigns.map((c) => ({ id: c.id, name: c.name, status: c.status }));
  const recent: RecentLead[] = leads.map((l) => ({
    id: l.id,
    name: l.name,
    campaign: l.campaign?.name ?? "-",
    status: l.status,
  }));
  return { campaigns: campaignsLite, recent };
}

export default function DashboardPage() {
  const { data } = useQuery({ queryKey: ["dashboard"], queryFn: fetchDashboard });

  return (
    <div className="grid grid-cols-1 gap-6 p-6 lg:grid-cols-2">
      {/* Campaigns card */}
      <div className="overflow-hidden rounded-xl border border-border/50 bg-card shadow-sm transition-all hover:shadow-md">
        <div className="flex items-center justify-between border-b border-border/30 bg-gradient-to-r from-card to-card/90 p-4">
          <h3 className="text-base font-semibold text-foreground">Campaigns</h3>
          <div className="flex items-center gap-2">
            <Input 
              className="h-8 w-40 border-border/50 text-sm focus-visible:ring-1 focus-visible:ring-primary/30" 
              placeholder="All Campaigns" 
              readOnly 
            />
          </div>
        </div>
        <div className="divide-y divide-border/50">
          {data?.campaigns.slice(0, 6).map((c) => (
            <Link 
              key={c.id} 
              href={`/dashboard/campaigns/${c.id}`} 
              className="group flex items-center justify-between px-4 py-3 transition-colors hover:bg-accent/30"
            >
              <span className="text-sm font-medium text-foreground/90 group-hover:text-primary">{c.name}</span>
              <Badge variant="success" className="bg-green-500/10 text-green-600 hover:bg-green-500/20 dark:bg-green-500/10 dark:text-green-400 dark:hover:bg-green-500/20">
                Active
              </Badge>
            </Link>
          ))}
          {!data?.campaigns?.length && (
            <div className="px-4 py-6 text-center text-sm text-muted-foreground/80">No campaigns yet</div>
          )}
        </div>
      </div>

      {/* Recent Activity card */}
      <div className="overflow-hidden rounded-xl border border-border/50 bg-card shadow-sm transition-all hover:shadow-md">
        <div className="flex items-center justify-between border-b border-border/30 bg-gradient-to-r from-card to-card/90 p-4">
          <h3 className="text-base font-semibold text-foreground">Recent Activity</h3>
          <Input 
            className="h-8 w-40 border-border/50 text-sm focus-visible:ring-1 focus-visible:ring-primary/30" 
            placeholder="Most Recent" 
            readOnly 
          />
        </div>
        <div className="hidden grid-cols-4 gap-2 border-b border-border/30 bg-muted/30 px-4 py-2 text-xs font-medium text-muted-foreground sm:grid">
          <div>Lead</div>
          <div>Campaign</div>
          <div className="col-span-2">Status</div>
        </div>
        <div className="divide-y divide-border/50">
          {data?.recent.map((l) => (
            <div key={l.id} className="group grid grid-cols-1 items-center gap-2 px-4 py-3 transition-colors hover:bg-accent/30 sm:grid-cols-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-9 w-9 border border-border/50 shadow-sm">
                  <AvatarImage src="" />
                  <AvatarFallback className="bg-gradient-to-br from-blue-600 to-blue-500 text-xs font-medium text-white">
                    {l.name.split(' ').map(n=>n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="text-sm font-medium text-foreground group-hover:text-primary">{l.name}</div>
                  <div className="text-xs text-muted-foreground/80">Regional Head</div>
                </div>
              </div>
              <div className="text-sm text-foreground/90 sm:block">{l.campaign}</div>
              <div className="col-span-2">
                {l.status === "pending" && (
                  <Badge variant="pending" className="flex w-fit items-center gap-1 bg-amber-50 text-amber-700 hover:bg-amber-100 dark:bg-amber-900/30 dark:text-amber-400 dark:hover:bg-amber-900/50">
                    <Clock className="h-3 w-3" /> Pending Approval
                  </Badge>
                )}
                {l.status === "contacted" && (
                  <Badge variant="warning" className="flex w-fit items-center gap-1 bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50">
                    <ShieldAlert className="h-3 w-3" /> Sent 7 mins ago
                  </Badge>
                )}
                {l.status === "responded" && (
                  <Badge variant="default" className="flex w-fit items-center gap-1 bg-green-50 text-green-700 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-900/50">
                    <MessageSquare className="h-3 w-3" /> Followup 10 mins ago
                  </Badge>
                )}
              </div>
            </div>
          ))}
          {!data?.recent?.length && (
            <div className="px-4 py-6 text-center text-sm text-muted-foreground/80">No recent activity</div>
          )}
        </div>
      </div>

      {/* LinkedIn Accounts mock card */}
      <div className="overflow-hidden rounded-xl border border-border/50 bg-card shadow-sm transition-all hover:shadow-md lg:col-span-2">
        <div className="border-b border-border/30 bg-gradient-to-r from-card to-card/90 p-4">
          <h3 className="text-base font-semibold text-foreground">LinkedIn Accounts</h3>
        </div>
        <div className="p-6 text-center">
          <div className="mx-auto max-w-md">
            <div className="mb-4 text-foreground/90">
              Connect your LinkedIn accounts to track connection requests and manage your outreach campaigns more effectively.
            </div>
            <Button className="bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-md hover:from-blue-700 hover:to-blue-600">
              Connect LinkedIn Account
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
