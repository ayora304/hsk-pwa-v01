# Handwriting feedback

Copy `.env.example` to `.env.local`, enter your OpenAI API key locally, and restart `npm run dev`. Do not paste a secret into chat or use a `VITE_` environment variable. Vite reads the key only on the server. The API is also mounted by `npm run preview`.

Select the handwritten strokes of **one character** with the arrow tool, choose **Rate writing**, check the image and target character, then choose **Review with AI**. Only that snapshot and the target character go to OpenAI. Printed examples are excluded. Responses include a practice score, strengths, and next steps. Unclear or blank input has no score. Static images cannot establish stroke order.

Without a key, the UI reports that setup is required; it never substitutes a fake rating. No key is configured in this repository, so a live model review has not been verified.

For a production static host, deploy `server/handwriting.mjs` with Node 20+ (`node --env-file=.env.local server/handwriting.mjs`) and route `/api/handwriting-review` through a same-origin reverse proxy to `127.0.0.1:8787`. Add your application's authentication and durable per-user quotas before public deployment. The current endpoint has same-origin checks, a 2 MB input limit, a timeout, and a small per-IP in-memory rate limit for local development.

Tests: `node --test server/handwriting.test.mjs` (mocked provider responses, no API key or paid requests).

References: [Image inputs](https://developers.openai.com/api/docs/guides/images-vision), [Structured outputs](https://developers.openai.com/api/docs/guides/structured-outputs).
