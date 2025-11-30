import { 
  Component, 
  ChangeDetectionStrategy, 
  inject, 
  signal,
  computed
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortfolioService } from '../../core/services/portfolio.service';
import { Project, ProjectCategory } from '../../core/models/portfolio.models';
import { ProjectCardComponent } from './components/project-card/project-card.component';
import { ScrollTriggerDirective } from '../../shared/directives/scroll-trigger.directive';
import { fadeInUp, staggerFadeIn } from '../../shared/animations/animations';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, ProjectCardComponent, ScrollTriggerDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeInUp, staggerFadeIn],
  template: `
    <section id="projects" class="section relative overflow-hidden">
      <!-- Background -->
      <div class="absolute inset-0 z-0">
        <div class="absolute top-1/3 left-0 w-96 h-96 bg-electric-violet/10 rounded-full blur-3xl"></div>
        <div class="absolute bottom-1/3 right-0 w-96 h-96 bg-soft-cyan/10 rounded-full blur-3xl"></div>
      </div>

      <div class="container-custom relative z-10">
        <!-- Section Header -->
        <div 
          class="text-center mb-16"
          appScrollTrigger
          [@fadeInUp]
        >
          <span class="text-electric-violet text-sm font-semibold uppercase tracking-widest mb-4 block">
            Portfolio
          </span>
          <h2 class="section-title gradient-text">
            I Miei Progetti
          </h2>
          <p class="section-subtitle mx-auto mt-4">
            Una selezione dei progetti più significativi su cui ho lavorato
          </p>
        </div>

        <!-- Filters -->
        <div 
          class="flex justify-center gap-2 mb-12 flex-wrap"
          appScrollTrigger
          [@fadeInUp]
        >
          <button
            (click)="activeFilter.set('all')"
            class="px-6 py-2 rounded-full text-sm font-medium transition-all duration-300"
            [class.bg-electric-violet]="activeFilter() === 'all'"
            [class.text-white]="activeFilter() === 'all'"
            [class.glass-light]="activeFilter() !== 'all'"
            [class.text-gray-400]="activeFilter() !== 'all'"
            [class.hover:text-white]="activeFilter() !== 'all'"
          >
            Tutti
          </button>
          @for (filter of filters; track filter.id) {
            <button
              (click)="activeFilter.set(filter.id)"
              class="px-6 py-2 rounded-full text-sm font-medium transition-all duration-300"
              [class.bg-electric-violet]="activeFilter() === filter.id"
              [class.text-white]="activeFilter() === filter.id"
              [class.glass-light]="activeFilter() !== filter.id"
              [class.text-gray-400]="activeFilter() !== filter.id"
              [class.hover:text-white]="activeFilter() !== filter.id"
            >
              {{ filter.label }}
            </button>
          }
        </div>

        <!-- Projects Grid -->
        <div 
          class="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          [@staggerFadeIn]="filteredProjects().length"
        >
          @for (project of filteredProjects(); track project.id) {
            <app-project-card 
              [project]="project"
              (selected)="openProjectModal($event)"
            />
          }
        </div>

        <!-- View All CTA -->
        @if (hasMoreProjects()) {
          <div class="text-center mt-12">
            <button 
              (click)="showAll.set(true)"
              class="btn-secondary"
            >
              Vedi tutti i progetti
            </button>
          </div>
        }
      </div>

      <!-- Project Modal -->
      @if (selectedProject()) {
        <div 
          class="fixed inset-0 z-50 flex items-center justify-center p-4"
          (click)="closeModal()"
        >
          <!-- Backdrop -->
          <div class="absolute inset-0 bg-deep-indigo/90 backdrop-blur-sm"></div>
          
          <!-- Modal Content -->
          <div 
            class="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl glass-dark"
            (click)="$event.stopPropagation()"
            [@fadeInUp]
          >
            <!-- Close button -->
            <button 
              (click)="closeModal()"
              class="absolute top-4 right-4 p-2 rounded-full glass-light hover:bg-electric-violet/30 transition-colors z-10"
              aria-label="Chiudi"
            >
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>

            <!-- Project Image -->
            <div class="aspect-video bg-gradient-to-br from-electric-violet/20 to-soft-cyan/20 flex items-center justify-center">
              <span class="text-6xl">{{ getProjectEmoji(selectedProject()!.category) }}</span>
            </div>

            <!-- Project Details -->
            <div class="p-8">
              <span class="text-electric-violet text-sm font-medium uppercase tracking-wider">
                {{ selectedProject()!.category }}
              </span>
              
              <h3 class="text-3xl font-bold text-white mt-2 mb-4">
                {{ selectedProject()!.title }}
              </h3>
              
              <p class="text-gray-300 mb-6 leading-relaxed">
                {{ selectedProject()!.description }}
              </p>

              <!-- Highlights -->
              @if (selectedProject()!.highlights?.length) {
                <div class="mb-6">
                  <h4 class="text-lg font-semibold text-white mb-3">Highlights</h4>
                  <ul class="space-y-2">
                    @for (highlight of selectedProject()!.highlights; track highlight) {
                      <li class="flex items-start gap-2 text-gray-400">
                        <svg class="w-5 h-5 text-electric-violet mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                        </svg>
                        <span>{{ highlight }}</span>
                      </li>
                    }
                  </ul>
                </div>
              }

              <!-- Metrics -->
              @if (selectedProject()!.metrics?.length) {
                <div class="grid grid-cols-3 gap-4 mb-6">
                  @for (metric of selectedProject()!.metrics; track metric.label) {
                    <div class="text-center p-4 rounded-xl glass-light">
                      <div class="text-2xl font-bold gradient-text">
                        {{ metric.prefix || '' }}{{ metric.value }}{{ metric.suffix || '' }}
                      </div>
                      <div class="text-sm text-gray-400">{{ metric.label }}</div>
                    </div>
                  }
                </div>
              }

              <!-- Tech Stack -->
              <div class="mb-8">
                <h4 class="text-lg font-semibold text-white mb-3">Tecnologie</h4>
                <div class="flex flex-wrap gap-2">
                  @for (tech of selectedProject()!.technologies; track tech) {
                    <span class="px-3 py-1.5 rounded-lg bg-electric-violet/20 text-sm text-electric-violet">
                      {{ tech }}
                    </span>
                  }
                </div>
              </div>

              <!-- Actions -->
              <div class="flex gap-4">
                @if (selectedProject()!.liveUrl) {
                  <a 
                    [href]="selectedProject()!.liveUrl" 
                    target="_blank"
                    rel="noopener noreferrer"
                    class="btn-primary flex items-center gap-2"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                    </svg>
                    Vedi Live
                  </a>
                }
                @if (selectedProject()!.githubUrl) {
                  <a 
                    [href]="selectedProject()!.githubUrl" 
                    target="_blank"
                    rel="noopener noreferrer"
                    class="btn-secondary flex items-center gap-2"
                  >
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                    GitHub
                  </a>
                }
              </div>
            </div>
          </div>
        </div>
      }
    </section>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class ProjectsComponent {
  private readonly portfolioService = inject(PortfolioService);

  readonly projects = this.portfolioService.projects;
  readonly activeFilter = signal<ProjectCategory | 'all'>('all');
  readonly showAll = signal(false);
  readonly selectedProject = signal<Project | null>(null);

  readonly filters: { id: ProjectCategory; label: string }[] = [
    { id: 'frontend', label: 'Frontend' },
    { id: 'backend', label: 'Backend' },
    { id: 'fullstack', label: 'Full Stack' },
    { id: 'mobile', label: 'Mobile' },
    { id: 'design', label: 'Design' }
  ];

  readonly filteredProjects = computed(() => {
    const filter = this.activeFilter();
    const all = this.projects();
    const filtered = filter === 'all' 
      ? all 
      : all.filter(p => p.category === filter);
    
    return this.showAll() ? filtered : filtered.slice(0, 6);
  });

  readonly hasMoreProjects = computed(() => {
    const filter = this.activeFilter();
    const all = this.projects();
    const count = filter === 'all' 
      ? all.length 
      : all.filter(p => p.category === filter).length;
    
    return count > 6 && !this.showAll();
  });

  openProjectModal(project: Project): void {
    this.selectedProject.set(project);
    document.body.style.overflow = 'hidden';
  }

  closeModal(): void {
    this.selectedProject.set(null);
    document.body.style.overflow = '';
  }

  getProjectEmoji(category: ProjectCategory): string {
    const emojis: Record<ProjectCategory, string> = {
      'frontend': '🎨',
      'backend': '⚙️',
      'fullstack': '🚀',
      'mobile': '📱',
      'design': '✨',
      'other': '💡'
    };
    return emojis[category] || '💻';
  }
}
