import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Megaphone, Users, ArrowRight, Sparkles } from "lucide-react";
import { MOCK_CAMPAIGNS } from "@/store/campaign-store";

export default function Dashboard() {
  const activeCampaigns = MOCK_CAMPAIGNS.filter((c) => c.status === "active");

  return (
    <div className="space-y-8">
      {/* Hero CTA — Create Campaign */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[var(--brand-700)] via-[var(--brand-600)] to-[var(--brand-500)] p-8 text-white">
        <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-white/10 blur-xl" />

        <div className="relative flex items-center justify-between">
          <div className="max-w-md">
            <div className="mb-2 flex items-center gap-2">
              <Sparkles className="size-5 text-white/80" />
              <span className="text-sm font-medium text-white/80">
                Ready to collaborate?
              </span>
            </div>
            <h1 className="text-[28px] font-bold leading-tight">
              Launch a New Campaign
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-white/80">
              Find the right creators, send your brief, and start
              receiving authentic content for your brand.
            </p>
          </div>

          <Button
            asChild
            size="lg"
            className="gap-2 rounded-xl bg-white px-6 text-[var(--brand-700)] shadow-lg hover:bg-white/90"
          >
            <Link to="/campaigns/create">
              <Plus className="size-5" />
              Create Campaign
            </Link>
          </Button>
        </div>
      </div>

      {/* Active Campaigns */}
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
                  <CardContent className="flex items-center justify-between p-5">
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--brand-100)]">
                        <Megaphone className="size-5 text-[var(--brand-700)]" />
                      </div>
                      <div>
                        <p className="font-medium text-[var(--neutral-800)]">
                          {campaign.title}
                        </p>
                        <div className="mt-1 flex items-center gap-3 text-xs text-[var(--neutral-500)]">
                          <Badge
                            variant="outline"
                            className="border-[var(--brand-400)] bg-[var(--brand-100)] text-[var(--brand-700)] text-xs font-normal"
                          >
                            {campaign.mode === "open"
                              ? "Open"
                              : campaign.mode === "debut"
                                ? "Debut"
                                : "Targeted"}
                          </Badge>
                          <span>{campaign.creators.length} creators</span>
                          <span>Budget: {budgetLabel}</span>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      asChild
                      className="gap-1 text-[var(--brand-700)]"
                    >
                      <Link to={`/campaigns/${campaign.id}`}>
                        View <ArrowRight className="size-3.5" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="mb-4 text-lg font-bold text-[var(--neutral-800)]">
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <Card className="cursor-pointer border-[var(--neutral-200)] transition-all hover:border-[var(--brand-400)] hover:shadow-light-top">
            <Link to="/campaigns/create">
              <CardContent className="flex items-center gap-4 p-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--brand-100)]">
                  <Plus className="size-5 text-[var(--brand-700)]" />
                </div>
                <div>
                  <p className="font-medium text-[var(--neutral-800)]">
                    Create New Campaign
                  </p>
                  <p className="text-xs text-[var(--neutral-500)]">
                    Launch a Targeted campaign with creators
                  </p>
                </div>
              </CardContent>
            </Link>
          </Card>

          <Card className="cursor-pointer border-[var(--neutral-200)] transition-all hover:border-[var(--brand-400)] hover:shadow-light-top">
            <Link to="/creators">
              <CardContent className="flex items-center gap-4 p-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--green-100)]">
                  <Users className="size-5 text-[var(--green-500)]" />
                </div>
                <div>
                  <p className="font-medium text-[var(--neutral-800)]">
                    Browse Creators
                  </p>
                  <p className="text-xs text-[var(--neutral-500)]">
                    View creators you've worked with
                  </p>
                </div>
              </CardContent>
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );
}
