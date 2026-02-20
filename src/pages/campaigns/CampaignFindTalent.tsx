import { useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
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
  MessageSquare,
  Zap,
  Target,
  DollarSign,
  Eye,
  Send,
  Clock,
  CheckCircle2,
  AlertCircle,
  Search,
  UserPlus,
  CalendarDays,
  ThumbsUp,
  RotateCcw,
  Shield,
} from "lucide-react";
import { formatFollowers } from "@/lib/format";

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
  matchScore: number; // 0-100 AI match score
  matchReasons: string[];
  recentPosts: { thumbnail: string; type: "reel" | "post" | "video"; views: number; likes: number }[];
  isExclusive: boolean; // Benable exclusive
  avgResponseTime: string;
  completionRate: number;
}

const MOCK_DISCOVERABLE_CREATORS: DiscoverableCreator[] = [
  {
    id: "dc-001", name: "Jessica Morales", handle: "@jessicabeauty",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&fit=crop&crop=face",
    coverImage: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&h=400&fit=crop",
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
    coverImage: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&h=400&fit=crop",
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
    coverImage: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=600&h=400&fit=crop",
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
    coverImage: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=600&h=400&fit=crop",
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
    coverImage: "https://images.unsplash.com/photo-1583209814683-c023dd293cc6?w=600&h=400&fit=crop",
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
    coverImage: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=600&h=400&fit=crop",
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
    coverImage: "https://images.unsplash.com/photo-1487412912498-0447578fcca8?w=600&h=400&fit=crop",
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
    coverImage: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&h=400&fit=crop",
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
/*  TYPEFORM-LIKE GOAL QUESTIONS                                      */
/* ================================================================== */
type TalentGoal = "word_of_mouth" | "small_budget" | "authentic_ugc" | "niche_audience" | "product_seeding" | "community_building";

const TALENT_GOALS: { value: TalentGoal; label: string; desc: string; icon: React.ElementType; color: string; bgColor: string }[] = [
  { value: "word_of_mouth", label: "Word of Mouth", desc: "Get genuine recommendations from trusted voices", icon: MessageSquare, color: "var(--brand-700)", bgColor: "var(--brand-100)" },
  { value: "small_budget", label: "Small Budget, Big Impact", desc: "Maximize reach without breaking the bank", icon: DollarSign, color: "var(--green-700)", bgColor: "var(--green-100)" },
  { value: "authentic_ugc", label: "Authentic UGC", desc: "Real content from real people who love your product", icon: Heart, color: "#C2528B", bgColor: "#FDF2F8" },
  { value: "niche_audience", label: "Reach a Niche Audience", desc: "Connect with exactly the right people", icon: Target, color: "var(--blue-700)", bgColor: "var(--blue-100)" },
  { value: "product_seeding", label: "Product Seeding", desc: "Get your product into the right hands at scale", icon: Zap, color: "var(--orange-700)", bgColor: "var(--orange-100)" },
  { value: "community_building", label: "Build Community", desc: "Grow a loyal community around your brand", icon: Users, color: "#7B61C2", bgColor: "#F3EEFF" },
];

function StepGoals({ selected, onToggle, onNext }: {
  selected: TalentGoal[];
  onToggle: (goal: TalentGoal) => void;
  onNext: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-[var(--brand-100)] px-4 py-1.5 mb-4">
            <Sparkles className="size-4 text-[var(--brand-700)]" />
            <span className="text-sm font-medium text-[var(--brand-700)]">Powered by Benable AI</span>
          </div>
          <h1 className="text-3xl font-bold text-[var(--neutral-800)]">
            What are your main goals?
          </h1>
          <p className="mt-2 text-[var(--neutral-500)]">
            Select all that apply — we'll find creators that match your priorities.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {TALENT_GOALS.map((goal) => {
            const active = selected.includes(goal.value);
            return (
              <button
                key={goal.value}
                onClick={() => onToggle(goal.value)}
                className="relative flex items-center gap-4 rounded-xl p-4 text-left transition-all"
                style={{
                  backgroundColor: active ? goal.bgColor : "white",
                  border: `2px solid ${active ? goal.color : "var(--neutral-200)"}`,
                }}
              >
                {active && (
                  <div className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full" style={{ backgroundColor: goal.color }}>
                    <Check className="size-3 text-white" />
                  </div>
                )}
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl" style={{ backgroundColor: active ? `${goal.color}20` : goal.bgColor }}>
                  <goal.icon className="size-5" style={{ color: goal.color }} />
                </div>
                <div>
                  <p className="text-sm font-semibold" style={{ color: active ? goal.color : "var(--neutral-800)" }}>{goal.label}</p>
                  <p className="text-xs text-[var(--neutral-500)]">{goal.desc}</p>
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
                Their audiences trust them like friends — and that trust converts. Benable's AI identifies the creators
                whose audiences overlap most with your ideal customer.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-center">
          <Button
            className="gap-2 bg-[var(--brand-700)] hover:bg-[var(--brand-800)] px-8"
            size="lg"
            onClick={onNext}
            disabled={selected.length === 0}
          >
            Find My Creators <ArrowRight className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

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

  useState(() => {
    let p = 0;
    const interval = setInterval(() => {
      p += 2;
      setProgress(p);
      if (p >= 20 && step === 0) setStep(1);
      if (p >= 40 && step <= 1) setStep(2);
      if (p >= 60 && step <= 2) setStep(3);
      if (p >= 85 && step <= 3) setStep(4);
      if (p >= 100) {
        clearInterval(interval);
        setTimeout(onComplete, 500);
      }
    }, 60);
    return () => clearInterval(interval);
  });

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div className="max-w-md w-full text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-[var(--brand-100)]">
          <Brain className="size-10 text-[var(--brand-700)] animate-pulse" />
        </div>
        <h2 className="text-2xl font-bold text-[var(--neutral-800)]">
          Benable AI is finding your perfect creators
        </h2>
        <p className="mt-2 text-sm text-[var(--neutral-500)]">
          Our proprietary matching engine analyzes thousands of data points
        </p>
        <div className="mt-8">
          <Progress value={progress} className="h-2" />
          <p className="mt-3 text-sm font-medium text-[var(--brand-700)]">
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
        {/* Cover image */}
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
          {/* Match score */}
          <div className="absolute top-4 right-4 flex items-center gap-1.5 rounded-full bg-white/90 backdrop-blur px-3 py-1.5 shadow">
            <Sparkles className="size-3.5 text-[var(--brand-700)]" />
            <span className="text-sm font-bold text-[var(--brand-700)]">{creator.matchScore}% match</span>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* AI Match Reasons */}
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

          {/* Stats grid */}
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

          {/* Bio */}
          <div>
            <p className="text-sm text-[var(--neutral-600)] leading-relaxed">{creator.bio}</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {creator.categories.map((c) => (
                <Badge key={c} variant="outline" className="text-[10px] border-[var(--neutral-200)]">{c}</Badge>
              ))}
            </div>
          </div>

          {/* Audience breakdown */}
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

          {/* Recent Content */}
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

          {/* Reliability stats */}
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

          {/* Action button */}
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
  onBack,
}: {
  creators: DiscoverableCreator[];
  selected: Set<string>;
  onToggle: (id: string) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  onViewDetail: (creator: DiscoverableCreator) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = useMemo(() => {
    if (!searchQuery) return creators;
    const q = searchQuery.toLowerCase();
    return creators.filter(
      (c) => c.name.toLowerCase().includes(q) || c.handle.toLowerCase().includes(q) || c.categories.some((cat) => cat.toLowerCase().includes(q))
    );
  }, [creators, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="size-5 text-[var(--brand-700)]" />
            <h2 className="text-xl font-bold text-[var(--neutral-800)]">
              Your AI-Curated Creators
            </h2>
          </div>
          <p className="text-sm text-[var(--neutral-500)]">
            {creators.length} creators matched to your campaign — ranked by fit score
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[var(--neutral-400)]" />
            <Input
              placeholder="Search creators..."
              className="pl-9 w-56 border-[var(--neutral-200)]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Bulk actions bar */}
      <div className="flex items-center justify-between rounded-lg border border-[var(--neutral-200)] bg-[var(--neutral-100)] px-4 py-2.5">
        <div className="flex items-center gap-3">
          <Checkbox
            checked={selected.size === creators.length && creators.length > 0}
            onCheckedChange={(c) => c ? onSelectAll() : onDeselectAll()}
            className="data-[state=checked]:bg-[var(--brand-700)] data-[state=checked]:border-[var(--brand-700)]"
          />
          <span className="text-sm text-[var(--neutral-600)]">
            {selected.size > 0
              ? <><span className="font-semibold text-[var(--brand-700)]">{selected.size}</span> creator{selected.size !== 1 ? "s" : ""} selected</>
              : "Select creators to add to your campaign"
            }
          </span>
        </div>
        <div className="flex items-center gap-2">
          {selected.size > 0 && (
            <Button variant="ghost" size="sm" className="text-xs text-[var(--neutral-500)]" onClick={onDeselectAll}>
              Clear selection
            </Button>
          )}
        </div>
      </div>

      {/* Creator grid */}
      <div className="grid grid-cols-4 gap-4">
        {filtered.map((creator) => {
          const isSelected = selected.has(creator.id);
          return (
            <div
              key={creator.id}
              className="group relative overflow-hidden rounded-xl border-2 transition-all cursor-pointer"
              style={{
                borderColor: isSelected ? "var(--brand-700)" : "var(--neutral-200)",
              }}
            >
              {/* Selection checkbox */}
              <div className="absolute top-3 left-3 z-10" onClick={(e) => { e.stopPropagation(); onToggle(creator.id); }}>
                <div className={`flex h-6 w-6 items-center justify-center rounded-md transition-all ${
                  isSelected ? "bg-[var(--brand-700)]" : "bg-white/80 backdrop-blur border border-[var(--neutral-300)]"
                }`}>
                  {isSelected && <Check className="size-3.5 text-white" />}
                </div>
              </div>

              {/* Match score badge */}
              <div className="absolute top-3 right-3 z-10">
                <div className="flex items-center gap-1 rounded-full bg-white/90 backdrop-blur px-2 py-0.5 shadow-sm">
                  <Sparkles className="size-3 text-[var(--brand-700)]" />
                  <span className="text-[11px] font-bold text-[var(--brand-700)]">{creator.matchScore}%</span>
                </div>
              </div>

              {/* Cover/hero image — 80% of tile */}
              <div className="aspect-[4/5] overflow-hidden" onClick={() => onViewDetail(creator)}>
                <img
                  src={creator.coverImage}
                  alt={creator.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
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
                  <span className="flex items-center gap-0.5"><Users className="size-3" /> {formatFollowers(creator.followerCount)}</span>
                  <span className="flex items-center gap-0.5"><Heart className="size-3" /> {creator.engagementRate}%</span>
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
        <Button variant="outline" className="gap-2 border-[var(--neutral-200)]" onClick={onBack}>
          <ArrowLeft className="size-4" /> Back
        </Button>
        <Button className="gap-2 bg-[var(--brand-700)] hover:bg-[var(--brand-800)]" onClick={onNext} disabled={selected.size === 0}>
          Continue with {selected.size} Creator{selected.size !== 1 ? "s" : ""} <ArrowRight className="size-4" />
        </Button>
      </div>
    </div>
  );
}

/* ================================================================== */
/*  CREATOR MANAGEMENT — Invite, Schedule, Track                      */
/* ================================================================== */
type InviteStatus = "pending" | "invited" | "accepted" | "content_due" | "content_submitted" | "in_review" | "approved" | "revision_requested" | "published";

interface ManagedCreator {
  creator: DiscoverableCreator;
  inviteStatus: InviteStatus;
  compensation: string;
  contentDueDate: string;
  contentSubmission?: {
    thumbnail: string;
    type: string;
    caption: string;
    submittedAt: string;
    aiReviewScore: number;
    aiReviewNotes: string[];
    brandReviewStatus: "pending" | "approved" | "revision_requested";
    brandComments: string[];
  };
}

const INVITE_STATUS_STYLES: Record<InviteStatus, { label: string; color: string; bg: string }> = {
  pending: { label: "Pending", color: "var(--neutral-600)", bg: "var(--neutral-100)" },
  invited: { label: "Invited", color: "var(--blue-700)", bg: "var(--blue-100)" },
  accepted: { label: "Accepted", color: "var(--green-700)", bg: "var(--green-100)" },
  content_due: { label: "Content Due", color: "var(--orange-700)", bg: "var(--orange-100)" },
  content_submitted: { label: "Submitted", color: "var(--brand-700)", bg: "var(--brand-100)" },
  in_review: { label: "In Review", color: "var(--blue-700)", bg: "var(--blue-100)" },
  approved: { label: "Approved", color: "var(--green-700)", bg: "var(--green-100)" },
  revision_requested: { label: "Revisions", color: "var(--orange-700)", bg: "var(--orange-100)" },
  published: { label: "Published", color: "var(--green-700)", bg: "var(--green-100)" },
};

function StepCreatorManagement({
  managedCreators,
  setManagedCreators,
  campaignGoLive,
  setCampaignGoLive,
  onBack,
  onLaunch,
}: {
  managedCreators: ManagedCreator[];
  setManagedCreators: React.Dispatch<React.SetStateAction<ManagedCreator[]>>;
  campaignGoLive: string;
  setCampaignGoLive: (d: string) => void;
  onBack: () => void;
  onLaunch: () => void;
}) {
  const [reviewCreator, setReviewCreator] = useState<ManagedCreator | null>(null);
  const [commentText, setCommentText] = useState("");

  const defaultDueDate = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d.toISOString().split("T")[0];
  }, []);

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

  const updateCompensation = (id: string, comp: string) => {
    setManagedCreators((prev) =>
      prev.map((mc) =>
        mc.creator.id === id ? { ...mc, compensation: comp } : mc
      )
    );
  };

  const updateDueDate = (id: string, date: string) => {
    setManagedCreators((prev) =>
      prev.map((mc) =>
        mc.creator.id === id ? { ...mc, contentDueDate: date } : mc
      )
    );
  };

  const approveContent = (id: string) => {
    setManagedCreators((prev) =>
      prev.map((mc) =>
        mc.creator.id === id && mc.contentSubmission
          ? { ...mc, inviteStatus: "approved", contentSubmission: { ...mc.contentSubmission, brandReviewStatus: "approved" } }
          : mc
      )
    );
    setReviewCreator(null);
  };

  const requestRevision = (id: string) => {
    setManagedCreators((prev) =>
      prev.map((mc) =>
        mc.creator.id === id && mc.contentSubmission
          ? {
              ...mc,
              inviteStatus: "revision_requested",
              contentSubmission: {
                ...mc.contentSubmission,
                brandReviewStatus: "revision_requested",
                brandComments: commentText ? [...mc.contentSubmission.brandComments, commentText] : mc.contentSubmission.brandComments,
              },
            }
          : mc
      )
    );
    setCommentText("");
    setReviewCreator(null);
  };

  // Simulate some creators having submitted content
  const creatorsWithContent = managedCreators.filter((mc) => mc.contentSubmission);
  const pendingReview = creatorsWithContent.filter((mc) => mc.contentSubmission?.brandReviewStatus === "pending");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[var(--neutral-800)]">Campaign Management</h2>
          <p className="text-sm text-[var(--neutral-500)]">
            Invite creators, set deadlines, and manage deliverables
          </p>
        </div>
        {pendingReview.length > 0 && (
          <Badge className="bg-[var(--brand-100)] text-[var(--brand-700)] border-0 gap-1 px-3 py-1.5">
            <AlertCircle className="size-3.5" />
            {pendingReview.length} content pending review
          </Badge>
        )}
      </div>

      {/* Campaign schedule bar */}
      <Card className="border-[var(--neutral-200)]">
        <CardContent className="p-4">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <CalendarDays className="size-5 text-[var(--brand-700)]" />
              <div>
                <Label className="text-xs text-[var(--neutral-500)]">Campaign Go-Live Target</Label>
                <Input
                  type="date"
                  className="h-8 w-40 text-sm border-[var(--neutral-200)]"
                  value={campaignGoLive}
                  onChange={(e) => setCampaignGoLive(e.target.value)}
                />
              </div>
            </div>
            <Separator orientation="vertical" className="h-10" />
            <div>
              <Label className="text-xs text-[var(--neutral-500)]">Default Content Due</Label>
              <p className="text-sm font-medium text-[var(--neutral-800)]">{defaultDueDate}</p>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <Button
                size="sm"
                className="gap-1.5 bg-[var(--brand-700)] hover:bg-[var(--brand-800)]"
                onClick={inviteAll}
              >
                <Send className="size-3.5" /> Invite All
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Creator list */}
      <Card className="border-[var(--neutral-200)]">
        <div className="divide-y divide-[var(--neutral-200)]">
          {/* Header row */}
          <div className="grid grid-cols-[2fr_1.2fr_1fr_1fr_1fr_auto] gap-4 px-5 py-3 bg-[var(--neutral-100)] text-xs font-medium text-[var(--neutral-500)]">
            <span>Creator</span>
            <span>Compensation</span>
            <span>Content Due</span>
            <span>Status</span>
            <span>Deliverables</span>
            <span>Action</span>
          </div>

          {managedCreators.map((mc) => {
            const statusStyle = INVITE_STATUS_STYLES[mc.inviteStatus];
            return (
              <div key={mc.creator.id} className="grid grid-cols-[2fr_1.2fr_1fr_1fr_1fr_auto] gap-4 items-center px-5 py-3.5 hover:bg-[var(--neutral-100)]/50 transition-colors">
                {/* Creator info */}
                <div className="flex items-center gap-3">
                  <img src={mc.creator.avatar} alt="" className="h-9 w-9 rounded-full object-cover" />
                  <div>
                    <p className="text-sm font-medium text-[var(--neutral-800)]">{mc.creator.name}</p>
                    <p className="text-xs text-[var(--neutral-500)]">{mc.creator.handle} · {formatFollowers(mc.creator.followerCount)}</p>
                  </div>
                </div>

                {/* Compensation — editable */}
                <Input
                  className="h-8 text-xs border-[var(--neutral-200)]"
                  value={mc.compensation}
                  onChange={(e) => updateCompensation(mc.creator.id, e.target.value)}
                  placeholder="e.g., Gifted product"
                />

                {/* Due date — editable */}
                <Input
                  type="date"
                  className="h-8 text-xs border-[var(--neutral-200)]"
                  value={mc.contentDueDate}
                  onChange={(e) => updateDueDate(mc.creator.id, e.target.value)}
                />

                {/* Status */}
                <Badge
                  className="text-[11px] font-medium border-0 w-fit"
                  style={{ backgroundColor: statusStyle.bg, color: statusStyle.color }}
                >
                  {statusStyle.label}
                </Badge>

                {/* Deliverables */}
                {mc.contentSubmission ? (
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs gap-1 border-[var(--brand-400)] text-[var(--brand-700)]"
                    onClick={() => setReviewCreator(mc)}
                  >
                    <Eye className="size-3" /> Review
                  </Button>
                ) : (
                  <span className="text-xs text-[var(--neutral-400)]">—</span>
                )}

                {/* Action */}
                {mc.inviteStatus === "pending" ? (
                  <Button
                    size="sm"
                    className="text-xs gap-1 bg-[var(--brand-700)] hover:bg-[var(--brand-800)]"
                    onClick={() => inviteOne(mc.creator.id)}
                  >
                    <Send className="size-3" /> Invite
                  </Button>
                ) : (
                  <span className="text-xs text-[var(--green-500)]"><Check className="size-4" /></span>
                )}
              </div>
            );
          })}
        </div>
      </Card>

      {/* Content Review Dialog */}
      {reviewCreator && reviewCreator.contentSubmission && (
        <Dialog open={!!reviewCreator} onOpenChange={() => setReviewCreator(null)}>
          <DialogContent className="max-w-xl p-0">
            <DialogHeader className="p-6 pb-0">
              <DialogTitle className="flex items-center gap-3">
                <img src={reviewCreator.creator.avatar} alt="" className="h-8 w-8 rounded-full object-cover" />
                <div>
                  <span>{reviewCreator.creator.name}</span>
                  <p className="text-xs font-normal text-[var(--neutral-500)]">Content Review</p>
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
                  <Badge className="text-[11px] border-0 bg-[var(--green-100)] text-[var(--green-700)]">
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
                </div>
              </div>

              {/* Previous brand comments */}
              {reviewCreator.contentSubmission.brandComments.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-[var(--neutral-600)]">Previous Comments</p>
                  {reviewCreator.contentSubmission.brandComments.map((c, i) => (
                    <div key={i} className="rounded-lg bg-[var(--neutral-100)] p-3 text-xs text-[var(--neutral-700)]">{c}</div>
                  ))}
                </div>
              )}

              {/* Comment field */}
              <div className="space-y-2">
                <Label className="text-xs text-[var(--neutral-600)]">Add a comment (optional)</Label>
                <textarea
                  className="w-full rounded-lg border border-[var(--neutral-200)] px-3 py-2 text-sm placeholder:text-[var(--neutral-400)] focus:border-[var(--brand-700)] focus:outline-none focus:ring-1 focus:ring-[var(--brand-700)]"
                  rows={3}
                  placeholder="Share feedback, request changes, or leave notes for the creator..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                />
              </div>

              {/* Action buttons */}
              <div className="flex gap-3">
                <Button
                  className="flex-1 gap-2 bg-[var(--green-500)] hover:bg-[var(--green-700)]"
                  onClick={() => approveContent(reviewCreator.creator.id)}
                >
                  <ThumbsUp className="size-4" /> Approve for Publication
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 gap-2 border-[var(--orange-300)] text-[var(--orange-700)] hover:bg-[var(--orange-100)]"
                  onClick={() => requestRevision(reviewCreator.creator.id)}
                >
                  <RotateCcw className="size-4" /> Request Revisions
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Bottom nav */}
      <div className="flex items-center justify-between pt-4 border-t border-[var(--neutral-200)]">
        <Button variant="outline" className="gap-2 border-[var(--neutral-200)]" onClick={onBack}>
          <ArrowLeft className="size-4" /> Back
        </Button>
        <Button className="gap-2 bg-[var(--brand-700)] hover:bg-[var(--brand-800)]" onClick={onLaunch}>
          <Zap className="size-4" /> Launch Campaign
        </Button>
      </div>
    </div>
  );
}

/* ================================================================== */
/*  MAIN PAGE — ORCHESTRATOR                                          */
/* ================================================================== */
export default function CampaignFindTalent() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Flow steps: goals → ai_matching → select_creators → manage
  const [flowStep, setFlowStep] = useState<"goals" | "ai_matching" | "select_creators" | "manage">("goals");

  // Goals
  const [selectedGoals, setSelectedGoals] = useState<TalentGoal[]>([]);
  const toggleGoal = (g: TalentGoal) => setSelectedGoals((prev) => prev.includes(g) ? prev.filter((x) => x !== g) : [...prev, g]);

  // Creator selection
  const [selectedCreatorIds, setSelectedCreatorIds] = useState<Set<string>>(new Set());
  const [detailCreator, setDetailCreator] = useState<DiscoverableCreator | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const toggleCreator = (id: string) => {
    setSelectedCreatorIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Management
  const [managedCreators, setManagedCreators] = useState<ManagedCreator[]>([]);
  const [campaignGoLive, setCampaignGoLive] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 14);
    return d.toISOString().split("T")[0];
  });
  const [launched, setLaunched] = useState(false);

  const goToManage = () => {
    // Build managed creators from selection — simulate some content submissions
    const managed: ManagedCreator[] = Array.from(selectedCreatorIds).map((cid, i) => {
      const creator = MOCK_DISCOVERABLE_CREATORS.find((c) => c.id === cid)!;
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 7);

      // Simulate: first 2 creators have submitted content
      const hasContent = i < 2;

      return {
        creator,
        inviteStatus: "pending" as InviteStatus,
        compensation: "Gifted product",
        contentDueDate: dueDate.toISOString().split("T")[0],
        contentSubmission: hasContent
          ? {
              thumbnail: creator.recentPosts[0]?.thumbnail || creator.coverImage,
              type: "Instagram Reel",
              caption: `Loving this product from the campaign! Honest thoughts in the full video. #sponsored #collab`,
              submittedAt: "Feb 18, 2026",
              aiReviewScore: 92,
              aiReviewNotes: [
                "Product shown in use — meets requirement",
                "Brand handle tagged in caption",
                "Required hashtags included",
                "Disclosure compliant (#sponsored)",
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

  const handleLaunch = () => {
    setLaunched(true);
    setTimeout(() => navigate(id ? `/campaigns/${id}` : "/campaigns"), 2500);
  };

  if (launched) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--green-100)]">
          <CheckCircle2 className="size-8 text-[var(--green-500)]" />
        </div>
        <h2 className="mt-6 text-2xl font-bold text-[var(--neutral-800)]">Campaign Launched!</h2>
        <p className="mt-2 max-w-md text-center text-sm text-[var(--neutral-500)]">
          Your invitations are being sent to creators. You'll be notified as they respond. Redirecting...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Progress bar */}
      <div className="flex items-center gap-2 text-xs text-[var(--neutral-500)]">
        {["Set Goals", "Find Creators", "Select", "Manage & Launch"].map((label, i) => {
          const steps = ["goals", "ai_matching", "select_creators", "manage"];
          const currentIdx = steps.indexOf(flowStep);
          const isComplete = i < currentIdx;
          const isCurrent = i === currentIdx;
          return (
            <div key={label} className="flex items-center gap-2">
              <div className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-medium ${
                isComplete ? "bg-[var(--green-500)] text-white" : isCurrent ? "bg-[var(--brand-700)] text-white" : "bg-[var(--neutral-200)] text-[var(--neutral-500)]"
              }`}>
                {isComplete ? <Check className="size-3" /> : i + 1}
              </div>
              <span className={isCurrent ? "font-semibold text-[var(--neutral-800)]" : ""}>{label}</span>
              {i < 3 && <div className={`mx-1 h-px w-8 ${isComplete ? "bg-[var(--green-500)]" : "bg-[var(--neutral-200)]"}`} />}
            </div>
          );
        })}
      </div>

      {flowStep === "goals" && (
        <StepGoals
          selected={selectedGoals}
          onToggle={toggleGoal}
          onNext={() => setFlowStep("ai_matching")}
        />
      )}

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
            onBack={() => setFlowStep("goals")}
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
          campaignGoLive={campaignGoLive}
          setCampaignGoLive={setCampaignGoLive}
          onBack={() => setFlowStep("select_creators")}
          onLaunch={handleLaunch}
        />
      )}
    </div>
  );
}
