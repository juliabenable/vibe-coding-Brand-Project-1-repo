import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Star, ExternalLink } from "lucide-react";
import { MOCK_CAMPAIGNS } from "@/store/campaign-store";
import type { CreatorAssignment, Platform } from "@/store/campaign-store";

// Aggregate unique creators from all campaigns
function getUniqueCreators(): (CreatorAssignment & { campaignCount: number; campaignNames: string[] })[] {
  const map = new Map<string, CreatorAssignment & { campaignCount: number; campaignNames: string[] }>();
  MOCK_CAMPAIGNS.forEach((campaign) => {
    campaign.creators.forEach((creator) => {
      if (map.has(creator.creatorId)) {
        const existing = map.get(creator.creatorId)!;
        existing.campaignCount++;
        existing.campaignNames.push(campaign.title);
      } else {
        map.set(creator.creatorId, {
          ...creator,
          campaignCount: 1,
          campaignNames: [campaign.title],
        });
      }
    });
  });
  return Array.from(map.values());
}

const platformLabel: Record<Platform, string> = {
  benable: "Benable",
  instagram: "Instagram",
  tiktok: "TikTok",
};

export default function Creators() {
  const [searchQuery, setSearchQuery] = useState("");
  const creators = getUniqueCreators();

  const filtered = creators.filter(
    (c) =>
      c.creatorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.creatorHandle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[28px] font-bold text-[var(--neutral-800)]">Creators</h1>
        <p className="mt-1 text-sm text-[var(--neutral-600)]">
          Creators you've worked with or been matched with across campaigns.
        </p>
      </div>

      {/* Search & filter */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[var(--neutral-400)]" />
          <Input
            placeholder="Search creators by name or handle..."
            className="border-[var(--neutral-200)] pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline" className="gap-2 border-[var(--neutral-200)]">
          <Filter className="size-4" /> Filter
        </Button>
      </div>

      {/* Creator cards */}
      <div className="grid grid-cols-2 gap-4">
        {filtered.map((creator) => (
          <Card
            key={creator.creatorId}
            className="shadow-light-top border-[var(--neutral-200)] transition-shadow hover:shadow-medium-top"
          >
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--brand-200)] text-sm font-bold text-[var(--brand-800)]">
                    {creator.creatorName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-[var(--neutral-800)]">
                        {creator.creatorName}
                      </p>
                      {creator.isExclusive && (
                        <Badge className="border-0 bg-[var(--brand-100)] text-[var(--brand-700)] text-[10px] font-medium">
                          <Star className="mr-0.5 size-2.5" /> Exclusive
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-[var(--neutral-500)]">
                      {creator.creatorHandle}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-1.5">
                {creator.platforms.map((p) => (
                  <Badge
                    key={p}
                    variant="outline"
                    className="border-[var(--neutral-200)] text-[10px] font-normal text-[var(--neutral-600)]"
                  >
                    {platformLabel[p]}
                  </Badge>
                ))}
                {creator.categories.map((cat) => (
                  <Badge
                    key={cat}
                    variant="outline"
                    className="border-[var(--neutral-200)] text-[10px] font-normal text-[var(--neutral-600)]"
                  >
                    {cat}
                  </Badge>
                ))}
              </div>

              <div className="mt-4 flex items-center justify-between">
                <p className="text-xs text-[var(--neutral-500)]">
                  {creator.followerCount.toLocaleString()} followers &middot;{" "}
                  {creator.campaignCount} campaign{creator.campaignCount > 1 ? "s" : ""}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs text-[var(--brand-700)]"
                  >
                    <ExternalLink className="mr-1 size-3" /> View Profile
                  </Button>
                  <Button
                    size="sm"
                    className="h-7 bg-[var(--brand-700)] text-xs hover:bg-[var(--brand-800)]"
                  >
                    Invite to Campaign
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[var(--neutral-300)] bg-[var(--neutral-100)] py-16">
          <p className="text-sm text-[var(--neutral-500)]">
            {searchQuery ? "No creators found matching your search." : "No creators yet. Launch a campaign to start connecting!"}
          </p>
        </div>
      )}
    </div>
  );
}
