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
function campaignStatusBadge(status: Campaign["status"]) {
  switch (status) {
    case "active":
      return { label: "Live", bg: "var(--green-100)", color: "var(--green-700)", border: "var(--green-300)" };
    case "draft":
      return { label: "Planning", bg: "var(--blue-100)", color: "var(--blue-700)", border: "var(--blue-300)" };
    case "filled":
      return { label: "Filled", bg: "var(--orange-100)", color: "var(--orange-700)", border: "var(--orange-300)" };
    default:
      return { label: "Completed", bg: "var(--neutral-100)", color: "var(--neutral-600)", border: "var(--neutral-300)" };
  }
}

function deriveCampaignProgress(creators: CreatorAssignment[]): number {
  if (creators.length === 0) return 10;
  const statuses = creators.map((c) => c.status);
  const allComplete = statuses.every((s) => s === "complete");
  if (allComplete) return 100;
  const hasContent = statuses.some((s) =>
    ["content_submitted", "content_approved", "posted", "complete"].includes(s)
  );
  if (hasContent) return 70;
  const hasShipped = statuses.some((s) =>
    ["product_shipped", "gift_card_sent"].includes(s)
  );
  if (hasShipped) return 50;
  const hasAccepted = statuses.some((s) => s === "accepted");
  if (hasAccepted) return 35;
  return 15;
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
      {/*  Hero CTA — Launch a New Campaign                          */}
      {/* ---------------------------------------------------------- */}
      <div className="relative overflow-hidden rounded-2xl border border-[var(--brand-300)] bg-[var(--brand-0)] p-8">
        <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[var(--brand-200)] opacity-60 blur-2xl" />
        <div className="absolute -bottom-10 -left-10 h-36 w-36 rounded-full bg-[var(--brand-200)] opacity-40 blur-xl" />

        <div className="relative flex items-center justify-between">
          <div className="max-w-md">
            <div className="mb-2 flex items-center gap-2">
              <Sparkles className="size-5 text-[var(--brand-700)]" />
              <span className="text-sm font-medium text-[var(--brand-700)]">
                Ready to collaborate?
              </span>
            </div>
            <h1 className="text-[28px] font-bold leading-tight text-[var(--neutral-800)]">
              Launch a New Campaign
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-[var(--neutral-600)]">
              Find the right creators, send your brief, and start receiving
              authentic content for your brand.
            </p>
          </div>

          <Button
            asChild
            size="lg"
            className="gap-2 rounded-xl bg-[var(--brand-700)] px-6 text-white shadow-lg hover:bg-[var(--brand-800)]"
          >
            <Link to="/campaigns/create">
              <Plus className="size-5" />
              Create Campaign
            </Link>
          </Button>
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
              <span className="text-xl">📢</span> Active Campaigns
            </h2>
            {activeCampaigns.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="gap-1 text-[var(--brand-700)]"
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
                <p className="font-medium text-[var(--neutral-600)]">
                  No active campaigns yet
                </p>
                <p className="mt-1 text-sm text-[var(--neutral-500)]">
                  Create your first campaign to start working with creators.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {activeCampaigns.map((campaign) => {
                const statusBadge = campaignStatusBadge(campaign.status);
                const progress = deriveCampaignProgress(campaign.creators);

                return (
                  <Link
                    key={campaign.id}
                    to={`/campaigns/${campaign.id}`}
                    className="block"
                  >
                    <Card className="border-[var(--neutral-200)] transition-all hover:border-[var(--brand-400)] hover:shadow-medium-top">
                      <CardContent className="p-5">
                        {/* Title row with status badge */}
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-2.5">
                            <Badge
                              className="shrink-0 border text-[11px] font-semibold uppercase tracking-wide"
                              style={{
                                backgroundColor: statusBadge.bg,
                                color: statusBadge.color,
                                borderColor: statusBadge.border,
                              }}
                            >
                              {statusBadge.label}
                            </Badge>
                            <p className="font-semibold text-[var(--neutral-800)]">
                              {campaign.title}
                            </p>
                          </div>
                          <ArrowRight className="mt-0.5 size-4 shrink-0 text-[var(--neutral-400)]" />
                        </div>

                        {/* Progress bar — all same brand purple */}
                        <div className="mt-4">
                          <div className="h-1.5 w-full overflow-hidden rounded-full bg-[var(--neutral-200)]">
                            <div
                              className="h-full rounded-full bg-[var(--brand-700)] transition-all"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                        </div>

                        {/* Bottom row — creators + dates */}
                        <div className="mt-4 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <CreatorAvatarStack creators={campaign.creators} />
                            <span className="text-xs text-[var(--neutral-500)]">
                              {campaign.creators.length} creator{campaign.creators.length !== 1 ? "s" : ""}
                            </span>
                          </div>

                          <div className="flex items-center gap-4 text-xs text-[var(--neutral-500)]">
                            {campaign.budgetAllocated > 0 && (
                              <span>
                                Budget: ${campaign.budgetAllocated.toLocaleString()}
                              </span>
                            )}
                            <span>
                              {campaign.flightDateStart
                                ? new Date(campaign.flightDateStart).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                  })
                                : ""}{" "}
                              –{" "}
                              {campaign.flightDateEnd
                                ? new Date(campaign.flightDateEnd).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                  })
                                : ""}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* ── Recent Activity (right, 2/5 width) ── */}
        <div className="col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-lg font-bold text-[var(--neutral-800)]">
              <span className="text-xl">🔔</span> Recent Activity
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
                  {/* Emoji circle */}
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
                      <span className="mt-1.5 inline-block rounded-md bg-[var(--brand-100)] px-2.5 py-1 text-[11px] font-semibold text-[var(--brand-700)]">
                        {item.actionLabel}
                      </span>
                    )}
                  </div>
                </Link>
              ))}
            </div>

            {/* Load more activity */}
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
