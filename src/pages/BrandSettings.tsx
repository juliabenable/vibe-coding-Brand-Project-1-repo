import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Settings, Sparkles, TrendingUp } from "lucide-react";

export default function BrandSettings() {
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--neutral-100)]">
          <Settings className="size-6 text-[var(--neutral-500)]" />
        </div>
        <div>
          <h1 className="text-[28px] font-bold text-[var(--neutral-800)]">Brand Settings</h1>
          <p className="text-sm text-[var(--neutral-500)]">
            Manage your brand profile and portal preferences.
          </p>
        </div>
      </div>

      <Card className="border-[var(--neutral-200)] hover:shadow-medium-top transition-all">
        <CardHeader>
          <CardTitle className="text-lg text-[var(--neutral-800)]">Brand Profile</CardTitle>
          <CardDescription className="text-[var(--neutral-500)]">
            This information appears on your campaigns and creator invites.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-[var(--neutral-800)]">Brand Name</Label>
              <Input defaultValue="28 Litsea" className="border-[var(--neutral-200)] rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-[var(--neutral-800)]">Website</Label>
              <Input defaultValue="https://28litsea.com" className="border-[var(--neutral-200)] rounded-xl" />
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium text-[var(--neutral-800)]">Brand Description</Label>
            <textarea
              className="flex min-h-[100px] w-full rounded-xl border border-[var(--neutral-200)] bg-white px-3 py-2 text-sm text-[var(--neutral-800)] placeholder:text-[var(--neutral-400)] focus:border-[var(--brand-700)] focus:outline-none focus:ring-1 focus:ring-[var(--brand-700)]"
              defaultValue="Clean beauty brand focused on natural, sustainably-sourced skincare products."
            />
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-[var(--neutral-800)]">Category</Label>
              <Input defaultValue="Beauty & Skincare" className="border-[var(--neutral-200)] rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-[var(--neutral-800)]">Instagram Handle</Label>
              <Input defaultValue="@28litsea" className="border-[var(--neutral-200)] rounded-xl" />
            </div>
          </div>
          <div className="flex justify-end">
            <Button className="rounded-xl bg-gradient-brand shadow-brand-glow hover:opacity-90 transition-opacity">
              Save Changes
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-[var(--neutral-200)] hover:shadow-medium-top transition-all overflow-hidden">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg text-[var(--neutral-800)]">Subscription Plan</CardTitle>
              <CardDescription className="text-[var(--neutral-500)]">
                Your current plan and usage.
              </CardDescription>
            </div>
            <Badge className="bg-[var(--brand-100)] text-[var(--brand-700)] border-0 gap-1">
              <Sparkles className="size-3" /> Free Plan
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <Separator className="my-4 bg-[var(--neutral-200)]" />
          <p className="text-sm text-[var(--neutral-600)]">
            You're currently on the Free plan. Upgrade to unlock more campaigns, creator slots, and content gallery downloads.
          </p>
          <Button className="mt-4 gap-2 rounded-xl bg-gradient-brand shadow-brand-glow hover:opacity-90 transition-opacity">
            <TrendingUp className="size-4" /> Upgrade Plan
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
