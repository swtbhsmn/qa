# React + Vite

## GitHub Pages deployment

The deployment workflow builds the app with Node 24 and publishes `dist` to
GitHub Pages. Before the first deployment, enable Pages once in the repository:

1. Open **Settings → Pages** in `swtbhsmn/qa`.
2. Under **Build and deployment**, set **Source** to **GitHub Actions**.
3. Run the **Deploy React to GitHub Pages** workflow again (or push to `main`).

The site is built under the `/qa/` path (currently `http://swetabh.com/qa/`).
Hash-based routing is used so refreshing a nested app route works on GitHub
Pages.

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is enabled on this template. See [this documentation](https://react.dev/learn/react-compiler) for more information.

Note: This will impact Vite dev & build performances.

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
