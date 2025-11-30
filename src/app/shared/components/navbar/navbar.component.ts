import { 
  Component, 
  ChangeDetectionStrategy, 
  inject, 
  signal, 
  computed,
  HostListener 
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ScrollService } from '../../../core/services/scroll.service';
import { ThemeService } from '../../../core/services/theme.service';
import { navbarSlide, mobileMenuSlide, fadeIn } from '../../animations';

interface NavItem {
  label: string;
  path: string;
  fragment?: string;
}

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [navbarSlide, mobileMenuSlide, fadeIn],
  template: `
    <header 
      class="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      [class.glass-dark]="!isAtTop()"
      [class.bg-transparent]="isAtTop()"
      [@navbarSlide]="isNavVisible() ? 'visible' : 'hidden'"
    >
      <nav class="container-custom py-4">
        <div class="flex items-center justify-between">
          <!-- Logo -->
          <a 
            routerLink="/" 
            class="group flex items-center gap-2 text-2xl font-bold"
          >
            <span class="gradient-text-animated">GP</span>
            <span class="text-white/80 text-sm font-normal hidden sm:block">
              Portfolio
            </span>
          </a>

          <!-- Desktop Navigation -->
          <ul class="hidden md:flex items-center gap-8">
            @for (item of navItems; track item.path) {
              <li>
                <a 
                  [routerLink]="item.path"
                  [fragment]="item.fragment"
                  routerLinkActive="text-electric-violet"
                  [routerLinkActiveOptions]="{ exact: item.path === '/' }"
                  class="link-underline text-gray-300 hover:text-white transition-colors duration-300"
                >
                  {{ item.label }}
                </a>
              </li>
            }
          </ul>

          <!-- Theme Toggle & CTA -->
          <div class="hidden md:flex items-center gap-3">
            <!-- Theme Selector -->
            <div class="relative">
              <button 
                (click)="toggleThemeMenu()"
                class="p-2 rounded-full glass-light hover:glass transition-all duration-300 flex items-center gap-2"
                aria-label="Cambia tema"
              >
                <span class="text-lg">{{ themeService.theme().icon }}</span>
              </button>
              
              <!-- Theme Dropdown -->
              @if (isThemeMenuOpen()) {
                <div class="absolute right-0 top-12 w-48 rounded-xl glass-dark border border-white/10 overflow-hidden shadow-xl">
                  @for (theme of themeService.themes; track theme.name) {
                    <button
                      (click)="selectTheme(theme.name)"
                      class="w-full px-4 py-3 flex items-center gap-3 hover:bg-white/10 transition-colors text-left"
                      [class.bg-white/5]="themeService.currentTheme() === theme.name"
                    >
                      <span class="text-lg">{{ theme.icon }}</span>
                      <span class="text-sm text-gray-300">{{ theme.label }}</span>
                      @if (themeService.currentTheme() === theme.name) {
                        <svg class="w-4 h-4 ml-auto text-electric-violet" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                        </svg>
                      }
                    </button>
                  }
                </div>
              }
            </div>
            
            <a 
              href="#contact" 
              class="btn-primary text-sm py-2 px-6"
            >
              Contattami
            </a>
          </div>

          <!-- Mobile Menu Button -->
          <button 
            (click)="toggleMobileMenu()"
            class="md:hidden p-2 text-gray-300 hover:text-white transition-colors"
            aria-label="Toggle menu"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              @if (isMobileMenuOpen()) {
                <path 
                  stroke-linecap="round" 
                  stroke-linejoin="round" 
                  stroke-width="2" 
                  d="M6 18L18 6M6 6l12 12"
                />
              } @else {
                <path 
                  stroke-linecap="round" 
                  stroke-linejoin="round" 
                  stroke-width="2" 
                  d="M4 6h16M4 12h16M4 18h16"
                />
              }
            </svg>
          </button>
        </div>
      </nav>

      <!-- Mobile Menu -->
      @if (isMobileMenuOpen()) {
        <div 
          class="md:hidden fixed inset-0 top-16 glass-dark"
          [@mobileMenuSlide]
        >
          <nav class="container-custom py-8">
            <ul class="flex flex-col gap-6">
              @for (item of navItems; track item.path) {
                <li>
                  <a 
                    [routerLink]="item.path"
                    [fragment]="item.fragment"
                    (click)="closeMobileMenu()"
                    class="block text-xl text-gray-300 hover:text-white hover:pl-4 transition-all duration-300"
                  >
                    {{ item.label }}
                  </a>
                </li>
              }
            </ul>
            
            <!-- Mobile Theme Selector -->
            <div class="mt-8 pt-8 border-t border-white/10">
              <p class="text-sm text-gray-500 mb-4">Scegli tema</p>
              <div class="grid grid-cols-2 gap-3">
                @for (theme of themeService.themes; track theme.name) {
                  <button
                    (click)="selectTheme(theme.name); closeMobileMenu()"
                    class="p-3 rounded-xl glass-light flex items-center gap-2 transition-all"
                    [class.ring-2]="themeService.currentTheme() === theme.name"
                    [class.ring-electric-violet]="themeService.currentTheme() === theme.name"
                  >
                    <span class="text-lg">{{ theme.icon }}</span>
                    <span class="text-sm text-gray-300">{{ theme.label }}</span>
                  </button>
                }
              </div>
            </div>
            
            <div class="mt-6">
              <a 
                href="#contact" 
                (click)="closeMobileMenu()"
                class="btn-primary w-full text-center block"
              >
                Contattami
              </a>
            </div>
          </nav>
        </div>
      }
    </header>

    <!-- Spacer to prevent content from going under fixed navbar -->
    <div class="h-16"></div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class NavbarComponent {
  private readonly scrollService = inject(ScrollService);
  readonly themeService = inject(ThemeService);

  readonly navItems: NavItem[] = [
    { label: 'Home', path: '/' },
    { label: 'About', path: '/', fragment: 'about' },
    { label: 'Progetti', path: '/', fragment: 'projects' },
    { label: 'Skills', path: '/', fragment: 'skills' },
    { label: 'Esperienza', path: '/', fragment: 'experience' },
    { label: 'Contatti', path: '/', fragment: 'contact' }
  ];

  readonly isMobileMenuOpen = signal(false);
  readonly isThemeMenuOpen = signal(false);
  readonly isAtTop = this.scrollService.isAtTop;
  
  private lastScrollY = 0;
  readonly isNavVisible = signal(true);

  @HostListener('window:scroll')
  onScroll(): void {
    const currentScrollY = window.scrollY;
    
    if (currentScrollY < 100) {
      this.isNavVisible.set(true);
    } else if (currentScrollY > this.lastScrollY) {
      this.isNavVisible.set(false);
    } else {
      this.isNavVisible.set(true);
    }
    
    this.lastScrollY = currentScrollY;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    // Close theme menu when clicking outside
    if (this.isThemeMenuOpen()) {
      this.isThemeMenuOpen.set(false);
    }
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen.update(open => !open);
    
    if (this.isMobileMenuOpen()) {
      this.scrollService.lockScroll();
    } else {
      this.scrollService.unlockScroll();
    }
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen.set(false);
    this.scrollService.unlockScroll();
  }

  toggleThemeMenu(): void {
    event?.stopPropagation();
    this.isThemeMenuOpen.update(open => !open);
  }

  selectTheme(themeName: 'default' | 'minimal' | 'hacker' | 'light'): void {
    this.themeService.setTheme(themeName);
    this.isThemeMenuOpen.set(false);
  }
}
