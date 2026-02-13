import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Plus, ArrowRight } from "lucide-react";
import { MOCK_CAMPAIGNS } from "@/store/campaign-store";
import type { CampaignStatus } from "@/store/campaign-store";

const statusStyles: Record<CampaignStatus, { label: string; className: string }> = {
  draft: { label: "Draft", className: "bg-[var(--neutral-100)] text-[var(--neutral-600)]" },
  active: { label: "Active", className: "bg-[var(--green-100)] text-[var(--green-700)]" },
  filled: { label: "Filled", className: "bg-[var(--orange-100)] text-[var(--orange-700)]" },
  completed: { label: "Completed", className: "bg-[var(--blue-100)] text-[var(--blue-700)]" },
};

export default function CampaignsList() {
  const campaigns = MOCK_CAMPAIGNS;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[28px] font-bold text-[var(--neutral-800)]">Campaigns</h1>
          <p className="mt-1 text-sm text-[var(--neutral-600)]">
            Manage all your creator collaboration campaigns.
          </p>
        </div>
        <Button asChild className="gap-2 bg-[var(--brand-700)] hover:bg-[var(--brand-800)]">
          <Link to="/campaigns/create">
            <Plus className="size-4" /> Create Campaign
          </Link>
        </Button>
      </div>

      <div className="space-y-4">
        {campaigns.map((campaign) => {
          const statusConfig = statusStyles[campaign.status];
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
              className="shadow-light-top border-[var(--neutral-200)] transition-shadow hover:shadow-medium-top"
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="text-base font-bold text-[var(--neutral-800)]">
                        {campaign.title}
                      </h3>
                      <Badge className={`border-0 text-xs font-medium ${statusConfig.className}`}>
                        {statusConfig.label}
                      </Badge>
                      <Badge
                        variant="outline"
                        className="border-[var(--neutral-200)] text-xs font-normal text-[var(--neutral-600)]"
                      >
                        {campaign.mode === "open" ? "Open" : "Targeted"}
                      </Badge>
                    </div>

                    <div className="mt-3 flex items-center gap-6 text-sm text-[var(--neutral-600)]">
                      <span>{campaign.creators.length} creators</span>
                      <span>
                        {campaign.flightDateStart} — {campaign.flightDateEnd}
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

                    {/* Budget bar */}
                    {campaign.budgetType !== "flexible" && (
                      <div className="mt-4 max-w-md">
                        <div className="mb-1 flex items-center justify-between text-xs">
                          <span className="text-[var(--neutral-600)]">Budget</span>
                          <span className="font-medium text-[var(--neutral-800)]">
                            {budgetLabel} ({budgetPercent}%)
                          </span>
                        </div>
                        <Progress
                          value={budgetPercent}
                          className="h-2 bg-[var(--neutral-200)]"
                        />
                      </div>
                    )}
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    asChild
                    className="gap-1 text-[var(--brand-700)]"
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
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[var(--neutral-300)] bg-[var(--neutral-100)] py-20">
          <h3 className="text-base font-medium text-[var(--neutral-800)]">No campaigns yet</h3>
          <p className="mt-1 text-sm text-[var(--neutral-500)]">
            Create your first campaign to start working with creators.
          </p>
          <Button asChild className="mt-4 gap-2 bg-[var(--brand-700)] hover:bg-[var(--brand-800)]">
            <Link to="/campaigns/create">
              <Plus className="size-4" /> Create Campaign
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}
