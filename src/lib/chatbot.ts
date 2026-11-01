/* A rule-based, bilingual (English / French) assistant. It runs fully in the
   browser and answers only from src/js/script.js, so it never invents facts and
   it stays up to date when you edit your projects, skills or links.
   It tolerates typos, understands follow-ups ("what tools does it use?") and
   answers in the language the visitor writes in. */
import {
  PROFILE, SOCIALS, PROJECTS, PLANNED, SKILLS, CURRENTLY_LEARNING, EDUCATION, PROCESS_STEPS, SYSTEMS,
} from "@/js/script.js";
import { trL, type Lang } from "@/lib/i18n";

export type ChatLink = { label: string; href: string; external?: boolean };
export type Answer = { text: string; links?: ChatLink[]; chips?: string[] };
export type Ctx = { project?: string };
type Intent = { id: string; en: string[]; fr?: string[]; weight?: number; answer: (l: Lang, c: Ctx) => Answer; project?: string };

const x = (l: Lang, en: string, fr: string) => (l === "fr" ? fr : en);
const T = (s: string, l: Lang) => trL(s, l);
const norm = (s: string) =>
  " " + s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9+#]+/g, " ").trim() + " ";

const page = (l: Lang, en: string, fr: string, id: string): ChatLink => ({ label: x(l, en, fr), href: `#/${id}` });
const ext = (label: string, href: string): ChatLink => ({ label, href, external: true });
const social = (label: string) => SOCIALS.find((s) => s.label === label);
const done = PROJECTS.filter((p) => p.status === "Completed");
const ongoing = PROJECTS.filter((p) => p.status === "In progress");
const names = (ps: typeof PROJECTS, l: Lang) => ps.map((p) => T(p.title, l)).join(", ");
/* The site pages speak as Fidèle ("I", "my"). The assistant always speaks ABOUT him,
   so every text it reuses from the pages has a "he" version here (English, French). */
const HE_WELCOME: [string, string] = [
  "Third-year engineering student in Computer Science and Telecommunications at EPAC, Benin. He works with Python and machine learning on telecom and infrastructure data.",
  "Étudiant en troisième année d'ingénierie en informatique et télécommunications à l'EPAC, au Bénin. Il travaille avec Python et le machine learning sur des données de télécommunications et d'infrastructures.",
];
const HE_SYSTEMS: Record<string, { role: [string, string]; body: [string, string] }> = {
  Windows: {
    role: ["Where he learned to program", "Là où il a appris à programmer"],
    body: ["Programming fundamentals: the foundation for everything he built afterwards.", "Les bases de la programmation : le socle de tout ce qu'il a construit ensuite."],
  },
  "Kali Linux": {
    role: ["Months of command-line training", "Des mois d'entraînement en ligne de commande"],
    body: ["He spent months getting confident in bash and zsh, and picked up the basics of cybersecurity along the way.", "Il a passé des mois à devenir à l'aise avec bash et zsh, et a découvert au passage les bases de la cybersécurité."],
  },
  Ubuntu: {
    role: ["His system today", "Son système aujourd'hui"],
    body: ["Where he does his data science work, and where he keeps sharpening his terminal and shell skills.", "C'est là qu'il fait sa data science, et qu'il continue d'affiner sa maîtrise du terminal et du shell."],
  },
};
const HE_EDU_BODY: Record<string, [string, string]> = {
  "Mandarin, HSK 1": ["HSK 1 certificate, earned through self-study alongside his engineering coursework.", "Certificat HSK 1, obtenu en autodidacte parallèlement à ses études d'ingénieur."],
};
const find = (needle: string) => PROJECTS.find((p) => p.title.toLowerCase().includes(needle))!;

export const CHIPS = (l: Lang) => [
  x(l, "Who is Fidèle?", "Qui est Fidèle ?"),
  x(l, "Show me his projects", "Montre-moi ses projets"),
  x(l, "What are his skills?", "Quelles sont ses compétences ?"),
  x(l, "How can I contact him?", "Comment le contacter ?"),
  x(l, "Is he open to internships?", "Cherche-t-il un stage ?"),
  x(l, "Download CV", "Télécharger le CV"),
];
export const WELCOME = (l: Lang): Answer => ({
  text: x(l, `Hi! Ask me about ${PROFILE.shortName}'s projects, skills, studies, or how to contact him. You can write in English or French.`,
    `Bonjour ! Posez-moi vos questions sur les projets, les compétences et les études de ${PROFILE.shortName}, ou sur la façon de le contacter. Vous pouvez écrire en français ou en anglais.`),
});

function projectAnswer(needle: string, l: Lang, detail = false): Answer {
  const p = find(needle);
  const status = T(p.status, l).toLowerCase();
  const base = `${T(p.title, l)} (${status}). ${T(p.description, l)}`;
  const more = detail ? ` ${x(l, "Tools", "Outils")} : ${p.tools.join(", ")}. ${T(p.result, l)}` : ` ${T(p.result, l)}`;
  return {
    text: base + more,
    links: [ext(x(l, "See it on GitHub", "Voir sur GitHub"), p.link), page(l, "All projects", "Tous les projets", "projects")],
    chips: [x(l, "Which tools does it use?", "Quels outils utilise-t-il ?"), x(l, "Show me his projects", "Montre-moi ses projets")],
  };
}

const PK: [string, string[], string[]][] = [
  ["coverage", ["coverage", "network", "tower", "towers", "opencellid", "underserved", "gap", "gaps", "mobile network"], ["couverture", "reseau", "antenne", "antennes", "zones"]],
  ["churn", ["churn", "customer", "customers", "bigml", "attrition"], ["client", "clients", "desabonnement"]],
  ["calculator", ["calculator", "ubuntu calculator", "gnome calculator"], ["calculatrice", "calculatrice ubuntu"]],
  ["football", ["football", "club", "clubs", "soccer", "cagr", "profitability"], ["tcac", "rentabilite"]],
  ["space shooter", ["space shooter", "space", "shooter", "arcade"], ["spatial"]],
  ["vampire", ["vampire", "survivor", "survivors"], []],
];


