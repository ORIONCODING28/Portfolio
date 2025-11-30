import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PortfolioService } from '../../../core/services/portfolio.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <footer class="relative py-16 overflow-hidden">
      <!-- Background Animation -->
      <div class="absolute inset-0 overflow-hidden">
        <div class="absolute bottom-0 left-1/4 w-96 h-96 bg-electric-violet/10 rounded-full blur-3xl"></div>
        <div class="absolute bottom-0 right-1/4 w-96 h-96 bg-soft-cyan/10 rounded-full blur-3xl"></div>
      </div>

      <div class="container-custom relative z-10">
        <!-- Main Footer Content -->
        <div class="grid md:grid-cols-3 gap-12 mb-12">
          <!-- Brand -->
          <div>
            <a routerLink="/" class="text-3xl font-bold gradient-text-animated">
              GP
            </a>
            <p class="mt-4 text-gray-400 max-w-xs">
              Full Stack Developer appassionato di creare esperienze digitali innovative e performanti.
            </p>
          </div>

          <!-- Quick Links -->
          <div>
            <h3 class="text-lg font-semibold mb-4 text-white">Link Rapidi</h3>
            <ul class="space-y-3">
              <li>
                <a href="#about" class="text-gray-400 hover:text-white transition-colors link-underline">
                  About
                </a>
              </li>
              <li>
                <a href="#projects" class="text-gray-400 hover:text-white transition-colors link-underline">
                  Progetti
                </a>
              </li>
              <li>
                <a href="#skills" class="text-gray-400 hover:text-white transition-colors link-underline">
                  Skills
                </a>
              </li>
              <li>
                <a href="#contact" class="text-gray-400 hover:text-white transition-colors link-underline">
                  Contatti
                </a>
              </li>
            </ul>
          </div>

          <!-- Social Links -->
          <div>
            <h3 class="text-lg font-semibold mb-4 text-white">Connettiti</h3>
            <div class="flex gap-4">
              @for (social of socialLinks; track social.name) {
                <a 
                  [href]="social.url" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  class="group p-3 rounded-full glass-light hover:glass transition-all duration-300"
                  [attr.aria-label]="social.name"
                >
                  <svg 
                    class="w-5 h-5 text-gray-400 group-hover:text-electric-violet transition-colors"
                    [innerHTML]="social.svgPath"
                  ></svg>
                </a>
              }
            </div>
          </div>
        </div>

        <!-- Divider -->
        <div class="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

        <!-- Bottom Section -->
        <div class="mt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p class="text-gray-500 text-sm">
            © {{ currentYear }} Giuseppe Developer. Tutti i diritti riservati.
          </p>
          
          <div class="flex items-center gap-2 text-gray-500 text-sm">
            <span>Built with</span>
            <span class="text-red-500">❤</span>
            <span>using</span>
            <span class="text-electric-violet font-medium">Angular</span>
            <span>&</span>
            <span class="text-soft-cyan font-medium">Tailwind CSS</span>
          </div>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    :host {
      display: block;
      background: linear-gradient(180deg, transparent 0%, rgba(13, 13, 31, 0.8) 100%);
    }
  `]
})
export class FooterComponent {
  private readonly portfolioService = inject(PortfolioService);
  
  readonly currentYear = new Date().getFullYear();

  readonly socialLinks = [
    {
      name: 'GitHub',
      url: 'https://github.com',
      svgPath: '<path fill="currentColor" d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>'
    },
    {
      name: 'LinkedIn',
      url: 'https://linkedin.com',
      svgPath: '<path fill="currentColor" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>'
    },
    {
      name: 'Twitter',
      url: 'https://twitter.com',
      svgPath: '<path fill="currentColor" d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>'
    }
  ];
}
