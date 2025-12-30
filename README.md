# Digital Shield Project

Interactive Vite + React training modules for digital safety and cybersecurity.

## Requirements
- Node.js 18+ (or newer)

## Install
```bash
npm install
```

## Run (dev)
```bash
npm run dev
```

Vite runs with `client/` as the app root. Open the URL printed in the console.

## Build
```bash
npm run build
```

Build output is written to `dist/`.

## Preview the build
```bash
npm run preview
```

## Project structure
- `client/index.html`: Vite entry HTML
- `client/src/main.tsx`: React entry
- `client/src/pages`: Module pages
- `client/src/content`: Module content data
- `client/public/images`: Static assets

## Asset policy
- Do not commit `client/public/*.zip`. Keep large artifacts outside the repo.
- Avoid committing files larger than 100 MB to git.
