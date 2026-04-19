import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["three", "@react-three/fiber", "@react-three/drei"],
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "image.pollinations.ai",
        pathname: "/**",
      },
    ],
  },
  turbopack: {
    root: __dirname,
    /** Évite la résolution depuis un package.json parent (ex. profil utilisateur) pour @import 'tailwindcss'. */
    resolveAlias: {
      tailwindcss: path.join(__dirname, "node_modules/tailwindcss"),
      "tw-animate-css": path.join(__dirname, "node_modules/tw-animate-css"),
    },
  },
};

export default nextConfig;
