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
  MessageSquare,
  Heart,
  Mail,
  Sliders,
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
                    ? "var(--green-100)"
                    : "transparent",
                cursor: stepNum < currentStep ? "pointer" : "default",
              }}
            >
              <div
                className="flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-all"
                style={{
                  backgroundColor: isComplete
                    ? "var(--green-500)"
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
                      ? "var(--green-700)"
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
                  backgroundColor: isComplete ? "var(--green-300)" : "var(--neutral-200)",
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
        <p className="mt-2 text-[var(--neutral-500)]">
          Select all that apply — we'll tailor the experience for you.
        </p>
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
            <p className="text-sm font-semibold text-[var(--neutral-800)]">Why small creators deliver big results</p>
            <p className="mt-1 text-xs text-[var(--neutral-500)] leading-relaxed">
              Creators with under 10K followers generate 3-5x higher engagement rates than macro influencers.
              Their audiences trust them like friends — and that trust converts.
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
            <div className="flex flex-wrap gap-3">
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

      {/* Creator Obligations — cleaner, grouped by platform, no emoji */}
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

      <Separator className="bg-[var(--neutral-200)]" />

      {/* Content Niche — reference design: search top, selected below with X, suggestions with + */}
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

      <Separator className="bg-[var(--neutral-200)]" />

      {/* Creator Count — redesigned, no increment buttons */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-[var(--neutral-800)]">Creator Count</h3>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 rounded-xl border border-[var(--neutral-200)] bg-[var(--neutral-50)] p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--brand-100)]">
              <Sliders className="size-5 text-[var(--brand-700)]" />
            </div>
            <div>
              <Label className="text-sm font-medium text-[var(--neutral-800)]">How many creators?</Label>
              <p className="text-xs text-[var(--neutral-400)]">We'll recommend the best matches</p>
            </div>
          </div>
          <Select
            value={String(draft.creatorCount || "")}
            onValueChange={(v) => update("creatorCount", Number(v))}
          >
            <SelectTrigger className="w-36 h-12 text-base font-semibold border-[var(--neutral-200)]">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              {[5, 10, 15, 20, 25, 30, 50].map((n) => (
                <SelectItem key={n} value={String(n)}>{n} creators</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════
// STEP 4: Review & Launch — less white, more color
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

  const compLabels: Record<CompensationType, string> = {
    gifted: "Gifted Product", gift_card: "Gift Card", discount: "Discount Code",
    paid: "Paid Fee", commission_boost: "Commission Boost",
  };

  const formatLabel: Record<ContentFormat, string> = {
    instagram_post: "IG Post", instagram_reel: "IG Reel",
    instagram_story: "IG Story", tiktok_video: "TikTok Video",
    benable_post: "Benable Post",
  };

  const enabledComps = draft.compensationTypes.filter((c) => c.enabled);
  const enabledObligations = draft.creatorObligations.filter((o) => o.enabled);

  // Review card component with subtle bg
  const ReviewCard = ({
    title,
    editStep,
    bgColor,
    borderColor,
    children,
  }: {
    title: string;
    editStep: number;
    bgColor: string;
    borderColor: string;
    children: React.ReactNode;
  }) => (
    <Card className="overflow-hidden" style={{ borderColor }}>
      <div className="px-5 py-3 flex items-center justify-between" style={{ backgroundColor: bgColor }}>
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
    <div className="space-y-4">
      <div className="text-center py-2">
        <p className="text-sm text-[var(--neutral-500)] mb-1">Ready to launch</p>
        <h2 className="text-2xl font-bold text-[var(--neutral-800)]">
          {draft.title || "Untitled Campaign"}
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <ReviewCard title="Campaign Goals" editStep={1} bgColor="var(--brand-0)" borderColor="var(--brand-200)">
          <div className="flex flex-wrap gap-1.5">
            {draft.goals.length > 0
              ? draft.goals.map((g) => (
                  <Badge key={g} variant="outline" className="border-[var(--brand-400)] bg-[var(--brand-100)] text-[var(--brand-700)] text-xs">
                    {goalLabels[g]}
                  </Badge>
                ))
              : <span className="text-sm text-[var(--neutral-400)]">No goals selected</span>}
          </div>
        </ReviewCard>

        <ReviewCard title="Campaign Setup" editStep={2} bgColor="var(--blue-100)" borderColor="var(--blue-200)">
          <div className="space-y-3 text-sm">
            <div>
              <p className="text-[var(--neutral-500)] text-xs">Mode</p>
              <p className="font-medium text-[var(--neutral-800)] capitalize">
                {draft.mode === "debut" ? "Debut Collabs" : draft.mode ? `${draft.mode} Campaign` : "—"}
              </p>
            </div>
            <div>
              <p className="text-[var(--neutral-500)] text-xs">Content Formats</p>
              <div className="flex gap-1.5 mt-1 flex-wrap">
                {draft.contentFormats.map((f) => (
                  <Badge key={f} variant="outline" className="border-[var(--neutral-200)] text-[10px]">
                    {formatLabel[f]}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </ReviewCard>

        {enabledComps.length > 0 && (
          <ReviewCard title="Compensation" editStep={2} bgColor="var(--green-100)" borderColor="var(--green-200)">
            <div className="space-y-2">
              {enabledComps.map((comp) => {
                let detail = "";
                if (comp.type === "gifted" && comp.productName) detail = ` — ${comp.productName} (~$${comp.estValuePerUnit || 0}/unit)`;
                if (comp.type === "gift_card" && comp.giftCardValue) detail = ` — $${comp.giftCardValue}${comp.giftCardBrand ? ` at ${comp.giftCardBrand}` : ""}`;
                if (comp.type === "paid" && comp.feeMin) detail = ` — $${comp.feeMin}${comp.feeMax ? `–$${comp.feeMax}` : ""}/creator`;
                if (comp.type === "commission_boost" && comp.commissionRate) detail = ` — ${comp.commissionRate}%`;
                return (
                  <p key={comp.type} className="text-sm text-[var(--neutral-800)]">
                    {compLabels[comp.type]}{detail}
                  </p>
                );
              })}
            </div>
          </ReviewCard>
        )}

        <ReviewCard title="Campaign Brief" editStep={3} bgColor="var(--orange-100)" borderColor="var(--orange-200)">
          <p className="text-sm text-[var(--neutral-800)] line-clamp-4">
            {draft.description || "No description provided."}
          </p>
        </ReviewCard>

        <ReviewCard title="Creator Obligations" editStep={3} bgColor="#F3EEFF" borderColor="#C9B8F0">
          {enabledObligations.length > 0 || draft.customObligations.length > 0 ? (
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
          ) : (
            <p className="text-sm text-[var(--neutral-400)]">No obligations set</p>
          )}
        </ReviewCard>

        <ReviewCard title="Content Niche & Creators" editStep={3} bgColor="var(--neutral-100)" borderColor="var(--neutral-200)">
          <div className="space-y-3 text-sm">
            <div>
              <p className="text-[var(--neutral-500)] text-xs">Niches</p>
              <div className="flex flex-wrap gap-1 mt-1">
                {draft.contentNiches.length > 0
                  ? draft.contentNiches.map((n) => (
                      <Badge key={n} variant="outline" className="border-[var(--neutral-200)] text-[10px]">{n}</Badge>
                    ))
                  : <span className="text-[var(--neutral-400)]">—</span>}
              </div>
            </div>
            <div>
              <p className="text-[var(--neutral-500)] text-xs">Number of Creators</p>
              <p className="font-medium text-[var(--neutral-800)]">{draft.creatorCount || "—"}</p>
            </div>
          </div>
        </ReviewCard>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════
// AI MATCHING SCREEN — slower progress, email message
// ═══════════════════════════════════════════════════
const AI_STEPS = [
  { label: "Analyzing your brand vibe", icon: Brain, duration: 4000 },
  { label: "Scanning creator network", icon: Users, duration: 5000 },
  { label: "Filtering by content niche", icon: Search, duration: 4000 },
  { label: "Predicting engagement & ROI", icon: Zap, duration: 5000 },
  { label: "Finalizing recommendations", icon: Sparkles, duration: 4000 },
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

    // Slower progress bar
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 100;
        return prev + 100 / (totalDuration / 150);
      });
    }, 150);

    // Navigate after done
    const navTimer = setTimeout(() => {
      navigate("/campaigns/camp-001/find-talent");
    }, totalDuration + 2000);
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
          className="flex h-24 w-24 items-center justify-center rounded-2xl bg-[var(--brand-700)]"
          style={{ animation: "pulse 2.5s ease-in-out infinite" }}
        >
          <Sparkles className="size-10 text-white" />
        </div>
      </div>

      <h2 className="text-2xl font-bold text-[var(--neutral-800)] mb-2">
        Benable AI is finding your creators
      </h2>
      <p className="max-w-md text-center text-sm text-[var(--neutral-500)] mb-2">
        We're matching your campaign with the best creators on our network.
      </p>

      {/* Email notification message */}
      <div className="flex items-center gap-2 rounded-full bg-[var(--blue-100)] px-4 py-2 mb-8">
        <Mail className="size-4 text-[var(--blue-700)]" />
        <span className="text-xs font-medium text-[var(--blue-700)]">
          You'll receive an email when your matches are ready
        </span>
      </div>

      {/* Progress bar */}
      <div className="w-full max-w-md mb-8">
        <div className="h-2.5 w-full rounded-full bg-[var(--neutral-100)] overflow-hidden">
          <div
            className="h-full rounded-full transition-all"
            style={{
              width: `${Math.min(progress, 100)}%`,
              background: "var(--brand-600)",
              transition: "width 0.2s linear",
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
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full"
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
              <span className="text-sm font-medium" style={{ color: isDone ? "var(--green-700)" : isActive ? "var(--brand-700)" : "var(--neutral-400)" }}>
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
          { icon: Eye, title: "Brand Match", desc: "Creators aligned with your aesthetic", color: "var(--brand-700)", bg: "var(--brand-100)" },
          { icon: Shield, title: "Quality Check", desc: "Verified authentic engagement", color: "var(--green-600)", bg: "var(--green-100)" },
          { icon: Zap, title: "ROI Prediction", desc: "Estimated campaign performance", color: "var(--orange-500)", bg: "var(--orange-100)" },
        ].map((card, idx) => (
          <div
            key={idx}
            className="flex flex-col items-center gap-2 rounded-xl border border-[var(--neutral-200)] bg-white p-4 text-center"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ backgroundColor: card.bg }}>
              <card.icon className="size-5" style={{ color: card.color }} />
            </div>
            <p className="text-xs font-semibold text-[var(--neutral-800)]">{card.title}</p>
            <p className="text-[10px] text-[var(--neutral-500)]">{card.desc}</p>
          </div>
        ))}
      </div>

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
