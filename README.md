# Vishwa homepage

The default application is the v10 static homepage: editable HTML, CSS and JavaScript, the original WebGL opening, policy animations, and individual image assets. The static build itself needs no dependency installation or backend. The original React/Vite application and its dependency declarations remain available through the legacy commands below.

## Run locally

Use Node.js 18 or newer; the existing Docker build uses Node.js 20:

```sh
npm run build
npm start
```

Open http://127.0.0.1:4187. Set `PORT` to use another port. `npm run dev` builds the static homepage once and starts the same local server; rebuild after editing source files. `npm run preview` serves the existing `dist/` output.

## Source and deployment

- `partials/`: the page shell and editable sections, styles and interaction code.
- `public/`: original animation code, locally hosted fonts, separate image/logo assets, and retained existing public files.
- `scripts/build.mjs`: portable, dependency-free static build.
- `dist/`: checked-in v10 deployable output. Serve this directory at the domain root.

`npm run build` writes production metadata for `https://vishwalab.com/` and permits indexing. `npm run build:preview` defaults to `http://127.0.0.1:4187/` and disables indexing. Set the `SITE_URL` environment variable before building to use a different canonical domain; both the canonical link and Open Graph URL use that value.

The existing Docker workflow remains `npm ci` followed by `npm run build`, with nginx serving `dist/`. The package name, version, React/Vite dependency declarations, and existing `package-lock.json` are retained. Docker and Compose configuration do not need to change for the static build.

The upload leaves unrelated existing `public/` files unchanged. Each static build copies the full `public/` directory into `dist/`, so subsequent builds include those retained files alongside the v10 assets.

Navigation and product links continue to their existing external destinations. This project supplies the homepage; it does not recreate the banking application, CLI, vault, or other linked products.

## Editing

Edit the corresponding file in `partials/`, then rebuild. The build uses only files in this repository. Images, logos, the Inter font and the original Three.js renderer are stored locally in `public/`; no image is a screenshot of the whole page. The opening animation and trust transition retain their original renderer and timing. Reduced-motion visitors receive a static or manual presentation.

GPU cards are noninteractive displays of published provider pricing. Displayed locations describe publicly documented service regions, not live inventory. Official pricing sources and location evidence are recorded in `docs/`. The OpenNEXT and Agent-Vetted GPU Index buttons retain their product destinations.

## Legacy React/Vite application

The existing `src/`, root `index.html`, Vite configuration, and unrelated repository files remain in place. Install the retained dependencies to run the legacy application:

```sh
npm ci
npm run legacy:dev
```

`npm run legacy:build` runs the original Vite production build. Both build workflows target `dist/`; run `npm run build` before deploying the v10 homepage after using a legacy build. The default static build reads `partials/` and does not use the root React entry point.

GitHub delivery excludes account-specific hosting configuration, credentials, local QA captures and intermediate archives.
