import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Globe,
  Target,
  ArrowRight,
  ArrowLeft,
  Check,
  Upload,
  Rocket,
  Gift,
  CreditCard,
  Tag,
  DollarSign,
  TrendingUp,
} from "lucide-react";
import {
  emptyCampaignDraft,
  type CampaignDraft,
  type CampaignMode,
  type CampaignGoal,
  type BudgetType,
  type CompensationType,
  type ContentRequirement,
  type CreatorCountTarget,
} from "@/store/campaign-store";

// ─── Step indicator ───
function StepIndicator({ currentStep }: { currentStep: number }) {
  const steps = ["Campaign Setup", "Campaign Brief", "Review & Launch"];
  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {steps.map((label, i) => {
        const stepNum = i + 1;
        const isComplete = stepNum < currentStep;
        const isCurrent = stepNum === currentStep;
        return (
          <div key={label} className="flex items-center gap-2">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-colors ${
                isComplete
                  ? "bg-[var(--green-500)] text-white"
                  : isCurrent
                    ? "bg-[var(--brand-700)] text-white"
                    : "bg-[var(--brand-100)] text-[var(--brand-700)]"
              }`}
            >
              {isComplete ? <Check className="size-4" /> : stepNum}
            </div>
            <span
              className={`text-sm ${
                isCurrent ? "font-bold text-[var(--neutral-800)]" : "text-[var(--neutral-500)]"
              }`}
            >
              {label}
            </span>
            {i < steps.length - 1 && (
              <div
                className={`mx-2 h-px w-12 ${
                  isComplete ? "bg-[var(--green-500)]" : "bg-[var(--neutral-200)]"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Budget bar (persistent) ───
function BudgetBar({ draft }: { draft: CampaignDraft }) {
  if (draft.budgetType === "flexible" || !draft.budgetType) return null;

  const cap =
    draft.budgetType === "spend_cap"
      ? draft.budgetCapAmount || 0
      : draft.budgetInventoryCount || 0;
  const allocated = 0; // Will be calculated at assignment time
  const percent = cap > 0 ? Math.round((allocated / cap) * 100) : 0;
  const label =
    draft.budgetType === "spend_cap"
      ? `$${allocated.toLocaleString()} / $${cap.toLocaleString()}`
      : `${allocated} / ${cap} units`;

  return (
    <div className="mb-6 rounded-lg border border-[var(--neutral-200)] bg-[var(--neutral-100)] p-4">
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="text-[var(--neutral-600)]">Budget</span>
        <span className="font-medium text-[var(--neutral-800)]">
          {label} allocated
        </span>
      </div>
      <Progress value={percent} className="h-2 bg-[var(--neutral-200)]" />
    </div>
  );
}

// ═══════════════════════════════════════════════════
// STEP 1: Campaign Setup
// ═══════════════════════════════════════════════════
function Step1({
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

  const goalOptions: { value: CampaignGoal; label: string }[] = [
    { value: "awareness", label: "Brand Awareness" },
    { value: "sales", label: "Drive Sales / Traffic" },
    { value: "product_launch", label: "Product Launch" },
    { value: "ugc", label: "Content / UGC Generation" },
  ];

  const categoryOptions = [
    "Beauty", "Wellness", "Lifestyle", "Fashion", "Home", "Food", "Travel", "Tech", "Fitness", "Pets",
  ];

  const compensationIcons: Record<CompensationType, React.ReactNode> = {
    gifted: <Gift className="size-4" />,
    gift_card: <CreditCard className="size-4" />,
    discount: <Tag className="size-4" />,
    paid: <DollarSign className="size-4" />,
    commission_boost: <TrendingUp className="size-4" />,
  };

  const compensationLabels: Record<CompensationType, string> = {
    gifted: "Gifted Product",
    gift_card: "Gift Card",
    discount: "Discount Code",
    paid: "Paid Fee",
    commission_boost: "Commission Boost",
  };

  return (
    <div className="space-y-8">
      {/* Campaign Mode */}
      <div>
        <Label className="mb-3 block text-base font-bold text-[var(--neutral-800)]">
          Choose your campaign mode
        </Label>
        <div className="grid grid-cols-2 gap-4">
          <Card
            className={`cursor-pointer border-2 transition-all ${
              draft.mode === "open"
                ? "border-[var(--brand-700)] bg-[var(--brand-0)] shadow-light-top"
                : "border-[var(--neutral-200)] hover:border-[var(--brand-400)]"
            }`}
            onClick={() => update("mode", "open" as CampaignMode)}
          >
            <CardContent className="p-5">
              <div className="flex items-center gap-2 mb-2">
                <Globe className="size-5 text-[var(--brand-700)]" />
                <span className="font-bold text-[var(--neutral-800)]">Open Campaign</span>
              </div>
              <p className="text-sm text-[var(--neutral-600)]">
                Broadcast to matching creators. They apply, you select.
              </p>
              <p className="mt-2 text-xs text-[var(--neutral-500)]">
                Best for: awareness, UGC at scale, discovering new creators
              </p>
            </CardContent>
          </Card>

          <Card
            className={`cursor-pointer border-2 transition-all ${
              draft.mode === "targeted"
                ? "border-[var(--brand-700)] bg-[var(--brand-0)] shadow-light-top"
                : "border-[var(--neutral-200)] hover:border-[var(--brand-400)]"
            }`}
            onClick={() => update("mode", "targeted" as CampaignMode)}
          >
            <CardContent className="p-5">
              <div className="flex items-center gap-2 mb-2">
                <Target className="size-5 text-[var(--brand-700)]" />
                <span className="font-bold text-[var(--neutral-800)]">Targeted Campaign</span>
              </div>
              <p className="text-sm text-[var(--neutral-600)]">
                Hand-pick specific creators or invite from your network. More control, more personal.
              </p>
              <p className="mt-2 text-xs text-[var(--neutral-500)]">
                Best for: product launches, specific aesthetics, ongoing relationships
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Campaign Basics */}
      {draft.mode && (
        <>
          <Separator className="bg-[var(--neutral-200)]" />

          <div className="space-y-5">
            <h3 className="text-base font-bold text-[var(--neutral-800)]">Campaign Basics</h3>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-[var(--neutral-800)]">
                Campaign Title <span className="text-[var(--red-500)]">*</span>
              </Label>
              <Input
                placeholder="e.g., Summer Glow Collection Launch"
                className="border-[var(--neutral-200)] focus:border-[var(--brand-700)]"
                value={draft.title}
                onChange={(e) => update("title", e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-[var(--neutral-800)]">
                  Campaign Goal <span className="text-[var(--red-500)]">*</span>
                </Label>
                <Select
                  value={draft.goal || ""}
                  onValueChange={(v) => update("goal", v as CampaignGoal)}
                >
                  <SelectTrigger className="border-[var(--neutral-200)]">
                    <SelectValue placeholder="Select a goal..." />
                  </SelectTrigger>
                  <SelectContent>
                    {goalOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-[var(--neutral-800)]">
                  Platforms <span className="text-[var(--red-500)]">*</span>
                </Label>
                <div className="flex flex-col gap-2 pt-1">
                  <div className="flex items-center gap-2">
                    <Checkbox checked disabled className="data-[state=checked]:bg-[var(--brand-700)] data-[state=checked]:border-[var(--brand-700)]" />
                    <span className="text-sm text-[var(--neutral-800)]">Benable</span>
                    <Badge className="border-0 bg-[var(--brand-100)] text-[var(--brand-700)] text-[10px]">
                      Always included
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={draft.platforms.includes("instagram")}
                      onCheckedChange={(checked) => {
                        if (checked) update("platforms", [...draft.platforms, "instagram"]);
                        else update("platforms", draft.platforms.filter((p) => p !== "instagram"));
                      }}
                      className="data-[state=checked]:bg-[var(--brand-700)] data-[state=checked]:border-[var(--brand-700)]"
                    />
                    <span className="text-sm text-[var(--neutral-800)]">Instagram</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={draft.platforms.includes("tiktok")}
                      onCheckedChange={(checked) => {
                        if (checked) update("platforms", [...draft.platforms, "tiktok"]);
                        else update("platforms", draft.platforms.filter((p) => p !== "tiktok"));
                      }}
                      className="data-[state=checked]:bg-[var(--brand-700)] data-[state=checked]:border-[var(--brand-700)]"
                    />
                    <span className="text-sm text-[var(--neutral-800)]">TikTok</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Budget Anchoring */}
          <Separator className="bg-[var(--neutral-200)]" />

          <div className="space-y-4">
            <h3 className="text-base font-bold text-[var(--neutral-800)]">
              Budget Anchoring
            </h3>
            <p className="text-sm text-[var(--neutral-500)]">
              How would you like to set your campaign budget?
            </p>

            <div className="space-y-3">
              {([
                {
                  value: "spend_cap" as BudgetType,
                  label: "Total spend cap",
                  desc: "I have a fixed dollar amount to invest in this campaign.",
                },
                {
                  value: "product_inventory" as BudgetType,
                  label: "Product inventory",
                  desc: "I have a set number of products to gift.",
                },
                {
                  value: "flexible" as BudgetType,
                  label: "I'll decide as I go",
                  desc: "I want flexibility to set compensation per creator.",
                },
              ]).map((opt) => (
                <Card
                  key={opt.value}
                  className={`cursor-pointer border transition-all ${
                    draft.budgetType === opt.value
                      ? "border-[var(--brand-700)] bg-[var(--brand-0)]"
                      : "border-[var(--neutral-200)] hover:border-[var(--brand-400)]"
                  }`}
                  onClick={() => update("budgetType", opt.value)}
                >
                  <CardContent className="flex items-start gap-3 p-4">
                    <div
                      className={`mt-0.5 flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                        draft.budgetType === opt.value
                          ? "border-[var(--brand-700)] bg-[var(--brand-700)]"
                          : "border-[var(--neutral-300)]"
                      }`}
                    >
                      {draft.budgetType === opt.value && (
                        <div className="h-2 w-2 rounded-full bg-white" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-[var(--neutral-800)]">
                        {opt.label}
                      </p>
                      <p className="text-xs text-[var(--neutral-500)]">{opt.desc}</p>

                      {/* Inline fields */}
                      {draft.budgetType === "spend_cap" && opt.value === "spend_cap" && (
                        <div className="mt-3">
                          <Input
                            type="number"
                            placeholder="e.g., 5000"
                            className="w-48 border-[var(--neutral-200)]"
                            value={draft.budgetCapAmount || ""}
                            onChange={(e) =>
                              update("budgetCapAmount", Number(e.target.value))
                            }
                            onClick={(e) => e.stopPropagation()}
                          />
                        </div>
                      )}
                      {draft.budgetType === "product_inventory" &&
                        opt.value === "product_inventory" && (
                          <div className="mt-3 flex items-center gap-3">
                            <Input
                              type="number"
                              placeholder="Units"
                              className="w-24 border-[var(--neutral-200)]"
                              value={draft.budgetInventoryCount || ""}
                              onChange={(e) =>
                                update("budgetInventoryCount", Number(e.target.value))
                              }
                              onClick={(e) => e.stopPropagation()}
                            />
                            <span className="text-sm text-[var(--neutral-500)]">units of</span>
                            <Input
                              placeholder="Product name"
                              className="flex-1 border-[var(--neutral-200)]"
                              value={draft.budgetProductName || ""}
                              onChange={(e) => update("budgetProductName", e.target.value)}
                              onClick={(e) => e.stopPropagation()}
                            />
                          </div>
                        )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Mode-specific fields */}
          {draft.mode === "open" && (
            <>
              <Separator className="bg-[var(--neutral-200)]" />
              <div className="space-y-5">
                <h3 className="text-base font-bold text-[var(--neutral-800)]">
                  Open Campaign Settings
                </h3>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-[var(--neutral-800)]">
                    Number of Creators
                  </Label>
                  <Select
                    value={draft.creatorCountTarget || ""}
                    onValueChange={(v) => update("creatorCountTarget", v as CreatorCountTarget)}
                  >
                    <SelectTrigger className="w-64 border-[var(--neutral-200)]">
                      <SelectValue placeholder="Select range..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5-15">5-15 (Standard)</SelectItem>
                      <SelectItem value="15-30">15-30 (Large)</SelectItem>
                      <SelectItem value="30+">30+ (Scale)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-[var(--neutral-800)]">
                    Creator Categories
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    {categoryOptions.map((cat) => {
                      const selected = draft.creatorCategories.includes(cat);
                      return (
                        <Badge
                          key={cat}
                          className={`cursor-pointer px-3 py-1.5 text-sm transition-colors ${
                            selected
                              ? "bg-[var(--brand-700)] text-white hover:bg-[var(--brand-800)]"
                              : "bg-white text-[var(--neutral-600)] border border-[var(--neutral-200)] hover:border-[var(--brand-400)] hover:text-[var(--brand-700)]"
                          }`}
                          onClick={() =>
                            update(
                              "creatorCategories",
                              selected
                                ? draft.creatorCategories.filter((c) => c !== cat)
                                : [...draft.creatorCategories, cat]
                            )
                          }
                        >
                          {selected && <Check className="mr-1 size-3" />}
                          {cat}
                        </Badge>
                      );
                    })}
                  </div>
                </div>
              </div>
            </>
          )}

          {draft.mode === "targeted" && (
            <>
              <Separator className="bg-[var(--neutral-200)]" />
              <div className="space-y-5">
                <h3 className="text-base font-bold text-[var(--neutral-800)]">
                  Select Creators
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <Card className="cursor-pointer border-[var(--neutral-200)] hover:border-[var(--brand-400)] transition-all">
                    <CardContent className="flex flex-col items-center gap-2 p-6 text-center">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--brand-100)]">
                        <Target className="size-5 text-[var(--brand-700)]" />
                      </div>
                      <p className="text-sm font-medium text-[var(--neutral-800)]">
                        Browse Benable Creators
                      </p>
                      <p className="text-xs text-[var(--neutral-500)]">
                        Search and select from our creator network
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="cursor-pointer border-[var(--neutral-200)] hover:border-[var(--brand-400)] transition-all">
                    <CardContent className="flex flex-col items-center gap-2 p-6 text-center">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--neutral-100)]">
                        <Upload className="size-5 text-[var(--neutral-600)]" />
                      </div>
                      <p className="text-sm font-medium text-[var(--neutral-800)]">
                        I have specific creators
                      </p>
                      <p className="text-xs text-[var(--neutral-500)]">
                        Enter handles or names directly
                      </p>
                    </CardContent>
                  </Card>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-[var(--neutral-800)]">
                    Creator handles or names
                  </Label>
                  <Input
                    placeholder="@handle1, @handle2, ..."
                    className="border-[var(--neutral-200)]"
                  />
                </div>
              </div>
            </>
          )}

          {/* Compensation Types */}
          <Separator className="bg-[var(--neutral-200)]" />

          <div className="space-y-4">
            <div>
              <h3 className="text-base font-bold text-[var(--neutral-800)]">
                Compensation
              </h3>
              <p className="text-sm text-[var(--neutral-500)]">
                What compensation will you offer creators? Select all that apply.
              </p>
            </div>

            <div className="space-y-3">
              {draft.compensationTypes.map((comp) => (
                <Card
                  key={comp.type}
                  className={`border transition-all ${
                    comp.enabled
                      ? "border-[var(--brand-700)] bg-[var(--brand-0)]"
                      : "border-[var(--neutral-200)]"
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Checkbox
                        checked={comp.enabled}
                        onCheckedChange={(checked) =>
                          toggleCompensation(comp.type, !!checked)
                        }
                        className="mt-0.5 data-[state=checked]:bg-[var(--brand-700)] data-[state=checked]:border-[var(--brand-700)]"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[var(--brand-700)]">
                            {compensationIcons[comp.type]}
                          </span>
                          <span className="text-sm font-medium text-[var(--neutral-800)]">
                            {compensationLabels[comp.type]}
                          </span>
                        </div>

                        {/* Inline fields when enabled */}
                        {comp.enabled && comp.type === "gifted" && (
                          <div className="mt-3 grid grid-cols-3 gap-3">
                            <div className="space-y-1">
                              <Label className="text-xs text-[var(--neutral-500)]">Product name</Label>
                              <Input
                                placeholder="e.g., Melted Balm"
                                className="h-8 text-sm border-[var(--neutral-200)]"
                                value={comp.productName || ""}
                                onChange={(e) =>
                                  updateCompensation(comp.type, "productName", e.target.value)
                                }
                              />
                            </div>
                            <div className="space-y-1">
                              <Label className="text-xs text-[var(--neutral-500)]">Product URL</Label>
                              <Input
                                placeholder="https://..."
                                className="h-8 text-sm border-[var(--neutral-200)]"
                                value={comp.productUrl || ""}
                                onChange={(e) =>
                                  updateCompensation(comp.type, "productUrl", e.target.value)
                                }
                              />
                            </div>
                            <div className="space-y-1">
                              <Label className="text-xs text-[var(--neutral-500)]">Est. value/unit</Label>
                              <Input
                                type="number"
                                placeholder="$35"
                                className="h-8 text-sm border-[var(--neutral-200)]"
                                value={comp.estValuePerUnit || ""}
                                onChange={(e) =>
                                  updateCompensation(
                                    comp.type,
                                    "estValuePerUnit",
                                    Number(e.target.value)
                                  )
                                }
                              />
                            </div>
                          </div>
                        )}

                        {comp.enabled && comp.type === "gift_card" && (
                          <div className="mt-3 grid grid-cols-3 gap-3">
                            <div className="space-y-1">
                              <Label className="text-xs text-[var(--neutral-500)]">Gift card value</Label>
                              <Input
                                type="number"
                                placeholder="$50"
                                className="h-8 text-sm border-[var(--neutral-200)]"
                                value={comp.giftCardValue || ""}
                                onChange={(e) =>
                                  updateCompensation(comp.type, "giftCardValue", Number(e.target.value))
                                }
                              />
                            </div>
                            <div className="space-y-1">
                              <Label className="text-xs text-[var(--neutral-500)]">Brand/Store</Label>
                              <Input
                                placeholder="e.g., Ulta Beauty"
                                className="h-8 text-sm border-[var(--neutral-200)]"
                                value={comp.giftCardBrand || ""}
                                onChange={(e) =>
                                  updateCompensation(comp.type, "giftCardBrand", e.target.value)
                                }
                              />
                            </div>
                            <div className="space-y-1">
                              <Label className="text-xs text-[var(--neutral-500)]">Delivery</Label>
                              <Select
                                value={comp.giftCardDelivery || "brand_provides"}
                                onValueChange={(v) =>
                                  updateCompensation(comp.type, "giftCardDelivery", v)
                                }
                              >
                                <SelectTrigger className="h-8 text-sm border-[var(--neutral-200)]">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="brand_provides">Brand provides code</SelectItem>
                                  <SelectItem value="benable_sends">Benable sends eGift</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        )}

                        {comp.enabled && comp.type === "discount" && (
                          <div className="mt-3 grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                              <Label className="text-xs text-[var(--neutral-500)]">Discount code</Label>
                              <Input
                                placeholder="e.g., SUMMER20"
                                className="h-8 text-sm border-[var(--neutral-200)]"
                                value={comp.discountCode || ""}
                                onChange={(e) =>
                                  updateCompensation(comp.type, "discountCode", e.target.value)
                                }
                              />
                            </div>
                            <div className="space-y-1">
                              <Label className="text-xs text-[var(--neutral-500)]">Discount amount</Label>
                              <Input
                                placeholder="20% or $10"
                                className="h-8 text-sm border-[var(--neutral-200)]"
                                value={comp.discountAmount || ""}
                                onChange={(e) =>
                                  updateCompensation(comp.type, "discountAmount", Number(e.target.value))
                                }
                              />
                            </div>
                          </div>
                        )}

                        {comp.enabled && comp.type === "paid" && (
                          <div className="mt-3 grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                              <Label className="text-xs text-[var(--neutral-500)]">Min fee/creator</Label>
                              <Input
                                type="number"
                                placeholder="$100"
                                className="h-8 text-sm border-[var(--neutral-200)]"
                                value={comp.feeMin || ""}
                                onChange={(e) =>
                                  updateCompensation(comp.type, "feeMin", Number(e.target.value))
                                }
                              />
                            </div>
                            <div className="space-y-1">
                              <Label className="text-xs text-[var(--neutral-500)]">Max fee/creator</Label>
                              <Input
                                type="number"
                                placeholder="$300"
                                className="h-8 text-sm border-[var(--neutral-200)]"
                                value={comp.feeMax || ""}
                                onChange={(e) =>
                                  updateCompensation(comp.type, "feeMax", Number(e.target.value))
                                }
                              />
                            </div>
                          </div>
                        )}

                        {comp.enabled && comp.type === "commission_boost" && (
                          <div className="mt-3 w-48">
                            <div className="space-y-1">
                              <Label className="text-xs text-[var(--neutral-500)]">Boosted commission rate</Label>
                              <Input
                                type="number"
                                placeholder="15%"
                                className="h-8 text-sm border-[var(--neutral-200)]"
                                value={comp.commissionRate || ""}
                                onChange={(e) =>
                                  updateCompensation(
                                    comp.type,
                                    "commissionRate",
                                    Number(e.target.value)
                                  )
                                }
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════
// STEP 2: Campaign Brief
// ═══════════════════════════════════════════════════
function Step2({
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

  const contentRequirementOptions: { value: ContentRequirement; label: string }[] = [
    { value: "show_product_in_use", label: "Show product in use (not just unboxing)" },
    { value: "include_product_name", label: "Include product name in caption" },
    { value: "tag_brand", label: "Tag @brand handle" },
    { value: "use_hashtags", label: "Use specific hashtags" },
    { value: "well_lit", label: "Film in well-lit environment" },
    { value: "show_labels", label: "Show product labels" },
  ];

  return (
    <div className="space-y-8">
      <BudgetBar draft={draft} />

      <div className="space-y-5">
        <h3 className="text-base font-bold text-[var(--neutral-800)]">Campaign Brief</h3>

        <div className="space-y-2">
          <Label className="text-sm font-medium text-[var(--neutral-800)]">
            Campaign Description <span className="text-[var(--red-500)]">*</span>
          </Label>
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
                Accepts .pdf, .docx. We'll extract key details automatically.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Separator className="bg-[var(--neutral-200)]" />

      <div className="space-y-4">
        <h3 className="text-base font-bold text-[var(--neutral-800)]">Content Requirements</h3>
        <div className="space-y-2.5">
          {contentRequirementOptions.map((req) => {
            const checked = draft.contentRequirements.includes(req.value);
            return (
              <div key={req.value} className="flex items-center gap-3">
                <Checkbox
                  checked={checked}
                  onCheckedChange={(c) =>
                    update(
                      "contentRequirements",
                      c
                        ? [...draft.contentRequirements, req.value]
                        : draft.contentRequirements.filter((r) => r !== req.value)
                    )
                  }
                  className="data-[state=checked]:bg-[var(--brand-700)] data-[state=checked]:border-[var(--brand-700)]"
                />
                <span className="text-sm text-[var(--neutral-800)]">{req.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      <Separator className="bg-[var(--neutral-200)]" />

      <div className="space-y-5">
        <div className="space-y-2">
          <Label className="text-sm font-medium text-[var(--neutral-800)]">
            Hashtags & Tags
          </Label>
          <Input
            placeholder="#yourbrand #ad @yourbrand"
            className="border-[var(--neutral-200)]"
            value={draft.hashtags}
            onChange={(e) => update("hashtags", e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="text-sm font-medium text-[var(--neutral-800)]">
              Start Date <span className="text-[var(--red-500)]">*</span>
            </Label>
            <Input
              type="date"
              className="border-[var(--neutral-200)]"
              value={draft.flightDateStart}
              onChange={(e) => update("flightDateStart", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium text-[var(--neutral-800)]">
              End Date <span className="text-[var(--red-500)]">*</span>
            </Label>
            <Input
              type="date"
              className="border-[var(--neutral-200)]"
              value={draft.flightDateEnd}
              onChange={(e) => update("flightDateEnd", e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between rounded-lg border border-[var(--neutral-200)] p-4">
            <div>
              <p className="text-sm font-medium text-[var(--neutral-800)]">UGC Rights</p>
              <p className="text-xs text-[var(--neutral-500)]">
                Right to repost and reuse creator content
              </p>
            </div>
            <button
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                draft.ugcRights ? "bg-[var(--brand-700)]" : "bg-[var(--neutral-200)]"
              }`}
              onClick={() => update("ugcRights", !draft.ugcRights)}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  draft.ugcRights ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between rounded-lg border border-[var(--neutral-200)] p-4">
            <div>
              <p className="text-sm font-medium text-[var(--neutral-800)]">Content Review</p>
              <p className="text-xs text-[var(--neutral-500)]">
                Approve content before creators post
              </p>
            </div>
            <button
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                draft.contentReviewRequired ? "bg-[var(--brand-700)]" : "bg-[var(--neutral-200)]"
              }`}
              onClick={() =>
                update("contentReviewRequired", !draft.contentReviewRequired)
              }
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  draft.contentReviewRequired ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════
// STEP 3: Review & Launch
// ═══════════════════════════════════════════════════
function Step3({
  draft,
  onBack,
}: {
  draft: CampaignDraft;
  onBack: (step: number) => void;
}) {
  const goalLabels: Record<string, string> = {
    awareness: "Brand Awareness",
    sales: "Drive Sales / Traffic",
    product_launch: "Product Launch",
    ugc: "Content / UGC Generation",
  };

  const compLabels: Record<CompensationType, string> = {
    gifted: "Gifted Product",
    gift_card: "Gift Card",
    discount: "Discount Code",
    paid: "Paid Fee",
    commission_boost: "Commission Boost",
  };

  const enabledComps = draft.compensationTypes.filter((c) => c.enabled);

  return (
    <div className="space-y-6">
      <BudgetBar draft={draft} />

      <div className="rounded-xl border border-[var(--neutral-200)] bg-white shadow-light-top">
        {/* Campaign Setup section */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-[var(--neutral-800)]">Campaign Setup</h3>
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-[var(--brand-700)]"
              onClick={() => onBack(1)}
            >
              Edit
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-[var(--neutral-500)]">Mode</p>
              <p className="font-medium text-[var(--neutral-800)] capitalize">
                {draft.mode} Campaign
              </p>
            </div>
            <div>
              <p className="text-[var(--neutral-500)]">Title</p>
              <p className="font-medium text-[var(--neutral-800)]">
                {draft.title || "—"}
              </p>
            </div>
            <div>
              <p className="text-[var(--neutral-500)]">Goal</p>
              <p className="font-medium text-[var(--neutral-800)]">
                {draft.goal ? goalLabels[draft.goal] : "—"}
              </p>
            </div>
            <div>
              <p className="text-[var(--neutral-500)]">Platforms</p>
              <div className="flex gap-1.5 mt-0.5">
                {draft.platforms.map((p) => (
                  <Badge
                    key={p}
                    variant="outline"
                    className="border-[var(--neutral-200)] text-xs capitalize"
                  >
                    {p}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <p className="text-[var(--neutral-500)]">Budget</p>
              <p className="font-medium text-[var(--neutral-800)]">
                {draft.budgetType === "spend_cap"
                  ? `$${(draft.budgetCapAmount || 0).toLocaleString()} total spend cap`
                  : draft.budgetType === "product_inventory"
                    ? `${draft.budgetInventoryCount || 0} units (${draft.budgetProductName || "product"})`
                    : "Flexible"}
              </p>
            </div>
            {draft.mode === "open" && (
              <div>
                <p className="text-[var(--neutral-500)]">Creators</p>
                <p className="font-medium text-[var(--neutral-800)]">
                  {draft.creatorCountTarget || "—"}
                </p>
              </div>
            )}
          </div>

          {enabledComps.length > 0 && (
            <div className="mt-4">
              <p className="text-sm text-[var(--neutral-500)] mb-2">Compensation</p>
              <div className="space-y-1">
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
                      • {compLabels[comp.type]}{detail}
                    </p>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <Separator className="bg-[var(--neutral-200)]" />

        {/* Brief section */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-[var(--neutral-800)]">Campaign Brief</h3>
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-[var(--brand-700)]"
              onClick={() => onBack(2)}
            >
              Edit
            </Button>
          </div>
          <div className="space-y-3 text-sm">
            <div>
              <p className="text-[var(--neutral-500)]">Description</p>
              <p className="font-medium text-[var(--neutral-800)] line-clamp-3">
                {draft.description || "—"}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[var(--neutral-500)]">Flight Dates</p>
                <p className="font-medium text-[var(--neutral-800)]">
                  {draft.flightDateStart || "—"} — {draft.flightDateEnd || "—"}
                </p>
              </div>
              <div>
                <p className="text-[var(--neutral-500)]">Hashtags</p>
                <p className="font-medium text-[var(--neutral-800)]">
                  {draft.hashtags || "—"}
                </p>
              </div>
              <div>
                <p className="text-[var(--neutral-500)]">UGC Rights</p>
                <p className="font-medium text-[var(--neutral-800)]">
                  {draft.ugcRights ? "Yes" : "No"}
                </p>
              </div>
              <div>
                <p className="text-[var(--neutral-500)]">Content Review</p>
                <p className="font-medium text-[var(--neutral-800)]">
                  {draft.contentReviewRequired ? "Yes" : "No"}
                </p>
              </div>
            </div>
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
  const [step, setStep] = useState(1);
  const [draft, setDraft] = useState<CampaignDraft>({ ...emptyCampaignDraft });
  const [launched, setLaunched] = useState(false);
  const navigate = useNavigate();

  const goNext = () => setStep((s) => Math.min(s + 1, 3));
  const goBack = () => setStep((s) => Math.max(s - 1, 1));
  const goToStep = (s: number) => setStep(s);

  const handleLaunch = () => {
    setLaunched(true);
    setTimeout(() => navigate("/campaigns/camp-001"), 2000);
  };

  if (launched) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--green-100)]">
          <Rocket className="size-8 text-[var(--green-500)]" />
        </div>
        <h2 className="mt-6 text-2xl font-bold text-[var(--neutral-800)]">
          Your campaign is live!
        </h2>
        <p className="mt-2 max-w-md text-center text-sm text-[var(--neutral-500)]">
          We're matching you with creators and will notify you when applications arrive. Redirecting to your campaign...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[28px] font-bold text-[var(--neutral-800)]">
          Create Campaign
        </h1>
        <p className="mt-1 text-sm text-[var(--neutral-600)]">
          Set up a new creator collaboration campaign.
        </p>
      </div>

      <StepIndicator currentStep={step} />

      {step === 1 && <Step1 draft={draft} setDraft={setDraft} />}
      {step === 2 && <Step2 draft={draft} setDraft={setDraft} />}
      {step === 3 && <Step3 draft={draft} onBack={goToStep} />}

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

        {step < 3 ? (
          <Button
            className="gap-2 bg-[var(--brand-700)] hover:bg-[var(--brand-800)]"
            onClick={goNext}
            disabled={step === 1 && !draft.mode}
          >
            {step === 1 ? "Next: Write Your Brief" : "Review Campaign"}
            <ArrowRight className="size-4" />
          </Button>
        ) : (
          <Button
            className="gap-2 bg-[var(--brand-700)] hover:bg-[var(--brand-800)]"
            onClick={handleLaunch}
          >
            <Rocket className="size-4" /> Launch Campaign
          </Button>
        )}
      </div>
    </div>
  );
}
