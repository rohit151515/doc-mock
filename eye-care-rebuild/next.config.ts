import type { NextConfig } from "next";
const config: NextConfig = {
  async redirects() {
    return [{ source: "/", destination: "/bn", permanent: false }];
  },
  poweredByHeader: false,
};
export default config;
