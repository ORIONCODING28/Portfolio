import { 
  Directive, 
  ElementRef, 
  inject, 
  input, 
  OnInit, 
  OnDestroy,
  PLATFORM_ID,
  output
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Directive({
  selector: '[appScrollTrigger]',
  standalone: true
})
export class ScrollTriggerDirective implements OnInit, OnDestroy {
  private readonly elementRef = inject(ElementRef);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);
  private observer: IntersectionObserver | null = null;

  // Inputs
  threshold = input<number>(0.2);
  rootMargin = input<string>('0px');
  triggerOnce = input<boolean>(true);

  // Outputs
  inView = output<boolean>();
  visibilityChange = output<number>();

  ngOnInit(): void {
    if (!this.isBrowser) return;

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          const isInView = entry.isIntersecting;
          this.inView.emit(isInView);
          this.visibilityChange.emit(entry.intersectionRatio);

          if (isInView) {
            this.elementRef.nativeElement.classList.add('in-view');
            
            if (this.triggerOnce()) {
              this.observer?.unobserve(this.elementRef.nativeElement);
            }
          } else if (!this.triggerOnce()) {
            this.elementRef.nativeElement.classList.remove('in-view');
          }
        });
      },
      {
        threshold: this.threshold(),
        rootMargin: this.rootMargin()
      }
    );

    this.observer.observe(this.elementRef.nativeElement);
  }

  ngOnDestroy(): void {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}
