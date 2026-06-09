export interface GithubCategory {
  id: string;
  label: string;
  keywords: string[];
}

export interface GithubConfig {
  username: string;
  profileUrl: string;
  pinnedRepos: string[];
  featuredRepos: string[];
  categories: GithubCategory[];
  defaultCategory: string;
}

export interface GithubUser {
  login: string;
  avatar_url: string;
  html_url: string;
  bio: string | null;
  public_repos: number;
  followers: number;
  following: number;
  name: string | null;
}

export interface GithubRepo {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  topics: string[];
  updated_at: string;
  fork: boolean;
}

export interface CategorizedRepo {
  repo: GithubRepo;
  categoryId: string;
  categoryLabel: string;
  featured: boolean;
  pinned: boolean;
}

export interface GithubCategoryGroup {
  id: string;
  label: string;
  repos: CategorizedRepo[];
}

export interface GithubStats {
  publicRepos: number;
  followers: number;
  following: number;
  topLanguages: { name: string; count: number }[];
}
