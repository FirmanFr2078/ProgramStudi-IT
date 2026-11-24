import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  // IP LAN wajib didaftarkan agar dev server tidak memblokir aset saat diakses dari HP.
  allowedDevOrigins: ["192.168.0.153", "192.168.0.153:3000", "192.168.0.*"],
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
}

export default nextConfig