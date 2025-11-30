import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AdminApiService, PersonalInfo } from '../services/admin-api.service';

@Component({
  selector: 'app-personal-info',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="manager-container">
      <header class="manager-header">
        <div class="header-left">
          <a routerLink="/admin" class="back-btn">← Dashboard</a>
          <h1>Informazioni Personali</h1>
        </div>
        <button class="btn btn-primary" (click)="save()" [disabled]="isSaving()">
          @if (isSaving()) {
            <span class="spinner-small"></span>
          }
          💾 Salva Modifiche
        </button>
      </header>

      @if (isLoading()) {
        <div class="loading">
          <div class="spinner"></div>
          <p>Caricamento...</p>
        </div>
      } @else {
        <form class="info-form" (ngSubmit)="save()">
          <section class="form-section">
            <h2>👤 Info Base</h2>
            <div class="form-grid">
              <div class="form-group">
                <label>Nome Completo</label>
                <input type="text" [(ngModel)]="form.name" name="name" placeholder="Giuseppe Rossi">
              </div>
              <div class="form-group">
                <label>Titolo / Ruolo</label>
                <input type="text" [(ngModel)]="form.title" name="title" placeholder="Full Stack Developer">
              </div>
              <div class="form-group full-width">
                <label>Bio</label>
                <textarea [(ngModel)]="form.bio" name="bio" rows="4" placeholder="Breve descrizione di te..."></textarea>
              </div>
            </div>
          </section>

          <section class="form-section">
            <h2>📧 Contatti</h2>
            <div class="form-grid">
              <div class="form-group">
                <label>Email</label>
                <input type="email" [(ngModel)]="form.email" name="email" placeholder="email@example.com">
              </div>
              <div class="form-group">
                <label>Telefono</label>
                <input type="tel" [(ngModel)]="form.phone" name="phone" placeholder="+39 123 456 7890">
              </div>
              <div class="form-group">
                <label>Località</label>
                <input type="text" [(ngModel)]="form.location" name="location" placeholder="Milano, Italia">
              </div>
            </div>
          </section>

          <section class="form-section">
            <h2>🔗 Link & Media</h2>
            <div class="form-grid">
              <div class="form-group">
                <label>URL Avatar</label>
                <input type="url" [(ngModel)]="form.avatar_url" name="avatar_url" placeholder="https://...">
              </div>
              <div class="form-group">
                <label>URL CV/Resume</label>
                <input type="url" [(ngModel)]="form.resume_url" name="resume_url" placeholder="https://...">
              </div>
            </div>
          </section>

          <section class="form-section">
            <h2>📱 Social Media</h2>
            <div class="form-grid">
              <div class="form-group">
                <label>GitHub</label>
                <input type="url" [(ngModel)]="socials['github']" name="github" placeholder="https://github.com/username">
              </div>
              <div class="form-group">
                <label>LinkedIn</label>
                <input type="url" [(ngModel)]="socials['linkedin']" name="linkedin" placeholder="https://linkedin.com/in/username">
              </div>
              <div class="form-group">
                <label>Twitter/X</label>
                <input type="url" [(ngModel)]="socials['twitter']" name="twitter" placeholder="https://twitter.com/username">
              </div>
              <div class="form-group">
                <label>Instagram</label>
                <input type="url" [(ngModel)]="socials['instagram']" name="instagram" placeholder="https://instagram.com/username">
              </div>
              <div class="form-group">
                <label>Dribbble</label>
                <input type="url" [(ngModel)]="socials['dribbble']" name="dribbble" placeholder="https://dribbble.com/username">
              </div>
              <div class="form-group">
                <label>Portfolio/Website</label>
                <input type="url" [(ngModel)]="socials['website']" name="website" placeholder="https://...">
              </div>
            </div>
          </section>

          @if (message()) {
            <div class="message" [class.success]="!hasError()" [class.error]="hasError()">
              {{ message() }}
            </div>
          }
        </form>
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
    
    .btn { padding: 0.75rem 1.5rem; border-radius: 12px; font-weight: 500; cursor: pointer; border: none; display: inline-flex; align-items: center; gap: 0.5rem; transition: all 0.2s; }
    .btn-primary { background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary)); color: white; }
    .btn:disabled { opacity: 0.6; cursor: not-allowed; }
    
    .loading { text-align: center; padding: 4rem; }
    .spinner { width: 40px; height: 40px; border: 3px solid var(--glass-border); border-top-color: var(--accent-primary); border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 1rem; }
    .spinner-small { width: 16px; height: 16px; border: 2px solid transparent; border-top-color: white; border-radius: 50%; animation: spin 0.8s linear infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }

    .info-form { display: flex; flex-direction: column; gap: 2rem; }

    .form-section { background: var(--glass-bg); border: 1px solid var(--glass-border); border-radius: 16px; padding: 1.5rem; }
    .form-section h2 { color: var(--text-primary); font-size: 1.1rem; margin: 0 0 1.25rem; padding-bottom: 1rem; border-bottom: 1px solid var(--glass-border); }

    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
    .form-group { display: flex; flex-direction: column; gap: 0.5rem; }
    .form-group.full-width { grid-column: 1 / -1; }
    .form-group label { color: var(--text-secondary); font-size: 0.875rem; }
    .form-group input, .form-group textarea { padding: 0.75rem 1rem; background: var(--input-bg); border: 1px solid var(--input-border); border-radius: 10px; color: var(--text-primary); font-size: 0.95rem; }
    .form-group input:focus, .form-group textarea:focus { outline: none; border-color: var(--accent-primary); }
    .form-group input::placeholder, .form-group textarea::placeholder { color: var(--text-muted); }

    .message { padding: 1rem; border-radius: 12px; text-align: center; }
    .message.success { background: rgba(34, 197, 94, 0.15); color: #22c55e; border: 1px solid rgba(34, 197, 94, 0.3); }
    .message.error { background: rgba(239, 68, 68, 0.15); color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.3); }

    @media (max-width: 600px) {
      .form-grid { grid-template-columns: 1fr; }
    }
  `]
})
export class PersonalInfoComponent implements OnInit {
  form: Partial<PersonalInfo> = {};
  socials: Record<string, string> = {};
  isLoading = signal(true);
  isSaving = signal(false);
  message = signal<string>('');
  hasError = signal(false);

  constructor(private adminApi: AdminApiService) {}

  ngOnInit() { this.load(); }

  load() {
    this.isLoading.set(true);
    this.adminApi.getPersonalInfo().subscribe({
      next: data => {
        this.form = data || {};
        this.socials = (data?.socials as Record<string, string>) || {};
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }

  save() {
    this.isSaving.set(true);
    this.message.set('');
    
    const payload = {
      ...this.form,
      socials: this.socials
    };

    this.adminApi.updatePersonalInfo(payload).subscribe({
      next: () => {
        this.isSaving.set(false);
        this.hasError.set(false);
        this.message.set('✓ Salvato con successo!');
        setTimeout(() => this.message.set(''), 3000);
      },
      error: () => {
        this.isSaving.set(false);
        this.hasError.set(true);
        this.message.set('Errore durante il salvataggio');
      }
    });
  }
}
