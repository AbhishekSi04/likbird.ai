"use client";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { LeadSheet } from "@/components/leads/LeadSheet";
import { useSelectionStore } from "@/lib/store";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Clock, User, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

type LeadRow = {
  id: string;
  name: string;
  email: string;
  company: string;
  status: string;
  lastContactDate: string;
  campaign: { id: string; name: string } | null;
};

async function fetchLeads({ pageParam, q, status }: { pageParam?: string; q?: string; status?: string }) {
  const params = new URLSearchParams();
  if (pageParam) params.set("cursor", pageParam);
  if (q) params.set("q", q);
  if (status && status !== "all") params.set("status", status);
  const qs = params.toString() ? `?${params.toString()}` : "";
  const res = await fetch(`/api/leads${qs}`);
  if (!res.ok) throw new Error("Failed to load leads");
  return res.json() as Promise<{ items: LeadRow[]; nextCursor?: string | null }>;
}

export default function LeadsPage() {
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const { selectLead } = useSelectionStore();
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status: queryStatus,
  } = useInfiniteQuery({
    queryKey: ["leads", q, statusFilter],
    queryFn: ({ pageParam }) => fetchLeads({ pageParam, q, status: statusFilter }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (last) => last.nextCursor ?? undefined,
  });

  const sentinelRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const io = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    });
    io.observe(el);
    return () => io.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Leads</h1>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search name, email, company"
            className="h-10 w-full sm:w-64"
          />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-10 w-full sm:w-40">
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="contacted">Contacted</SelectItem>
              <SelectItem value="responded">Responded</SelectItem>
              <SelectItem value="converted">Converted</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {queryStatus === "pending" && !data && (
        <div className="flex h-64 items-center justify-center">
          <div className="text-muted-foreground">Loading leads...</div>
        </div>
      )}

      {queryStatus === "error" && (
        <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4 text-destructive">
          Error loading leads. Please try again.
        </div>
      )}

      <div className="overflow-hidden rounded-xl border border-border/50 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/30">
              <tr className="border-b border-border/50">
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Campaign
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Activity
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {data?.pages.flatMap((page) => page.items).map((lead) => (
                <tr
                  key={lead.id}
                  className="group cursor-pointer transition-colors hover:bg-accent/30"
                  onClick={() => selectLead(lead.id)}
                >
                  <td className="whitespace-nowrap px-4 py-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9 border border-border/50">
                        <AvatarImage src="" />
                        <AvatarFallback className="bg-gradient-to-br from-blue-600 to-blue-500 text-xs font-medium text-white">
                          {lead.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium text-foreground group-hover:text-primary">
                          {lead.name}
                        </div>
                        <div className="text-xs text-muted-foreground/80">
                          {lead.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-4 py-4">
                    <div className="text-sm text-foreground/90">
                      {lead.campaign?.name ? (
                        <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                          {lead.campaign.name}
                        </span>
                      ) : (
                        <span className="text-muted-foreground/70">-</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div 
                          key={i}
                          className={cn(
                            "h-1.5 w-4 rounded-full",
                            i <= 2 ? "bg-blue-500" : "bg-muted"
                          )}
                        />
                      ))}
                      <span className="ml-2 text-xs text-muted-foreground/70">
                        2/5 steps
                      </span>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-4 py-4">
                    {lead.status === "pending" && (
                      <Badge variant="pending" className="flex w-fit items-center gap-1.5 bg-amber-50 text-amber-700 hover:bg-amber-100 dark:bg-amber-900/30 dark:text-amber-400 dark:hover:bg-amber-900/50">
                        <Clock className="h-3 w-3" />
                        <span>Pending Approval</span>
                      </Badge>
                    )}
                    {lead.status === "contacted" && (
                      <Badge variant="warning" className="flex w-fit items-center gap-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50">
                        <User className="h-3 w-3" />
                        <span>Sent 7m ago</span>
                      </Badge>
                    )}
                    {lead.status === "responded" && (
                      <Badge variant="default" className="flex w-fit items-center gap-1.5 bg-green-50 text-green-700 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-900/50">
                        <MessageSquare className="h-3 w-3" />
                        <span>Followup 10m ago</span>
                      </Badge>
                    )}
                    {lead.status === "converted" && (
                      <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:hover:bg-purple-900/50">
                        Converted
                      </Badge>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {data?.pages[0]?.items.length === 0 && (
          <div className="flex h-64 flex-col items-center justify-center text-center">
            <div className="text-muted-foreground">No leads found</div>
            <p className="mt-2 text-sm text-muted-foreground/70">
              {q || statusFilter !== "all" ? 'Try adjusting your search or filter' : 'Get started by adding your first lead'}
            </p>
          </div>
        )}
      </div>

      <div ref={sentinelRef} className="h-1" />
      
      {isFetchingNextPage && (
        <div className="flex justify-center py-4">
          <div className="text-sm text-muted-foreground">Loading more leads...</div>
        </div>
      )}
      
      {!hasNextPage && queryStatus === "success" && data?.pages[0]?.items.length > 0 && (
        <div className="py-4 text-center text-sm text-muted-foreground/80">
          You've reached the end of the list
        </div>
      )}

      <LeadSheet />
    </div>
  );
}
