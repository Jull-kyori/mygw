export type GitHubRepo = {
  id: number; name: string; description: string | null; language: string | null;
  stargazers_count: number; updated_at: string; topics: string[]; html_url: string;
  homepage: string | null; fork: boolean; archived: boolean;
};
export type GitHubProfile = { public_repos: number; followers: number; avatar_url?: string };
export type Project = GitHubRepo & { displayName?: string; displayDescription?: string; displayDemo?: string; image?: string; tech?: string[]; featured: boolean; fallback?: boolean };
