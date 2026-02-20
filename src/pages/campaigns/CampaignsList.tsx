import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, ArrowRight, Megaphone, Users, ImageIcon, TrendingUp, Sparkles } from "lucide-react";
import { MOCK_CAMPAIGNS } from "@/store/campaign-store";
import type { CampaignStatus } from "@/store/campaign-store";
import { formatDateRange } from "@/lib/format";

const statusStyles: Record<CampaignStatus, { label: string; color: string; bg: string; border: string; dot: string }> = {
  draft: { label: "Draft", color: "var(--neutral-600)", bg: "var(--neutral-100)", border: "var(--neutral-300)", dot: "var(--neutral-400)" },
  active: { label: "Active", color: "var(--green-700)", bg: "var(--green-100)", border: "var(--green-300)", dot: "var(--green-500)" },
  filled: { label: "Filled", color: "var(--orange-700)", bg: "var(--orange-100)", border: "var(--orange-300)", dot: "var(--orange-500)" },
  completed: { label: "Completed", color: "var(--blue-700)", bg: "var(--blue-100)", border: "var(--blue-300)", dot: "var(--blue-500)" },
};

const campaignGradients = [
  { from: "var(--brand-600)", to: "var(--brand-400)" },
  { from: "var(--pink-500)", to: "var(--orange-500)" },
  { from: "var(--blue-500)", to: "var(--brand-500)" },
  { from: "var(--green-500)", to: "var(--blue-500)" },
];