/* ---- many more questions: short facts, glossary, data, models, privacy ---- */
const PL: Record<string, [string, string]> = {
  home: ["Home", "Accueil"], about: ["About", "À propos"], projects: ["Projects", "Projets"], skills: ["Skills", "Compétences"],
  process: ["Process", "Démarche"], education: ["Education", "Formation"], contact: ["Contact", "Contact"],
};
const pl = (...ids: string[]) => (l: Lang): ChatLink[] => ids.map((id) => page(l, PL[id][0], PL[id][1], id));
const Q = {
  projects: ["Show me his projects", "Montre-moi ses projets"], skills: ["What are his skills?", "Quelles sont ses compétences ?"],
  contact: ["How can I contact him?", "Comment le contacter ?"], intern: ["Is he open to internships?", "Cherche-t-il un stage ?"],
  cv: ["Download CV", "Télécharger le CV"], edu: ["What does he study?", "Qu'étudie-t-il ?"], who: ["Who is Fidèle?", "Qui est Fidèle ?"],
  models: ["Which models does he compare?", "Quels modèles compare-t-il ?"], data: ["Where does the data come from?", "D'où viennent les données ?"],
  process: ["How does he work?", "Comment travaille-t-il ?"], main: ["What is his main project?", "Quel est son projet principal ?"],
  why: ["Why should I contact him?", "Pourquoi le contacter ?"], churn: ["What is the churn project?", "Parle-moi du projet de churn"],
} as const;
type Pair = readonly [string, string];
const faq = (id: string, en: string[], fr: string[], textEn: string, textFr: string, o: { weight?: number; links?: (l: Lang) => ChatLink[]; chips?: Pair[] } = {}): Intent => ({
  id, en, fr, weight: o.weight ?? 3,
  answer: (l) => ({ text: x(l, textEn, textFr), links: o.links?.(l), chips: o.chips?.map((c) => x(l, c[0], c[1])) }),
});

