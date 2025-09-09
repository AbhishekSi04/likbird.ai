"use client";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { 
  Plus, 
  Search, 
  Users, 
  UserPlus, 
  UserCheck, 
  UserX, 
  MessageSquare,
  User
} from "lucide-react";
import { cn } from "@/lib/utils";

type CampaignRow = {
  id: string;
  name: string;
  status: "draft" | "active" | "paused" | "completed";
  createdAt: string;
  _count: { leads: number };
  successCount: number;
};

async function fetchCampaigns({ status, sort }: { status?: string; sort?: string }) {
  const params = new URLSearchParams();
  if (status) params.set("status", status);
  if (sort) params.set("sort", sort);
  const qs = params.toString() ? `?${params.toString()}` : "";
  const res = await fetch(`/api/campaigns${qs}`);
  if (!res.ok) throw new Error("Failed to load campaigns");
  return res.json() as Promise<CampaignRow[]>;
}

export default function CampaignsPage() {
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { data, status, refetch } = useQuery({
    queryKey: ["campaigns", statusFilter],
    queryFn: () => fetchCampaigns({ status: statusFilter === "all" ? "" : statusFilter }),
  });

  const filteredData = data?.filter(campaign => 
    campaign.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    if (status === "active") {
      return <Badge variant="success" className="bg-green-100 text-green-800">Active</Badge>;
    }
    return <Badge variant="outline">{status}</Badge>;
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Campaigns</h1>
          <p className="text-muted-foreground">Manage your campaigns and track their performance.</p>
        </div>
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-md hover:from-blue-700 hover:to-blue-600">
              <Plus className="h-4 w-4 mr-2" />
              Create Campaign
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="text-foreground">Create New Campaign</DialogTitle>
            </DialogHeader>
            <CreateCampaignForm 
              onSuccess={() => {
                setIsCreateModalOpen(false);
                refetch();
              }} 
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex flex-wrap gap-2">
          <Button
            variant={statusFilter === "all" ? "default" : "outline"}
            onClick={() => setStatusFilter("all")}
            className={cn(
              "h-9 rounded-lg px-3 text-sm font-medium",
              statusFilter === "all" ? "bg-blue-600 text-white hover:bg-blue-700" : ""
            )}
          >
            All Campaigns
          </Button>
          <Button
            variant={statusFilter === "active" ? "default" : "outline"}
            onClick={() => setStatusFilter("active")}
            className={cn(
              "h-9 rounded-lg px-3 text-sm font-medium",
              statusFilter === "active" ? "bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400" : ""
            )}
          >
            Active
          </Button>
          <Button
            variant={statusFilter === "inactive" ? "default" : "outline"}
            onClick={() => setStatusFilter("inactive")}
            className={cn(
              "h-9 rounded-lg px-3 text-sm font-medium",
              statusFilter === "inactive" ? "bg-amber-100 text-amber-800 hover:bg-amber-200 dark:bg-amber-900/30 dark:text-amber-400" : ""
            )}
          >
            Inactive
          </Button>
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
          <Input
            placeholder="Search campaigns..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-10 w-full pl-9"
          />
        </div>
      </div>

      {/* Campaigns Table */}
      {status === "pending" && !data && (
        <div className="flex h-64 items-center justify-center">
          <div className="text-muted-foreground">Loading campaigns...</div>
        </div>
      )}

      {status === "error" && (
        <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4 text-destructive">
          Error loading campaigns. Please try again.
        </div>
      )}

      <div className="overflow-hidden rounded-xl border border-border/50 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/30">
              <tr className="border-b border-border/50">
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Campaign Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Total Leads
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Request Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Connection Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {filteredData?.map((c) => (
                <tr 
                  key={c.id} 
                  className="group cursor-pointer transition-colors hover:bg-accent/30"
                  onClick={() => router.push(`/dashboard/campaigns/${c.id}`)}
                >
                  <td className="whitespace-nowrap px-4 py-4">
                    <div className="font-medium text-foreground group-hover:text-primary">{c.name}</div>
                  </td>
                  <td className="whitespace-nowrap px-4 py-4">
                    {c.status === "active" ? (
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400">
                        Active
                      </Badge>
                    ) : c.status === "paused" ? (
                      <Badge variant="warning" className="bg-amber-100 text-amber-800 hover:bg-amber-200 dark:bg-amber-900/30 dark:text-amber-400">
                        Paused
                      </Badge>
                    ) : c.status === "completed" ? (
                      <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400">
                        Completed
                      </Badge>
                    ) : (
                      <Badge variant="outline">Draft</Badge>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-4 py-4">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium text-foreground/90">{c._count.leads}</span>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-4 py-4">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1.5">
                        <UserPlus className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium">0</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <UserCheck className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium">{c._count.leads}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <UserX className="h-4 w-4 text-red-600" />
                        <span className="text-sm font-medium">0</span>
                      </div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-4 py-4">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1.5">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">0</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MessageSquare className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">0</span>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredData?.length === 0 && (
          <div className="flex h-64 flex-col items-center justify-center text-center">
            <div className="text-muted-foreground">No campaigns found</div>
            <p className="mt-2 text-sm text-muted-foreground/70">
              {searchQuery || statusFilter !== "all" 
                ? 'Try adjusting your search or filter' 
                : 'Get started by creating your first campaign'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function CreateCampaignForm({ onSuccess }: { onSuccess: () => void }) {
  const [name, setName] = useState("");
  const [status, setStatus] = useState("draft");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Campaign name is required");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), status }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create campaign");
      }

      onSuccess();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Campaign Name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter campaign name"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="status">Status</Label>
        <select
          id="status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <option value="draft">Draft</option>
          <option value="active">Active</option>
          <option value="paused">Paused</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {error && (
        <div className="text-sm text-red-600">{error}</div>
      )}

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={() => onSuccess()}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Creating..." : "Create Campaign"}
        </Button>
      </div>
    </form>
  );
}
