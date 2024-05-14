/** @type {import('next').NextConfig} */
const path = require('path')
const backend_api = `http://${process.env.NEXT_PUBLIC_BACKEND_HOST}:${process.env.NEXT_PUBLIC_BACKEND_PORT}/api`

const nextConfig = {
    reactStrictMode: true,
    sassOptions: {
        includePaths: [path.join(__dirname, 'styles')],
    },
    experimental: {
        serverComponentsExternalPackages: ["mjml"],
        serverActions: true,
      },
      env: {
        BASE_URL: backend_api
    },
    images: {
      domains: ["res.cloudinary.com"],
    },
}

const withNextIntl = require("next-intl/plugin")(
    // This is the default (also the `src` folder is supported out of the box)
    "./src/i18n.ts"
  );
  
module.exports = withNextIntl(nextConfig);

