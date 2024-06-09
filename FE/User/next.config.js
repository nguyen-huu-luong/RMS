/** @type {import('next').NextConfig} */
const backend_api = `http://${process.env.NEXT_PUBLIC_BACKEND_HOST}:${process.env.NEXT_PUBLIC_BACKEND_PORT}/api`

const nextConfig = {
    images: {
        domains: ["img.dominos.vn"]
    },
    env: {
        BASE_URL: backend_api
    },
}

module.exports = nextConfig