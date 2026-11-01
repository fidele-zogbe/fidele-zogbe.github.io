/* ============================================================================
 * src/js/script.js — ONE PLACE FOR ALL MY PROJECTS, LINKS AND PROFILE FACTS
 * ----------------------------------------------------------------------------
 * HOW TO EDIT
 *   • Add a project: copy a block, paste it, change the values.
 *   • Move a project from "In progress" to "Completed": change `status`.
 *   • Change a link: edit the `link` value.
 *   `status` must be either "Completed" or "In progress".
 *   The Projects page groups projects by `status`, so this is the only file
 *   you have to touch.
 * ========================================================================== */

export const PROFILE = {
  name: "Fidèle Togbédji ZOGBE",
  shortName: "Fidèle Zogbe",
  givenNames: "Fidèle Togbédji",
  familyName: "ZOGBE",
  initials: "FZ",
  headline: "Data Science & Machine Learning",
  welcome:
    "Third-year engineering student in Computer Science and Telecommunications at EPAC, Benin. I work with Python and machine learning on telecom and infrastructure data.",
  role: "Data science & machine learning",
  programme: "Génie Informatique et Télécommunications",
  university: "EPAC, Université d'Abomey-Calavi",
  graduation: "2029",
  location: "Abomey-Calavi, Benin",
  email: "togbedjifidele@gmail.com",
  githubUser: "fidele-zogbe",
  cv: "Fidele-ZOGBE-CV.pdf", // English CV, file in /public — rebuild with scripts/make_cv.py
  cvFr: "Fidele-ZOGBE-CV-FR.pdf", // French CV
};

/* ---------------------------------------------------------------------------
 * All my accounts. They appear in the footer and on the Contact page.
 * To add one: copy a line and fill in label, handle and url.
 * ------------------------------------------------------------------------ */
export const SOCIALS = [
  { label: "GitHub", handle: "fidele-zogbe", url: "https://github.com/fidele-zogbe", icon: "github" },
  { label: "Kaggle", handle: "zogbetogbedjifidle", url: "https://www.kaggle.com/zogbetogbedjifidle", icon: "kaggle" },
  { label: "LinkedIn", handle: "zogbe-togbedji-fidèle", url: "https://www.linkedin.com/in/zogbe-togbedji-fid%C3%A8le", icon: "linkedin" },
  { label: "YouTube", handle: "@zogbefidele", url: "https://www.youtube.com/@zogbefidele", icon: "youtube" },
  // Personal accounts, kept off the portfolio on purpose. Paste a line back into
  // the list above if you ever want it shown again:
  //   { label: "Instagram", handle: "fidele.zogbet", url: "https://www.instagram.com/fidele.zogbet", icon: "instagram" },
  //   { label: "Facebook",  handle: "61564294738581", url: "https://www.facebook.com/profile.php?id=61564294738581", icon: "facebook" },
];

/* ---------------------------------------------------------------------------
 * Projects — the only list to edit.
 * ------------------------------------------------------------------------ */
export const PROJECTS = [
  {
    title: "Predicting Mobile Network Coverage Gaps in Benin",
    status: "In progress",
    group: "Data science",
    tools: ["Python", "pandas", "scikit-learn", "folium", "Plotly"],
    description:
      "Combines OpenCellID cell-tower data with population data to identify underserved areas in Benin and to suggest where infrastructure investment should go first.",
    result: "Ongoing — results will be published here once the analysis is finished.",
    link: "https://github.com/fidele-zogbe",
  },
  {
    title: "Telecom Customer Churn Prediction",
    status: "In progress",
    group: "Data science",
    tools: ["Python", "pandas", "scikit-learn", "Matplotlib", "seaborn"],
    description:
      "Predicts which customers are likely to leave a telecom operator, using the BigML churn dataset (3,333 customers, 20 features). Exploratory analysis, followed by a comparison of classification models.",
    result: "Ongoing: exploratory analysis done first, then a comparison of classification models. Results will be published here when it is finished.",
    link: "https://github.com/fidele-zogbe",
  },
  {
    title: "Football Club Financial Analysis",
    status: "Completed",
    group: "Data science",
    tools: ["Python", "pandas", "OOP"],
    description:
      "Analysis of 52 European football clubs from 2010 to 2026: revenue growth (CAGR), which metrics correlate most with profitability, and an object-oriented data-access class built on pandas.",
    result:
      "Revenue growth and the strongest correlations with profitability are documented in the repository.",
    link: "https://github.com/fidele-zogbe/Club_Financial",
  },
  {
    title: "Advanced Calculator",
    status: "Completed",
    group: "Software",
    tools: ["Python", "OOP"],
    description:
      "A desktop calculator in Python modelled on the Ubuntu calculator, built mode by mode (basic, advanced, programming).",
    result: "Finished and published.",
    link: "https://github.com/fidele-zogbe/Advanced_Calculator",
  },
  {
    title: "Space Shooter",
    status: "Completed",
    group: "Software",
    tools: ["Python", "Game development"],
    description:
      "An arcade space shooter game written in Python: player movement, waves of enemies, collisions and a score that rises as the waves get faster.",
    result: "Finished and published.",
    link: "https://github.com/fidele-zogbe/Space-Shooter",
  },
  {
    title: "Vampire Survivor",
    status: "Completed",
    group: "Software",
    tools: ["Python", "Game development"],
    description:
      "A survivor-style action game written in Python: the player survives automatic enemy waves, collects upgrades and lasts as long as possible.",
    result: "Finished and published.",
    link: "https://github.com/fidele-zogbe/Vampire-Survivor",
  },
];

