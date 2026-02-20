import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, ArrowRight, Megaphone } from "lucide-react";
import { Campaign, CreatorAssignment, MOCK_CAMPAIGNS } from "@/store/campaign-store";

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

export default function CampaignsList() {
  const campaigns = MOCK_CAMPAIGNS;

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
            {campaigns.map((campaign) => {
              const status = deriveCampaignDisplayStatus(campaign);
              const { delivered, total } = getDeliveredCount(campaign);

              return (
                <Link
                  key={campaign.id}
                  to={`/campaigns/${campaign.id}/find-talent`}
                  className="grid grid-cols-12 gap-3 px-5 py-3.5 items-center transition-colors hover:bg-[var(--neutral-50)]"
                >
                  <div className="col-span-4 flex items-center gap-3">
                    <div
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-white text-xs font-bold"
                      style={{ backgroundColor: "var(--brand-600)" }}
                    >
                      {campaign.title.charAt(0)}
                    </div>
                    <p className="text-sm font-semibold text-[var(--neutral-800)] truncate">{campaign.title}</p>
                  </div>

                  <div className="col-span-2">
                    {campaign.creators.length > 0 ? (
                      <CreatorAvatarStack creators={campaign.creators} />
                    ) : (
                      <span className="text-xs text-[var(--neutral-400)]">—</span>
                    )}
                  </div>

                  <div className="col-span-2">
                    {total > 0 ? (
                      <span className="text-sm font-medium text-[var(--neutral-800)]">
                        {delivered}/{total}
                      </span>
                    ) : (
                      <span className="text-xs text-[var(--neutral-400)]">—</span>
                    )}
                  </div>

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
  );
}
