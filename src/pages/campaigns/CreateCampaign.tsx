import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Globe,
  Target,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Check,
  Upload,
  Gift,
  CreditCard,
  Tag,
  DollarSign,
  TrendingUp,
  Lock,
  FileText,
  Search,
  Camera,
  Instagram,
  Video,
  Star,
  Plus,
  X,
  Brain,
  Users,
  Zap,
  Eye,
  Shield,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  emptyCampaignDraft,
  type CampaignDraft,
  type CampaignMode,
  type CampaignGoal,
  type CompensationType,
  type ContentFormat,
} from "@/store/campaign-store";

// ─── Step indicator (clean "STEP X OF Y" style) ───
function StepIndicator({ currentStep, totalSteps, stepLabel }: { currentStep: number; totalSteps: number; stepLabel: string }) {
  return (
    <div className="mb-8 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <p className="text-xs font-semibold uppercase tracking-widest text-[var(--neutral-400)]">
          Step {currentStep} of {totalSteps}
        </p>
        <div className="h-4 w-px bg-[var(--neutral-200)]" />
        <p className="text-sm font-bold text-[var(--neutral-800)]">{stepLabel}</p>
      </div>
      {/* Progress dots */}
      <div className="flex items-center gap-1.5">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div
            key={i}
            className="h-2 rounded-full transition-all"
            style={{
              width: i + 1 === currentStep ? 24 : 8,
              backgroundColor: i + 1 <= currentStep ? "var(--brand-700)" : "var(--neutral-200)",
            }}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Content format tile config ───
const CONTENT_FORMAT_TILES: {
  value: ContentFormat;
  label: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  borderColor: string;
  iconBg: string;
}[] = [
  { value: "benable_post", label: "Benable Post", icon: Star, color: "var(--brand-700)", bgColor: "var(--brand-100)", borderColor: "var(--brand-400)", iconBg: "var(--brand-200)" },
  { value: "instagram_post", label: "Instagram Post", icon: Instagram, color: "#C13584", bgColor: "#FCE7F3", borderColor: "#F472B6", iconBg: "#FBCFE8" },
  { value: "instagram_reel", label: "Instagram Reel", icon: Video, color: "#C13584", bgColor: "#FCE7F3", borderColor: "#F472B6", iconBg: "#FBCFE8" },
  { value: "instagram_story", label: "Instagram Story", icon: Camera, color: "#C13584", bgColor: "#FCE7F3", borderColor: "#F472B6", iconBg: "#FBCFE8" },
  { value: "tiktok_video", label: "TikTok Video", icon: Video, color: "var(--neutral-800)", bgColor: "var(--neutral-100)", borderColor: "var(--neutral-400)", iconBg: "var(--neutral-200)" },
];

// ─── Compensation tile config ───
const COMPENSATION_TILES: {
  type: CompensationType;
  label: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  borderColor: string;
  iconBg: string;
}[] = [
  { type: "gifted", label: "Gifted Product", icon: Gift, color: "var(--brand-700)", bgColor: "var(--brand-100)", borderColor: "var(--brand-400)", iconBg: "var(--brand-200)" },
  { type: "gift_card", label: "Gift Card", icon: CreditCard, color: "var(--blue-700)", bgColor: "var(--blue-100)", borderColor: "var(--blue-300)", iconBg: "#CCE8FF" },
  { type: "discount", label: "Discount Code", icon: Tag, color: "var(--green-700)", bgColor: "var(--green-100)", borderColor: "var(--green-300)", iconBg: "#C6F0E2" },
  { type: "paid", label: "Paid Fee", icon: DollarSign, color: "var(--orange-700)", bgColor: "var(--orange-100)", borderColor: "var(--orange-300)", iconBg: "var(--orange-300)" },
  { type: "commission_boost", label: "Commission Boost", icon: TrendingUp, color: "#7B61C2", bgColor: "#F3EEFF", borderColor: "#C9B8F0", iconBg: "#DDD0F7" },
];

// ─── Campaign Goal tiles (full-page Step 1) ───
const GOAL_TILES: {
  value: CampaignGoal;
  emoji: string;
  title: string;
  description: string;
  color: string;
  bgColor: string;
  borderColor: string;
}[] = [
  {
    value: "word_of_mouth",
    emoji: "💬",
    title: "Word of Mouth",
    description: "Connect with influencers who will share your products with their engaged followers.",
    color: "var(--brand-700)", bgColor: "var(--brand-100)", borderColor: "var(--brand-400)",
  },
  {
    value: "product_launch",
    emoji: "🎁",
    title: "Product Seeding",
    description: "Send products to creators for authentic reviews and unboxing content.",
    color: "var(--green-700)", bgColor: "var(--green-100)", borderColor: "var(--green-300)",
  },
  {
    value: "ugc",
    emoji: "📸",
    title: "Content Creation",
    description: "Get authentic UGC and branded content for your marketing channels.",
    color: "var(--orange-700)", bgColor: "var(--orange-100)", borderColor: "var(--orange-300)",
  },
  {
    value: "awareness",
    emoji: "📢",
    title: "Brand Awareness",
    description: "Increase brand visibility and reach through influencer partnerships.",
    color: "var(--blue-700)", bgColor: "var(--blue-100)", borderColor: "var(--blue-300)",
  },
  {
    value: "sales",
    emoji: "💰",
    title: "Drive Sales",
    description: "Generate conversions and revenue through creator-driven promotions.",
    color: "#7B61C2", bgColor: "#F3EEFF", borderColor: "#C9B8F0",
  },
  {
    value: "community",
    emoji: "🏘️",
    title: "Community Building",
    description: "Foster authentic connections between your brand and target audiences.",
    color: "var(--brand-700)", bgColor: "var(--brand-0)", borderColor: "var(--brand-300)",
  },
];

// ─── Content Niche suggested tags ───
const NICHE_SUGGESTIONS = [
  "Lifestyle", "Beauty", "Skincare", "Fashion", "Travel", "Wellness",
  "Fitness", "Food & Drink", "Home & Decor", "Parenting", "Tech",
  "Sustainability", "Pet Care", "Self-Care", "Haircare", "Fragrance",
];

// ═══════════════════════════════════════════════════
// STEP 1: Campaign Goals (full-page, typeform-style)
// ═══════════════════════════════════════════════════
function StepGoals({
  draft,
  setDraft,
}: {
  draft: CampaignDraft;
  setDraft: React.Dispatch<React.SetStateAction<CampaignDraft>>;
}) {
  const toggleGoal = (goal: CampaignGoal) => {
    setDraft((prev) => ({
      ...prev,
      goals: prev.goals.includes(goal)
        ? prev.goals.filter((g) => g !== goal)
        : [...prev.goals, goal],
    }));
  };

  return (
    <div className="mx-auto max-w-2xl py-4">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold text-[var(--neutral-800)]">
          What are your campaign goals?
        </h2>
        <p className="mt-2 text-sm text-[var(--neutral-500)]">
          Select all that apply. This helps us tailor the experience for you.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {GOAL_TILES.map((goal) => {
          const selected = draft.goals.includes(goal.value);
          return (
            <button
              key={goal.value}
              type="button"
              onClick={() => toggleGoal(goal.value)}
              className="relative flex flex-col items-start gap-2 rounded-xl p-5 text-left transition-all"
              style={{
                backgroundColor: selected ? goal.bgColor : "white",
                border: `2px solid ${selected ? goal.borderColor : "var(--neutral-200)"}`,
              }}
            >
              {selected && (
                <div
                  className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full"
                  style={{ backgroundColor: goal.color }}
                >
                  <Check className="size-3 text-white" />
                </div>
              )}
              <span className="text-2xl">{goal.emoji}</span>
              <p className="text-sm font-bold" style={{ color: selected ? goal.color : "var(--neutral-800)" }}>
                {goal.title}
              </p>
              <p className="text-xs leading-relaxed" style={{ color: selected ? goal.color : "var(--neutral-500)" }}>
                {goal.description}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════
// STEP 2: Campaign Details (Mode + Basics + Content Format + Compensation)
// ═══════════════════════════════════════════════════
function StepDetails({
  draft,
  setDraft,
}: {
  draft: CampaignDraft;
  setDraft: React.Dispatch<React.SetStateAction<CampaignDraft>>;
}) {
  const update = useCallback(
    <K extends keyof CampaignDraft>(field: K, value: CampaignDraft[K]) => {
      setDraft((prev) => ({ ...prev, [field]: value }));
    },
    [setDraft]
  );

  const toggleCompensation = (type: CompensationType, enabled: boolean) => {
    setDraft((prev) => ({
      ...prev,
      compensationTypes: prev.compensationTypes.map((c) =>
        c.type === type ? { ...c, enabled } : c
      ),
    }));
  };

  const updateCompensation = (type: CompensationType, field: string, value: unknown) => {
    setDraft((prev) => ({
      ...prev,
      compensationTypes: prev.compensationTypes.map((c) =>
        c.type === type ? { ...c, [field]: value } : c
      ),
    }));
  };

  const toggleContentFormat = (format: ContentFormat) => {
    const isBenable = format === "benable_post";
    if (isBenable) return; // always included
    setDraft((prev) => {
      const has = prev.contentFormats.includes(format);
      const newFormats = has
        ? prev.contentFormats.filter((f) => f !== format)
        : [...prev.contentFormats, format];
      const plats: Set<string> = new Set(["benable"]);
      newFormats.forEach((f) => {
        if (f.startsWith("instagram")) plats.add("instagram");
        if (f.startsWith("tiktok")) plats.add("tiktok");
      });
      return {
        ...prev,
        contentFormats: newFormats,
        platforms: Array.from(plats) as CampaignDraft["platforms"],
      };
    });
  };

  // Deactivated modes
  const deactivatedModes: CampaignMode[] = ["open", "debut"];
  const activeComps = draft.compensationTypes.filter((c) => c.enabled);

  return (
    <div className="space-y-8">
      {/* Campaign Mode */}
      <div>
        <Label className="mb-3 block text-base font-bold text-[var(--neutral-800)]">
          Choose your campaign mode
        </Label>
        <div className="grid grid-cols-3 gap-4">
          {([
            {
              mode: "targeted" as CampaignMode,
              icon: Target,
              title: "Targeted Campaign",
              desc: "Hand-pick specific creators for your campaign. More control, more personal.",
              best: "Best for: product launches, specific aesthetics, ongoing relationships",
            },
            {
              mode: "open" as CampaignMode,
              icon: Globe,
              title: "Open Campaign",
              desc: "Broadcast to matching creators. They apply, you select.",
              best: "Best for: awareness, UGC at scale, discovering new creators",
            },
            {
              mode: "debut" as CampaignMode,
              icon: Sparkles,
              title: "Debut Collabs",
              desc: "Work with rising creators who haven't done brand deals yet. Lower cost, authentic content.",
              best: "Best for: authentic UGC, budget-friendly, discovering hidden gems",
              badge: "New",
            },
          ]).map((opt) => {
            const isDisabled = deactivatedModes.includes(opt.mode);
            const isSelected = draft.mode === opt.mode;
            return (
              <Card
                key={opt.mode}
                className={`border-2 transition-all ${
                  isDisabled
                    ? "opacity-50 cursor-not-allowed border-[var(--neutral-200)] bg-[var(--neutral-50)]"
                    : isSelected
                      ? "cursor-pointer border-[var(--brand-700)] bg-[var(--brand-0)] shadow-light-top"
                      : "cursor-pointer border-[var(--neutral-200)] hover:border-[var(--brand-400)]"
                }`}
                onClick={() => {
                  if (!isDisabled) update("mode", opt.mode);
                }}
              >
                <CardContent className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <opt.icon className={`size-5 ${isDisabled ? "text-[var(--neutral-400)]" : "text-[var(--brand-700)]"}`} />
                    <span className={`font-bold ${isDisabled ? "text-[var(--neutral-400)]" : "text-[var(--neutral-800)]"}`}>{opt.title}</span>
                    {isDisabled && (
                      <Badge className="border-0 bg-[var(--neutral-200)] text-[var(--neutral-500)] text-[10px]">
                        <Lock className="mr-0.5 size-2.5" /> Coming Soon
                      </Badge>
                    )}
                    {"badge" in opt && opt.badge && !isDisabled && (
                      <Badge className="border-0 bg-[var(--green-100)] text-[var(--green-700)] text-[10px]">
                        {opt.badge}
                      </Badge>
                    )}
                  </div>
                  <p className={`text-sm ${isDisabled ? "text-[var(--neutral-400)]" : "text-[var(--neutral-600)]"}`}>{opt.desc}</p>
                  <p className={`mt-2 text-xs ${isDisabled ? "text-[var(--neutral-300)]" : "text-[var(--neutral-500)]"}`}>{opt.best}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Campaign Basics — only show after mode is selected */}
      {draft.mode && (
        <>
          <Separator className="bg-[var(--neutral-200)]" />

          {/* Basic Info */}
          <div className="space-y-5">
            <h3 className="text-base font-bold text-[var(--neutral-800)]">Basic Information</h3>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-[var(--neutral-800)]">
                Campaign Title <span className="text-[var(--brand-700)]">*</span>
              </Label>
              <Input
                placeholder="e.g., Summer Glow Collection Launch"
                className="border-[var(--neutral-200)] focus:border-[var(--brand-700)]"
                value={draft.title}
                onChange={(e) => update("title", e.target.value)}
              />
            </div>
          </div>

          {/* Content Format — square tiles */}
          <Separator className="bg-[var(--neutral-200)]" />

          <div className="space-y-5">
            <div>
              <h3 className="text-base font-bold text-[var(--neutral-800)]">Content Format</h3>
              <p className="mt-1 text-sm text-[var(--neutral-500)]">
                Select the types of content you'd like creators to produce.
              </p>
            </div>
            <div className="grid grid-cols-5 gap-3">
              {CONTENT_FORMAT_TILES.map((tile) => {
                const isBenable = tile.value === "benable_post";
                const selected = draft.contentFormats.includes(tile.value);
                return (
                  <button
                    key={tile.value}
                    type="button"
                    onClick={() => toggleContentFormat(tile.value)}
                    className="relative flex flex-col items-center gap-2.5 rounded-xl p-4 text-center transition-all"
                    style={{
                      backgroundColor: selected ? tile.bgColor : "white",
                      border: `2px solid ${selected ? tile.borderColor : "var(--neutral-200)"}`,
                      opacity: isBenable ? 1 : undefined,
                    }}
                  >
                    {selected && (
                      <div className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full" style={{ backgroundColor: tile.color }}>
                        <Check className="size-3 text-white" />
                      </div>
                    )}
                    <div
                      className="flex h-11 w-11 items-center justify-center rounded-xl"
                      style={{ backgroundColor: tile.iconBg }}
                    >
                      <tile.icon className="size-5" style={{ color: tile.color }} />
                    </div>
                    <span className="text-xs font-semibold leading-tight" style={{ color: selected ? tile.color : "var(--neutral-700)" }}>
                      {tile.label}
                    </span>
                    {isBenable && (
                      <Badge className="border-0 bg-[var(--brand-200)] text-[var(--brand-700)] text-[9px] px-1.5 py-0">
                        Always on
                      </Badge>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Compensation — square tile grid */}
          <Separator className="bg-[var(--neutral-200)]" />

          <div className="space-y-5">
            <div>
              <h3 className="text-base font-bold text-[var(--neutral-800)]">Compensation Structure</h3>
              <p className="mt-1 text-sm text-[var(--neutral-500)]">
                What will you offer creators? Select all that apply.
              </p>
            </div>

            <div className="grid grid-cols-5 gap-3">
              {COMPENSATION_TILES.map((tile) => {
                const comp = draft.compensationTypes.find((c) => c.type === tile.type);
                const active = comp?.enabled ?? false;
                return (
                  <button
                    key={tile.type}
                    type="button"
                    onClick={() => toggleCompensation(tile.type, !active)}
                    className="relative flex flex-col items-center gap-2.5 rounded-xl p-4 text-center transition-all"
                    style={{
                      backgroundColor: active ? tile.bgColor : "white",
                      border: `2px solid ${active ? tile.borderColor : "var(--neutral-200)"}`,
                    }}
                  >
                    {active && (
                      <div className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full" style={{ backgroundColor: tile.color }}>
                        <Check className="size-3 text-white" />
                      </div>
                    )}
                    <div
                      className="flex h-11 w-11 items-center justify-center rounded-xl"
                      style={{ backgroundColor: tile.iconBg }}
                    >
                      <tile.icon className="size-5" style={{ color: tile.color }} />
                    </div>
                    <span className="text-xs font-semibold" style={{ color: active ? tile.color : "var(--neutral-700)" }}>
                      {tile.label}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Expanded detail inputs */}
            {activeComps.length > 0 && (
              <div className="space-y-4">
                {activeComps.map((comp) => {
                  const tile = COMPENSATION_TILES.find((p) => p.type === comp.type)!;
                  return (
                    <div
                      key={comp.type}
                      className="rounded-xl p-4"
                      style={{
                        backgroundColor: tile.bgColor,
                        border: `1px solid ${tile.borderColor}`,
                      }}
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <tile.icon className="size-4" style={{ color: tile.color }} />
                        <span className="text-sm font-semibold" style={{ color: tile.color }}>
                          {tile.label}
                        </span>
                      </div>

                      {comp.type === "gifted" && (
                        <div className="grid grid-cols-3 gap-3">
                          <div className="space-y-1">
                            <Label className="text-xs text-[var(--neutral-600)]">Product name</Label>
                            <Input placeholder="e.g., Melted Balm" className="h-8 text-sm bg-white border-[var(--neutral-200)]" value={comp.productName || ""} onChange={(e) => updateCompensation(comp.type, "productName", e.target.value)} />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs text-[var(--neutral-600)]">Product URL</Label>
                            <Input placeholder="https://..." className="h-8 text-sm bg-white border-[var(--neutral-200)]" value={comp.productUrl || ""} onChange={(e) => updateCompensation(comp.type, "productUrl", e.target.value)} />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs text-[var(--neutral-600)]">Est. value/unit</Label>
                            <Input type="number" placeholder="$35" className="h-8 text-sm bg-white border-[var(--neutral-200)]" value={comp.estValuePerUnit || ""} onChange={(e) => updateCompensation(comp.type, "estValuePerUnit", Number(e.target.value))} />
                          </div>
                        </div>
                      )}

                      {comp.type === "gift_card" && (
                        <div className="grid grid-cols-3 gap-3">
                          <div className="space-y-1">
                            <Label className="text-xs text-[var(--neutral-600)]">Gift card value</Label>
                            <Input type="number" placeholder="$50" className="h-8 text-sm bg-white border-[var(--neutral-200)]" value={comp.giftCardValue || ""} onChange={(e) => updateCompensation(comp.type, "giftCardValue", Number(e.target.value))} />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs text-[var(--neutral-600)]">Brand/Store</Label>
                            <Input placeholder="e.g., Ulta Beauty" className="h-8 text-sm bg-white border-[var(--neutral-200)]" value={comp.giftCardBrand || ""} onChange={(e) => updateCompensation(comp.type, "giftCardBrand", e.target.value)} />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs text-[var(--neutral-600)]">Delivery</Label>
                            <Select value={comp.giftCardDelivery || "brand_provides"} onValueChange={(v) => updateCompensation(comp.type, "giftCardDelivery", v)}>
                              <SelectTrigger className="h-8 text-sm bg-white border-[var(--neutral-200)]"><SelectValue /></SelectTrigger>
                              <SelectContent>
                                <SelectItem value="brand_provides">Brand provides code</SelectItem>
                                <SelectItem value="benable_sends">Benable sends eGift</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      )}

                      {comp.type === "discount" && (
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <Label className="text-xs text-[var(--neutral-600)]">Discount code</Label>
                            <Input placeholder="e.g., SUMMER20" className="h-8 text-sm bg-white border-[var(--neutral-200)]" value={comp.discountCode || ""} onChange={(e) => updateCompensation(comp.type, "discountCode", e.target.value)} />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs text-[var(--neutral-600)]">Discount amount</Label>
                            <Input placeholder="20% or $10" className="h-8 text-sm bg-white border-[var(--neutral-200)]" value={comp.discountAmount || ""} onChange={(e) => updateCompensation(comp.type, "discountAmount", Number(e.target.value))} />
                          </div>
                        </div>
                      )}

                      {comp.type === "paid" && (
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <Label className="text-xs text-[var(--neutral-600)]">Min fee/creator</Label>
                            <Input type="number" placeholder="$100" className="h-8 text-sm bg-white border-[var(--neutral-200)]" value={comp.feeMin || ""} onChange={(e) => updateCompensation(comp.type, "feeMin", Number(e.target.value))} />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs text-[var(--neutral-600)]">Max fee/creator</Label>
                            <Input type="number" placeholder="$300" className="h-8 text-sm bg-white border-[var(--neutral-200)]" value={comp.feeMax || ""} onChange={(e) => updateCompensation(comp.type, "feeMax", Number(e.target.value))} />
                          </div>
                        </div>
                      )}

                      {comp.type === "commission_boost" && (
                        <div className="w-48">
                          <div className="space-y-1">
                            <Label className="text-xs text-[var(--neutral-600)]">Boosted commission rate</Label>
                            <Input type="number" placeholder="15%" className="h-8 text-sm bg-white border-[var(--neutral-200)]" value={comp.commissionRate || ""} onChange={(e) => updateCompensation(comp.type, "commissionRate", Number(e.target.value))} />
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════
// STEP 3: Campaign Brief (with Creator Obligations + Content Niche)
// ═══════════════════════════════════════════════════
function StepBrief({
  draft,
  setDraft,
}: {
  draft: CampaignDraft;
  setDraft: React.Dispatch<React.SetStateAction<CampaignDraft>>;
}) {
  const [nicheSearch, setNicheSearch] = useState("");
  const [customObligation, setCustomObligation] = useState("");

  const update = useCallback(
    <K extends keyof CampaignDraft>(field: K, value: CampaignDraft[K]) => {
      setDraft((prev) => ({ ...prev, [field]: value }));
    },
    [setDraft]
  );

  const toggleObligation = (id: string) => {
    setDraft((prev) => ({
      ...prev,
      creatorObligations: prev.creatorObligations.map((o) =>
        o.id === id ? { ...o, enabled: !o.enabled } : o
      ),
    }));
  };

  const addCustomObligation = () => {
    if (!customObligation.trim()) return;
    setDraft((prev) => ({
      ...prev,
      customObligations: [...prev.customObligations, customObligation.trim()],
    }));
    setCustomObligation("");
  };

  const removeCustomObligation = (idx: number) => {
    setDraft((prev) => ({
      ...prev,
      customObligations: prev.customObligations.filter((_, i) => i !== idx),
    }));
  };

  const toggleNiche = (niche: string) => {
    setDraft((prev) => ({
      ...prev,
      contentNiches: prev.contentNiches.includes(niche)
        ? prev.contentNiches.filter((n) => n !== niche)
        : [...prev.contentNiches, niche],
    }));
  };

  const addCustomNiche = (value: string) => {
    const niche = value.trim();
    if (!niche || draft.contentNiches.includes(niche)) return;
    setDraft((prev) => ({
      ...prev,
      contentNiches: [...prev.contentNiches, niche],
    }));
    setNicheSearch("");
  };

  const filteredSuggestions = NICHE_SUGGESTIONS.filter(
    (n) => n.toLowerCase().includes(nicheSearch.toLowerCase()) && !draft.contentNiches.includes(n)
  );

  return (
    <div className="space-y-8">
      {/* Campaign Brief Upload + Description */}
      <div className="space-y-5">
        <h3 className="text-base font-bold text-[var(--neutral-800)]">Campaign Brief</h3>

        {/* Upload Brief */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-[var(--neutral-800)]">
            Upload Brief (optional)
          </Label>
          <div className="flex items-center gap-3 rounded-lg border border-dashed border-[var(--neutral-300)] bg-[var(--neutral-100)] p-4">
            <Upload className="size-5 text-[var(--neutral-400)]" />
            <div>
              <p className="text-sm text-[var(--neutral-600)]">
                Drop your brief here or{" "}
                <span className="cursor-pointer font-medium text-[var(--brand-700)]">
                  browse files
                </span>
              </p>
              <p className="text-xs text-[var(--neutral-400)]">
                Accepts .pdf, .docx. We'll extract key details and auto-populate the description below.
              </p>
            </div>
          </div>
        </div>

        {/* Campaign Description */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium text-[var(--neutral-800)]">
              Campaign Description <span className="text-[var(--brand-700)]">*</span>
            </Label>
            {draft.briefFile && (
              <Badge className="border-0 bg-[var(--green-100)] text-[var(--green-700)] text-[10px] gap-1">
                <FileText className="size-2.5" /> Auto-populated from brief
              </Badge>
            )}
          </div>
          <textarea
            className="flex min-h-[160px] w-full rounded-lg border border-[var(--neutral-200)] bg-white px-3 py-3 text-sm text-[var(--neutral-800)] placeholder:text-[var(--neutral-400)] focus:border-[var(--brand-700)] focus:outline-none focus:ring-1 focus:ring-[var(--brand-700)]"
            placeholder="Describe your product, key talking points, and creative direction. Creators will use this to produce content."
            value={draft.description}
            onChange={(e) => update("description", e.target.value)}
          />
          <p className="text-xs text-[var(--neutral-400)]">
            Min 50 characters. {draft.description.length} / 50
          </p>
        </div>
      </div>

      <Separator className="bg-[var(--neutral-200)]" />

      {/* Creator Obligations — LTK-inspired */}
      <div className="space-y-5">
        <div>
          <h3 className="text-base font-bold text-[var(--neutral-800)]">📋 Creator Obligations</h3>
          <p className="mt-1 text-sm text-[var(--neutral-500)]">
            Select the requirements creators must fulfill. These will be used to verify content compliance.
          </p>
        </div>

        <div className="space-y-2">
          {draft.creatorObligations.map((obligation) => {
            const active = obligation.enabled;
            return (
              <button
                key={obligation.id}
                type="button"
                onClick={() => toggleObligation(obligation.id)}
                className="flex w-full items-center gap-3 rounded-xl p-3.5 text-left transition-all"
                style={{
                  backgroundColor: active ? "var(--brand-0)" : "white",
                  border: `1.5px solid ${active ? "var(--brand-400)" : "var(--neutral-200)"}`,
                }}
              >
                <div
                  className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md transition-all"
                  style={{
                    backgroundColor: active ? "var(--brand-700)" : "var(--neutral-100)",
                    border: active ? "none" : "1.5px solid var(--neutral-300)",
                  }}
                >
                  {active && <Check className="size-3.5 text-white" />}
                </div>
                <span className="text-lg">{obligation.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[var(--neutral-800)]">{obligation.label}</p>
                  <p className="text-xs text-[var(--neutral-500)]">{obligation.description}</p>
                </div>
                <Badge
                  variant="outline"
                  className="shrink-0 border-[var(--neutral-200)] bg-[var(--neutral-50)] text-[var(--neutral-500)] text-[10px]"
                >
                  {obligation.platform}
                </Badge>
              </button>
            );
          })}
        </div>

        {/* Custom obligations */}
        {draft.customObligations.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--neutral-400)]">Custom Requirements</p>
            {draft.customObligations.map((co, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 rounded-xl border-1.5 border-[var(--brand-400)] bg-[var(--brand-0)] p-3.5"
              >
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-[var(--brand-700)]">
                  <Check className="size-3.5 text-white" />
                </div>
                <span className="text-lg">✏️</span>
                <p className="flex-1 text-sm font-medium text-[var(--neutral-800)]">{co}</p>
                <button
                  type="button"
                  onClick={() => removeCustomObligation(idx)}
                  className="shrink-0 rounded-full p-1 hover:bg-[var(--neutral-100)]"
                >
                  <X className="size-3.5 text-[var(--neutral-400)]" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Add custom */}
        <div className="flex items-center gap-2">
          <Input
            placeholder="Add a custom obligation..."
            className="border-[var(--neutral-200)] text-sm"
            value={customObligation}
            onChange={(e) => setCustomObligation(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addCustomObligation();
              }
            }}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="shrink-0 gap-1.5 border-[var(--brand-400)] text-[var(--brand-700)] hover:bg-[var(--brand-0)]"
            onClick={addCustomObligation}
            disabled={!customObligation.trim()}
          >
            <Plus className="size-3.5" /> Add
          </Button>
        </div>
      </div>

      <Separator className="bg-[var(--neutral-200)]" />

      {/* Content Niche */}
      <div className="space-y-5">
        <div>
          <h3 className="text-base font-bold text-[var(--neutral-800)]">🎯 Content Niche</h3>
          <p className="mt-1 text-sm text-[var(--neutral-500)]">
            What content categories should creators be in? This helps us find the best matches.
          </p>
        </div>

        {/* Selected niches */}
        {draft.contentNiches.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {draft.contentNiches.map((niche) => (
              <Badge
                key={niche}
                className="cursor-pointer gap-1.5 border-[var(--brand-400)] bg-[var(--brand-100)] text-[var(--brand-700)] px-3 py-1.5 text-sm font-medium hover:bg-[var(--brand-200)]"
                onClick={() => toggleNiche(niche)}
              >
                {niche}
                <X className="size-3" />
              </Badge>
            ))}
          </div>
        )}

        {/* Search input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[var(--neutral-400)]" />
          <Input
            placeholder="Search or add a niche..."
            className="border-[var(--neutral-200)] pl-10 text-sm"
            value={nicheSearch}
            onChange={(e) => setNicheSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addCustomNiche(nicheSearch);
              }
            }}
          />
        </div>

        {/* Suggested tags */}
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-[var(--neutral-400)]">
            Suggested
          </p>
          <div className="flex flex-wrap gap-2">
            {filteredSuggestions.map((niche) => (
              <button
                key={niche}
                type="button"
                onClick={() => toggleNiche(niche)}
                className="rounded-full border border-[var(--neutral-200)] bg-white px-3 py-1.5 text-xs font-medium text-[var(--neutral-600)] transition-all hover:border-[var(--brand-400)] hover:bg-[var(--brand-0)] hover:text-[var(--brand-700)]"
              >
                + {niche}
              </button>
            ))}
          </div>
        </div>
      </div>

      <Separator className="bg-[var(--neutral-200)]" />

      {/* Creator Count */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-[var(--neutral-800)]">👥 Creator Count</h3>
        <div className="max-w-xs space-y-2">
          <Label className="text-sm font-medium text-[var(--neutral-800)]">
            How many creators?
          </Label>
          <Input
            type="number"
            placeholder="e.g., 10"
            className="border-[var(--neutral-200)]"
            value={draft.creatorCount || ""}
            onChange={(e) => update("creatorCount", Number(e.target.value))}
          />
          <p className="text-xs text-[var(--neutral-500)]">
            Approximate number — we'll recommend the best matches.
          </p>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════
// STEP 4: Review & Launch (card-based layout with emoji headers)
// ═══════════════════════════════════════════════════
function StepReview({
  draft,
  onBack,
}: {
  draft: CampaignDraft;
  onBack: (step: number) => void;
}) {
  const goalLabels: Record<string, string> = {
    awareness: "Brand Awareness",
    sales: "Drive Sales",
    product_launch: "Product Seeding",
    ugc: "Content Creation",
    word_of_mouth: "Word of Mouth",
    community: "Community Building",
  };

  const compLabels: Record<CompensationType, string> = {
    gifted: "Gifted Product",
    gift_card: "Gift Card",
    discount: "Discount Code",
    paid: "Paid Fee",
    commission_boost: "Commission Boost",
  };

  const formatLabel: Record<ContentFormat, string> = {
    instagram_post: "IG Post",
    instagram_reel: "IG Reel",
    instagram_story: "IG Story",
    tiktok_video: "TikTok Video",
    benable_post: "Benable Post",
  };

  const enabledComps = draft.compensationTypes.filter((c) => c.enabled);
  const enabledObligations = draft.creatorObligations.filter((o) => o.enabled);

  return (
    <div className="space-y-5">
      {/* Campaign title header */}
      <div className="text-center py-2">
        <p className="text-sm text-[var(--neutral-500)] mb-1">Ready to launch</p>
        <h2 className="text-2xl font-bold text-[var(--neutral-800)]">
          {draft.title || "Untitled Campaign"}
        </h2>
      </div>

      {/* Goals Card */}
      <Card className="border-[var(--neutral-200)] shadow-light-top">
        <CardContent className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-[var(--neutral-800)]">🎯 Campaign Goals</h3>
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-[var(--brand-700)] hover:text-[var(--brand-800)]"
              onClick={() => onBack(1)}
            >
              Edit
            </Button>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {draft.goals.length > 0
              ? draft.goals.map((g) => (
                  <Badge key={g} variant="outline" className="border-[var(--brand-400)] bg-[var(--brand-100)] text-[var(--brand-700)] text-xs">
                    {goalLabels[g]}
                  </Badge>
                ))
              : <span className="text-sm text-[var(--neutral-400)]">No goals selected</span>}
          </div>
        </CardContent>
      </Card>

      {/* Campaign Setup Card */}
      <Card className="border-[var(--neutral-200)] shadow-light-top">
        <CardContent className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-[var(--neutral-800)]">⚙️ Campaign Setup</h3>
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-[var(--brand-700)] hover:text-[var(--brand-800)]"
              onClick={() => onBack(2)}
            >
              Edit
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-[var(--neutral-500)]">Mode</p>
              <p className="font-medium text-[var(--neutral-800)] capitalize">
                {draft.mode === "debut" ? "Debut Collabs" : draft.mode ? `${draft.mode} Campaign` : "—"}
              </p>
            </div>
            <div>
              <p className="text-[var(--neutral-500)]">Content Formats</p>
              <div className="flex gap-1.5 mt-0.5 flex-wrap">
                {draft.contentFormats.map((f) => (
                  <Badge key={f} variant="outline" className="border-[var(--neutral-200)] text-xs">
                    {formatLabel[f]}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Compensation Card */}
      {enabledComps.length > 0 && (
        <Card className="border-[var(--neutral-200)] shadow-light-top">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-[var(--neutral-800)]">💰 Compensation</h3>
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-[var(--brand-700)] hover:text-[var(--brand-800)]"
                onClick={() => onBack(2)}
              >
                Edit
              </Button>
            </div>
            <div className="space-y-2">
              {enabledComps.map((comp) => {
                let detail = "";
                if (comp.type === "gifted" && comp.productName)
                  detail = ` — ${comp.productName} (~$${comp.estValuePerUnit || 0}/unit)`;
                if (comp.type === "gift_card" && comp.giftCardValue)
                  detail = ` — $${comp.giftCardValue}${comp.giftCardBrand ? ` at ${comp.giftCardBrand}` : ""}`;
                if (comp.type === "paid" && comp.feeMin)
                  detail = ` — $${comp.feeMin}${comp.feeMax ? `–$${comp.feeMax}` : ""}/creator`;
                if (comp.type === "commission_boost" && comp.commissionRate)
                  detail = ` — ${comp.commissionRate}%`;
                return (
                  <p key={comp.type} className="text-sm text-[var(--neutral-800)]">
                    {compLabels[comp.type]}{detail}
                  </p>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Brief Card */}
      <Card className="border-[var(--neutral-200)] shadow-light-top">
        <CardContent className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-[var(--neutral-800)]">📝 Campaign Brief</h3>
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-[var(--brand-700)] hover:text-[var(--brand-800)]"
              onClick={() => onBack(3)}
            >
              Edit
            </Button>
          </div>
          <p className="text-sm text-[var(--neutral-800)] line-clamp-3">
            {draft.description || "No description provided."}
          </p>
        </CardContent>
      </Card>

      {/* Creator Obligations Card */}
      <Card className="border-[var(--neutral-200)] shadow-light-top">
        <CardContent className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-[var(--neutral-800)]">📋 Creator Obligations</h3>
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-[var(--brand-700)] hover:text-[var(--brand-800)]"
              onClick={() => onBack(3)}
            >
              Edit
            </Button>
          </div>
          {enabledObligations.length > 0 || draft.customObligations.length > 0 ? (
            <div className="space-y-1.5">
              {enabledObligations.map((o) => (
                <div key={o.id} className="flex items-center gap-2 text-sm">
                  <Check className="size-3.5 text-[var(--green-700)]" />
                  <span className="text-[var(--neutral-800)]">{o.label}</span>
                </div>
              ))}
              {draft.customObligations.map((co, idx) => (
                <div key={`custom-${idx}`} className="flex items-center gap-2 text-sm">
                  <Check className="size-3.5 text-[var(--green-700)]" />
                  <span className="text-[var(--neutral-800)]">{co}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-[var(--neutral-400)]">No obligations set</p>
          )}
        </CardContent>
      </Card>

      {/* Content Niche & Creators Card */}
      <Card className="border-[var(--neutral-200)] shadow-light-top">
        <CardContent className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-[var(--neutral-800)]">🎨 Content Niche & Creators</h3>
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-[var(--brand-700)] hover:text-[var(--brand-800)]"
              onClick={() => onBack(3)}
            >
              Edit
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-[var(--neutral-500)]">Niches</p>
              <div className="flex flex-wrap gap-1 mt-1">
                {draft.contentNiches.length > 0
                  ? draft.contentNiches.map((n) => (
                      <Badge key={n} variant="outline" className="border-[var(--neutral-200)] text-xs">
                        {n}
                      </Badge>
                    ))
                  : <span className="text-[var(--neutral-400)]">—</span>}
              </div>
            </div>
            <div>
              <p className="text-[var(--neutral-500)]">Number of Creators</p>
              <p className="font-medium text-[var(--neutral-800)]">
                {draft.creatorCount || "—"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ═══════════════════════════════════════════════════
// AI MATCHING SCREEN (animated "finding creators" state)
// ═══════════════════════════════════════════════════
const AI_STEPS = [
  { label: "Analyzing your brand vibe", icon: Brain, duration: 2000 },
  { label: "Scanning creator network", icon: Users, duration: 2500 },
  { label: "Filtering by content niche", icon: Search, duration: 2000 },
  { label: "Predicting engagement & ROI", icon: Zap, duration: 2500 },
  { label: "Finalizing recommendations", icon: Sparkles, duration: 2000 },
];

function AIMatchingScreen() {
  const [activeStep, setActiveStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const totalDuration = AI_STEPS.reduce((sum, s) => sum + s.duration, 0);
    let elapsed = 0;

    const timers: ReturnType<typeof setTimeout>[] = [];

    AI_STEPS.forEach((step, idx) => {
      const timer = setTimeout(() => {
        setActiveStep(idx);
      }, elapsed);
      timers.push(timer);
      elapsed += step.duration;
    });

    // Progress bar animation
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 100;
        return prev + 100 / (totalDuration / 80);
      });
    }, 80);

    // Navigate after done
    const navTimer = setTimeout(() => {
      navigate("/campaigns/camp-001/find-talent");
    }, totalDuration + 1500);
    timers.push(navTimer);

    return () => {
      timers.forEach(clearTimeout);
      clearInterval(progressInterval);
    };
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center py-16">
      {/* Animated brand circle */}
      <div className="relative mb-8">
        <div
          className="flex h-24 w-24 items-center justify-center rounded-full bg-[var(--brand-100)]"
          style={{
            animation: "pulse 2s ease-in-out infinite",
            boxShadow: "0 0 0 12px var(--brand-0), 0 0 0 24px rgba(174, 148, 249, 0.1)",
          }}
        >
          <Sparkles className="size-10 text-[var(--brand-700)]" />
        </div>
      </div>

      <h2 className="text-2xl font-bold text-[var(--neutral-800)] mb-2">
        Benable AI is finding your creators
      </h2>
      <p className="max-w-md text-center text-sm text-[var(--neutral-500)] mb-8">
        We're matching your campaign with the best creators on our network. You'll be notified when we have recommended creators for you.
      </p>

      {/* Progress bar */}
      <div className="w-full max-w-md mb-8">
        <div className="h-2 w-full rounded-full bg-[var(--neutral-100)] overflow-hidden">
          <div
            className="h-full rounded-full transition-all"
            style={{
              width: `${Math.min(progress, 100)}%`,
              backgroundColor: "var(--brand-700)",
              transition: "width 0.15s linear",
            }}
          />
        </div>
        <p className="mt-2 text-center text-xs text-[var(--neutral-400)]">
          {Math.min(Math.round(progress), 100)}% complete
        </p>
      </div>

      {/* Step-by-step status */}
      <div className="w-full max-w-sm space-y-3 mb-10">
        {AI_STEPS.map((step, idx) => {
          const isActive = idx === activeStep;
          const isDone = idx < activeStep;
          const isPending = idx > activeStep;
          return (
            <div
              key={idx}
              className="flex items-center gap-3 rounded-lg px-4 py-2.5 transition-all"
              style={{
                backgroundColor: isActive ? "var(--brand-0)" : "transparent",
                border: isActive ? "1px solid var(--brand-300)" : "1px solid transparent",
                opacity: isPending ? 0.4 : 1,
              }}
            >
              <div
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-all"
                style={{
                  backgroundColor: isDone ? "var(--green-100)" : isActive ? "var(--brand-100)" : "var(--neutral-100)",
                }}
              >
                {isDone ? (
                  <Check className="size-3.5 text-[var(--green-700)]" />
                ) : (
                  <step.icon className="size-3.5" style={{ color: isActive ? "var(--brand-700)" : "var(--neutral-400)" }} />
                )}
              </div>
              <span
                className="text-sm font-medium"
                style={{
                  color: isDone ? "var(--green-700)" : isActive ? "var(--brand-700)" : "var(--neutral-400)",
                }}
              >
                {step.label}
              </span>
              {isActive && (
                <div className="ml-auto flex gap-0.5">
                  <span className="inline-block h-1.5 w-1.5 animate-bounce rounded-full bg-[var(--brand-700)]" style={{ animationDelay: "0ms" }} />
                  <span className="inline-block h-1.5 w-1.5 animate-bounce rounded-full bg-[var(--brand-700)]" style={{ animationDelay: "150ms" }} />
                  <span className="inline-block h-1.5 w-1.5 animate-bounce rounded-full bg-[var(--brand-700)]" style={{ animationDelay: "300ms" }} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Feature cards */}
      <div className="grid w-full max-w-lg grid-cols-3 gap-3">
        {[
          { icon: Eye, title: "Brand Match", desc: "Creators aligned with your aesthetic" },
          { icon: Shield, title: "Quality Check", desc: "Verified authentic engagement" },
          { icon: Zap, title: "ROI Prediction", desc: "Estimated campaign performance" },
        ].map((card, idx) => (
          <div
            key={idx}
            className="flex flex-col items-center gap-2 rounded-xl border border-[var(--neutral-200)] bg-white p-4 text-center"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--brand-100)]">
              <card.icon className="size-4 text-[var(--brand-700)]" />
            </div>
            <p className="text-xs font-semibold text-[var(--neutral-800)]">{card.title}</p>
            <p className="text-[10px] text-[var(--neutral-500)]">{card.desc}</p>
          </div>
        ))}
      </div>

      {/* Pulse animation keyframes */}
      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
      `}</style>
    </div>
  );
}

// ═══════════════════════════════════════════════════
// MAIN CREATE CAMPAIGN PAGE
// ═══════════════════════════════════════════════════
const STEP_LABELS = ["Campaign Goals", "Campaign Details", "Campaign Brief", "Review & Launch"];

export default function CreateCampaign() {
  const [step, setStep] = useState(1);
  const [draft, setDraft] = useState<CampaignDraft>({ ...emptyCampaignDraft });
  const [launched, setLaunched] = useState(false);

  const totalSteps = 4;
  const goNext = () => setStep((s) => Math.min(s + 1, totalSteps));
  const goBack = () => setStep((s) => Math.max(s - 1, 1));
  const goToStep = (s: number) => setStep(s);

  const handleLaunch = () => {
    setLaunched(true);
  };

  if (launched) {
    return <AIMatchingScreen />;
  }

  // Button labels per step
  const nextLabel = (() => {
    switch (step) {
      case 1: return "Next: Campaign Details";
      case 2: return "Next: Write Your Brief";
      case 3: return "Review Campaign";
      default: return "";
    }
  })();

  // Can proceed? Step 1 requires at least one goal
  const canProceed = (() => {
    if (step === 1) return draft.goals.length > 0;
    if (step === 2) return !!draft.mode;
    return true;
  })();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[28px] font-bold text-[var(--neutral-800)]">
            Create Campaign
          </h1>
          <p className="mt-1 text-sm text-[var(--neutral-600)]">
            Set up a new creator collaboration campaign.
          </p>
        </div>
      </div>

      <StepIndicator currentStep={step} totalSteps={totalSteps} stepLabel={STEP_LABELS[step - 1]} />

      {step === 1 && <StepGoals draft={draft} setDraft={setDraft} />}
      {step === 2 && <StepDetails draft={draft} setDraft={setDraft} />}
      {step === 3 && <StepBrief draft={draft} setDraft={setDraft} />}
      {step === 4 && <StepReview draft={draft} onBack={goToStep} />}

      {/* Navigation buttons */}
      <div className="flex items-center justify-between pt-4 border-t border-[var(--neutral-200)]">
        {step > 1 ? (
          <Button
            variant="outline"
            className="gap-2 border-[var(--neutral-200)]"
            onClick={goBack}
          >
            <ArrowLeft className="size-4" /> Back
          </Button>
        ) : (
          <div />
        )}

        {step < totalSteps ? (
          <Button
            className="gap-2 bg-[var(--brand-700)] hover:bg-[var(--brand-800)]"
            onClick={goNext}
            disabled={!canProceed}
          >
            {nextLabel}
            <ArrowRight className="size-4" />
          </Button>
        ) : (
          <Button
            className="gap-2 bg-[var(--brand-700)] hover:bg-[var(--brand-800)]"
            onClick={handleLaunch}
          >
            <Sparkles className="size-4" /> Launch & Find Creators
          </Button>
        )}
      </div>
    </div>
  );
}
