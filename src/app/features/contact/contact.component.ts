import { 
  Component, 
  ChangeDetectionStrategy, 
  inject, 
  signal,
  PLATFORM_ID
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PortfolioService } from '../../core/services/portfolio.service';
import { ScrollTriggerDirective } from '../../shared/directives/scroll-trigger.directive';
import { fadeInUp, fadeInLeft, fadeInRight } from '../../shared/animations/animations';

type FormStatus = 'idle' | 'sending' | 'success' | 'error';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ScrollTriggerDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeInUp, fadeInLeft, fadeInRight],
  template: `
    <section id="contact" class="section relative overflow-hidden">
      <!-- Background -->
      <div class="absolute inset-0 z-0">
        <div class="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-deep-indigo-900/50 to-transparent"></div>
        <div class="absolute top-1/4 right-0 w-96 h-96 bg-electric-violet/10 rounded-full blur-3xl"></div>
        <div class="absolute bottom-1/4 left-0 w-80 h-80 bg-soft-cyan/10 rounded-full blur-3xl"></div>
      </div>

      <div class="container-custom relative z-10">
        <!-- Section Header -->
        <div 
          class="text-center mb-16"
          appScrollTrigger
          [@fadeInUp]
        >
          <span class="text-electric-violet text-sm font-semibold uppercase tracking-widest mb-4 block">
            Contatti
          </span>
          <h2 class="section-title gradient-text">
            Lavoriamo Insieme
          </h2>
          <p class="section-subtitle mx-auto mt-4">
            Hai un progetto in mente? Parliamone! Sono sempre aperto a nuove opportunità.
          </p>
        </div>

        <div class="grid lg:grid-cols-2 gap-12 items-start max-w-5xl mx-auto">
          <!-- Contact Info -->
          <div 
            class="space-y-8"
            appScrollTrigger
            [@fadeInLeft]
          >
            <h3 class="text-2xl font-bold text-white">
              Iniziamo una <span class="gradient-text">conversazione</span>
            </h3>
            
            <p class="text-gray-400">
              Che tu abbia una domanda, una proposta di lavoro o semplicemente voglia 
              salutare, sarò felice di sentirti. Rispondo generalmente entro 24 ore.
            </p>

            <!-- Contact Items -->
            <div class="space-y-6">
              <a 
                [href]="'mailto:' + personalInfo().email"
                class="flex items-center gap-4 p-4 rounded-xl glass-light hover:glass transition-all duration-300 group"
              >
                <div class="w-12 h-12 rounded-xl bg-electric-violet/20 flex items-center justify-center group-hover:bg-electric-violet/30 transition-colors">
                  <svg class="w-6 h-6 text-electric-violet" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                  </svg>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Email</p>
                  <p class="text-white font-medium">{{ personalInfo().email }}</p>
                </div>
              </a>

              <div class="flex items-center gap-4 p-4 rounded-xl glass-light">
                <div class="w-12 h-12 rounded-xl bg-soft-cyan/20 flex items-center justify-center">
                  <svg class="w-6 h-6 text-soft-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                  </svg>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Location</p>
                  <p class="text-white font-medium">{{ personalInfo().location }}</p>
                </div>
              </div>
            </div>

            <!-- Social Links -->
            <div>
              <p class="text-gray-500 mb-4">Seguimi su</p>
              <div class="flex gap-4">
                @for (social of personalInfo().socials; track social.name) {
                  <a 
                    [href]="social.url"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="w-12 h-12 rounded-xl glass-light flex items-center justify-center hover:bg-electric-violet/30 transition-all duration-300"
                    [attr.aria-label]="social.name"
                  >
                    <svg class="w-5 h-5 text-gray-400 hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                      @switch (social.icon) {
                        @case ('github') {
                          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                        }
                        @case ('linkedin') {
                          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                        }
                        @case ('twitter') {
                          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                        }
                        @default {
                          <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                        }
                      }
                    </svg>
                  </a>
                }
              </div>
            </div>
          </div>

          <!-- Contact Form -->
          <div 
            class="p-8 rounded-2xl glass"
            appScrollTrigger
            [@fadeInRight]
          >
            <form [formGroup]="contactForm" (ngSubmit)="onSubmit()">
              <!-- Name Field -->
              <div class="mb-6">
                <label for="name" class="block text-sm font-medium text-gray-400 mb-2">
                  Nome
                </label>
                <input
                  type="text"
                  id="name"
                  formControlName="name"
                  class="w-full px-4 py-3 rounded-xl bg-deep-indigo-800/50 border-2 text-white placeholder-gray-500 focus:outline-none transition-colors"
                  [class.border-gray-700]="!isFieldInvalid('name')"
                  [class.border-red-500]="isFieldInvalid('name')"
                  [class.focus:border-electric-violet]="!isFieldInvalid('name')"
                  placeholder="Il tuo nome"
                >
                @if (isFieldInvalid('name')) {
                  <p class="mt-1 text-sm text-red-500">Il nome è obbligatorio</p>
                }
              </div>

              <!-- Email Field -->
              <div class="mb-6">
                <label for="email" class="block text-sm font-medium text-gray-400 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  formControlName="email"
                  class="w-full px-4 py-3 rounded-xl bg-deep-indigo-800/50 border-2 text-white placeholder-gray-500 focus:outline-none transition-colors"
                  [class.border-gray-700]="!isFieldInvalid('email')"
                  [class.border-red-500]="isFieldInvalid('email')"
                  [class.focus:border-electric-violet]="!isFieldInvalid('email')"
                  placeholder="La tua email"
                >
                @if (isFieldInvalid('email')) {
                  <p class="mt-1 text-sm text-red-500">
                    @if (contactForm.get('email')?.errors?.['required']) {
                      L'email è obbligatoria
                    } @else {
                      Inserisci un'email valida
                    }
                  </p>
                }
              </div>

              <!-- Message Field -->
              <div class="mb-6">
                <label for="message" class="block text-sm font-medium text-gray-400 mb-2">
                  Messaggio
                </label>
                <textarea
                  id="message"
                  formControlName="message"
                  rows="5"
                  class="w-full px-4 py-3 rounded-xl bg-deep-indigo-800/50 border-2 text-white placeholder-gray-500 focus:outline-none transition-colors resize-none"
                  [class.border-gray-700]="!isFieldInvalid('message')"
                  [class.border-red-500]="isFieldInvalid('message')"
                  [class.focus:border-electric-violet]="!isFieldInvalid('message')"
                  placeholder="Il tuo messaggio..."
                ></textarea>
                @if (isFieldInvalid('message')) {
                  <p class="mt-1 text-sm text-red-500">Il messaggio è obbligatorio</p>
                }
              </div>

              <!-- Submit Button -->
              <button
                type="submit"
                [disabled]="formStatus() === 'sending'"
                class="w-full btn-primary flex items-center justify-center gap-2"
                [class.opacity-70]="formStatus() === 'sending'"
              >
                @switch (formStatus()) {
                  @case ('sending') {
                    <svg class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Invio in corso...</span>
                  }
                  @case ('success') {
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                    </svg>
                    <span>Messaggio inviato!</span>
                  }
                  @default {
                    <span>Invia Messaggio</span>
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
                    </svg>
                  }
                }
              </button>
            </form>

            <!-- Success message with confetti -->
            @if (formStatus() === 'success') {
              <div class="mt-4 p-4 rounded-xl bg-green-500/20 border border-green-500/30">
                <p class="text-green-400 text-center">
                  🎉 Grazie per il tuo messaggio! Ti risponderò presto.
                </p>
              </div>
            }

            @if (formStatus() === 'error') {
              <div class="mt-4 p-4 rounded-xl bg-red-500/20 border border-red-500/30">
                <p class="text-red-400 text-center">
                  ❌ Si è verificato un errore. Riprova più tardi.
                </p>
              </div>
            }
          </div>
        </div>
      </div>

      <!-- Confetti Effect -->
      @if (showConfetti()) {
        <div class="fixed inset-0 pointer-events-none z-50">
          @for (confetti of confettiPieces; track $index) {
            <div 
              class="absolute w-3 h-3 rounded-sm animate-confetti"
              [style.left.%]="confetti.left"
              [style.background-color]="confetti.color"
              [style.animation-delay.ms]="confetti.delay"
            ></div>
          }
        </div>
      }
    </section>
  `,
  styles: [`
    :host {
      display: block;
    }
    
    @keyframes confetti {
      0% {
        transform: translateY(-100vh) rotate(0deg);
        opacity: 1;
      }
      100% {
        transform: translateY(100vh) rotate(720deg);
        opacity: 0;
      }
    }
    
    .animate-confetti {
      animation: confetti 3s ease-out forwards;
    }
  `]
})
export class ContactComponent {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);
  private readonly portfolioService = inject(PortfolioService);
  private readonly fb = inject(FormBuilder);

  readonly personalInfo = this.portfolioService.personalInfo;
  readonly formStatus = signal<FormStatus>('idle');
  readonly showConfetti = signal(false);

  readonly contactForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    message: ['', [Validators.required, Validators.minLength(10)]]
  });

  readonly confettiPieces = Array.from({ length: 50 }, () => ({
    left: Math.random() * 100,
    color: ['#9D4EDD', '#00D9FF', '#00B8CC', '#F43F5E', '#F59E0B'][Math.floor(Math.random() * 5)],
    delay: Math.random() * 1000
  }));

  isFieldInvalid(fieldName: string): boolean {
    const field = this.contactForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  async onSubmit(): Promise<void> {
    if (this.contactForm.invalid) {
      Object.keys(this.contactForm.controls).forEach(key => {
        this.contactForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.formStatus.set('sending');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      this.formStatus.set('success');
      this.contactForm.reset();
      
      // Show confetti
      if (this.isBrowser) {
        this.showConfetti.set(true);
        setTimeout(() => this.showConfetti.set(false), 3000);
      }

      // Reset status after a while
      setTimeout(() => this.formStatus.set('idle'), 5000);
    } catch (error) {
      this.formStatus.set('error');
      setTimeout(() => this.formStatus.set('idle'), 5000);
    }
  }
}
