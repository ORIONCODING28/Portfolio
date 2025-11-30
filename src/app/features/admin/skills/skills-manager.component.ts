import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { AdminApiService, Skill } from '../services/admin-api.service';

@Component({
  selector: 'app-skills-manager',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="manager-container">
      <header class="manager-header">
        <div class="header-left">
          <a routerLink="/admin" class="back-btn">← Dashboard</a>
          <h1>Gestione Skills</h1>
        </div>
        <button class="btn btn-primary" (click)="openModal()">
          ➕ Nuova Skill
        </button>
      </header>

      @if (isLoading()) {
        <div class="loading">
          <div class="spinner"></div>
          <p>Caricamento...</p>
        </div>
      } @else {
        <!-- Category filters -->
        <div class="category-tabs">
          <button 
            class="tab" 
            [class.active]="selectedCategory() === 'all'"
            (click)="selectedCategory.set('all')"
          >
            Tutte ({{ skills().length }})
          </button>
          @for (cat of categories(); track cat) {
            <button 
              class="tab" 
              [class.active]="selectedCategory() === cat"
              (click)="selectedCategory.set(cat)"
            >
              {{ cat }} ({{ getSkillsByCategory(cat).length }})
            </button>
          }
        </div>

        <div class="skills-grid">
          @for (skill of filteredSkills(); track skill.id) {
            <div class="skill-card">
              <div class="skill-header">
                <span class="skill-icon">{{ skill.icon || '⚡' }}</span>
                <div class="skill-actions">
                  <button class="action-btn" (click)="editSkill(skill)" title="Modifica">✏️</button>
                  <button class="action-btn delete" (click)="deleteSkill(skill)" title="Elimina">🗑️</button>
                </div>
              </div>
              
              <h3>{{ skill.name }}</h3>
              <span class="skill-category">{{ skill.category }}</span>
              
              <div class="skill-level">
                <div class="level-bar">
                  <div class="level-fill" [style.width.%]="skill.level"></div>
                </div>
                <span class="level-text">{{ skill.level }}%</span>
              </div>

              @if (skill.description) {
                <p class="skill-description">{{ skill.description }}</p>
              }
            </div>
          } @empty {
            <div class="empty-state">
              <span class="empty-icon">⚡</span>
              <h3>Nessuna skill</h3>
              <p>Inizia aggiungendo le tue competenze</p>
              <button class="btn btn-primary" (click)="openModal()">
                ➕ Aggiungi Skill
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
              <h2>{{ editingSkill() ? 'Modifica Skill' : 'Nuova Skill' }}</h2>
              <button class="close-btn" (click)="closeModal()">✕</button>
            </header>

            <form (ngSubmit)="saveSkill()" class="modal-body">
              <div class="form-grid">
                <div class="form-group">
                  <label>Nome *</label>
                  <input type="text" [(ngModel)]="form.name" name="name" required placeholder="Angular">
                </div>

                <div class="form-group">
                  <label>Categoria *</label>
                  <input type="text" [(ngModel)]="form.category" name="category" required 
                         placeholder="Frontend" list="categories-list">
                  <datalist id="categories-list">
                    @for (cat of categories(); track cat) {
                      <option [value]="cat">{{ cat }}</option>
                    }
                  </datalist>
                </div>

                <div class="form-group">
                  <label>Livello ({{ form.level }}%)</label>
                  <input type="range" [(ngModel)]="form.level" name="level" min="0" max="100" step="5">
                </div>

                <div class="form-group">
                  <label>Icona (emoji)</label>
                  <input type="text" [(ngModel)]="form.icon" name="icon" placeholder="🅰️">
                </div>

                <div class="form-group">
                  <label>Ordine</label>
                  <input type="number" [(ngModel)]="form.sort_order" name="sort_order">
                </div>

                <div class="form-group full-width">
                  <label>Descrizione</label>
                  <textarea [(ngModel)]="form.description" name="description" rows="3" 
                            placeholder="Breve descrizione della competenza..."></textarea>
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
                  {{ editingSkill() ? 'Salva Modifiche' : 'Crea Skill' }}
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

    /* Category Tabs */
    .category-tabs {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin-bottom: 1.5rem;
    }

    .tab {
      padding: 0.5rem 1rem;
      background: var(--glass-bg);
      border: 1px solid var(--glass-border);
      border-radius: 20px;
      color: var(--text-secondary);
      font-size: 0.875rem;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .tab:hover {
      border-color: var(--accent-primary);
    }

    .tab.active {
      background: var(--accent-primary);
      border-color: var(--accent-primary);
      color: white;
    }

    /* Skills Grid */
    .skills-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 1.5rem;
    }

    .skill-card {
      background: var(--glass-bg);
      border: 1px solid var(--glass-border);
      border-radius: 16px;
      padding: 1.5rem;
      transition: all 0.2s ease;
    }

    .skill-card:hover {
      border-color: var(--accent-primary);
      transform: translateY(-2px);
    }

    .skill-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 1rem;
    }

    .skill-icon {
      font-size: 2rem;
    }

    .skill-actions {
      display: flex;
      gap: 0.25rem;
    }

    .action-btn {
      width: 32px;
      height: 32px;
      border: none;
      border-radius: 8px;
      background: var(--bg-secondary);
      cursor: pointer;
      font-size: 0.875rem;
      transition: all 0.2s ease;
    }

    .action-btn:hover {
      transform: scale(1.1);
      background: var(--accent-primary);
    }

    .action-btn.delete:hover {
      background: #ef4444;
    }

    .skill-card h3 {
      margin: 0 0 0.25rem;
      color: var(--text-primary);
      font-size: 1.1rem;
    }

    .skill-category {
      color: var(--accent-primary);
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .skill-level {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-top: 1rem;
    }

    .level-bar {
      flex: 1;
      height: 6px;
      background: var(--bg-secondary);
      border-radius: 3px;
      overflow: hidden;
    }

    .level-fill {
      height: 100%;
      background: linear-gradient(90deg, var(--accent-primary), var(--accent-secondary));
      border-radius: 3px;
      transition: width 0.3s ease;
    }

    .level-text {
      color: var(--text-secondary);
      font-size: 0.875rem;
      min-width: 40px;
    }

    .skill-description {
      margin: 1rem 0 0;
      color: var(--text-secondary);
      font-size: 0.875rem;
      line-height: 1.5;
    }

    .empty-state {
      grid-column: 1 / -1;
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
      max-width: 500px;
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

    .form-group input[type="range"] {
      padding: 0;
      cursor: pointer;
    }

    .form-group input:focus,
    .form-group textarea:focus {
      outline: none;
      border-color: var(--accent-primary);
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

    @media (max-width: 600px) {
      .form-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class SkillsManagerComponent implements OnInit {
  skills = signal<Skill[]>([]);
  isLoading = signal(true);
  showModal = signal(false);
  isSaving = signal(false);
  editingSkill = signal<Skill | null>(null);
  selectedCategory = signal<string>('all');

  form: Partial<Skill> = this.getEmptyForm();

  categories = signal<string[]>([]);

  constructor(
    private adminApi: AdminApiService,
    private route: ActivatedRoute
  ) {}

  get filteredSkills(): () => Skill[] {
    return () => {
      const cat = this.selectedCategory();
      if (cat === 'all') return this.skills();
      return this.skills().filter(s => s.category === cat);
    };
  }

  ngOnInit(): void {
    this.loadSkills();
    
    this.route.queryParams.subscribe(params => {
      if (params['action'] === 'new') {
        this.openModal();
      }
    });
  }

  loadSkills(): void {
    this.isLoading.set(true);
    this.adminApi.getSkills().subscribe({
      next: (skills) => {
        this.skills.set(skills);
        const cats = [...new Set(skills.map(s => s.category))];
        this.categories.set(cats);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      }
    });
  }

  getSkillsByCategory(category: string): Skill[] {
    return this.skills().filter(s => s.category === category);
  }

  getEmptyForm(): Partial<Skill> {
    return {
      name: '',
      category: '',
      level: 80,
      icon: '',
      description: '',
      sort_order: 0
    };
  }

  openModal(skill?: Skill): void {
    if (skill) {
      this.editingSkill.set(skill);
      this.form = { ...skill };
    } else {
      this.editingSkill.set(null);
      this.form = this.getEmptyForm();
    }
    this.showModal.set(true);
  }

  closeModal(): void {
    this.showModal.set(false);
    this.editingSkill.set(null);
  }

  editSkill(skill: Skill): void {
    this.openModal(skill);
  }

  saveSkill(): void {
    this.isSaving.set(true);

    const request = this.editingSkill()
      ? this.adminApi.updateSkill(this.editingSkill()!.id, this.form)
      : this.adminApi.createSkill(this.form);

    request.subscribe({
      next: () => {
        this.isSaving.set(false);
        this.closeModal();
        this.loadSkills();
      },
      error: () => {
        this.isSaving.set(false);
      }
    });
  }

  deleteSkill(skill: Skill): void {
    if (confirm(`Sei sicuro di voler eliminare "${skill.name}"?`)) {
      this.adminApi.deleteSkill(skill.id).subscribe({
        next: () => {
          this.skills.update(skills => 
            skills.filter(s => s.id !== skill.id)
          );
        }
      });
    }
  }
}