/* Projects I plan to build next — shown on the Projects page. */
export const PLANNED = [
  { title: "Crop disease detection", description: "Image classification of plant diseases." },
  { title: "Flood and rainfall prediction", description: "Forecasting models using rainfall data." },
  { title: "Fon and Yoruba text classification", description: "NLP for local-language text." },
];

/* Skills page. */
export const SKILLS = [
  {
    title: "Data and AI",
    icon: "brain",
    lead: "Turning raw data into a question I can answer with a model.",
    items: [
      "Python",
      "pandas",
      "NumPy",
      "Matplotlib",
      "seaborn",
      "SciPy",
      "scikit-learn",
      "Exploratory data analysis",
      "Feature engineering",
      "Classification models",
    ],
  },
  {
    title: "Development",
    icon: "code",
    lead: "Object-oriented Python, games and scraping — code written to be reused.",
    items: [
      "Python (object-oriented)",
      "C",
      "C++",
      "Web scraping",
      "Game development",
      "Git and GitHub",
      "Linux (Ubuntu, Kali)",
      "Bash and zsh",
      "VS Code",
      "Google Colab",
    ],
  },
  {
    title: "Languages",
    icon: "globe",
    lead: "French and English every day, plus HSK 1 Mandarin.",
    items: ["French", "English", "Mandarin (HSK 1)", "Fon"],
  },
];

export const TOOLS = [
  "Python", "pandas", "scikit-learn", "NumPy", "Matplotlib", "seaborn",
  "SciPy", "C++", "Git", "Linux", "Google Colab",
];

/* About page: the operating systems I have worked on, in the order I used them.
   `current: true` marks the one I use today. */
export const SYSTEMS_TITLE = "From Windows to Ubuntu";
export const SYSTEMS_INTRO = "I have worked on three operating systems, and each one taught me something different:";
export const SYSTEMS = [
  {
    name: "Windows",
    role: "Where I learned to program",
    body: "Programming fundamentals: the foundation for everything I built afterwards.",
  },
  {
    name: "Kali Linux",
    role: "Months of command-line training",
    body: "I spent months getting confident in bash and zsh, and picked up the basics of cybersecurity along the way.",
  },
  {
    name: "Ubuntu",
    role: "My system today",
    body: "Where I do my data science work, and where I keep sharpening my terminal and shell skills.",
    current: true,
  },
];
export const SYSTEMS_OUTRO = "The result: I am comfortable on both Windows and Linux, and the terminal is part of how I work.";

export const CURRENTLY_LEARNING = ["SQL", "JavaScript"];

/* Process page — the method I follow on a data project (here: the telecom churn project). */
export const PROCESS_STEPS = [
  {
    n: "01",
    title: "Frame the question",
    body: "Start from a decision, not a dataset: which customers are likely to leave a telecom operator?",
    detail: "3,333 customers, 20 features (BigML churn dataset).",
  },
  {
    n: "02",
    title: "Exploratory data analysis",
    body: "Profile every column, check types and missing values, and look at the distributions and correlations before touching a model.",
    detail: "pandas + Matplotlib + seaborn: histograms, boxplots, correlation matrix.",
  },
  {
    n: "03",
    title: "Feature engineering",
    body: "Encode categorical variables, scale numeric ones and build the features the models can actually learn from.",
    detail: "One-hot encoding, scaling, feature selection.",
  },
  {
    n: "04",
    title: "Compare three models",
    body: "Run logistic regression as a baseline, then random forest and gradient boosting, and compare them with the same split and the same metrics.",
    detail: "scikit-learn pipelines, cross-validation, precision / recall / F1 / ROC-AUC.",
  },
  {
    n: "05",
    title: "Evaluate honestly",
    body: "Read the confusion matrix and the metrics that matter for churn — recall first — instead of the flattering accuracy number.",
    detail: "Confusion matrix, ROC curve, feature importance.",
  },
  {
    n: "06",
    title: "Publish a polished project",
    body: "Clean the notebook, write the README, document the setup and the findings, then push a repository someone else can rerun.",
    detail: "GitHub: structured folders, requirements, documented conclusions.",
  },
];

/* Education page. */
export const EDUCATION = [
  {
    period: "2024 — 2029 (expected)",
    title: "Engineering degree, Génie Informatique et Télécommunications",
    place: "EPAC, Université d'Abomey-Calavi",
    body: "Currently in third year. Coursework covers cybersecurity, software engineering and telecommunications.",
  },
  {
    period: "Ongoing",
    title: "DataCamp Associate Data Scientist track",
    place: "DataCamp",
    body: "Independent data science study, plus personal projects published on GitHub and Kaggle.",
  },
  {
    period: "Certificate",
    title: "Mandarin, HSK 1",
    place: "Self-taught",
    body: "HSK 1 certificate, earned through self-study alongside my engineering coursework.",
    done: true,
  },
  {
    period: "2024",
    title: "Baccalauréat, Série D (Biology-Geology)",
    place: "CEG 4 Bohicon",
    body: "Mention Très Bien, 16.86/20, with 20/20 in mathematics.",
    done: true,
  },
];

/* Home page: the three featured projects. */
export const FEATURED = [
  "Football Club Financial Analysis",
  "Predicting Mobile Network Coverage Gaps in Benin",
  "Telecom Customer Churn Prediction",
];
