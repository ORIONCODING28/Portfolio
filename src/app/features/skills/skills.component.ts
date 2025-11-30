import { 
  Component, 
  ChangeDetectionStrategy, 
  inject, 
  signal,
  computed
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortfolioService } from '../../core/services/portfolio.service';
import { SkillCategory } from '../../core/models/portfolio.models';
import { ScrollTriggerDirective } from '../../shared/directives/scroll-trigger.directive';
import { MouseTrackDirective } from '../../shared/directives/mouse-track.directive';
import { fadeInUp, staggerScaleIn } from '../../shared/animations/animations';

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [CommonModule, ScrollTriggerDirective, MouseTrackDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeInUp, staggerScaleIn],
  template: `
    <section id="skills" class="section relative overflow-hidden">
      <!-- Background -->
      <div class="absolute inset-0 z-0">
        <div class="absolute top-0 left-1/3 w-96 h-96 bg-soft-cyan/10 rounded-full blur-3xl"></div>
        <div class="absolute bottom-0 right-1/3 w-80 h-80 bg-electric-violet/10 rounded-full blur-3xl"></div>
      </div>

      <div class="container-custom relative z-10">
        <!-- Section Header -->
        <div 
          class="text-center mb-16"
          appScrollTrigger
          [@fadeInUp]
        >
          <span class="text-electric-violet text-sm font-semibold uppercase tracking-widest mb-4 block">
            Competenze
          </span>
          <h2 class="section-title gradient-text">
            Skills Laboratory
          </h2>
          <p class="section-subtitle mx-auto mt-4">
            Le tecnologie e competenze che utilizzo quotidianamente
          </p>
        </div>

        <!-- Search -->
        <div 
          class="max-w-md mx-auto mb-8"
          appScrollTrigger
          [@fadeInUp]
        >
          <div class="relative">
            <input
              type="text"
              [value]="searchQuery()"
              (input)="searchQuery.set($any($event.target).value)"
              placeholder="Cerca una skill..."
              class="w-full px-6 py-4 pl-12 rounded-full glass-light text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-electric-violet/50 transition-all"
            >
            <svg 
              class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500"
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
          </div>
        </div>

        <!-- Category Tabs -->
        <div 
          class="flex justify-center gap-2 mb-12 flex-wrap"
          appScrollTrigger
          [@fadeInUp]
        >
          @for (category of categories; track category.id) {
            <button
              (click)="activeCategory.set(category.id)"
              class="px-6 py-3 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-2"
              [class.bg-electric-violet]="activeCategory() === category.id"
              [class.text-white]="activeCategory() === category.id"
              [class.shadow-glow-violet]="activeCategory() === category.id"
              [class.glass-light]="activeCategory() !== category.id"
              [class.text-gray-400]="activeCategory() !== category.id"
              [class.hover:text-white]="activeCategory() !== category.id"
            >
              <span class="text-lg">{{ category.icon }}</span>
              <span>{{ category.label }}</span>
              <span 
                class="px-2 py-0.5 rounded-full text-xs"
                [class.bg-white/20]="activeCategory() === category.id"
                [class.bg-white/10]="activeCategory() !== category.id"
              >
                {{ getSkillCount(category.id) }}
              </span>
            </button>
          }
        </div>

        <!-- Skills Grid - 3D Layout -->
        <div 
          class="perspective-1000"
          [@staggerScaleIn]="filteredSkills().length"
        >
          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            @for (skill of filteredSkills(); track skill.id) {
              <div 
                class="group preserve-3d"
                appMouseTrack
                [intensity]="15"
                [scale]="1.05"
              >
                <div 
                  class="relative p-6 rounded-2xl transition-all duration-500"
                  [class]="getCategoryGradient(skill.category)"
                >
                  <!-- Skill Icon -->
                  <div class="w-16 h-16 mx-auto mb-4 rounded-xl bg-white/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <span class="text-3xl">{{ getSkillEmoji(skill.icon) }}</span>
                  </div>
                  
                  <!-- Skill Name -->
                  <h3 class="text-lg font-bold text-white text-center mb-2">
                    {{ skill.name }}
                  </h3>
                  
                  <!-- Skill Level -->
                  <div class="relative h-2 bg-white/10 rounded-full overflow-hidden mb-2">
                    <div 
                      class="absolute inset-y-0 left-0 bg-white/80 rounded-full transition-all duration-1000"
                      [style.width.%]="skill.level"
                    ></div>
                  </div>
                  
                  <div class="flex justify-between text-xs text-white/60">
                    <span>Competenza</span>
                    <span class="font-medium text-white">{{ skill.level }}%</span>
                  </div>
                  
                  <!-- Hover description -->
                  <div class="mt-4 pt-4 border-t border-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <p class="text-sm text-white/80 text-center">
                      {{ skill.description }}
                    </p>
                  </div>
                </div>
              </div>
            }
          </div>
        </div>

        <!-- Empty state -->
        @if (filteredSkills().length === 0) {
          <div class="text-center py-12">
            <div class="text-4xl mb-4">🔍</div>
            <p class="text-gray-400">Nessuna skill trovata per "{{ searchQuery() }}"</p>
          </div>
        }

        <!-- Legend -->
        <div class="mt-16 flex justify-center gap-8 flex-wrap">
          @for (category of categories; track category.id) {
            <div class="flex items-center gap-2">
              <div 
                class="w-4 h-4 rounded-full"
                [class]="getCategoryColor(category.id)"
              ></div>
              <span class="text-sm text-gray-400">{{ category.label }}</span>
            </div>
          }
        </div>
      </div>
    </section>
  `,
  styles: [`
    :host {
      display: block;
    }
    
    .perspective-1000 {
      perspective: 1000px;
    }
    
    .preserve-3d {
      transform-style: preserve-3d;
    }
    
    .shadow-glow-violet {
      box-shadow: 0 0 30px rgba(157, 78, 221, 0.4);
    }
  `]
})
export class SkillsComponent {
  private readonly portfolioService = inject(PortfolioService);

