import { 
  Component, 
  ChangeDetectionStrategy, 
  inject, 
  signal,
  computed,
  OnInit,
  PLATFORM_ID,
  ElementRef,
  viewChild
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { PortfolioService } from '../../core/services/portfolio.service';
import { ScrollTriggerDirective } from '../../shared/directives/scroll-trigger.directive';
import { MouseTrackDirective } from '../../shared/directives/mouse-track.directive';
import { fadeInUp, fadeInLeft, fadeInRight, staggerFadeIn } from '../../shared/animations/animations';
import { TimelineItem, Skill, SkillCategory } from '../../core/models/portfolio.models';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, ScrollTriggerDirective, MouseTrackDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeInUp, fadeInLeft, fadeInRight, staggerFadeIn],
  template: `
    <section id="about" class="section relative overflow-hidden">
      <!-- Background Elements -->
      <div class="absolute inset-0 z-0">
        <div class="absolute top-20 right-10 w-72 h-72 bg-electric-violet/10 rounded-full blur-3xl"></div>
        <div class="absolute bottom-20 left-10 w-96 h-96 bg-soft-cyan/10 rounded-full blur-3xl"></div>
      </div>

      <div class="container-custom relative z-10">
        <!-- Section Header -->
        <div 
          class="text-center mb-16"
          appScrollTrigger
          [threshold]="0.2"
        >
          <span class="text-electric-violet text-sm font-semibold uppercase tracking-widest mb-4 block">
            Chi Sono
          </span>
          <h2 class="section-title gradient-text">
            About Me
          </h2>
          <p class="section-subtitle mx-auto mt-4">
            Sviluppatore appassionato con focus su soluzioni innovative e performanti
          </p>
        </div>

        <!-- Main Content Grid -->
        <div class="grid lg:grid-cols-2 gap-16 items-center mb-24">
          <!-- Left: Image/3D Element -->
          <div 
            class="relative"
            appScrollTrigger
            [@fadeInLeft]
          >
            <div 
              appMouseTrack
              [intensity]="10"
              class="relative aspect-square max-w-md mx-auto"
            >
              <!-- Decorative frame -->
              <div class="absolute inset-0 rounded-2xl border-2 border-electric-violet/30 transform rotate-6"></div>
              <div class="absolute inset-0 rounded-2xl border-2 border-soft-cyan/30 transform -rotate-3"></div>
              
              <!-- Main image container -->
              <div class="relative rounded-2xl overflow-hidden glass p-2">
                <div class="aspect-square rounded-xl bg-gradient-to-br from-electric-violet/20 to-soft-cyan/20 flex items-center justify-center">
                  <!-- Placeholder for avatar -->
                  <div class="text-center">
                    <div class="w-40 h-40 mx-auto rounded-full bg-gradient-to-br from-electric-violet to-soft-cyan flex items-center justify-center mb-4">
                      <span class="text-6xl font-bold text-white">GP</span>
                    </div>
                    <p class="text-gray-400 text-sm">Full Stack Developer</p>
                  </div>
                </div>
              </div>

              <!-- Floating badges -->
              <div class="absolute -top-4 -right-4 px-4 py-2 rounded-full glass-light animate-float">
                <span class="text-sm font-medium text-electric-violet">5+ Years Exp</span>
              </div>
              <div class="absolute -bottom-4 -left-4 px-4 py-2 rounded-full glass-light animate-float" style="animation-delay: 1s;">
                <span class="text-sm font-medium text-soft-cyan">50+ Projects</span>
              </div>
            </div>
          </div>

          <!-- Right: Content -->
          <div 
            appScrollTrigger
            [@fadeInRight]
          >
            <h3 class="text-3xl font-bold mb-6 text-white">
              Trasformo idee in <span class="gradient-text">esperienze digitali</span>
            </h3>
            
            <div class="space-y-4 text-gray-300 mb-8">
              <p>
                Sono un Full Stack Developer con oltre 5 anni di esperienza nella creazione 
                di applicazioni web moderne e performanti. La mia passione per la tecnologia 
                mi spinge a rimanere sempre aggiornato sulle ultime tendenze del settore.
              </p>
              <p>
                Specializzato in Angular e TypeScript, ho lavorato su progetti di diverse 
                dimensioni, dalle startup alle grandi aziende, sempre con l'obiettivo di 
                creare soluzioni eleganti e scalabili.
              </p>
            </div>

            <!-- Stats Grid -->
            <div class="grid grid-cols-3 gap-4 mb-8">
              @for (stat of stats(); track stat.label) {
                <div 
                  class="text-center p-4 rounded-xl glass-light"
                  appScrollTrigger
                  (inView)="animateStat($event, stat)"
                >
                  <div 
                    #statValue
                    class="text-3xl font-bold gradient-text mb-1"
                  >
                    {{ stat.displayValue }}{{ stat.suffix }}
                  </div>
                  <div class="text-sm text-gray-400">{{ stat.label }}</div>
                </div>
              }
            </div>

            <!-- CTA -->
            <div class="flex gap-4">
              <a href="#contact" class="btn-primary">
                Lavoriamo insieme
              </a>
              <a 
                href="/assets/resume.pdf" 
                target="_blank"
                class="btn-secondary flex items-center gap-2"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
                Download CV
              </a>
            </div>
          </div>
        </div>

        <!-- Timeline Section -->
        <div class="mb-24">
          <h3 class="text-2xl font-bold text-center mb-12 text-white">
            Il mio <span class="gradient-text">percorso</span>
          </h3>
          
          <div class="relative">
            <!-- Timeline line -->
            <div class="absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-gradient-to-b from-electric-violet via-soft-cyan to-teal"></div>
            
            <!-- Timeline items -->
            <div class="space-y-12">
              @for (item of timeline(); track item.id; let i = $index) {
                <div 
                  class="relative flex items-center"
                  [class.flex-row-reverse]="i % 2 === 1"
                  appScrollTrigger
                  [@fadeInUp]
                >
                  <!-- Content -->
                  <div class="w-5/12" [class.text-right]="i % 2 === 0" [class.text-left]="i % 2 === 1">
                    <div 
                      class="p-6 rounded-xl glass hover:glass-light transition-all duration-300"
                      [class.ml-auto]="i % 2 === 0"
                    >
                      <span class="text-electric-violet font-semibold">{{ item.year }}</span>
                      <h4 class="text-lg font-bold text-white mt-1">{{ item.title }}</h4>
                      <p class="text-gray-400 text-sm mt-2">{{ item.description }}</p>
                    </div>
                  </div>
                  
                  <!-- Center dot -->
                  <div class="w-2/12 flex justify-center">
                    <div class="w-4 h-4 rounded-full bg-electric-violet ring-4 ring-deep-indigo z-10"></div>
                  </div>
                  
                  <!-- Empty space for alignment -->
                  <div class="w-5/12"></div>
                </div>
              }
            </div>
          </div>
        </div>

        <!-- Quick Skills Preview -->
        <div>
          <h3 class="text-2xl font-bold text-center mb-12 text-white">
            Le mie <span class="gradient-text">competenze</span>
          </h3>
          
          <!-- Category tabs -->
          <div class="flex justify-center gap-2 mb-8 flex-wrap">
            @for (category of skillCategories; track category.id) {
              <button
                (click)="activeCategory.set(category.id)"
                class="px-6 py-2 rounded-full text-sm font-medium transition-all duration-300"
                [class.bg-electric-violet]="activeCategory() === category.id"
                [class.text-white]="activeCategory() === category.id"
                [class.glass-light]="activeCategory() !== category.id"
                [class.text-gray-400]="activeCategory() !== category.id"
                [class.hover:text-white]="activeCategory() !== category.id"
              >
                {{ category.label }}
              </button>
            }
          </div>

          <!-- Skills grid -->
          <div 
            class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
            [@staggerFadeIn]="filteredSkills().length"
          >
            @for (skill of filteredSkills(); track skill.id) {
              <div 
                class="group p-4 rounded-xl glass-light hover:glass transition-all duration-300 cursor-pointer"
                appMouseTrack
                [intensity]="8"
              >
                <div class="flex items-center gap-3 mb-3">
                  <div class="w-10 h-10 rounded-lg bg-electric-violet/20 flex items-center justify-center">
                    <span class="text-lg">{{ getSkillEmoji(skill.icon) }}</span>
                  </div>
                  <div>
                    <h4 class="font-semibold text-white text-sm">{{ skill.name }}</h4>
                    <p class="text-xs text-gray-500">{{ skill.category }}</p>
                  </div>
                </div>
                
                <!-- Skill bar -->
                <div class="h-1.5 bg-deep-indigo-700 rounded-full overflow-hidden">
                  <div 
                    class="h-full bg-gradient-to-r from-electric-violet to-soft-cyan rounded-full transition-all duration-1000"
                    [style.width.%]="skill.level"
                  ></div>
                </div>
                <span class="text-xs text-gray-500 mt-1 block text-right">{{ skill.level }}%</span>
              </div>
            }
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    :host {
      display: block;
    }
    
    .animate-float {
      animation: float 6s ease-in-out infinite;
    }
    
    @keyframes float {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-10px); }
    }
  `]
})
export class AboutComponent implements OnInit {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);
  private readonly portfolioService = inject(PortfolioService);

  readonly timeline = this.portfolioService.timeline;
  readonly skills = this.portfolioService.skills;
  
  readonly activeCategory = signal<SkillCategory>('frontend');
  
  readonly skillCategories: { id: SkillCategory; label: string }[] = [
    { id: 'frontend', label: 'Frontend' },
    { id: 'backend', label: 'Backend' },
    { id: 'tools', label: 'Tools' },
    { id: 'soft', label: 'Soft Skills' }
  ];

  readonly filteredSkills = computed(() => 
    this.skills().filter(s => s.category === this.activeCategory())
  );

  readonly stats = signal([
    { label: 'Anni Esperienza', value: 5, displayValue: 0, suffix: '+' },
    { label: 'Progetti Completati', value: 50, displayValue: 0, suffix: '+' },
    { label: 'Clienti Soddisfatti', value: 30, displayValue: 0, suffix: '+' }
  ]);

  ngOnInit(): void {
    // Initialize stats animation on scroll
  }

  animateStat(inView: boolean, stat: { value: number; displayValue: number }): void {
    if (inView && this.isBrowser && stat.displayValue === 0) {
      this.animateNumber(stat);
    }
  }

  private animateNumber(stat: { value: number; displayValue: number }): void {
    const duration = 2000;
    const steps = 60;
    const increment = stat.value / steps;
    let current = 0;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= stat.value) {
        stat.displayValue = stat.value;
        clearInterval(timer);
      } else {
        stat.displayValue = Math.floor(current);
      }
      
      // Update stats signal
      this.stats.update(stats => [...stats]);
    }, duration / steps);
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
