# Fidèle Zogbe — portfolio

**Live website:** [fidele-zogbe.github.io](https://fidele-zogbe.github.io)

I built this portfolio to introduce myself as a computer science and
telecommunications engineering student interested in data science and machine
learning. It brings together my background, skills, projects, working process,
education, and contact details in one place. The project is also a way for me
to practise building and publishing a complete website, not just individual
pages.

## What I built

The site has seven sections: Home, About, Projects, Skills, Process, Education,
and Contact. The pages share a header, footer, visual style, and navigation, so
the experience feels like one site rather than seven separate pages.

I chose React and TypeScript to build the interface from reusable components.
Vite runs the development server and bundles the site, while Tailwind CSS is
used for styling. Most of the portfolio content is kept separate from the page
layouts, which makes it easier to update project and profile information
without rewriting the interface.

## How the code is organized

```text
.
├── index.html                 # Browser entry point, SEO and social preview metadata
├── package.json               # Dependencies and npm commands
├── package-lock.json          # Exact dependency versions for repeatable installs
├── vite.config.ts             # React, Tailwind, and single-file build configuration
├── .github/workflows/
│   └── deploy.yml              # Builds and deploys the site to GitHub Pages
├── public/                    # CV PDFs, link-preview image, robots.txt, sitemap.xml
├── scripts/
│   ├── make_cv.py              # Creates the English and French CV PDFs
│   └── cv/                     # CV source HTML, photo, and fonts
└── src/
    ├── main.tsx                # Mounts the React application
    ├── App.tsx                 # Shared layout and page selection
    ├── index.css               # Global styles
    ├── pages/                  # One component for each portfolio section
    ├── components/             # Shared header, footer, CV menu, icons, and UI
    ├── hooks/                  # Shared interactive behavior
    ├── lib/
    │   ├── router.ts           # Reads the URL hash and selects a page
    │   ├── pageMeta.ts         # Updates page titles and descriptions
    │   └── github.ts           # Loads and caches public GitHub data
    ├── js/
    │   ├── script.js           # Profile, projects, skills, and other portfolio data
    │   └── script.d.ts         # TypeScript types for that data
    ├── assets/                 # Photos and project images used by the pages
    └── utils/
        └── cn.ts               # Helper for combining CSS class names
```

### How a page is displayed

`src/main.tsx` mounts the app. `src/App.tsx` reads the current page and renders
it inside the shared header and footer. Each page's layout is in its own file in
`src/pages/`. The navigation changes the URL hash to values such as
`#/projects`; `src/lib/router.ts` listens for that change and selects the
matching page. Using hash-based navigation means GitHub Pages can serve the
site as static files without a custom server or route configuration.

I keep portfolio facts and lists in `src/js/script.js`. For example,
`PROFILE` holds my name and contact details, `PROJECTS` describes my work, and
`SKILLS`, `EDUCATION`, and `PROCESS_STEPS` provide content for their
corresponding pages. The React components import the data they need. The
companion `script.d.ts` file tells TypeScript what shapes those JavaScript
objects have.

### Live GitHub information

The Home and Projects pages use `src/lib/github.ts` to request public profile
and repository information from the GitHub API. The module refreshes the data
while the site is open and stores the most recent successful response in the
browser. If the API is unavailable, the site can show the saved response or
built-in fallback data instead. This lets the portfolio remain useful even
when the live request cannot be completed.

### Contact form and CVs

The Contact page sends form submissions through FormSubmit, so the portfolio
does not need its own backend. The address comes from `PROFILE.email` in
`src/js/script.js`; FormSubmit requires a one-time email confirmation before
delivering submissions.

The downloadable English and French CVs are in `public/`. Their source layouts
are `scripts/cv/cv.html` and `scripts/cv/cv.fr.html`; `scripts/make_cv.py` uses
Playwright and Chromium to generate the PDFs.

## Run the site locally

Install [Node.js](https://nodejs.org/) (the GitHub Actions workflow uses Node
22), then open a terminal in the project directory and run:

```bash
npm install
npm run dev
```

Open the local URL printed by Vite, usually <http://localhost:5173>. To check
the production build locally:

```bash
npm run build
npm run preview
```

Vite writes the production files to `dist/`. The preview command serves those
files so I can check the built version before deployment.

## How publishing works

This site is hosted at [fidele-zogbe.github.io](https://fidele-zogbe.github.io)
from the [`fidele-zogbe.github.io` GitHub repository](https://github.com/fidele-zogbe/fidele-zogbe.github.io).
GitHub Pages serves the static production build; it does not run a React server.

The workflow in `.github/workflows/deploy.yml` runs when I push to `main` or
manually start it from the repository's **Actions** tab. It installs the
dependencies with `npm ci`, runs `npm run build`, then publishes `dist/` using
the GitHub Pages deployment action. The repository's Pages source must be set
to **GitHub Actions** in **Settings → Pages**.

## What this project has taught me

- **Separate content from presentation.** Keeping project and profile details
  in one data module makes updates easier and keeps page components focused on
  how information is displayed.
- **Build for static hosting.** Hash-based navigation avoids depending on
  server-side routes, which fits GitHub Pages' static hosting model.
- **Plan for external services to fail.** GitHub API caching and fallback data
  keep repository information available when a request fails or is rate-limited.
- **Automate publishing.** A GitHub Actions workflow makes deployment repeatable:
  a successful push to `main` builds and publishes the site.
- **Treat a portfolio as a complete product.** In addition to page content, I
  worked on responsive layouts, page metadata, social previews, downloadable
  CVs, and a working contact path.

## Adapting this project

To make a version for your own GitHub Pages site, create a public repository
named `<your-github-username>.github.io`, copy the project files, and set its
Pages source to **GitHub Actions**. Then update the profile, projects, email,
and social links in `src/js/script.js`; update the site and preview-image URLs
in `index.html`; and change `GITHUB_USER` and its fallback information in
`src/lib/github.ts`. The workflow deploys the site when you push to `main`.
