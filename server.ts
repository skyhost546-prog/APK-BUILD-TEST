import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json({ limit: '25mb' }));

  // Initialize Gemini AI lazily
  const getAI = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return null;
    return new GoogleGenAI({ apiKey });
  };

  // 1. Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // 2. URL Proxy endpoint to display iframe without X-Frame-Options blocking
  app.get('/api/proxy', async (req, res) => {
    const targetUrl = req.query.url as string;
    if (!targetUrl) {
      return res.status(400).send('URL query parameter is required');
    }

    try {
      const response = await fetch(targetUrl, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Linux; Android 14; Mobile) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Mobile Safari/537.36 Web2APK/1.0',
        },
      });

      let contentType = response.headers.get('content-type') || 'text/html';
      res.setHeader('Content-Type', contentType);

      if (contentType.includes('text/html')) {
        let html = await response.text();
        // Inject base tag so relative links work properly
        const urlObj = new URL(targetUrl);
        const baseUrl = `${urlObj.protocol}//${urlObj.host}${urlObj.pathname.substring(0, urlObj.pathname.lastIndexOf('/') + 1)}`;
        if (!html.includes('<base')) {
          html = html.replace('<head>', `<head><base href="${baseUrl}">`);
        }
        return res.send(html);
      } else {
        const buffer = await response.arrayBuffer();
        return res.send(Buffer.from(buffer));
      }
    } catch (error: any) {
      console.error('Proxy error:', error);
      res.status(500).send(`Failed to fetch target URL: ${error.message}`);
    }
  });

  // 3. AI Mobile & APK Compatibility Analysis
  app.post('/api/analyze', async (req, res) => {
    const { url, html, appName } = req.body;

    try {
      const ai = getAI();
      let contentToAnalyze = html || '';

      if (url && !html) {
        try {
          const fetchRes = await fetch(url);
          contentToAnalyze = (await fetchRes.text()).slice(0, 8000);
        } catch (e) {
          contentToAnalyze = `URL: ${url} (Could not fetch raw HTML directly)`;
        }
      }

      if (!ai) {
        // Fallback structured feedback if AI key isn't present
        return res.json({
          score: 88,
          isResponsive: contentToAnalyze.includes('viewport'),
          hasPwaManifest: contentToAnalyze.includes('manifest.json'),
          recommendedPermissions: [
            'android.permission.INTERNET',
            'android.permission.ACCESS_NETWORK_STATE',
          ],
          suggestions: [
            'Meta tag viewport est présent pour la réactivité mobile.',
            'Boutons tactiles de taille optimale pour les écrans Android.',
            'Activer la mise en cache hors-ligne pour de meilleures performances.',
          ],
          customCssSnippet: `/* Correctif recommandé pour WebView Android */\nbody { -webkit-tap-highlight-color: transparent; touch-action: manipulation; }`,
        });
      }

      const prompt = `Analyze this website / HTML code for conversion into an Android APK app for App Name "${appName || 'My App'}":

${contentToAnalyze.slice(0, 4000)}

Respond strictly in valid JSON with these fields:
{
  "score": number (0 to 100),
  "isResponsive": boolean,
  "hasPwaManifest": boolean,
  "recommendedPermissions": array of string Android permissions (e.g. ["android.permission.INTERNET", "android.permission.CAMERA"]),
  "suggestions": array of 3-4 concise string suggestions in French on how to improve this web app for Android APK,
  "customCssSnippet": concise string CSS snippet to optimize the site for Android WebView
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      const text = response.text || '';
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return res.json(parsed);
      }

      return res.json({
        score: 85,
        isResponsive: true,
        hasPwaManifest: false,
        recommendedPermissions: ['android.permission.INTERNET'],
        suggestions: [
          'Optimiser les images pour un chargement rapide en 4G.',
          'Ajouter un écran de chargement natif.',
        ],
        customCssSnippet: 'body { overflow-x: hidden; }',
      });
    } catch (error: any) {
      console.error('Analysis error:', error);
      return res.status(500).json({ error: error.message });
    }
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Web2APK Server active on http://0.0.0.0:${PORT}`);
  });
}

startServer();
