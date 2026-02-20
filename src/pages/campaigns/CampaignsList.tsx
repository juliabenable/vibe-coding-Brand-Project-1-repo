import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, ArrowRight, Megaphone } from "lucide-react";
import { Campaign, CreatorAssignment, MOCK_CAMPAIGNS } from "@/store/campaign-store";

/* ------------------------------------------------------------------ */
/*  Helpers (same as Dashboard)                                        */
/* ------------------------------------------------------------------ */
function campaignStatusBadge(status: Campaign["status"]) {
  switch (status) {
    case "active":
      return { label: "Live", bg: "var(--green-100)", color: "var(--green-700)", border: "var(--green-300)", dot: "var(--green-500)" };
    case "draft":
      return { label: "Planning", bg: "var(--blue-100)", color: "var(--blue-700)", border: "var(--blue-300)", dot: "var(--blue-500)" };
    case "filled":
      return { label: "Filled", bg: "var(--orange-100)", color: "var(--orange-700)", border: "var(--orange-300)", dot: "var(--orange-500)" };
    default:
      return { label: "Completed", bg: "var(--neutral-100)", color: "var(--neutral-600)", border: "var(--neutral-300)", dot: "var(--neutral-400)" };
  }
}

function deriveCampaignProgress(creators: CreatorAssignment[]): number {
  if (creators.length === 0) return 10;
  const statuses = creators.map((c) => c.status);
  if (statuses.every((s) => s === "complete")) return 100;
  if (statuses.some((s) => ["content_submitted", "content_approved", "posted", "complete"].includes(s))) return 70;
  if (statuses.some((s) => ["product_shipped", "gift_card_sent"].includes(s))) return 50;
  if (statuses.some((s) => s === "accepted")) return 35;
  return 15;
}

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
/*  CampaignsList                                                      */
/* ================================================================== */
export default function CampaignsList() {
  const campaigns = MOCK_CAMPAIGNS;

  const gradientColors = [
    { from: "var(--brand-600)", to: "var(--brand-400)" },
    { from: "var(--pink-500)", to: "var(--orange-500)" },
    { from: "var(--blue-500)", to: "var(--brand-500)" },
    { from: "var(--green-500)", to: "var(--blue-500)" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--orange-100)]">
            <Megaphone className="size-6 text-[var(--orange-500)]" />
          </div>
          <h1 className="text-[28px] font-bold text-[var(--neutral-800)]">Campaigns</h1>
        </div>
        <Button asChild className="gap-2 rounded-xl bg-[var(--brand-700)] hover:bg-[var(--brand-800)] text-white">
          <Link to="/campaigns/create">
            <Plus className="size-4" /> Create Campaign
          </Link>
        </Button>
      </div>

      {/* Campaign cards — same style as Dashboard */}
      {campaigns.length === 0 ? (
        <Card className="border-dashed border-[var(--neutral-300)]">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--brand-100)] mb-3">
              <Megaphone className="size-7 text-[var(--brand-700)]" />
            </div>
            <p className="font-medium text-[var(--neutral-600)]">No campaigns yet</p>
            <p className="mt-1 text-sm text-[var(--neutral-500)]">
              Create your first campaign to start working with creators.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {campaigns.map((campaign, idx) => {
            const statusBadge = campaignStatusBadge(campaign.status);
            const progress = deriveCampaignProgress(campaign.creators);
            const gradient = gradientColors[idx % gradientColors.length];

            return (
              <Link
                key={campaign.id}
                to={`/campaigns/${campaign.id}/find-talent`}
                className="block"
              >
                <Card className="border-[var(--neutral-200)] transition-all hover:border-[var(--brand-400)] hover:shadow-medium-top overflow-hidden">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <Badge
                          className="shrink-0 border text-[11px] font-semibold uppercase tracking-wide gap-1"
                          style={{
                            backgroundColor: statusBadge.bg,
                            color: statusBadge.color,
                            borderColor: statusBadge.border,
                          }}
                        >
                          <span className="size-1.5 rounded-full" style={{ backgroundColor: statusBadge.dot }} />
                          {statusBadge.label}
                        </Badge>
                        <p className="font-semibold text-[var(--neutral-800)]">{campaign.title}</p>
                      </div>
                      <ArrowRight className="mt-0.5 size-4 shrink-0 text-[var(--neutral-400)]" />
                    </div>

                    <div className="mt-4">
                      <div className="h-2 w-full overflow-hidden rounded-full bg-[var(--neutral-200)]">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${progress}%`,
                            background: `linear-gradient(90deg, ${gradient.from}, ${gradient.to})`,
                          }}
                        />
                      </div>
                      <div className="mt-1.5 flex items-center justify-between text-[11px] text-[var(--neutral-400)]">
                        <span>{progress}% complete</span>
                        <span>{campaign.creators.length} creator{campaign.creators.length !== 1 ? "s" : ""}</span>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                      <CreatorAvatarStack creators={campaign.creators} />
                      <div className="flex items-center gap-4 text-xs text-[var(--neutral-500)]">
                        {campaign.budgetAllocated > 0 && (
                          <span className="flex items-center gap-1">
                            <span className="font-medium">${campaign.budgetAllocated.toLocaleString()}</span>
                            budget
                          </span>
                        )}
                        <span>
                          {campaign.flightDateStart
                            ? new Date(campaign.flightDateStart).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                            : ""}{" "}
                          –{" "}
                          {campaign.flightDateEnd
                            ? new Date(campaign.flightDateEnd).toLocaleDateString("en-US", { month: "short", day: "numeric" })
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
  );
}
