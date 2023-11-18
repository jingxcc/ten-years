/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    loader: "custom",
    loaderFile: "./src/image/storageLoader.js",
  },
};

module.exports = nextConfig;
