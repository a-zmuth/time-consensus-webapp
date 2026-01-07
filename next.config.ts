/** @type {import('next').NextConfig} */
  const nextConfig = {
    // Your existing Next.js configuration properties go here...
    // For example:
    // reactStrictMode: true,

    experimental: {
      // This tells Vercel to include the ffmpeg binary when building the API route
      // Replace '/app/api/scramble-video/*' with the actual path to your API route
      // where FFmpeg will be used, if it's different.
      outputFileTracingIncludes: {
        '/app/api/scramble-video/*': ['./bin/ffmpeg'],
      },
    },
  };
export default nextConfig;