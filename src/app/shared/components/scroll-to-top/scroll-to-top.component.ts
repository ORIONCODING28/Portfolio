import { 
  Component, 
  ChangeDetectionStrategy, 
  inject, 
  computed 
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollService } from '../../../core/services/scroll.service';
import { fadeIn } from '../../animations';

@Component({
  selector: 'app-scroll-to-top',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeIn],
  template: `
    @if (isVisible()) {
      <button
        (click)="scrollToTop()"
        [@fadeIn]
        class="fixed bottom-8 right-8 z-50 group"
        aria-label="Scroll to top"
      >
        <div class="relative">
          <!-- Progress ring -->
          <svg 
            class="w-14 h-14 -rotate-90"
            viewBox="0 0 36 36"
          >
            <circle
              class="stroke-white/10"
              stroke-width="2"
              fill="none"
              r="16"
              cx="18"
              cy="18"
            />
            <circle
              class="stroke-electric-violet transition-all duration-300"
              stroke-width="2"
              fill="none"
              r="16"
              cx="18"
              cy="18"
              [attr.stroke-dasharray]="circumference"
              [attr.stroke-dashoffset]="strokeDashoffset()"
              stroke-linecap="round"
            />
          </svg>
          
          <!-- Button -->
          <div 
            class="absolute inset-0 m-auto w-10 h-10 rounded-full glass flex items-center justify-center
                   group-hover:bg-electric-violet/20 transition-colors duration-300"
          >
            <svg 
              class="w-5 h-5 text-white group-hover:text-electric-violet transition-colors"
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                stroke-linecap="round" 
                stroke-linejoin="round" 
                stroke-width="2" 
                d="M5 10l7-7m0 0l7 7m-7-7v18"
              />
            </svg>
          </div>

          <!-- Progress percentage -->
          <div 
            class="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            {{ scrollPercentage() }}%
          </div>
        </div>
      </button>
    }
  `
})
export class ScrollToTopComponent {
  private readonly scrollService = inject(ScrollService);
  
  readonly circumference = 2 * Math.PI * 16; // 2πr where r=16

  readonly isVisible = computed(() => !this.scrollService.isAtTop());
  
  readonly scrollPercentage = computed(() => 
    Math.round(this.scrollService.scrollProgress())
  );

  readonly strokeDashoffset = computed(() => {
    const progress = this.scrollService.scrollProgress() / 100;
    return this.circumference * (1 - progress);
  });

  scrollToTop(): void {
    this.scrollService.scrollToTop();
  }
}
