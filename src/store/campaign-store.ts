// Campaign data types and store — based on Brand Portal v2 spec

export type CampaignMode = "open" | "targeted" | "debut";
export type CampaignGoal = "awareness" | "sales" | "product_launch" | "ugc";
export type Platform = "benable" | "instagram" | "tiktok";
export type ContentFormat =
  | "instagram_post"
  | "instagram_reel"
  | "instagram_story"
  | "tiktok_video"
  | "benable_post";
export type BudgetType = "spend_cap" | "product_inventory" | "flexible" | "spend_cap_and_inventory";
export type CompensationType = "gifted" | "gift_card" | "discount" | "paid" | "commission_boost";
export type CampaignStatus = "draft" | "active" | "filled" | "completed";
export type CreatorCountTarget = "5-15" | "15-30" | "30+";
export type CreatorType = "any" | "pico" | "nano" | "micro";

export type ContentRequirement =
  | "show_product_in_use"
  | "include_product_name"
  | "tag_brand"
  | "use_hashtags"
  | "show_labels";

export interface CompensationConfig {
  type: CompensationType;
  enabled: boolean;
  productName?: string;
  productUrl?: string;
  estValuePerUnit?: number;
  giftCardValue?: number;
  giftCardBrand?: string;
  giftCardDelivery?: "benable_sends" | "brand_provides";
  discountCode?: string;
  discountAmount?: number;
  discountType?: "percent" | "dollar";
  feeMin?: number;
  feeMax?: number;
  commissionRate?: number;
}

export interface CampaignDraft {
  // Step 1
  mode?: CampaignMode;
  title: string;
  goal?: CampaignGoal;
  platforms: Platform[];
  contentFormats: ContentFormat[];
  budgetType?: BudgetType;
  budgetCapAmount?: number;
  budgetInventoryCount?: number;
  budgetProductName?: string;
  creatorCountTarget?: CreatorCountTarget;
  creatorTypes: CreatorType[];
  creatorCount?: number;
  creatorCategories: string[];
  selectedCreators: string[];
  compensationTypes: CompensationConfig[];

  // Step 2
  description: string;
  briefFile?: File | null;
  contentRequirements: ContentRequirement[];
  hashtags: string;
  flightDateStart: string;
  flightDateEnd: string;
  ugcRights: boolean;
  ugcRightsDuration?: "30_days" | "60_days" | "90_days" | "perpetual";
  ugcExclusivity?: boolean;
  ugcExclusivityDays?: number;
  contentReviewRequired: boolean;
}

export const defaultCompensationTypes: CompensationConfig[] = [
  { type: "gifted", enabled: false },
  { type: "gift_card", enabled: false },
  { type: "discount", enabled: false },
  { type: "paid", enabled: false },
  { type: "commission_boost", enabled: false },
];

export const emptyCampaignDraft: CampaignDraft = {
  mode: undefined,
  title: "",
  goal: undefined,
  platforms: ["benable"],
  contentFormats: ["benable_post"],
  budgetType: undefined,
  budgetCapAmount: undefined,
  budgetInventoryCount: undefined,
  budgetProductName: undefined,
  creatorCountTarget: undefined,
  creatorTypes: [],
  creatorCount: undefined,
  creatorCategories: [],
  selectedCreators: [],
  compensationTypes: [...defaultCompensationTypes],
  description: "",
  briefFile: null,
  contentRequirements: ["show_product_in_use"],
  hashtags: "",
  flightDateStart: "",
  flightDateEnd: "",
  ugcRights: true,
  ugcRightsDuration: "90_days",
  ugcExclusivity: false,
  ugcExclusivityDays: undefined,
  contentReviewRequired: false,
};

// Creator-Campaign Assignment types
export type CreatorStatus =
  | "recommended"
  | "invited"
  | "applied"
  | "accepted"
  | "negotiating"
  | "product_shipped"
  | "gift_card_sent"
  | "content_submitted"
  | "content_approved"
  | "posted"
  | "complete"
  | "declined";

export interface ContentSubmission {
  id: string;
  fileUrl: string;
  platform: Platform;
  contentType: "reel" | "story" | "post" | "video" | "recommendation";
  caption?: string;
  submittedAt: string;
  reviewStatus?: "pending" | "approved" | "changes_requested";
  liveUrl?: string;
}

export interface CreatorAssignment {
  campaignId: string;
  creatorId: string;
  creatorName: string;
  creatorHandle: string;
  creatorAvatar: string;
  platforms: Platform[];
  categories: string[];
  followerCount: number;
  engagementRate: number;        // e.g., 4.2 = 4.2%
  avgLikes: number;
  audienceTopAge: string;        // e.g., "25-34"
  audienceTopGender: string;     // e.g., "78% Female"
  audienceTopLocation: string;   // e.g., "US (62%)"
  bio: string;
  recentPostThumbnails: string[];
  aiMatchReason?: string;        // e.g., "Already recommends 3 products in your category"
  isExclusive: boolean;
  pastCampaignCount: number;
  status: CreatorStatus;
  compensation: {
    type: CompensationType;
    amount: number;
    giftCardCode?: string;
    giftCardStatus?: "pending" | "sent" | "viewed" | "redeemed";
  };
  contentSubmissions: ContentSubmission[];
  joinedAt: string;
}

