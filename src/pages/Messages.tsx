import { MessageSquare, Sparkles } from "lucide-react";

export default function Messages() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--blue-100)]">
          <MessageSquare className="size-6 text-[var(--blue-500)]" />
        </div>
        <div>
          <h1 className="text-[28px] font-bold text-[var(--neutral-800)]">Messages</h1>
          <p className="text-sm text-[var(--neutral-500)]">
            Message creators about active campaigns.
          </p>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--blue-300)] bg-gradient-hero py-20">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-cool shadow-lg mb-4">
          <MessageSquare className="size-8 text-white" />
        </div>
        <h3 className="text-base font-bold text-[var(--neutral-800)]">
          No messages yet
        </h3>
        <p className="mt-1 max-w-sm text-center text-sm text-[var(--neutral-500)]">
          When you start collaborating with creators on campaigns, your conversations will appear here.
        </p>
        <div className="mt-4 flex items-center gap-1.5 rounded-full bg-[var(--brand-100)] px-4 py-2 text-xs font-medium text-[var(--brand-700)]">
          <Sparkles className="size-3.5" />
          Messages are coming soon!
        </div>
      </div>
    </div>
  );
}
