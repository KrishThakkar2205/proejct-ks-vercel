export default function handler(req, res) {
  const domain = process.env.NEXT_PUBLIC_BASE_URL || 'https://influrunner.com';
  const cleanDomain = domain.trim().replace(/\/$/, '');
  
  const robotsTxt = `User-agent: *
Allow: /portfolio/
Sitemap: ${cleanDomain}/sitemap.xml
`;
  
  res.setHeader('Content-Type', 'text/plain');
  res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=86400');
  return res.status(200).send(robotsTxt);
}
