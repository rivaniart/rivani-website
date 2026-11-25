# Rivani Fine Art

Static storefront + local Rivani Studio admin backend for managing the artwork catalogue, Muse interior gallery, and acquisition inquiries.

## Run locally

```bash
ruby server.rb
```

- **Public Storefront:** `http://localhost:4173/`
- **Rivani Studio Admin (no login in local dev mode):** `http://localhost:4173/admin`

## Structure

- `index.html`, `styles.css`, `app.js` — public storefront
- `admin/index.html`, `admin/admin.css`, `admin/admin.js` — Rivani Studio CMS (upload/edit artworks, manage Muse Homes, review inquiries)
- `server.rb` — local zero-dependency Ruby server + JSON/upload API
- `data/artworks.json` / `data/artworks.js` — catalogue dataset
- `data/muse.js` — Muse interior series dataset
- `data/inquiries.json` — locally captured acquisition inquiries
- `assets/logo.png`, `assets/images/`, `final.mp3` — site media assets
