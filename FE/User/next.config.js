/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ["img.dominos.vn"]
    },
    env: {
        BASE_URL:"http://localhost:3003/api"
    }
}

module.exports = nextConfig