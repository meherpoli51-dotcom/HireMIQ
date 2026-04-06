import type { NextConfig } from "next";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dir = dirname(__filename);

const nextConfig: NextConfig = {
  turbopack: {
    root: __dir,
  },
  serverExternalPackages: ["@anthropic-ai/sdk", "pdf-parse", "mammoth"],
};

export default nextConfig;
