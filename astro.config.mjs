// @ts-check
import { defineConfig, envField } from "astro/config";

import node from "@astrojs/node";

import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  env: {
    schema: {
      GOOGLE_CLIENT_ID: envField.string({
        context: "client",
        access: "public",
        optional: false,
      }),
    },
  },

  adapter: node({
    mode: "standalone",
  }),

  experimental: {
    session: {
      // Required: the name of the unstorage driver
      driver: "fs",
    },
  },

  integrations: [react()],
});