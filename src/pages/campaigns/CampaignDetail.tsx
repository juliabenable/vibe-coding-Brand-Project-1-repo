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
  TrendingUp,
  Users,
  ChevronDown,
  Sparkles,
  X,
  Maximize2,
} from "lucide-react";
import {
  MOCK_CAMPAIGNS,
  type Campaign,
  type CreatorAssignment,
  type CreatorStatus,
  type CompensationType,
} from "@/store/campaign-store";
import { formatDate, formatDateRange, formatFollowers } from "@/lib/format";
import { useState } from "react";

// ─── Status badge styles ───
const statusStyles: Record<
  CreatorStatus,
  { label: string; className: string; dotColor: string }
> = {
  recommended: { label: "Recommended", className: "bg-[var(--brand-100)] text-[var(--brand-800)]", dotColor: "bg-[var(--brand-700)]" },
  invited: { label: "Invited", className: "bg-[var(--blue-100)] text-[var(--blue-700)]", dotColor: "bg-[var(--blue-500)]" },
  applied: { label: "Applied", className: "bg-[var(--orange-100)] text-[var(--orange-700)]", dotColor: "bg-[var(--orange-500)]" },
  accepted: { label: "Accepted", className: "bg-[var(--green-100)] text-[var(--green-700)]", dotColor: "bg-[var(--green-500)]" },
  negotiating: { label: "Negotiating", className: "bg-[var(--orange-100)] text-[var(--orange-700)]", dotColor: "bg-[var(--orange-500)]" },
  product_shipped: { label: "Shipped", className: "bg-[var(--blue-100)] text-[var(--blue-700)]", dotColor: "bg-[var(--blue-500)]" },
  gift_card_sent: { label: "Gift Card Sent", className: "bg-[var(--blue-100)] text-[var(--blue-700)]", dotColor: "bg-[var(--blue-500)]" },
  content_submitted: { label: "Content Ready", className: "bg-[var(--brand-300)] text-[var(--brand-900)]", dotColor: "bg-[var(--brand-700)]" },
  content_approved: { label: "Approved", className: "bg-[var(--green-100)] text-[var(--green-700)]", dotColor: "bg-[var(--green-500)]" },
  posted: { label: "Posted", className: "bg-[var(--green-100)] text-[var(--green-700)]", dotColor: "bg-[var(--green-500)]" },
  complete: { label: "Complete", className: "bg-[var(--green-100)] text-[var(--green-700)]", dotColor: "bg-[var(--green-500)]" },
  declined: { label: "Declined", className: "bg-[var(--red-100)] text-[var(--red-700)]", dotColor: "bg-[var(--red-500)]" },
};

const compLabels: Record<CompensationType, string> = {
  gifted: "Gifted Product",
  gift_card: "Gift Card",
  discount: "Discount Code",
  paid: "Paid Fee",
  commission_boost: "Commission Boost",
};

