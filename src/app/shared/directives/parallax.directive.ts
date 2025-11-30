import { 
  Directive, 
  ElementRef, 
  inject, 
  input, 
  OnInit, 
  OnDestroy,
  PLATFORM_ID,
  NgZone,
  Renderer2
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { fromEvent, Subscription, throttleTime } from 'rxjs';

@Directive({
  selector: '[appParallax]',
  standalone: true
})
export class ParallaxDirective implements OnInit, OnDestroy {
  private readonly elementRef = inject(ElementRef);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly ngZone = inject(NgZone);
  private readonly renderer = inject(Renderer2);
  private readonly isBrowser = isPlatformBrowser(this.platformId);
  private subscription: Subscription | null = null;

  // Inputs
  speed = input<number>(0.3);
  direction = input<'vertical' | 'horizontal'>('vertical');
  reverse = input<boolean>(false);

  ngOnInit(): void {
    if (!this.isBrowser) return;

    this.ngZone.runOutsideAngular(() => {
      this.subscription = fromEvent(window, 'scroll')
        .pipe(throttleTime(16)) // ~60fps
        .subscribe(() => this.updatePosition());
    });
  }

  private updatePosition(): void {
    const element = this.elementRef.nativeElement as HTMLElement;
    const rect = element.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    
    // Calculate element's position relative to viewport center
    const elementCenter = rect.top + rect.height / 2;
    const viewportCenter = windowHeight / 2;
    const distance = elementCenter - viewportCenter;
    
    // Calculate offset
    const multiplier = this.reverse() ? -1 : 1;
    const offset = distance * this.speed() * multiplier;
    
    // Apply transform based on direction
    if (this.direction() === 'vertical') {
      this.renderer.setStyle(element, 'transform', `translateY(${offset}px)`);
    } else {
      this.renderer.setStyle(element, 'transform', `translateX(${offset}px)`);
    }
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
