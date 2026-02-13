import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  Star,
  MessageSquare,
  Eye,
  Download,
  Check,
  AlertCircle,
  ImageIcon,
  Video,
  UserPlus,
  Send,
  Clock,
} from "lucide-react";
import {
  MOCK_CAMPAIGNS,
  type Campaign,
  type CreatorAssignment,
  type CreatorStatus,
  type CompensationType,
} from "@/store/campaign-store";

const statusStyles: Record<
  CreatorStatus,
  { label: string; className: string }
> = {
  recommended: { label: "Recommended", className: "bg-[var(--brand-100)] text-[var(--brand-700)]" },
  invited: { label: "Invited", className: "bg-[var(--blue-100)] text-[var(--blue-700)]" },
  applied: { label: "Applied", className: "bg-[var(--orange-100)] text-[var(--orange-700)]" },
  accepted: { label: "Accepted", className: "bg-[var(--green-100)] text-[var(--green-700)]" },
  negotiating: { label: "Negotiating", className: "bg-[var(--orange-100)] text-[var(--orange-700)]" },
  product_shipped: { label: "Product Shipped", className: "bg-[var(--blue-100)] text-[var(--blue-700)]" },
  gift_card_sent: { label: "Gift Card Sent", className: "bg-[var(--blue-100)] text-[var(--blue-700)]" },
  content_submitted: { label: "Content Ready", className: "bg-[var(--brand-100)] text-[var(--brand-700)]" },
  content_approved: { label: "Approved", className: "bg-[var(--green-100)] text-[var(--green-700)]" },
  posted: { label: "Posted", className: "bg-[var(--green-100)] text-[var(--green-700)]" },
  complete: { label: "Complete", className: "bg-[var(--green-100)] text-[var(--green-700)]" },
  declined: { label: "Declined", className: "bg-[var(--red-100)] text-[var(--red-700)]" },
};

const compLabels: Record<CompensationType, string> = {
  gifted: "Gifted Product",
  gift_card: "Gift Card",
  discount: "Discount Code",
  paid: "Paid Fee",
  commission_boost: "Commission Boost",
};

