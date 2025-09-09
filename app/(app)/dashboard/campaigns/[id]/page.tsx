"use client";
import * as React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { 
  ArrowLeft,
  Users, 
  Mail, 
  MessageSquare, 
  Target,
  Calendar,
  BarChart3,
  TrendingUp,
  Grid3X3,
  Link,
  Settings
} from "lucide-react";

type CampaignDetail = {
  id: string;
  name: string;
  status: "draft" | "active" | "paused" | "completed";
  createdAt: string;
  _count: { leads: number };
  successCount: number;
};

async function fetchCampaign(id: string) {
  const res = await fetch(`/api/campaigns/${id}`);
  if (!res.ok) throw new Error("Failed to load campaign");
  return res.json() as Promise<CampaignDetail>;
}

export default function CampaignDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const campaignId = params.id as string;
  const qc = useQueryClient();
  
  const { data: campaign, status } = useQuery({
    queryKey: ["campaign", campaignId],
    queryFn: () => fetchCampaign(campaignId),
  });

  if (status === "pending") return <div>Loading...</div>;
  if (status === "error") return <div>Error loading campaign</div>;
  if (!campaign) return <div>Campaign not found</div>;

  const getStatusBadge = (status: string) => {
    if (status === "active") {
      return <Badge variant="success" className="bg-green-100 text-green-800">Active</Badge>;
    }
    return <Badge variant="outline">{status}</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span>Campaign</span>
        <span>&gt;</span>
        <span className="text-foreground">{campaign.name}</span>
      </div>

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold">Campaign Details</h1>
          <p className="text-muted-foreground">Manage and track your campaign performance</p>
        </div>
        <div className="flex items-center gap-3">
          {getStatusBadge(campaign.status)}
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <Grid3X3 className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="leads" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Leads
          </TabsTrigger>
          <TabsTrigger value="sequence" className="flex items-center gap-2">
            <Link className="h-4 w-4" />
            Sequence
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{campaign._count.leads}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Request Sent</CardTitle>
                <Mail className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Request Accepted</CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Request Replied</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
              </CardContent>
            </Card>
          </div>

          {/* Progress and Details */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Campaign Progress */}
            <Card>
              <CardHeader>
                <CardTitle>Campaign Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Leads Contacted</span>
                    <span>0.0%</span>
                  </div>
                  <Progress value={0} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Acceptance Rate</span>
                    <span>0.0%</span>
                  </div>
                  <Progress value={0} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Reply Rate</span>
                    <span>0.0%</span>
                  </div>
                  <Progress value={0} className="h-2" />
                </div>
              </CardContent>
            </Card>

            {/* Campaign Details */}
            <Card>
              <CardHeader>
                <CardTitle>Campaign Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="text-sm font-medium">Start Date</div>
                    <div className="text-sm text-muted-foreground">02/09/2025</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="text-sm font-medium">Status</div>
                    <div className="text-sm text-muted-foreground capitalize">{campaign.status}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="text-sm font-medium">Conversion Rate</div>
                    <div className="text-sm text-muted-foreground">0.0%</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="leads">
          <Card>
            <CardHeader>
              <CardTitle>Campaign Leads</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <Input placeholder="Search leads..." className="w-64" id="lead-search" />
                <Select defaultValue="all">
                  <SelectTrigger className="w-40"><SelectValue placeholder="All statuses" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All statuses</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="contacted">Contacted</SelectItem>
                    <SelectItem value="responded">Responded</SelectItem>
                    <SelectItem value="converted">Converted</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <LeadsTable campaignId={campaignId} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sequence">
          <SequenceEditor />
        </TabsContent>

        <TabsContent value="settings">
          <SettingsPanel campaignId={campaignId} campaign={campaign} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function LeadsTable({ campaignId }: { campaignId: string }) {
  const [q, setQ] = React.useState("");
  const [status, setStatus] = React.useState("all");
  const { data, status: qStatus } = useQuery({
    queryKey: ["campaign", campaignId, "leads", q, status],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (q) params.set("q", q);
      if (status && status !== "all") params.set("status", status);
      const res = await fetch(`/api/campaigns/${campaignId}/leads?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to load campaign leads");
      return (await res.json()) as Array<{ id: string; name: string; email: string; company: string; status: string }>;
    },
  });

  return (
    <div className="overflow-auto rounded border bg-card">
      <table className="w-full text-sm">
        <thead className="bg-muted/50">
          <tr>
            <th className="px-3 py-2 text-left">Name</th>
            <th className="px-3 py-2 text-left">Lead Description</th>
            <th className="px-3 py-2 text-left">Activity</th>
            <th className="px-3 py-2 text-left">Status</th>
          </tr>
        </thead>
        <tbody>
          {qStatus === "pending" && (
            <tr><td className="px-3 py-3" colSpan={4}>Loading...</td></tr>
          )}
          {data?.map((lead) => (
            <tr key={lead.id} className="border-t hover:bg-accent">
              <td className="px-3 py-3">
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8"><AvatarImage src="" /><AvatarFallback>{lead.name.split(' ').map(n=>n[0]).join('')}</AvatarFallback></Avatar>
                  <div>
                    <div className="font-medium">{lead.name}</div>
                    <div className="text-xs text-muted-foreground">{lead.email}</div>
                  </div>
                </div>
              </td>
              <td className="px-3 py-3 text-muted-foreground">{lead.company}</td>
              <td className="px-3 py-3">
                <div className="flex items-center gap-1">
                  <div className="h-2 w-2 bg-gray-300 rounded-full" />
                  <div className="h-2 w-2 bg-gray-300 rounded-full" />
                  <div className="h-2 w-2 bg-gray-300 rounded-full" />
                  <div className="h-2 w-2 bg-gray-300 rounded-full" />
                </div>
              </td>
              <td className="px-3 py-3">
                <Badge variant="outline" className="bg-amber-100 text-amber-800">Pending</Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SequenceEditor() {
  return (
    <div className="space-y-6">
      {/* Request Message */}
      <Card>
        <CardHeader><CardTitle>Message Sequence</CardTitle></CardHeader>
        <CardContent className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-3 rounded-lg border bg-muted/30 p-4">
            <div className="text-sm font-medium">Request Message</div>
            <div className="text-xs text-muted-foreground">Edit your request message here.</div>
            <div className="text-sm font-semibold">Available fields:</div>
            <div className="space-y-2 text-blue-600">
              <div>{"{{fullName}}"} - Full Name</div>
              <div>{"{{firstName}}"} - First Name</div>
              <div>{"{{lastName}}"} - Last Name</div>
              <div>{"{{jobTitle}}"} - Job Title</div>
            </div>
          </div>
          <div className="rounded-lg border p-4">
            <div className="text-sm text-muted-foreground mb-2">Message Template</div>
            <div className="h-40 rounded-md border bg-background p-3 text-sm text-muted-foreground">Loading...</div>
            <div className="mt-3 flex justify-end gap-2"><Button variant="outline">Preview</Button><Button>Save</Button></div>
          </div>
        </CardContent>
      </Card>

      {/* Connection Message */}
      <Card>
        <CardHeader><CardTitle>Connection Message</CardTitle></CardHeader>
        <CardContent>
          <div className="h-32 rounded-md border bg-background p-3 text-sm text-muted-foreground">Awesome to connect, {"{{firstname}}"} ...</div>
          <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1">Send</span>
            <Input className="h-8 w-24" defaultValue="1 day" />
            <span>After Welcome Message</span>
            <div className="ml-auto flex gap-2"><Button variant="outline">Preview</Button><Button>Save</Button></div>
          </div>
        </CardContent>
      </Card>

      {/* Follow-ups */}
      <Card>
        <CardHeader><CardTitle>First Follow-up Message</CardTitle></CardHeader>
        <CardContent>
          <div className="h-24 rounded-md border bg-background p-3 text-sm text-muted-foreground">you like to explore a POC for Just Herbs?</div>
          <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1">Send</span>
            <Input className="h-8 w-24" defaultValue="1 day" />
            <span>After Welcome Message</span>
            <div className="ml-auto flex gap-2"><Button variant="outline">Preview</Button><Button>Save</Button></div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Second Follow-up Message</CardTitle></CardHeader>
        <CardContent>
          <div className="h-24 rounded-md border bg-background p-3 text-sm text-muted-foreground">Hi {"{{firstName}}"}, just following up...</div>
          <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1">Send</span>
            <Input className="h-8 w-24" defaultValue="1 day" />
            <span>After First Follow-up</span>
            <div className="ml-auto flex gap-2"><Button variant="outline">Preview</Button><Button>Save</Button></div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function SettingsPanel({ campaignId, campaign }: { campaignId: string; campaign: CampaignDetail }) {
  const [name, setName] = React.useState(campaign.name);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isSaved, setIsSaved] = React.useState(false);
  const qc = useQueryClient();

  const updateCampaign = useMutation({
    mutationFn: async (data: { name?: string }) => {
      const response = await fetch(`/api/campaigns/${campaignId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to update campaign");
      return response.json();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["campaign", campaignId] });
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000);
    },
  });

  const handleSave = () => {
    setIsLoading(true);
    updateCampaign.mutate({
      name,
    }, {
      onSettled: () => setIsLoading(false),
    });
  };

  const hasChanges = name !== campaign.name;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Campaign Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="campaign-name" className="text-sm mb-1">Campaign Name</Label>
            <Input 
              id="campaign-name"
              value={name} 
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter campaign name"
            />
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Checkbox 
                id="campaign-status"
                defaultChecked
                disabled
              />
              <Label htmlFor="campaign-status" className="text-sm">Campaign Status</Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox 
                id="request-without-personalization"
                defaultChecked
                disabled
              />
              <Label htmlFor="request-without-personalization" className="text-sm">Request without personalization</Label>
            </div>
          </div>
          {hasChanges && (
            <div className="flex items-center gap-2 pt-2">
              <Button 
                onClick={handleSave} 
                disabled={isLoading}
                size="sm"
              >
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
              {isSaved && (
                <span className="text-sm text-green-600">✓ Saved successfully</span>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>AutoPilot Mode</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div className="text-sm text-muted-foreground">Let the system automatically manage LinkedIn account assignments</div>
          <div className="rounded-md border p-3 text-sm">1 account selected</div>
          <div className="text-sm">Selected Accounts:</div>
          <div className="flex items-center gap-2 rounded-md border p-2 w-fit">
            <Avatar className="h-6 w-6"><AvatarImage src="" /><AvatarFallback>JL</AvatarFallback></Avatar>
            <span className="text-sm">Jivesh Lakhani</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Danger Zone</CardTitle></CardHeader>
        <CardContent className="flex items-center justify-between rounded-md border p-4">
          <div>
            <div className="text-sm font-medium">Delete Campaign</div>
            <div className="text-sm text-muted-foreground">Permanently delete this campaign and all associated data</div>
          </div>
          <Button variant="destructive">Delete Campaign</Button>
        </CardContent>
      </Card>
    </div>
  );
}
