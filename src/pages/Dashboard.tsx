import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Megaphone,
  ArrowRight,
  Sparkles,
  UserCheck,
  FileImage,
  Bell,
  Clock,
} from "lucide-react";
import { Campaign, CreatorAssignment, MOCK_CAMPAIGNS } from "@/store/campaign-store";

/* ------------------------------------------------------------------ */
/*  Mock recent-activity data                                         */
/* ------------------------------------------------------------------ */
interface ActivityItem {
  id: string;
  type: "creators_found" | "content_review" | "general";
  title: string;
  description: string;
  campaignTitle?: string;
  timestamp: string;
}

const MOCK_ACTIVITY: ActivityItem[] = [
  {
    id: "a1",
    type: "creators_found",
    title: "New creator matches found",
    description:
      "We found 5 creators that match your campaign criteria. Review and add them to your campaign.",
    campaignTitle: "Melted Balm Spring Launch",
    timestamp: "2 hours ago",
  },
  {
    id: "a2",
    type: "content_review",
    title: "Content ready for review",
    description:
      "@chelseaglow submitted an Instagram Reel for your approval.",
    campaignTitle: "Melted Balm Spring Launch",
    timestamp: "5 hours ago",
  },
  {
    id: "a3",
    type: "general",
    title: "Campaign going live",
    description:
      "Your Rare Beauty Launch at Ulta Beauty campaign has been published and is now visible to creators.",
    campaignTitle: "Rare Beauty Launch at Ulta Beauty",
    timestamp: "1 day ago",
  },
  {
    id: "a4",
    type: "content_review",
    title: "Content ready for review",
    description:
      "@amarabeautyco submitted a TikTok Video for your approval.",
    campaignTitle: "Rare Beauty Launch at Ulta Beauty",
    timestamp: "2 days ago",
  },
];

/* ------------------------------------------------------------------ */
/*  Helpers                                                           */
/* ------------------------------------------------------------------ */
function activityIcon(type: ActivityItem["type"]) {
  switch (type) {
    case "creators_found":
      return (
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--brand-100)]">
          <UserCheck className="size-4 text-[var(--brand-700)]" />
        </div>
      );
    case "content_review":
      return (
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--blue-100)]">
          <FileImage className="size-4 text-[var(--blue-700)]" />
        </div>
      );
    default:
      return (
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--orange-100)]">
          <Bell className="size-4 text-[var(--orange-700)]" />
        </div>
      );
  }
}

/* ------------------------------------------------------------------ */
/*  Campaign stage derivation                                         */
/* ------------------------------------------------------------------ */
interface CampaignStage {
  label: string;
  color: string; // tailwind-compatible bg + text classes via CSS vars
  bgColor: string;
  progress: number; // 0-100
}

function deriveCampaignStage(creators: CreatorAssignment[]): CampaignStage {
  if (creators.length === 0) {
    return { label: "Finding Creators", color: "var(--brand-700)", bgColor: "var(--brand-100)", progress: 10 };
  }

  const statuses = creators.map((c) => c.status);
  const hasContent = statuses.some((s) =>
    ["content_submitted", "content_approved", "posted", "complete"].includes(s)
  );
  const allComplete = statuses.every((s) => s === "complete");
  const hasAccepted = statuses.some((s) => s === "accepted");
  const hasShipped = statuses.some((s) =>
    ["product_shipped", "gift_card_sent"].includes(s)
  );

  if (allComplete) {
    return { label: "Completed", color: "var(--green-700)", bgColor: "var(--green-100)", progress: 100 };
  }
  if (hasContent) {
    return { label: "Content Review", color: "var(--blue-700)", bgColor: "var(--blue-100)", progress: 75 };
  }
  if (hasShipped) {
    return { label: "Product Shipped", color: "var(--orange-700)", bgColor: "var(--orange-100)", progress: 55 };
  }
  if (hasAccepted) {
    return { label: "Creators Onboarded", color: "var(--green-700)", bgColor: "var(--green-100)", progress: 40 };
  }
  return { label: "Recruiting Creators", color: "var(--brand-700)", bgColor: "var(--brand-100)", progress: 20 };
}

