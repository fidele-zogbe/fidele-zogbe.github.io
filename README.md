# Fidèle Togbédji ZOGBE — portfolio website

Seven-page portfolio: Home, About, Projects, Skills, Process, Education, Contact.

Built with **React + Vite + Tailwind CSS**. The seven pages are React components
rendered by a hash router (`#/home`, `#/about`, …), which keeps relative links
working on GitHub Pages with no server configuration.

```
src/
  App.tsx                 routes the seven pages, shared header + footer
  js/script.js            ← ALL MY PROJECTS, LINKS AND PROFILE FACTS
  js/script.d.ts          types for script.js
  pages/
    Home.tsx  About.tsx  Projects.tsx  Skills.tsx
    Process.tsx  Education.tsx  Contact.tsx
  components/
    Header.tsx            same menu on every page, mobile menu
    Footer.tsx            same footer on every page
    ui.tsx  Icons.tsx
  lib/
    router.ts             hash router + page list
    pageMeta.ts           per-page <title>, description and link previews
    github.ts             live GitHub numbers (cache, refresh, fallback)
  hooks/useReveal.ts      scroll animations and dark mode
  assets/                 portrait and images (portrait.jpg = the photo on Home)
public/
  og-image.jpg            1200×630 link-preview image (WhatsApp, LinkedIn, X…)
```

## Run it locally

```bash
npm install
npm run dev        # http://localhost:5173
```

## Build it

```bash
npm run build      # writes everything to dist/
npm run preview    # serves dist/ locally to check the result
```

## Publish it on GitHub Pages

The site lives in the repository `fidele-zogbe/fidele-zogbe.github.io`.

**Automatic (recommended).** The file `.github/workflows/deploy.yml` builds and
publishes the site every time you push to `main`. One-time setup:
repository **Settings → Pages → Build and deployment → Source: GitHub Actions**.
Then simply:

```bash
git add .
git commit -m "Update portfolio"
git push
```

