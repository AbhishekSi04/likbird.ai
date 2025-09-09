import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  ArrowLeft, 
  Mail, 
  Phone, 
  Building2, 
  MapPin, 
  Link as LinkIcon, 
  MessageSquare, 
  Calendar, 
  CheckCircle2,
  Send,
  Paperclip,
  Smile
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

// Mock data - replace with actual data fetching
async function getLead(id: string) {
  // In a real app, fetch from your API
  await new Promise(resolve => setTimeout(resolve, 500)); // Simulate loading
  
  const mockLead = {
    id,
    name: "Alex Johnson",
    email: "alex.johnson@example.com",
    phone: "+1 (555) 123-4567",
    company: "TechCorp Inc.",
    position: "CTO",
    location: "San Francisco, CA",
    status: "contacted",
    source: "LinkedIn",
    lastContact: "2023-06-15T10:30:00Z",
    notes: "Interested in our enterprise plan. Wants to schedule a demo next week.",
    campaign: "Q2 Enterprise Outreach"
  };

  return mockLead;
}

type Lead = Awaited<ReturnType<typeof getLead>>;

export default async function LeadProfile({ params }: { params: { id: string } }) {
  const lead = await getLead(params.id);
  
  if (!lead) {
    notFound();
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header with back button */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/dashboard/leads">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">Lead Details</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Left sidebar */}
        <div className="space-y-6 md:col-span-1">
          {/* Lead card */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <Avatar className="h-24 w-24 mb-4">
                  <AvatarImage src="" alt={lead.name} />
                  <AvatarFallback className="text-2xl">
                    {lead.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <h2 className="text-xl font-semibold">{lead.name}</h2>
                <p className="text-muted-foreground">{lead.position}</p>
                
                <div className="mt-4 w-full space-y-2 text-left">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{lead.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{lead.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{lead.company}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{lead.location}</span>
                  </div>
                </div>

                <div className="mt-4 w-full">
                  <Badge 
                    className={cn(
                      "w-full justify-center",
                      lead.status === "contacted" ? "bg-blue-100 text-blue-800 hover:bg-blue-100" : "",
                      lead.status === "pending" ? "bg-amber-100 text-amber-800 hover:bg-amber-100" : "",
                      lead.status === "converted" ? "bg-green-100 text-green-800 hover:bg-green-100" : ""
                    )}
                  >
                    {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Campaign info */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Campaign</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                  <LinkIcon className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-medium">{lead.campaign}</p>
                  <p className="text-xs text-muted-foreground">Source: {lead.source}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main content */}
        <div className="space-y-6 md:col-span-2">
          <Tabs defaultValue="activity" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="activity">Activity</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="messages">Messages</TabsTrigger>
            </TabsList>
            
            <TabsContent value="activity" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Activity Timeline</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { 
                        id: 1, 
                        type: 'message', 
                        date: '2023-06-15T10:30:00Z',
                        content: 'Sent follow-up email about enterprise demo',
                        icon: <MessageSquare className="h-4 w-4 text-blue-500" />
                      },
                      { 
                        id: 2, 
                        type: 'status', 
                        date: '2023-06-10T14:20:00Z',
                        content: 'Lead status changed to Contacted',
                        icon: <CheckCircle2 className="h-4 w-4 text-green-500" />
                      },
                      { 
                        id: 3, 
                        type: 'note', 
                        date: '2023-06-08T09:15:00Z',
                        content: 'Initial contact made through LinkedIn',
                        icon: <Calendar className="h-4 w-4 text-amber-500" />
                      },
                    ].map((activity) => (
                      <div key={activity.id} className="flex gap-3">
                        <div className="flex flex-col items-center">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                            {activity.icon}
                          </div>
                          {activity.id < 3 && (
                            <div className="h-full w-px bg-border my-1" />
                          )}
                        </div>
                        <div className="flex-1 pb-4">
                          <p className="text-sm font-medium">{activity.content}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(activity.date).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="details">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Lead Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Notes</Label>
                    <div className="rounded-md border p-4 text-sm">
                      {lead.notes || "No notes available"}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Source</Label>
                      <div className="text-sm text-muted-foreground">
                        {lead.source || "Unknown"}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Last Contact</Label>
                      <div className="text-sm text-muted-foreground">
                        {new Date(lead.lastContact).toLocaleString()}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="messages">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Conversation</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-4 rounded-lg border p-4">
                      {/* Messages will go here */}
                      <div className="flex justify-end">
                        <div className="max-w-[80%] rounded-lg bg-blue-600 px-4 py-2 text-white">
                          <p className="text-sm">Hi Alex, I'm following up about our conversation last week. Do you have time for a quick call this week?</p>
                          <p className="mt-1 text-right text-xs text-blue-100">
                            {new Date().toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="relative mt-4">
                      <textarea 
                        placeholder="Type your message here..." 
                        className="min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 pr-16 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      />
                      <div className="absolute right-2 top-2 flex gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Paperclip className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Smile className="h-4 w-4" />
                        </Button>
                        <Button size="sm" className="h-8 gap-1">
                          <Send className="h-4 w-4" />
                          <span>Send</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
