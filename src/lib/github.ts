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

const sourceExtensions: Record<string, string> = {
  ts: 'TypeScript', tsx: 'TSX', js: 'JavaScript', jsx: 'JSX', mjs: 'JavaScript',
  py: 'Python', java: 'Java', kt: 'Kotlin', go: 'Go', rs: 'Rust',
  html: 'HTML', css: 'CSS', scss: 'SCSS', php: 'PHP', c: 'C', cpp: 'C++',
  cs: 'C#', swift: 'Swift', rb: 'Ruby', vue: 'Vue', svelte: 'Svelte',
};

export async function getProjectCodePreview(repo: string) {
  if (!site.githubUsername || site.githubUsername === 'GANTI_USERNAME_GITHUB' || !/^[\w.-]+$/.test(repo)) return null;
  try {
    const repositoryResponse = await fetch(`https://api.github.com/repos/${site.githubUsername}/${encodeURIComponent(repo)}`, { headers, next: { revalidate: 3600 } });
    if (!repositoryResponse.ok) return null;
    const repository = await repositoryResponse.json() as { default_branch?: string };
    const branch = repository.default_branch || 'main';
    const treeResponse = await fetch(`https://api.github.com/repos/${site.githubUsername}/${encodeURIComponent(repo)}/git/trees/${encodeURIComponent(branch)}?recursive=1`, { headers, next: { revalidate: 3600 } });
    if (!treeResponse.ok) return null;
    const tree = await treeResponse.json() as { tree?: Array<{ path: string; type: string; size?: number }> };
    const ignoredPath = /(^|\/)(node_modules|vendor|dist|build|coverage|\.next|\.git|\.venv|venv|__tests__|tests?)(\/|$)/i;
    const candidates = (tree.tree || []).filter((file) => {
      const extension = file.path.split('.').pop()?.toLowerCase() || '';
      return file.type === 'blob' && (file.size ?? 0) <= 100_000 && sourceExtensions[extension] && !ignoredPath.test(file.path);
    });
    const rank = (path: string) => {
      const lower = path.toLowerCase();
      if (/^(src\/)?(app\/)?page\.(tsx|jsx|ts|js)$/.test(lower)) return 0;
      if (/^(src\/)?(main|index|app)\.(tsx|jsx|ts|js|py|java|html)$/.test(lower)) return 1;
      if (/^(src\/)?(main|index)\.(go|rs|kt|swift)$/.test(lower)) return 2;
      return 10 + path.split('/').length;
    };
    const source = candidates.sort((a, b) => rank(a.path) - rank(b.path) || a.path.length - b.path.length)[0];
    if (!source) return null;
    const rawPath = source.path.split('/').map(encodeURIComponent).join('/');
    const codeResponse = await fetch(`https://raw.githubusercontent.com/${site.githubUsername}/${encodeURIComponent(repo)}/${encodeURIComponent(branch)}/${rawPath}`, { next: { revalidate: 3600 } });
    if (!codeResponse.ok) return null;
    const code = (await codeResponse.text()).split(/\r?\n/).slice(0, 18).map((line) => line.slice(0, 200)).join('\n');
    return { path: source.path, language: sourceExtensions[source.path.split('.').pop()?.toLowerCase() || ''] || 'Kode', code };
  } catch {
    return null;
  }
}
