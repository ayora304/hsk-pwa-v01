The public landing page is served at `/`; the study dashboard stays at `/home`.
Installed PWAs start at `/home`.

`landing.html` contains the integrated landing design. Its CSS is scoped to
`.landing-page`, and `LandingPage.tsx` connects links to React Router and handles
the saved light/dark preference. The old sample-data dialogs were removed.

To enable Discord invite buttons, set `VITE_DISCORD_INVITE_URL` to an HTTPS
`discord.gg` or `discord.com/invite` URL before starting/building Vite. Without
an invite, these links open Profile's Discord connection status.
