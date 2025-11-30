import { 
  Component, 
  ChangeDetectionStrategy, 
  inject, 
  signal, 
  OnInit, 
  OnDestroy,
  PLATFORM_ID,
  ElementRef,
  viewChild,
  AfterViewInit,
  effect
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { PortfolioService } from '../../core/services/portfolio.service';
import { AnimationService } from '../../core/services/animation.service';
import { ThemeService } from '../../core/services/theme.service';
import { ScrollTriggerDirective } from '../../shared/directives/scroll-trigger.directive';
import { ParallaxDirective } from '../../shared/directives/parallax.directive';
import { fadeInUp, fadeIn } from '../../shared/animations/animations';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule, ScrollTriggerDirective, ParallaxDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeInUp, fadeIn],
  template: `
    <section 
      id="hero"
      class="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      <!-- Animated Background -->
      <div class="absolute inset-0 z-0">
        <!-- Canvas for particles -->
        <canvas 
          #particleCanvas 
          class="absolute inset-0 w-full h-full"
        ></canvas>
        
        <!-- Gradient Orbs -->
        <div 
          class="absolute top-1/4 left-1/4 w-96 h-96 bg-electric-violet/20 rounded-full blur-3xl animate-float"
          appParallax
          [speed]="0.2"
        ></div>
        <div 
          class="absolute bottom-1/4 right-1/4 w-80 h-80 bg-soft-cyan/20 rounded-full blur-3xl"
          style="animation-delay: 2s"
          appParallax
          [speed]="0.3"
          [reverse]="true"
        ></div>
        <div 
          class="absolute top-1/2 right-1/3 w-64 h-64 bg-teal/15 rounded-full blur-3xl"
          style="animation-delay: 4s"
        ></div>
      </div>

      <!-- Grid Pattern Overlay -->
      <div class="absolute inset-0 bg-[linear-gradient(rgba(157,78,221,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(157,78,221,0.03)_1px,transparent_1px)] bg-[size:50px_50px] z-0"></div>

      <!-- Main Content -->
      <div class="container-custom relative z-10 text-center">
        <!-- Greeting -->
        <div 
          appScrollTrigger
          (inView)="animateSection($event)"
          class="mb-6"
        >
          <span 
            class="inline-block px-6 py-2 rounded-full glass-light text-sm text-gray-300 mb-6"
            [@fadeIn]
          >
            👋 Benvenuto nel mio portfolio
          </span>
        </div>

        <!-- Title with Typing Effect -->
        <h1 class="text-5xl md:text-7xl lg:text-8xl font-bold mb-6">
          <span class="block text-white mb-2" [@fadeInUp]>Ciao, sono</span>
          <span 
            class="gradient-text-animated block font-playfair"
            [@fadeInUp]
          >
            {{ personalInfo().name }}
          </span>
        </h1>

        <!-- Animated Subtitle -->
        <div class="h-12 md:h-16 mb-8 overflow-hidden">
          <p class="text-xl md:text-3xl text-gray-300 flex items-center justify-center gap-2">
            <span>Sono un</span>
            <span 
              #typingText
              class="text-electric-violet font-semibold min-w-[200px] text-left"
            >
              {{ currentRole() }}
              <span class="animate-blink border-r-2 border-electric-violet ml-1">&nbsp;</span>
            </span>
          </p>
        </div>

        <!-- Bio -->
        <p 
          class="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed"
          [@fadeInUp]
        >
          {{ personalInfo().bio }}
        </p>

        <!-- CTA Buttons -->
        <div class="flex flex-col sm:flex-row items-center justify-center gap-4" [@fadeInUp]>
          <a 
            href="#projects" 
            class="btn-primary group"
          >
            <span>Vedi i Progetti</span>
            <svg 
              class="inline-block ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                stroke-linecap="round" 
                stroke-linejoin="round" 
                stroke-width="2" 
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </a>
          <a 
            href="#contact" 
            class="btn-secondary"
          >
            Contattami
          </a>
        </div>

        <!-- Scroll Indicator -->
        <div class="absolute bottom-8 left-1/2 -translate-x-1/2">
          <div class="flex flex-col items-center gap-2 text-gray-500">
            <span class="text-xs uppercase tracking-widest">Scorri</span>
            <div class="w-6 h-10 rounded-full border-2 border-gray-500/50 flex items-start justify-center p-2">
              <div class="w-1.5 h-3 bg-electric-violet rounded-full animate-bounce"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Social Links Sidebar -->
      <div class="hidden lg:flex fixed left-8 bottom-0 flex-col items-center gap-6 z-20">
        @for (social of personalInfo().socials; track social.name) {
          <a 
            [href]="social.url" 
            target="_blank"
            rel="noopener noreferrer"
            class="text-gray-500 hover:text-electric-violet hover:-translate-y-1 transition-all duration-300"
            [attr.aria-label]="social.name"
          >
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              @switch (social.icon) {
                @case ('github') {
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                }
                @case ('linkedin') {
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                }
                @case ('twitter') {
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                }
                @default {
                  <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                }
              }
            </svg>
          </a>
        }
        <div class="w-px h-24 bg-gradient-to-b from-gray-500 to-transparent"></div>
      </div>

      <!-- Email Sidebar -->
      <div class="hidden lg:flex fixed right-8 bottom-0 flex-col items-center gap-6 z-20">
        <a 
          [href]="'mailto:' + personalInfo().email"
          class="text-gray-500 hover:text-electric-violet transition-colors text-xs tracking-widest"
          style="writing-mode: vertical-rl;"
        >
          {{ personalInfo().email }}
        </a>
        <div class="w-px h-24 bg-gradient-to-b from-gray-500 to-transparent"></div>
      </div>
    </section>
  `,
  styles: [`
    :host {
      display: block;
    }

    .animate-blink {
      animation: blink 1s step-end infinite;
    }

    @keyframes blink {
      50% { opacity: 0; }
    }

    .animate-float {
      animation: float 6s ease-in-out infinite;
    }

    @keyframes float {
      0%, 100% { transform: translateY(0) rotate(0deg); }
      50% { transform: translateY(-20px) rotate(5deg); }
    }
  `]
})
export class HeroComponent implements OnInit, OnDestroy, AfterViewInit {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);
  private readonly portfolioService = inject(PortfolioService);
  private readonly animationService = inject(AnimationService);
  private readonly themeService = inject(ThemeService);

  readonly particleCanvas = viewChild<ElementRef<HTMLCanvasElement>>('particleCanvas');
  
  readonly personalInfo = this.portfolioService.personalInfo;
  
  readonly roles = ['Full Stack Developer', 'Angular Expert', 'UI/UX Enthusiast', 'Problem Solver'];
  readonly currentRole = signal(this.roles[0]);
  
  private roleIndex = 0;
  private typingInterval: ReturnType<typeof setInterval> | null = null;
  private animationFrameId: number | null = null;

  constructor() {
    // Re-init particles when theme changes
    effect(() => {
      const theme = this.themeService.currentTheme();
      if (this.isBrowser && this.particleCanvas()) {
        // Cancel current animation and reinit
        if (this.animationFrameId) {
          cancelAnimationFrame(this.animationFrameId);
        }
        this.initParticles();
      }
    });
  }

  ngOnInit(): void {
    if (this.isBrowser) {
      this.startTypingAnimation();
    }
  }

  ngAfterViewInit(): void {
    if (this.isBrowser) {
      this.initParticles();
    }
  }

  ngOnDestroy(): void {
    if (this.typingInterval) {
      clearInterval(this.typingInterval);
    }
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }

  animateSection(inView: boolean): void {
    if (inView) {
      // Trigger animations when section comes into view
    }
  }

  private startTypingAnimation(): void {
    this.typingInterval = setInterval(() => {
      this.roleIndex = (this.roleIndex + 1) % this.roles.length;
      this.currentRole.set(this.roles[this.roleIndex]);
    }, 3000);
  }

  private getParticleColor(): { r: number; g: number; b: number } {
    const theme = this.themeService.currentTheme();
    switch (theme) {
      case 'hacker':
        return { r: 0, g: 255, b: 65 }; // Matrix green
      case 'minimal':
        return { r: 255, g: 255, b: 255 }; // White
      case 'light':
        return { r: 124, g: 58, b: 237 }; // Violet
      default:
        return { r: 157, g: 78, b: 221 }; // Electric violet
    }
  }

  private initParticles(): void {
    const canvasElement = this.particleCanvas();
    if (!canvasElement) return;

    const canvas = canvasElement.nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Get particle color based on current theme
    const particleRGB = this.getParticleColor();

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Particle class
    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      opacity: number;

      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = Math.random() * 0.5 - 0.25;
        this.speedY = Math.random() * 0.5 - 0.25;
        this.opacity = Math.random() * 0.3 + 0.1;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x > canvas.width) this.x = 0;
        if (this.x < 0) this.x = canvas.width;
        if (this.y > canvas.height) this.y = 0;
        if (this.y < 0) this.y = canvas.height;
      }

      draw() {
        if (!ctx) return;
        ctx.fillStyle = `rgba(${particleRGB.r}, ${particleRGB.g}, ${particleRGB.b}, ${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Create particles
    const particles: Particle[] = [];
    const particleCount = Math.min(100, Math.floor((canvas.width * canvas.height) / 15000));
    
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });

      // Draw connections
      particles.forEach((a, i) => {
        particles.slice(i + 1).forEach(b => {
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 150) {
            ctx.strokeStyle = `rgba(${particleRGB.r}, ${particleRGB.g}, ${particleRGB.b}, ${0.1 * (1 - distance / 150)})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        });
      });

      this.animationFrameId = requestAnimationFrame(animate);
    };

    animate();
  }
}
