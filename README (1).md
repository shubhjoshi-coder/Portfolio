# Joshi Shubham — Personal Portfolio

A dark, futuristic personal portfolio built with plain HTML5, CSS3 and
vanilla JavaScript — no frameworks, no build step.

## Project structure

```
joshi-portfolio/
├── index.html      Page structure and content
├── style.css        All styling (uses CSS custom properties as design tokens)
├── script.js        All interactivity (nav, scroll reveal, cursor, hero 3D canvas, form)
├── assets/          Empty folder reserved for any images/icons you add later
└── vercel.json      Minimal static-site config for Vercel
```

## Run it locally

You just need a static file server (opening `index.html` directly also
mostly works, but a local server avoids browser file:// restrictions).

**Option A — Python (already on most machines):**
```bash
cd joshi-portfolio
python3 -m http.server 8000
```
Then open `http://localhost:8000` in your browser.

**Option B — VS Code:**
Install the "Live Server" extension, right-click `index.html`, and choose
"Open with Live Server".

**Option C — Node:**
```bash
npx serve joshi-portfolio
```

## Deploy to Vercel

**Fastest way (no account setup beyond signing in):**
1. Go to https://vercel.com and sign in (GitHub, GitLab or email).
2. Click "Add New… → Project".
3. Choose "Upload" (or connect a Git repo containing this folder).
4. Since this is a plain static site, leave the framework preset as
   "Other" — no build command or output directory is needed.
5. Click Deploy. Vercel will give you a live `.vercel.app` URL in seconds.

**Using Git + Vercel CLI:**
```bash
npm i -g vercel
cd joshi-portfolio
vercel        # first deploy, follow the prompts
vercel --prod # promote to production
```

## Notes

- The contact form is frontend-only: it validates input and shows a
  confirmation message on the page, but does not send real emails unless
  you connect a backend or a form service (e.g. Formspree) later.
- The hero's 3D wireframe sphere is drawn on a `<canvas>` with plain
  JavaScript — no Three.js or other 3D library involved.
- Motion respects `prefers-reduced-motion` for visitors who have that
  accessibility setting enabled.
