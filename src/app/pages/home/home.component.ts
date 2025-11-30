import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeroComponent } from '../../features/hero/hero.component';
import { AboutComponent } from '../../features/about/about.component';
import { ProjectsComponent } from '../../features/projects/projects.component';
import { ExperienceComponent } from '../../features/experience/experience.component';
import { SkillsComponent } from '../../features/skills/skills.component';
import { TestimonialsComponent } from '../../features/testimonials/testimonials.component';
import { ContactComponent } from '../../features/contact/contact.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    HeroComponent,
    AboutComponent,
    ProjectsComponent,
    ExperienceComponent,
    SkillsComponent,
    TestimonialsComponent,
    ContactComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-hero />
    <app-about />
    <app-projects />
    <app-skills />
    <app-experience />
    <app-testimonials />
    <app-contact />
  `
})
export class HomeComponent {}
