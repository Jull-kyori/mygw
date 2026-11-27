import fallback from '@/data/fallback-projects.json';
import { featuredProjects } from '@/config/featured';
import { site } from '@/config/site';
import type { GitHubProfile, GitHubRepo, Project } from '@/types/github';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

const headers: HeadersInit = { Accept: 'application/vnd.github+json', ...(process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {}) };

function titleCaseRepo(name: string) {
  return name.replace(/[-_]+/g, ' ').replace(/\b\p{L}/gu, (letter) => letter.toUpperCase());
}

function projectPresentation(repo: GitHubRepo) {
  const featured = featuredProjects.find((item) => item.repo.toLowerCase() === repo.name.toLowerCase());
  const localImage = join(process.cwd(), 'public', 'projects', `${repo.name}.png`);
  const image = featured?.image || (existsSync(localImage)
    ? `/projects/${encodeURIComponent(repo.name)}.png`
    : `https://opengraph.githubassets.com/1/${site.githubUsername}/${encodeURIComponent(repo.name)}`);
  return {
    ...repo,
    featured: Boolean(featured),
    displayName: featured?.title || titleCaseRepo(repo.name),
    displayDescription: repo.description || featured?.description || undefined,
    displayDemo: featured?.demo,
    image,
    tech: featured?.tech,
  };
}

// Mengambil repositori publik; cache ISR menjaga halaman tetap cepat.
export async function getGitHubData() {
  const configured = site.githubUsername !== 'GANTI_USERNAME_GITHUB';
  try {
    if (!configured) throw new Error('Username GitHub belum diatur.');
    const [reposResponse, profileResponse] = await Promise.all([
      fetch(`https://api.github.com/users/${site.githubUsername}/repos?per_page=100&sort=updated`, { headers, next: { revalidate: 3600 } }),
      fetch(`https://api.github.com/users/${site.githubUsername}`, { headers, next: { revalidate: 3600 } }),
    ]);
    if (!reposResponse.ok) throw new Error(`GitHub API ${reposResponse.status}`);
    const repos = await reposResponse.json() as GitHubRepo[];
    const profile = profileResponse.ok ? await profileResponse.json() as GitHubProfile : null;
    const projects = repos.filter((repo) => !repo.fork && !repo.archived).map(projectPresentation)
      .sort((a, b) => Number(b.featured) - Number(a.featured) || b.stargazers_count - a.stargazers_count || Date.parse(b.updated_at) - Date.parse(a.updated_at));
    return { projects, profile, languages: [...new Set(projects.map((repo) => repo.language).filter((value): value is string => Boolean(value)))], isFallback: false };
  } catch {
    const projects = (fallback as GitHubRepo[]).map((repo) => ({ ...projectPresentation(repo), fallback: true } as Project));
    return { projects, profile: null, languages: [...new Set(projects.map((repo) => repo.language).filter((value): value is string => Boolean(value)))], isFallback: true };
  }
}

export async function getProjectDetails(repo: string) {
  if (!site.githubUsername || site.githubUsername === 'GANTI_USERNAME_GITHUB') return { readme: '', languages: {} as Record<string, number>, ok: false };
  try {
    const [readmeResponse, languageResponse] = await Promise.all([
      fetch(`https://api.github.com/repos/${site.githubUsername}/${repo}/readme`, { headers, next: { revalidate: 3600 } }),
      fetch(`https://api.github.com/repos/${site.githubUsername}/${repo}/languages`, { headers, next: { revalidate: 3600 } }),
    ]);
    let readme = '';
    if (readmeResponse.ok) { const payload = await readmeResponse.json() as { content?: string }; readme = Buffer.from(payload.content ?? '', 'base64').toString('utf8').replace(/^\s*(?:<p[^>]*>)?\s*<a[^>]*>.*?<\/a>\s*(?:<\/p>)?\s*$/gim, '').replace(/^\s*<img[^>]*>\s*$/gim, '').replace(/^\s*!\[[^\]]*\]\([^)]*\)\s*$/gm, '').replace(/^\s*\[[^\]]*\]:\s*\S+\s*$/gm, '').replace(/^#+\s.*$/gm, '').replace(/<[^>]+>/g, ' ').replace(/!\[[^\]]*\]\([^)]*\)/g, '').replace(/\[([^\]]+)\]\([^)]*\)/g, '$1').replace(/[`*_>#]/g, '').split(/\n\s*\n/).map((part) => part.trim()).find((part) => part.length > 35) ?? ''; }
    const languages = languageResponse.ok ? await languageResponse.json() as Record<string, number> : {};
    return { readme: readme.slice(0, 600), languages, ok: readmeResponse.ok || languageResponse.ok };
  } catch { return { readme: '', languages: {} as Record<string, number>, ok: false }; }
}
