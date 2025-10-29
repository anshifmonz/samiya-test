/** @type {import('next-sitemap').IConfig} */
const config = {
  siteUrl: process.env.SITE_URL || 'https://www.samiyaonline.com',
  generateRobotsTxt: true,
  sitemapSize: 7000,
  exclude: ['/admin/*', '/api/*', '/404', '/500'],
  robotsTxtOptions: {
    policies: [{ userAgent: '*', allow: '/' }]
  }
};

export default config;
