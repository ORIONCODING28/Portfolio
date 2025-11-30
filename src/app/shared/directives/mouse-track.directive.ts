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
  selector: '[appMouseTrack]',
  standalone: true
})
export class MouseTrackDirective implements OnInit, OnDestroy {
  private readonly elementRef = inject(ElementRef);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly ngZone = inject(NgZone);
  private readonly renderer = inject(Renderer2);
  private readonly isBrowser = isPlatformBrowser(this.platformId);
  private subscription: Subscription | null = null;

  // Inputs
  intensity = input<number>(20);
  perspective = input<number>(1000);
  scale = input<number>(1.02);

  ngOnInit(): void {
    if (!this.isBrowser) return;

    const element = this.elementRef.nativeElement as HTMLElement;
    this.renderer.setStyle(element, 'transition', 'transform 0.1s ease-out');
    this.renderer.setStyle(element, 'transformStyle', 'preserve-3d');

    this.ngZone.runOutsideAngular(() => {
      this.subscription = fromEvent<MouseEvent>(element, 'mousemove')
        .pipe(throttleTime(16))
        .subscribe((event) => this.handleMouseMove(event));

      fromEvent(element, 'mouseleave').subscribe(() => this.resetTransform());
    });
  }

  private handleMouseMove(event: MouseEvent): void {
    const element = this.elementRef.nativeElement as HTMLElement;
    const rect = element.getBoundingClientRect();
    
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const mouseX = event.clientX - centerX;
    const mouseY = event.clientY - centerY;
    
    const rotateX = (mouseY / (rect.height / 2)) * -this.intensity();
    const rotateY = (mouseX / (rect.width / 2)) * this.intensity();
    
    this.renderer.setStyle(
      element, 
      'transform', 
      `perspective(${this.perspective()}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${this.scale()})`
    );
  }

  private resetTransform(): void {
    const element = this.elementRef.nativeElement as HTMLElement;
    this.renderer.setStyle(element, 'transform', 'perspective(1000px) rotateX(0) rotateY(0) scale(1)');
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
