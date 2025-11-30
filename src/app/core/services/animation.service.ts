import { Injectable, inject, signal, PLATFORM_ID, NgZone } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { AnimationConfig } from '../models';

// Declare gsap for TypeScript
declare const gsap: any;

@Injectable({
  providedIn: 'root'
})
export class AnimationService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly ngZone = inject(NgZone);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  // Animation configuration
  readonly config = signal<AnimationConfig>({
    duration: 0.6,
    delay: 0,
    easing: 'power2.out',
    enabled: true
  });

  // Reduced motion preference
  readonly prefersReducedMotion = signal(
    this.isBrowser 
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches 
      : false
  );

  constructor() {
    if (this.isBrowser) {
      // Listen for reduced motion preference changes
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      mediaQuery.addEventListener('change', (e) => {
        this.prefersReducedMotion.set(e.matches);
      });
    }
  }

  // Enable/disable animations
  toggleAnimations(enabled: boolean): void {
    this.config.update(c => ({ ...c, enabled }));
  }

  // Check if animations are enabled
  areAnimationsEnabled(): boolean {
    return this.config().enabled && !this.prefersReducedMotion();
  }

  // Fade in animation
  fadeIn(element: HTMLElement | string, options: Partial<AnimationConfig> = {}): void {
    if (!this.isBrowser || !this.areAnimationsEnabled()) return;
    
    this.ngZone.runOutsideAngular(() => {
      if (typeof gsap !== 'undefined') {
        gsap.fromTo(element, 
          { opacity: 0 },
          { 
            opacity: 1, 
            duration: options.duration ?? this.config().duration,
            delay: options.delay ?? this.config().delay,
            ease: options.easing ?? this.config().easing
          }
        );
      }
    });
  }

  // Fade in up animation
  fadeInUp(element: HTMLElement | string, options: Partial<AnimationConfig> = {}): void {
    if (!this.isBrowser || !this.areAnimationsEnabled()) return;
    
    this.ngZone.runOutsideAngular(() => {
      if (typeof gsap !== 'undefined') {
        gsap.fromTo(element,
          { opacity: 0, y: 50 },
          { 
            opacity: 1, 
            y: 0, 
            duration: options.duration ?? this.config().duration,
            delay: options.delay ?? this.config().delay,
            ease: options.easing ?? this.config().easing
          }
        );
      }
    });
  }

  // Stagger animation for multiple elements
  staggerFadeIn(elements: HTMLElement[] | string, stagger = 0.1, options: Partial<AnimationConfig> = {}): void {
    if (!this.isBrowser || !this.areAnimationsEnabled()) return;
    
    this.ngZone.runOutsideAngular(() => {
      if (typeof gsap !== 'undefined') {
        gsap.fromTo(elements,
          { opacity: 0, y: 30 },
          { 
            opacity: 1, 
            y: 0, 
            stagger,
            duration: options.duration ?? this.config().duration,
            delay: options.delay ?? this.config().delay,
            ease: options.easing ?? this.config().easing
          }
        );
      }
    });
  }

  // Scale animation
  scaleIn(element: HTMLElement | string, options: Partial<AnimationConfig> = {}): void {
    if (!this.isBrowser || !this.areAnimationsEnabled()) return;
    
    this.ngZone.runOutsideAngular(() => {
      if (typeof gsap !== 'undefined') {
        gsap.fromTo(element,
          { opacity: 0, scale: 0.8 },
          { 
            opacity: 1, 
            scale: 1, 
            duration: options.duration ?? this.config().duration,
            delay: options.delay ?? this.config().delay,
            ease: 'back.out(1.7)'
          }
        );
      }
    });
  }

  // Slide in from left
  slideInLeft(element: HTMLElement | string, options: Partial<AnimationConfig> = {}): void {
    if (!this.isBrowser || !this.areAnimationsEnabled()) return;
    
    this.ngZone.runOutsideAngular(() => {
      if (typeof gsap !== 'undefined') {
        gsap.fromTo(element,
          { opacity: 0, x: -100 },
          { 
            opacity: 1, 
            x: 0, 
            duration: options.duration ?? this.config().duration,
            delay: options.delay ?? this.config().delay,
            ease: options.easing ?? this.config().easing
          }
        );
      }
    });
  }

  // Slide in from right
  slideInRight(element: HTMLElement | string, options: Partial<AnimationConfig> = {}): void {
    if (!this.isBrowser || !this.areAnimationsEnabled()) return;
    
    this.ngZone.runOutsideAngular(() => {
      if (typeof gsap !== 'undefined') {
        gsap.fromTo(element,
          { opacity: 0, x: 100 },
          { 
            opacity: 1, 
            x: 0, 
            duration: options.duration ?? this.config().duration,
            delay: options.delay ?? this.config().delay,
            ease: options.easing ?? this.config().easing
          }
        );
      }
    });
  }

  // Counter animation
  animateCounter(element: HTMLElement, target: number, duration = 2, prefix = '', suffix = ''): void {
    if (!this.isBrowser || !this.areAnimationsEnabled()) return;
    
    this.ngZone.runOutsideAngular(() => {
      if (typeof gsap !== 'undefined') {
        const obj = { value: 0 };
        gsap.to(obj, {
          value: target,
          duration,
          ease: 'power2.out',
          onUpdate: () => {
            element.textContent = `${prefix}${Math.round(obj.value)}${suffix}`;
          }
        });
      }
    });
  }

  // Parallax effect
  parallax(element: HTMLElement | string, speed = 0.5): void {
    if (!this.isBrowser || !this.areAnimationsEnabled()) return;
    
    this.ngZone.runOutsideAngular(() => {
      if (typeof gsap !== 'undefined') {
        gsap.to(element, {
          y: () => window.scrollY * speed,
          ease: 'none',
          scrollTrigger: {
            trigger: element,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true
          }
        });
      }
    });
  }

  // Typewriter effect
  typewriter(element: HTMLElement, text: string, speed = 50): Promise<void> {
    return new Promise((resolve) => {
      if (!this.isBrowser || !this.areAnimationsEnabled()) {
        element.textContent = text;
        resolve();
        return;
      }

      let index = 0;
      element.textContent = '';
      
      const type = () => {
        if (index < text.length) {
          element.textContent += text.charAt(index);
          index++;
          setTimeout(type, speed);
        } else {
          resolve();
        }
      };
      
      type();
    });
  }

  // Create a GSAP timeline
  createTimeline(options: any = {}): any {
    if (!this.isBrowser || typeof gsap === 'undefined') return null;
    return gsap.timeline(options);
  }

  // Kill all animations
  killAll(): void {
    if (!this.isBrowser || typeof gsap === 'undefined') return;
    gsap.killTweensOf('*');
  }
}
