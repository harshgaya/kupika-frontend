/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "1337",
        pathname: "/**",
      },

      {
        protocol: "https",
        hostname: "d2yhk23ciu9dj0.cloudfront.net",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
