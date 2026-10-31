(function () {
  "use strict";

  var GH_USER = "fidele-zogbe";
  var EMAIL = "togbedjifidele@gmail.com";
  var $ = function (id) { return document.getElementById(id); };
  var root = document.documentElement;

  /* ---------- Light / dark theme ---------- */
  var themeBtn = $("theme-toggle");
  function labelTheme() {
    var dark = root.getAttribute("data-theme") === "dark";
    themeBtn.textContent = dark ? "Light" : "Dark";
    themeBtn.setAttribute("aria-label", dark ? "Switch to light theme" : "Switch to dark theme");
  }
  themeBtn.addEventListener("click", function () {
    var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    try { localStorage.setItem("theme", next); } catch (e) {}
    labelTheme();
  });
  labelTheme();

  /* ---------- Phone menu ---------- */
  var header = $("site-header");
  var menuBtn = $("menu-btn");
  function setMenu(open) {
    header.classList.toggle("open", open);
    menuBtn.setAttribute("aria-expanded", String(open));
  }
  menuBtn.addEventListener("click", function () { setMenu(!header.classList.contains("open")); });
  document.querySelectorAll("#site-nav a").forEach(function (a) {
    a.addEventListener("click", function () { setMenu(false); });
  });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") setMenu(false); });
  document.addEventListener("click", function (e) {
    if (header.classList.contains("open") && !header.contains(e.target)) setMenu(false);
  });

  /* ---------- Copy email ---------- */
  var copyBtn = $("copy-mail");
  copyBtn.addEventListener("click", function () {
    var done = function (text) {
      copyBtn.textContent = text;
      setTimeout(function () { copyBtn.textContent = "Copy email address"; }, 2200);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(EMAIL).then(function () { done("Copied"); }, function () { done(EMAIL); });
    } else {
      done(EMAIL);
    }
  });

  /* ---------- Latest repositories (live from GitHub) ---------- */
  var CACHE_KEY = "gh-repos-v3";

  // Repositories already shown as project cards above (lowercase names).
  // If you add a project card, add its repository name here too.
  var FEATURED = ["club_financial", "advanced_calculator", "space-shooter", "vampire-survivor"];

  function shorten(text) {
    return text.length > 120 ? text.slice(0, 117).trim() + "…" : text;
  }

  function renderRepos(list) {
    var box = $("repo-grid");
    box.textContent = "";
    $("more-repos").hidden = list.length === 0;
    list.forEach(function (r) {
      var a = document.createElement("a");
      a.className = "repo";
      a.href = "https://github.com/" + GH_USER + "/" + r.name;
      a.target = "_blank";
      a.rel = "noopener";
      var b = document.createElement("b");
      b.textContent = r.name;
      a.appendChild(b);
      if (r.description) {
        var s = document.createElement("span");
        s.textContent = shorten(r.description);
        a.appendChild(s);
      }
      if (r.language) {
        var m = document.createElement("small");
        m.textContent = r.language;
        a.appendChild(m);
      }
      box.appendChild(a);
    });
  }

  try {
    var cached = JSON.parse(localStorage.getItem(CACHE_KEY) || "null");
    if (Array.isArray(cached) && cached.length) renderRepos(cached);
  } catch (e) {}

  fetch("https://api.github.com/users/" + GH_USER + "/repos?per_page=100&sort=pushed", {
    headers: { Accept: "application/vnd.github+json" }
  })
    .then(function (res) { return res.ok ? res.json() : null; })
    .then(function (data) {
      if (!Array.isArray(data)) return;
      var skip = [GH_USER.toLowerCase(), (GH_USER + ".github.io").toLowerCase()].concat(FEATURED);
      var repos = data
        .filter(function (r) {
          var n = r.name.toLowerCase();
          return !r.fork && skip.indexOf(n) === -1 && n.indexOf("skills-") !== 0;
        })
        .sort(function (a, b) { return new Date(b.pushed_at) - new Date(a.pushed_at); })
        .slice(0, 6)
        .map(function (r) { return { name: r.name, description: r.description, language: r.language }; });
      renderRepos(repos);
      try { localStorage.setItem(CACHE_KEY, JSON.stringify(repos)); } catch (e) {}
    })
    .catch(function () { /* offline or rate-limited: keep what is already shown */ });

  /* ---------- Footer year ---------- */
  $("year").textContent = new Date().getFullYear();
})();