const FAQS: Intent[] = [
  { id: "os", en: ["operating system", "operating systems", "windows", "kali", "kali linux", "ubuntu", "bash", "zsh", "terminal", "shell", "command line", "linux"], fr: ["systeme d exploitation", "systemes d exploitation", "windows", "kali", "ubuntu", "bash", "zsh", "terminal", "shell", "ligne de commande", "linux"], weight: 3,
    answer: (l) => ({ text: x(l, "He has worked on three operating systems:\n", "Il a travaillé sur trois systèmes d'exploitation :\n") + SYSTEMS.map((o) => { const h = HE_SYSTEMS[o.name]; return `• ${o.name} : ${h ? x(l, ...h.role) : T(o.role, l)}. ${h ? x(l, ...h.body) : T(o.body, l)}`; }).join("\n"),
      links: [page(l, "About", "À propos", "about"), page(l, "Skills", "Compétences", "skills")], chips: [x(l, Q.skills[0], Q.skills[1]), x(l, Q.projects[0], Q.projects[1])] }) },
  faq("code", ["see the code", "source code", "view the code", "his code", "code on github", "open source"], ["voir le code", "code source", "son code", "open source"],
    "All his code is public on GitHub, with a README and notebook for each project.", "Tout son code est public sur GitHub, avec un README et un notebook pour chaque projet.",
    { links: (l) => [ext("GitHub", `https://github.com/${PROFILE.githubUser}`), page(l, "Projects", "Projets", "projects")] }),
  faq("bac", ["baccalaureate", "bac", "high school", "secondary school", "16.86", "d series"], ["baccalaureat", "bac", "lycee", "serie d", "16 86"],
    "He passed the Baccalauréat Série D (Biology-Geology) at CEG 4 Bohicon in 2024, with Mention Très Bien, 16.86/20, and 20/20 in mathematics.",
    "Il a obtenu le baccalauréat Série D (Biologie-Géologie) au CEG 4 Bohicon en 2024, avec la mention Très Bien, 16,86/20, et 20/20 en mathématiques.", { links: pl("education"), chips: [Q.edu, Q.projects] }),
  faq("graduation", ["graduate", "graduation", "when will he graduate", "finish his studies", "what year", "which year", "year of study"], ["diplome prevu", "quand finit", "fin des etudes", "termine ses etudes", "quelle annee", "en quelle annee", "niveau d etudes"],
    "He is in his third year of the engineering programme at EPAC, and his expected graduation is 2029.", "Il est en troisième année du cursus d'ingénieur à l'EPAC, et son diplôme est prévu pour 2029.", { links: pl("education") }),
  faq("epac", ["what is epac", "epac stand", "epac mean"], ["c est quoi l epac", "qu est ce que l epac", "epac signifie", "que veut dire epac"],
    "EPAC is the École Polytechnique d'Abomey-Calavi, the engineering school of the University of Abomey-Calavi in Benin.", "L'EPAC est l'École Polytechnique d'Abomey-Calavi, l'école d'ingénieurs de l'Université d'Abomey-Calavi, au Bénin.", { links: pl("education") }),
  faq("git-programme", ["git programme", "git degree", "git stand", "what does git stand for", "git filiere"], ["que veut dire git", "filiere git", "cursus git", "git signifie"],
    "GIT stands for Génie Informatique et Télécommunications (computer engineering and telecommunications), his engineering programme at EPAC.", "GIT signifie Génie Informatique et Télécommunications, son cursus d'ingénieur à l'EPAC.", { links: pl("education") }),
  faq("g-churn", ["what is churn", "churn mean", "define churn", "meaning of churn"], ["c est quoi le churn", "qu est ce que le churn", "definition du churn", "churn signifie"],
    "Churn means customers leaving a service. A telecom churn model predicts which customers are likely to leave an operator, so the company can react before they go.", "Le churn, c'est le départ des clients d'un service. Un modèle de churn télécom prédit quels clients risquent de quitter un opérateur, pour que l'entreprise puisse réagir avant.", { weight: 6, chips: [Q.churn, Q.models] }),
  faq("g-opencellid", ["what is opencellid", "opencellid mean", "what does opencellid"], ["c est quoi opencellid", "qu est ce qu opencellid", "qu est ce que opencellid"],
    "OpenCellID is an open database of mobile cell towers and their locations. Fidèle combines it with population data to find areas in Benin that lack coverage.", "OpenCellID est une base de données ouverte des antennes mobiles et de leur position. Fidèle la croise avec des données de population pour trouver les zones du Bénin mal couvertes.", { weight: 6 }),
  faq("g-cagr", ["what is cagr", "cagr mean", "define cagr"], ["c est quoi le tcac", "qu est ce que le tcac", "tcac signifie", "c est quoi le cagr"],
    "CAGR is the compound annual growth rate: the steady yearly rate at which something (here, a club's revenue) would have grown between two dates.", "Le TCAC (CAGR) est le taux de croissance annuel composé : le rythme annuel constant auquel une valeur (ici, le chiffre d'affaires d'un club) aurait évolué entre deux dates.", { weight: 6 }),
  faq("g-hsk", ["what is hsk", "hsk level", "hsk mean"], ["c est quoi le hsk", "qu est ce que le hsk", "niveau hsk"],
    "HSK is the standard Chinese proficiency test. HSK 1 is the beginner level, and Fidèle holds the HSK 1 certificate, earned through self-study.", "Le HSK est le test standard de niveau en chinois. Le HSK 1 est le niveau débutant, et Fidèle détient le certificat HSK 1, obtenu en autodidacte.", { weight: 6, links: pl("skills") }),
  faq("why-data", ["why data", "why data science", "motivation", "what drives him", "why does he like"], ["pourquoi la data", "pourquoi la data science", "motivation", "qu est ce qui le motive", "pourquoi les donnees"],
    "He keeps coming back to data: cleaning it, questioning it, and building a model that answers a question someone actually has.", "Ce qui l'attire toujours, ce sont les données : les nettoyer, les questionner et construire un modèle qui répond à une question que quelqu'un se pose vraiment.", { links: pl("about") }),
  faq("learn-style", ["how does he learn", "learning style", "learn by", "learns by"], ["comment apprend il", "comment il apprend", "facon d apprendre", "apprend par"],
    "He learns by building: a project in Python first, then the same idea in SQL or JavaScript to see how each language thinks. He also studies independently through DataCamp's Associate Data Scientist track.", "Il apprend en construisant : d'abord un projet en Python, puis la même idée en SQL ou JavaScript pour voir comment chaque langage pense. Il suit aussi, en autodidacte, le parcours DataCamp Associate Data Scientist.", { links: pl("skills", "education") }),
  faq("games-lesson", ["before data", "games teach", "why games", "first projects"], ["avant la data", "jeux appris", "pourquoi les jeux", "premiers projets"],
    "Before data, he wrote games in Python (Space Shooter and Vampire Survivor). They taught him how to structure a project, debug stubborn code, and enjoy watching something run.", "Avant les données, il écrivait des jeux en Python (Space Shooter et Vampire Survivor). Ils lui ont appris à structurer un projet, à déboguer du code récalcitrant et à apprécier de voir quelque chose fonctionner.", { links: pl("projects") }),
  faq("docs", ["readme", "documentation", "documented", "notebook", "rerun", "reproducible"], ["readme", "documentation", "documente", "notebook", "reproductible", "relancer"],
    "Every project he publishes on GitHub comes with a written README and a documented notebook, so another student can rerun it, question it and build on it.", "Chaque projet qu'il publie sur GitHub est accompagné d'un README rédigé et d'un notebook documenté, pour qu'un autre étudiant puisse le relancer, le questionner et s'appuyer dessus.", { weight: 2, links: pl("process") }),
  faq("community", ["teach", "teaching", "community", "presentation", "presented", "classmates", "group work"], ["enseigne", "enseignement", "communaute", "presente", "presentation", "camarades", "travail en groupe"],
    "At EPAC he works in groups and presented a Linux topic to his classmates. Teaching showed him his own gaps: a project only makes sense to him once he can explain it step by step.", "À l'EPAC, il travaille en groupe et a présenté un sujet sur Linux à ses camarades. Enseigner lui a montré ses propres lacunes : un projet n'a de sens pour lui que lorsqu'il peut l'expliquer étape par étape.", { weight: 2, links: pl("about") }),
  faq("strengths", ["why hire", "why should", "strength", "strengths", "what makes", "stand out", "best at", "value"], ["pourquoi le recruter", "pourquoi l embaucher", "points forts", "atouts", "qualites", "ce qui le distingue"],
    "What stands out on the portfolio: projects on real telecom and infrastructure data, an honest evaluation habit (recall and the confusion matrix, not just accuracy), and every project documented with a README and a notebook.", "Ce qui ressort du portfolio : des projets sur de vraies données de télécoms et d'infrastructures, une évaluation honnête (rappel et matrice de confusion, pas seulement l'exactitude) et chaque projet documenté avec un README et un notebook.", { weight: 2, links: pl("projects", "process"), chips: [Q.intern, Q.contact] }),
  faq("main-project", ["main project", "best project", "favorite project", "favourite project", "biggest project", "flagship", "where to start", "start with", "should i start", "where do i start", "first look", "recommend", "what should i look at"], ["projet principal", "meilleur projet", "projet prefere", "par ou commencer", "que regarder", "recommande"],
    "His main project is the mobile network coverage study for Benin (still in progress). For finished work, start with the Telecom Customer Churn Prediction or the Football Club Financial Analysis, then the Advanced Calculator and the two Python games.", "Son projet principal est l'étude de la couverture du réseau mobile au Bénin (encore en cours). Pour du travail terminé, commencez par la prédiction du churn client ou l'analyse financière de clubs de football, puis la calculatrice avancée et les deux jeux Python.", { links: pl("projects"), chips: [Q.data, Q.models] }),
  faq("reply-time", ["reply", "respond", "response time", "how long", "how fast", "answer time"], ["repond", "reponse", "delai", "combien de temps", "rapidement"],
    "He reads every message and usually replies within two working days.", "Il lit chaque message et répond généralement sous deux jours ouvrés.", { weight: 2, links: pl("contact") }),
  faq("form", ["contact form", "the form", "form fields", "what do i write"], ["formulaire", "champs du formulaire"],
    "The contact form asks for your name, email, an optional company or school, a subject and your message. It goes straight to his inbox.", "Le formulaire demande votre nom, votre e-mail, une entreprise ou école (facultatif), un objet et votre message. Il arrive directement dans sa boîte mail.", { links: pl("contact") }),
  faq("followers", ["followers", "how many followers", "repos count", "github stats"], ["abonnes", "combien d abonnes", "statistiques github"],
    "The Home page shows his GitHub followers and public repositories live from GitHub, so the numbers are always current.", "La page d'accueil affiche ses abonnés et ses dépôts publics GitHub en direct, donc les chiffres sont toujours à jour.", { links: pl("home") }),
  faq("privacy", ["how old", "age", "phone", "phone number", "whatsapp", "home address", "salary", "married", "girlfriend", "religion", "birthday", "date of birth"], ["quel age", "age", "telephone", "numero de telephone", "whatsapp", "adresse personnelle", "salaire", "marie", "petite amie", "religion", "anniversaire", "date de naissance"],
    "I only share what is on the portfolio, so I can't give personal details like that. The contact form or his email is the way to ask him directly.", "Je ne partage que ce qui figure sur le portfolio, donc je ne peux pas donner ce genre de détails personnels. Le formulaire de contact ou son e-mail permettent de lui demander directement.", { links: pl("contact") }),
  faq("bot", ["who are you", "are you a bot", "are you ai", "are you human", "chatbot", "what are you", "your name"], ["qui es tu", "qui etes vous", "es tu un robot", "etes vous un robot", "chatbot", "tu es quoi", "comment tu t appelles"],
    "I'm the assistant built into this portfolio. I answer from the site's own content only, so I can't make things up. Ask me about Fidèle's projects, skills, studies or contact details.", "Je suis l'assistant intégré à ce portfolio. Je réponds uniquement à partir du contenu du site, donc je ne peux rien inventer. Posez-moi vos questions sur les projets, compétences, études ou coordonnées de Fidèle.", { chips: [Q.who, Q.projects, Q.contact] }),
  faq("bye", ["bye", "goodbye", "see you", "good night"], ["au revoir", "a bientot", "bonne nuit", "bonne journee"],
    "Goodbye! If you want to reach Fidèle later, the Contact page is always there.", "Au revoir ! Si vous voulez joindre Fidèle plus tard, la page Contact est toujours là.", { weight: 2, links: pl("contact") }),
  faq("howto", ["switch language", "change language", "french version", "english version", "translate", "in french", "in english", "change theme", "light theme"], ["changer la langue", "version francaise", "version anglaise", "traduire", "en francais", "en anglais", "theme clair", "changer le theme"],
    "Use the FR / EN button in the header to switch language, and the sun/moon button for light or dark theme. The site remembers your choice.", "Utilisez le bouton FR / EN de l'en-tête pour changer de langue, et le bouton soleil/lune pour le thème clair ou sombre. Le site retient votre choix."),
  faq("pages", ["what pages", "which pages", "sections", "navigation", "what is on the site"], ["quelles pages", "sections", "navigation", "qu y a t il sur le site"],
    "Home (overview), About (his story and interests), Projects, Skills, Process (how he runs a data project), Education and Contact.", "Accueil (aperçu), À propos (son parcours et ses centres d'intérêt), Projets, Compétences, Démarche (comment il mène un projet de data), Formation et Contact."),
  faq("p-crop", ["crop disease", "plant disease", "crops", "agriculture"], ["maladies des cultures", "maladie des plantes", "cultures", "agriculture"],
    "Planned project: crop disease detection, an image classification of plant diseases. It has not started on GitHub yet.", "Projet prévu : détection des maladies des cultures, une classification d'images de maladies des plantes. Il n'a pas encore démarré sur GitHub.", { weight: 4, links: pl("projects") }),
  faq("p-flood", ["flood", "floods", "rainfall", "forecasting"], ["inondation", "inondations", "pluviometrie", "precipitations", "prevision"],
    "Planned project: flood and rainfall prediction, with forecasting models built on rainfall data.", "Projet prévu : prévision des inondations et des précipitations, avec des modèles de prévision à partir de données de pluviométrie.", { weight: 4, links: pl("projects") }),
  faq("p-nlp", ["fon and yoruba", "yoruba", "text classification", "local language text", "nlp"], ["fon et yoruba", "yoruba", "classification de textes", "tal", "langues locales"],
    "Planned project: Fon and Yoruba text classification, which is NLP for local-language text.", "Projet prévu : classification de textes en fon et en yoruba, du traitement automatique des langues pour des textes en langues locales.", { weight: 4, links: pl("projects") }),
  faq("data-sources", ["data source", "data sources", "dataset", "datasets", "where does the data", "data come from", "population data"], ["source de donnees", "sources de donnees", "jeu de donnees", "jeux de donnees", "d ou viennent les donnees", "donnees de population"],
    "Coverage project: OpenCellID cell-tower data plus population data. Churn project: the BigML churn dataset (3,333 customers, 20 features). Football analysis: data on 52 European clubs from 2010 to 2026.", "Projet de couverture : données d'antennes OpenCellID et données de population. Projet de churn : le jeu de données churn de BigML (3 333 clients, 20 variables). Analyse du football : données de 52 clubs européens de 2010 à 2026.", { links: pl("projects") }),
  faq("models", ["model", "models", "algorithm", "algorithms", "logistic regression", "random forest", "gradient boosting", "metric", "metrics", "recall", "roc", "accuracy"], ["modele", "modeles", "algorithme", "algorithmes", "regression logistique", "foret aleatoire", "metrique", "metriques", "rappel", "exactitude"],
    "In the churn project he compares logistic regression (the baseline), random forest and gradient boosting with the same split and the same metrics (precision, recall, F1, ROC-AUC). He reads the confusion matrix with recall first, instead of the flattering accuracy number.", "Dans le projet de churn, il compare la régression logistique (la référence), la forêt aléatoire et le gradient boosting avec la même séparation des données et les mêmes métriques (précision, rappel, F1, ROC-AUC). Il lit la matrice de confusion en regardant le rappel d'abord, plutôt que le flatteur taux d'exactitude.", { weight: 2, links: pl("process"), chips: [Q.churn, Q.data] }),
  faq("viz", ["chart", "charts", "plot", "visualization", "visualisation", "map", "maps", "folium", "plotly", "matplotlib", "seaborn"], ["graphique", "graphiques", "visualisation", "carte", "cartes", "folium", "plotly", "matplotlib", "seaborn"],
    "He uses Matplotlib and seaborn for charts, plus folium (maps) and Plotly (interactive charts) in the coverage project.", "Il utilise Matplotlib et seaborn pour les graphiques, ainsi que folium (cartes) et Plotly (graphiques interactifs) dans le projet de couverture.", { weight: 2, links: pl("skills") }),
  faq("oop", ["oop", "object oriented", "object orient"], ["poo", "programmation orientee objet", "oriente objet"],
    "He writes object-oriented Python, for example the data-access class in the football analysis and the calculator app.", "Il écrit du Python orienté objet, par exemple la classe d'accès aux données de l'analyse du football et l'application de calculatrice.", { links: pl("projects") }),
  faq("scraping", ["scraping", "web scraping", "scraper", "data collection"], ["scraping", "web scraping", "collecte de donnees"],
    "Web scraping and data collection are part of his development skills and interests.", "Le web scraping et la collecte de données font partie de ses compétences en développement et de ses centres d'intérêt.", { weight: 2, links: pl("skills") }),
  faq("cyber", ["cybersecurity", "cyber", "security", "networks course"], ["cybersecurite", "securite", "cyber"],
    "His EPAC coursework covers cybersecurity, software engineering and telecommunications, and he picked up the basics of cybersecurity on Kali Linux.", "Ses cours à l'EPAC couvrent la cybersécurité, le génie logiciel et les télécommunications, et il a découvert les bases de la cybersécurité sous Kali Linux.", { links: pl("education") }),
  faq("region", ["west africa", "africa", "why benin", "local problems"], ["afrique de l ouest", "afrique", "pourquoi le benin", "problemes locaux"],
    "He wants to apply data science to real infrastructure and telecom problems in Benin and West Africa, using open data that answers local questions.", "Il veut appliquer la data science à de vrais problèmes d'infrastructures et de télécoms au Bénin et en Afrique de l'Ouest, avec des données ouvertes qui répondent à des questions locales.", { weight: 2, links: pl("about") }),
  faq("timezone", ["time zone", "timezone", "what time", "local time", "time in benin"], ["fuseau horaire", "quelle heure", "heure locale", "heure au benin"],
    "Benin uses West Africa Time (WAT, UTC+1). The footer of the site shows his local time.", "Le Bénin est à l'heure d'Afrique de l'Ouest (WAT, UTC+1). Le pied de page du site affiche son heure locale."),
  ...SOCIALS.map((so): Intent => ({
    id: "s-" + so.label.toLowerCase(), en: [so.label.toLowerCase()], fr: [so.label.toLowerCase()], weight: 3,
    answer: (l) => ({ text: so.url ? `${so.label} : ${so.handle}` : x(l, `${so.label} is not listed on the portfolio.`, `${so.label} ne figure pas sur le portfolio.`), links: so.url ? [ext(so.label, so.url)] : undefined, chips: [x(l, Q.contact[0], Q.contact[1])] }),
  })),
];

