/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; connect-src 'self' https://gourmet.cours.quimerch.com; object-src 'self' data:; img-src 'self' data: https: http:;"
          }
        ],
      },
    ]
  }
}

module.exports = nextConfig 