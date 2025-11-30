import { 
  Component, 
  ChangeDetectionStrategy, 
  inject, 
  signal,
  PLATFORM_ID,
  ElementRef,
  viewChild,
  AfterViewInit,
  OnDestroy
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { PortfolioService } from '../../core/services/portfolio.service';
import { Testimonial } from '../../core/models/portfolio.models';
import { ScrollTriggerDirective } from '../../shared/directives/scroll-trigger.directive';
import { fadeInUp } from '../../shared/animations/animations';

@Component({
  selector: 'app-testimonials',
  standalone: true,
  imports: [CommonModule, ScrollTriggerDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeInUp],
  template: `
    <section id="testimonials" class="section relative overflow-hidden">
      <!-- Background -->
      <div class="absolute inset-0 z-0">
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-electric-violet/5 rounded-full blur-3xl"></div>
      </div>

      <div class="container-custom relative z-10">
        <!-- Section Header -->
        <div 
          class="text-center mb-16"
          appScrollTrigger
          [@fadeInUp]
        >
          <span class="text-electric-violet text-sm font-semibold uppercase tracking-widest mb-4 block">
            Testimonianze
          </span>
          <h2 class="section-title gradient-text">
            Cosa Dicono di Me
          </h2>
          <p class="section-subtitle mx-auto mt-4">
            Feedback dai clienti e colleghi con cui ho collaborato
          </p>
        </div>

        <!-- Testimonials Carousel -->
        <div class="relative">
          <!-- Carousel Container -->
          <div 
            #carouselContainer
            class="flex gap-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-4 -mx-4 px-4"
            (mousedown)="startDrag($event)"
            (mousemove)="onDrag($event)"
            (mouseup)="endDrag()"
            (mouseleave)="endDrag()"
            (touchstart)="startDrag($event)"
            (touchmove)="onDrag($event)"
            (touchend)="endDrag()"
          >
            @for (testimonial of testimonials(); track testimonial.id; let i = $index) {
              <div 
                class="flex-shrink-0 w-full md:w-[400px] snap-center"
              >
                <div 
                  class="h-full p-8 rounded-2xl glass hover:glass-light transition-all duration-300"
                  appScrollTrigger
                  [threshold]="0.3"
                  [@fadeInUp]
                >
                  <!-- Quote icon -->
                  <div class="text-4xl text-electric-violet/30 mb-4">"</div>
                  
                  <!-- Content -->
                  <p class="text-gray-300 mb-6 leading-relaxed italic">
                    {{ testimonial.content }}
                  </p>
                  
                  <!-- Rating -->
                  <div class="flex gap-1 mb-6">
                    @for (star of [1,2,3,4,5]; track star) {
                      <svg 
                        class="w-5 h-5 transition-colors duration-300"
                        [class.text-yellow-400]="star <= testimonial.rating"
                        [class.text-gray-600]="star > testimonial.rating"
                        fill="currentColor" 
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                      </svg>
                    }
                  </div>
                  
                  <!-- Author -->
                  <div class="flex items-center gap-4">
                    <div class="w-14 h-14 rounded-full bg-gradient-to-br from-electric-violet to-soft-cyan flex items-center justify-center">
                      <span class="text-xl font-bold text-white">
                        {{ getInitials(testimonial.name) }}
                      </span>
                    </div>
                    <div>
                      <h4 class="font-semibold text-white">{{ testimonial.name }}</h4>
                      <p class="text-sm text-gray-500">
                        {{ testimonial.role }} &#64; {{ testimonial.company }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            }
          </div>

          <!-- Navigation arrows -->
          <button 
            (click)="scrollCarousel('left')"
            class="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-12 h-12 rounded-full glass items-center justify-center hover:bg-electric-violet/30 transition-colors"
            aria-label="Previous"
          >
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
            </svg>
          </button>
          
          <button 
            (click)="scrollCarousel('right')"
            class="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-12 h-12 rounded-full glass items-center justify-center hover:bg-electric-violet/30 transition-colors"
            aria-label="Next"
          >
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
            </svg>
          </button>
        </div>

        <!-- Dots indicator -->
        <div class="flex justify-center gap-2 mt-8">
          @for (testimonial of testimonials(); track testimonial.id; let i = $index) {
            <button
              (click)="goToSlide(i)"
              class="w-2 h-2 rounded-full transition-all duration-300"
              [class.bg-electric-violet]="currentSlide() === i"
              [class.w-8]="currentSlide() === i"
              [class.bg-gray-600]="currentSlide() !== i"
              [attr.aria-label]="'Go to slide ' + (i + 1)"
            ></button>
          }
        </div>
      </div>
    </section>
  `,
  styles: [`
    :host {
      display: block;
    }
    
    .scrollbar-hide {
      -ms-overflow-style: none;
      scrollbar-width: none;
    }
    
    .scrollbar-hide::-webkit-scrollbar {
      display: none;
    }
  `]
})
export class TestimonialsComponent implements AfterViewInit, OnDestroy {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);
  private readonly portfolioService = inject(PortfolioService);

  readonly carouselContainer = viewChild<ElementRef<HTMLDivElement>>('carouselContainer');
  readonly testimonials = this.portfolioService.testimonials;
  readonly currentSlide = signal(0);

  private isDragging = false;
  private startX = 0;
  private scrollLeft = 0;
  private autoplayInterval: ReturnType<typeof setInterval> | null = null;

  ngAfterViewInit(): void {
    if (this.isBrowser) {
      this.startAutoplay();
    }
  }

  ngOnDestroy(): void {
    if (this.autoplayInterval) {
      clearInterval(this.autoplayInterval);
    }
  }

  private startAutoplay(): void {
    this.autoplayInterval = setInterval(() => {
      const next = (this.currentSlide() + 1) % this.testimonials().length;
      this.goToSlide(next);
    }, 5000);
  }

  private resetAutoplay(): void {
    if (this.autoplayInterval) {
      clearInterval(this.autoplayInterval);
    }
    this.startAutoplay();
  }

  startDrag(event: MouseEvent | TouchEvent): void {
    this.isDragging = true;
    const container = this.carouselContainer()?.nativeElement;
    if (!container) return;
    
    const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX;
    this.startX = clientX - container.offsetLeft;
    this.scrollLeft = container.scrollLeft;
    container.style.cursor = 'grabbing';
  }

  onDrag(event: MouseEvent | TouchEvent): void {
    if (!this.isDragging) return;
    event.preventDefault();
    
    const container = this.carouselContainer()?.nativeElement;
    if (!container) return;
    
    const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX;
    const x = clientX - container.offsetLeft;
    const walk = (x - this.startX) * 2;
    container.scrollLeft = this.scrollLeft - walk;
  }

  endDrag(): void {
    this.isDragging = false;
    const container = this.carouselContainer()?.nativeElement;
    if (container) {
      container.style.cursor = 'grab';
      this.updateCurrentSlide();
    }
    this.resetAutoplay();
  }

  private updateCurrentSlide(): void {
    const container = this.carouselContainer()?.nativeElement;
    if (!container) return;
    
    const cardWidth = 400 + 24; // card width + gap
    const index = Math.round(container.scrollLeft / cardWidth);
    this.currentSlide.set(Math.min(index, this.testimonials().length - 1));
  }

  scrollCarousel(direction: 'left' | 'right'): void {
    const container = this.carouselContainer()?.nativeElement;
    if (!container) return;
    
    const cardWidth = 400 + 24;
    const scrollAmount = direction === 'left' ? -cardWidth : cardWidth;
    
    container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    
    setTimeout(() => this.updateCurrentSlide(), 300);
    this.resetAutoplay();
  }

  goToSlide(index: number): void {
    const container = this.carouselContainer()?.nativeElement;
    if (!container) return;
    
    const cardWidth = 400 + 24;
    container.scrollTo({ left: cardWidth * index, behavior: 'smooth' });
    this.currentSlide.set(index);
    this.resetAutoplay();
  }

  getInitials(name: string): string {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }
}
