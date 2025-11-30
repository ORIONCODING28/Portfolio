import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="login-container">
      <div class="login-card">
        <div class="login-header">
          <div class="logo">
            <span class="logo-icon">⚡</span>
            <h1>Portfolio Admin</h1>
          </div>
          <p>Accedi per gestire il tuo portfolio</p>
        </div>

        <form (ngSubmit)="onSubmit()" #loginForm="ngForm">
          @if (error()) {
            <div class="error-message">
              <span class="error-icon">⚠️</span>
              {{ error() }}
            </div>
          }

          <div class="form-group">
            <label for="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              [(ngModel)]="email"
              required
              email
              placeholder="admin@portfolio.dev"
              [disabled]="isLoading()"
            />
          </div>

          <div class="form-group">
            <label for="password">Password</label>
            <div class="password-input">
              <input
                [type]="showPassword() ? 'text' : 'password'"
                id="password"
                name="password"
                [(ngModel)]="password"
                required
                minlength="6"
                placeholder="••••••••"
                [disabled]="isLoading()"
              />
              <button
                type="button"
                class="toggle-password"
                (click)="showPassword.set(!showPassword())"
              >
                {{ showPassword() ? '🙈' : '👁️' }}
              </button>
            </div>
          </div>

          <button
            type="submit"
            class="submit-btn"
            [disabled]="isLoading() || !loginForm.valid"
          >
            @if (isLoading()) {
              <span class="spinner"></span>
              Accesso in corso...
            } @else {
              Accedi
            }
          </button>
        </form>

        <div class="login-footer">
          <a routerLink="/" class="back-link">← Torna al Portfolio</a>
        </div>
      </div>

      <div class="login-background">
        <div class="bg-gradient"></div>
        <div class="bg-pattern"></div>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem;
      position: relative;
      overflow: hidden;
    }

    .login-background {
      position: absolute;
      inset: 0;
      z-index: 0;
    }

    .bg-gradient {
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-secondary) 100%);
    }

    .bg-pattern {
      position: absolute;
      inset: 0;
      background-image: radial-gradient(circle at 2px 2px, var(--accent-primary) 1px, transparent 0);
      background-size: 40px 40px;
      opacity: 0.1;
    }

    .login-card {
      position: relative;
      z-index: 1;
      width: 100%;
      max-width: 420px;
      background: var(--glass-bg);
      backdrop-filter: blur(20px);
      border: 1px solid var(--glass-border);
      border-radius: 24px;
      padding: 2.5rem;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.4);
    }

    .login-header {
      text-align: center;
      margin-bottom: 2rem;
    }

    .logo {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.75rem;
      margin-bottom: 0.5rem;
    }

    .logo-icon {
      font-size: 2rem;
    }

    .logo h1 {
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--text-primary);
      margin: 0;
    }

    .login-header p {
      color: var(--text-secondary);
      font-size: 0.9rem;
    }

    .error-message {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1rem;
      background: rgba(239, 68, 68, 0.15);
      border: 1px solid rgba(239, 68, 68, 0.3);
      border-radius: 12px;
      color: #ef4444;
      font-size: 0.875rem;
      margin-bottom: 1.5rem;
    }

    .form-group {
      margin-bottom: 1.25rem;
    }

    label {
      display: block;
      color: var(--text-secondary);
      font-size: 0.875rem;
      font-weight: 500;
      margin-bottom: 0.5rem;
    }

    input {
      width: 100%;
      padding: 0.875rem 1rem;
      background: var(--input-bg);
      border: 1px solid var(--input-border);
      border-radius: 12px;
      color: var(--text-primary);
      font-size: 1rem;
      transition: all 0.2s ease;
    }

    input:focus {
      outline: none;
      border-color: var(--accent-primary);
      box-shadow: 0 0 0 3px var(--accent-glow);
    }

    input::placeholder {
      color: var(--text-muted);
    }

    input:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .password-input {
      position: relative;
    }

    .password-input input {
      padding-right: 3rem;
    }

    .toggle-password {
      position: absolute;
      right: 0.75rem;
      top: 50%;
      transform: translateY(-50%);
      background: none;
      border: none;
      font-size: 1.25rem;
      cursor: pointer;
      padding: 0.25rem;
    }

    .submit-btn {
      width: 100%;
      padding: 1rem;
      background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
      border: none;
      border-radius: 12px;
      color: white;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      transition: all 0.3s ease;
      margin-top: 0.5rem;
    }

    .submit-btn:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 10px 30px -5px var(--accent-glow);
    }

    .submit-btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none;
    }

    .spinner {
      width: 20px;
      height: 20px;
      border: 2px solid transparent;
      border-top-color: white;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .login-footer {
      text-align: center;
      margin-top: 1.5rem;
      padding-top: 1.5rem;
      border-top: 1px solid var(--glass-border);
    }

    .back-link {
      color: var(--text-secondary);
      text-decoration: none;
      font-size: 0.875rem;
      transition: color 0.2s ease;
    }

    .back-link:hover {
      color: var(--accent-primary);
    }
  `]
})
export class AdminLoginComponent {
  email = '';
  password = '';
  showPassword = signal(false);
  isLoading = signal(false);
  error = signal<string | null>(null);

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    // Redirect if already logged in
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/admin']);
    }
  }

  onSubmit(): void {
    if (!this.email || !this.password) return;

    this.error.set(null);
    this.isLoading.set(true);

    this.authService.login(this.email, this.password).subscribe({
      next: () => {
        this.router.navigate(['/admin']);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.error.set(
          err.error?.message || 'Credenziali non valide. Riprova.'
        );
      }
    });
  }
}
