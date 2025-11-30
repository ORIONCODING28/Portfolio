import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AdminApiService, Palette } from '../services/admin-api.service';

@Component({
  selector: 'app-themes-manager',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="manager-container">
      <header class="manager-header">
        <div class="header-left">
          <a routerLink="/admin" class="back-btn">← Dashboard</a>
          <h1>Gestione Temi & Palette</h1>
        </div>
        <button class="btn btn-primary" (click)="openModal()">
          ➕ Nuovo Tema
        </button>
      </header>

      @if (isLoading()) {
        <div class="loading">
          <div class="spinner"></div>
          <p>Caricamento...</p>
        </div>
      } @else {
        <div class="themes-grid">
          @for (palette of palettes(); track palette.id) {
            <div class="theme-card" [class.active]="palette.is_active">
              <div class="theme-preview">
                <div class="color-swatches">
                  <div class="swatch primary" [style.background]="palette.colors['primary'] || '#9D4EDD'"></div>
                  <div class="swatch secondary" [style.background]="palette.colors['secondary'] || '#00D9FF'"></div>
                  <div class="swatch accent" [style.background]="palette.colors['accent'] || '#00B8CC'"></div>
                  <div class="swatch bg" [style.background]="palette.colors['background'] || '#1a1a3e'"></div>
                </div>
              </div>

              <div class="theme-info">
                <div class="theme-header">
                  <h3>{{ palette.name }}</h3>
                  @if (palette.is_active) {
                    <span class="active-badge">✓ Attivo</span>
                  }
                </div>
                <span class="theme-slug">{{ palette.slug }}</span>
              </div>

              <div class="theme-actions">
                @if (!palette.is_active) {
                  <button class="btn btn-sm btn-primary" (click)="activateTheme(palette)">
                    Attiva
                  </button>
                }
                <button class="action-btn" (click)="editTheme(palette)">✏️</button>
                <button class="action-btn delete" (click)="deleteTheme(palette)" [disabled]="palette.is_active">🗑️</button>
              </div>
            </div>
          } @empty {
            <div class="empty-state">
              <span class="empty-icon">🎨</span>
              <h3>Nessun tema</h3>
              <p>Crea il tuo primo tema personalizzato</p>
              <button class="btn btn-primary" (click)="openModal()">➕ Crea Tema</button>
            </div>
          }
        </div>

        <!-- Live Preview -->
        <section class="preview-section">
          <h2>Anteprima Tema Attivo</h2>
          <div class="preview-box">
            <div class="preview-card">
              <h3>Card di Esempio</h3>
              <p>Questo è un esempio di come appare il tema selezionato.</p>
              <button class="preview-btn">Bottone Primario</button>
            </div>
          </div>
        </section>
      }

      @if (showModal()) {
        <div class="modal-overlay" (click)="closeModal()">
          <div class="modal" (click)="$event.stopPropagation()">
            <header class="modal-header">
              <h2>{{ editingItem() ? 'Modifica' : 'Nuovo' }} Tema</h2>
              <button class="close-btn" (click)="closeModal()">✕</button>
            </header>

            <form (ngSubmit)="save()" class="modal-body">
              <div class="form-grid">
                <div class="form-group">
                  <label>Nome *</label>
                  <input type="text" [(ngModel)]="form.name" name="name" required placeholder="Default Violet">
                </div>
                <div class="form-group">
                  <label>Slug *</label>
                  <input type="text" [(ngModel)]="form.slug" name="slug" required placeholder="default">
                </div>

                <div class="form-group full-width">
                  <h4>Colori</h4>
                </div>

                <div class="form-group">
                  <label>Primary</label>
                  <div class="color-input">
                    <input type="color" [(ngModel)]="colors['primary']" name="colorPrimary">
                    <input type="text" [(ngModel)]="colors['primary']" placeholder="#9D4EDD">
                  </div>
                </div>

                <div class="form-group">
                  <label>Secondary</label>
                  <div class="color-input">
                    <input type="color" [(ngModel)]="colors['secondary']" name="colorSecondary">
                    <input type="text" [(ngModel)]="colors['secondary']" placeholder="#00D9FF">
                  </div>
                </div>

                <div class="form-group">
                  <label>Accent</label>
                  <div class="color-input">
                    <input type="color" [(ngModel)]="colors['accent']" name="colorAccent">
                    <input type="text" [(ngModel)]="colors['accent']" placeholder="#00B8CC">
                  </div>
                </div>

                <div class="form-group">
                  <label>Background</label>
                  <div class="color-input">
                    <input type="color" [(ngModel)]="colors['background']" name="colorBackground">
                    <input type="text" [(ngModel)]="colors['background']" placeholder="#1a1a3e">
                  </div>
                </div>

                <div class="form-group">
                  <label>Text Primary</label>
                  <div class="color-input">
                    <input type="color" [(ngModel)]="colors['text']" name="colorText">
                    <input type="text" [(ngModel)]="colors['text']" placeholder="#ffffff">
                  </div>
                </div>

                <div class="form-group">
                  <label>Text Secondary</label>
                  <div class="color-input">
                    <input type="color" [(ngModel)]="colors['textSecondary']" name="colorTextSec">
                    <input type="text" [(ngModel)]="colors['textSecondary']" placeholder="#94a3b8">
                  </div>
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
    
    .btn { padding: 0.75rem 1.5rem; border-radius: 12px; font-weight: 500; cursor: pointer; border: none; display: inline-flex; align-items: center; gap: 0.5rem; transition: all 0.2s; }
    .btn-primary { background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary)); color: white; }
    .btn-secondary { background: var(--glass-bg); color: var(--text-primary); border: 1px solid var(--glass-border); }
    .btn-sm { padding: 0.5rem 1rem; font-size: 0.875rem; }
    
    .loading { text-align: center; padding: 4rem; }
    .spinner { width: 40px; height: 40px; border: 3px solid var(--glass-border); border-top-color: var(--accent-primary); border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 1rem; }
    @keyframes spin { to { transform: rotate(360deg); } }

    .themes-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.5rem; margin-bottom: 3rem; }

    .theme-card { background: var(--glass-bg); border: 1px solid var(--glass-border); border-radius: 16px; overflow: hidden; transition: all 0.2s; }
    .theme-card:hover { border-color: var(--accent-primary); }
    .theme-card.active { border-color: var(--accent-primary); box-shadow: 0 0 20px var(--accent-glow); }

    .theme-preview { padding: 1.5rem; background: var(--bg-secondary); }
    .color-swatches { display: flex; gap: 0.5rem; }
    .swatch { width: 40px; height: 40px; border-radius: 8px; border: 2px solid rgba(255,255,255,0.1); }

    .theme-info { padding: 1rem 1.5rem; }
    .theme-header { display: flex; justify-content: space-between; align-items: center; }
    .theme-info h3 { margin: 0; color: var(--text-primary); }
    .active-badge { background: var(--accent-primary); color: white; padding: 0.25rem 0.5rem; border-radius: 6px; font-size: 0.75rem; }
    .theme-slug { color: var(--text-muted); font-size: 0.875rem; }

    .theme-actions { display: flex; align-items: center; gap: 0.5rem; padding: 0 1.5rem 1.5rem; }
    .action-btn { width: 36px; height: 36px; border: none; border-radius: 8px; background: var(--bg-secondary); cursor: pointer; transition: all 0.2s; }
    .action-btn:hover:not(:disabled) { background: var(--accent-primary); }
    .action-btn.delete:hover:not(:disabled) { background: #ef4444; }
    .action-btn:disabled { opacity: 0.3; cursor: not-allowed; }

    .preview-section { background: var(--glass-bg); border: 1px solid var(--glass-border); border-radius: 16px; padding: 2rem; }
    .preview-section h2 { color: var(--text-primary); margin: 0 0 1.5rem; font-size: 1.25rem; }
    .preview-box { padding: 2rem; background: var(--bg-secondary); border-radius: 12px; }
    .preview-card { max-width: 300px; background: var(--glass-bg); border: 1px solid var(--glass-border); border-radius: 12px; padding: 1.5rem; }
    .preview-card h3 { margin: 0 0 0.5rem; color: var(--text-primary); }
    .preview-card p { color: var(--text-secondary); margin: 0 0 1rem; font-size: 0.875rem; }
    .preview-btn { background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary)); border: none; padding: 0.75rem 1.5rem; border-radius: 8px; color: white; cursor: pointer; }

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
    .form-group h4 { color: var(--text-primary); margin: 0.5rem 0; }
    .form-group label { color: var(--text-secondary); font-size: 0.875rem; }
    .form-group input { padding: 0.75rem; background: var(--input-bg); border: 1px solid var(--input-border); border-radius: 10px; color: var(--text-primary); }
    .form-group input:focus { outline: none; border-color: var(--accent-primary); }
    
    .color-input { display: flex; gap: 0.5rem; }
    .color-input input[type="color"] { width: 50px; height: 42px; padding: 0; border: none; border-radius: 8px; cursor: pointer; }
    .color-input input[type="text"] { flex: 1; }
    
    .modal-footer { display: flex; justify-content: flex-end; gap: 1rem; padding-top: 1.5rem; border-top: 1px solid var(--glass-border); margin-top: 1.5rem; }
  `]
})
export class ThemesManagerComponent implements OnInit {
  palettes = signal<Palette[]>([]);
  isLoading = signal(true);
  showModal = signal(false);
  isSaving = signal(false);
  editingItem = signal<Palette | null>(null);
  form: Partial<Palette> = { name: '', slug: '', colors: {} };
  colors: Record<string, string> = {};

  constructor(private adminApi: AdminApiService) {}

  ngOnInit() { this.load(); }

  load() {
    this.isLoading.set(true);
    this.adminApi.getPalettes().subscribe({
      next: data => { this.palettes.set(data); this.isLoading.set(false); },
      error: () => this.isLoading.set(false)
    });
  }

  openModal(item?: Palette) {
    this.editingItem.set(item || null);
    this.form = item ? { ...item } : { name: '', slug: '', colors: {} };
    this.colors = item?.colors ? { ...item.colors } : { primary: '#9D4EDD', secondary: '#00D9FF', accent: '#00B8CC', background: '#1a1a3e', text: '#ffffff', textSecondary: '#94a3b8' };
    this.showModal.set(true);
  }

  closeModal() { this.showModal.set(false); this.editingItem.set(null); }
  editTheme(item: Palette) { this.openModal(item); }

  save() {
    this.form.colors = { ...this.colors };
    this.isSaving.set(true);
    const req = this.editingItem()
      ? this.adminApi.updatePalette(this.editingItem()!.id, this.form)
      : this.adminApi.createPalette(this.form);
    req.subscribe({
      next: () => { this.isSaving.set(false); this.closeModal(); this.load(); },
      error: () => this.isSaving.set(false)
    });
  }

  activateTheme(palette: Palette) {
    this.adminApi.setActivePalette(palette.id).subscribe(() => this.load());
  }

  deleteTheme(palette: Palette) {
    if (palette.is_active) return;
    if (confirm(`Eliminare il tema "${palette.name}"?`)) {
      this.adminApi.deletePalette(palette.id).subscribe(() => {
        this.palettes.update(list => list.filter(p => p.id !== palette.id));
      });
    }
  }
}