  readonly skills = this.portfolioService.skills;
  readonly activeCategory = signal<SkillCategory>('frontend');
  readonly searchQuery = signal('');

  readonly categories: { id: SkillCategory; label: string; icon: string }[] = [
    { id: 'frontend', label: 'Frontend', icon: '🎨' },
    { id: 'backend', label: 'Backend', icon: '⚙️' },
    { id: 'tools', label: 'Tools', icon: '🛠️' },
    { id: 'soft', label: 'Soft Skills', icon: '💡' }
  ];

  readonly filteredSkills = computed(() => {
    const query = this.searchQuery().toLowerCase();
    const category = this.activeCategory();
    
    return this.skills().filter(skill => {
      const matchesCategory = skill.category === category;
      const matchesSearch = query === '' || 
        skill.name.toLowerCase().includes(query) ||
        skill.description?.toLowerCase().includes(query);
      
      return matchesCategory && matchesSearch;
    });
  });

  getSkillCount(category: SkillCategory): number {
    return this.skills().filter(s => s.category === category).length;
  }

  getCategoryGradient(category: SkillCategory): string {
    const gradients: Record<SkillCategory, string> = {
      'frontend': 'glass bg-gradient-to-br from-electric-violet/20 to-soft-cyan/10',
      'backend': 'glass bg-gradient-to-br from-teal/20 to-electric-violet/10',
      'tools': 'glass bg-gradient-to-br from-soft-cyan/20 to-teal/10',
      'soft': 'glass bg-gradient-to-br from-electric-violet/20 to-teal/10'
    };
    return gradients[category];
  }

  getCategoryColor(category: SkillCategory): string {
    const colors: Record<SkillCategory, string> = {
      'frontend': 'bg-electric-violet',
      'backend': 'bg-teal',
      'tools': 'bg-soft-cyan',
      'soft': 'bg-gradient-to-r from-electric-violet to-teal'
    };
    return colors[category];
  }

  getSkillEmoji(icon: string): string {
    const emojiMap: Record<string, string> = {
      'angular': '🅰️',
      'typescript': '📘',
      'react': '⚛️',
      'tailwind': '🎨',
      'sass': '💅',
      'threejs': '🎮',
      'nodejs': '🟢',
      'python': '🐍',
      'postgresql': '🐘',
      'mongodb': '🍃',
      'graphql': '💠',
      'git': '📦',
      'docker': '🐳',
      'vscode': '💻',
      'figma': '🎯',
      'jira': '📋',
      'chat': '💬',
      'users': '👥',
      'lightbulb': '💡',
      'award': '🏆'
    };
    return emojiMap[icon] || '⚡';
  }
}
