import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Star, ExternalLink, TrendingUp, Heart, MapPin, Users } from "lucide-react";
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

const platformColors: Record<Platform, { color: string; bg: string }> = {
  benable: { color: "var(--brand-700)", bg: "var(--brand-100)" },
  instagram: { color: "#C13584", bg: "#FCE7F3" },
  tiktok: { color: "var(--neutral-700)", bg: "var(--neutral-100)" },
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
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--pink-100)]">
          <Users className="size-6 text-[var(--pink-500)]" />
        </div>
        <div>
          <h1 className="text-[28px] font-bold text-[var(--neutral-800)]">Creators</h1>
          <p className="text-sm text-[var(--neutral-500)]">
            Creators you've worked with or been matched with across campaigns.
          </p>
        </div>
      </div>

      {/* Search & filter */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[var(--neutral-400)]" />
          <Input
            placeholder="Search creators by name or handle..."
            className="border-[var(--neutral-200)] pl-9 rounded-xl"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline" className="gap-2 border-[var(--neutral-200)] rounded-xl">
          <Filter className="size-4" /> Filter
        </Button>
      </div>

      {/* Creator cards */}
      <div className="grid grid-cols-2 gap-4">
        {filtered.map((creator) => (
          <Card
            key={creator.creatorId}
            className="border-[var(--neutral-200)] transition-all hover:border-[var(--brand-400)] hover:shadow-medium-top overflow-hidden"
          >
            <CardContent className="p-5">
              <div className="flex items-start gap-3">
                <img
                  src={creator.creatorAvatar}
                  alt={creator.creatorName}
                  className="h-12 w-12 rounded-full object-cover ring-2 ring-[var(--brand-100)]"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-[var(--neutral-800)] truncate">
                      {creator.creatorName}
                    </p>
                    {creator.isExclusive && (
                      <Badge className="border-0 bg-gradient-brand text-white text-[10px] font-medium shrink-0 gap-0.5">
                        <Star className="size-2.5" /> Exclusive
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

              {/* Stats row — colorful */}
              <div className="mt-3 flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1 font-medium text-[var(--brand-700)]">
                  <Users className="size-3" />
                  {formatFollowers(creator.followerCount)}
                </span>
                <span className="flex items-center gap-1 text-[var(--green-600)]">
                  <TrendingUp className="size-3" />
                  {creator.engagementRate}% ER
                </span>
                <span className="flex items-center gap-1 text-[var(--pink-500)]">
                  <Heart className="size-3" />
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
                {creator.platforms.map((p) => {
                  const pColor = platformColors[p];
                  return (
                    <Badge
                      key={p}
                      className="border-0 text-[10px] font-medium"
                      style={{ backgroundColor: pColor.bg, color: pColor.color }}
                    >
                      {platformLabel[p]}
                    </Badge>
                  );
                })}
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
                      className="h-14 w-14 rounded-lg object-cover border border-[var(--neutral-200)]"
                    />
                  ))}
                </div>
              )}

              {/* Actions */}
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
                    size="sm"
                    className="h-7 text-xs rounded-lg bg-gradient-brand text-white hover:opacity-90"
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
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--brand-300)] bg-gradient-hero py-16">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--pink-100)] mb-3">
            <Users className="size-7 text-[var(--pink-500)]" />
          </div>
          <p className="text-sm text-[var(--neutral-500)]">
            {searchQuery ? "No creators found matching your search." : "No creators yet. Launch a campaign to start connecting!"}
          </p>
        </div>
      )}
    </div>
  );
}
