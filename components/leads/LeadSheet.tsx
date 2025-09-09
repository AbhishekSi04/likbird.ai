"use client";
import { useEffect, useState } from "react";
import { useSelectionStore } from "@/lib/store";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle 
} from "@/components/ui/sheet";
import { 
  ExternalLink, 
  Trash2, 
  ChevronDown, 
  CheckCircle, 
  Circle,
  Clock,
  User,
  MessageSquare
} from "lucide-react";

type LeadDetail = {
  id: string;
  name: string;
  email: string;
  company: string;
  status: string;
  lastContactDate: string;
  campaign: { id: string; name: string; status: string } | null;
};

export function LeadSheet() {
  const { selectedLeadId, selectLead } = useSelectionStore();
  const [data, setData] = useState<LeadDetail | null>(null);
  const [showAdditionalInfo, setShowAdditionalInfo] = useState(false);
  const open = !!selectedLeadId;

  useEffect(() => {
    if (!selectedLeadId) return;
    fetch(`/api/leads/${selectedLeadId}`).then(async (r) => {
      if (r.ok) setData(await r.json());
    });
  }, [selectedLeadId]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="pending" className="flex items-center gap-1"><Clock className="h-3 w-3" />Pending Approval</Badge>;
      case "contacted":
        return <Badge variant="warning" className="flex items-center gap-1"><User className="h-3 w-3" />Sent 7 mins ago</Badge>;
      case "responded":
        return <Badge variant="default" className="flex items-center gap-1 bg-blue-600"><MessageSquare className="h-3 w-3" />Followup 10 mins ago</Badge>;
      case "converted":
        return <Badge variant="success">Converted</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <Sheet open={open} onOpenChange={(open) => !open && selectLead(null)}>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>Lead Profile</SheetTitle>
        </SheetHeader>
        
        {!data ? (
          <div className="p-4 text-sm text-muted-foreground">Loading...</div>
        ) : (
          <div className="space-y-6">
            {/* Lead Summary */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src="" />
                  <AvatarFallback className="text-lg">
                    {data.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold">{data.name}</h3>
                    <ExternalLink className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground">Regional Head</p>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{data.campaign?.name}</span>
                  </div>
                  {getStatusBadge(data.status)}
                </div>
              </div>
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            {/* Additional Profile Info */}
            <div className="space-y-3">
              <button 
                onClick={() => setShowAdditionalInfo(!showAdditionalInfo)}
                className="flex w-full items-center justify-between text-sm font-medium"
              >
                <span>Additional Profile Info</span>
                <ChevronDown className={`h-4 w-4 transition-transform ${showAdditionalInfo ? 'rotate-180' : ''}`} />
              </button>
              
              {showAdditionalInfo && (
                <div className="space-y-3 pl-4 border-l-2 border-muted">
                  <div>
                    <div className="text-sm text-muted-foreground">Email</div>
                    <div className="font-medium">{data.email}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Company</div>
                    <div className="font-medium">{data.company}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Last Contact</div>
                    <div className="font-medium">{new Date(data.lastContactDate).toLocaleDateString()}</div>
                  </div>
                </div>
              )}
            </div>

            {/* Interaction History */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold">Interaction History</h4>
              
              <div className="space-y-4">
                {/* Invitation Request */}
                <div className="flex items-start gap-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600">
                    <CheckCircle className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="text-sm font-medium">Invitation Request</div>
                    <div className="text-sm text-muted-foreground">
                      Message: Hi {data.name.split(' ')[0]}, I'm building consultative AI... 
                      <button className="text-blue-600 hover:underline ml-1">See More</button>
                    </div>
                  </div>
                </div>

                {/* Connection Status */}
                <div className="flex items-start gap-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-muted">
                    <Circle className="h-3 w-3 text-muted-foreground" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="text-sm font-medium">Connection Status</div>
                    <div className="text-sm text-muted-foreground">Check connection status</div>
                  </div>
                </div>

                {/* Replied */}
                <div className="flex items-start gap-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600">
                    <CheckCircle className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="text-sm font-medium">Replied</div>
                    <div className="text-sm text-muted-foreground">
                      <button className="text-blue-600 hover:underline">View Reply</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}