const INTENTS: Intent[] = [
  ...FAQS,
  { id: "greeting", en: ["hi", "hello", "hey", "good morning", "good evening"], fr: ["bonjour", "salut", "coucou", "bonsoir"],
    answer: (l) => ({ text: x(l, `Hi! I'm the assistant of this portfolio. I can tell you about ${PROFILE.shortName}, his projects, skills, studies and how to contact him. What would you like to know?`,
      `Bonjour ! Je suis l'assistant de ce portfolio. Je peux vous parler de ${PROFILE.shortName}, de ses projets, compétences, études et de la façon de le contacter. Que voulez-vous savoir ?`), chips: CHIPS(l) }) },
  { id: "thanks", en: ["thanks", "thank you", "great", "awesome", "cool", "perfect"], fr: ["merci", "super", "genial", "parfait"],
    answer: (l) => ({ text: x(l, "You're welcome! Ask me anything else, or use the Contact page to write to Fidèle directly.", "Avec plaisir ! Posez-moi d'autres questions, ou écrivez directement à Fidèle via la page Contact."), links: [page(l, "Contact", "Contact", "contact")] }) },
  { id: "help", en: ["help", "what can you do", "what can i ask", "options", "menu"], fr: ["aide", "aider", "que peux tu faire", "que peux vous faire", "que puis je demander"], weight: 2,
    answer: (l) => ({ text: x(l, "You can ask me about his projects (by name too), skills, studies, languages, CV, social accounts, availability, how he works, how this site was built, or how to contact him.",
      "Vous pouvez me demander ses projets (par leur nom aussi), compétences, études, langues, CV, réseaux, disponibilité, sa façon de travailler, comment ce site a été construit, ou comment le contacter."), chips: CHIPS(l) }) },
  { id: "who", en: ["who", "who is", "introduce", "yourself", "background", "bio", "about fidele", "about him", "about zogbe"], fr: ["qui", "qui est", "presente", "presentation", "parle moi de", "a propos de lui"],
    answer: (l) => ({ text: `${PROFILE.name}. ${x(l, ...HE_WELCOME)} ${x(l, "Based in", "Basé à")} ${T(PROFILE.location, l)}.`,
      links: [page(l, "About", "À propos", "about"), page(l, "Projects", "Projets", "projects")], chips: [x(l, "What does he study?", "Qu'étudie-t-il ?"), x(l, "Show me his projects", "Montre-moi ses projets")] }) },
  { id: "education", en: ["education", "study", "studies", "studying", "studied", "school", "university", "epac", "degree", "diploma", "bac", "baccalaureat", "grade", "grades", "student", "engineering", "coursework", "graduate", "graduation", "datacamp"],
    fr: ["etudes", "etudie", "etudier", "ecole", "universite", "diplome", "formation", "cursus", "etudiant", "ingenieur", "mention", "notes", "promotion"],
    answer: (l) => ({ text: EDUCATION.map((e) => `• ${T(e.period, l)} : ${T(e.title, l)}, ${T(e.place, l)}. ${HE_EDU_BODY[e.title] ? x(l, ...HE_EDU_BODY[e.title]) : T(e.body, l)}`).join("\n"), links: [page(l, "Education", "Formation", "education")] }) },
  { id: "projects", en: ["project", "portfolio", "github repo", "repository", "showcase", "what has he built", "what did he build", "what does he build"], fr: ["projet", "realisations", "depots", "ce qu il a construit", "qu a t il construit"],
    answer: (l) => ({ text: x(l, `Completed: ${names(done, l)}.\nIn progress: ${names(ongoing, l)}.\nAsk me about any of them by name.`, `Terminés : ${names(done, l)}.\nEn cours : ${names(ongoing, l)}.\nDemandez-moi des détails sur n'importe lequel.`),
      links: [page(l, "Projects", "Projets", "projects"), ext("GitHub", `https://github.com/${PROFILE.githubUser}`)], chips: PROJECTS.slice(0, 3).map((p) => T(p.title, l)) }) },
  ...PK.map(([needle, en, fr]): Intent => ({ id: "p-" + needle, en, fr, weight: 4, project: needle, answer: (l) => projectAnswer(needle, l) })),
  { id: "games", en: ["game", "games", "gaming", "game development", "pygame"], fr: ["jeu", "jeux", "jeu video", "jeux video"], weight: 2,
    answer: (l) => ({ text: x(l, "He builds games in Python: Space Shooter and Vampire Survivor are both finished and published on GitHub.", "Il crée des jeux en Python : Space Shooter et Vampire Survivor sont terminés et publiés sur GitHub."), links: [page(l, "Projects", "Projets", "projects")] }) },
  { id: "status", en: ["completed", "finished", "in progress", "ongoing", "current", "currently", "working on", "latest", "right now", "doing now", "doing", "now"], fr: ["termine", "termines", "fini", "finis", "en cours", "actuellement", "en ce moment", "travaille sur"],
    answer: (l) => ({ text: x(l, `Finished: ${names(done, l)}.\nStill in progress: ${names(ongoing, l)}.\nNext on the list: ${PLANNED.map((p) => T(p.title, l)).join(", ")}.`, `Terminés : ${names(done, l)}.\nEn cours : ${names(ongoing, l)}.\nProchainement : ${PLANNED.map((p) => T(p.title, l)).join(", ")}.`), links: [page(l, "Projects", "Projets", "projects")] }) },
  { id: "planned", en: ["planned", "next", "build next", "future", "plan", "plans", "upcoming", "crop", "flood", "rainfall", "yoruba", "nlp"], fr: ["prevu", "prevus", "prochain", "prochains", "futur", "avenir", "cultures", "inondations", "pluviometrie"],
    answer: (l) => ({ text: x(l, "Projects he plans to build next: ", "Projets qu'il prévoit de construire ensuite : ") + PLANNED.map((p) => `${T(p.title, l)} (${T(p.description, l).replace(/\.$/, "").toLowerCase()})`).join(" ; ") + ".", links: [page(l, "Projects", "Projets", "projects")] }) },
  { id: "skills", en: ["skill", "tool", "tech", "stack", "technology", "technologies", "python", "pandas", "scikit learn", "numpy", "programming", "c++", "code", "coding", "linux", "git", "know", "sql", "javascript", "learning", "good at"],
    fr: ["competence", "competences", "outil", "outils", "technologie", "technologies", "langage", "programmation", "sait", "maitrise", "apprend"],
    answer: (l) => ({ text: SKILLS.filter((s) => s.title !== "Languages").map((s) => `• ${T(s.title, l)} : ${s.items.map((i) => T(i, l)).join(", ")}`).join("\n") + `\n• ${x(l, "Currently learning", "En apprentissage")} : ${CURRENTLY_LEARNING.join(", ")}`, links: [page(l, "Skills", "Compétences", "skills")] }) },
  { id: "spoken", en: ["speak", "spoken", "french", "english", "mandarin", "chinese", "hsk", "fon language", "bilingual"], fr: ["parle", "langues", "francais", "anglais", "mandarin", "chinois", "bilingue"], weight: 2,
    answer: (l) => ({ text: x(l, "He speaks ", "Il parle ") + SKILLS.find((s) => s.title === "Languages")!.items.map((i) => T(i, l)).join(", ") + ".", links: [page(l, "Skills", "Compétences", "skills")] }) },
  { id: "process", en: ["process", "method", "how do you work", "how does he work", "how he works", "work on a project", "workflow", "approach", "steps", "methodology"], fr: ["demarche", "methode", "processus", "etapes", "comment travaille", "approche", "methodologie"], weight: 2,
    answer: (l) => ({ text: x(l, "How he works on a data project:\n", "Sa façon de mener un projet de data :\n") + PROCESS_STEPS.map((s) => `${s.n}. ${T(s.title, l)}`).join("\n"), links: [page(l, "Process", "Démarche", "process")] }) },
  { id: "cv", en: ["cv", "resume", "curriculum", "download", "pdf"], fr: ["cv", "curriculum", "telecharger", "telechargement"], weight: 2,
    answer: (l) => ({ text: x(l, "You can download his CV in English or French.", "Vous pouvez télécharger son CV en anglais ou en français."), links: [{ label: x(l, "CV (English)", "CV (anglais)"), href: PROFILE.cv, external: true }, { label: x(l, "CV (Français)", "CV (français)"), href: PROFILE.cvFr, external: true }] }) },
  { id: "availability", en: ["internship", "internships", "available", "availability", "open to", "looking for", "freelance", "remote", "remotely", "hire", "hiring", "recruit", "opportunity", "opportunities"], fr: ["stage", "stages", "disponible", "disponibilite", "cherche", "recherche", "embaucher", "recruter", "recrutement", "opportunite", "opportunites", "a distance"], weight: 2,
    answer: (l) => ({ text: x(l, `Yes: ${PROFILE.shortName} is open to internships and remote collaborations. The fastest way to reach him is the contact form or ${PROFILE.email}.`, `Oui : ${PROFILE.shortName} est ouvert aux stages et aux collaborations à distance. Le plus rapide est le formulaire de contact ou ${PROFILE.email}.`),
      links: [page(l, "Contact form", "Formulaire de contact", "contact"), { label: x(l, "CV (English)", "CV (anglais)"), href: PROFILE.cv, external: true }] }) },
  { id: "contact", en: ["contact", "email", "mail", "reach", "message", "collaborate", "collaboration", "work together", "talk", "write", "touch", "address"], fr: ["contacter", "contact", "joindre", "ecrire", "courriel", "mail", "collaborer", "collaboration", "adresse", "message"],
    answer: (l) => ({ text: x(l, `The best way is the contact form on this site, or email ${PROFILE.email}. He is also on LinkedIn and GitHub.`, `Le mieux est le formulaire de contact de ce site, ou l'e-mail ${PROFILE.email}. Il est aussi sur LinkedIn et GitHub.`),
      links: [page(l, "Contact form", "Formulaire de contact", "contact"), ext("LinkedIn", social("LinkedIn")?.url ?? "#"), ext("GitHub", social("GitHub")?.url ?? "#")] }) },
  { id: "socials", en: ["social", "socials", "linkedin", "github", "kaggle", "youtube", "account", "accounts", "follow", "followers"], fr: ["reseaux", "reseau social", "compte", "comptes", "abonnes", "suivre"],
    answer: () => ({ text: SOCIALS.filter((s) => s.url).map((s) => `• ${s.label} : ${s.handle}`).join("\n"), links: SOCIALS.filter((s) => s.url).map((s) => ext(s.label, s.url as string)) }) },
  { id: "location", en: ["where", "location", "live", "lives", "country", "city", "benin", "abomey calavi", "based", "from where"], fr: ["ou habite", "ou vit", "ou est", "localisation", "habite", "vit", "originaire", "ville", "pays", "benin", "d ou"],
    answer: (l) => ({ text: x(l, `He lives in ${PROFILE.location}.`, `Il vit à ${T(PROFILE.location, l)}.`) }) },
  { id: "experience", en: ["experience", "work experience", "experienced", "years", "professional", "employed", "company", "companies", "certificate", "certification", "award", "publication"], fr: ["experience", "experiences", "professionnel", "emploi", "entreprise", "certificat", "certification", "prix", "publication"], weight: 2,
    answer: (l) => ({ text: x(l, "Fidèle is a student, and this portfolio does not list professional work experience, certifications or awards. What it shows is real project work published on GitHub and Kaggle, plus his DataCamp studies.", "Fidèle est étudiant, et ce portfolio ne mentionne ni expérience professionnelle, ni certifications, ni récompenses. Il montre de vrais projets publiés sur GitHub et Kaggle, ainsi que son parcours DataCamp."),
      links: [page(l, "Projects", "Projets", "projects"), page(l, "Education", "Formation", "education")] }) },
  { id: "site", en: ["website", "site", "page", "pages", "built with", "made with", "how was this", "framework", "react", "hosted", "hosting", "design", "theme", "dark mode"], fr: ["site", "site web", "pages", "construit", "realise", "heberge", "hebergement", "technologie", "theme sombre", "mode sombre", "traduction"], weight: 2,
    answer: (l) => ({ text: x(l, "This site is a small multi-page portfolio built with React, TypeScript and Tailwind CSS, hosted free on GitHub Pages. It has Home, About, Projects, Skills, Process, Education and Contact pages, a light and dark theme, and English/French versions. The GitHub numbers update live from his account.",
      "Ce site est un petit portfolio multi-pages construit avec React, TypeScript et Tailwind CSS, hébergé gratuitement sur GitHub Pages. Il comporte les pages Accueil, À propos, Projets, Compétences, Démarche, Formation et Contact, un thème clair et sombre, et des versions française et anglaise. Les chiffres GitHub se mettent à jour en direct.") }) },
  { id: "interests", en: ["interest", "interests", "hobby", "hobbies", "passion", "focus", "specialty", "specialise", "specialize", "data science", "machine learning", "ai", "telecom", "infrastructure"], fr: ["interet", "interets", "centres d interet", "loisirs", "passion", "specialite", "science des donnees", "telecoms", "telecommunications", "infrastructures"],
    answer: (l) => ({ text: x(l, `${PROFILE.name} works on ${PROFILE.role.toLowerCase()}, mostly on telecom and infrastructure data in Benin and West Africa: coverage gaps, customer churn, and more.`, `${PROFILE.name} travaille en data science et machine learning, surtout sur des données de télécommunications et d'infrastructures au Bénin et en Afrique de l'Ouest : zones sans couverture, churn client, et plus encore.`), links: [page(l, "Projects", "Projets", "projects")] }) },
  { id: "count", en: ["how many"], fr: ["combien"], weight: 3,
    answer: (l) => ({ text: x(l, `${PROJECTS.length} projects: ${done.length} completed and ${ongoing.length} in progress, plus ${PLANNED.length} planned.`, `${PROJECTS.length} projets : ${done.length} terminés et ${ongoing.length} en cours, plus ${PLANNED.length} prévus.`), links: [page(l, "Projects", "Projets", "projects")] }) },
];

