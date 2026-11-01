export const PROFILE: {
  name: string;
  shortName: string;
  givenNames: string;
  familyName: string;
  initials: string;
  headline: string;
  welcome: string;
  role: string;
  programme: string;
  university: string;
  graduation: string;
  location: string;
  email: string;
  githubUser: string;
  cv: string;
  cvFr: string;
};

export type Social = {
  label: string;
  handle: string | null;
  url: string | null;
  icon: string;
};

export const SOCIALS: Social[];

export type Project = {
  title: string;
  status: "Completed" | "In progress";
  group: string;
  tools: string[];
  description: string;
  result: string;
  link: string;
};

export const PROJECTS: Project[];

export const PLANNED: { title: string; description: string }[];

export const SKILLS: {
  title: string;
  icon: string;
  lead: string;
  items: string[];
}[];

export const TOOLS: string[];

export const CURRENTLY_LEARNING: string[];

export const PROCESS_STEPS: {
  n: string;
  title: string;
  body: string;
  detail: string;
}[];

export const EDUCATION: {
  period: string;
  title: string;
  place: string;
  body: string;
  /** true once it is achieved: the timeline shows a filled dot */
  done?: boolean;
}[];

export const FEATURED: string[];

export const SYSTEMS_TITLE: string;
export const SYSTEMS_INTRO: string;
export const SYSTEMS_OUTRO: string;
export const SYSTEMS: { name: string; role: string; body: string; current?: boolean }[];
