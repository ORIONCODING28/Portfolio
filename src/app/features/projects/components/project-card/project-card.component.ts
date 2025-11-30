import { 
  Component, 
  ChangeDetectionStrategy, 
  inject, 
  signal,
  computed,
  input,
  output
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Project } from '../../../../core/models/portfolio.models';
import { MouseTrackDirective } from '../../../../shared/directives/mouse-track.directive';
import { cardHover, fadeIn } from '../../../../shared/animations/animations';

@Component({
  selector: 'app-project-card',
  standalone: true,
  imports: [CommonModule, MouseTrackDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [cardHover, fadeIn],
  template: `
    <article 
      class="group relative rounded-2xl overflow-hidden cursor-pointer h-full"
      (mouseenter)="isHovered.set(true)"
      (mouseleave)="isHovered.set(false)"
      appMouseTrack
      [intensity]="5"
      [@cardHover]="isHovered() ? 'hovered' : 'default'"
    >
      <!-- Image -->
      <div class="relative aspect-video overflow-hidden">
        <div 
          class="absolute inset-0 bg-gradient-to-br from-electric-violet/30 to-soft-cyan/30"
        ></div>
        
        <!-- Placeholder image -->
        <div class="w-full h-full bg-gradient-to-br from-deep-indigo-700 to-deep-indigo-900 flex items-center justify-center">
          <span class="text-4xl">{{ getProjectEmoji() }}</span>
        </div>
        
        <!-- Overlay -->
        <div 
          class="absolute inset-0 bg-gradient-to-t from-deep-indigo via-deep-indigo/50 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-300"
        ></div>

        <!-- Featured badge -->
        @if (project().featured) {
          <div class="absolute top-4 left-4 px-3 py-1 rounded-full bg-electric-violet/80 text-white text-xs font-medium">
            ⭐ Featured
          </div>
        }

        <!-- Quick actions -->
        <div 
          class="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0"
        >
          @if (project().liveUrl) {
            <a 
              [href]="project().liveUrl" 
              target="_blank"
              rel="noopener noreferrer"
              class="p-2 rounded-full glass-light hover:bg-electric-violet/30 transition-colors"
              (click)="$event.stopPropagation()"
              aria-label="Vedi live"
            >
              <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
              </svg>
            </a>
          }
          @if (project().githubUrl) {
            <a 
              [href]="project().githubUrl" 
              target="_blank"
              rel="noopener noreferrer"
              class="p-2 rounded-full glass-light hover:bg-electric-violet/30 transition-colors"
              (click)="$event.stopPropagation()"
              aria-label="Vedi su GitHub"
            >
              <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </a>
          }
        </div>
      </div>

      <!-- Content -->
      <div class="p-6 glass-dark">
        <!-- Category -->
        <span class="text-xs text-electric-violet font-medium uppercase tracking-wider">
          {{ project().category }}
        </span>
        
        <!-- Title -->
        <h3 class="text-xl font-bold text-white mt-2 mb-3 group-hover:text-electric-violet transition-colors">
          {{ project().title }}
        </h3>
        
        <!-- Description -->
        <p class="text-gray-400 text-sm line-clamp-2 mb-4">
          {{ project().shortDescription }}
        </p>
        
        <!-- Tech stack -->
        <div class="flex flex-wrap gap-2">
          @for (tech of project().technologies.slice(0, 4); track tech) {
            <span class="px-2 py-1 rounded-md bg-deep-indigo-700/50 text-xs text-gray-300">
              {{ tech }}
            </span>
          }
          @if (project().technologies.length > 4) {
            <span class="px-2 py-1 rounded-md bg-electric-violet/20 text-xs text-electric-violet">
              +{{ project().technologies.length - 4 }}
            </span>
          }
        </div>

        <!-- View more button -->
        <button 
          class="mt-4 flex items-center gap-2 text-sm text-gray-400 group-hover:text-electric-violet transition-colors"
          (click)="onSelect()"
        >
          <span>Scopri di più</span>
          <svg 
            class="w-4 h-4 transform group-hover:translate-x-1 transition-transform" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
          </svg>
        </button>
      </div>
    </article>
  `,
  styles: [`
    :host {
      display: block;
    }
    
    .line-clamp-2 {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  `]
})
export class ProjectCardComponent {
  project = input.required<Project>();
  selected = output<Project>();
  
  isHovered = signal(false);

  onSelect(): void {
    this.selected.emit(this.project());
  }

  getProjectEmoji(): string {
    const categoryEmojis: Record<string, string> = {
      'frontend': '🎨',
      'backend': '⚙️',
      'fullstack': '🚀',
      'mobile': '📱',
      'design': '✨',
      'other': '💡'
    };
    return categoryEmojis[this.project().category] || '💻';
  }
}
