// Campaign data types and store — based on Brand Portal v2 spec

export type CampaignMode = "open" | "targeted";
export type CampaignGoal = "awareness" | "sales" | "product_launch" | "ugc";
export type Platform = "benable" | "instagram" | "tiktok";
export type BudgetType = "spend_cap" | "product_inventory" | "flexible";
export type CompensationType = "gifted" | "gift_card" | "discount" | "paid" | "commission_boost";
export type CampaignStatus = "draft" | "active" | "filled" | "completed";
export type CreatorCountTarget = "5-15" | "15-30" | "30+";

export type ContentRequirement =
  | "show_product_in_use"
  | "include_product_name"
  | "tag_brand"
  | "use_hashtags"
  | "well_lit"
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
  budgetType?: BudgetType;
  budgetCapAmount?: number;
  budgetInventoryCount?: number;
  budgetProductName?: string;
  creatorCountTarget?: CreatorCountTarget;
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
  budgetType: undefined,
  budgetCapAmount: undefined,
  budgetInventoryCount: undefined,
  budgetProductName: undefined,
  creatorCountTarget: undefined,
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
  isExclusive: boolean;
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
    budgetType: "product_inventory",
    budgetInventoryCount: 50,
    budgetProductName: "Melted Balm",
    creatorCountTarget: "15-30",
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
        creatorAvatar: "",
        platforms: ["instagram", "benable"],
        categories: ["Beauty", "Skincare"],
        followerCount: 820,
        isExclusive: true,
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
        creatorAvatar: "",
        platforms: ["instagram", "tiktok", "benable"],
        categories: ["Beauty", "Lifestyle"],
        followerCount: 2400,
        isExclusive: false,
        status: "content_submitted",
        compensation: { type: "gifted", amount: 35 },
        contentSubmissions: [
          {
            id: "cs-001",
            fileUrl: "/placeholder-content.jpg",
            platform: "instagram",
            contentType: "reel",
            caption: "Obsessed with this clean beauty balm from @28litsea!",
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
        creatorAvatar: "",
        platforms: ["benable"],
        categories: ["Wellness", "Skincare"],
        followerCount: 340,
        isExclusive: true,
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
    budgetType: "spend_cap",
    budgetCapAmount: 15000,
    creatorCountTarget: undefined,
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
        creatorAvatar: "",
        platforms: ["instagram", "tiktok", "benable"],
        categories: ["Beauty", "Fashion"],
        followerCount: 5200,
        isExclusive: false,
        status: "accepted",
        compensation: { type: "paid", amount: 300 },
        contentSubmissions: [],
        joinedAt: "2026-02-09",
      },
      {
        campaignId: "camp-002",
        creatorId: "cr-005",
        creatorName: "Taylor Kim",
        creatorHandle: "@taylorkbeauty",
        creatorAvatar: "",
        platforms: ["instagram", "benable"],
        categories: ["Beauty", "Skincare"],
        followerCount: 1800,
        isExclusive: true,
        status: "negotiating",
        compensation: { type: "paid", amount: 250 },
        contentSubmissions: [],
        joinedAt: "2026-02-09",
      },
    ],
  },
];
