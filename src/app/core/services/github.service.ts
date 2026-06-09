import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, catchError, of } from 'rxjs';
import {
  GithubConfig,
  GithubUser,
  GithubRepo,
  CategorizedRepo,
  GithubCategoryGroup,
  GithubStats,
} from '../models/github.models';

@Injectable({ providedIn: 'root' })
export class GithubService {
  private readonly http = inject(HttpClient);

  private readonly configSignal = signal<GithubConfig | null>(null);
  private readonly userSignal = signal<GithubUser | null>(null);
  private readonly reposSignal = signal<GithubRepo[]>([]);
  private readonly loadingSignal = signal(false);
  private readonly errorSignal = signal<string | null>(null);
  private readonly loadedSignal = signal(false);

  readonly loading = computed(() => this.loadingSignal());
  readonly error = computed(() => this.errorSignal());
  readonly user = computed(() => this.userSignal());
  readonly repos = computed(() => this.reposSignal());
  readonly config = computed(() => this.configSignal());

  readonly profileUrl = computed(
    () => this.configSignal()?.profileUrl ?? 'https://github.com/umeshwaghmaretech',
  );

  readonly categorizedRepos = computed((): CategorizedRepo[] => {
    const cfg = this.configSignal();
    const repos = this.reposSignal();
    if (!cfg || repos.length === 0) return [];

    return repos
      .filter((r) => !r.fork)
      .map((repo) => {
        const categoryId = this.resolveCategory(repo, cfg);
        const category = cfg.categories.find((c) => c.id === categoryId);
        return {
          repo,
          categoryId,
          categoryLabel: category?.label ?? categoryId,
          featured: cfg.featuredRepos.includes(repo.name),
          pinned: cfg.pinnedRepos.includes(repo.name),
        };
      })
      .sort((a, b) => {
        if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
        if (a.featured !== b.featured) return a.featured ? -1 : 1;
        return b.repo.stargazers_count - a.repo.stargazers_count;
      });
  });

  readonly categoryGroups = computed((): GithubCategoryGroup[] => {
    const cfg = this.configSignal();
    const categorized = this.categorizedRepos();
    if (!cfg) return [];

    const groups = cfg.categories.map((cat) => ({
      id: cat.id,
      label: cat.label,
      repos: categorized.filter((r) => r.categoryId === cat.id),
    }));

    const defaultRepos = categorized.filter((r) => r.categoryId === cfg.defaultCategory);
    const existingDefault = groups.find((g) => g.id === cfg.defaultCategory);
    if (existingDefault) {
      existingDefault.repos = defaultRepos;
    }

    return groups.filter((g) => g.repos.length > 0);
  });

  readonly stats = computed((): GithubStats | null => {
    const user = this.userSignal();
    const repos = this.reposSignal();
    if (!user) return null;

    const langCounts = new Map<string, number>();
    for (const repo of repos) {
      if (repo.language) {
        langCounts.set(repo.language, (langCounts.get(repo.language) ?? 0) + 1);
      }
    }

    const topLanguages = [...langCounts.entries()]
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return {
      publicRepos: user.public_repos,
      followers: user.followers,
      following: user.following,
      topLanguages,
    };
  });

  load(): void {
    if (this.loadedSignal() || this.loadingSignal()) return;

    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    this.http.get<GithubConfig>('assets/data/github.config.json').subscribe({
      next: (config) => {
        this.configSignal.set(config);
        this.fetchGithubData(config);
      },
      error: () => {
        this.errorSignal.set('Failed to load GitHub configuration.');
        this.loadingSignal.set(false);
        this.loadedSignal.set(true);
      },
    });
  }

  private fetchGithubData(config: GithubConfig): void {
    const userUrl = `https://api.github.com/users/${config.username}`;
    const reposUrl = `https://api.github.com/users/${config.username}/repos?sort=updated&per_page=100`;

    forkJoin({
      user: this.http.get<GithubUser>(userUrl).pipe(catchError(() => of(null))),
      repos: this.http.get<GithubRepo[]>(reposUrl).pipe(catchError(() => of([] as GithubRepo[]))),
    }).subscribe({
      next: ({ user, repos }) => {
        if (user) this.userSignal.set(user);
        if (repos.length) this.reposSignal.set(repos);
        if (!user && !repos.length) {
          this.errorSignal.set('Unable to fetch GitHub data. Visit profile directly.');
        }
        this.loadingSignal.set(false);
        this.loadedSignal.set(true);
      },
      error: () => {
        this.errorSignal.set('Unable to fetch GitHub data. Visit profile directly.');
        this.loadingSignal.set(false);
        this.loadedSignal.set(true);
      },
    });
  }

  private resolveCategory(repo: GithubRepo, config: GithubConfig): string {
    const searchText = [
      repo.name,
      repo.description ?? '',
      repo.language ?? '',
      ...repo.topics,
    ]
      .join(' ')
      .toLowerCase();

    for (const cat of config.categories) {
      if (cat.keywords.some((kw) => searchText.includes(kw.toLowerCase()))) {
        return cat.id;
      }
    }

    return config.defaultCategory;
  }
}