function BudgetTracker({ campaign }: { campaign: Campaign }) {
  if (campaign.budgetType === "flexible") return null;

  const cap =
    campaign.budgetType === "spend_cap"
      ? campaign.budgetCapAmount || 0
      : campaign.budgetInventoryCount || 0;
  const allocated = campaign.budgetAllocated;
  const percent = cap > 0 ? Math.round((allocated / cap) * 100) : 0;
  const label =
    campaign.budgetType === "spend_cap"
      ? `$${allocated.toLocaleString()} allocated / $${cap.toLocaleString()} cap`
      : `${allocated} allocated / ${cap} units`;

  const barColor =
    percent >= 100
      ? "bg-[var(--red-500)]"
      : percent >= 80
        ? "bg-[var(--orange-500)]"
        : "bg-[var(--green-500)]";

  return (
    <Card className="border-[var(--neutral-200)] shadow-light-top">
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-lg">💰</span>
            <span className="text-sm font-bold text-[var(--neutral-800)]">Budget</span>
          </div>
          <span className="text-sm font-medium text-[var(--neutral-800)]">
            {label}
          </span>
        </div>
        <div className="relative h-3 w-full overflow-hidden rounded-full bg-[var(--neutral-200)]">
          <div
            className={`h-full rounded-full transition-all ${barColor}`}
            style={{ width: `${Math.min(percent, 100)}%` }}
          />
        </div>
        <div className="mt-2 flex items-center justify-between text-xs text-[var(--neutral-500)]">
          <span>{percent}% allocated</span>
          <span>
            {campaign.creators.filter((c) => c.status !== "declined" && c.status !== "recommended").length} creators assigned
            &middot;{" "}
            {campaign.creators.filter((c) => c.status === "accepted" || c.status === "posted" || c.status === "complete").length} accepted
            &middot;{" "}
            {campaign.creators.filter((c) => c.status === "posted" || c.status === "complete").length} posted
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

function CreatorRow({ creator, campaign }: { creator: CreatorAssignment; campaign: Campaign }) {
  const statusConfig = statusStyles[creator.status];
  const enabledCompTypes = campaign.compensationTypes.filter((c) => c.enabled);

  return (
    <div className="flex items-center justify-between rounded-lg border border-[var(--neutral-200)] p-4 transition-all hover:shadow-light-top">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--brand-200)] text-sm font-bold text-[var(--brand-800)]">
          {creator.creatorName
            .split(" ")
            .map((n) => n[0])
            .join("")}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-[var(--neutral-800)]">
              {creator.creatorName}
            </span>
            {creator.isExclusive && (
              <Badge className="border-0 bg-[var(--brand-100)] text-[var(--brand-700)] text-[10px]">
                <Star className="mr-0.5 size-2.5" /> Exclusive
              </Badge>
            )}
          </div>
          <p className="text-xs text-[var(--neutral-500)]">
            {creator.creatorHandle} &middot;{" "}
            {creator.followerCount.toLocaleString()} followers
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Badge className={`border-0 text-xs ${statusConfig.className}`}>
          {statusConfig.label}
        </Badge>

        <Select defaultValue={creator.compensation.type}>
          <SelectTrigger className="h-8 w-36 text-xs border-[var(--neutral-200)]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {enabledCompTypes.map((c) => (
              <SelectItem key={c.type} value={c.type} className="text-xs">
                {compLabels[c.type]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <span className="w-16 text-right text-sm font-medium text-[var(--neutral-800)]">
          {creator.compensation.type === "paid"
            ? `$${creator.compensation.amount}`
            : creator.compensation.type === "gifted"
              ? `$${creator.compensation.amount}`
              : creator.compensation.type === "gift_card"
                ? `$${creator.compensation.amount}`
                : "—"}
        </span>

        {creator.contentSubmissions.length > 0 ? (
          <Badge variant="outline" className="gap-1 border-[var(--neutral-200)] text-xs">
            <ImageIcon className="size-3" /> {creator.contentSubmissions.length}
          </Badge>
        ) : (
          <span className="w-12 text-center text-xs text-[var(--neutral-400)]">—</span>
        )}

        <div className="flex gap-1">
          <Button variant="ghost" size="icon" className="h-7 w-7 text-[var(--neutral-500)]">
            <MessageSquare className="size-3.5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7 text-[var(--neutral-500)]">
            <Eye className="size-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}

function ContentGallery({ campaign }: { campaign: Campaign }) {
  const allContent = campaign.creators.flatMap((creator) =>
    creator.contentSubmissions.map((cs) => ({
      ...cs,
      creatorName: creator.creatorName,
      creatorHandle: creator.creatorHandle,
    }))
  );

  if (allContent.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[var(--neutral-300)] bg-[var(--neutral-100)] py-16">
        <ImageIcon className="size-8 text-[var(--neutral-400)]" />
        <h3 className="mt-3 text-sm font-medium text-[var(--neutral-800)]">
          No content submitted yet
        </h3>
        <p className="mt-1 text-xs text-[var(--neutral-500)]">
          Creator content will appear here as it's submitted.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <span className="text-sm text-[var(--neutral-600)]">
          {allContent.length} piece{allContent.length !== 1 ? "s" : ""} of content
        </span>
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5 border-[var(--neutral-200)] text-xs"
        >
          <Download className="size-3" /> Download All
        </Button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {allContent.map((content) => (
          <Card
            key={content.id}
            className={`overflow-hidden border-[var(--neutral-200)] transition-shadow hover:shadow-medium-top ${
              content.reviewStatus === "pending" ? "opacity-70" : ""
            }`}
          >
            <div className="relative aspect-square bg-[var(--neutral-100)] flex items-center justify-center">
              {content.contentType === "video" || content.contentType === "reel" ? (
                <Video className="size-8 text-[var(--neutral-400)]" />
              ) : (
                <ImageIcon className="size-8 text-[var(--neutral-400)]" />
              )}
              {content.reviewStatus === "pending" && (
                <div className="absolute top-2 right-2">
                  <Badge className="bg-[var(--orange-500)] text-white text-[10px] border-0">
                    <Clock className="mr-0.5 size-2.5" /> Review
                  </Badge>
                </div>
              )}
              {content.reviewStatus === "approved" && (
                <div className="absolute top-2 right-2">
                  <Badge className="bg-[var(--green-500)] text-white text-[10px] border-0">
                    <Check className="mr-0.5 size-2.5" /> Approved
                  </Badge>
                </div>
              )}
            </div>
            <CardContent className="p-3">
              <p className="text-xs font-medium text-[var(--neutral-800)]">
                {content.creatorHandle}
              </p>
              <div className="mt-1 flex items-center justify-between">
                <Badge
                  variant="outline"
                  className="border-[var(--neutral-200)] text-[10px] capitalize"
                >
                  {content.platform} {content.contentType}
                </Badge>
                <span className="text-[10px] text-[var(--neutral-400)]">
                  {content.submittedAt}
                </span>
              </div>
              <div className="mt-2 flex gap-1">
                {campaign.contentReviewRequired && content.reviewStatus === "pending" && (
                  <>
                    <Button
                      size="sm"
                      className="h-6 flex-1 gap-1 bg-[var(--green-500)] text-[10px] hover:bg-[var(--green-700)]"
                    >
                      <Check className="size-2.5" /> Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-6 flex-1 gap-1 border-[var(--neutral-200)] text-[10px]"
                    >
                      <AlertCircle className="size-2.5" /> Changes
                    </Button>
                  </>
                )}
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-6 gap-1 text-[10px] text-[var(--brand-700)]"
                >
                  <Download className="size-2.5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default function CampaignDetail() {
  const { id } = useParams();
  const campaign = MOCK_CAMPAIGNS.find((c) => c.id === id);

  if (!campaign) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <h2 className="text-xl font-bold text-[var(--neutral-800)]">Campaign not found</h2>
        <Button asChild className="mt-4" variant="outline">
          <Link to="/campaigns">
            <ArrowLeft className="mr-2 size-4" /> Back to Campaigns
          </Link>
        </Button>
      </div>
    );
  }

  const campaignStatusStyle =
    campaign.status === "active"
      ? "bg-[var(--green-100)] text-[var(--green-700)]"
      : campaign.status === "filled"
        ? "bg-[var(--orange-100)] text-[var(--orange-700)]"
        : campaign.status === "completed"
          ? "bg-[var(--blue-100)] text-[var(--blue-700)]"
          : "bg-[var(--neutral-100)] text-[var(--neutral-600)]";

  const goalLabels: Record<string, string> = {
    awareness: "Brand Awareness",
    sales: "Drive Sales / Traffic",
    product_launch: "Product Launch",
    ugc: "Content / UGC Generation",
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Button
          variant="ghost"
          size="sm"
          asChild
          className="mb-2 gap-1 text-[var(--neutral-500)] hover:text-[var(--neutral-800)]"
        >
          <Link to="/campaigns">
            <ArrowLeft className="size-3.5" /> All Campaigns
          </Link>
        </Button>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-[28px] font-bold text-[var(--neutral-800)]">
              {campaign.title}
            </h1>
            <Badge className={`border-0 text-xs font-medium ${campaignStatusStyle}`}>
              {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
            </Badge>
            <Badge
              variant="outline"
              className="border-[var(--neutral-200)] text-xs font-normal capitalize"
            >
              {campaign.mode}
            </Badge>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-1.5 border-[var(--neutral-200)]">
              <Send className="size-3.5" /> Invite Creators
            </Button>
          </div>
        </div>
      </div>

      {/* Budget tracker */}
      <BudgetTracker campaign={campaign} />

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="bg-[var(--neutral-100)] p-1">
          <TabsTrigger value="overview" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
            Overview
          </TabsTrigger>
          <TabsTrigger value="creators" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
            Creators ({campaign.creators.length})
          </TabsTrigger>
          <TabsTrigger value="content" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
            Content Gallery
          </TabsTrigger>
        </TabsList>

        {/* Overview tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-4 gap-4">
            <Card className="border-[var(--neutral-200)]">
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-[var(--neutral-800)]">
                  {campaign.creators.length}
                </p>
                <p className="text-xs text-[var(--neutral-500)]">Total Creators</p>
              </CardContent>
            </Card>
            <Card className="border-[var(--neutral-200)]">
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-[var(--neutral-800)]">
                  {campaign.creators.filter(
                    (c) => c.status === "accepted" || c.status === "posted" || c.status === "complete"
                  ).length}
                </p>
                <p className="text-xs text-[var(--neutral-500)]">Accepted</p>
              </CardContent>
            </Card>
            <Card className="border-[var(--neutral-200)]">
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-[var(--neutral-800)]">
                  {campaign.creators.flatMap((c) => c.contentSubmissions).length}
                </p>
                <p className="text-xs text-[var(--neutral-500)]">Content Submitted</p>
              </CardContent>
            </Card>
            <Card className="border-[var(--neutral-200)]">
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-[var(--neutral-800)]">
                  {campaign.creators.filter((c) => c.status === "posted" || c.status === "complete").length}
                </p>
                <p className="text-xs text-[var(--neutral-500)]">Posted</p>
              </CardContent>
            </Card>
          </div>

          <Card className="border-[var(--neutral-200)] shadow-light-top">
            <CardHeader>
              <CardTitle className="text-base text-[var(--neutral-800)]">Campaign Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[var(--neutral-500)]">Goal</p>
                  <p className="font-medium text-[var(--neutral-800)]">
                    {campaign.goal ? goalLabels[campaign.goal] : "—"}
                  </p>
                </div>
                <div>
                  <p className="text-[var(--neutral-500)]">Platforms</p>
                  <div className="flex gap-1.5 mt-0.5">
                    {campaign.platforms.map((p) => (
                      <Badge
                        key={p}
                        variant="outline"
                        className="border-[var(--neutral-200)] text-xs capitalize"
                      >
                        {p}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-[var(--neutral-500)]">Flight Dates</p>
                  <p className="font-medium text-[var(--neutral-800)]">
                    {campaign.flightDateStart} — {campaign.flightDateEnd}
                  </p>
                </div>
                <div>
                  <p className="text-[var(--neutral-500)]">UGC Rights</p>
                  <p className="font-medium text-[var(--neutral-800)]">
                    {campaign.ugcRights ? "Yes" : "No"}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-[var(--neutral-500)]">Description</p>
                <p className="mt-1 text-[var(--neutral-800)]">{campaign.description}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Creators tab */}
        <TabsContent value="creators" className="space-y-4">
          {campaign.mode === "open" && (
            <Card className="border-[var(--brand-200)] bg-[var(--brand-0)]">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-[var(--neutral-800)]">
                      Recommended Creators
                    </p>
                    <p className="text-xs text-[var(--neutral-500)]">
                      Benable has surfaced matches based on your campaign criteria.
                    </p>
                  </div>
                  <Button
                    size="sm"
                    className="gap-1.5 bg-[var(--brand-700)] hover:bg-[var(--brand-800)]"
                  >
                    <UserPlus className="size-3.5" /> Select All Recommended
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="space-y-2">
            <div className="flex items-center gap-4 px-4 text-xs font-medium text-[var(--neutral-500)]">
              <span className="flex-1">Creator</span>
              <span className="w-24 text-center">Status</span>
              <span className="w-36 text-center">Compensation</span>
              <span className="w-16 text-right">Value</span>
              <span className="w-12 text-center">Content</span>
              <span className="w-16 text-center">Actions</span>
            </div>
            {campaign.creators.map((creator) => (
              <CreatorRow key={creator.creatorId} creator={creator} campaign={campaign} />
            ))}
          </div>
        </TabsContent>

        {/* Content Gallery tab */}
        <TabsContent value="content">
          <ContentGallery campaign={campaign} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
