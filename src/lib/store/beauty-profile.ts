/**
 * Local beauty profile (skin type / concern / goal) captured by the skin quiz.
 * Used to personalize "Grandma's Recommendations" across the app.
 */
import { useEffect, useState } from "react";

export type BeautyProfile = {
  /** index of q1 answer: dry / oily / combination / sensitive */
  skin: number;
  /** index of q2 answer: acne / dryness / dark spots / fine lines */
  concern: number;
  /** index of q3 answer: glow / brightening / hydration */
  goal: number;
  hair?: string;
  updatedAt: number;
};

const KEY = "gs-beauty-profile";

export function saveBeautyProfile(p: Omit<BeautyProfile, "updatedAt">) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify({ ...p, updatedAt: Date.now() }));
  window.dispatchEvent(new Event("gs-profile-change"));
}

export function readBeautyProfile(): BeautyProfile | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as BeautyProfile) : null;
  } catch {
    return null;
  }
}

/** Reactive profile reader (hydration-safe: reads after mount). */
export function useBeautyProfile(): BeautyProfile | null {
  const [profile, setProfile] = useState<BeautyProfile | null>(null);
  useEffect(() => {
    const sync = () => setProfile(readBeautyProfile());
    sync();
    window.addEventListener("gs-profile-change", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("gs-profile-change", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);
  return profile;
}

const SKIN_KEYWORDS = [
  ["dry", "جاف", "hydrat", "ترطيب", "shea", "زبدة", "argan", "أرغان", "oil", "زيت", "avocado"],
  ["oily", "دهني", "clay", "طين", "غاسول", "ghassoul", "tea tree", "charcoal", "matte", "زنك"],
  ["combination", "مختلط", "balanc", "توازن", "rose", "ورد", "aloe", "صبار", "gentle"],
  ["sensitive", "حساس", "chamomile", "بابونج", "calm", "تهدئة", "oat", "شوفان", "aloe", "صبار"],
];

const CONCERN_KEYWORDS = [
  ["acne", "حب الشباب", "حبوب", "blemish", "tea tree", "clay", "طين", "salicylic", "زنك"],
  ["dry", "جفاف", "moistur", "ترطيب", "hyaluronic", "hyaluron", "shea", "زبدة", "butter", "oil"],
  ["spot", "تصبغ", "bright", "تفتيح", "vitamin c", "فيتامين", "licorice", "عرق السوس", "niacinamide"],
  ["wrinkle", "تجاعيد", "anti-age", "collagen", "كولاجين", "retinol", "رتينول", "firm", "شد"],
];

const GOAL_KEYWORDS = [
  ["glow", "نضارة", "radian", "إشراق", "serum", "سيروم", "vitamin c", "mask", "ماسك"],
  ["bright", "تفتيح", "whiten", "even tone", "niacinamide", "vitamin c", "فيتامين سي", "licorice"],
  ["hydrat", "ترطيب", "moistur", "cream", "كريم", "hyaluron", "aloe", "صبار", "butter", "زبدة"],
];

/** Seasonal / trending natural needs (August = sun, hydration, after-sun care). */
export function trendingKeywords(date = new Date()): string[] {
  const m = date.getMonth();
  if (m >= 5 && m <= 8)
    return ["sun", "شمس", "after sun", "aloe", "صبار", "hydrat", "ترطيب", "light", "خفيف", "rose", "ماء الورد"];
  if (m >= 9 && m <= 10)
    return ["repair", "ترميم", "oil", "زيت", "hair", "شعر", "argan", "أرغان", "mask", "ماسك"];
  if (m === 11 || m <= 1)
    return ["dry", "جفاف", "butter", "زبدة", "shea", "cream", "كريم", "lip", "شفاه", "honey", "عسل"];
  return ["detox", "تنقية", "clay", "طين", "fresh", "انتعاش", "green", "أخضر", "cleanse", "غسول"];
}

/** Keyword bag describing what this user should be recommended right now. */
export function profileKeywords(profile: BeautyProfile | null): string[] {
  const trending = trendingKeywords();
  if (!profile) return trending;
  return [
    ...(SKIN_KEYWORDS[profile.skin] ?? []),
    ...(CONCERN_KEYWORDS[profile.concern] ?? []),
    ...(GOAL_KEYWORDS[profile.goal] ?? []),
    ...trending,
  ];
}
