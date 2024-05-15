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
      },
      env: {
        BASE_URL: backend_api
    },
    images: {
      domains: ["res.cloudinary.com"],
    },
    serverRuntimeConfig: {
      apiUrl: process.env.NEXT_SERVER_API_URL
    },
    publicRuntimeConfig: {
      apiUrl: process.env.NEXT_PUBLIC_BACKEND_HOST
    },
}

const withNextIntl = require("next-intl/plugin")(
    // This is the default (also the `src` folder is supported out of the box)
    "./src/i18n.ts"
  );
  
module.exports = withNextIntl(nextConfig);

