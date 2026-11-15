# OldSalt Map Shop

An interactive digital gallery of antique maps, set in a 17th-century harbour chart shop.
A plain static site: no build step, no dependencies.

## Files
- `index.html`: the page and the room markup
- `css/style.css`: styling
- `js/catalogue.js`: **the catalogue**, one entry per piece. Edit this to add or correct maps.
- `js/app.js`: the room, wall layout, zoom viewer, ledger and plan chest
- `img/`: one image per piece (JPEG, about 1800px on the long side)
- `vercel.json`: caching headers

## Deploy on Vercel
**Option A, drag and drop (quickest):** install the Vercel CLI (`npm i -g vercel`), run `vercel` in this folder, accept the defaults (framework: Other, no build command, output directory: `.`), then `vercel --prod`.

**Option B, via GitHub:** push this folder to a GitHub repository, then in Vercel choose Add New, Project, import the repo. Leave Framework Preset as Other and leave the build settings empty. Every push redeploys.

## Run locally
`python3 -m http.server 8000` in this folder, then open http://localhost:8000

## Adding a piece
1. Put a web-sized JPEG in `img/` (about 1800px long side, quality 80 to 85).
2. Add an entry to `js/catalogue.js` with `img: "img/yourfile.jpg"` and `ar` set to width divided by height.
3. To hang it on a wall, add its `id` to a row in the `VIEWS` list near the top of `js/app.js`. Anything not listed there goes in the plan chest and the ledger.

## Before going public
- **Search engines:** `index.html` contains `<meta name="robots" content="noindex, nofollow">`. Delete that line when you want the site indexed.
- **Images:** several scans came from auction-house pages and carry watermarks or a "press Esc" banner. Replace them with your own scans or photos, and check reuse terms for any library images.
- **Prices:** the catalogue deliberately has none.
- **Fonts:** the page loads IM Fell English from Google Fonts. It falls back to a system serif if blocked.
