import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  ArrowRight,
  Sparkles,
  ChevronDown,
  Megaphone,
  Eye,
  TrendingUp,
} from "lucide-react";
import { Campaign, CreatorAssignment, MOCK_CAMPAIGNS } from "@/store/campaign-store";

/* ------------------------------------------------------------------ */
/*  Mock recent-activity data                                         */
/* ------------------------------------------------------------------ */
interface ActivityItem {
  id: string;
  emoji: string;
  emojiBg: string;
  title: string;
  description: string;
  timestamp: string;
  link: string;
  actionLabel?: string;
}

const MOCK_ACTIVITY: ActivityItem[] = [
  {
    id: "a1",
    emoji: "✨",
    emojiBg: "var(--brand-100)",
    title: "New creator matches found",
    description: "5 creators match your Melted Balm Spring Launch campaign.",
    timestamp: "2h ago",
    link: "/campaigns/camp-001",
    actionLabel: "Review",
  },
  {
    id: "a2",
    emoji: "📸",
    emojiBg: "var(--blue-100)",
    title: "Content ready for review",
    description: "@chelseaglow submitted an Instagram Reel.",
    timestamp: "5h ago",
    link: "/campaigns/camp-001",
    actionLabel: "Review",
  },
  {
    id: "a3",
    emoji: "🚀",
    emojiBg: "var(--green-100)",
    title: "Campaign is live!",
    description: "Rare Beauty Launch at Ulta Beauty is now visible to creators.",
    timestamp: "1d ago",
    link: "/campaigns/camp-002",
  },
  {
    id: "a4",
    emoji: "📋",
    emojiBg: "var(--orange-100)",
    title: "Content submitted",
    description: "@amarabeautyco submitted a TikTok Video for approval.",
    timestamp: "2d ago",
    link: "/campaigns/camp-002",
    actionLabel: "Review",
  },
  {
    id: "a5",
    emoji: "👋",
    emojiBg: "var(--brand-100)",
    title: "Creator accepted invite",
    description: "Jessica Morales accepted your Melted Balm Spring Launch invite.",
    timestamp: "3d ago",
    link: "/campaigns/camp-001",
  },
  {
    id: "a6",
    emoji: "💬",
    emojiBg: "var(--blue-100)",
    title: "New message",
    description: "Taylor Kim sent you a message about the Rare Beauty campaign.",
    timestamp: "3d ago",
    link: "/messages",
  },
];

/* ------------------------------------------------------------------ */
/*  Helpers                                                           */
/* ------------------------------------------------------------------ */
function deriveCampaignDisplayStatus(campaign: Campaign): {
  label: string;
  bg: string;
  color: string;
  border: string;
  dot: string;
  actionLabel?: string;
  actionLink?: string;
} {
  const creators = campaign.creators;
  const hasSubmitted = creators.some((c) => ["content_submitted", "content_approved"].includes(c.status));
  const hasAccepted = creators.some((c) => ["accepted", "product_shipped", "gift_card_sent", "content_submitted", "content_approved", "posted", "complete"].includes(c.status));
  const allComplete = creators.length > 0 && creators.every((c) => c.status === "complete" || c.status === "posted");

  if (campaign.status === "completed" || allComplete) {
    return { label: "Finished", bg: "var(--green-100)", color: "var(--green-700)", border: "var(--green-300)", dot: "var(--green-500)" };
  }
  if (hasSubmitted) {
    return { label: "In Review", bg: "var(--orange-100)", color: "var(--orange-700)", border: "var(--orange-300)", dot: "var(--orange-500)" };
  }
  if (hasAccepted) {
    return { label: "In Creation", bg: "var(--brand-100)", color: "var(--brand-700)", border: "var(--brand-200)", dot: "var(--brand-600)" };
  }
  if (campaign.status === "filled" || (creators.length > 0 && creators.some((c) => c.status === "recommended"))) {
    return {
      label: "Pending Creators",
      bg: "var(--orange-100)",
      color: "var(--orange-700)",
      border: "var(--orange-300)",
      dot: "var(--orange-500)",
      actionLabel: "Select Creators",
      actionLink: `/campaigns/${campaign.id}/find-talent`,
    };
  }
  if (creators.length > 0 && creators.some((c) => c.status === "invited")) {
    return { label: "Recruiting", bg: "var(--blue-100)", color: "var(--blue-700)", border: "var(--blue-300)", dot: "var(--blue-500)" };
  }
  if (campaign.status === "draft") {
    return { label: "Created", bg: "var(--neutral-100)", color: "var(--neutral-600)", border: "var(--neutral-300)", dot: "var(--neutral-400)" };
  }
  return { label: "Active", bg: "var(--green-100)", color: "var(--green-700)", border: "var(--green-300)", dot: "var(--green-500)" };
}

function getDeliveredCount(campaign: Campaign): { delivered: number; total: number } {
  const total = campaign.creators.length;
  const delivered = campaign.creators.filter((c) =>
    ["content_submitted", "content_approved", "posted", "complete"].includes(c.status)
  ).length;
  return { delivered, total };
}

