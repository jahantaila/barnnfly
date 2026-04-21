export type StepId =
  | "intro"
  | "about-you"
  | "vision"
  | "audience"
  | "personality"
  | "logo-direction"
  | "palette"
  | "logo-vote"
  | "voice"
  | "review";

export const STEP_ORDER: StepId[] = [
  "intro",
  "about-you",
  "vision",
  "audience",
  "personality",
  "logo-direction",
  "palette",
  "logo-vote",
  "voice",
  "review",
];

export const STEP_LABELS: Record<StepId, string> = {
  intro: "Kickoff",
  "about-you": "You",
  vision: "The Vision",
  audience: "Dream Customer",
  personality: "Personality",
  "logo-direction": "Logo Direction",
  palette: "Palette",
  "logo-vote": "Logo Vote",
  voice: "Voice",
  review: "Review",
};

export type SurveyData = {
  // About you
  fullName: string;
  email: string;
  phone: string;
  role: string;

  // Vision
  businessStage: string;
  location: string;
  services: string[];
  uniqueValue: string;

  // Audience
  dreamCustomer: string;
  petTypes: string[];
  priceTier: string;

  // Personality
  personality: string[];
  dealBreakers: string;

  // Logo direction
  logoStyles: string[];
  imagery: string[];
  competitorLoves: string;
  competitorAvoids: string;

  // Palette
  palette: string;

  // Logo vote
  logoVotes: Record<string, "love" | "like" | "pass" | null>;
  logoFavorite: string | null;
  logoFeedback: string;

  // Voice
  tagline: string;
  toneAdjectives: string[];
  anythingElse: string;
};

export const DEFAULT_DATA: SurveyData = {
  fullName: "",
  email: "",
  phone: "",
  role: "",
  businessStage: "",
  location: "",
  services: [],
  uniqueValue: "",
  dreamCustomer: "",
  petTypes: [],
  priceTier: "",
  personality: [],
  dealBreakers: "",
  logoStyles: [],
  imagery: [],
  competitorLoves: "",
  competitorAvoids: "",
  palette: "",
  logoVotes: {},
  logoFavorite: null,
  logoFeedback: "",
  tagline: "",
  toneAdjectives: [],
  anythingElse: "",
};

// Options libraries
export const SERVICE_OPTIONS = [
  "Overnight boarding",
  "Daycare",
  "Grooming",
  "Training",
  "Airport pickup / drop-off",
  "Pet transportation",
  "Dog walking",
  "Webcam access",
  "Luxury suites",
  "Swim / splash time",
];

export const PET_OPTIONS = ["Dogs", "Cats", "Exotics", "Birds", "Small animals"];

export const PRICE_TIERS = [
  { value: "value", label: "Accessible / everyday", sub: "Friendly and affordable" },
  { value: "mid", label: "Mid-market", sub: "Quality care, fair price" },
  { value: "premium", label: "Premium", sub: "Top-tier, white-glove service" },
  { value: "luxury", label: "Luxury resort", sub: "The Four Seasons for pets" },
];

export const BUSINESS_STAGES = [
  "Just an idea",
  "Planning & research",
  "Building the space",
  "Soft launch / pre-open",
  "Open & operating",
];

export const PERSONALITY_OPTIONS = [
  { label: "Playful", emoji: "🎾" },
  { label: "Luxurious", emoji: "💎" },
  { label: "Adventurous", emoji: "🧭" },
  { label: "Trustworthy", emoji: "🛡️" },
  { label: "Modern", emoji: "⚡" },
  { label: "Warm & friendly", emoji: "🧡" },
  { label: "Bold", emoji: "🔥" },
  { label: "Calm & zen", emoji: "🌿" },
  { label: "Sophisticated", emoji: "🥃" },
  { label: "Energetic", emoji: "⚡" },
  { label: "Quirky", emoji: "🎨" },
  { label: "Premium-rugged", emoji: "🏔️" },
];

export const LOGO_STYLE_OPTIONS = [
  { label: "Bold wordmark", desc: "Just the name, confident typography" },
  { label: "Mascot / character", desc: "A dog or pet illustration leads" },
  { label: "Abstract mark", desc: "A symbol — shapes, not imagery" },
  { label: "Crest / badge", desc: "Shield, emblem, classic hallmark" },
  { label: "Monogram", desc: "Stylized 'B&F' or 'BF' letters" },
  { label: "Icon + wordmark", desc: "Small icon locked up with name" },
];

export const IMAGERY_OPTIONS = [
  "Dog silhouette",
  "Paw print",
  "Wings / flight",
  "Bone",
  "Star / burst",
  "Airplane / paper plane",
  "Crown",
  "Sun / sky",
  "Cloud",
  "Mountain",
  "Nothing literal — abstract only",
];

export const PALETTE_OPTIONS = [
  {
    id: "sky-gold",
    name: "Sky & Gold",
    desc: "Fresh blue sky, warm sunlight.",
    colors: ["#2B6CFF", "#F6C445", "#0A0E27", "#FFFFFF"],
  },
  {
    id: "sunset-cloud",
    name: "Sunset Cloud",
    desc: "Soft gradients, approachable warmth.",
    colors: ["#FF8A5B", "#FFD6A5", "#3B2E5A", "#FEF6EE"],
  },
  {
    id: "navy-cream",
    name: "Navy & Cream",
    desc: "Premium, quiet, trustworthy.",
    colors: ["#0E1C3D", "#D9B382", "#F5F0E6", "#8A95B0"],
  },
  {
    id: "electric-mint",
    name: "Electric Mint",
    desc: "Bold, modern, playful energy.",
    colors: ["#00E0A1", "#1F4DFF", "#0A0E27", "#F0FFF7"],
  },
  {
    id: "earthy-terrace",
    name: "Earthy Terrace",
    desc: "Natural, calm, pet-friendly warmth.",
    colors: ["#6B8E4E", "#C6693B", "#F3EEE3", "#2B2A28"],
  },
  {
    id: "derby-signature",
    name: "Derby Signature",
    desc: "Match our Derby Digital energy.",
    colors: ["#1F4DFF", "#0A0E27", "#F5F6FB", "#FFFFFF"],
  },
];

export const TONE_OPTIONS = [
  "Witty",
  "Warm",
  "Straightforward",
  "Playful",
  "Professional",
  "Heartfelt",
  "Hype / energetic",
  "Calm / reassuring",
  "Confident",
  "Cheeky",
];

// The logo concepts to vote on — user will drop images into /public/logos/
export const LOGO_CONCEPTS = [
  { id: "concept-1", src: "/logos/concept-1.png", caption: "Concept 01" },
  { id: "concept-2", src: "/logos/concept-2.png", caption: "Concept 02" },
  { id: "concept-3", src: "/logos/concept-3.png", caption: "Concept 03" },
  { id: "concept-4", src: "/logos/concept-4.png", caption: "Concept 04" },
  { id: "concept-5", src: "/logos/concept-5.png", caption: "Concept 05" },
  { id: "concept-6", src: "/logos/concept-6.png", caption: "Concept 06" },
];
