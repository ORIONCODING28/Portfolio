import { Routes } from '@angular/router';
import { authGuard, adminGuard, guestGuard } from '../../core/guards/auth.guard';

export const ADMIN_ROUTES: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./login/admin-login.component').then(m => m.AdminLoginComponent),
    canActivate: [guestGuard]
  },
  {
    path: '',
    loadComponent: () => import('./dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent),
    canActivate: [adminGuard]
  },
  {
    path: 'projects',
    loadComponent: () => import('./projects/projects-manager.component').then(m => m.ProjectsManagerComponent),
    canActivate: [adminGuard]
  },
  {
    path: 'skills',
    loadComponent: () => import('./skills/skills-manager.component').then(m => m.SkillsManagerComponent),
    canActivate: [adminGuard]
  },
  {
    path: 'testimonials',
    loadComponent: () => import('./testimonials/testimonials-manager.component').then(m => m.TestimonialsManagerComponent),
    canActivate: [adminGuard]
  },
  {
    path: 'experiences',
    loadComponent: () => import('./experiences/experiences-manager.component').then(m => m.ExperiencesManagerComponent),
    canActivate: [adminGuard]
  },
  {
    path: 'themes',
    loadComponent: () => import('./themes/themes-manager.component').then(m => m.ThemesManagerComponent),
    canActivate: [adminGuard]
  },
  {
    path: 'personal',
    loadComponent: () => import('./personal/personal-info.component').then(m => m.PersonalInfoComponent),
    canActivate: [adminGuard]
  },
  {
    path: 'settings',
    loadComponent: () => import('./settings/settings.component').then(m => m.SettingsComponent),
    canActivate: [adminGuard]
  }
];
