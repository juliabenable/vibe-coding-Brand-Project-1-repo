import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Megaphone, Users, Clock, ArrowRight } from "lucide-react";
import { MOCK_CAMPAIGNS } from "@/store/campaign-store";

export default function Dashboard() {
  const activeCampaigns = MOCK_CAMPAIGNS.filter((c) => c.status === "active");
  const pendingApplications = MOCK_CAMPAIGNS.flatMap((c) =>
    c.creators.filter((cr) => cr.status === "applied")
  );
  const totalCreators = new Set(
    MOCK_CAMPAIGNS.flatMap((c) => c.creators.map((cr) => cr.creatorId))
  ).size;

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[28px] font-bold text-[var(--neutral-800)]">
            Welcome back
          </h1>
          <p className="mt-1 text-sm text-[var(--neutral-600)]">
            Here's what's happening with your campaigns.
          </p>
        </div>
        <Button asChild className="gap-2 bg-[var(--brand-700)] hover:bg-[var(--brand-800)]">
          <Link to="/campaigns/create">
            <Plus className="size-4" />
            Create Campaign
          </Link>
        </Button>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-3 gap-6">
        <Card className="shadow-light-top border-[var(--neutral-200)]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-[var(--neutral-600)]">
              Active Campaigns
            </CardTitle>
            <Megaphone className="size-4 text-[var(--brand-700)]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[var(--neutral-800)]">
              {activeCampaigns.length}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-light-top border-[var(--neutral-200)]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-[var(--neutral-600)]">
              Pending Applications
            </CardTitle>
            <Clock className="size-4 text-[var(--orange-500)]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[var(--neutral-800)]">
              {pendingApplications.length}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-light-top border-[var(--neutral-200)]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-[var(--neutral-600)]">
              Total Creators
            </CardTitle>
            <Users className="size-4 text-[var(--green-500)]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[var(--neutral-800)]">
              {totalCreators}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent activity */}
      <div>
        <h2 className="mb-4 text-lg font-bold text-[var(--neutral-800)]">
          Active Campaigns
        </h2>
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
                          {campaign.mode === "open" ? "Open" : "Targeted"}
                        </Badge>
                        <span>{campaign.creators.length} creators</span>
                        <span>Budget: {budgetLabel}</span>
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" asChild className="gap-1 text-[var(--brand-700)]">
                    <Link to={`/campaigns/${campaign.id}`}>
                      View <ArrowRight className="size-3.5" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Quick actions */}
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
                    Launch an Open or Targeted campaign
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
