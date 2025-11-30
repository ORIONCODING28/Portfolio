import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AdminApiService, Testimonial } from '../services/admin-api.service';

@Component({
  selector: 'app-testimonials-manager',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="manager-container">
      <header class="manager-header">
        <div class="header-left">
          <a routerLink="/admin" class="back-btn">← Dashboard</a>
          <h1>Gestione Testimonianze</h1>
        </div>
        <button class="btn btn-primary" (click)="openModal()">
          ➕ Nuova Testimonianza
        </button>
      </header>

      @if (isLoading()) {
        <div class="loading">
          <div class="spinner"></div>
          <p>Caricamento...</p>
        </div>
      } @else {
        <div class="testimonials-grid">
          @for (testimonial of testimonials(); track testimonial.id) {
            <div class="testimonial-card" [class.unpublished]="!testimonial.published">
              <div class="testimonial-header">
                <div class="author-info">
                  @if (testimonial.avatar_url) {
                    <img [src]="testimonial.avatar_url" [alt]="testimonial.author" class="avatar">
                  } @else {
                    <div class="avatar placeholder">{{ testimonial.author[0] }}</div>
                  }
                  <div>
                    <h3>{{ testimonial.author }}</h3>
                    <span class="role">{{ testimonial.role }}{{ testimonial.company ? ' @ ' + testimonial.company : '' }}</span>
                  </div>
                </div>
                <div class="actions">
                  <button class="action-btn" (click)="editTestimonial(testimonial)">✏️</button>
                  <button class="action-btn delete" (click)="deleteTestimonial(testimonial)">🗑️</button>
                </div>
              </div>

              <div class="rating">
                @for (star of [1,2,3,4,5]; track star) {
                  <span [class.filled]="star <= testimonial.rating">★</span>
                }
              </div>

              <p class="text">"{{ testimonial.text }}"</p>

              <div class="testimonial-footer">
                @if (testimonial.featured) {
                  <span class="badge featured">⭐ Featured</span>
                }
                @if (!testimonial.published) {
                  <span class="badge draft">Bozza</span>
                }
              </div>
            </div>
          } @empty {
            <div class="empty-state">
              <span class="empty-icon">💬</span>
              <h3>Nessuna testimonianza</h3>
              <p>Aggiungi feedback dai tuoi clienti</p>
              <button class="btn btn-primary" (click)="openModal()">➕ Aggiungi</button>
            </div>
          }
        </div>
      }

      @if (showModal()) {
        <div class="modal-overlay" (click)="closeModal()">
          <div class="modal" (click)="$event.stopPropagation()">
            <header class="modal-header">
              <h2>{{ editingItem() ? 'Modifica' : 'Nuova' }} Testimonianza</h2>
              <button class="close-btn" (click)="closeModal()">✕</button>
            </header>

            <form (ngSubmit)="save()" class="modal-body">
              <div class="form-grid">
                <div class="form-group">
                  <label>Nome Autore *</label>
                  <input type="text" [(ngModel)]="form.author" name="author" required>
                </div>
                <div class="form-group">
                  <label>Ruolo</label>
                  <input type="text" [(ngModel)]="form.role" name="role" placeholder="CEO">
                </div>
                <div class="form-group">
                  <label>Azienda</label>
                  <input type="text" [(ngModel)]="form.company" name="company">
                </div>
                <div class="form-group">
                  <label>URL Avatar</label>
                  <input type="url" [(ngModel)]="form.avatar_url" name="avatar_url">
                </div>
                <div class="form-group full-width">
                  <label>Testo *</label>
                  <textarea [(ngModel)]="form.text" name="text" rows="4" required></textarea>
                </div>
                <div class="form-group">
                  <label>Rating ({{ form.rating }}/5)</label>
                  <input type="range" [(ngModel)]="form.rating" name="rating" min="1" max="5">
                </div>
                <div class="form-group checkbox-group">
                  <label class="checkbox-label">
                    <input type="checkbox" [(ngModel)]="form.featured" name="featured">
                    <span>In evidenza</span>
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
    .manager-container { min-height: 100vh; background: var(--bg-primary); padding: 2rem; max-width: 1200px; margin: 0 auto; }
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

    .testimonials-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); gap: 1.5rem; }
    .testimonial-card { background: var(--glass-bg); border: 1px solid var(--glass-border); border-radius: 16px; padding: 1.5rem; }
    .testimonial-card.unpublished { opacity: 0.6; }
    .testimonial-header { display: flex; justify-content: space-between; margin-bottom: 1rem; }
    .author-info { display: flex; gap: 1rem; align-items: center; }
    .avatar { width: 50px; height: 50px; border-radius: 50%; object-fit: cover; }
    .avatar.placeholder { background: var(--accent-primary); color: white; display: flex; align-items: center; justify-content: center; font-weight: 600; }
    .author-info h3 { margin: 0; color: var(--text-primary); font-size: 1rem; }
    .role { color: var(--text-secondary); font-size: 0.875rem; }
    .actions { display: flex; gap: 0.25rem; }
    .action-btn { width: 32px; height: 32px; border: none; border-radius: 8px; background: var(--bg-secondary); cursor: pointer; }
    .action-btn:hover { background: var(--accent-primary); }
    .action-btn.delete:hover { background: #ef4444; }
    .rating { margin-bottom: 1rem; }
    .rating span { color: var(--text-muted); font-size: 1.25rem; }
    .rating span.filled { color: #fbbf24; }
    .text { color: var(--text-secondary); font-style: italic; line-height: 1.6; margin: 0; }
    .testimonial-footer { display: flex; gap: 0.5rem; margin-top: 1rem; }
    .badge { padding: 0.25rem 0.5rem; border-radius: 6px; font-size: 0.75rem; }
    .badge.featured { background: rgba(251, 191, 36, 0.15); color: #fbbf24; }
    .badge.draft { background: rgba(156, 163, 175, 0.15); color: #9ca3af; }

    .empty-state { grid-column: 1 / -1; text-align: center; padding: 4rem; background: var(--glass-bg); border: 1px dashed var(--glass-border); border-radius: 16px; }
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
    .form-group input, .form-group textarea { padding: 0.75rem; background: var(--input-bg); border: 1px solid var(--input-border); border-radius: 10px; color: var(--text-primary); }
    .form-group input:focus, .form-group textarea:focus { outline: none; border-color: var(--accent-primary); }
    .checkbox-group { flex-direction: row; }
    .checkbox-label { display: flex; align-items: center; gap: 0.5rem; cursor: pointer; }
    .modal-footer { display: flex; justify-content: flex-end; gap: 1rem; padding-top: 1.5rem; border-top: 1px solid var(--glass-border); margin-top: 1.5rem; }
  `]
})
export class TestimonialsManagerComponent implements OnInit {
  testimonials = signal<Testimonial[]>([]);
  isLoading = signal(true);
  showModal = signal(false);
  isSaving = signal(false);
  editingItem = signal<Testimonial | null>(null);
  form: Partial<Testimonial> = this.getEmptyForm();

  constructor(private adminApi: AdminApiService) {}

  ngOnInit() { this.load(); }

  load() {
    this.isLoading.set(true);
    this.adminApi.getTestimonials().subscribe({
      next: data => { this.testimonials.set(data); this.isLoading.set(false); },
      error: () => this.isLoading.set(false)
    });
  }

  getEmptyForm(): Partial<Testimonial> {
    return { author: '', role: '', company: '', text: '', avatar_url: '', rating: 5, featured: false, published: true };
  }

  openModal(item?: Testimonial) {
    this.editingItem.set(item || null);
    this.form = item ? { ...item } : this.getEmptyForm();
    this.showModal.set(true);
  }

  closeModal() { this.showModal.set(false); this.editingItem.set(null); }

  editTestimonial(item: Testimonial) { this.openModal(item); }

  save() {
    this.isSaving.set(true);
    const req = this.editingItem()
      ? this.adminApi.updateTestimonial(this.editingItem()!.id, this.form)
      : this.adminApi.createTestimonial(this.form);
    req.subscribe({
      next: () => { this.isSaving.set(false); this.closeModal(); this.load(); },
      error: () => this.isSaving.set(false)
    });
  }

  deleteTestimonial(item: Testimonial) {
    if (confirm(`Eliminare la testimonianza di "${item.author}"?`)) {
      this.adminApi.deleteTestimonial(item.id).subscribe(() => {
        this.testimonials.update(list => list.filter(t => t.id !== item.id));
      });
    }
  }
}
