import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home.page').then((m) => m.HomePage),
    title: 'Umesh Waghmare | Full Stack .NET Developer',
  },
  {
    path: 'resume',
    loadComponent: () => import('./features/resume/resume.page').then((m) => m.ResumePage),
    title: 'Resume | Umesh Waghmare',
  },
  {
    path: 'projects/:slug',
    loadComponent: () =>
      import('./features/project-detail/project-detail.page').then((m) => m.ProjectDetailPage),
    title: 'Project | Umesh Waghmare',
  },
  {
    path: '**',
    redirectTo: '',
  },
];
