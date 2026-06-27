import axios from 'axios';

export default async function handler(req, res) {
  const API_BASE_URL = 'https://api.influrunner.com';
  const domain = process.env.NEXT_PUBLIC_BASE_URL || 'https://influrunner.com';
  const cleanDomain = domain.trim().replace(/\/$/, '');

  try {
    // 1. Fetch creators from the backend sitemap endpoint
    const response = await axios.get(`${API_BASE_URL}/api/portfolio/sitemap-data`);
    const creators = response.data;

    // 2. Generate XML url elements
    const urlsXml = Array.isArray(creators) 
      ? creators
          .map((creator) => {
            const creatorId = creator.id;
            const lastmodDate = creator.created_at || new Date().toISOString();
            
            // Format timestamp as valid ISO string
            let lastmod = new Date().toISOString();
            try {
              lastmod = new Date(lastmodDate).toISOString();
            } catch (e) {
              // Ignore invalid dates and use current date
            }

            return `  <url>
    <loc>${cleanDomain}/portfolio/${creatorId}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
          })
          .join('\n')
      : '';

    // 3. Complete XML Sitemap
    const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${cleanDomain}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
${urlsXml}
</urlset>`;

    res.setHeader('Content-Type', 'application/xml');
    res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=7200');
    return res.status(200).send(sitemapXml);
  } catch (error) {
    console.error('Sitemap generation error:', error);
    // Return empty sitemap with only the homepage as fallback
    const fallbackXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${cleanDomain}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`;
    res.setHeader('Content-Type', 'application/xml');
    return res.status(200).send(fallbackXml);
  }
}
