# PWA ecosystem connection

The PWA now uses the Discord bot's existing Gemini/OpenRouter grading engine through a dedicated, limited PWA API. It does not use the admin passkey, does not send PWA drawings to Discord, and does not need a second OpenAI API key.

## Server configuration (never VITE_ variables)

On the bot, configure `PWA_SERVICE_TOKEN` with a new random service secret. On the PWA Node server, configure `BOT_SERVICE_TOKEN` with the same value and `BOT_API_URL` with the bot's public HTTPS origin, or its private Docker-network HTTP address. Do not put the secret in frontend code, public files, chat or a `VITE_` variable.

For local development these values may go in `.env.local`. This change does not create or modify an environment file. Missing configuration produces a setup message, never a fake grade or translation. Vite mounts the bridge in dev and preview.

Build with `npm run build`, then run `npm start` for production. The Node server serves only `dist` and same-origin `/api` routes. Vite's development middleware alone is not a production deployment. Configure Coolify with a Node/Railpack runtime rather than a static-only site if using the API bridge.

AI requests are user-initiated, capped and processed as background jobs. Workbox caches the app shell, code, fonts and images; API requests, chat responses and AI POSTs are never cached or queued. New releases activate after app tabs close, avoiding forced reloads while drawing. Linked external resources need a connection.

## Data and the deferred sign-in step

Notes, resource links, study conversations, schedules, quiz attempts, profile and review history are real device-local records. No fake people, online indicators or successful Discord dispatches are substituted. Notes and local messages persist across reloads. The legacy demo stores are not imported. Whiteboard storage remains unchanged.

Discord sign-in, authenticated cloud sync, private channel access and shared server study-vault data remain intentionally disconnected until the auth step. No private Discord or admin endpoint was made public. Do not publish the anonymous AI bridge as a finished student service before adding sign-in and durable per-user quotas; service authentication and short in-memory limits are not student authorization.

Tests use mocked bot/provider responses and no paid API calls. Existing uncommitted splash work is preserved.