function modeLabel(mode: Campaign["mode"]) {
  switch (mode) {
    case "open":
      return "Open";
    case "targeted":
      return "Targeted";
    case "debut":
      return "Debut";
  }
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
          className="h-8 w-8 rounded-full border-2 border-white object-cover shadow-sm"
          style={{ marginLeft: i === 0 ? 0 : -8, zIndex: shown.length - i }}
        />
      ))}
      {extra > 0 && (
        <div
          className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-[var(--neutral-200)] text-[11px] font-medium text-[var(--neutral-600)]"
          style={{ marginLeft: -8, zIndex: 0 }}
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
      {/*  Recent Activity                                           */}
      {/* ---------------------------------------------------------- */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-[var(--neutral-800)]">
            Recent Activity
          </h2>
          <Button
            variant="ghost"
            size="sm"
            className="gap-1 text-[var(--brand-700)]"
          >
            View All <ArrowRight className="size-3.5" />
          </Button>
        </div>

        <Card className="divide-y divide-[var(--neutral-200)] border-[var(--neutral-200)]">
          {MOCK_ACTIVITY.map((item) => (
            <div
              key={item.id}
              className="flex items-start gap-3 px-5 py-4 transition-colors hover:bg-[var(--neutral-100)]/50"
            >
              {activityIcon(item.type)}

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-[var(--neutral-800)]">
                    {item.title}
                  </p>
                  {item.campaignTitle && (
                    <Badge
                      variant="outline"
                      className="border-[var(--brand-400)] bg-[var(--brand-100)] text-[var(--brand-700)] text-[11px] font-normal"
                    >
                      {item.campaignTitle}
                    </Badge>
                  )}
                </div>
                <p className="mt-0.5 text-xs leading-relaxed text-[var(--neutral-500)]">
                  {item.description}
                </p>
              </div>

              <span className="mt-0.5 flex shrink-0 items-center gap-1 text-[11px] text-[var(--neutral-400)]">
                <Clock className="size-3" />
                {item.timestamp}
              </span>
            </div>
          ))}
        </Card>
      </div>

      {/* ---------------------------------------------------------- */}
      {/*  Active Campaigns                                          */}
      {/* ---------------------------------------------------------- */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-[var(--neutral-800)]">
            Active Campaigns
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
              <Megaphone className="mb-3 size-8 text-[var(--neutral-400)]" />
              <p className="font-medium text-[var(--neutral-600)]">
                No active campaigns yet
              </p>
              <p className="mt-1 text-sm text-[var(--neutral-500)]">
                Create your first campaign to start working with creators.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {activeCampaigns.map((campaign) => {
              const stage = deriveCampaignStage(campaign.creators);

              return (
                <Link
                  key={campaign.id}
                  to={`/campaigns/${campaign.id}`}
                  className="block"
                >
                  <Card className="border-[var(--neutral-200)] transition-all hover:border-[var(--brand-400)] hover:shadow-medium-top">
                    <CardContent className="p-5">
                      {/* Top row — title + badges */}
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--brand-100)]">
                            <Megaphone className="size-5 text-[var(--brand-700)]" />
                          </div>
                          <div>
                            <p className="font-semibold text-[var(--neutral-800)]">
                              {campaign.title}
                            </p>
                            <div className="mt-1 flex items-center gap-2">
                              {/* Campaign type badge */}
                              <Badge
                                variant="outline"
                                className="border-[var(--brand-400)] bg-[var(--brand-100)] text-[var(--brand-700)] text-[11px] font-normal"
                              >
                                {modeLabel(campaign.mode)}
                              </Badge>
                              {/* Stage badge */}
                              <Badge
                                variant="outline"
                                className="text-[11px] font-normal"
                                style={{
                                  borderColor: stage.color,
                                  backgroundColor: stage.bgColor,
                                  color: stage.color,
                                }}
                              >
                                {stage.label}
                              </Badge>
                            </div>
                          </div>
                        </div>

                        <ArrowRight className="mt-1 size-4 shrink-0 text-[var(--neutral-400)]" />
                      </div>

                      {/* Progress bar */}
                      <div className="mt-4">
                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-[var(--neutral-200)]">
                          <div
                            className="h-full rounded-full transition-all"
                            style={{
                              width: `${stage.progress}%`,
                              backgroundColor: stage.color,
                            }}
                          />
                        </div>
                      </div>

                      {/* Bottom row — creators + stats */}
                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <CreatorAvatarStack creators={campaign.creators} />
                          <span className="text-xs text-[var(--neutral-500)]">
                            {campaign.creators.length} creator{campaign.creators.length !== 1 ? "s" : ""}
                          </span>
                        </div>

                        <div className="flex items-center gap-4 text-xs text-[var(--neutral-500)]">
                          {campaign.contentFormats.length > 0 && (
                            <span>
                              {campaign.contentFormats.length} content format{campaign.contentFormats.length !== 1 ? "s" : ""}
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
    </div>
  );
}
