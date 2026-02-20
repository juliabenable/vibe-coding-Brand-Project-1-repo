import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ArrowRight,
  ArrowLeft,
  Check,
  X,
  Sparkles,
  Brain,
  Users,
  Heart,
  DollarSign,
  Eye,
  Send,
  Clock,
  CheckCircle2,
  AlertCircle,
  UserPlus,
  CalendarDays,
  ThumbsUp,
  RotateCcw,
  Shield,
  Gift,
  CreditCard,
  Tag,
  TrendingUp,
  ExternalLink,
  Bell,
  MessageSquare,
  Home,
  ChevronDown,
} from "lucide-react";
import { formatFollowers } from "@/lib/format";

/* ================================================================== */
/*  STEP INDICATOR — matches CreateCampaign style                     */
/* ================================================================== */
const FIND_TALENT_STEPS = ["Find Creators", "Creator Selection", "Campaign Management"];

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
    <div className="mb-6 flex items-center justify-center gap-1">
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
                if (isPast) onStepClick(stepNum);
              }}
              disabled={!isPast}
              className="flex items-center gap-2 px-2 py-1 rounded-full transition-all"
              style={{ cursor: isPast ? "pointer" : "default" }}
            >
              <div
                className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all"
                style={{
                  backgroundColor: isComplete
                    ? "var(--green-500)"
                    : isCurrent
                      ? "var(--brand-700)"
                      : "var(--neutral-200)",
                  color: isComplete || isCurrent ? "white" : "var(--neutral-500)",
                }}
              >
                {isComplete ? <Check className="size-4" /> : stepNum}
              </div>
              <span
                className="text-xs font-medium hidden sm:inline"
                style={{
                  color: isCurrent
                    ? "var(--brand-700)"
                    : isComplete
                      ? "var(--green-700)"
                      : "var(--neutral-400)",
                  fontWeight: isCurrent ? 700 : 500,
                }}
              >
                {FIND_TALENT_STEPS[i]}
              </span>
            </button>
            {i < totalSteps - 1 && (
              <div
                className="mx-1 h-0.5 w-10 rounded-full"
                style={{
                  backgroundColor: isComplete ? "var(--green-400)" : "var(--neutral-200)",
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ================================================================== */
/*  MOCK DATA — expanded creator pool for discovery                   */
/* ================================================================== */
interface DiscoverableCreator {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  coverImage: string;
  followerCount: number;
  engagementRate: number;
  avgLikes: number;
  avgViews: number;
  platforms: string[];
  categories: string[];
  bio: string;
  location: string;
  audienceTopAge: string;
  audienceTopGender: string;
  audienceTopLocation: string;
  matchScore: number;
  matchReasons: string[];
  recentPosts: { thumbnail: string; type: "reel" | "post" | "video"; views: number; likes: number }[];
  isExclusive: boolean;
  avgResponseTime: string;
  completionRate: number;
}

const MOCK_DISCOVERABLE_CREATORS: DiscoverableCreator[] = [
  {
    id: "dc-001", name: "Jessica Morales", handle: "@jessicabeauty",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&fit=crop&crop=face",
    coverImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&h=750&fit=crop&crop=face",
    followerCount: 820, engagementRate: 6.8, avgLikes: 56, avgViews: 340,
    platforms: ["instagram", "benable"], categories: ["Beauty", "Skincare"],
    bio: "Clean beauty obsessed. Skincare minimalist sharing what actually works.",
    location: "Los Angeles, CA", audienceTopAge: "18-24", audienceTopGender: "82% Female", audienceTopLocation: "US (71%)",
    matchScore: 96, matchReasons: ["Already recommends 3 clean beauty products", "High engagement in your niche", "Benable exclusive creator"],
    recentPosts: [
      { thumbnail: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=200&h=200&fit=crop", type: "reel", views: 1200, likes: 89 },
      { thumbnail: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=200&h=200&fit=crop", type: "post", views: 890, likes: 67 },
      { thumbnail: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=200&h=200&fit=crop", type: "reel", views: 2100, likes: 145 },
    ],
    isExclusive: true, avgResponseTime: "< 2 hours", completionRate: 100,
  },
  {
    id: "dc-002", name: "Chelsea Park", handle: "@chelseaglow",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop&crop=face",
    coverImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&h=750&fit=crop&crop=face",
    followerCount: 2400, engagementRate: 4.2, avgLikes: 101, avgViews: 780,
    platforms: ["instagram", "tiktok", "benable"], categories: ["Beauty", "Lifestyle"],
    bio: "Everyday beauty & lifestyle. Making the every-day feel luxe without the price tag.",
    location: "New York, NY", audienceTopAge: "25-34", audienceTopGender: "76% Female", audienceTopLocation: "US (58%)",
    matchScore: 91, matchReasons: ["Strong engagement in Beauty + Lifestyle", "Multi-platform reach", "Previous brand collab experience"],
    recentPosts: [
      { thumbnail: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=200&h=200&fit=crop", type: "video", views: 3400, likes: 212 },
      { thumbnail: "https://images.unsplash.com/photo-1487412912498-0447578fcca8?w=200&h=200&fit=crop", type: "reel", views: 1800, likes: 134 },
      { thumbnail: "https://images.unsplash.com/photo-1583209814683-c023dd293cc6?w=200&h=200&fit=crop", type: "post", views: 920, likes: 78 },
    ],
    isExclusive: false, avgResponseTime: "< 6 hours", completionRate: 95,
  },
  {
    id: "dc-003", name: "Cassidy Nguyen", handle: "@cassidywellness",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120&h=120&fit=crop&crop=face",
    coverImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=600&h=750&fit=crop&crop=face",
    followerCount: 340, engagementRate: 9.1, avgLikes: 31, avgViews: 210,
    platforms: ["benable"], categories: ["Wellness", "Skincare"],
    bio: "Wellness from the inside out. Sharing my clean living journey.",
    location: "Austin, TX", audienceTopAge: "18-24", audienceTopGender: "88% Female", audienceTopLocation: "US (83%)",
    matchScore: 88, matchReasons: ["Ultra-high engagement rate", "Benable exclusive — not on other platforms", "Perfect audience demographic match"],
    recentPosts: [
      { thumbnail: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=200&h=200&fit=crop", type: "post", views: 310, likes: 28 },
    ],
    isExclusive: true, avgResponseTime: "< 1 hour", completionRate: 100,
  },
  {
    id: "dc-004", name: "Amara Johnson", handle: "@amarabeautyco",
    avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=120&h=120&fit=crop&crop=face",
    coverImage: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&h=750&fit=crop&crop=face",
    followerCount: 5200, engagementRate: 3.8, avgLikes: 198, avgViews: 1500,
    platforms: ["instagram", "tiktok", "benable"], categories: ["Beauty", "Fashion"],
    bio: "Beauty & fashion creator. Discovering and sharing new favorites every week.",
    location: "Chicago, IL", audienceTopAge: "25-34", audienceTopGender: "74% Female", audienceTopLocation: "US (52%)",
    matchScore: 85, matchReasons: ["Growing creator with strong momentum", "Multi-platform content creator", "Proven brand collaboration track record"],
    recentPosts: [
      { thumbnail: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=200&h=200&fit=crop", type: "reel", views: 4200, likes: 289 },
      { thumbnail: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=200&h=200&fit=crop", type: "video", views: 2800, likes: 178 },
    ],
    isExclusive: false, avgResponseTime: "< 4 hours", completionRate: 92,
  },
  {
    id: "dc-005", name: "Taylor Kim", handle: "@taylorkbeauty",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&h=120&fit=crop&crop=face",
    coverImage: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&h=750&fit=crop&crop=face",
    followerCount: 1800, engagementRate: 5.4, avgLikes: 97, avgViews: 620,
    platforms: ["instagram", "benable"], categories: ["Beauty", "Skincare"],
    bio: "Skincare science nerd. Honest reviews on what's worth the hype.",
    location: "San Francisco, CA", audienceTopAge: "18-24", audienceTopGender: "85% Female", audienceTopLocation: "US (68%)",
    matchScore: 93, matchReasons: ["Skincare niche expert — perfect category alignment", "Benable exclusive creator", "Science-based content builds trust"],
    recentPosts: [
      { thumbnail: "https://images.unsplash.com/photo-1583209814683-c023dd293cc6?w=200&h=200&fit=crop", type: "reel", views: 1900, likes: 134 },
      { thumbnail: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=200&h=200&fit=crop", type: "post", views: 780, likes: 56 },
    ],
    isExclusive: true, avgResponseTime: "< 3 hours", completionRate: 98,
  },
  {
    id: "dc-006", name: "Maya Rodriguez", handle: "@mayaglows",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&h=120&fit=crop&crop=face",
    coverImage: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&h=750&fit=crop&crop=face",
    followerCount: 670, engagementRate: 7.3, avgLikes: 49, avgViews: 380,
    platforms: ["instagram", "benable"], categories: ["Beauty", "Wellness", "Lifestyle"],
    bio: "Glowing skin advocate. Sharing my journey to finding products that truly work.",
    location: "Miami, FL", audienceTopAge: "18-24", audienceTopGender: "80% Female", audienceTopLocation: "US (65%)",
    matchScore: 82, matchReasons: ["Very high engagement rate", "Content style aligns with brand aesthetic", "Growing rapidly in Beauty niche"],
    recentPosts: [
      { thumbnail: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=200&h=200&fit=crop", type: "reel", views: 890, likes: 67 },
      { thumbnail: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=200&h=200&fit=crop", type: "post", views: 450, likes: 34 },
    ],
    isExclusive: false, avgResponseTime: "< 8 hours", completionRate: 90,
  },
  {
    id: "dc-007", name: "Lily Chen", handle: "@lilyskintips",
    avatar: "https://images.unsplash.com/photo-1502323777036-f29e3972d82f?w=120&h=120&fit=crop&crop=face",
    coverImage: "https://images.unsplash.com/photo-1502323777036-f29e3972d82f?w=600&h=750&fit=crop&crop=face",
    followerCount: 1100, engagementRate: 5.9, avgLikes: 65, avgViews: 490,
    platforms: ["instagram", "tiktok", "benable"], categories: ["Skincare", "Beauty"],
    bio: "Your skincare bestie. Affordable picks that deliver results.",
    location: "Seattle, WA", audienceTopAge: "18-24", audienceTopGender: "79% Female", audienceTopLocation: "US (72%)",
    matchScore: 87, matchReasons: ["Affordable beauty niche — authentic recommendations", "Strong TikTok presence for video content", "Audience loves product discovery content"],
    recentPosts: [
      { thumbnail: "https://images.unsplash.com/photo-1487412912498-0447578fcca8?w=200&h=200&fit=crop", type: "video", views: 1600, likes: 98 },
      { thumbnail: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=200&h=200&fit=crop", type: "reel", views: 1200, likes: 76 },
    ],
    isExclusive: false, avgResponseTime: "< 5 hours", completionRate: 94,
  },
  {
    id: "dc-008", name: "Nina Patel", handle: "@ninabeautybox",
    avatar: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=120&h=120&fit=crop&crop=face",
    coverImage: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=600&h=750&fit=crop&crop=face",
    followerCount: 450, engagementRate: 8.2, avgLikes: 37, avgViews: 290,
    platforms: ["benable"], categories: ["Beauty", "Skincare", "Wellness"],
    bio: "Curating my favorite beauty finds. Real reviews, real results.",
    location: "Portland, OR", audienceTopAge: "25-34", audienceTopGender: "86% Female", audienceTopLocation: "US (77%)",
    matchScore: 79, matchReasons: ["Benable exclusive with loyal following", "High trust factor — audience engages deeply", "Perfect demographic overlap"],
    recentPosts: [
      { thumbnail: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=200&h=200&fit=crop", type: "post", views: 380, likes: 31 },
    ],
    isExclusive: true, avgResponseTime: "< 2 hours", completionRate: 100,
  },
];

/* ================================================================== */
/*  AI MATCHING LOADING SCREEN                                        */
/* ================================================================== */
function AIMatchingScreen({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const [step, setStep] = useState(0);

  const steps = [
    "Analyzing your campaign brief...",
    "Scanning creator profiles...",
    "Evaluating audience overlap...",
    "Ranking by engagement & fit...",
    "Finalizing your matches!",
  ];

  useEffect(() => {
    let p = 0;
    let s = 0;
    const interval = setInterval(() => {
      p += 1;
      setProgress(p);
      if (p >= 20 && s === 0) { s = 1; setStep(1); }
      if (p >= 40 && s <= 1) { s = 2; setStep(2); }
      if (p >= 60 && s <= 2) { s = 3; setStep(3); }
      if (p >= 85 && s <= 3) { s = 4; setStep(4); }
      if (p >= 100) {
        clearInterval(interval);
        setTimeout(onComplete, 600);
      }
    }, 220);
    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div className="max-w-md w-full text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-[var(--brand-700)]">
          <Brain className="size-10 text-white animate-pulse" />
        </div>
        <h2 className="text-2xl font-bold text-[var(--neutral-800)]">
          Benable AI is finding your perfect creators
        </h2>
        <p className="mt-2 text-sm text-[var(--neutral-500)]">
          Our proprietary matching engine analyzes thousands of data points
        </p>

        {/* Email notification */}
        <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-[var(--brand-0)] border border-[var(--brand-200)] px-4 py-2 text-xs text-[var(--brand-700)]">
          <Bell className="size-3.5" />
          We'll email you when your matches are ready
        </div>

        <div className="mt-8">
          <div className="h-2.5 w-full rounded-full bg-[var(--neutral-100)] overflow-hidden">
            <div
              className="h-full rounded-full bg-[var(--brand-600)] transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="mt-3 text-sm font-semibold text-[var(--brand-700)]">
            {steps[step]}
          </p>
        </div>
        <div className="mt-6 flex flex-col gap-2">
          {steps.map((s, i) => (
            <div key={i} className={`flex items-center gap-2 text-xs ${i <= step ? "text-[var(--neutral-800)]" : "text-[var(--neutral-400)]"}`}>
              {i < step ? <CheckCircle2 className="size-3.5 text-[var(--green-500)]" /> : i === step ? <div className="size-3.5 rounded-full border-2 border-[var(--brand-700)] border-t-transparent animate-spin" /> : <div className="size-3.5 rounded-full border border-[var(--neutral-300)]" />}
              {s}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ================================================================== */
/*  CREATOR DETAIL POPUP                                              */
/* ================================================================== */
function CreatorDetailDialog({
  creator,
  open,
  onClose,
  isSelected,
  onToggleSelect,
}: {
  creator: DiscoverableCreator | null;
  open: boolean;
  onClose: () => void;
  isSelected: boolean;
  onToggleSelect: () => void;
}) {
  if (!creator) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto p-0">
        <div className="relative h-40 overflow-hidden rounded-t-lg">
          <img src={creator.coverImage} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <div className="absolute bottom-4 left-4 flex items-center gap-3">
            <img src={creator.avatar} alt={creator.name} className="h-14 w-14 rounded-full border-3 border-white object-cover shadow-lg" />
            <div>
              <h3 className="text-lg font-bold text-white">{creator.name}</h3>
              <p className="text-sm text-white/80">{creator.handle}</p>
            </div>
          </div>
          <div className="absolute top-4 right-4 flex items-center gap-1.5 rounded-full bg-white/90 backdrop-blur px-3 py-1.5 shadow">
            <Sparkles className="size-3.5 text-[var(--brand-700)]" />
            <span className="text-sm font-bold text-[var(--brand-700)]">{creator.matchScore}% match</span>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="rounded-xl bg-[var(--brand-0)] border border-[var(--brand-300)] p-4">
            <div className="flex items-center gap-2 mb-2">
              <Brain className="size-4 text-[var(--brand-700)]" />
              <span className="text-sm font-semibold text-[var(--brand-700)]">Why Benable AI chose this creator</span>
            </div>
            <div className="space-y-1.5">
              {creator.matchReasons.map((reason, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-[var(--neutral-700)]">
                  <Check className="size-3 text-[var(--green-500)] shrink-0" />
                  {reason}
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-4 gap-3">
            {[
              { label: "Followers", value: formatFollowers(creator.followerCount), icon: Users },
              { label: "Engagement", value: `${creator.engagementRate}%`, icon: Heart },
              { label: "Avg. Views", value: formatFollowers(creator.avgViews), icon: Eye },
              { label: "Avg. Likes", value: formatFollowers(creator.avgLikes), icon: ThumbsUp },
            ].map((stat) => (
              <div key={stat.label} className="rounded-lg border border-[var(--neutral-200)] p-3 text-center">
                <stat.icon className="size-4 mx-auto mb-1 text-[var(--neutral-500)]" />
                <p className="text-lg font-bold text-[var(--neutral-800)]">{stat.value}</p>
                <p className="text-[10px] text-[var(--neutral-500)]">{stat.label}</p>
              </div>
            ))}
          </div>

          <div>
            <p className="text-sm text-[var(--neutral-600)] leading-relaxed">{creator.bio}</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {creator.categories.map((c) => (
                <Badge key={c} variant="outline" className="text-[10px] border-[var(--neutral-200)]">{c}</Badge>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-lg bg-[var(--neutral-100)] p-3">
              <p className="text-[10px] text-[var(--neutral-500)] mb-1">Top Age</p>
              <p className="text-sm font-semibold text-[var(--neutral-800)]">{creator.audienceTopAge}</p>
            </div>
            <div className="rounded-lg bg-[var(--neutral-100)] p-3">
              <p className="text-[10px] text-[var(--neutral-500)] mb-1">Gender Split</p>
              <p className="text-sm font-semibold text-[var(--neutral-800)]">{creator.audienceTopGender}</p>
            </div>
            <div className="rounded-lg bg-[var(--neutral-100)] p-3">
              <p className="text-[10px] text-[var(--neutral-500)] mb-1">Location</p>
              <p className="text-sm font-semibold text-[var(--neutral-800)]">{creator.audienceTopLocation}</p>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-[var(--neutral-800)] mb-3">Recent Content</h4>
            <div className="grid grid-cols-3 gap-2">
              {creator.recentPosts.map((post, i) => (
                <div key={i} className="group relative aspect-square overflow-hidden rounded-lg">
                  <img src={post.thumbnail} alt="" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="text-white text-xs text-center">
                      <div className="flex items-center gap-2 justify-center">
                        <Eye className="size-3" /> {formatFollowers(post.views)}
                        <Heart className="size-3" /> {formatFollowers(post.likes)}
                      </div>
                    </div>
                  </div>
                  <div className="absolute top-1.5 right-1.5">
                    <Badge className="text-[9px] px-1.5 py-0 bg-black/60 border-0 text-white">
                      {post.type === "reel" ? "Reel" : post.type === "video" ? "Video" : "Post"}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-4 border-t border-[var(--neutral-200)] pt-4">
            <div className="flex items-center gap-2 text-xs text-[var(--neutral-600)]">
              <Clock className="size-3.5" /> Avg. response: {creator.avgResponseTime}
            </div>
            <div className="flex items-center gap-2 text-xs text-[var(--neutral-600)]">
              <CheckCircle2 className="size-3.5 text-[var(--green-500)]" /> {creator.completionRate}% completion rate
            </div>
            {creator.isExclusive && (
              <div className="flex items-center gap-2 text-xs text-[var(--brand-700)]">
                <Shield className="size-3.5" /> Benable Exclusive
              </div>
            )}
          </div>

          <Button
            onClick={onToggleSelect}
            className={`w-full gap-2 ${
              isSelected
                ? "bg-[var(--neutral-200)] text-[var(--neutral-700)] hover:bg-[var(--neutral-300)]"
                : "bg-[var(--brand-700)] hover:bg-[var(--brand-800)]"
            }`}
          >
            {isSelected ? <><X className="size-4" /> Remove from Campaign</> : <><UserPlus className="size-4" /> Add to Campaign</>}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* ================================================================== */
/*  CREATOR SELECTION GRID                                            */
/* ================================================================== */
function StepCreatorSelection({
  creators,
  selected,
  onToggle,
  onSelectAll,
  onDeselectAll,
  onViewDetail,
  onNext,
}: {
  creators: DiscoverableCreator[];
  selected: Set<string>;
  onToggle: (id: string) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  onViewDetail: (creator: DiscoverableCreator) => void;
  onNext: () => void;
}) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--brand-700)]">
              <Sparkles className="size-4 text-white" />
            </div>
            <h2 className="text-xl font-bold text-[var(--neutral-800)]">
              Creator Selection
            </h2>
          </div>
          <p className="text-sm text-[var(--neutral-500)]">
            {creators.length} creators matched to your campaign — ranked by fit score
          </p>
        </div>
      </div>

      {/* Bulk actions bar — fixed height to prevent pixel shift */}
      <div className="flex items-center justify-between rounded-xl border border-[var(--neutral-200)] bg-[var(--neutral-50)] px-4 h-12">
        <div className="flex items-center gap-3">
          <Checkbox
            checked={selected.size === creators.length && creators.length > 0}
            onCheckedChange={(c) => c ? onSelectAll() : onDeselectAll()}
            className="data-[state=checked]:bg-[var(--brand-700)] data-[state=checked]:border-[var(--brand-700)]"
          />
          <span className="text-sm text-[var(--neutral-600)] min-w-[200px]">
            {selected.size > 0
              ? <><span className="font-semibold text-[var(--brand-700)]">{selected.size}</span> creator{selected.size !== 1 ? "s" : ""} selected</>
              : "Select creators to add to your campaign"
            }
          </span>
        </div>
        {selected.size > 0 && (
          <Button variant="ghost" size="sm" className="text-xs text-[var(--neutral-500)]" onClick={onDeselectAll}>
            Clear selection
          </Button>
        )}
      </div>

      {/* Creator grid */}
      <div className="grid grid-cols-4 gap-4">
        {creators.map((creator) => {
          const isSelected = selected.has(creator.id);
          return (
            <div
              key={creator.id}
              className="group relative overflow-hidden rounded-xl border-2 transition-all cursor-pointer"
              style={{
                borderColor: isSelected ? "var(--brand-600)" : "transparent",
                boxShadow: isSelected ? "0 0 0 2px var(--brand-200)" : "0 1px 3px rgba(0,0,0,0.08)",
              }}
            >
              {/* Selection checkbox — green tick */}
              <div
                className="absolute top-3 left-3 z-10"
                onClick={(e) => { e.stopPropagation(); onToggle(creator.id); }}
              >
                <div
                  className="flex h-7 w-7 items-center justify-center rounded-lg transition-all"
                  style={{
                    backgroundColor: isSelected ? "var(--green-500)" : "rgba(255,255,255,0.85)",
                    backdropFilter: isSelected ? "none" : "blur(4px)",
                    border: isSelected ? "none" : "1.5px solid var(--neutral-300)",
                    transform: isSelected ? "scale(1.1)" : "scale(1)",
                  }}
                >
                  {isSelected && <Check className="size-4 text-white" />}
                </div>
              </div>

              {/* Match score badge */}
              <div className="absolute top-3 right-3 z-10">
                <div className="flex items-center gap-1 rounded-full bg-white/90 backdrop-blur px-2 py-0.5 shadow-sm">
                  <Sparkles className="size-3 text-[var(--brand-700)]" />
                  <span className="text-[11px] font-bold text-[var(--brand-700)]">{creator.matchScore}%</span>
                </div>
              </div>

              {/* Portrait image */}
              <div className="aspect-[4/5] overflow-hidden" onClick={() => onViewDetail(creator)}>
                <img
                  src={creator.coverImage}
                  alt={creator.name}
                  className="w-full h-full object-cover transition-opacity group-hover:opacity-95"
                />
                <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />
              </div>

              {/* Info strip */}
              <div className="p-3" onClick={() => onViewDetail(creator)}>
                <div className="flex items-center gap-2">
                  <img src={creator.avatar} alt="" className="h-7 w-7 rounded-full object-cover border border-white shadow-sm" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-[var(--neutral-800)] truncate">{creator.name}</p>
                    <p className="text-[11px] text-[var(--neutral-500)] truncate">{creator.handle}</p>
                  </div>
                </div>
                <div className="mt-2 flex items-center gap-3 text-[11px] text-[var(--neutral-500)]">
                  <span className="font-medium text-[var(--neutral-700)]">{formatFollowers(creator.followerCount)} followers</span>
                  <span className="flex items-center gap-0.5"><Heart className="size-3 text-[var(--brand-400)]" /> {creator.engagementRate}%</span>
                  {creator.isExclusive && (
                    <Badge className="text-[9px] px-1.5 py-0 bg-[var(--brand-100)] text-[var(--brand-700)] border-0">Exclusive</Badge>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom nav */}
      <div className="flex items-center justify-between pt-4 border-t border-[var(--neutral-200)]">
        <div />
        <Button
          className="gap-2 rounded-xl bg-[var(--brand-700)] hover:bg-[var(--brand-800)]"
          onClick={onNext}
          disabled={selected.size === 0}
        >
          Continue with {selected.size} Creator{selected.size !== 1 ? "s" : ""} <ArrowRight className="size-4" />
        </Button>
      </div>
    </div>
  );
}

/* ================================================================== */
/*  COMPENSATION DROPDOWN OPTIONS                                     */
/* ================================================================== */
const COMP_OPTIONS = [
  { value: "gifted", label: "Gifted Product", icon: Gift, color: "var(--brand-700)" },
  { value: "gift_card", label: "Gift Card", icon: CreditCard, color: "var(--blue-700)" },
  { value: "discount", label: "Discount Code", icon: Tag, color: "var(--green-700)" },
  { value: "paid", label: "Paid Fee", icon: DollarSign, color: "var(--orange-700)" },
  { value: "commission_boost", label: "Commission Boost", icon: TrendingUp, color: "#7B61C2" },
];

/* ================================================================== */
/*  CREATOR MANAGEMENT — redesigned per feedback                      */
/* ================================================================== */
type InviteStatus = "pending" | "invited" | "accepted" | "waiting_for_content" | "content_submitted" | "in_review" | "approved" | "awaiting_post" | "posted" | "revision_requested";

interface ManagedCreator {
  creator: DiscoverableCreator;
  inviteStatus: InviteStatus;
  compensationType: string;
  compensationDetail: string;
  contentDueDate: string;
  contentSubmission?: {
    thumbnail: string;
    type: string;
    caption: string;
    submittedAt: string;
    aiReviewScore: number;
    aiReviewNotes: string[];
    aiIssues: string[];
    brandReviewStatus: "pending" | "approved" | "revision_requested";
    brandComments: { text: string; from: "brand" | "creator"; at: string }[];
  };
}

const INVITE_STATUS_CONFIG: Record<InviteStatus, { label: string; color: string; bg: string }> = {
  pending: { label: "Pending", color: "var(--neutral-600)", bg: "var(--neutral-100)" },
  invited: { label: "Invited", color: "var(--blue-700)", bg: "var(--blue-100)" },
  accepted: { label: "Accepted", color: "var(--green-700)", bg: "var(--green-100)" },
  waiting_for_content: { label: "Waiting for Content", color: "var(--orange-700)", bg: "var(--orange-100)" },
  content_submitted: { label: "Submitted", color: "var(--brand-700)", bg: "var(--brand-100)" },
  in_review: { label: "In Review", color: "var(--blue-700)", bg: "var(--blue-100)" },
  approved: { label: "Approved", color: "var(--green-700)", bg: "var(--green-100)" },
  awaiting_post: { label: "Waiting to Post", color: "var(--orange-700)", bg: "var(--orange-100)" },
  posted: { label: "Posted", color: "var(--green-700)", bg: "var(--green-100)" },
  revision_requested: { label: "Revisions Sent", color: "var(--orange-700)", bg: "var(--orange-100)" },
};

// Status flow order for the clickable status dropdown
const STATUS_FLOW: InviteStatus[] = [
  "pending", "invited", "accepted", "waiting_for_content",
  "content_submitted", "in_review", "revision_requested",
  "approved", "awaiting_post", "posted",
];

function StepCreatorManagement({
  managedCreators,
  setManagedCreators,
  onBack,
}: {
  managedCreators: ManagedCreator[];
  setManagedCreators: React.Dispatch<React.SetStateAction<ManagedCreator[]>>;
  onBack: () => void;
}) {
  const navigate = useNavigate();
  const [reviewCreator, setReviewCreator] = useState<ManagedCreator | null>(null);
  const [commentText, setCommentText] = useState("");
  const [kudosCreatorId, setKudosCreatorId] = useState<string | null>(null);
  const [kudosText, setKudosText] = useState("Thank you so much for the amazing content! We loved working with you.");
  const [editingDueDate, setEditingDueDate] = useState<string | null>(null);
  const [statusDropdownId, setStatusDropdownId] = useState<string | null>(null);

  const defaultDueDate = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d.toISOString().split("T")[0];
  }, []);

  /* ------- Actions ------- */
  const inviteAll = () => {
    setManagedCreators((prev) =>
      prev.map((mc) => ({
        ...mc,
        inviteStatus: mc.inviteStatus === "pending" ? "invited" : mc.inviteStatus,
        contentDueDate: mc.contentDueDate || defaultDueDate,
      }))
    );
  };

  const inviteOne = (id: string) => {
    setManagedCreators((prev) =>
      prev.map((mc) =>
        mc.creator.id === id
          ? { ...mc, inviteStatus: "invited", contentDueDate: mc.contentDueDate || defaultDueDate }
          : mc
      )
    );
  };

  const sendReminder = (id: string) => {
    // In prototype, just advance to accepted to show flow
    setManagedCreators((prev) =>
      prev.map((mc) =>
        mc.creator.id === id && mc.inviteStatus === "invited"
          ? { ...mc, inviteStatus: "accepted" }
          : mc
      )
    );
  };

  const changeStatus = (id: string, newStatus: InviteStatus) => {
    setManagedCreators((prev) =>
      prev.map((mc) =>
        mc.creator.id === id ? { ...mc, inviteStatus: newStatus } : mc
      )
    );
    setStatusDropdownId(null);
  };

  const updateCompType = (id: string, type: string) => {
    setManagedCreators((prev) =>
      prev.map((mc) =>
        mc.creator.id === id ? { ...mc, compensationType: type } : mc
      )
    );
  };

  const _updateCompDetail = (id: string, detail: string) => {
    setManagedCreators((prev) =>
      prev.map((mc) =>
        mc.creator.id === id ? { ...mc, compensationDetail: detail } : mc
      )
    );
  };
  void _updateCompDetail; // available for future use

  const _updateDueDate = (id: string, date: string) => {
    setManagedCreators((prev) =>
      prev.map((mc) =>
        mc.creator.id === id ? { ...mc, contentDueDate: date } : mc
      )
    );
    setEditingDueDate(null);
  };
  void _updateDueDate; // available for future use

  const approveContent = (id: string) => {
    setManagedCreators((prev) =>
      prev.map((mc) =>
        mc.creator.id === id && mc.contentSubmission
          ? { ...mc, inviteStatus: "awaiting_post", contentSubmission: { ...mc.contentSubmission, brandReviewStatus: "approved" } }
          : mc
      )
    );
    setReviewCreator(null);
  };

  const markAsPosted = (id: string) => {
    setManagedCreators((prev) =>
      prev.map((mc) =>
        mc.creator.id === id ? { ...mc, inviteStatus: "posted" } : mc
      )
    );
  };

  const requestRevision = (id: string) => {
    if (!commentText.trim()) return;
    setManagedCreators((prev) =>
      prev.map((mc) =>
        mc.creator.id === id && mc.contentSubmission
          ? {
              ...mc,
              inviteStatus: "revision_requested",
              contentSubmission: {
                ...mc.contentSubmission,
                brandReviewStatus: "revision_requested",
                brandComments: [...mc.contentSubmission.brandComments, { text: commentText, from: "brand" as const, at: "Just now" }],
              },
            }
          : mc
      )
    );
    setCommentText("");
    // Don't close dialog — keep it open so user sees the thread
  };

  const sendKudos = (_id: string) => {
    // In prototype, just close
    setKudosCreatorId(null);
    setKudosText("Thank you so much for the amazing content! We loved working with you.");
  };

  /* ------- Group creators by stage ------- */
  const needsAction = managedCreators.filter((mc) =>
    ["pending", "content_submitted", "in_review", "revision_requested"].includes(mc.inviteStatus)
  );
  const inProgress = managedCreators.filter((mc) =>
    ["invited", "accepted", "waiting_for_content"].includes(mc.inviteStatus)
  );
  const awaitingPost = managedCreators.filter((mc) =>
    mc.inviteStatus === "awaiting_post" || mc.inviteStatus === "approved"
  );
  const completed = managedCreators.filter((mc) =>
    mc.inviteStatus === "posted"
  );

  const pendingCount = managedCreators.filter((mc) => mc.inviteStatus === "pending").length;
  const allPosted = managedCreators.length > 0 && managedCreators.every((mc) => mc.inviteStatus === "posted");

  /* ------- Stage tracker ------- */
  const stageCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const mc of managedCreators) {
      const key = mc.inviteStatus;
      counts[key] = (counts[key] || 0) + 1;
    }
    return counts;
  }, [managedCreators]);

  /* ------- Auto-generate AI message for non-compliant content ------- */
  const generateAIMessage = (mc: ManagedCreator): string => {
    if (!mc.contentSubmission || mc.contentSubmission.aiIssues.length === 0) return "";
    const issues = mc.contentSubmission.aiIssues;
    return `Hi ${mc.creator.name.split(" ")[0]}, thanks for submitting your content! Our review found a few items that need updating before we can approve:\n\n${issues.map((issue, i) => `${i + 1}. ${issue}`).join("\n")}\n\nPlease update and resubmit when ready. Let us know if you have questions!`;
  };

  /* ------- Creator row ------- */
  const CreatorRow = ({ mc, isCompleted }: { mc: ManagedCreator; isCompleted?: boolean }) => {
    const statusStyle = INVITE_STATUS_CONFIG[mc.inviteStatus];
    return (
      <div className="flex items-center gap-3 px-5 py-3.5 hover:bg-[var(--neutral-50)] transition-colors">
        {/* Creator info */}
        <div className="flex items-center gap-3 w-44 shrink-0">
          <img src={mc.creator.avatar} alt="" className="h-9 w-9 rounded-full object-cover" />
          <div className="min-w-0">
            <p className="text-sm font-medium text-[var(--neutral-800)] truncate">{mc.creator.name}</p>
            <p className="text-xs text-[var(--neutral-500)] truncate">{mc.creator.handle}</p>
          </div>
        </div>

        {/* Status — FIRST column on right, clickable dropdown */}
        <div className="w-36 shrink-0 relative">
          <button
            className="flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium transition-colors hover:opacity-80"
            style={{ backgroundColor: statusStyle.bg, color: statusStyle.color }}
            onClick={() => setStatusDropdownId(statusDropdownId === mc.creator.id ? null : mc.creator.id)}
          >
            {statusStyle.label}
            <ChevronDown className="size-3" />
          </button>
          {statusDropdownId === mc.creator.id && (
            <>
              <div className="fixed inset-0 z-20" onClick={() => setStatusDropdownId(null)} />
              <div className="absolute top-8 left-0 z-30 w-48 rounded-lg border border-[var(--neutral-200)] bg-white shadow-lg py-1 max-h-60 overflow-y-auto">
                {STATUS_FLOW.map((s) => (
                  <button
                    key={s}
                    className="flex items-center gap-2 w-full px-3 py-1.5 text-xs hover:bg-[var(--neutral-50)] text-left"
                    style={{ color: INVITE_STATUS_CONFIG[s].color }}
                    onClick={() => changeStatus(mc.creator.id, s)}
                  >
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: INVITE_STATUS_CONFIG[s].color }} />
                    {INVITE_STATUS_CONFIG[s].label}
                    {mc.inviteStatus === s && <Check className="size-3 ml-auto" />}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Compensation */}
        <div className="w-32 shrink-0">
          <Select value={mc.compensationType} onValueChange={(v) => updateCompType(mc.creator.id, v)}>
            <SelectTrigger className="h-8 text-xs border-[var(--neutral-200)]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {COMP_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  <span className="flex items-center gap-1.5">
                    <opt.icon className="size-3" style={{ color: opt.color }} />
                    {opt.label}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Deliverables / Preview */}
        <div className="w-24 shrink-0">
          {mc.contentSubmission ? (
            <Button
              variant="outline"
              size="sm"
              className="text-xs gap-1 border-[var(--brand-400)] text-[var(--brand-700)]"
              onClick={() => setReviewCreator(mc)}
            >
              <Eye className="size-3" /> {isCompleted ? "Preview" : "Review"}
            </Button>
          ) : (
            <span className="text-xs text-[var(--neutral-400)]">—</span>
          )}
        </div>

        {/* Action — right side */}
        <div className="flex-1 flex justify-end gap-2">
          {mc.inviteStatus === "pending" && (
            <Button
              size="sm"
              className="text-xs gap-1 bg-[var(--brand-700)] hover:bg-[var(--brand-800)]"
              onClick={() => inviteOne(mc.creator.id)}
            >
              <Send className="size-3" /> Invite
            </Button>
          )}
          {mc.inviteStatus === "invited" && (
            <Button
              size="sm"
              variant="outline"
              className="text-xs gap-1 border-[var(--blue-300)] text-[var(--blue-700)] hover:bg-[var(--blue-50)]"
              onClick={() => sendReminder(mc.creator.id)}
            >
              <Bell className="size-3" /> Send Reminder
            </Button>
          )}
          {mc.inviteStatus === "awaiting_post" && (
            <Button
              size="sm"
              variant="outline"
              className="text-xs gap-1 border-[var(--green-300)] text-[var(--green-700)]"
              onClick={() => markAsPosted(mc.creator.id)}
            >
              <ExternalLink className="size-3" /> Mark Posted
            </Button>
          )}
          {mc.inviteStatus === "posted" && (
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                className="text-xs gap-1 border-[var(--brand-300)] text-[var(--brand-700)]"
                onClick={() => { setKudosCreatorId(mc.creator.id); }}
              >
                <ThumbsUp className="size-3" /> Send Kudos
              </Button>
              <Badge className="text-[11px] bg-[var(--green-100)] text-[var(--green-700)] border-0 gap-1">
                <CheckCircle2 className="size-3" /> Live
              </Badge>
            </div>
          )}
          {["accepted", "waiting_for_content"].includes(mc.inviteStatus) && (
            <span className="text-xs text-[var(--neutral-400)] italic">Waiting for content...</span>
          )}
          {["content_submitted", "in_review"].includes(mc.inviteStatus) && mc.contentSubmission && (
            <Button
              size="sm"
              className="text-xs gap-1 bg-[var(--brand-700)] hover:bg-[var(--brand-800)]"
              onClick={() => setReviewCreator(mc)}
            >
              <Eye className="size-3" /> Review Now
            </Button>
          )}
        </div>
      </div>
    );
  };

  /* ------- Section renderer (no white strip at top of banner) ------- */
  const Section = ({ title, creators: sectionCreators, accentColor, accentBg, isCompletedSection }: {
    title: string;
    creators: ManagedCreator[];
    accentColor: string;
    accentBg: string;
    isCompletedSection?: boolean;
  }) => {
    if (sectionCreators.length === 0) return null;
    return (
      <Card className="overflow-hidden" style={{ border: `1px solid ${accentBg}` }}>
        <div className="px-5 py-3" style={{ backgroundColor: accentBg }}>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold" style={{ color: accentColor }}>{title}</h3>
            <Badge variant="outline" className="text-[10px]" style={{ borderColor: accentColor, color: accentColor }}>
              {sectionCreators.length}
            </Badge>
          </div>
        </div>
        <div className="divide-y divide-[var(--neutral-100)]">
          {sectionCreators.map((mc) => (
            <CreatorRow key={mc.creator.id} mc={mc} isCompleted={isCompletedSection} />
          ))}
        </div>
      </Card>
    );
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[var(--neutral-800)]">Campaign Management</h2>
          <p className="text-sm text-[var(--neutral-500)]">
            Invite creators, track content, and manage your campaign
          </p>
        </div>
        <div className="flex items-center gap-2">
          {pendingCount > 0 && (
            <Button
              size="sm"
              className="gap-1.5 rounded-xl bg-[var(--brand-700)] hover:bg-[var(--brand-800)]"
              onClick={inviteAll}
            >
              <Send className="size-3.5" /> Invite All ({pendingCount})
            </Button>
          )}
        </div>
      </div>

      {/* Stage tracker */}
      <div className="flex gap-2 flex-wrap">
        {STATUS_FLOW.filter((s) => stageCounts[s]).map((s) => (
          <div
            key={s}
            className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-medium"
            style={{ backgroundColor: INVITE_STATUS_CONFIG[s].bg, color: INVITE_STATUS_CONFIG[s].color }}
          >
            {INVITE_STATUS_CONFIG[s].label}
            <span className="font-bold">{stageCounts[s]}</span>
          </div>
        ))}
        <div className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-medium bg-[var(--neutral-100)] text-[var(--neutral-600)]">
          Total <span className="font-bold">{managedCreators.length}</span>
        </div>
      </div>

      {/* Three separate settings islands */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="border-[var(--neutral-200)]">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--brand-100)]">
              <CalendarDays className="size-4 text-[var(--brand-700)]" />
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-semibold text-[var(--neutral-500)] uppercase tracking-wide">Content Due</p>
              {editingDueDate === "global" ? (
                <Input
                  type="date"
                  className="h-7 text-xs mt-0.5 border-[var(--neutral-200)]"
                  defaultValue={defaultDueDate}
                  onBlur={(e) => {
                    // Update all creators with the new date
                    const newDate = e.target.value;
                    setManagedCreators((prev) => prev.map((mc) => ({ ...mc, contentDueDate: newDate })));
                    setEditingDueDate(null);
                  }}
                  autoFocus
                />
              ) : (
                <button
                  className="text-sm font-medium text-[var(--neutral-800)] hover:text-[var(--brand-700)] transition-colors"
                  onClick={() => setEditingDueDate("global")}
                >
                  {defaultDueDate}
                </button>
              )}
            </div>
          </CardContent>
        </Card>
        <Card className="border-[var(--neutral-200)]">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--green-100)]">
              <Gift className="size-4 text-[var(--green-700)]" />
            </div>
            <div>
              <p className="text-[10px] font-semibold text-[var(--neutral-500)] uppercase tracking-wide">Compensation</p>
              <p className="text-sm font-medium text-[var(--neutral-800)]">Gifted Product</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-[var(--neutral-200)]">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--blue-100)]">
              <Users className="size-4 text-[var(--blue-700)]" />
            </div>
            <div>
              <p className="text-[10px] font-semibold text-[var(--neutral-500)] uppercase tracking-wide">Total Creators</p>
              <p className="text-sm font-medium text-[var(--neutral-800)]">{managedCreators.length}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sectioned creator lists */}
      <Section
        title="Needs Your Attention"
        creators={needsAction}
        accentColor="var(--orange-700)"
        accentBg="var(--orange-100)"
      />
      <Section
        title="In Progress"
        creators={inProgress}
        accentColor="var(--blue-700)"
        accentBg="var(--blue-100)"
      />
      <Section
        title="Approved — Waiting to Post"
        creators={awaitingPost}
        accentColor="var(--brand-700)"
        accentBg="var(--brand-100)"
      />
      <Section
        title="Completed"
        creators={completed}
        accentColor="var(--green-700)"
        accentBg="var(--green-100)"
        isCompletedSection
      />

      {/* Content Review Dialog — with thread, AI prefill, stays open */}
      {reviewCreator && reviewCreator.contentSubmission && (
        <Dialog open={!!reviewCreator} onOpenChange={() => { setReviewCreator(null); setCommentText(""); }}>
          <DialogContent className="max-w-xl max-h-[85vh] overflow-y-auto p-0">
            <DialogHeader className="p-6 pb-0">
              <DialogTitle className="flex items-center gap-3">
                <img src={reviewCreator.creator.avatar} alt="" className="h-8 w-8 rounded-full object-cover" />
                <div>
                  <span>{reviewCreator.creator.name}</span>
                  <p className="text-xs font-normal text-[var(--neutral-500)]">
                    {reviewCreator.inviteStatus === "posted" ? "Content Preview" : "Content Review"}
                  </p>
                </div>
              </DialogTitle>
            </DialogHeader>
            <div className="p-6 space-y-5">
              {/* Content preview */}
              <div className="rounded-lg overflow-hidden border border-[var(--neutral-200)]">
                <img
                  src={reviewCreator.contentSubmission.thumbnail}
                  alt=""
                  className="w-full h-56 object-cover"
                />
                <div className="p-4">
                  <p className="text-sm text-[var(--neutral-800)]">{reviewCreator.contentSubmission.caption}</p>
                  <p className="text-xs text-[var(--neutral-400)] mt-2">
                    Submitted {reviewCreator.contentSubmission.submittedAt} · {reviewCreator.contentSubmission.type}
                  </p>
                </div>
              </div>

              {/* AI Review */}
              <div className="rounded-xl border border-[var(--brand-300)] bg-[var(--brand-0)] p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Shield className="size-4 text-[var(--brand-700)]" />
                    <span className="text-sm font-semibold text-[var(--brand-700)]">AI Content Review</span>
                  </div>
                  <Badge
                    className="text-[11px] border-0"
                    style={{
                      backgroundColor: reviewCreator.contentSubmission.aiReviewScore >= 80 ? "var(--green-100)" : "var(--orange-100)",
                      color: reviewCreator.contentSubmission.aiReviewScore >= 80 ? "var(--green-700)" : "var(--orange-700)",
                    }}
                  >
                    {reviewCreator.contentSubmission.aiReviewScore}% compliant
                  </Badge>
                </div>
                <div className="space-y-1.5">
                  {reviewCreator.contentSubmission.aiReviewNotes.map((note, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-[var(--neutral-700)]">
                      <CheckCircle2 className="size-3.5 text-[var(--green-500)] mt-0.5 shrink-0" />
                      {note}
                    </div>
                  ))}
                  {reviewCreator.contentSubmission.aiIssues.map((issue, i) => (
                    <div key={`issue-${i}`} className="flex items-start gap-2 text-xs text-[var(--orange-700)]">
                      <AlertCircle className="size-3.5 text-[var(--orange-500)] mt-0.5 shrink-0" />
                      {issue}
                    </div>
                  ))}
                </div>

                {/* AI auto-fill button when there are issues */}
                {reviewCreator.contentSubmission.aiIssues.length > 0 && reviewCreator.inviteStatus !== "posted" && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-3 text-xs gap-1.5 border-[var(--brand-300)] text-[var(--brand-700)]"
                    onClick={() => setCommentText(generateAIMessage(reviewCreator))}
                  >
                    <Brain className="size-3" /> Auto-generate revision message
                  </Button>
                )}
              </div>

              {/* Comment thread */}
              {reviewCreator.contentSubmission.brandComments.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-[var(--neutral-600)] flex items-center gap-1.5">
                    <MessageSquare className="size-3.5" /> Comment Thread
                  </p>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {reviewCreator.contentSubmission.brandComments.map((c, i) => (
                      <div
                        key={i}
                        className="rounded-lg p-3 text-xs"
                        style={{
                          backgroundColor: c.from === "brand" ? "var(--brand-0)" : "var(--neutral-100)",
                          borderLeft: c.from === "brand" ? "3px solid var(--brand-700)" : "3px solid var(--neutral-400)",
                        }}
                      >
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className="font-semibold" style={{ color: c.from === "brand" ? "var(--brand-700)" : "var(--neutral-700)" }}>
                            {c.from === "brand" ? "You" : reviewCreator.creator.name}
                          </span>
                          <span className="text-[var(--neutral-400)]">{c.at}</span>
                        </div>
                        <p className="text-[var(--neutral-700)] whitespace-pre-line">{c.text}</p>
                      </div>
                    ))}
                  </div>
                  <p className="text-[10px] text-[var(--neutral-400)] italic">
                    The creator will see your comments and can reply in this thread.
                  </p>
                </div>
              )}

              {/* Comment field + actions (only for non-completed) */}
              {reviewCreator.inviteStatus !== "posted" && (
                <>
                  <div className="space-y-2">
                    <Label className="text-xs text-[var(--neutral-600)]">
                      Add a comment {reviewCreator.contentSubmission.aiIssues.length > 0 ? "(will be sent with revision request)" : "(optional)"}
                    </Label>
                    <textarea
                      className="w-full rounded-lg border border-[var(--neutral-200)] px-3 py-2 text-sm placeholder:text-[var(--neutral-400)] focus:border-[var(--brand-700)] focus:outline-none focus:ring-1 focus:ring-[var(--brand-700)]"
                      rows={4}
                      placeholder="Share feedback, request changes, or leave notes for the creator..."
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                    />
                  </div>

                  <div className="flex gap-3">
                    <Button
                      className="flex-1 gap-2 bg-[var(--green-500)] hover:bg-[var(--green-700)]"
                      onClick={() => approveContent(reviewCreator.creator.id)}
                    >
                      <ThumbsUp className="size-4" /> Approve
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1 gap-2 border-[var(--orange-300)] text-[var(--orange-700)] hover:bg-[var(--orange-100)]"
                      onClick={() => requestRevision(reviewCreator.creator.id)}
                      disabled={!commentText.trim()}
                    >
                      <RotateCcw className="size-4" /> Send Revision Request
                    </Button>
                  </div>
                </>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Kudos / Thank You Dialog */}
      {kudosCreatorId && (
        <Dialog open={!!kudosCreatorId} onOpenChange={() => setKudosCreatorId(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <ThumbsUp className="size-5 text-[var(--brand-700)]" />
                Send Thank You
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              <p className="text-sm text-[var(--neutral-600)]">
                Send a thank you message to {managedCreators.find((mc) => mc.creator.id === kudosCreatorId)?.creator.name} for their great work.
              </p>
              <textarea
                className="w-full rounded-lg border border-[var(--neutral-200)] px-3 py-2 text-sm placeholder:text-[var(--neutral-400)] focus:border-[var(--brand-700)] focus:outline-none focus:ring-1 focus:ring-[var(--brand-700)]"
                rows={3}
                value={kudosText}
                onChange={(e) => setKudosText(e.target.value)}
              />
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={() => setKudosCreatorId(null)}>
                  Cancel
                </Button>
                <Button
                  className="flex-1 gap-2 bg-[var(--brand-700)] hover:bg-[var(--brand-800)]"
                  onClick={() => sendKudos(kudosCreatorId)}
                >
                  <Send className="size-4" /> Send Thank You
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Bottom nav */}
      <div className="flex items-center justify-between pt-4 border-t border-[var(--neutral-200)]">
        <Button variant="outline" className="gap-2 border-[var(--neutral-200)]" onClick={onBack}>
          <ArrowLeft className="size-4" /> Back to Creators
        </Button>
        {allPosted ? (
          <Button
            className="gap-2 rounded-xl bg-[var(--brand-700)] hover:bg-[var(--brand-800)]"
            onClick={() => navigate("/")}
          >
            <Home className="size-4" /> Back to Dashboard
          </Button>
        ) : (
          <p className="text-xs text-[var(--neutral-400)]">
            Creators will be notified as you invite them. Track progress here.
          </p>
        )}
      </div>
    </div>
  );
}

/* ================================================================== */
/*  MAIN PAGE — ORCHESTRATOR                                          */
/* ================================================================== */
export default function CampaignFindTalent() {
  const [flowStep, setFlowStep] = useState<"ai_matching" | "select_creators" | "manage">("ai_matching");

  // Creator selection
  const [selectedCreatorIds, setSelectedCreatorIds] = useState<Set<string>>(new Set());
  const [detailCreator, setDetailCreator] = useState<DiscoverableCreator | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const toggleCreator = (creatorId: string) => {
    setSelectedCreatorIds((prev) => {
      const next = new Set(prev);
      if (next.has(creatorId)) next.delete(creatorId);
      else next.add(creatorId);
      return next;
    });
  };

  // Management
  const [managedCreators, setManagedCreators] = useState<ManagedCreator[]>([]);

  const goToManage = () => {
    const managed: ManagedCreator[] = Array.from(selectedCreatorIds).map((cid, i) => {
      const creator = MOCK_DISCOVERABLE_CREATORS.find((c) => c.id === cid)!;
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 7);

      const hasCompliantContent = i === 0;
      const hasNonCompliantContent = i === 1;

      return {
        creator,
        inviteStatus: "pending" as InviteStatus,
        compensationType: "gifted",
        compensationDetail: "",
        contentDueDate: dueDate.toISOString().split("T")[0],
        contentSubmission: hasCompliantContent
          ? {
              thumbnail: creator.recentPosts[0]?.thumbnail || creator.coverImage,
              type: "Instagram Reel",
              caption: `Loving this product from the campaign! Honest thoughts in the full video. #sponsored #collab @28litsea`,
              submittedAt: "Feb 18, 2026",
              aiReviewScore: 94,
              aiReviewNotes: [
                "Product shown in use — meets requirement",
                "Brand handle tagged in caption",
                "Required hashtags included",
                "Disclosure compliant (#sponsored)",
              ],
              aiIssues: [],
              brandReviewStatus: "pending" as const,
              brandComments: [],
            }
          : hasNonCompliantContent
            ? {
                thumbnail: creator.recentPosts[0]?.thumbnail || creator.coverImage,
                type: "Instagram Story",
                caption: `Check out this cool product! Link in bio #beauty`,
                submittedAt: "Feb 19, 2026",
                aiReviewScore: 52,
                aiReviewNotes: [
                  "Product visible in content",
                ],
                aiIssues: [
                  "Missing brand tag — @28litsea not found",
                  "Missing campaign hashtag #MeltedBalm",
                  "No #sponsored or #ad disclosure detected",
                  "Link sticker not included in story",
                ],
                brandReviewStatus: "pending" as const,
                brandComments: [],
              }
            : undefined,
      };
    });
    setManagedCreators(managed);
    setFlowStep("manage");
  };

  // Step number for indicator
  const stepNum = flowStep === "ai_matching" ? 1 : flowStep === "select_creators" ? 2 : 3;

  const handleStepClick = (step: number) => {
    if (step === 1 && stepNum > 1) {
      // Don't go back to AI matching — it would re-run
    }
    if (step === 2 && stepNum >= 2) {
      setFlowStep("select_creators");
    }
    // step 3 only accessible if already there
  };

  return (
    <div className="space-y-4">
      {/* Step indicator */}
      <StepIndicator
        currentStep={stepNum}
        totalSteps={3}
        onStepClick={handleStepClick}
      />

      {flowStep === "ai_matching" && (
        <AIMatchingScreen onComplete={() => setFlowStep("select_creators")} />
      )}

      {flowStep === "select_creators" && (
        <>
          <StepCreatorSelection
            creators={MOCK_DISCOVERABLE_CREATORS}
            selected={selectedCreatorIds}
            onToggle={toggleCreator}
            onSelectAll={() => setSelectedCreatorIds(new Set(MOCK_DISCOVERABLE_CREATORS.map((c) => c.id)))}
            onDeselectAll={() => setSelectedCreatorIds(new Set())}
            onViewDetail={(c) => { setDetailCreator(c); setDetailOpen(true); }}
            onNext={goToManage}
          />
          <CreatorDetailDialog
            creator={detailCreator}
            open={detailOpen}
            onClose={() => setDetailOpen(false)}
            isSelected={detailCreator ? selectedCreatorIds.has(detailCreator.id) : false}
            onToggleSelect={() => {
              if (detailCreator) toggleCreator(detailCreator.id);
            }}
          />
        </>
      )}

      {flowStep === "manage" && (
        <StepCreatorManagement
          managedCreators={managedCreators}
          setManagedCreators={setManagedCreators}
          onBack={() => setFlowStep("select_creators")}
        />
      )}
    </div>
  );
}
