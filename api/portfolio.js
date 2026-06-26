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
    const profilePicture = portfolio.profile_picture || '';
    const imageUrl = profilePicture 
      ? `${API_BASE_URL}/${profilePicture}` 
      : 'https://api.influrunner.com/logo.png'; // default fallback image

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

    // 3. Inject Open Graph meta tags into head
    const ogTags = `
      <title>${name} - INFLURUNNER Portfolio</title>
      <meta name="description" content="${bio}" />
      <meta property="og:title" content="${name} - INFLURUNNER Portfolio" />
      <meta property="og:description" content="${bio}" />
      <meta property="og:image" content="${imageUrl}" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:url" content="https://influrunner.com/portfolio/${influencerId}" />
      <meta property="og:type" content="profile" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="${name} - INFLURUNNER Portfolio" />
      <meta name="twitter:description" content="${bio}" />
      <meta name="twitter:image" content="${imageUrl}" />
    `;

    // Replace the standard title placeholder tag to inject tags
    html = html.replace('<title>INFLURUNNER</title>', ogTags);

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