// ─── Budget Tracker with auto-cutoff ───
function BudgetTracker({ campaign }: { campaign: Campaign }) {
  if (campaign.budgetType === "flexible") return null;

  const cap =
    campaign.budgetType === "spend_cap"
      ? campaign.budgetCapAmount || 0
      : campaign.budgetInventoryCount || 0;
  const allocated = campaign.budgetAllocated;
  const percent = cap > 0 ? Math.round((allocated / cap) * 100) : 0;
  const unit = campaign.budgetType === "spend_cap" ? "$" : "";
  const suffix = campaign.budgetType === "product_inventory" ? " units" : "";
  const label = `${unit}${allocated.toLocaleString()}${suffix} / ${unit}${cap.toLocaleString()}${suffix}`;

  const barColor =
    percent >= 100
      ? "bg-[var(--red-500)]"
      : percent >= 80
        ? "bg-[var(--orange-500)]"
        : "bg-[var(--green-500)]";

  const activeCreators = campaign.creators.filter((c) => c.status !== "declined" && c.status !== "recommended");
  const acceptedCreators = campaign.creators.filter((c) => ["accepted", "product_shipped", "gift_card_sent", "content_submitted", "content_approved", "posted", "complete"].includes(c.status));
  const postedCreators = campaign.creators.filter((c) => c.status === "posted" || c.status === "complete");

  return (
    <Card className="border-[var(--neutral-200)] shadow-light-top overflow-hidden">
      {/* Auto-cutoff banner */}
      {percent >= 100 && (
        <div className="bg-[var(--red-100)] px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="size-4 text-[var(--red-500)]" />
            <span className="text-sm font-medium text-[var(--red-700)]">
              Budget fully allocated. Campaign is no longer accepting new creators.
            </span>
          </div>
          <Button size="sm" variant="outline" className="h-7 text-xs border-[var(--red-300)] text-[var(--red-700)] hover:bg-[var(--red-100)]">
            Reopen Campaign
          </Button>
        </div>
      )}
      {percent >= 80 && percent < 100 && (
        <div className="bg-[var(--orange-100)] px-5 py-2.5 flex items-center gap-2">
          <AlertCircle className="size-4 text-[var(--orange-500)]" />
          <span className="text-sm text-[var(--orange-700)]">
            {100 - percent}% of budget remaining. Campaign will auto-close when fully allocated.
          </span>
        </div>
      )}
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-lg">💰</span>
            <span className="text-sm font-bold text-[var(--neutral-800)]">Budget</span>
          </div>
          <span className="text-sm font-medium text-[var(--neutral-800)]">
            {label} allocated
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
            {activeCreators.length} assigned · {acceptedCreators.length} accepted · {postedCreators.length} posted
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Rich Creator Card ───
function CreatorCard({ creator, campaign, expanded, onToggle }: {
  creator: CreatorAssignment;
  campaign: Campaign;
  expanded: boolean;
  onToggle: () => void;
}) {
  const statusConfig = statusStyles[creator.status];
  const enabledCompTypes = campaign.compensationTypes.filter((c) => c.enabled);

  return (
    <div className={`rounded-xl border transition-all ${expanded ? "border-[var(--brand-400)] shadow-medium-top" : "border-[var(--neutral-200)] hover:shadow-light-top"}`}>
      {/* Quick view row */}
      <div className="flex items-center justify-between p-4 cursor-pointer" onClick={onToggle}>
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <img
            src={creator.creatorAvatar}
            alt={creator.creatorName}
            className="h-10 w-10 rounded-full object-cover ring-2 ring-[var(--neutral-200)]"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-[var(--neutral-800)] truncate">
                {creator.creatorName}
              </span>
              {creator.isExclusive && (
                <Badge className="border-0 bg-[var(--brand-100)] text-[var(--brand-700)] text-[10px] gap-0.5 shrink-0">
                  <Star className="size-2.5" /> Benable Exclusive
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2 text-xs text-[var(--neutral-500)]">
              <span>{creator.creatorHandle}</span>
              <span>·</span>
              <span>{formatFollowers(creator.followerCount)} followers</span>
              <span>·</span>
              <span className="text-[var(--green-500)] font-medium">{creator.engagementRate}% eng.</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {/* Category tags */}
          <div className="hidden lg:flex gap-1">
            {creator.categories.slice(0, 2).map((cat) => (
              <Badge key={cat} variant="outline" className="border-[var(--neutral-200)] text-[10px] font-normal text-[var(--neutral-600)]">
                {cat}
              </Badge>
            ))}
          </div>

          {/* Status with dot */}
          <Badge className={`border-0 text-xs gap-1 ${statusConfig.className}`}>
            <span className={`size-1.5 rounded-full ${statusConfig.dotColor}`} />
            {statusConfig.label}
          </Badge>

          {/* Compensation */}
          <Select defaultValue={creator.compensation.type}>
            <SelectTrigger className="h-7 w-32 text-xs border-[var(--neutral-200)]">
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

          <span className="w-14 text-right text-sm font-medium text-[var(--neutral-800)]">
            ${creator.compensation.amount}
          </span>

          {creator.contentSubmissions.length > 0 && (
            <Badge variant="outline" className="gap-1 border-[var(--brand-400)] bg-[var(--brand-0)] text-[var(--brand-700)] text-xs">
              <ImageIcon className="size-3" /> {creator.contentSubmissions.length}
            </Badge>
          )}

          <div className="flex gap-0.5">
            <Button variant="ghost" size="icon" className="h-7 w-7 text-[var(--neutral-500)] hover:text-[var(--brand-700)]">
              <MessageSquare className="size-3.5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7 text-[var(--neutral-500)] hover:text-[var(--brand-700)]">
              <Eye className="size-3.5" />
            </Button>
          </div>

          <ChevronDown className={`size-4 text-[var(--neutral-400)] transition-transform ${expanded ? "rotate-180" : ""}`} />
        </div>
      </div>

      {/* Expanded view */}
      {expanded && (
        <div className="border-t border-[var(--neutral-200)] px-4 pb-4 pt-4 bg-[var(--neutral-100)]/50">
          <div className="grid grid-cols-3 gap-6">
            {/* Left: Bio & AI match */}
            <div className="space-y-3">
              <p className="text-sm text-[var(--neutral-700)]">{creator.bio}</p>
              {creator.aiMatchReason && (
                <div className="flex items-start gap-2 rounded-lg bg-[var(--brand-0)] border border-[var(--brand-200)] p-3">
                  <Sparkles className="size-4 text-[var(--brand-700)] shrink-0 mt-0.5" />
                  <p className="text-xs text-[var(--brand-800)]">{creator.aiMatchReason}</p>
                </div>
              )}
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="rounded-lg bg-white border border-[var(--neutral-200)] p-2 text-center">
                  <p className="font-bold text-[var(--neutral-800)]">{creator.engagementRate}%</p>
                  <p className="text-[var(--neutral-500)]">Eng. Rate</p>
                </div>
                <div className="rounded-lg bg-white border border-[var(--neutral-200)] p-2 text-center">
                  <p className="font-bold text-[var(--neutral-800)]">{creator.avgLikes}</p>
                  <p className="text-[var(--neutral-500)]">Avg. Likes</p>
                </div>
                <div className="rounded-lg bg-white border border-[var(--neutral-200)] p-2 text-center">
                  <p className="font-bold text-[var(--neutral-800)]">{creator.pastCampaignCount}</p>
                  <p className="text-[var(--neutral-500)]">Past Collabs</p>
                </div>
              </div>
            </div>

            {/* Center: Audience demographics */}
            <div className="space-y-3">
              <p className="text-xs font-medium text-[var(--neutral-600)] uppercase tracking-wider">Audience</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-[var(--neutral-500)]">Top Age Group</span>
                  <span className="font-medium text-[var(--neutral-800)]">{creator.audienceTopAge}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--neutral-500)]">Gender</span>
                  <span className="font-medium text-[var(--neutral-800)]">{creator.audienceTopGender}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--neutral-500)]">Location</span>
                  <span className="font-medium text-[var(--neutral-800)]">{creator.audienceTopLocation}</span>
                </div>
              </div>
            </div>

            {/* Right: Recent content */}
            <div className="space-y-3">
              <p className="text-xs font-medium text-[var(--neutral-600)] uppercase tracking-wider">Recent Content</p>
              <div className="flex gap-2">
                {creator.recentPostThumbnails.map((thumb, i) => (
                  <img
                    key={i}
                    src={thumb}
                    alt="Recent post"
                    className="h-20 w-20 rounded-lg object-cover border border-[var(--neutral-200)]"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Content Gallery with lightbox ───
function ContentGallery({ campaign }: { campaign: Campaign }) {
  const [lightboxItem, setLightboxItem] = useState<null | { fileUrl: string; caption?: string; creatorHandle: string; creatorName?: string; creatorAvatar?: string; platform: string; contentType: string; submittedAt: string; id?: string; reviewStatus?: string; liveUrl?: string }>(null);

  const allContent = campaign.creators.flatMap((creator) =>
    creator.contentSubmissions.map((cs) => ({
      ...cs,
      creatorName: creator.creatorName,
      creatorHandle: creator.creatorHandle,
      creatorAvatar: creator.creatorAvatar,
    }))
  );

  if (allContent.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[var(--neutral-300)] bg-[var(--neutral-100)] py-20">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--brand-100)]">
          <ImageIcon className="size-7 text-[var(--brand-700)]" />
        </div>
        <h3 className="mt-4 text-base font-medium text-[var(--neutral-800)]">
          No content submitted yet
        </h3>
        <p className="mt-1 max-w-sm text-center text-sm text-[var(--neutral-500)]">
          Creator content will appear here as creators submit photos, videos, and Benable recommendations for your campaign.
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
          <Download className="size-3" /> Download All (.zip)
        </Button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {allContent.map((content) => (
          <Card
            key={content.id}
            className={`group overflow-hidden border-[var(--neutral-200)] transition-all hover:shadow-medium-top cursor-pointer ${
              content.reviewStatus === "pending" ? "ring-2 ring-[var(--orange-300)]" : ""
            }`}
            onClick={() => setLightboxItem(content)}
          >
            <div className="relative aspect-square overflow-hidden bg-[var(--neutral-100)]">
              <img
                src={content.fileUrl}
                alt={content.caption || "Creator content"}
                className="h-full w-full object-cover transition-transform group-hover:scale-105"
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                <Maximize2 className="size-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              {/* Content type badge */}
              <div className="absolute bottom-2 left-2">
                <Badge className="border-0 bg-black/60 text-white text-[10px] backdrop-blur-sm">
                  {content.contentType === "video" || content.contentType === "reel" ? (
                    <Video className="mr-0.5 size-2.5" />
                  ) : (
                    <ImageIcon className="mr-0.5 size-2.5" />
                  )}
                  {content.platform} {content.contentType}
                </Badge>
              </div>
              {/* Review status */}
              {content.reviewStatus === "pending" && (
                <div className="absolute top-2 right-2">
                  <Badge className="bg-[var(--orange-500)] text-white text-[10px] border-0">
                    <Clock className="mr-0.5 size-2.5" /> Needs Review
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
              <div className="flex items-center gap-2">
                <img src={content.creatorAvatar} alt="" className="h-5 w-5 rounded-full object-cover" />
                <span className="text-xs font-medium text-[var(--neutral-800)] truncate">
                  {content.creatorHandle}
                </span>
              </div>
              <p className="mt-1.5 text-xs text-[var(--neutral-500)] line-clamp-2">
                {content.caption}
              </p>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-[10px] text-[var(--neutral-400)]">
                  {formatDate(content.submittedAt)}
                </span>
                <div className="flex gap-1">
                  {campaign.contentReviewRequired && content.reviewStatus === "pending" && (
                    <>
                      <Button
                        size="sm"
                        className="h-6 gap-0.5 bg-[var(--green-500)] text-[10px] hover:bg-[var(--green-700)]"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Check className="size-2.5" /> Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-6 gap-0.5 border-[var(--neutral-200)] text-[10px]"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <AlertCircle className="size-2.5" /> Changes
                      </Button>
                    </>
                  )}
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 w-6 p-0 text-[var(--brand-700)]"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Download className="size-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Lightbox */}
      {lightboxItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setLightboxItem(null)}>
          <div className="relative max-w-2xl w-full mx-4 bg-white rounded-2xl overflow-hidden shadow-dark-top" onClick={(e) => e.stopPropagation()}>
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-3 right-3 z-10 bg-white/80 backdrop-blur-sm h-8 w-8"
              onClick={() => setLightboxItem(null)}
            >
              <X className="size-4" />
            </Button>
            <img
              src={lightboxItem.fileUrl}
              alt="Content preview"
              className="w-full max-h-[60vh] object-contain bg-[var(--neutral-100)]"
            />
            <div className="p-5">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline" className="border-[var(--neutral-200)] text-xs capitalize">
                  {lightboxItem.platform} {lightboxItem.contentType}
                </Badge>
                <span className="text-xs text-[var(--neutral-400)]">{formatDate(lightboxItem.submittedAt)}</span>
              </div>
              <p className="text-sm text-[var(--neutral-700)]">{lightboxItem.caption}</p>
              <div className="mt-3 flex gap-2">
                <Button size="sm" className="gap-1.5 bg-[var(--brand-700)] hover:bg-[var(--brand-800)]">
                  <Download className="size-3.5" /> Download
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CampaignDetail() {
  const { id } = useParams();
  const campaign = MOCK_CAMPAIGNS.find((c) => c.id === id);
  const [expandedCreator, setExpandedCreator] = useState<string | null>(null);

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

  const modeLabels: Record<string, string> = {
    open: "Open",
    targeted: "Targeted",
    debut: "Debut Collab",
  };

  // Metric color coding
  const acceptedCount = campaign.creators.filter(
    (c) => ["accepted", "product_shipped", "gift_card_sent", "content_submitted", "content_approved", "posted", "complete"].includes(c.status)
  ).length;
  const contentCount = campaign.creators.flatMap((c) => c.contentSubmissions).length;
  const postedCount = campaign.creators.filter((c) => c.status === "posted" || c.status === "complete").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Button
          variant="ghost"
          size="sm"
          asChild
          className="mb-3 gap-1 text-[var(--neutral-500)] hover:text-[var(--neutral-800)] -ml-2"
        >
          <Link to="/campaigns">
            <ArrowLeft className="size-3.5" /> All Campaigns
          </Link>
        </Button>
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-[var(--neutral-800)]">
                {campaign.title}
              </h1>
              <Badge className={`border-0 text-xs font-medium ${campaignStatusStyle}`}>
                {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
              </Badge>
              <Badge
                variant="outline"
                className="border-[var(--neutral-200)] text-xs font-normal"
              >
                {modeLabels[campaign.mode || "open"]}
              </Badge>
            </div>
            <p className="mt-1 text-sm text-[var(--neutral-500)]">
              {formatDateRange(campaign.flightDateStart, campaign.flightDateEnd)} · {campaign.platforms.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(", ")}
            </p>
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

      {/* Metric cards with color coding */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="border-[var(--neutral-200)]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-[var(--neutral-800)]">{campaign.creators.length}</p>
                <p className="text-xs text-[var(--neutral-500)]">Total Creators</p>
              </div>
              <Users className="size-5 text-[var(--neutral-400)]" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-[var(--neutral-200)]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-2xl font-bold ${acceptedCount > 0 ? "text-[var(--green-500)]" : "text-[var(--neutral-800)]"}`}>{acceptedCount}</p>
                <p className="text-xs text-[var(--neutral-500)]">Accepted</p>
              </div>
              <Check className="size-5 text-[var(--green-400)]" />
            </div>
          </CardContent>
        </Card>
        <Card className={`border-[var(--neutral-200)] ${contentCount > 0 ? "border-[var(--brand-300)]" : ""}`}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-2xl font-bold ${contentCount > 0 ? "text-[var(--brand-700)]" : "text-[var(--neutral-800)]"}`}>{contentCount}</p>
                <p className="text-xs text-[var(--neutral-500)]">Content Submitted</p>
              </div>
              <ImageIcon className="size-5 text-[var(--brand-400)]" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-[var(--neutral-200)]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-2xl font-bold ${postedCount > 0 ? "text-[var(--green-500)]" : "text-[var(--neutral-400)]"}`}>{postedCount}</p>
                <p className="text-xs text-[var(--neutral-500)]">Posted</p>
              </div>
              <TrendingUp className="size-5 text-[var(--neutral-400)]" />
            </div>
            {postedCount === 0 && campaign.creators.length > 0 && (
              <p className="mt-1 text-[10px] text-[var(--orange-500)]">Waiting for creators to post</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="creators" className="space-y-6">
        <TabsList className="bg-[var(--neutral-100)] p-1">
          <TabsTrigger value="overview" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
            Overview
          </TabsTrigger>
          <TabsTrigger value="creators" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
            Creators ({campaign.creators.length})
          </TabsTrigger>
          <TabsTrigger value="content" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
            Content Gallery ({contentCount})
          </TabsTrigger>
        </TabsList>

        {/* Overview tab */}
        <TabsContent value="overview" className="space-y-6">
          <Card className="border-[var(--neutral-200)] shadow-light-top">
            <CardHeader>
              <CardTitle className="text-base text-[var(--neutral-800)]">Campaign Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                <div>
                  <p className="text-[var(--neutral-500)] text-xs uppercase tracking-wider mb-1">Goal</p>
                  <p className="font-medium text-[var(--neutral-800)]">
                    {campaign.goal ? goalLabels[campaign.goal] : "—"}
                  </p>
                </div>
                <div>
                  <p className="text-[var(--neutral-500)] text-xs uppercase tracking-wider mb-1">Platforms</p>
                  <div className="flex gap-1.5">
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
                  <p className="text-[var(--neutral-500)] text-xs uppercase tracking-wider mb-1">Flight Dates</p>
                  <p className="font-medium text-[var(--neutral-800)]">
                    {formatDateRange(campaign.flightDateStart, campaign.flightDateEnd)}
                  </p>
                </div>
                <div>
                  <p className="text-[var(--neutral-500)] text-xs uppercase tracking-wider mb-1">Content Rights</p>
                  <p className="font-medium text-[var(--neutral-800)]">
                    {campaign.ugcRights
                      ? `Repost & reuse — ${campaign.ugcRightsDuration === "perpetual" ? "Perpetual" : campaign.ugcRightsDuration?.replace("_", " ") || "90 days"}`
                      : "No UGC rights"}
                    {campaign.ugcExclusivity && ` · ${campaign.ugcExclusivityDays || 30}-day exclusivity`}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-[var(--neutral-500)] text-xs uppercase tracking-wider mb-1">Description</p>
                <p className="text-[var(--neutral-800)] leading-relaxed">{campaign.description}</p>
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
                  <div className="flex items-center gap-3">
                    <Sparkles className="size-5 text-[var(--brand-700)]" />
                    <div>
                      <p className="text-sm font-bold text-[var(--neutral-800)]">
                        Recommended Creators
                      </p>
                      <p className="text-xs text-[var(--neutral-500)]">
                        Benable has surfaced matches based on your campaign criteria. Click any creator to see full profile, engagement data, and audience demographics.
                      </p>
                    </div>
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
            {campaign.creators.map((creator) => (
              <CreatorCard
                key={creator.creatorId}
                creator={creator}
                campaign={campaign}
                expanded={expandedCreator === creator.creatorId}
                onToggle={() =>
                  setExpandedCreator(
                    expandedCreator === creator.creatorId ? null : creator.creatorId
                  )
                }
              />
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
