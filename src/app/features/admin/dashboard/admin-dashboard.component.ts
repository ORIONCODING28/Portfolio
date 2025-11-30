import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { AdminApiService } from '../services/admin-api.service';

interface DashboardStats {
  projects: number;
  skills: number;
  testimonials: number;
  experiences: number;
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="dashboard">
      <!-- Header -->
      <header class="dashboard-header">
        <div class="header-left">
          <h1>Dashboard</h1>
          <p>Benvenuto, {{ user()?.name || 'Admin' }}!</p>
        </div>
        <div class="header-right">
          <a routerLink="/" class="btn btn-secondary" target="_blank">
            👁️ Visualizza Portfolio
          </a>
          <button class="btn btn-ghost" (click)="logout()">
            🚪 Esci
          </button>
        </div>
      </header>

      <!-- Stats Grid -->
      <section class="stats-grid">
        <div class="stat-card" routerLink="/admin/projects">
          <div class="stat-icon">📁</div>
          <div class="stat-content">
            <span class="stat-value">{{ stats().projects }}</span>
            <span class="stat-label">Progetti</span>
          </div>
        </div>

        <div class="stat-card" routerLink="/admin/skills">
          <div class="stat-icon">⚡</div>
          <div class="stat-content">
            <span class="stat-value">{{ stats().skills }}</span>
            <span class="stat-label">Skills</span>
          </div>
        </div>

        <div class="stat-card" routerLink="/admin/testimonials">
          <div class="stat-icon">💬</div>
          <div class="stat-content">
            <span class="stat-value">{{ stats().testimonials }}</span>
            <span class="stat-label">Testimonianze</span>
          </div>
        </div>

        <div class="stat-card" routerLink="/admin/experiences">
          <div class="stat-icon">💼</div>
          <div class="stat-content">
            <span class="stat-value">{{ stats().experiences }}</span>
            <span class="stat-label">Esperienze</span>
          </div>
        </div>
      </section>

      <!-- Quick Actions -->
      <section class="quick-actions">
        <h2>Azioni Rapide</h2>
        <div class="actions-grid">
          <button class="action-card" routerLink="/admin/projects" [queryParams]="{action: 'new'}">
            <span class="action-icon">➕</span>
            <span class="action-label">Nuovo Progetto</span>
          </button>
          <button class="action-card" routerLink="/admin/skills" [queryParams]="{action: 'new'}">
            <span class="action-icon">🎯</span>
            <span class="action-label">Nuova Skill</span>
          </button>
          <button class="action-card" routerLink="/admin/themes">
            <span class="action-icon">🎨</span>
            <span class="action-label">Gestisci Temi</span>
          </button>
          <button class="action-card" routerLink="/admin/settings">
            <span class="action-icon">⚙️</span>
            <span class="action-label">Impostazioni</span>
          </button>
        </div>
      </section>

      <!-- Navigation Menu -->
      <nav class="admin-nav">
        <h2>Gestione Contenuti</h2>
        <ul class="nav-list">
          <li>
            <a routerLink="/admin/projects" routerLinkActive="active">
              <span class="nav-icon">📁</span>
              <span class="nav-text">Progetti</span>
              <span class="nav-arrow">→</span>
            </a>
          </li>
          <li>
            <a routerLink="/admin/skills" routerLinkActive="active">
              <span class="nav-icon">⚡</span>
              <span class="nav-text">Skills</span>
              <span class="nav-arrow">→</span>
            </a>
          </li>
          <li>
            <a routerLink="/admin/testimonials" routerLinkActive="active">
              <span class="nav-icon">💬</span>
              <span class="nav-text">Testimonianze</span>
              <span class="nav-arrow">→</span>
            </a>
          </li>
          <li>
            <a routerLink="/admin/experiences" routerLinkActive="active">
              <span class="nav-icon">💼</span>
              <span class="nav-text">Esperienze</span>
              <span class="nav-arrow">→</span>
            </a>
          </li>
          <li>
            <a routerLink="/admin/themes" routerLinkActive="active">
              <span class="nav-icon">🎨</span>
              <span class="nav-text">Temi & Palette</span>
              <span class="nav-arrow">→</span>
            </a>
          </li>
          <li>
            <a routerLink="/admin/personal" routerLinkActive="active">
              <span class="nav-icon">👤</span>
              <span class="nav-text">Info Personali</span>
              <span class="nav-arrow">→</span>
            </a>
          </li>
          <li>
            <a routerLink="/admin/settings" routerLinkActive="active">
              <span class="nav-icon">⚙️</span>
              <span class="nav-text">Impostazioni</span>
              <span class="nav-arrow">→</span>
            </a>
          </li>
        </ul>
      </nav>
    </div>
  `,
  styles: [`
    .dashboard {
      min-height: 100vh;
      background: var(--bg-primary);
      padding: 2rem;
      max-width: 1400px;
      margin: 0 auto;
    }

