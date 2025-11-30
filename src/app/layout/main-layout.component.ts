import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent, FooterComponent, ScrollToTopComponent } from '../shared/components';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    CommonModule, 
    RouterOutlet, 
    NavbarComponent, 
    FooterComponent, 
    ScrollToTopComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-screen flex flex-col">
      <app-navbar />
      
      <main class="flex-1">
        <router-outlet />
      </main>
      
      <app-footer />
      <app-scroll-to-top />
    </div>
  `
})
export class MainLayoutComponent {}