The site is live at <https://fidele-zogbe.github.io> about a minute later
(progress is shown in the repository's **Actions** tab).

**Manual.** Run `npm run build` and upload the contents of `dist/`
(`index.html`, `og-image.jpg`, the CV, `robots.txt`) to the publishing branch.

## Edit my projects

Everything about a project lives in **one list** in `src/js/script.js`:

```js
export const PROJECTS = [
  {
    title: "Telecom Customer Churn Prediction",
    status: "In progress",          // "Completed" or "In progress"
    group: "Data science",
    tools: ["Python", "pandas", "scikit-learn"],
    description: "…",
    result: "…",
    link: "https://github.com/fidele-zogbe/…",
  },
];
```

* **Add a project** — copy a block, paste it, change the values.
* **Move a project to Completed** — change `"In progress"` to `"Completed"`.
  The Projects page groups projects by this value, so nothing else to edit.
* **Planned ideas** — the `PLANNED` list, same file.
* **Skills** — the `SKILLS` list, same file.
* **Process steps** — the `PROCESS_STEPS` list, same file.
* **Education** — the `EDUCATION` list, same file.

## Edit my links

Also in `src/js/script.js`:

```js
export const PROFILE = { …, email: "togbedjifidele@gmail.com", … };

export const SOCIALS = [
  { label: "GitHub",    handle: "fidele-zogbe",          url: "https://github.com/fidele-zogbe", icon: "github" },
  { label: "YouTube",   handle: null,                     url: null,                              icon: "youtube"  },
];
```

`url: null` would render a “Link to be confirmed” chip on the Contact page and in
the footer instead of a broken link. Four professional accounts are shown: GitHub, Kaggle, LinkedIn and YouTube
(`@zogbefidele`). Instagram and Facebook are kept as commented lines in
`script.js`: paste them back into the list to show them again.

## Contact form

The Contact page has a form with **name, email, company (optional), subject and
message**. It posts to [FormSubmit](https://formsubmit.co), a free form backend,
so there is no server to run:

* the message arrives in my inbox as a normal email, with the sender's address as
  `Reply-To`, so I can answer directly;
* a hidden honeypot field (`_honey`) filters bots;
* the browser blocks an empty or invalid submit before anything is sent;
* if the form service is unreachable, the visitor sees an explanation and their
  mail app opens with the message already written;
* after a successful send the form is replaced by a confirmation, and a button
  brings it back.

**One-time activation:** the first submission sends a confirmation email to
`togbedjifidele@gmail.com`. Click the link inside it once and every following
message is delivered normally. Until then the form falls back to the visitor's
mail app, so the page still works.

To use a different service, edit `FORM_ENDPOINT` at the top of
`src/pages/Contact.tsx`.

## Live GitHub data

Loaded from the public GitHub API:

* `https://api.github.com/users/fidele-zogbe` → followers and repository count on Home
* `https://api.github.com/users/fidele-zogbe/repos?per_page=100&sort=pushed` → the repository list on Projects

Rules, all in `src/lib/github.ts`:

* refreshes every **5 minutes** while the page is open;
* saves the last successful result in `localStorage` (`fz-github-cache-v1`) and
  shows it labelled “Saved from GitHub” when the API is unreachable;
* falls back to a built-in list labelled “Built-in list (GitHub unavailable)”
  when there is no cache either;
* repositories that are forks are labelled **Fork**.

To change the account, edit `GITHUB_USER` at the top of `src/lib/github.ts`.

## Accessibility

* “Skip to content” link at the top of every page.
* Keyboard focus styles on every link, button and field.
* The mobile menu closes on a link tap, a tap outside, on the hamburger button
  again, or with the `Escape` key.
* Every image has an `alt` text.
* Buttons that change state announce it (`aria-live`), e.g. “Copied”.
* All animations are disabled when the visitor prefers reduced motion.
* Light and dark themes, set before the page renders (no flash) and remembered
  in `localStorage`.

## Deployment checklist

Already handled in the code, checked before publishing:

* [x] One `<h1>` per page, unique `<title>` and meta description per page.
* [x] No absolute paths in the build, so the site works at
      `https://fidele-zogbe.github.io` with no configuration.
* [x] Old bookmarks (`#about`, `#projects`…) are redirected to the new pages.
* [x] Clicking a menu item scrolls the new page back to the top.
* [x] No horizontal scrolling from 360 px to 1920 px.
* [x] All external links use `target="_blank"` + `rel="noreferrer"`.
* [x] No console error, no failed request.
* [x] `og:image`, `og:url` and `twitter:card` for link previews.

## Your CV

`public/Fidele-ZOGBE-CV.pdf` is the file behind the "Download CV" buttons. It is a one-page
A4 design generated from `scripts/cv/cv.html` (text and layout) and `scripts/cv/photo.jpg`.
Edit the HTML, then run:

```bash
pip install playwright && playwright install chromium
python scripts/make_cv.py
```

## Change the portrait

Replace `src/assets/portrait.jpg` with a new JPEG (about 900×1100 px or larger,
under 200 KB) and run `npm run build` again. To refresh the link preview,
also replace `public/og-image.jpg` (1200×630 px).

## Before sharing

* Contact form: send yourself one test message and click the confirmation link FormSubmit
  emails you (once). Until then the form opens the visitor's mail app instead.
* Repo links for the two in-progress data projects currently point to the GitHub profile.
  When each repository exists, paste its URL into `PROJECTS` in `src/js/script.js`.
* Add a precise result to each data project once the analysis is finished.

## English / French

The whole site exists in English and French. A small **FR / EN** button in the header
switches language and the choice is remembered. Every sentence is written once in English
in the code; the French lines live in `src/lib/fr.ts` as `"English text": "Texte français"`.
**When you add or change a sentence, add or fix its line in `src/lib/fr.ts`** — without a
line, the text simply stays in English.

## The assistant (chat button, bottom right)

`src/lib/chatbot.ts` is a small rule-based assistant. It runs in the browser (no server, no
key) and answers only from `src/js/script.js` and a list of short facts in the same file,
in English or French (it follows the language the visitor writes in). To teach it a new
question, add a `faq(...)` line with the keywords and the English and French answers.
