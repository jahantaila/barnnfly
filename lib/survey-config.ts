export type StepId =
  | "intro"
  | "about-you"
  | "rate-logos"
  | "vibe"
  | "review";

export const STEP_ORDER: StepId[] = [
  "intro",
  "about-you",
  "rate-logos",
  "vibe",
  "review",
];

export const STEP_LABELS: Record<StepId, string> = {
  intro: "Welcome",
  "about-you": "You",
  "rate-logos": "Rate the logos",
  vibe: "Brand vibe",
  review: "Review",
};

export type LogoRating = {
  stars: number; // 0 = unrated, 1–5
  note: string;
};

export type SurveyData = {
  // About you
  fullName: string;
  email: string;
  relationship: string;

  // Logo ratings — keyed by concept id
  ratings: Record<string, LogoRating>;
  favoriteConceptId: string | null;

  // Vibe
  vibes: string[];
  nameSuggestion: string;
  anythingElse: string;
};

export const DEFAULT_DATA: SurveyData = {
  fullName: "",
  email: "",
  relationship: "",
  ratings: {},
  favoriteConceptId: null,
  vibes: [],
  nameSuggestion: "",
  anythingElse: "",
};

export const RELATIONSHIP_OPTIONS = [
  { label: "Friend", emoji: "👋" },
  { label: "Family", emoji: "🧡" },
  { label: "Pet owner", emoji: "🐶" },
  { label: "Potential customer", emoji: "✈️" },
  { label: "Designer / creative", emoji: "🎨" },
  { label: "Just curious", emoji: "👀" },
];

export const VIBE_OPTIONS = [
  { label: "Playful", emoji: "🎾" },
  { label: "Luxurious", emoji: "💎" },
  { label: "Adventurous", emoji: "🧭" },
  { label: "Trustworthy", emoji: "🛡️" },
  { label: "Modern", emoji: "⚡" },
  { label: "Warm & friendly", emoji: "🧡" },
  { label: "Bold", emoji: "🔥" },
  { label: "Calm & zen", emoji: "🌿" },
  { label: "Sophisticated", emoji: "🥃" },
  { label: "Energetic", emoji: "🐕" },
  { label: "Quirky", emoji: "🎨" },
  { label: "Premium rugged", emoji: "🏔️" },
];

// The logo concepts to rate — drop images into /public/logos/
export const LOGO_CONCEPTS = [
  { id: "concept-1", src: "/logos/concept-1.png", label: "Concept 01" },
  { id: "concept-2", src: "/logos/concept-2.png", label: "Concept 02" },
  { id: "concept-3", src: "/logos/concept-3.png", label: "Concept 03" },
  { id: "concept-4", src: "/logos/concept-4.png", label: "Concept 04" },
  { id: "concept-5", src: "/logos/concept-5.png", label: "Concept 05" },
  { id: "concept-6", src: "/logos/concept-6.png", label: "Concept 06" },
];
