import { Injectable, signal, computed, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { fromEvent, throttleTime, map, startWith } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { ScrollState } from '../models';

@Injectable({
  providedIn: 'root'
})
export class ScrollService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);
  
  // Scroll state signal
  readonly scrollState = signal<ScrollState>({
    scrollY: 0,
    scrollProgress: 0,
    direction: 'down',
    isAtTop: true,
    isAtBottom: false
  });

  // Previous scroll position for direction detection
  private previousScrollY = 0;

  // Observables
  private readonly scroll$ = this.isBrowser 
    ? fromEvent(window, 'scroll').pipe(
        throttleTime(16), // ~60fps
        map(() => this.calculateScrollState()),
        startWith(this.calculateScrollState())
      )
    : null;

  // Converted to signal
  readonly scrollSignal = this.scroll$ 
    ? toSignal(this.scroll$, { initialValue: this.calculateScrollState() })
    : signal(this.calculateScrollState());

  // Computed signals for convenience
  readonly scrollY = computed(() => this.scrollSignal().scrollY);
  readonly scrollProgress = computed(() => this.scrollSignal().scrollProgress);
  readonly scrollDirection = computed(() => this.scrollSignal().direction);
  readonly isAtTop = computed(() => this.scrollSignal().isAtTop);
  readonly isAtBottom = computed(() => this.scrollSignal().isAtBottom);

  private calculateScrollState(): ScrollState {
    if (!this.isBrowser) {
      return {
        scrollY: 0,
        scrollProgress: 0,
        direction: 'down',
        isAtTop: true,
        isAtBottom: false
      };
    }

    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const maxScroll = documentHeight - windowHeight;
    const scrollProgress = maxScroll > 0 ? (scrollY / maxScroll) * 100 : 0;
    
    const direction = scrollY > this.previousScrollY ? 'down' : 'up';
    this.previousScrollY = scrollY;

    return {
      scrollY,
      scrollProgress: Math.min(100, Math.max(0, scrollProgress)),
      direction,
      isAtTop: scrollY < 50,
      isAtBottom: scrollY >= maxScroll - 50
    };
  }

  // Smooth scroll to element
  scrollToElement(elementId: string, offset = 0): void {
    if (!this.isBrowser) return;
    
    const element = document.getElementById(elementId);
    if (element) {
      const top = element.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({
        top,
        behavior: 'smooth'
      });
    }
  }

  // Smooth scroll to top
  scrollToTop(): void {
    if (!this.isBrowser) return;
    
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  // Check if element is in viewport
  isElementInViewport(element: HTMLElement, threshold = 0.5): boolean {
    if (!this.isBrowser) return false;
    
    const rect = element.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    
    return (
      rect.top <= windowHeight * (1 - threshold) &&
      rect.bottom >= windowHeight * threshold
    );
  }

  // Get element visibility percentage
  getElementVisibility(element: HTMLElement): number {
    if (!this.isBrowser) return 0;
    
    const rect = element.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    
    if (rect.bottom < 0 || rect.top > windowHeight) {
      return 0;
    }
    
    const visibleHeight = Math.min(rect.bottom, windowHeight) - Math.max(rect.top, 0);
    return Math.max(0, Math.min(1, visibleHeight / rect.height));
  }

  // Lock/unlock body scroll
  lockScroll(): void {
    if (!this.isBrowser) return;
    document.body.style.overflow = 'hidden';
  }

  unlockScroll(): void {
    if (!this.isBrowser) return;
    document.body.style.overflow = '';
  }
}