    .dashboard-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      flex-wrap: wrap;
      gap: 1rem;
    }

    .header-left h1 {
      font-size: 2rem;
      color: var(--text-primary);
      margin: 0;
    }

    .header-left p {
      color: var(--text-secondary);
      margin: 0.25rem 0 0;
    }

    .header-right {
      display: flex;
      gap: 0.75rem;
    }

    .btn {
      padding: 0.75rem 1.25rem;
      border-radius: 12px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      border: none;
    }

    .btn-secondary {
      background: var(--glass-bg);
      color: var(--text-primary);
      border: 1px solid var(--glass-border);
    }

    .btn-secondary:hover {
      background: var(--card-hover);
    }

    .btn-ghost {
      background: transparent;
      color: var(--text-secondary);
    }

    .btn-ghost:hover {
      color: var(--accent-primary);
    }

    /* Stats Grid */
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2.5rem;
    }

    .stat-card {
      background: var(--glass-bg);
      border: 1px solid var(--glass-border);
      border-radius: 16px;
      padding: 1.5rem;
      display: flex;
      align-items: center;
      gap: 1rem;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .stat-card:hover {
      transform: translateY(-4px);
      border-color: var(--accent-primary);
      box-shadow: 0 10px 30px -10px var(--accent-glow);
    }

    .stat-icon {
      font-size: 2.5rem;
    }

    .stat-content {
      display: flex;
      flex-direction: column;
    }

    .stat-value {
      font-size: 2rem;
      font-weight: 700;
      color: var(--text-primary);
    }

    .stat-label {
      color: var(--text-secondary);
      font-size: 0.875rem;
    }

    /* Quick Actions */
    .quick-actions {
      margin-bottom: 2.5rem;
    }

    .quick-actions h2,
    .admin-nav h2 {
      font-size: 1.25rem;
      color: var(--text-primary);
      margin-bottom: 1rem;
    }

    .actions-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 1rem;
    }

    .action-card {
      background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
      border: none;
      border-radius: 12px;
      padding: 1.25rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
      cursor: pointer;
      transition: all 0.3s ease;
      color: white;
    }

    .action-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 30px -5px var(--accent-glow);
    }

    .action-icon {
      font-size: 1.5rem;
    }

    .action-label {
      font-weight: 500;
      font-size: 0.875rem;
    }

    /* Navigation */
    .admin-nav {
      background: var(--glass-bg);
      border: 1px solid var(--glass-border);
      border-radius: 16px;
      padding: 1.5rem;
    }

    .nav-list {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .nav-list li a {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
      border-radius: 12px;
      color: var(--text-primary);
      text-decoration: none;
      transition: all 0.2s ease;
    }

    .nav-list li a:hover,
    .nav-list li a.active {
      background: var(--card-hover);
    }

    .nav-list li a.active {
      border-left: 3px solid var(--accent-primary);
    }

    .nav-icon {
      font-size: 1.25rem;
    }

    .nav-text {
      flex: 1;
      font-weight: 500;
    }

    .nav-arrow {
      color: var(--text-muted);
      transition: transform 0.2s ease;
    }

    .nav-list li a:hover .nav-arrow {
      transform: translateX(4px);
      color: var(--accent-primary);
    }

    @media (max-width: 768px) {
      .dashboard {
        padding: 1rem;
      }

      .dashboard-header {
        flex-direction: column;
        align-items: flex-start;
      }

      .header-right {
        width: 100%;
      }

      .stats-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }
  `]
})
export class AdminDashboardComponent implements OnInit {
  stats = signal<DashboardStats>({
    projects: 0,
    skills: 0,
    testimonials: 0,
    experiences: 0
  });

  constructor(
    public authService: AuthService,
    private adminApi: AdminApiService,
    private router: Router
  ) {}

  get user() {
    return this.authService.user;
  }

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {
    // Load counts from API
    this.adminApi.getProjects().subscribe(data => {
      this.stats.update(s => ({ ...s, projects: data.length }));
    });
    
    this.adminApi.getSkills().subscribe(data => {
      this.stats.update(s => ({ ...s, skills: data.length }));
    });
    
    this.adminApi.getTestimonials().subscribe(data => {
      this.stats.update(s => ({ ...s, testimonials: data.length }));
    });
    
    this.adminApi.getExperiences().subscribe(data => {
      this.stats.update(s => ({ ...s, experiences: data.length }));
    });
  }

  logout(): void {
    this.authService.logout().subscribe(() => {
      this.router.navigate(['/admin/login']);
    });
  }
}