/* ---- understanding the question ----------------------------------------- */
function ed(a: string, b: string) {
  const d = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 1; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++)
    for (let j = 1; j <= b.length; j++)
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  return d[a.length][b.length];
}

const FR_WORDS = new Set("qui est quels quelles quel quelle comment combien les des une son ses sa tu vous je peux mes pour avec dans sur moi bonjour salut merci projets competences il elle cherche stage etudes".split(" "));
const EN_WORDS = new Set("the is what who how does his he are can you where tell me about and of to do have has".split(" "));
export function detectLang(q: string, fallback: Lang): Lang {
  const toks = norm(q).trim().split(" ");
  const f = toks.filter((t) => FR_WORDS.has(t)).length;
  const e = toks.filter((t) => EN_WORDS.has(t)).length;
  return f > e ? "fr" : e > f ? "en" : fallback;
}

function score(intent: Intent, padded: string, toks: string[]) {
  let s = 0;
  const used = new Set<number>(); /* a word counts once per intent, so "pages" cannot score as both "page" and "pages" */
  for (const key of [...intent.en, ...(intent.fr ?? [])]) {
    const k = norm(key).trim();
    if (k.includes(" ")) {
      if (padded.includes(" " + k + " ")) s += (intent.weight ?? 1) * 2;
      continue;
    }
    const idx = toks.findIndex((t, n) => !used.has(n) && (t === k || (k.length >= 4 && (t === k + "s" || t + "s" === k)) ||
      (k.length >= 5 && t.length >= 4 && t[0] === k[0] && Math.min(ed(t, k), ed(t, k + "s")) <= (k.length >= 9 ? 2 : 1))));
    if (idx >= 0) { used.add(idx); s += intent.weight ?? 1; }
  }
  return s;
}