export default function CampaignsList() {
  const campaigns = MOCK_CAMPAIGNS;

  return (
    <div className="space-y-6">
      {/* Header with gradient accent */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--orange-100)]">
            <Megaphone className="size-6 text-[var(--orange-500)]" />
          </div>
          <div>
            <h1 className="text-[28px] font-bold text-[var(--neutral-800)]">Campaigns</h1>
            <p className="text-sm text-[var(--neutral-500)]">
              Manage all your creator collaboration campaigns.
            </p>
          </div>
        </div>
        <Button asChild className="gap-2 rounded-xl bg-gradient-brand shadow-brand-glow hover:opacity-90 transition-opacity">
          <Link to="/campaigns/create">
            <Plus className="size-4" /> Create Campaign
          </Link>
        </Button>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Total", value: campaigns.length, icon: Megaphone, color: "var(--brand-600)", bg: "var(--brand-100)" },
          { label: "Active", value: campaigns.filter(c => c.status === "active").length, icon: TrendingUp, color: "var(--green-600)", bg: "var(--green-100)" },
          { label: "Creators", value: campaigns.reduce((sum, c) => sum + c.creators.length, 0), icon: Users, color: "var(--pink-500)", bg: "var(--pink-100)" },
          { label: "Content", value: campaigns.reduce((sum, c) => sum + c.creators.reduce((s2, cr) => s2 + cr.contentSubmissions.length, 0), 0), icon: ImageIcon, color: "var(--blue-500)", bg: "var(--blue-100)" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="flex items-center gap-3 rounded-xl border border-[var(--neutral-200)] bg-white p-3"
          >
            <div
              className="flex h-9 w-9 items-center justify-center rounded-lg"
              style={{ backgroundColor: stat.bg }}
            >
              <stat.icon className="size-4" style={{ color: stat.color }} />
            </div>
            <div>
              <p className="text-lg font-bold text-[var(--neutral-800)]">{stat.value}</p>
              <p className="text-[11px] text-[var(--neutral-500)]">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        {campaigns.map((campaign, idx) => {
          const statusConfig = statusStyles[campaign.status];
          const gradient = campaignGradients[idx % campaignGradients.length];
          const budgetPercent =
            campaign.budgetType === "spend_cap" && campaign.budgetCapAmount
              ? Math.round((campaign.budgetAllocated / campaign.budgetCapAmount) * 100)
              : campaign.budgetType === "product_inventory" && campaign.budgetInventoryCount
                ? Math.round((campaign.budgetAllocated / campaign.budgetInventoryCount) * 100)
                : 0;

          const budgetLabel =
            campaign.budgetType === "spend_cap"
              ? `$${campaign.budgetAllocated.toLocaleString()} / $${campaign.budgetCapAmount?.toLocaleString()}`
              : campaign.budgetType === "product_inventory"
                ? `${campaign.budgetAllocated} / ${campaign.budgetInventoryCount} units`
                : "Flexible";

          return (
            <Card
              key={campaign.id}
              className="border-[var(--neutral-200)] transition-all hover:border-[var(--brand-400)] hover:shadow-medium-top overflow-hidden"
            >
              {/* Top gradient accent bar */}
              <div
                className="h-1"
                style={{ background: `linear-gradient(90deg, ${gradient.from}, ${gradient.to})` }}
              />
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="text-base font-bold text-[var(--neutral-800)]">
                        {campaign.title}
                      </h3>
                      <Badge
                        className="border text-xs font-semibold gap-1"
                        style={{
                          backgroundColor: statusConfig.bg,
                          color: statusConfig.color,
                          borderColor: statusConfig.border,
                        }}
                      >
                        <span className="size-1.5 rounded-full" style={{ backgroundColor: statusConfig.dot }} />
                        {statusConfig.label}
                      </Badge>
                      <Badge
                        variant="outline"
                        className="border-[var(--neutral-200)] text-xs font-normal text-[var(--neutral-600)]"
                      >
                        {campaign.mode === "open" ? "Open" : "Targeted"}
                      </Badge>
                    </div>

                    <div className="mt-3 flex items-center gap-5 text-sm text-[var(--neutral-600)]">
                      <span className="flex items-center gap-1.5">
                        <Users className="size-3.5 text-[var(--pink-500)]" />
                        {campaign.creators.length} creators
                      </span>
                      <span>
                        {formatDateRange(campaign.flightDateStart, campaign.flightDateEnd)}
                      </span>
                      <span className="flex items-center gap-1.5">
                        {campaign.platforms.map((p) => (
                          <Badge
                            key={p}
                            variant="outline"
                            className="border-[var(--neutral-200)] text-[10px] font-normal capitalize"
                          >
                            {p}
                          </Badge>
                        ))}
                      </span>
                    </div>

                    {/* Budget bar — gradient style */}
                    {campaign.budgetType !== "flexible" && (
                      <div className="mt-4 max-w-md">
                        <div className="mb-1 flex items-center justify-between text-xs">
                          <span className="text-[var(--neutral-500)]">Budget</span>
                          <span className="font-medium text-[var(--neutral-800)]">
                            {budgetLabel} ({budgetPercent}%)
                          </span>
                        </div>
                        <div className="h-2 w-full overflow-hidden rounded-full bg-[var(--neutral-200)]">
                          <div
                            className="h-full rounded-full transition-all"
                            style={{
                              width: `${budgetPercent}%`,
                              background: `linear-gradient(90deg, ${gradient.from}, ${gradient.to})`,
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="gap-1 rounded-lg border-[var(--brand-300)] text-[var(--brand-700)] hover:bg-[var(--brand-100)]"
                  >
                    <Link to={`/campaigns/${campaign.id}`}>
                      View Details <ArrowRight className="size-3.5" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {campaigns.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--brand-300)] bg-gradient-hero py-20">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-brand shadow-brand-glow mb-4">
            <Sparkles className="size-8 text-white" />
          </div>
          <h3 className="text-base font-bold text-[var(--neutral-800)]">No campaigns yet</h3>
          <p className="mt-1 text-sm text-[var(--neutral-500)]">
            Create your first campaign to start working with creators.
          </p>
          <Button asChild className="mt-4 gap-2 rounded-xl bg-gradient-brand shadow-brand-glow hover:opacity-90">
            <Link to="/campaigns/create">
              <Plus className="size-4" /> Create Campaign
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}
