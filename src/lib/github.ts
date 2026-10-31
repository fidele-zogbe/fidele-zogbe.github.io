/* ============================================================================
 * src/lib/github.ts — live GitHub numbers
 * ----------------------------------------------------------------------------
 * • Loads the public GitHub API for `fidele-zogbe`.
 * • Refreshes every 5 minutes while the page is open.
 * • Saves the last successful result in localStorage (offline / API limit).
 * • Falls back to a built-in list when a request fails.
 * Both the Home page and the Projects page read this one module, so the
 * account is only fetched once per page load.
 * ========================================================================== */

import { useEffect, useState } from "react";

export const GITHUB_USER = "fidele-zogbe";
const USER_API = `https://api.github.com/users/${GITHUB_USER}`;
const REPOS_API = `https://api.github.com/users/${GITHUB_USER}/repos?per_page=100&sort=pushed`;
const STORAGE_KEY = "fz-github-cache-v1";
const REFRESH_MS = 5 * 60 * 1000;

export type Repo = {
  name: string;
  url: string;
  fork: boolean;
  language: string | null;
  description: string | null;
  pushed: string;
};

export type GitHubState = {
  user: { login: string; followers: number; publicRepos: number; bio: string | null; location: string | null } | null;
  repos: Repo[];
  source: "live" | "cache" | "fallback";
  updatedAt: number | null;
};

/** Used when the GitHub API is unreachable or rate-limited. */
export const FALLBACK: GitHubState = {
  user: { login: GITHUB_USER, followers: 75, publicRepos: 11, bio: null, location: "Abomey-Calavi" },
  source: "fallback",
  updatedAt: null,
  repos: [
    { name: "fidele-zogbe.github.io", url: "https://github.com/fidele-zogbe/fidele-zogbe.github.io", fork: false, language: "HTML", description: null, pushed: "2026-10-31" },
    { name: "house-prices-prediction", url: "https://github.com/fidele-zogbe/house-prices-prediction", fork: false, language: "Jupyter Notebook", description: null, pushed: "2026-10-29" },
    { name: "Advanced_Calculator", url: "https://github.com/fidele-zogbe/Advanced_Calculator", fork: false, language: "Python", description: null, pushed: "2026-10-22" },
    { name: "Space-Shooter", url: "https://github.com/fidele-zogbe/Space-Shooter", fork: false, language: "Python", description: null, pushed: "2026-10-18" },
    { name: "Club_Financial", url: "https://github.com/fidele-zogbe/Club_Financial", fork: false, language: "Python", description: "I analyzed data collected from a website about clubs' financial state to see how fast each club is growing, and also to identify which variable has the strongest positive or negative correlation with the club's financial growth.", pushed: "2026-10-18" },
    { name: "py-simple-wrap", url: "https://github.com/fidele-zogbe/py-simple-wrap", fork: true, language: null, description: "A beginner-friendly Python wrapper designed to eliminate complex syntax and make coding accessible for everyone.", pushed: "2026-09-30" },
    { name: "Vampire-Survivor", url: "https://github.com/fidele-zogbe/Vampire-Survivor", fork: false, language: "Python", description: null, pushed: "2026-09-27" },
    { name: "skills-introduction-to-github", url: "https://github.com/fidele-zogbe/skills-introduction-to-github", fork: false, language: null, description: "My clone repository", pushed: "2026-07-29" },
    { name: "Fidele-ZOGBE", url: "https://github.com/fidele-zogbe/Fidele-ZOGBE", fork: false, language: null, description: null, pushed: "2026-07-29" },
    { name: "introduction-to-github", url: "https://github.com/fidele-zogbe/introduction-to-github", fork: true, language: null, description: "Get started using GitHub in less than an hour.", pushed: "2024-10-08" },
    { name: "5games", url: "https://github.com/fidele-zogbe/5games", fork: true, language: null, description: 'Project files for the video "Master Python by making 5 games"', pushed: "2024-05-14" },
  ],
};

function readCache(): GitHubState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || !Array.isArray(parsed.repos) || !parsed.user) return null;
    return { ...parsed, source: "cache" };
  } catch {
    return null;
  }
}

function writeCache(state: GitHubState) {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ user: state.user, repos: state.repos, updatedAt: state.updatedAt })
    );
  } catch {
    /* storage full or blocked — ignore */
  }
}

async function fetchAll(): Promise<GitHubState> {
  const [userRes, reposRes] = await Promise.all([fetch(USER_API), fetch(REPOS_API)]);
  if (!userRes.ok || !reposRes.ok) throw new Error(`GitHub API ${userRes.status}/${reposRes.status}`);
  const user = await userRes.json();
  const repos = await reposRes.json();
  const state: GitHubState = {
    user: {
      login: user.login,
      followers: user.followers,
      publicRepos: user.public_repos,
      bio: user.bio,
      location: user.location,
    },
    repos: repos.map((r: Record<string, unknown>) => ({
      name: r.name as string,
      url: r.html_url as string,
      fork: Boolean(r.fork),
      language: (r.language as string) ?? null,
      description: (r.description as string) ?? null,
      pushed: String(r.pushed_at).slice(0, 10),
    })),
    source: "live",
    updatedAt: Date.now(),
  };
  writeCache(state);
  return state;
}

/* ---------------------------------------------------------------- state ---- */

let current: GitHubState = FALLBACK;
const listeners = new Set<(s: GitHubState) => void>();
let started = false;

function emit() {
  listeners.forEach((l) => l(current));
}

function start() {
  if (started) return;
  started = true;

  const cached = readCache();
  if (cached) {
    current = cached;
    emit();
  }

  const load = () => {
    fetchAll()
      .then((state) => {
        current = state;
        emit();
      })
      .catch(() => {
        if (current.source === "fallback") emit();
      });
  };

  load();
  window.setInterval(load, REFRESH_MS);
}

export function useGitHub(): GitHubState {
  const [state, setState] = useState<GitHubState>(current);
  useEffect(() => {
    start();
    listeners.add(setState);
    setState(current);
    return () => {
      listeners.delete(setState);
    };
  }, []);
  return state;
}

export function repoSourceLabel(source: GitHubState["source"]) {
  if (source === "live") return "Live from GitHub";
  if (source === "cache") return "Saved from GitHub";
  return "Built-in list (GitHub unavailable)";
}
