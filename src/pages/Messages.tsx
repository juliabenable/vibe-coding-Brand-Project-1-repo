import { MessageSquare } from "lucide-react";

export default function Messages() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[28px] font-bold text-[var(--neutral-800)]">Messages</h1>
        <p className="mt-1 text-sm text-[var(--neutral-600)]">
          Message creators about active campaigns.
        </p>
      </div>

      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[var(--neutral-300)] bg-[var(--neutral-100)] py-20">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--brand-100)]">
          <MessageSquare className="size-6 text-[var(--brand-700)]" />
        </div>
        <h3 className="mt-4 text-base font-medium text-[var(--neutral-800)]">
          No messages yet
        </h3>
        <p className="mt-1 max-w-sm text-center text-sm text-[var(--neutral-500)]">
          When you start collaborating with creators on campaigns, your conversations will appear here.
        </p>
      </div>
    </div>
  );
}
