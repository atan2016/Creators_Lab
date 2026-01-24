/** @type {import('next').NextConfig} */
const nextConfig = {
  // Redirect .html routes to Next.js routes
  async redirects() {
    return [
      {
        source: '/login.html',
        destination: '/login',
        permanent: true,
      },
      {
        source: '/index.html',
        destination: '/',
        permanent: true,
      },
      {
        source: '/about.html',
        destination: '/about',
        permanent: true,
      },
      {
        source: '/resources.html',
        destination: '/resources',
        permanent: true,
      },
      {
        source: '/events.html',
        destination: '/events',
        permanent: true,
      },
      {
        source: '/careers.html',
        destination: '/careers',
        permanent: true,
      },
      {
        source: '/showcase.html',
        destination: '/showcase',
        permanent: true,
      },
      {
        source: '/what-we-teach.html',
        destination: '/what-we-teach',
        permanent: true,
      },
    ];
  },
}

module.exports = nextConfig
