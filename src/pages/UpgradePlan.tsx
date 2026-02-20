import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Sparkles, Zap, Crown } from "lucide-react";

const PLANS = [
  {
    name: "Starter",
    price: "Free",
    period: "",
    description: "Perfect for getting started with creator collaborations",
    icon: Sparkles,
    color: "var(--brand-600)",
    bg: "var(--brand-100)",
    current: true,
    features: [
      "Up to 3 active campaigns",
      "10 creator invites per month",
      "Basic analytics",
      "Email support",
      "1 team member",
    ],
  },
  {
    name: "Growth",
    price: "$79",
    period: "/month",
    description: "Scale your creator program with powerful tools",
    icon: Zap,
    color: "var(--brand-700)",
    bg: "var(--brand-100)",
    popular: true,
    features: [
      "Unlimited active campaigns",
      "100 creator invites per month",
      "Advanced analytics & reporting",
      "Priority support",
      "5 team members",
      "AI creator matching",
      "Content rights management",
      "Custom campaign templates",
    ],
  },
  {
    name: "Enterprise",
    price: "$249",
    period: "/month",
    description: "Full-scale creator operations for large brands",
    icon: Crown,
    color: "var(--neutral-800)",
    bg: "var(--neutral-100)",
    features: [
      "Everything in Growth, plus:",
      "Unlimited creator invites",
      "Dedicated account manager",
      "Custom integrations & API access",
      "Unlimited team members",
      "Advanced compliance tools",
      "White-label options",
      "SLA & priority onboarding",
    ],
  },
];

export default function UpgradePlan() {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-[32px] font-bold text-[var(--neutral-800)]">
          Choose your plan
        </h1>
        <p className="mt-2 text-sm text-[var(--neutral-500)]">
          Unlock more features to grow your creator collaborations
        </p>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {PLANS.map((plan) => (
          <Card
            key={plan.name}
            className={`relative border-[var(--neutral-200)] overflow-hidden transition-all hover:shadow-medium-top ${
              plan.popular ? "border-[var(--brand-400)] shadow-medium-top ring-1 ring-[var(--brand-400)]" : ""
            }`}
          >
            {plan.popular && (
              <div className="bg-[var(--brand-700)] px-4 py-1.5 text-center">
                <span className="text-xs font-semibold text-white tracking-wide uppercase">
                  Most Popular
                </span>
              </div>
            )}
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-xl"
                  style={{ backgroundColor: plan.bg }}
                >
                  <plan.icon className="size-5" style={{ color: plan.color }} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[var(--neutral-800)]">{plan.name}</h3>
                </div>
              </div>

              <div className="mb-4">
                <span className="text-3xl font-bold text-[var(--neutral-800)]">{plan.price}</span>
                {plan.period && (
                  <span className="text-sm text-[var(--neutral-500)]">{plan.period}</span>
                )}
              </div>

              <p className="text-sm text-[var(--neutral-500)] mb-6">{plan.description}</p>

              {plan.current ? (
                <Button
                  variant="outline"
                  className="w-full rounded-xl border-[var(--neutral-300)] text-[var(--neutral-600)]"
                  disabled
                >
                  Current Plan
                </Button>
              ) : (
                <Button
                  className={`w-full rounded-xl ${
                    plan.popular
                      ? "bg-[var(--brand-700)] hover:bg-[var(--brand-800)] text-white"
                      : "bg-[var(--neutral-800)] hover:bg-[var(--neutral-900)] text-white"
                  }`}
                >
                  Upgrade to {plan.name}
                </Button>
              )}

              <div className="mt-6 space-y-3">
                {plan.features.map((feature) => (
                  <div key={feature} className="flex items-start gap-2.5">
                    <Check
                      className="size-4 shrink-0 mt-0.5"
                      style={{ color: plan.popular ? "var(--brand-700)" : "var(--green-500)" }}
                    />
                    <span className="text-sm text-[var(--neutral-700)]">{feature}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
