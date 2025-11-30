import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { AdminApiService, Project } from '../services/admin-api.service';

@Component({
  selector: 'app-projects-manager',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="manager-container">
      <header class="manager-header">
        <div class="header-left">
          <a routerLink="/admin" class="back-btn">← Dashboard</a>
          <h1>Gestione Progetti</h1>
        </div>
        <button class="btn btn-primary" (click)="openModal()">
          ➕ Nuovo Progetto
        </button>
      </header>

      @if (isLoading()) {
        <div class="loading">
          <div class="spinner"></div>
          <p>Caricamento...</p>
        </div>
      } @else {
        <div class="projects-list">
          @for (project of projects(); track project.id) {
            <div class="project-card" [class.unpublished]="!project.published">
              <div class="project-image">
                @if (project.image_url) {
                  <img [src]="project.image_url" [alt]="project.title">
                } @else {
                  <div class="placeholder">📁</div>
                }
              </div>
              
              <div class="project-content">
                <div class="project-meta">
                  @if (project.featured) {
                    <span class="badge featured">⭐ Featured</span>
                  }
                  @if (!project.published) {
                    <span class="badge draft">Bozza</span>
                  }
                </div>
                
                <h3>{{ project.title }}</h3>
                <p>{{ project.short_description || project.description | slice:0:120 }}...</p>
                
                <div class="technologies">
                  @for (tech of project.technologies.slice(0, 4); track tech) {
                    <span class="tech-tag">{{ tech }}</span>
                  }
                  @if (project.technologies.length > 4) {
                    <span class="tech-more">+{{ project.technologies.length - 4 }}</span>
                  }
                </div>
              </div>
              
              <div class="project-actions">
                <button class="action-btn edit" (click)="editProject(project)" title="Modifica">
                  ✏️
                </button>
                <button class="action-btn" (click)="togglePublish(project)" [title]="project.published ? 'Nascondi' : 'Pubblica'">
                  {{ project.published ? '👁️' : '👁️‍🗨️' }}
                </button>
                <button class="action-btn delete" (click)="deleteProject(project)" title="Elimina">
                  🗑️
                </button>
              </div>
            </div>
          } @empty {
            <div class="empty-state">
              <span class="empty-icon">📁</span>
              <h3>Nessun progetto</h3>
              <p>Inizia aggiungendo il tuo primo progetto</p>
              <button class="btn btn-primary" (click)="openModal()">
                ➕ Aggiungi Progetto
              </button>
            </div>
          }
        </div>
      }

      <!-- Modal -->
      @if (showModal()) {
        <div class="modal-overlay" (click)="closeModal()">
          <div class="modal" (click)="$event.stopPropagation()">
            <header class="modal-header">
              <h2>{{ editingProject() ? 'Modifica Progetto' : 'Nuovo Progetto' }}</h2>
              <button class="close-btn" (click)="closeModal()">✕</button>
            </header>

            <form (ngSubmit)="saveProject()" class="modal-body">
              <div class="form-grid">
                <div class="form-group full-width">
                  <label>Titolo *</label>
                  <input type="text" [(ngModel)]="form.title" name="title" required>
                </div>

                <div class="form-group full-width">
                  <label>Descrizione breve</label>
                  <input type="text" [(ngModel)]="form.short_description" name="short_description">
                </div>

                <div class="form-group full-width">
                  <label>Descrizione completa *</label>
                  <textarea [(ngModel)]="form.description" name="description" rows="4" required></textarea>
                </div>

                <div class="form-group">
                  <label>URL Immagine</label>
                  <input type="url" [(ngModel)]="form.image_url" name="image_url">
                </div>

                <div class="form-group">
                  <label>URL Live Demo</label>
                  <input type="url" [(ngModel)]="form.live_url" name="live_url">
                </div>

                <div class="form-group">
                  <label>URL GitHub</label>
                  <input type="url" [(ngModel)]="form.github_url" name="github_url">
                </div>

                <div class="form-group">
                  <label>Ordine</label>
                  <input type="number" [(ngModel)]="form.sort_order" name="sort_order">
                </div>

                <div class="form-group full-width">
                  <label>Tecnologie (separate da virgola)</label>
                  <input type="text" [(ngModel)]="technologiesInput" name="technologies" 
                         placeholder="Angular, TypeScript, SCSS">
                </div>

                <div class="form-group full-width">
                  <label>Categorie (separate da virgola)</label>
                  <input type="text" [(ngModel)]="categoriesInput" name="categories"
                         placeholder="Web App, Frontend">
                </div>

                <div class="form-group checkbox-group">
                  <label class="checkbox-label">
                    <input type="checkbox" [(ngModel)]="form.featured" name="featured">
                    <span>Progetto in evidenza</span>
                  </label>
                </div>

                <div class="form-group checkbox-group">
                  <label class="checkbox-label">
                    <input type="checkbox" [(ngModel)]="form.published" name="published">
                    <span>Pubblicato</span>
                  </label>
                </div>
              </div>

              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" (click)="closeModal()">
                  Annulla
                </button>
                <button type="submit" class="btn btn-primary" [disabled]="isSaving()">
                  @if (isSaving()) {
                    <span class="spinner-small"></span>
                  }
                  {{ editingProject() ? 'Salva Modifiche' : 'Crea Progetto' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .manager-container {
      min-height: 100vh;
      background: var(--bg-primary);
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    .manager-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      flex-wrap: wrap;
      gap: 1rem;
    }

    .header-left {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .back-btn {
      color: var(--text-secondary);
      text-decoration: none;
      font-size: 0.875rem;
      transition: color 0.2s;
    }

    .back-btn:hover {
      color: var(--accent-primary);
    }

    .manager-header h1 {
      font-size: 1.75rem;
      color: var(--text-primary);
      margin: 0;
    }

    .btn {
      padding: 0.75rem 1.5rem;
      border-radius: 12px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
      border: none;
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
    }

    .btn-primary {
      background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
      color: white;
    }

    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 30px -5px var(--accent-glow);
    }

    .btn-secondary {
      background: var(--glass-bg);
      color: var(--text-primary);
      border: 1px solid var(--glass-border);
    }

    .loading {
      text-align: center;
      padding: 4rem;
    }

    .spinner {
      width: 40px;
      height: 40px;
      border: 3px solid var(--glass-border);
      border-top-color: var(--accent-primary);
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
      margin: 0 auto 1rem;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .projects-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .project-card {
      display: grid;
      grid-template-columns: 120px 1fr auto;
      gap: 1.5rem;
      background: var(--glass-bg);
      border: 1px solid var(--glass-border);
      border-radius: 16px;
      padding: 1.25rem;
      transition: all 0.2s ease;
    }

    .project-card:hover {
      border-color: var(--accent-primary);
    }

    .project-card.unpublished {
      opacity: 0.7;
    }

    .project-image {
      width: 120px;
      height: 80px;
      border-radius: 8px;
      overflow: hidden;
      background: var(--bg-secondary);
    }

    .project-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .project-image .placeholder {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 2rem;
    }

    .project-content {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .project-meta {
      display: flex;
      gap: 0.5rem;
    }

    .badge {
      padding: 0.25rem 0.5rem;
      border-radius: 6px;
      font-size: 0.75rem;
      font-weight: 500;
    }

    .badge.featured {
      background: rgba(251, 191, 36, 0.15);
      color: #fbbf24;
    }

    .badge.draft {
      background: rgba(156, 163, 175, 0.15);
      color: #9ca3af;
    }

    .project-content h3 {
      margin: 0;
      color: var(--text-primary);
      font-size: 1.1rem;
    }

    .project-content p {
      margin: 0;
      color: var(--text-secondary);
      font-size: 0.875rem;
      line-height: 1.5;
    }

    .technologies {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin-top: 0.5rem;
    }

    .tech-tag {
      padding: 0.25rem 0.5rem;
      background: var(--bg-secondary);
      border-radius: 6px;
      font-size: 0.75rem;
      color: var(--accent-primary);
    }

    .tech-more {
      padding: 0.25rem 0.5rem;
      font-size: 0.75rem;
      color: var(--text-muted);
    }

    .project-actions {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .action-btn {
      width: 40px;
      height: 40px;
      border: none;
      border-radius: 10px;
      background: var(--bg-secondary);
      cursor: pointer;
      font-size: 1rem;
      transition: all 0.2s ease;
    }

    .action-btn:hover {
      transform: scale(1.1);
    }

    .action-btn.edit:hover {
      background: var(--accent-primary);
    }

    .action-btn.delete:hover {
      background: #ef4444;
    }

    .empty-state {
      text-align: center;
      padding: 4rem 2rem;
      background: var(--glass-bg);
      border: 1px dashed var(--glass-border);
      border-radius: 16px;
    }

    .empty-icon {
      font-size: 4rem;
      display: block;
      margin-bottom: 1rem;
    }

    .empty-state h3 {
      color: var(--text-primary);
      margin: 0 0 0.5rem;
    }

    .empty-state p {
      color: var(--text-secondary);
      margin: 0 0 1.5rem;
    }

    /* Modal */
    .modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.7);
      backdrop-filter: blur(4px);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem;
      z-index: 1000;
    }

    .modal {
      width: 100%;
      max-width: 700px;
      max-height: 90vh;
      overflow-y: auto;
      background: var(--bg-primary);
      border: 1px solid var(--glass-border);
      border-radius: 20px;
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.5rem;
      border-bottom: 1px solid var(--glass-border);
    }

    .modal-header h2 {
      margin: 0;
      color: var(--text-primary);
    }

    .close-btn {
      width: 36px;
      height: 36px;
      border: none;
      border-radius: 10px;
      background: var(--glass-bg);
      cursor: pointer;
      font-size: 1rem;
    }

    .modal-body {
      padding: 1.5rem;
    }

    .form-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .form-group.full-width {
      grid-column: 1 / -1;
    }

    .form-group label {
      color: var(--text-secondary);
      font-size: 0.875rem;
      font-weight: 500;
    }

    .form-group input,
    .form-group textarea {
      padding: 0.75rem 1rem;
      background: var(--input-bg);
      border: 1px solid var(--input-border);
      border-radius: 10px;
      color: var(--text-primary);
      font-size: 0.95rem;
    }

    .form-group input:focus,
    .form-group textarea:focus {
      outline: none;
      border-color: var(--accent-primary);
    }

    .checkbox-group {
      flex-direction: row;
      align-items: center;
    }

    .checkbox-label {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      cursor: pointer;
    }

    .checkbox-label input[type="checkbox"] {
      width: 20px;
      height: 20px;
      cursor: pointer;
    }

    .modal-footer {
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
      padding-top: 1.5rem;
      border-top: 1px solid var(--glass-border);
      margin-top: 1.5rem;
    }

    .spinner-small {
      width: 16px;
      height: 16px;
      border: 2px solid transparent;
      border-top-color: white;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    @media (max-width: 768px) {
      .project-card {
        grid-template-columns: 1fr;
      }

      .project-image {
        width: 100%;
        height: 160px;
      }

      .project-actions {
        flex-direction: row;
      }

      .form-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class ProjectsManagerComponent implements OnInit {
  projects = signal<Project[]>([]);
  isLoading = signal(true);
  showModal = signal(false);
  isSaving = signal(false);
  editingProject = signal<Project | null>(null);

  form: Partial<Project> = this.getEmptyForm();
  technologiesInput = '';
  categoriesInput = '';

  constructor(
    private adminApi: AdminApiService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loadProjects();
    
    // Check if we should open modal for new project
    this.route.queryParams.subscribe(params => {
      if (params['action'] === 'new') {
        this.openModal();
      }
    });
  }

  loadProjects(): void {
    this.isLoading.set(true);
    this.adminApi.getProjects().subscribe({
      next: (projects) => {
        this.projects.set(projects);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      }
    });
  }

  getEmptyForm(): Partial<Project> {
    return {
      title: '',
      short_description: '',
      description: '',
      image_url: '',
      live_url: '',
      github_url: '',
      technologies: [],
      categories: [],
      highlights: [],
      featured: false,
      published: true,
      sort_order: 0
    };
  }

  openModal(project?: Project): void {
    if (project) {
      this.editingProject.set(project);
      this.form = { ...project };
      this.technologiesInput = project.technologies?.join(', ') || '';
      this.categoriesInput = project.categories?.join(', ') || '';
    } else {
      this.editingProject.set(null);
      this.form = this.getEmptyForm();
      this.technologiesInput = '';
      this.categoriesInput = '';
    }
    this.showModal.set(true);
  }

  closeModal(): void {
    this.showModal.set(false);
    this.editingProject.set(null);
  }

  editProject(project: Project): void {
    this.openModal(project);
  }

  saveProject(): void {
    // Parse comma-separated inputs
    this.form.technologies = this.technologiesInput.split(',').map(t => t.trim()).filter(t => t);
    this.form.categories = this.categoriesInput.split(',').map(c => c.trim()).filter(c => c);

    this.isSaving.set(true);

    const request = this.editingProject()
      ? this.adminApi.updateProject(this.editingProject()!.id, this.form)
      : this.adminApi.createProject(this.form);

    request.subscribe({
      next: () => {
        this.isSaving.set(false);
        this.closeModal();
        this.loadProjects();
      },
      error: () => {
        this.isSaving.set(false);
      }
    });
  }

  togglePublish(project: Project): void {
    this.adminApi.updateProject(project.id, { published: !project.published }).subscribe({
      next: (updated) => {
        this.projects.update(projects => 
          projects.map(p => p.id === project.id ? updated : p)
        );
      }
    });
  }

  deleteProject(project: Project): void {
    if (confirm(`Sei sicuro di voler eliminare "${project.title}"?`)) {
      this.adminApi.deleteProject(project.id).subscribe({
        next: () => {
          this.projects.update(projects => 
            projects.filter(p => p.id !== project.id)
          );
        }
      });
    }
  }
}
