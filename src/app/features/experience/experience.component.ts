import { 
  Component, 
  ChangeDetectionStrategy, 
  inject, 
  signal,
  computed
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortfolioService } from '../../core/services/portfolio.service';
import { ScrollTriggerDirective } from '../../shared/directives/scroll-trigger.directive';
import { fadeInUp, fadeInLeft, fadeInRight } from '../../shared/animations/animations';

@Component({
  selector: 'app-experience',
  standalone: true,
  imports: [CommonModule, ScrollTriggerDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeInUp, fadeInLeft, fadeInRight],
  template: `
    <section id="experience" class="section relative overflow-hidden">
      <!-- Background -->
      <div class="absolute inset-0 z-0">
        <div class="absolute top-1/4 right-1/4 w-80 h-80 bg-electric-violet/10 rounded-full blur-3xl"></div>
        <div class="absolute bottom-1/4 left-1/4 w-96 h-96 bg-teal/10 rounded-full blur-3xl"></div>
      </div>

      <div class="container-custom relative z-10">
        <!-- Section Header -->
        <div 
          class="text-center mb-16"
          appScrollTrigger
          [@fadeInUp]
        >
          <span class="text-electric-violet text-sm font-semibold uppercase tracking-widest mb-4 block">
            Carriera
          </span>
          <h2 class="section-title gradient-text">
            Esperienza Professionale
          </h2>
          <p class="section-subtitle mx-auto mt-4">
            Il mio percorso professionale nel mondo dello sviluppo software
          </p>
        </div>

        <!-- Experience Timeline -->
        <div class="relative max-w-4xl mx-auto">
          <!-- Timeline line -->
          <div class="absolute left-0 md:left-1/2 md:transform md:-translate-x-1/2 w-1 h-full">
            <div class="w-full h-full bg-gradient-to-b from-electric-violet via-soft-cyan to-teal rounded-full"></div>
          </div>

          <!-- Experience Items -->
          <div class="space-y-12">
            @for (exp of experiences(); track exp.id; let i = $index) {
              <div 
                class="relative flex items-start gap-8"
                [class.md:flex-row-reverse]="i % 2 === 1"
                appScrollTrigger
                [threshold]="0.2"
              >
                <!-- Timeline dot -->
                <div 
                  class="absolute left-0 md:left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full z-10"
                  [class.bg-electric-violet]="exp.current"
                  [class.bg-soft-cyan]="!exp.current"
                >
                  @if (exp.current) {
                    <span class="absolute inset-0 rounded-full bg-electric-violet animate-ping opacity-50"></span>
                  }
                </div>

                <!-- Content card -->
                <div 
                  class="ml-8 md:ml-0 md:w-[calc(50%-2rem)]"
                  [class.md:text-right]="i % 2 === 0"
                  [@fadeInUp]
                >
                  <div 
                    class="p-6 rounded-2xl glass hover:glass-light transition-all duration-300"
                  >
                    <!-- Header -->
                    <div class="flex items-start justify-between gap-4 mb-4" [class.flex-row-reverse]="i % 2 === 0">
                      <div [class.text-right]="i % 2 === 0">
                        <h3 class="text-xl font-bold text-white">{{ exp.title }}</h3>
                        <p class="text-electric-violet font-medium">{{ exp.company }}</p>
                        <p class="text-gray-500 text-sm">{{ exp.location }}</p>
                      </div>
                      
                      <!-- Date badge -->
                      <div class="flex-shrink-0">
                        <span 
                          class="inline-block px-3 py-1 rounded-full text-xs font-medium"
                          [class.bg-electric-violet]="exp.current"
                          [class.text-white]="exp.current"
                          [class.glass-light]="!exp.current"
                          [class.text-gray-400]="!exp.current"
                        >
                          {{ formatDate(exp.startDate) }} - {{ exp.current ? 'Presente' : formatDate(exp.endDate!) }}
                        </span>
                      </div>
                    </div>

                    <!-- Description -->
                    <p class="text-gray-400 mb-4">{{ exp.description }}</p>

                    <!-- Achievements -->
                    <div class="space-y-2 mb-4">
                      @for (achievement of exp.achievements.slice(0, 3); track achievement) {
                        <div 
                          class="flex items-start gap-2"
                          [class.flex-row-reverse]="i % 2 === 0"
                        >
                          <svg class="w-4 h-4 text-soft-cyan mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                          </svg>
                          <span class="text-sm text-gray-400">{{ achievement }}</span>
                        </div>
                      }
                    </div>

                    <!-- Technologies -->
                    <div class="flex flex-wrap gap-2" [class.justify-end]="i % 2 === 0">
                      @for (tech of exp.technologies.slice(0, 5); track tech) {
                        <span class="px-2 py-1 rounded-md bg-deep-indigo-700/50 text-xs text-gray-300">
                          {{ tech }}
                        </span>
                      }
                    </div>
                  </div>
                </div>

                <!-- Empty space for layout -->
                <div class="hidden md:block md:w-[calc(50%-2rem)]"></div>
              </div>
            }
          </div>

          <!-- Timeline end indicator -->
          <div class="absolute left-0 md:left-1/2 md:transform md:-translate-x-1/2 bottom-0 w-4 h-4 rounded-full bg-teal">
            <span class="absolute inset-0 rounded-full bg-teal animate-pulse"></span>
          </div>
        </div>

        <!-- Education & Certifications -->
        <div class="mt-24">
          <h3 class="text-2xl font-bold text-center mb-12 text-white">
            Formazione & <span class="gradient-text">Certificazioni</span>
          </h3>
          
          <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            @for (edu of education; track edu.title) {
              <div 
                class="p-6 rounded-xl glass hover:glass-light transition-all duration-300"
                appScrollTrigger
                [@fadeInUp]
              >
                <div class="flex items-center gap-4 mb-4">
                  <div class="w-12 h-12 rounded-xl bg-electric-violet/20 flex items-center justify-center">
                    <span class="text-2xl">{{ edu.icon }}</span>
                  </div>
                  <div>
                    <h4 class="font-bold text-white">{{ edu.title }}</h4>
                    <p class="text-sm text-gray-500">{{ edu.institution }}</p>
                  </div>
                </div>
                <p class="text-gray-400 text-sm">{{ edu.description }}</p>
                <p class="text-electric-violet text-sm mt-2">{{ edu.year }}</p>
              </div>
            }
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class ExperienceComponent {
  private readonly portfolioService = inject(PortfolioService);

  readonly experiences = this.portfolioService.experiences;

  readonly education = [
    {
      title: 'Laurea in Informatica',
      institution: 'Università degli Studi',
      description: 'Laurea magistrale con focus su ingegneria del software e sistemi distribuiti.',
      year: '2017',
      icon: '🎓'
    },
    {
      title: 'Angular Expert Certification',
      institution: 'Angular University',
      description: 'Certificazione avanzata su Angular, RxJS e architetture enterprise.',
      year: '2023',
      icon: '📜'
    },
    {
      title: 'AWS Solutions Architect',
      institution: 'Amazon Web Services',
      description: 'Certificazione per la progettazione di architetture cloud scalabili.',
      year: '2022',
      icon: '☁️'
    }
  ];

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const months = ['Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu', 'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic'];
    return `${months[date.getMonth()]} ${date.getFullYear()}`;
  }
}
