import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Star, ExternalLink, TrendingUp, Heart, MapPin } from "lucide-react";
import { MOCK_CAMPAIGNS } from "@/store/campaign-store";
import type { CreatorAssignment, Platform } from "@/store/campaign-store";
import { formatFollowers } from "@/lib/format";

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
              <div className="flex items-start gap-3">
                <img
                  src={creator.creatorAvatar}
                  alt={creator.creatorName}
                  className="h-12 w-12 rounded-full object-cover ring-2 ring-[var(--neutral-100)]"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-[var(--neutral-800)] truncate">
                      {creator.creatorName}
                    </p>
                    {creator.isExclusive && (
                      <Badge className="border-0 bg-[var(--brand-100)] text-[var(--brand-700)] text-[10px] font-medium shrink-0">
                        <Star className="mr-0.5 size-2.5" /> Exclusive
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-[var(--neutral-500)]">
                    {creator.creatorHandle}
                  </p>
                </div>
              </div>

              {/* Bio */}
              <p className="mt-3 text-xs text-[var(--neutral-600)] line-clamp-2">
                {creator.bio}
              </p>

              {/* Stats row */}
              <div className="mt-3 flex items-center gap-4 text-xs text-[var(--neutral-600)]">
                <span className="font-medium">{formatFollowers(creator.followerCount)} followers</span>
                <span className="flex items-center gap-1">
                  <TrendingUp className="size-3 text-[var(--green-500)]" />
                  {creator.engagementRate}% ER
                </span>
                <span className="flex items-center gap-1">
                  <Heart className="size-3 text-[var(--red-400)]" />
                  {creator.avgLikes} avg
                </span>
              </div>

              {/* Audience snapshot */}
              <div className="mt-2 flex items-center gap-3 text-[10px] text-[var(--neutral-500)]">
                <span>{creator.audienceTopAge}</span>
                <span>{creator.audienceTopGender}</span>
                <span className="flex items-center gap-0.5">
                  <MapPin className="size-2.5" />
                  {creator.audienceTopLocation}
                </span>
              </div>

              {/* Platform & category tags */}
              <div className="mt-3 flex flex-wrap gap-1.5">
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

              {/* Recent content thumbnails */}
              {creator.recentPostThumbnails.length > 0 && (
                <div className="mt-3 flex gap-1.5">
                  {creator.recentPostThumbnails.slice(0, 3).map((thumb, i) => (
                    <img
                      key={i}
                      src={thumb}
                      alt="Recent post"
                      className="h-14 w-14 rounded-md object-cover"
                    />
                  ))}
                </div>
              )}

              {/* Actions — secondary first, primary second */}
              <div className="mt-4 flex items-center justify-between border-t border-[var(--neutral-100)] pt-3">
                <p className="text-xs text-[var(--neutral-500)]">
                  {creator.campaignCount} campaign{creator.campaignCount > 1 ? "s" : ""}
                  {creator.pastCampaignCount > 0 ? ` · ${creator.pastCampaignCount} past collabs` : ""}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs text-[var(--neutral-600)]"
                  >
                    <ExternalLink className="mr-1 size-3" /> Profile
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 text-xs border-[var(--brand-700)] text-[var(--brand-700)] hover:bg-[var(--brand-0)]"
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
