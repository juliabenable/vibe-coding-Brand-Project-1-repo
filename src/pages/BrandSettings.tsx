import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

export default function BrandSettings() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-[28px] font-bold text-[var(--neutral-800)]">Brand Settings</h1>
        <p className="mt-1 text-sm text-[var(--neutral-600)]">
          Manage your brand profile and portal preferences.
        </p>
      </div>

      <Card className="shadow-light-top border-[var(--neutral-200)]">
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
              <Input defaultValue="28 Litsea" className="border-[var(--neutral-200)]" />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-[var(--neutral-800)]">Website</Label>
              <Input defaultValue="https://28litsea.com" className="border-[var(--neutral-200)]" />
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium text-[var(--neutral-800)]">Brand Description</Label>
            <textarea
              className="flex min-h-[100px] w-full rounded-lg border border-[var(--neutral-200)] bg-white px-3 py-2 text-sm text-[var(--neutral-800)] placeholder:text-[var(--neutral-400)] focus:border-[var(--brand-700)] focus:outline-none focus:ring-1 focus:ring-[var(--brand-700)]"
              defaultValue="Clean beauty brand focused on natural, sustainably-sourced skincare products."
            />
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-[var(--neutral-800)]">Category</Label>
              <Input defaultValue="Beauty & Skincare" className="border-[var(--neutral-200)]" />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-[var(--neutral-800)]">Instagram Handle</Label>
              <Input defaultValue="@28litsea" className="border-[var(--neutral-200)]" />
            </div>
          </div>
          <div className="flex justify-end">
            <Button className="bg-[var(--brand-700)] hover:bg-[var(--brand-800)]">
              Save Changes
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-light-top border-[var(--neutral-200)]">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg text-[var(--neutral-800)]">Subscription Plan</CardTitle>
              <CardDescription className="text-[var(--neutral-500)]">
                Your current plan and usage.
              </CardDescription>
            </div>
            <Badge className="bg-[var(--brand-100)] text-[var(--brand-700)] hover:bg-[var(--brand-200)]">
              Free Plan
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <Separator className="my-4 bg-[var(--neutral-200)]" />
          <p className="text-sm text-[var(--neutral-600)]">
            You're currently on the Free plan. Upgrade to unlock more campaigns, creator slots, and content gallery downloads.
          </p>
          <Button variant="outline" className="mt-4 border-[var(--brand-400)] text-[var(--brand-700)] hover:bg-[var(--brand-100)]">
            View Plans
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