const has = (toks: string[], words: string[]) => toks.some((t) => words.includes(t));

/* "Does he know X?" – looks X up in the real skills list */
const KNOW_EN = ["know", "knows", "use", "uses", "using", "skilled", "experience", "proficient", "familiar", "good", "code", "codes"];
const KNOW_FR = ["connait", "sait", "utilise", "maitrise", "competent", "experience", "code", "bon"];
type Term = { key: string; label: string; group: string; learning: boolean };
const TERMS: Term[] = [
  ...SKILLS.filter((g) => g.title !== "Languages").flatMap((g) =>
    g.items.flatMap((it) => it.replace(/\(.*?\)/g, "").split(/ and /).map((t) => t.trim()).filter(Boolean).map((t) => ({ key: norm(t).trim(), label: t, group: g.title, learning: false })))),
  ...CURRENTLY_LEARNING.map((t) => ({ key: norm(t).trim(), label: t, group: "", learning: true })),
];
function skillLookup(padded: string, toks: string[], l: Lang): Answer | null {
  const t = TERMS.find((x) => (x.key.length <= 3 ? toks.includes(x.key) : padded.includes(" " + x.key + " ") || toks.some((w) => w.length >= 4 && w[0] === x.key[0] && ed(w, x.key) <= 1)));
  if (!t) return null;
  const links = [page(l, "Skills", "Compétences", "skills")];
  const chips = [x(l, Q.projects[0], Q.projects[1]), x(l, Q.contact[0], Q.contact[1])];
  return t.learning
    ? { text: x(l, `He is currently learning ${t.label}.`, `Il apprend actuellement ${t.label}.`), links, chips }
    : { text: x(l, `Yes: ${t.label} is listed under "${T(t.group, l)}" in his skills.`, `Oui : ${t.label} figure dans « ${T(t.group, l)} » parmi ses compétences.`), links, chips };
}

