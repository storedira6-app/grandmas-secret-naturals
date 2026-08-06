import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "app.lovable.grandmassecret",
  appName: "سر الجدة | Grandma's Secret",
  webDir: "dist/client",
  android: {
    allowMixedContent: true,
  },
};

export default config;
