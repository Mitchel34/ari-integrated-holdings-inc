import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // The public "Disclosures" section became "Company Updates".
      { source: "/disclosures", destination: "/updates", permanent: true },
      { source: "/disclosures/:path*", destination: "/updates/:path*", permanent: true },
      { source: "/api/disclosures", destination: "/api/updates", permanent: true },
    ];
  },
};

export default nextConfig;
