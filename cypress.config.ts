import { defineConfig } from "cypress";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import synpressPlugins from "@synthetixio/synpress/plugins";

export default defineConfig({
  userAgent: "synpress",
  chromeWebSecurity: true,
  defaultCommandTimeout: 30000,
  pageLoadTimeout: 30000,
  requestTimeout: 30000,
  e2e: {
    testIsolation: true,
    setupNodeEvents(on, config) {
      synpressPlugins(on, config);
    },
    baseUrl: "http://localhost:3000",
    supportFile: "cypress/support/e2e.js",
    defaultCommandTimeout: 10000,
  },
  video: false,
});