/* follow-up chips for answers that do not set their own */
const NEXT: Record<string, Pair[]> = {
  who: [Q.edu, Q.projects], education: [Q.projects, Q.intern], projects: [Q.main, Q.models], skills: [Q.projects, Q.cv], process: [Q.models, Q.projects],
  contact: [Q.intern, Q.cv], availability: [Q.cv, Q.contact], cv: [Q.contact, Q.projects], socials: [Q.contact, Q.projects], experience: [Q.projects, Q.edu],
  location: [Q.who, Q.contact], site: [Q.projects, Q.contact], interests: [Q.projects, Q.why], status: [Q.projects, Q.main], planned: [Q.projects, Q.skills],
};
const QUIET = new Set(["greeting", "thanks", "help", "bye", "bot", "privacy"]);

/* `forceUi`: answer in the interface language whatever language the question was typed in.
   Used to re-render earlier answers when the visitor switches language. */
export function reply(input: string, ctx: Ctx, uiLang: Lang, forceUi = false): { answer: Answer; ctx: Ctx; lang: Lang } {
  const l = forceUi ? uiLang : detectLang(input, uiLang);
  const padded = norm(input);
  const toks = padded.trim().split(" ").filter(Boolean);
  if (toks.length === 0) return { answer: WELCOME(l), ctx, lang: l };

  const ranked = INTENTS.map((it) => ({ it, s: score(it, padded, toks) })).filter((r) => r.s > 0).sort((a, b) => b.s - a.s);
  const best = ranked[0]?.it ?? null;
  const asksKnow = has(toks, KNOW_EN) || has(toks, KNOW_FR);

  /* "does he know python?" */
  if (asksKnow && (!best || !best.project)) {
    const a = skillLookup(padded, toks, l);
    if (a && (!best || best.id === "skills" || best.id === "experience" || ranked[0].s <= 2)) return { answer: a, ctx: {}, lang: l };
  }

  /* follow-ups about the project we were just talking about */
  if (ctx.project && (!best || !best.project)) {
    const p = find(ctx.project);
    if (has(toks, ["tool", "tools", "stack", "technology", "technologies", "uses", "use", "outil", "outils", "utilise", "technologie"]))
      return { answer: { text: `${T(p.title, l)} : ${p.tools.join(", ")}.`, links: [ext(x(l, "See it on GitHub", "Voir sur GitHub"), p.link)] }, ctx, lang: l };
    if (has(toks, ["link", "github", "code", "source", "repo", "lien", "voir"]))
      return { answer: { text: x(l, `Here is ${T(p.title, l)} on GitHub.`, `Voici ${T(p.title, l)} sur GitHub.`), links: [ext("GitHub", p.link)] }, ctx, lang: l };
    if (has(toks, ["more", "detail", "details", "explain", "elaborate", "plus", "expliquer", "precisions"]))
      return { answer: projectAnswer(ctx.project, l, true), ctx, lang: l };
  }

  if (best) {
    let a = best.answer(l, ctx);
    /* a question with two parts ("skills and projects") gets both answers */
    const second = ranked[1];
    if (second && second.s >= 2 && second.s >= ranked[0].s * 0.6 && !QUIET.has(best.id) && !QUIET.has(second.it.id) && !(best.project && second.it.project)) {
      const b = second.it.answer(l, ctx);
      const seen = new Set<string>();
      const links = [...(a.links ?? []), ...(b.links ?? [])].filter((k) => (seen.has(k.href) ? false : (seen.add(k.href), true))).slice(0, 4);
      a = { text: a.text + "\n\n" + b.text, links, chips: a.chips };
    }
    if (!a.chips && NEXT[best.id]) a = { ...a, chips: NEXT[best.id].map((c) => x(l, c[0], c[1])) };
    return { answer: a, ctx: best.project ? { project: best.project } : {}, lang: l };
  }

  return {
    answer: {
      text: asksKnow
        ? x(l, "I can't find that in his listed skills. You can see everything he works with on the Skills page.", "Je ne trouve pas cela dans ses compétences listées. Vous pouvez voir tout ce qu'il utilise sur la page Compétences.")
        : x(l, "I don't have an answer for that yet. I can talk about his projects, skills, education, CV, availability and contact details. For anything else, please write to Fidèle directly.",
            "Je n'ai pas encore de réponse à cela. Je peux parler de ses projets, compétences, études, CV, disponibilité et coordonnées. Pour tout le reste, écrivez directement à Fidèle."),
      links: [page(l, asksKnow ? "Skills" : "Contact", asksKnow ? "Compétences" : "Contact", asksKnow ? "skills" : "contact")], chips: CHIPS(l).slice(0, 4),
    },
    ctx,
    lang: l,
  };
}
