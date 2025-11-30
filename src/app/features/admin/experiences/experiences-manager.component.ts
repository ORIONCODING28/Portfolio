import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AdminApiService, Experience } from '../services/admin-api.service';

@Component({
  selector: 'app-experiences-manager',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="manager-container">
      <header class="manager-header">
        <div class="header-left">
          <a routerLink="/admin" class="back-btn">← Dashboard</a>
          <h1>Gestione Esperienze</h1>
        </div>
        <button class="btn btn-primary" (click)="openModal()">
          ➕ Nuova Esperienza
        </button>
      </header>

      @if (isLoading()) {
        <div class="loading">
          <div class="spinner"></div>
          <p>Caricamento...</p>
        </div>
      } @else {
        <div class="timeline">
          @for (exp of experiences(); track exp.id) {
            <div class="timeline-item" [class.current]="exp.is_current">
              <div class="timeline-marker">
                <span class="type-icon">
                  {{ exp.type === 'work' ? '💼' : exp.type === 'education' ? '🎓' : exp.type === 'freelance' ? '🚀' : '📌' }}
                </span>
              </div>
              
              <div class="timeline-content">
                <div class="timeline-header">
                  <div class="info">
                    <h3>{{ exp.title }}</h3>
                    <span class="company">{{ exp.company }}</span>
                    @if (exp.location) {
                      <span class="location">📍 {{ exp.location }}</span>
                    }
                  </div>
                  <div class="actions">
                    <button class="action-btn" (click)="editExperience(exp)">✏️</button>
                    <button class="action-btn delete" (click)="deleteExperience(exp)">🗑️</button>
                  </div>
                </div>

                <div class="date-range">
                  {{ formatDate(exp.start_date) }} - {{ exp.is_current ? 'Presente' : formatDate(exp.end_date) }}
                  @if (exp.is_current) {
                    <span class="current-badge">Attuale</span>
                  }
                </div>

                @if (exp.description) {
                  <p class="description">{{ exp.description }}</p>
                }

                @if (exp.technologies.length) {
                  <div class="technologies">
                    @for (tech of exp.technologies; track tech) {
                      <span class="tech-tag">{{ tech }}</span>
                    }
                  </div>
                }
              </div>
            </div>
          } @empty {
            <div class="empty-state">
              <span class="empty-icon">💼</span>
              <h3>Nessuna esperienza</h3>
              <p>Aggiungi le tue esperienze lavorative</p>
              <button class="btn btn-primary" (click)="openModal()">➕ Aggiungi</button>
            </div>
          }
        </div>
      }

      @if (showModal()) {
        <div class="modal-overlay" (click)="closeModal()">
          <div class="modal" (click)="$event.stopPropagation()">
            <header class="modal-header">
              <h2>{{ editingItem() ? 'Modifica' : 'Nuova' }} Esperienza</h2>
              <button class="close-btn" (click)="closeModal()">✕</button>
            </header>

            <form (ngSubmit)="save()" class="modal-body">
              <div class="form-grid">
                <div class="form-group full-width">
                  <label>Titolo/Ruolo *</label>
                  <input type="text" [(ngModel)]="form.title" name="title" required placeholder="Senior Developer">
                </div>
                <div class="form-group">
                  <label>Azienda</label>
                  <input type="text" [(ngModel)]="form.company" name="company">
                </div>
                <div class="form-group">
                  <label>Località</label>
                  <input type="text" [(ngModel)]="form.location" name="location" placeholder="Milano, IT">
                </div>
                <div class="form-group">
                  <label>Tipo</label>
                  <select [(ngModel)]="form.type" name="type">
                    <option value="work">Lavoro</option>
                    <option value="education">Formazione</option>
                    <option value="freelance">Freelance</option>
                    <option value="other">Altro</option>
                  </select>
                </div>
                <div class="form-group checkbox-group">
                  <label class="checkbox-label">
                    <input type="checkbox" [(ngModel)]="form.is_current" name="is_current">
                    <span>Posizione attuale</span>
                  </label>
                </div>
                <div class="form-group">
                  <label>Data Inizio</label>
                  <input type="date" [(ngModel)]="form.start_date" name="start_date">
                </div>
                <div class="form-group">
                  <label>Data Fine</label>
                  <input type="date" [(ngModel)]="form.end_date" name="end_date" [disabled]="!!form.is_current">
                </div>
                <div class="form-group full-width">
                  <label>Descrizione</label>
                  <textarea [(ngModel)]="form.description" name="description" rows="4"></textarea>
                </div>
                <div class="form-group full-width">
                  <label>Tecnologie (separate da virgola)</label>
                  <input type="text" [(ngModel)]="techInput" name="technologies" placeholder="Angular, TypeScript, Node.js">
                </div>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" (click)="closeModal()">Annulla</button>
                <button type="submit" class="btn btn-primary" [disabled]="isSaving()">
                  {{ editingItem() ? 'Salva' : 'Crea' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .manager-container { min-height: 100vh; background: var(--bg-primary); padding: 2rem; max-width: 900px; margin: 0 auto; }
    .manager-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; flex-wrap: wrap; gap: 1rem; }
    .header-left { display: flex; flex-direction: column; gap: 0.5rem; }
    .back-btn { color: var(--text-secondary); text-decoration: none; font-size: 0.875rem; }
    .back-btn:hover { color: var(--accent-primary); }
    .manager-header h1 { font-size: 1.75rem; color: var(--text-primary); margin: 0; }
    .btn { padding: 0.75rem 1.5rem; border-radius: 12px; font-weight: 500; cursor: pointer; border: none; display: inline-flex; align-items: center; gap: 0.5rem; }
    .btn-primary { background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary)); color: white; }
    .btn-secondary { background: var(--glass-bg); color: var(--text-primary); border: 1px solid var(--glass-border); }
    .loading { text-align: center; padding: 4rem; }
    .spinner { width: 40px; height: 40px; border: 3px solid var(--glass-border); border-top-color: var(--accent-primary); border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 1rem; }
    @keyframes spin { to { transform: rotate(360deg); } }

    .timeline { position: relative; padding-left: 3rem; }
    .timeline::before { content: ''; position: absolute; left: 1rem; top: 0; bottom: 0; width: 2px; background: var(--glass-border); }
    
    .timeline-item { position: relative; margin-bottom: 2rem; }
    .timeline-marker { position: absolute; left: -3rem; width: 2rem; height: 2rem; background: var(--bg-primary); border: 2px solid var(--glass-border); border-radius: 50%; display: flex; align-items: center; justify-content: center; }
    .timeline-item.current .timeline-marker { border-color: var(--accent-primary); box-shadow: 0 0 10px var(--accent-glow); }
    .type-icon { font-size: 0.875rem; }

    .timeline-content { background: var(--glass-bg); border: 1px solid var(--glass-border); border-radius: 16px; padding: 1.5rem; }
    .timeline-header { display: flex; justify-content: space-between; gap: 1rem; margin-bottom: 0.5rem; }
    .info h3 { margin: 0; color: var(--text-primary); font-size: 1.1rem; }
    .company { color: var(--accent-primary); font-size: 0.9rem; display: block; }
    .location { color: var(--text-muted); font-size: 0.8rem; }
    
    .actions { display: flex; gap: 0.25rem; }
    .action-btn { width: 32px; height: 32px; border: none; border-radius: 8px; background: var(--bg-secondary); cursor: pointer; }
    .action-btn:hover { background: var(--accent-primary); }
    .action-btn.delete:hover { background: #ef4444; }

    .date-range { color: var(--text-secondary); font-size: 0.875rem; margin-bottom: 0.75rem; }
    .current-badge { background: var(--accent-primary); color: white; padding: 0.125rem 0.5rem; border-radius: 4px; font-size: 0.75rem; margin-left: 0.5rem; }
    .description { color: var(--text-secondary); margin: 0 0 1rem; line-height: 1.6; }
    .technologies { display: flex; flex-wrap: wrap; gap: 0.5rem; }
    .tech-tag { padding: 0.25rem 0.5rem; background: var(--bg-secondary); border-radius: 6px; font-size: 0.75rem; color: var(--accent-primary); }

    .empty-state { text-align: center; padding: 4rem; background: var(--glass-bg); border: 1px dashed var(--glass-border); border-radius: 16px; }
    .empty-icon { font-size: 4rem; display: block; margin-bottom: 1rem; }
    .empty-state h3 { color: var(--text-primary); margin: 0 0 0.5rem; }
    .empty-state p { color: var(--text-secondary); margin: 0 0 1.5rem; }

    .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.7); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; padding: 2rem; z-index: 1000; }
    .modal { width: 100%; max-width: 600px; max-height: 90vh; overflow-y: auto; background: var(--bg-primary); border: 1px solid var(--glass-border); border-radius: 20px; }
    .modal-header { display: flex; justify-content: space-between; align-items: center; padding: 1.5rem; border-bottom: 1px solid var(--glass-border); }
    .modal-header h2 { margin: 0; color: var(--text-primary); }
    .close-btn { width: 36px; height: 36px; border: none; border-radius: 10px; background: var(--glass-bg); cursor: pointer; }
    .modal-body { padding: 1.5rem; }
    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
    .form-group { display: flex; flex-direction: column; gap: 0.5rem; }
    .form-group.full-width { grid-column: 1 / -1; }
    .form-group label { color: var(--text-secondary); font-size: 0.875rem; }
    .form-group input, .form-group textarea, .form-group select { padding: 0.75rem; background: var(--input-bg); border: 1px solid var(--input-border); border-radius: 10px; color: var(--text-primary); }
    .form-group input:focus, .form-group textarea:focus, .form-group select:focus { outline: none; border-color: var(--accent-primary); }
    .form-group input:disabled { opacity: 0.5; }
    .checkbox-group { flex-direction: row; }
    .checkbox-label { display: flex; align-items: center; gap: 0.5rem; cursor: pointer; }
    .modal-footer { display: flex; justify-content: flex-end; gap: 1rem; padding-top: 1.5rem; border-top: 1px solid var(--glass-border); margin-top: 1.5rem; }
  `]
})
export class ExperiencesManagerComponent implements OnInit {
  experiences = signal<Experience[]>([]);
  isLoading = signal(true);
  showModal = signal(false);
  isSaving = signal(false);
  editingItem = signal<Experience | null>(null);
  form: Partial<Experience> = this.getEmptyForm();
  techInput = '';

  constructor(private adminApi: AdminApiService) {}

  ngOnInit() { this.load(); }

  load() {
    this.isLoading.set(true);
    this.adminApi.getExperiences().subscribe({
      next: data => { this.experiences.set(data); this.isLoading.set(false); },
      error: () => this.isLoading.set(false)
    });
  }

  getEmptyForm(): Partial<Experience> {
    return { title: '', company: '', location: '', start_date: '', end_date: '', is_current: false, description: '', technologies: [], type: 'work', sort_order: 0 };
  }

  formatDate(date: string | undefined): string {
    if (!date) return '';
    return new Date(date).toLocaleDateString('it-IT', { month: 'short', year: 'numeric' });
  }

  openModal(item?: Experience) {
    this.editingItem.set(item || null);
    this.form = item ? { ...item } : this.getEmptyForm();
    this.techInput = item?.technologies?.join(', ') || '';
    this.showModal.set(true);
  }

  closeModal() { this.showModal.set(false); this.editingItem.set(null); }
  editExperience(item: Experience) { this.openModal(item); }

  save() {
    this.form.technologies = this.techInput.split(',').map(t => t.trim()).filter(t => t);
    this.isSaving.set(true);
    const req = this.editingItem()
      ? this.adminApi.updateExperience(this.editingItem()!.id, this.form)
      : this.adminApi.createExperience(this.form);
    req.subscribe({
      next: () => { this.isSaving.set(false); this.closeModal(); this.load(); },
      error: () => this.isSaving.set(false)
    });
  }

  deleteExperience(item: Experience) {
    if (confirm(`Eliminare "${item.title}"?`)) {
      this.adminApi.deleteExperience(item.id).subscribe(() => {
        this.experiences.update(list => list.filter(e => e.id !== item.id));
      });
    }
  }
}
