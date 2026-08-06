/**
 * Google AdMob integration for the native Android build (Capacitor).
 * All calls are no-ops in the browser / Lovable preview, where the native
 * plugin does not exist.
 */

export const AD_UNITS = {
  banner: "ca-app-pub-5469603058026078/4854563359",
  interstitial: "ca-app-pub-5469603058026078/6178987386",
} as const;

// Google's official test unit ids, used automatically in development.
export const TEST_AD_UNITS = {
  banner: "ca-app-pub-3940256099942544/6300978111",
  interstitial: "ca-app-pub-3940256099942544/1033173712",
} as const;

const isDev = import.meta.env.DEV;

export function adUnitId(kind: "banner" | "interstitial") {
  return isDev ? TEST_AD_UNITS[kind] : AD_UNITS[kind];
}

async function nativeAdmob() {
  if (typeof window === "undefined") return null;
  try {
    const { Capacitor } = await import("@capacitor/core");
    if (!Capacitor.isNativePlatform()) return null;
    const mod = await import("@capacitor-community/admob");
    return mod;
  } catch {
    return null;
  }
}

let initialized = false;

export async function initAds() {
  const mod = await nativeAdmob();
  if (!mod || initialized) return;
  initialized = true;
  await mod.AdMob.initialize({
    initializeForTesting: isDev,
    ...(isDev ? { testingDevices: [] } : {}),
  });
}

export async function showBanner() {
  const mod = await nativeAdmob();
  if (!mod) return;
  await initAds();
  await mod.AdMob.showBanner({
    adId: adUnitId("banner"),
    adSize: mod.BannerAdSize.ADAPTIVE_BANNER,
    position: mod.BannerAdPosition.BOTTOM_CENTER,
    margin: 0,
    isTesting: isDev,
  });
}

export async function hideBanner() {
  const mod = await nativeAdmob();
  if (!mod) return;
  await mod.AdMob.removeBanner();
}

/** Prepares and shows an interstitial; resolves even when ads are unavailable. */
export async function showInterstitial() {
  const mod = await nativeAdmob();
  if (!mod) return;
  try {
    await initAds();
    await mod.AdMob.prepareInterstitial({
      adId: adUnitId("interstitial"),
      isTesting: isDev,
    });
    await mod.AdMob.showInterstitial();
  } catch (e) {
    console.warn("[admob] interstitial failed", e);
  }
}
