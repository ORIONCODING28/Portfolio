import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AdminApiService, MetaItem } from '../services/admin-api.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="manager-container">
      <header class="manager-header">
        <div class="header-left">
          <a routerLink="/admin" class="back-btn">← Dashboard</a>
          <h1>Impostazioni</h1>
        </div>
      </header>

      @if (isLoading()) {
        <div class="loading">
          <div class="spinner"></div>
          <p>Caricamento...</p>
        </div>
      } @else {
        <div class="settings-grid">
          <!-- SEO Settings -->
          <section class="settings-section">
            <h2>🔍 SEO & Meta</h2>
            <div class="form-group">
              <label>Titolo Sito</label>
              <input type="text" [(ngModel)]="settings['site_title']" placeholder="Portfolio - Nome">
            </div>
            <div class="form-group">
              <label>Meta Description</label>
              <textarea [(ngModel)]="settings['meta_description']" rows="3" placeholder="Descrizione del portfolio..."></textarea>
            </div>
            <div class="form-group">
              <label>Keywords (separate da virgola)</label>
              <input type="text" [(ngModel)]="settings['meta_keywords']" placeholder="developer, portfolio, angular">
            </div>
            <button class="btn btn-primary" (click)="saveSection('seo')">Salva SEO</button>
          </section>

          <!-- Analytics -->
          <section class="settings-section">
            <h2>📊 Analytics</h2>
            <div class="form-group">
              <label>Google Analytics ID</label>
              <input type="text" [(ngModel)]="settings['ga_id']" placeholder="G-XXXXXXXXXX">
            </div>
            <div class="form-group">
              <label>Google Tag Manager ID</label>
              <input type="text" [(ngModel)]="settings['gtm_id']" placeholder="GTM-XXXXXXX">
            </div>
            <button class="btn btn-primary" (click)="saveSection('analytics')">Salva Analytics</button>
          </section>

          <!-- Contact Settings -->
          <section class="settings-section">
            <h2>📧 Contatti</h2>
            <div class="form-group">
              <label>Email per Contatti</label>
              <input type="email" [(ngModel)]="settings['contact_email']" placeholder="info@example.com">
            </div>
            <div class="form-group checkbox-group">
              <label class="checkbox-label">
                <input type="checkbox" [(ngModel)]="settings['contact_form_enabled']">
                <span>Abilita Form di Contatto</span>
              </label>
            </div>
            <button class="btn btn-primary" (click)="saveSection('contact')">Salva Contatti</button>
          </section>

          <!-- Appearance -->
          <section class="settings-section">
            <h2>🎨 Aspetto</h2>
            <div class="form-group">
              <label>Animazioni</label>
              <select [(ngModel)]="settings['animations_enabled']">
                <option value="full">Complete</option>
                <option value="reduced">Ridotte</option>
                <option value="none">Disabilitate</option>
              </select>
            </div>
            <div class="form-group checkbox-group">
              <label class="checkbox-label">
                <input type="checkbox" [(ngModel)]="settings['show_cursor_effect']">
                <span>Mostra Effetto Cursore</span>
              </label>
            </div>
            <div class="form-group checkbox-group">
              <label class="checkbox-label">
                <input type="checkbox" [(ngModel)]="settings['show_particles']">
                <span>Mostra Particelle Sfondo</span>
              </label>
            </div>
            <button class="btn btn-primary" (click)="saveSection('appearance')">Salva Aspetto</button>
          </section>

          <!-- Maintenance -->
          <section class="settings-section danger">
            <h2>⚠️ Manutenzione</h2>
            <div class="form-group checkbox-group">
              <label class="checkbox-label">
                <input type="checkbox" [(ngModel)]="settings['maintenance_mode']">
                <span>Modalità Manutenzione</span>
              </label>
              <p class="hint">Il sito mostrerà una pagina di manutenzione ai visitatori</p>
            </div>
            <button class="btn btn-danger" (click)="saveSection('maintenance')">Salva</button>
          </section>
        </div>

        @if (message()) {
          <div class="toast" [class.success]="!hasError()" [class.error]="hasError()">
            {{ message() }}
          </div>
        }
      }
    </div>
  `,
  styles: [`
    .manager-container { min-height: 100vh; background: var(--bg-primary); padding: 2rem; max-width: 1000px; margin: 0 auto; }
    .manager-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
    .header-left { display: flex; flex-direction: column; gap: 0.5rem; }
    .back-btn { color: var(--text-secondary); text-decoration: none; font-size: 0.875rem; }
    .back-btn:hover { color: var(--accent-primary); }
    .manager-header h1 { font-size: 1.75rem; color: var(--text-primary); margin: 0; }

    .loading { text-align: center; padding: 4rem; }
    .spinner { width: 40px; height: 40px; border: 3px solid var(--glass-border); border-top-color: var(--accent-primary); border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 1rem; }
    @keyframes spin { to { transform: rotate(360deg); } }

    .settings-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(400px, 1fr)); gap: 1.5rem; }

    .settings-section { background: var(--glass-bg); border: 1px solid var(--glass-border); border-radius: 16px; padding: 1.5rem; }
    .settings-section.danger { border-color: rgba(239, 68, 68, 0.3); }
    .settings-section h2 { color: var(--text-primary); font-size: 1.1rem; margin: 0 0 1.25rem; padding-bottom: 1rem; border-bottom: 1px solid var(--glass-border); }

    .form-group { display: flex; flex-direction: column; gap: 0.5rem; margin-bottom: 1rem; }
    .form-group label { color: var(--text-secondary); font-size: 0.875rem; }
    .form-group input, .form-group textarea, .form-group select { padding: 0.75rem 1rem; background: var(--input-bg); border: 1px solid var(--input-border); border-radius: 10px; color: var(--text-primary); font-size: 0.95rem; }
    .form-group input:focus, .form-group textarea:focus, .form-group select:focus { outline: none; border-color: var(--accent-primary); }

    .checkbox-group { flex-direction: row; align-items: center; }
    .checkbox-label { display: flex; align-items: center; gap: 0.5rem; cursor: pointer; color: var(--text-primary); }
    .checkbox-label input[type="checkbox"] { width: 20px; height: 20px; cursor: pointer; }
    .hint { color: var(--text-muted); font-size: 0.8rem; margin: 0.25rem 0 0 1.75rem; }

    .btn { padding: 0.75rem 1.5rem; border-radius: 12px; font-weight: 500; cursor: pointer; border: none; transition: all 0.2s; }
    .btn-primary { background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary)); color: white; }
    .btn-danger { background: #ef4444; color: white; }
    .btn:hover { transform: translateY(-2px); }

    .toast { position: fixed; bottom: 2rem; right: 2rem; padding: 1rem 1.5rem; border-radius: 12px; animation: slideIn 0.3s ease; z-index: 1000; }
    .toast.success { background: rgba(34, 197, 94, 0.9); color: white; }
    .toast.error { background: rgba(239, 68, 68, 0.9); color: white; }
    @keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }

    @media (max-width: 500px) {
      .settings-grid { grid-template-columns: 1fr; }
    }
  `]
})
export class SettingsComponent implements OnInit {
  settings: Record<string, any> = {};
  isLoading = signal(true);
  message = signal('');
  hasError = signal(false);

  constructor(private adminApi: AdminApiService) {}

  ngOnInit() { this.load(); }

  load() {
    this.isLoading.set(true);
    this.adminApi.getMeta().subscribe({
      next: data => {
        // Convert array to object
        data.forEach((item: MetaItem) => {
          this.settings[item.meta_key] = item.meta_value || item.meta_json;
        });
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }

  saveSection(section: string) {
    const keysToSave: Record<string, string[]> = {
      seo: ['site_title', 'meta_description', 'meta_keywords'],
      analytics: ['ga_id', 'gtm_id'],
      contact: ['contact_email', 'contact_form_enabled'],
      appearance: ['animations_enabled', 'show_cursor_effect', 'show_particles'],
      maintenance: ['maintenance_mode']
    };

    const keys = keysToSave[section] || [];
    const saves = keys.map(key => 
      this.adminApi.updateMeta(key, String(this.settings[key] ?? ''))
    );

    Promise.all(saves.map(s => s.toPromise()))
      .then(() => {
        this.hasError.set(false);
        this.message.set('✓ Salvato!');
        setTimeout(() => this.message.set(''), 3000);
      })
      .catch(() => {
        this.hasError.set(true);
        this.message.set('Errore durante il salvataggio');
      });
  }
}
