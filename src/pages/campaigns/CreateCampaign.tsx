import { useState, useCallback } from "react";
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
  MessageSquare,
  Heart,
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

// ─── Clickable step indicator (numbered circles like reference) ───
const STEP_LABELS = ["Goals", "Details", "Brief", "Review"];

function StepIndicator({
  currentStep,
  totalSteps,
  onStepClick,
}: {
  currentStep: number;
  totalSteps: number;
  onStepClick: (step: number) => void;
}) {
  return (
    <div className="mb-8 flex items-center justify-center gap-1">
      {Array.from({ length: totalSteps }).map((_, i) => {
        const stepNum = i + 1;
        const isComplete = stepNum < currentStep;
        const isCurrent = stepNum === currentStep;
        const isPast = stepNum <= currentStep;
        return (
          <div key={i} className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => {
                if (stepNum < currentStep) onStepClick(stepNum);
              }}
              className="flex items-center gap-2 rounded-full px-3 py-1.5 transition-all"
              style={{
                backgroundColor: isCurrent
                  ? "var(--brand-100)"
                  : isComplete
                    ? "var(--brand-0)"
                    : "transparent",
                cursor: stepNum < currentStep ? "pointer" : "default",
              }}
            >
              <div
                className="flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-all"
                style={{
                  backgroundColor: isComplete
                    ? "var(--brand-700)"
                    : isCurrent
                      ? "var(--brand-700)"
                      : "var(--neutral-200)",
                  color: isPast ? "white" : "var(--neutral-500)",
                }}
              >
                {isComplete ? <Check className="size-3.5" /> : stepNum}
              </div>
              <span
                className="text-xs font-semibold uppercase tracking-wide"
                style={{
                  color: isCurrent
                    ? "var(--brand-700)"
                    : isComplete
                      ? "var(--brand-600)"
                      : "var(--neutral-400)",
                }}
              >
                {STEP_LABELS[i]}
              </span>
            </button>
            {i < totalSteps - 1 && (
              <div
                className="h-px w-10"
                style={{
                  backgroundColor: isComplete ? "var(--brand-300)" : "var(--neutral-200)",
                }}
              />
            )}
          </div>
        );
      })}
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

// ─── Campaign Goal tiles (icon-based) ───
const GOAL_TILES: {
  value: CampaignGoal;
  icon: React.ElementType;
  title: string;
  description: string;
  color: string;
  bgColor: string;
  borderColor: string;
}[] = [
  {
    value: "word_of_mouth", icon: MessageSquare, title: "Word of Mouth",
    description: "Get genuine recommendations from trusted voices who love your product.",
    color: "var(--brand-700)", bgColor: "var(--brand-100)", borderColor: "var(--brand-400)",
  },
  {
    value: "product_launch", icon: Gift, title: "Product Seeding",
    description: "Send products to creators for authentic reviews and unboxing content.",
    color: "var(--green-700)", bgColor: "var(--green-100)", borderColor: "var(--green-300)",
  },
  {
    value: "ugc", icon: Heart, title: "Authentic UGC",
    description: "Real content from real people who love your product.",
    color: "#C2528B", bgColor: "#FDF2F8", borderColor: "#F9A8D4",
  },
  {
    value: "awareness", icon: Target, title: "Reach a Niche Audience",
    description: "Connect with exactly the right people through influencer partnerships.",
    color: "var(--blue-700)", bgColor: "var(--blue-100)", borderColor: "var(--blue-300)",
  },
  {
    value: "sales", icon: Zap, title: "Drive Sales",
    description: "Generate conversions and revenue through creator-driven promotions.",
    color: "var(--orange-700)", bgColor: "var(--orange-100)", borderColor: "var(--orange-300)",
  },
  {
    value: "community", icon: Users, title: "Build Community",
    description: "Grow a loyal community around your brand with authentic connections.",
    color: "#7B61C2", bgColor: "#F3EEFF", borderColor: "#C9B8F0",
  },
];

// ─── Content Niche suggested tags (grouped) ───
const NICHE_SUGGESTIONS: { label: string; platform?: string }[] = [
  { label: "Lifestyle" }, { label: "Beauty" }, { label: "Skincare" },
  { label: "Fashion" }, { label: "Travel" }, { label: "Wellness" },
  { label: "Fitness" }, { label: "Food & Drink" }, { label: "Home & Decor" },
  { label: "Parenting" }, { label: "Tech" }, { label: "Sustainability" },
  { label: "Pet Care" }, { label: "Self-Care" }, { label: "Haircare" },
  { label: "Fragrance" },
];

// ═══════════════════════════════════════════════════
// STEP 1: Campaign Goals
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
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 rounded-full bg-[var(--brand-100)] px-4 py-1.5 mb-4">
          <Sparkles className="size-4 text-[var(--brand-700)]" />
          <span className="text-sm font-medium text-[var(--brand-700)]">Powered by Benable AI</span>
        </div>
        <h2 className="text-3xl font-bold text-[var(--neutral-800)]">
          What are your campaign goals?
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {GOAL_TILES.map((goal) => {
          const selected = draft.goals.includes(goal.value);
          const GoalIcon = goal.icon;
          return (
            <button
              key={goal.value}
              type="button"
              onClick={() => toggleGoal(goal.value)}
              className="relative flex items-center gap-4 rounded-xl p-4 text-left transition-all"
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
              <div
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
                style={{ backgroundColor: selected ? `${goal.color}20` : goal.bgColor }}
              >
                <GoalIcon className="size-5" style={{ color: goal.color }} />
              </div>
              <div>
                <p className="text-sm font-semibold" style={{ color: selected ? goal.color : "var(--neutral-800)" }}>
                  {goal.title}
                </p>
                <p className="text-xs text-[var(--neutral-500)]">{goal.description}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Value proposition */}
      <div className="mt-8 rounded-xl border border-[var(--neutral-200)] bg-[var(--neutral-100)] p-5">
        <div className="flex items-start gap-3">
          <Brain className="size-5 text-[var(--brand-700)] mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-[var(--neutral-800)]">What makes Benable special</p>
            <p className="mt-1 text-xs text-[var(--neutral-500)] leading-relaxed">
              Benable connects brands with creators who give authentic recommendations to their audience. Their followers trust them — and that trust converts.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════
// STEP 2: Campaign Details
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
    if (isBenable) return;
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
              desc: "Work with rising creators who haven't done brand deals yet.",
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
                onClick={() => { if (!isDisabled) update("mode", opt.mode); }}
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

      {draft.mode && (
        <>
          <Separator className="bg-[var(--neutral-200)]" />

          {/* Campaign Title — more appealing */}
          <div className="space-y-3">
            <Label className="text-base font-bold text-[var(--neutral-800)]">
              Campaign Title <span className="text-[var(--brand-700)]">*</span>
            </Label>
            <Input
              placeholder="e.g., Summer Glow Collection Launch"
              className="border-[var(--neutral-200)] focus:border-[var(--brand-700)] text-base h-12"
              value={draft.title}
              onChange={(e) => update("title", e.target.value)}
            />
            <p className="text-xs text-[var(--neutral-400)]">
              Give your campaign a name that creators will see when they receive your invite.
            </p>
          </div>

          {/* Content Format */}
          <Separator className="bg-[var(--neutral-200)]" />
          <div className="space-y-4">
            <div>
              <h3 className="text-base font-bold text-[var(--neutral-800)]">Content Format</h3>
              <p className="mt-1 text-sm text-[var(--neutral-500)]">
                Select the types of content you'd like creators to produce.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {CONTENT_FORMAT_TILES.map((tile) => {
                const isBenable = tile.value === "benable_post";
                const selected = draft.contentFormats.includes(tile.value);
                return (
                  <button
                    key={tile.value}
                    type="button"
                    onClick={() => toggleContentFormat(tile.value)}
                    className="relative flex items-center gap-3 rounded-xl px-4 py-3 transition-all"
                    style={{
                      backgroundColor: selected ? tile.bgColor : "white",
                      border: `2px solid ${selected ? tile.borderColor : "var(--neutral-200)"}`,
                    }}
                  >
                    {selected && (
                      <div className="flex h-5 w-5 items-center justify-center rounded-full" style={{ backgroundColor: tile.color }}>
                        <Check className="size-3 text-white" />
                      </div>
                    )}
                    <div
                      className="flex h-9 w-9 items-center justify-center rounded-lg"
                      style={{ backgroundColor: tile.iconBg }}
                    >
                      <tile.icon className="size-4" style={{ color: tile.color }} />
                    </div>
                    <span className="text-sm font-semibold" style={{ color: selected ? tile.color : "var(--neutral-700)" }}>
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

          {/* Compensation */}
          <Separator className="bg-[var(--neutral-200)]" />
          <div className="space-y-4">
            <div>
              <h3 className="text-base font-bold text-[var(--neutral-800)]">Compensation Structure</h3>
              <p className="mt-1 text-sm text-[var(--neutral-500)]">
                What will you offer creators? Select all that apply.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              {COMPENSATION_TILES.map((tile) => {
                const comp = draft.compensationTypes.find((c) => c.type === tile.type);
                const active = comp?.enabled ?? false;
                return (
                  <button
                    key={tile.type}
                    type="button"
                    onClick={() => toggleCompensation(tile.type, !active)}
                    className="relative flex items-center gap-3 rounded-xl px-4 py-3 transition-all"
                    style={{
                      backgroundColor: active ? tile.bgColor : "white",
                      border: `2px solid ${active ? tile.borderColor : "var(--neutral-200)"}`,
                    }}
                  >
                    {active && (
                      <div className="flex h-5 w-5 items-center justify-center rounded-full" style={{ backgroundColor: tile.color }}>
                        <Check className="size-3 text-white" />
                      </div>
                    )}
                    <div
                      className="flex h-9 w-9 items-center justify-center rounded-lg"
                      style={{ backgroundColor: tile.iconBg }}
                    >
                      <tile.icon className="size-4" style={{ color: tile.color }} />
                    </div>
                    <span className="text-sm font-semibold" style={{ color: active ? tile.color : "var(--neutral-700)" }}>
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
                      style={{ backgroundColor: tile.bgColor, border: `1px solid ${tile.borderColor}` }}
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <tile.icon className="size-4" style={{ color: tile.color }} />
                        <span className="text-sm font-semibold" style={{ color: tile.color }}>{tile.label}</span>
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
                            <Label className="text-xs text-[var(--neutral-600)]">Product / Brand</Label>
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
// STEP 3: Campaign Brief — redesigned obligations & niche
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
  const [obligationsOpen, setObligationsOpen] = useState(false);

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
    (n) => n.label.toLowerCase().includes(nicheSearch.toLowerCase()) && !draft.contentNiches.includes(n.label)
  );

  // Group obligations by platform — All first, then Instagram, then TikTok
  const platformOrder = ["All", "Instagram", "TikTok", "Benable"];
  const groupedObligations = platformOrder.map((plat) => ({
    platform: plat,
    obligations: draft.creatorObligations.filter((o) => o.platform === plat),
  })).filter((g) => g.obligations.length > 0);

  return (
    <div className="space-y-8">
      {/* Campaign Brief Upload + Description */}
      <div className="space-y-5">
        <h3 className="text-base font-bold text-[var(--neutral-800)]">Campaign Brief</h3>

        <div className="space-y-2">
          <Label className="text-sm font-medium text-[var(--neutral-800)]">
            Upload Brief (optional)
          </Label>
          <div className="flex items-center gap-3 rounded-lg border border-dashed border-[var(--neutral-300)] bg-[var(--neutral-50)] p-4">
            <Upload className="size-5 text-[var(--neutral-400)]" />
            <div>
              <p className="text-sm text-[var(--neutral-600)]">
                Drop your brief here or{" "}
                <span className="cursor-pointer font-medium text-[var(--brand-700)]">browse files</span>
              </p>
              <p className="text-xs text-[var(--neutral-400)]">
                Accepts .pdf, .docx. We'll extract key details automatically.
              </p>
            </div>
          </div>
        </div>

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
            className="flex min-h-[140px] w-full rounded-lg border border-[var(--neutral-200)] bg-white px-3 py-3 text-sm text-[var(--neutral-800)] placeholder:text-[var(--neutral-400)] focus:border-[var(--brand-700)] focus:outline-none focus:ring-1 focus:ring-[var(--brand-700)]"
            placeholder="Describe your product, key talking points, and creative direction..."
            value={draft.description}
            onChange={(e) => update("description", e.target.value)}
          />
          <p className="text-xs text-[var(--neutral-400)]">
            Min 50 characters. {draft.description.length} / 50
          </p>
        </div>
      </div>

      <Separator className="bg-[var(--neutral-200)]" />

      {/* Creator Obligations — collapsible toggle */}
      <div className="space-y-4">
        <Button
          type="button"
          variant="outline"
          className="w-full border-[var(--brand-400)] text-[var(--brand-700)] hover:bg-[var(--brand-0)] justify-start"
          onClick={() => setObligationsOpen(!obligationsOpen)}
        >
          <Sparkles className="size-4 mr-2" />
          Set Creator Obligations
        </Button>

        {obligationsOpen && (
          <div className="space-y-4">
            <div>
              <h3 className="text-base font-bold text-[var(--neutral-800)]">Creator Obligations</h3>
              <p className="mt-1 text-sm text-[var(--neutral-500)]">
                Select requirements creators must fulfill. Click to toggle.
              </p>
            </div>

            {groupedObligations.map((group) => (
              <div key={group.platform}>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-[var(--neutral-400)]">
                  {group.platform}
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {group.obligations.map((obligation) => {
                    const active = obligation.enabled;
                    return (
                      <button
                        key={obligation.id}
                        type="button"
                        onClick={() => toggleObligation(obligation.id)}
                        className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-all"
                        style={{
                          backgroundColor: active ? "var(--brand-0)" : "var(--neutral-50)",
                          border: `1.5px solid ${active ? "var(--brand-400)" : "var(--neutral-200)"}`,
                        }}
                      >
                        <div
                          className="flex h-5 w-5 shrink-0 items-center justify-center rounded transition-all"
                          style={{
                            backgroundColor: active ? "var(--brand-700)" : "white",
                            border: active ? "none" : "1.5px solid var(--neutral-300)",
                          }}
                        >
                          {active && <Check className="size-3 text-white" />}
                        </div>
                        <span className="text-sm text-[var(--neutral-700)]">{obligation.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

            {/* Custom obligations */}
            {draft.customObligations.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wider text-[var(--neutral-400)]">Custom</p>
                <div className="grid grid-cols-2 gap-2">
                  {draft.customObligations.map((co, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 rounded-lg border-[1.5px] border-[var(--brand-400)] bg-[var(--brand-0)] px-3 py-2.5"
                    >
                      <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-[var(--brand-700)]">
                        <Check className="size-3 text-white" />
                      </div>
                      <span className="flex-1 text-sm text-[var(--neutral-700)]">{co}</span>
                      <button type="button" onClick={() => removeCustomObligation(idx)} className="shrink-0 rounded p-0.5 hover:bg-[var(--neutral-100)]">
                        <X className="size-3.5 text-[var(--neutral-400)]" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Add custom — styled like existing obligations */}
            <div className="flex items-center gap-2">
              <div className="flex flex-1 items-center gap-2 rounded-lg border border-dashed border-[var(--neutral-300)] bg-[var(--neutral-50)] px-3 py-2">
                <Plus className="size-4 text-[var(--neutral-400)]" />
                <input
                  className="flex-1 bg-transparent text-sm text-[var(--neutral-700)] placeholder:text-[var(--neutral-400)] outline-none"
                  placeholder="Add a custom obligation..."
                  value={customObligation}
                  onChange={(e) => setCustomObligation(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") { e.preventDefault(); addCustomObligation(); }
                  }}
                />
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="shrink-0 border-[var(--brand-400)] text-[var(--brand-700)] hover:bg-[var(--brand-0)]"
                onClick={addCustomObligation}
                disabled={!customObligation.trim()}
              >
                Add
              </Button>
            </div>
          </div>
        )}
      </div>

      <Separator className="bg-[var(--neutral-200)]" />

      {/* Content Niche + Creator Count side by side */}
      <div className="grid grid-cols-2 gap-6">
        {/* Left column: Content Niche */}
        <div className="space-y-4">
          <div>
            <h3 className="text-base font-bold text-[var(--neutral-800)]">Content Niche</h3>
            <p className="mt-1 text-sm text-[var(--neutral-500)]">
              What content categories should creators be in?
            </p>
          </div>

          {/* Search input at top */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[var(--neutral-400)]" />
            <Input
              placeholder="Search or add a niche..."
              className="border-[var(--neutral-200)] pl-10 text-sm"
              value={nicheSearch}
              onChange={(e) => setNicheSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") { e.preventDefault(); addCustomNiche(nicheSearch); }
              }}
            />
          </div>

          {/* Selected niches — shown as removable tags */}
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

          {/* Suggested tags — with + prefix */}
          <div className="flex flex-wrap gap-2">
            {filteredSuggestions.map((niche) => (
              <button
                key={niche.label}
                type="button"
                onClick={() => toggleNiche(niche.label)}
                className="flex items-center gap-1 rounded-full border border-[var(--neutral-200)] bg-white px-3 py-1.5 text-xs font-medium text-[var(--neutral-600)] transition-all hover:border-[var(--brand-400)] hover:bg-[var(--brand-0)] hover:text-[var(--brand-700)]"
              >
                <Plus className="size-3" />
                {niche.label}
              </button>
            ))}
          </div>
        </div>

        {/* Right column: Creator Count */}
        <div className="space-y-3">
          <h3 className="text-base font-bold text-[var(--neutral-800)]">Creator Count</h3>
          <p className="text-sm text-[var(--neutral-500)]">How many creators for this campaign?</p>
          <Input
            type="number"
            min={1}
            max={100}
            value={draft.creatorCount || ""}
            onChange={(e) => update("creatorCount", Number(e.target.value) || 0)}
            placeholder="e.g. 10"
            className="w-full h-12 text-lg font-semibold border-[var(--neutral-200)]"
          />
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════
// STEP 4: Review & Launch — redesigned 2-column layout
// ═══════════════════════════════════════════════════
function StepReview({
  draft,
  onBack,
}: {
  draft: CampaignDraft;
  onBack: (step: number) => void;
}) {
  const goalLabels: Record<string, string> = {
    awareness: "Brand Awareness", sales: "Drive Sales",
    product_launch: "Product Seeding", ugc: "Content Creation",
    word_of_mouth: "Word of Mouth", community: "Community Building",
  };

  const formatLabel: Record<ContentFormat, string> = {
    instagram_post: "IG Post", instagram_reel: "IG Reel",
    instagram_story: "IG Story", tiktok_video: "TikTok Video",
    benable_post: "Benable Post",
  };

  const enabledComps = draft.compensationTypes.filter((c) => c.enabled);
  const enabledObligations = draft.creatorObligations.filter((o) => o.enabled);

  const ReviewSection = ({
    title,
    editStep,
    children,
  }: {
    title: string;
    editStep: number;
    children: React.ReactNode;
  }) => (
    <Card className="border-[var(--neutral-200)]">
      <div className="px-5 py-3 flex items-center justify-between border-b border-[var(--neutral-100)]">
        <h3 className="text-sm font-bold text-[var(--neutral-800)]">{title}</h3>
        <Button
          variant="ghost"
          size="sm"
          className="text-xs text-[var(--brand-700)] hover:text-[var(--brand-800)] h-7"
          onClick={() => onBack(editStep)}
        >
          Edit
        </Button>
      </div>
      <CardContent className="p-5">{children}</CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[var(--neutral-800)]">
          Review & Launch
        </h2>
        <p className="mt-1 text-sm text-[var(--neutral-500)]">
          Double-check everything before finding your creators.
        </p>
      </div>

      <div className="grid grid-cols-5 gap-5">
        {/* Left column — 3/5 */}
        <div className="col-span-3 space-y-5">
          <ReviewSection title="Campaign Overview" editStep={1}>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-[var(--neutral-500)] mb-1">Campaign Name</p>
                <p className="text-sm font-semibold text-[var(--neutral-800)]">{draft.title || "Untitled Campaign"}</p>
              </div>
              <div>
                <p className="text-xs text-[var(--neutral-500)] mb-1">Description</p>
                <p className="text-sm text-[var(--neutral-700)] leading-relaxed">{draft.description || "No description provided."}</p>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-[var(--neutral-500)] mb-1">Mode</p>
                  <p className="text-sm font-medium text-[var(--neutral-800)] capitalize">
                    {draft.mode === "debut" ? "Debut Collabs" : draft.mode ? `${draft.mode}` : "—"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[var(--neutral-500)] mb-1">Platforms</p>
                  <div className="flex gap-1 flex-wrap">
                    {draft.contentFormats.length > 0 ? (
                      [...new Set(draft.contentFormats.map((f) => f.startsWith("instagram") ? "Instagram" : f.startsWith("tiktok") ? "TikTok" : "Benable"))].map((p) => (
                        <Badge key={p} variant="outline" className="border-[var(--neutral-200)] text-[10px]">{p}</Badge>
                      ))
                    ) : (
                      <span className="text-sm text-[var(--neutral-400)]">—</span>
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-xs text-[var(--neutral-500)] mb-1">Content Formats</p>
                  <div className="flex gap-1 flex-wrap">
                    {draft.contentFormats.map((f) => (
                      <Badge key={f} variant="outline" className="border-[var(--neutral-200)] text-[10px]">{formatLabel[f]}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </ReviewSection>

          <ReviewSection title="Influencer Criteria" editStep={3}>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-[var(--neutral-500)] mb-1">Content Niches</p>
                <div className="flex flex-wrap gap-1.5">
                  {draft.contentNiches.length > 0
                    ? draft.contentNiches.map((n) => (
                        <Badge key={n} className="bg-[var(--brand-100)] text-[var(--brand-700)] border-0 text-xs">{n}</Badge>
                      ))
                    : <span className="text-sm text-[var(--neutral-400)]">No niches selected</span>}
                </div>
              </div>
              <div>
                <p className="text-xs text-[var(--neutral-500)] mb-1">Number of Creators</p>
                <p className="text-sm font-semibold text-[var(--neutral-800)]">{draft.creatorCount || "—"}</p>
              </div>
              {(enabledObligations.length > 0 || draft.customObligations.length > 0) && (
                <div>
                  <p className="text-xs text-[var(--neutral-500)] mb-2">Creator Obligations</p>
                  <div className="space-y-1.5">
                    {enabledObligations.map((o) => (
                      <div key={o.id} className="flex items-center gap-2 text-sm">
                        <Check className="size-3.5 text-[var(--green-700)]" />
                        <span className="text-[var(--neutral-700)]">{o.label}</span>
                      </div>
                    ))}
                    {draft.customObligations.map((co, idx) => (
                      <div key={`custom-${idx}`} className="flex items-center gap-2 text-sm">
                        <Check className="size-3.5 text-[var(--green-700)]" />
                        <span className="text-[var(--neutral-700)]">{co}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </ReviewSection>
        </div>

        {/* Right column — 2/5 */}
        <div className="col-span-2 space-y-5">
          <ReviewSection title="Goals" editStep={1}>
            <div className="space-y-2">
              {draft.goals.length > 0
                ? draft.goals.map((g) => (
                    <div key={g} className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-[var(--brand-600)]" />
                      <span className="text-sm text-[var(--neutral-800)]">{goalLabels[g]}</span>
                    </div>
                  ))
                : <span className="text-sm text-[var(--neutral-400)]">No goals selected</span>}
            </div>
          </ReviewSection>

          <ReviewSection title="Payout" editStep={2}>
            {enabledComps.length > 0 ? (
              <div className="space-y-3">
                {enabledComps.map((comp) => {
                  const tile = COMPENSATION_TILES.find((t) => t.type === comp.type);
                  if (!tile) return null;
                  let detail = "";
                  if (comp.type === "gifted" && comp.productName) detail = `${comp.productName} (~$${comp.estValuePerUnit || 0}/unit)`;
                  if (comp.type === "gift_card" && comp.giftCardValue) detail = `$${comp.giftCardValue}${comp.giftCardBrand ? ` at ${comp.giftCardBrand}` : ""}`;
                  if (comp.type === "paid" && comp.feeMin) detail = `$${comp.feeMin}${comp.feeMax ? `–$${comp.feeMax}` : ""}/creator`;
                  if (comp.type === "commission_boost" && comp.commissionRate) detail = `${comp.commissionRate}%`;
                  return (
                    <div key={comp.type} className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg shrink-0" style={{ backgroundColor: tile.bgColor }}>
                        <tile.icon className="size-4" style={{ color: tile.color }} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[var(--neutral-800)]">{tile.label}</p>
                        {detail && <p className="text-xs text-[var(--neutral-500)]">{detail}</p>}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <span className="text-sm text-[var(--neutral-400)]">No compensation set</span>
            )}
          </ReviewSection>
        </div>
      </div>

      {/* Just one more thing banner */}
      <div className="rounded-xl border border-[var(--yellow-300,#fde68a)] bg-[var(--yellow-100,#fef9c3)] p-5">
        <div className="flex items-start gap-3">
          <span className="text-xl">💡</span>
          <div>
            <p className="text-sm font-bold text-[var(--neutral-800)]">Just one more thing!</p>
            <p className="mt-1 text-sm text-[var(--neutral-600)]">
              Once you launch, Benable will start finding creators that match your campaign. You'll be notified when matches are ready for your review.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════
// MAIN CREATE CAMPAIGN PAGE
// ═══════════════════════════════════════════════════
export default function CreateCampaign() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [draft, setDraft] = useState<CampaignDraft>({ ...emptyCampaignDraft });

  const totalSteps = 4;
  const goNext = () => {
    setStep((s) => Math.min(s + 1, totalSteps));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const goBack = () => setStep((s) => Math.max(s - 1, 1));
  const goToStep = (s: number) => {
    setStep(s);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLaunch = () => {
    navigate("/campaigns/camp-001/find-talent");
  };

  const nextLabel = (() => {
    switch (step) {
      case 1: return "Next: Campaign Details";
      case 2: return "Next: Write Your Brief";
      case 3: return "Review Campaign";
      default: return "";
    }
  })();

  const canProceed = (() => {
    if (step === 1) return draft.goals.length > 0;
    if (step === 2) return !!draft.mode;
    return true;
  })();

  return (
    <div className="space-y-6">
      {/* Page title — no gradient icon */}
      <div>
        <h1 className="text-[28px] font-bold text-[var(--neutral-800)]">
          Create Campaign
        </h1>
        <p className="mt-1 text-sm text-[var(--neutral-500)]">
          Set up a new creator collaboration campaign.
        </p>
      </div>

      {/* Clickable step indicator */}
      <StepIndicator currentStep={step} totalSteps={totalSteps} onStepClick={goToStep} />

      {step === 1 && <StepGoals draft={draft} setDraft={setDraft} />}
      {step === 2 && <StepDetails draft={draft} setDraft={setDraft} />}
      {step === 3 && <StepBrief draft={draft} setDraft={setDraft} />}
      {step === 4 && <StepReview draft={draft} onBack={goToStep} />}

      {/* Navigation buttons — solid colors, no gradients */}
      <div className="flex items-center justify-between pt-4 border-t border-[var(--neutral-200)]">
        {step > 1 ? (
          <Button variant="outline" className="gap-2 border-[var(--neutral-200)]" onClick={goBack}>
            <ArrowLeft className="size-4" /> Back
          </Button>
        ) : (
          <div />
        )}

        {step < totalSteps ? (
          <Button
            className="gap-2 rounded-xl bg-[var(--brand-700)] text-white hover:bg-[var(--brand-800)] transition-colors"
            onClick={goNext}
            disabled={!canProceed}
          >
            {nextLabel}
            <ArrowRight className="size-4" />
          </Button>
        ) : (
          <Button
            className="gap-2 rounded-xl bg-[var(--brand-700)] text-white hover:bg-[var(--brand-800)] transition-colors"
            onClick={handleLaunch}
          >
            <Sparkles className="size-4" /> Launch & Find Creators
          </Button>
        )}
      </div>
    </div>
  );
}
