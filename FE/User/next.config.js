/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ["img.dominos.vn"]
    },
    env: {
        BASE_URL:"http://localhost:3003/api"
    },
    async redirects() {
        return [
          {
            source: '/:path',
            destination: '/en/:path',
            permanent: false,
          }
        ];
      },
    
}

module.exports = nextConfig