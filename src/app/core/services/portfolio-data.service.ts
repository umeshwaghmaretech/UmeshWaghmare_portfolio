import { Injectable, inject, computed, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, catchError, of } from 'rxjs';
import {
  Certification,
  ExperienceItem,
  Profile,
  Project,
  SkillCategory,
} from '../models/portfolio.models';

interface PortfolioData {
  profile: Profile;
  experience: ExperienceItem[];
  skills: SkillCategory[];
  projects: Project[];
  certifications: Certification[];
}

@Injectable({ providedIn: 'root' })
export class PortfolioDataService {
  private readonly http = inject(HttpClient);

  private readonly dataSignal = signal<PortfolioData | null>(null);
  private readonly loadingSignal = signal(true);

  constructor() {
    forkJoin({
      profile: this.http.get<Profile>('assets/data/profile.json'),
      experience: this.http.get<ExperienceItem[]>('assets/data/experience.json'),
      skills: this.http.get<SkillCategory[]>('assets/data/skills.json'),
      projects: this.http.get<Project[]>('assets/data/projects.json'),
      certifications: this.http.get<Certification[]>('assets/data/certifications.json'),
    })
      .pipe(catchError(() => of(null)))
      .subscribe((data) => {
        this.dataSignal.set(data);
        this.loadingSignal.set(false);
      });
  }

  readonly loading = computed(() => this.loadingSignal());
  readonly profile = computed(() => this.dataSignal()?.profile ?? null);
  readonly experiences = computed(() => this.dataSignal()?.experience ?? []);
  readonly skillCategories = computed(() => this.dataSignal()?.skills ?? []);
  readonly projects = computed(() => this.dataSignal()?.projects ?? []);
  readonly certifications = computed(() => this.dataSignal()?.certifications ?? []);

  readonly featuredProjects = computed(() =>
    this.projects().filter((p: Project) => p.featured),
  );

  readonly allSkills = computed(() =>
    this.skillCategories().flatMap((cat: SkillCategory) =>
      cat.skills.map((s) => ({ ...s, category: cat.name })),
    ),
  );

  getProjectBySlug(slug: string): Project | undefined {
    return this.projects().find((p: Project) => p.slug === slug);
  }
}