export interface Campaign extends Omit<CampaignDraft, 'briefFile'> {
  id: string;
  status: CampaignStatus;
  budgetAllocated: number;
  createdAt: string;
  brandId: string;
  creators: CreatorAssignment[];
}

// --- Mock data for demo ---

export const MOCK_CAMPAIGNS: Campaign[] = [
  {
    id: "camp-001",
    mode: "open",
    title: "Melted Balm Spring Launch",
    goal: "awareness",
    platforms: ["benable", "instagram"],
    contentFormats: ["benable_post", "instagram_reel", "instagram_story"],
    budgetType: "product_inventory",
    budgetInventoryCount: 50,
    budgetProductName: "Melted Balm",
    creatorCountTarget: "15-30",
    creatorTypes: ["nano", "micro"],
    creatorCategories: ["Beauty", "Wellness", "Lifestyle"],
    selectedCreators: [],
    compensationTypes: [
      { type: "gifted", enabled: true, productName: "Melted Balm", estValuePerUnit: 35 },
      { type: "gift_card", enabled: false },
      { type: "discount", enabled: false },
      { type: "paid", enabled: false },
      { type: "commission_boost", enabled: false },
    ],
    description: "We're launching our bestselling Melted Balm for spring! We're looking for creators who love clean beauty and skincare to try our product and share their honest experience. Show the product in use — applying it, carrying it in your bag, incorporating it into your routine.",
    contentRequirements: ["show_product_in_use", "tag_brand", "use_hashtags"],
    hashtags: "#28Litsea #MeltedBalm #CleanBeauty",
    flightDateStart: "2026-03-01",
    flightDateEnd: "2026-03-31",
    ugcRights: true,
    contentReviewRequired: false,
    status: "active",
    budgetAllocated: 12,
    createdAt: "2026-02-10",
    brandId: "brand-001",
    creators: [
      {
        campaignId: "camp-001",
        creatorId: "cr-001",
        creatorName: "Jessica Morales",
        creatorHandle: "@jessicabeauty",
        creatorAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&fit=crop&crop=face",
        platforms: ["instagram", "benable"],
        categories: ["Beauty", "Skincare"],
        followerCount: 820,
        engagementRate: 6.8,
        avgLikes: 56,
        audienceTopAge: "18-24",
        audienceTopGender: "82% Female",
        audienceTopLocation: "US (71%)",
        bio: "Clean beauty obsessed. Skincare minimalist sharing what actually works.",
        recentPostThumbnails: [
          "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=150&h=150&fit=crop",
          "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=150&h=150&fit=crop",
          "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=150&h=150&fit=crop",
        ],
        aiMatchReason: "Already recommends 3 clean beauty products in your category",
        isExclusive: true,
        pastCampaignCount: 0,
        status: "accepted",
        compensation: { type: "gifted", amount: 35 },
        contentSubmissions: [],
        joinedAt: "2026-02-11",
      },
      {
        campaignId: "camp-001",
        creatorId: "cr-002",
        creatorName: "Chelsea Park",
        creatorHandle: "@chelseaglow",
        creatorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop&crop=face",
        platforms: ["instagram", "tiktok", "benable"],
        categories: ["Beauty", "Lifestyle"],
        followerCount: 2400,
        engagementRate: 4.2,
        avgLikes: 101,
        audienceTopAge: "25-34",
        audienceTopGender: "76% Female",
        audienceTopLocation: "US (58%)",
        bio: "Everyday beauty & lifestyle. Making the every-day feel luxe without the price tag.",
        recentPostThumbnails: [
          "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=150&h=150&fit=crop",
          "https://images.unsplash.com/photo-1487412912498-0447578fcca8?w=150&h=150&fit=crop",
          "https://images.unsplash.com/photo-1583209814683-c023dd293cc6?w=150&h=150&fit=crop",
        ],
        aiMatchReason: "High engagement in Beauty + strong Benable recommendation history",
        isExclusive: false,
        pastCampaignCount: 1,
        status: "content_submitted",
        compensation: { type: "gifted", amount: 35 },
        contentSubmissions: [
          {
            id: "cs-001",
            fileUrl: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop",
            platform: "instagram",
            contentType: "reel",
            caption: "Obsessed with this clean beauty balm from @28litsea! The texture is incredible and it melts right into your skin. #28Litsea #MeltedBalm #CleanBeauty",
            submittedAt: "2026-02-12",
            reviewStatus: "approved",
          },
          {
            id: "cs-002",
            fileUrl: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400&h=400&fit=crop",
            platform: "benable",
            contentType: "recommendation",
            caption: "28 Litsea Melted Balm — My new holy grail for dry winter skin. Clean ingredients, gorgeous packaging.",
            submittedAt: "2026-02-12",
            reviewStatus: "approved",
          },
        ],
        joinedAt: "2026-02-11",
      },
      {
        campaignId: "camp-001",
        creatorId: "cr-003",
        creatorName: "Cassidy Nguyen",
        creatorHandle: "@cassidywellness",
        creatorAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120&h=120&fit=crop&crop=face",
        platforms: ["benable"],
        categories: ["Wellness", "Skincare"],
        followerCount: 340,
        engagementRate: 9.1,
        avgLikes: 31,
        audienceTopAge: "18-24",
        audienceTopGender: "88% Female",
        audienceTopLocation: "US (83%)",
        bio: "Wellness from the inside out. Sharing my clean living journey.",
        recentPostThumbnails: [
          "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=150&h=150&fit=crop",
        ],
        aiMatchReason: "Benable-only creator — net new reach for your brand",
        isExclusive: true,
        pastCampaignCount: 0,
        status: "invited",
        compensation: { type: "gifted", amount: 35 },
        contentSubmissions: [],
        joinedAt: "2026-02-12",
      },
    ],
  },
  {
    id: "camp-002",
    mode: "targeted",
    title: "Rare Beauty Launch at Ulta Beauty",
    goal: "product_launch",
    platforms: ["benable", "instagram", "tiktok"],
    contentFormats: ["benable_post", "instagram_reel", "instagram_post", "tiktok_video"],
    budgetType: "spend_cap",
    budgetCapAmount: 15000,
    creatorCountTarget: undefined,
    creatorTypes: ["any"],
    creatorCategories: [],
    selectedCreators: ["cr-004", "cr-005", "cr-006"],
    compensationTypes: [
      { type: "gifted", enabled: false },
      { type: "gift_card", enabled: true, giftCardValue: 100, giftCardBrand: "Ulta Beauty" },
      { type: "discount", enabled: false },
      { type: "paid", enabled: true, feeMin: 200, feeMax: 500 },
      { type: "commission_boost", enabled: false },
    ],
    description: "We're launching Rare Beauty exclusively at Ulta Beauty stores and online. Looking for creators to showcase the new collection with authentic, glowing content.",
    contentRequirements: ["show_product_in_use", "include_product_name", "tag_brand", "use_hashtags"],
    hashtags: "#RareBeauty #UltaBeauty #ad",
    flightDateStart: "2026-03-15",
    flightDateEnd: "2026-04-15",
    ugcRights: true,
    contentReviewRequired: true,
    status: "active",
    budgetAllocated: 3500,
    createdAt: "2026-02-08",
    brandId: "brand-002",
    creators: [
      {
        campaignId: "camp-002",
        creatorId: "cr-004",
        creatorName: "Amara Johnson",
        creatorHandle: "@amarabeautyco",
        creatorAvatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=120&h=120&fit=crop&crop=face",
        platforms: ["instagram", "tiktok", "benable"],
        categories: ["Beauty", "Fashion"],
        followerCount: 5200,
        engagementRate: 3.8,
        avgLikes: 198,
        audienceTopAge: "25-34",
        audienceTopGender: "74% Female",
        audienceTopLocation: "US (52%)",
        bio: "Beauty & fashion creator. Discovering and sharing new favorites every week.",
        recentPostThumbnails: [
          "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=150&h=150&fit=crop",
          "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=150&h=150&fit=crop",
        ],
        aiMatchReason: undefined,
        isExclusive: false,
        pastCampaignCount: 0,
        status: "accepted",
        compensation: { type: "paid", amount: 300, giftCardCode: "ULTA-AMJ-100", giftCardStatus: "sent" },
        contentSubmissions: [
          {
            id: "cs-003",
            fileUrl: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=400&h=400&fit=crop",
            platform: "instagram",
            contentType: "reel",
            caption: "Rare Beauty just dropped at @ultabeauty and I'm OBSESSED with the new shades. #RareBeauty #UltaBeauty #ad",
            submittedAt: "2026-02-14",
            reviewStatus: "pending",
          },
        ],
        joinedAt: "2026-02-09",
      },
      {
        campaignId: "camp-002",
        creatorId: "cr-005",
        creatorName: "Taylor Kim",
        creatorHandle: "@taylorkbeauty",
        creatorAvatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&h=120&fit=crop&crop=face",
        platforms: ["instagram", "benable"],
        categories: ["Beauty", "Skincare"],
        followerCount: 1800,
        engagementRate: 5.4,
        avgLikes: 97,
        audienceTopAge: "18-24",
        audienceTopGender: "85% Female",
        audienceTopLocation: "US (68%)",
        bio: "Skincare science nerd. Honest reviews on what's worth the hype.",
        recentPostThumbnails: [
          "https://images.unsplash.com/photo-1583209814683-c023dd293cc6?w=150&h=150&fit=crop",
          "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=150&h=150&fit=crop",
        ],
        aiMatchReason: "Benable-only creator — not on LTK, ShopMy, or TikTok Shop",
        isExclusive: true,
        pastCampaignCount: 0,
        status: "negotiating",
        compensation: { type: "paid", amount: 250 },
        contentSubmissions: [],
        joinedAt: "2026-02-09",
      },
    ],
  },
];
