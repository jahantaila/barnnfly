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
  preferredVariant: string; // when a set contains multiple variants
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

// Logo concept sets to rate. Some sets contain multiple variants in the
// same image — the UI prompts raters to call out which one they prefer.
export type LogoConcept = {
  id: string;
  src: string;
  label: string;
  description?: string;
  variantCount: number;
  teamPick?: string; // name of a team member who picked this as their favorite
};

export const LOGO_CONCEPTS: LogoConcept[] = [
  {
    id: "set-01",
    src: "/logos/set-01-jason-fav.png",
    label: "Set 01 · Vintage aviator",
    description:
      "Full illustration — golden retriever in aviator gear flying a vintage plane. 'Bark N Fly Resort' wordmark below with luggage tags.",
    variantCount: 1,
    teamPick: "Jason",
  },
  {
    id: "set-02",
    src: "/logos/set-02-fancy.png",
    label: "Set 02 · Script variants",
    description:
      "Two takes: the full illustrated scene + a simplified version with a scripted 'BarkNFly'. Which version + which wordmark style?",
    variantCount: 2,
  },
  {
    id: "set-03",
    src: "/logos/set-03-four-iterations.png",
    label: "Set 03 · Four iterations",
    description:
      "Four different lockups — control tower badge, crest, palm-tree scene, and full resort illustration. Tell us which feels most 'Bark & Fly'.",
    variantCount: 4,
  },
  {
    id: "set-04",
    src: "/logos/set-04-three-iterations.png",
    label: "Set 04 · Three iterations",
    description:
      "Three green-and-gold lockups — banner style, crest, and circular badge with the same flying retriever. Which frame fits best?",
    variantCount: 3,
  },
  {
    id: "set-05",
    src: "/logos/set-05-jahan.png",
    label: "Set 05 · Circular badge",
    description:
      "Circular badge: golden retriever popping out of a plane, framed by 'BARK N FLY · PET RESORT' and a small bone.",
    variantCount: 1,
    teamPick: "Jahan",
  },
];
