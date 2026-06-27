import axios from 'axios';
import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  const { influencerId } = req.query;
  const API_BASE_URL = 'https://api.influrunner.com';

  try {
    // 1. Fetch influencer data from backend API
    const response = await axios.get(`${API_BASE_URL}/api/portfolio/${influencerId}`);
    const portfolio = response.data;

    const name = portfolio.name || 'Influencer';
    const bio = portfolio.bio || 'Check out my portfolio on INFLURUNNER!';
    
    // Parse environment variable for domain and build canonical URL
    const domain = process.env.NEXT_PUBLIC_BASE_URL || 'https://influrunner.com';
    const cleanDomain = domain.trim().replace(/\/$/, '');
    const canonicalUrl = `${cleanDomain}/portfolio/${influencerId}`;

    // Graceful fallbacks for creator fields
    const city = portfolio.city || portfolio.location || 'India';
    
    let niche = 'Content Creator';
    if (portfolio.niche) {
      niche = Array.isArray(portfolio.niche) ? portfolio.niche.join(', ') : portfolio.niche;
    } else if (portfolio.categories) {
      niche = Array.isArray(portfolio.categories) ? portfolio.categories.join(', ') : portfolio.categories;
    }
    const displayNiche = niche.toLowerCase().includes('creator') ? niche : `${niche} Creator`;

    const followers = portfolio.followers || 'growing';
    
    const engagementVal = portfolio.engagement_rate || portfolio.engagement || 'strong';
    let engagementStr = typeof engagementVal === 'number' || !isNaN(Number(engagementVal))
      ? `${engagementVal}%`
      : engagementVal;
    if (typeof engagementVal === 'number' || (!isNaN(Number(engagementVal)) && !String(engagementVal).includes('%'))) {
      engagementStr = `${engagementVal}%`;
    }

    // Compose dynamic SEO texts
    const seoTitle = `${name} — ${displayNiche} | ${city}`;
    const seoDescription = `${name} is a ${displayNiche.toLowerCase()} from ${city} with ${followers} followers and ${engagementStr} engagement rate. Available for brand collaborations.`;

    // Process profile image & OG image URL
    const profileImage = portfolio.profile_image_url || portfolio.profile_picture || '';
    const imageUrl = profileImage 
      ? (profileImage.startsWith('http') ? profileImage : `${API_BASE_URL}/${profileImage}`)
      : 'https://api.influrunner.com/logo.png'; // default fallback image

    // Process Instagram handles & Structured Data SameAs
    const instagramHandle = portfolio.instagram_handle || portfolio.instagram || '';
    const instagramUrl = instagramHandle ? `https://instagram.com/${instagramHandle.replace('@', '')}` : '';
    const sameAs = instagramUrl ? [`https://instagram.com/${instagramHandle.replace('@', '')}`] : [];

    // JSON-LD Structured Data
    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "Person",
      "name": name,
      "jobTitle": "Content Creator",
      "description": bio,
      "address": {
        "@type": "PostalAddress",
        "addressLocality": city,
        "addressCountry": "IN"
      },
      "sameAs": sameAs,
      "url": canonicalUrl,
      "image": imageUrl
    };

    // 2. Read the built index.html template
    // Vercel mounts static assets, in a built Vite app the compiled index.html is located in dist/
    const htmlPath = path.join(process.cwd(), 'dist', 'index.html');
    let html = '';
    if (fs.existsSync(htmlPath)) {
      html = fs.readFileSync(htmlPath, 'utf8');
    } else {
      // Fallback to root index.html if dist is missing (e.g. local dev testing)
      html = fs.readFileSync(path.join(process.cwd(), 'index.html'), 'utf8');
    }

    // 3. Inject Open Graph, standard SEO meta tags and JSON-LD into head
    const seoTags = `
      <title>${seoTitle}</title>
      <meta name="description" content="${seoDescription}" />
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href="${canonicalUrl}" />
      
      <!-- Open Graph / Facebook -->
      <meta property="og:title" content="${seoTitle}" />
      <meta property="og:description" content="${seoDescription}" />
      <meta property="og:image" content="${imageUrl}" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:url" content="${canonicalUrl}" />
      <meta property="og:type" content="profile" />
      
      <!-- Twitter -->
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="${seoTitle}" />
      <meta name="twitter:description" content="${seoDescription}" />
      <meta name="twitter:image" content="${imageUrl}" />
      
      <!-- Structured Data (JSON-LD) -->
      <script type="application/ld+json">
        ${JSON.stringify(jsonLd)}
      </script>
    `;

    // Replace the standard title placeholder tag to inject tags
    html = html.replace('<title>INFLURUNNER</title>', seoTags);

    res.setHeader('Content-Type', 'text/html');
    return res.status(200).send(html);
  } catch (error) {
    console.error('Open Graph tag generator error:', error);
    // Fallback: serve default index.html without dynamic tags
    try {
      const htmlPath = path.join(process.cwd(), 'dist', 'index.html');
      let html = '';
      if (fs.existsSync(htmlPath)) {
        html = fs.readFileSync(htmlPath, 'utf8');
      } else {
        html = fs.readFileSync(path.join(process.cwd(), 'index.html'), 'utf8');
      }
      res.setHeader('Content-Type', 'text/html');
      return res.status(200).send(html);
    } catch (e) {
      return res.status(500).send('Internal Server Error');
    }
  }
}