/* ------------------------------------------------------------------ */
/*  Stacked avatar component                                          */
/* ------------------------------------------------------------------ */
function CreatorAvatarStack({ creators }: { creators: CreatorAssignment[] }) {
  const shown = creators.slice(0, 4);
  const extra = creators.length - shown.length;

  return (
    <div className="flex items-center">
      {shown.map((c, i) => (
        <img
          key={c.creatorId}
          src={c.creatorAvatar}
          alt={c.creatorName}
          title={c.creatorName}
          className="h-7 w-7 rounded-full border-2 border-white object-cover"
          style={{ marginLeft: i === 0 ? 0 : -6, zIndex: shown.length - i }}
        />
      ))}
      {extra > 0 && (
        <div
          className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-[var(--neutral-200)] text-[10px] font-medium text-[var(--neutral-600)]"
          style={{ marginLeft: -6, zIndex: 0 }}
        >
          +{extra}
        </div>
      )}
    </div>
  );
}

/* ================================================================== */
/*  Dashboard                                                         */
/* ================================================================== */
export default function Dashboard() {
  const activeCampaigns = MOCK_CAMPAIGNS.filter((c) => c.status === "active");
  const [activityCount, setActivityCount] = useState(4);
  const visibleActivity = MOCK_ACTIVITY.slice(0, activityCount);

  return (
    <div className="space-y-8">
      {/* ---------------------------------------------------------- */}
      {/*  Hero CTA — gradient with decorative blobs                 */}
      {/* ---------------------------------------------------------- */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-hero p-8 border border-[var(--brand-200)]">
        {/* Decorative blobs */}
        <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-[var(--brand-300)] opacity-30 blur-3xl" />
        <div className="absolute -bottom-16 -left-16 h-44 w-44 rounded-full bg-[var(--pink-300)] opacity-20 blur-2xl" />
        <div className="absolute right-1/3 top-1/2 h-32 w-32 rounded-full bg-[var(--blue-300)] opacity-15 blur-2xl" />

        <div className="relative flex items-center justify-between">
          <div className="max-w-lg">
            <div className="mb-3 flex items-center gap-2">
              <Sparkles className="size-5 text-[var(--brand-700)]" />
              <span className="text-sm font-semibold text-[var(--brand-700)]">
                Ready to collaborate?
              </span>
            </div>
            <h1 className="text-[32px] font-bold leading-tight text-[var(--neutral-800)]">
              Launch a New Campaign
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-[var(--neutral-600)]">
              Find the right creators, send your brief, and start receiving
              authentic content for your brand.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <Button
              asChild
              size="lg"
              className="gap-2 rounded-xl bg-[var(--brand-700)] px-6 text-white hover:bg-[var(--brand-800)] transition-colors"
            >
              <Link to="/campaigns/create">
                <Plus className="size-5" />
                Create Campaign
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* ---------------------------------------------------------- */}
      {/*  Side-by-side: Active Campaigns + Recent Activity           */}
      {/* ---------------------------------------------------------- */}
      <div className="grid grid-cols-5 gap-6">
        {/* ── Active Campaigns (left, 3/5 width) ── */}
        <div className="col-span-3">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-lg font-bold text-[var(--neutral-800)]">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--orange-100)]">
                <Megaphone className="size-4 text-[var(--orange-500)]" />
              </span>
              Active Campaigns
            </h2>
            {activeCampaigns.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="gap-1 text-[var(--brand-700)] hover:text-[var(--brand-800)]"
              >
                <Link to="/campaigns">
                  View All <ArrowRight className="size-3.5" />
                </Link>
              </Button>
            )}
          </div>

          {activeCampaigns.length === 0 ? (
            <Card className="border-dashed border-[var(--neutral-300)]">
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--brand-100)] mb-3">
                  <Megaphone className="size-7 text-[var(--brand-700)]" />
                </div>
                <p className="font-medium text-[var(--neutral-600)]">
                  No active campaigns yet
                </p>
                <p className="mt-1 text-sm text-[var(--neutral-500)]">
                  Create your first campaign to start working with creators.
                </p>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-[var(--neutral-200)] overflow-hidden">
              {/* Table header */}
              <div className="grid grid-cols-12 gap-3 px-5 py-2.5 border-b border-[var(--neutral-100)] bg-[var(--neutral-50)]">
                <div className="col-span-4 text-[11px] font-semibold text-[var(--neutral-500)] uppercase tracking-wider">Campaign</div>
                <div className="col-span-2 text-[11px] font-semibold text-[var(--neutral-500)] uppercase tracking-wider">Creators</div>
                <div className="col-span-2 text-[11px] font-semibold text-[var(--neutral-500)] uppercase tracking-wider">Delivered</div>
                <div className="col-span-2 text-[11px] font-semibold text-[var(--neutral-500)] uppercase tracking-wider">Timeline</div>
                <div className="col-span-2 text-[11px] font-semibold text-[var(--neutral-500)] uppercase tracking-wider">Status</div>
              </div>

              {/* Table rows */}
              <div className="divide-y divide-[var(--neutral-100)]">
                {activeCampaigns.map((campaign) => {
                  const status = deriveCampaignDisplayStatus(campaign);
                  const { delivered, total } = getDeliveredCount(campaign);

                  return (
                    <Link
                      key={campaign.id}
                      to={`/campaigns/${campaign.id}/find-talent`}
                      className="grid grid-cols-12 gap-3 px-5 py-3.5 items-center transition-colors hover:bg-[var(--neutral-50)]"
                    >
                      {/* Campaign name */}
                      <div className="col-span-4 flex items-center gap-3">
                        <div
                          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-white text-xs font-bold"
                          style={{ backgroundColor: "var(--brand-600)" }}
                        >
                          {campaign.title.charAt(0)}
                        </div>
                        <p className="text-sm font-semibold text-[var(--neutral-800)] truncate">{campaign.title}</p>
                      </div>

                      {/* Creator avatars */}
                      <div className="col-span-2">
                        {campaign.creators.length > 0 ? (
                          <CreatorAvatarStack creators={campaign.creators} />
                        ) : (
                          <span className="text-xs text-[var(--neutral-400)]">—</span>
                        )}
                      </div>

                      {/* Delivered */}
                      <div className="col-span-2">
                        {total > 0 ? (
                          <span className="text-sm font-medium text-[var(--neutral-800)]">
                            {delivered}/{total}
                          </span>
                        ) : (
                          <span className="text-xs text-[var(--neutral-400)]">—</span>
                        )}
                      </div>

                      {/* Timeline */}
                      <div className="col-span-2">
                        <span className="text-xs text-[var(--neutral-600)]">
                          {campaign.flightDateStart
                            ? new Date(campaign.flightDateStart).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                            : "—"}{" "}
                          –{" "}
                          {campaign.flightDateEnd
                            ? new Date(campaign.flightDateEnd).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                            : ""}
                        </span>
                      </div>

                      {/* Status + Action */}
                      <div className="col-span-2 flex items-center gap-2">
                        <Badge
                          className="shrink-0 border text-[10px] font-semibold gap-1"
                          style={{
                            backgroundColor: status.bg,
                            color: status.color,
                            borderColor: status.border,
                          }}
                        >
                          <span className="size-1.5 rounded-full" style={{ backgroundColor: status.dot }} />
                          {status.label}
                        </Badge>
                        {status.actionLabel && (
                          <Button
                            size="sm"
                            className="h-6 text-[10px] gap-1 bg-[var(--brand-700)] hover:bg-[var(--brand-800)] text-white px-2"
                            onClick={(e) => e.stopPropagation()}
                            asChild
                          >
                            <Link to={status.actionLink || "#"}>
                              <ArrowRight className="size-3" />
                              {status.actionLabel}
                            </Link>
                          </Button>
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </Card>
          )}
        </div>

        {/* ── Recent Activity (right, 2/5 width) ── */}
        <div className="col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-lg font-bold text-[var(--neutral-800)]">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--blue-100)]">
                <TrendingUp className="size-4 text-[var(--blue-500)]" />
              </span>
              Recent Activity
            </h2>
          </div>

          <Card className="border-[var(--neutral-200)]">
            <div className="divide-y divide-[var(--neutral-100)]">
              {visibleActivity.map((item) => (
                <Link
                  key={item.id}
                  to={item.link}
                  className="flex items-start gap-3 px-4 py-3.5 transition-colors hover:bg-[var(--neutral-50)]"
                >
                  <div
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-base"
                    style={{ backgroundColor: item.emojiBg }}
                  >
                    {item.emoji}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-medium text-[var(--neutral-800)] leading-snug">
                        {item.title}
                      </p>
                      <span className="shrink-0 text-[11px] text-[var(--neutral-400)]">
                        {item.timestamp}
                      </span>
                    </div>
                    <p className="mt-0.5 text-xs text-[var(--neutral-500)] leading-relaxed">
                      {item.description}
                    </p>
                    {item.actionLabel && (
                      <span className="mt-1.5 inline-flex items-center gap-1 rounded-lg bg-[var(--brand-700)] px-3 py-1 text-[11px] font-semibold text-white shadow-sm">
                        <Eye className="size-3" />
                        {item.actionLabel}
                      </span>
                    )}
                  </div>
                </Link>
              ))}
            </div>

            {activityCount < MOCK_ACTIVITY.length && (
              <div className="border-t border-[var(--neutral-100)] px-4 py-3 text-center">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setActivityCount((c) => Math.min(c + 4, MOCK_ACTIVITY.length));
                  }}
                  className="inline-flex items-center gap-1 text-sm font-medium text-[var(--brand-700)] hover:text-[var(--brand-800)]"
                >
                  <ChevronDown className="size-3.5" />
                  Load more activity
                </button>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
