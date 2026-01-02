import { defineConfig } from "wxt";

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ["@wxt-dev/module-react"],
  manifest: {
    name: "YouTube Gatekeeper",
    description:
      "Control which YouTube videos you can watch with permission-based access",
    permissions: ["storage", "activeTab"],
    host_permissions: ["*://*.youtube.com/*"],
  },
});
