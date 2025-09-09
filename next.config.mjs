/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    turbo: {
      rules: {
        "*.mdx": {},
      },
    },
  },
};

export default nextConfig;


