import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface Project {
  id: string;
  title: string;
  short_description?: string;
  description: string;
  image_url?: string;
  live_url?: string;
  github_url?: string;
  technologies: string[];
  categories: string[];
  highlights: string[];
  featured: boolean;
  published: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  level: number;
  icon?: string;
  description?: string;
  sort_order: number;
}

export interface Testimonial {
  id: string;
  author: string;
  role?: string;
  company?: string;
  text: string;
  avatar_url?: string;
  rating: number;
  featured: boolean;
  published: boolean;
  created_at: string;
}

export interface Experience {
  id: string;
  title: string;
  company?: string;
  location?: string;
  start_date?: string;
  end_date?: string;
  is_current: boolean;
  description?: string;
  technologies: string[];
  type: 'work' | 'education' | 'freelance' | 'other';
  sort_order: number;
}

export interface Palette {
  id: string;
  name: string;
  slug: string;
  colors: Record<string, string>;
  content?: Record<string, any>;
  is_active: boolean;
}

export interface PersonalInfo {
  id?: string;
  name?: string;
  title?: string;
  email?: string;
  phone?: string;
  location?: string;
  bio?: string;
  avatar_url?: string;
  resume_url?: string;
  socials?: Record<string, string>;
}

export interface MetaItem {
  id: string;
  meta_key: string;
  meta_value?: string;
  meta_json?: any;
}

@Injectable({
  providedIn: 'root'
})
export class AdminApiService {
  private readonly API_URL = `${environment.apiUrl}/admin`;

  constructor(private http: HttpClient) {}

  // ============================================
  // PROJECTS
  // ============================================

  getProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(`${this.API_URL}/projects`);
  }

  getProject(id: string): Observable<Project> {
    return this.http.get<Project>(`${this.API_URL}/projects/${id}`);
  }

  createProject(project: Partial<Project>): Observable<Project> {
    return this.http.post<Project>(`${this.API_URL}/projects`, project);
  }

  updateProject(id: string, project: Partial<Project>): Observable<Project> {
    return this.http.put<Project>(`${this.API_URL}/projects/${id}`, project);
  }

  deleteProject(id: string): Observable<{ message: string; id: string }> {
    return this.http.delete<{ message: string; id: string }>(`${this.API_URL}/projects/${id}`);
  }

  // ============================================
  // SKILLS
  // ============================================

  getSkills(): Observable<Skill[]> {
    return this.http.get<Skill[]>(`${this.API_URL}/skills`);
  }

  createSkill(skill: Partial<Skill>): Observable<Skill> {
    return this.http.post<Skill>(`${this.API_URL}/skills`, skill);
  }

  updateSkill(id: string, skill: Partial<Skill>): Observable<Skill> {
    return this.http.put<Skill>(`${this.API_URL}/skills/${id}`, skill);
  }

  deleteSkill(id: string): Observable<{ message: string; id: string }> {
    return this.http.delete<{ message: string; id: string }>(`${this.API_URL}/skills/${id}`);
  }

  // ============================================
  // TESTIMONIALS
  // ============================================

  getTestimonials(): Observable<Testimonial[]> {
    return this.http.get<Testimonial[]>(`${this.API_URL}/testimonials`);
  }

  createTestimonial(testimonial: Partial<Testimonial>): Observable<Testimonial> {
    return this.http.post<Testimonial>(`${this.API_URL}/testimonials`, testimonial);
  }

  updateTestimonial(id: string, testimonial: Partial<Testimonial>): Observable<Testimonial> {
    return this.http.put<Testimonial>(`${this.API_URL}/testimonials/${id}`, testimonial);
  }

  deleteTestimonial(id: string): Observable<{ message: string; id: string }> {
    return this.http.delete<{ message: string; id: string }>(`${this.API_URL}/testimonials/${id}`);
  }

  // ============================================
  // EXPERIENCES
  // ============================================

  getExperiences(): Observable<Experience[]> {
    return this.http.get<Experience[]>(`${this.API_URL}/experiences`);
  }

  createExperience(experience: Partial<Experience>): Observable<Experience> {
    return this.http.post<Experience>(`${this.API_URL}/experiences`, experience);
  }

  updateExperience(id: string, experience: Partial<Experience>): Observable<Experience> {
    return this.http.put<Experience>(`${this.API_URL}/experiences/${id}`, experience);
  }

  deleteExperience(id: string): Observable<{ message: string; id: string }> {
    return this.http.delete<{ message: string; id: string }>(`${this.API_URL}/experiences/${id}`);
  }

  // ============================================
  // PALETTES/THEMES
  // ============================================

  getPalettes(): Observable<Palette[]> {
    return this.http.get<Palette[]>(`${this.API_URL}/palettes`);
  }

  createPalette(palette: Partial<Palette>): Observable<Palette> {
    return this.http.post<Palette>(`${this.API_URL}/palettes`, palette);
  }

  updatePalette(id: string, palette: Partial<Palette>): Observable<Palette> {
    return this.http.put<Palette>(`${this.API_URL}/palettes/${id}`, palette);
  }

  deletePalette(id: string): Observable<{ message: string; id: string }> {
    return this.http.delete<{ message: string; id: string }>(`${this.API_URL}/palettes/${id}`);
  }

  setActivePalette(id: string): Observable<Palette> {
    return this.http.put<Palette>(`${this.API_URL}/palettes/${id}`, { is_active: true });
  }

  // ============================================
  // META/SETTINGS
  // ============================================

  getMeta(): Observable<MetaItem[]> {
    return this.http.get<MetaItem[]>(`${this.API_URL}/meta`);
  }

  updateMeta(key: string, value?: string, json?: any): Observable<MetaItem> {
    return this.http.put<MetaItem>(`${this.API_URL}/meta/${key}`, { value, json });
  }

  // ============================================
  // PERSONAL INFO
  // ============================================

  getPersonalInfo(): Observable<PersonalInfo> {
    return this.http.get<PersonalInfo>(`${this.API_URL}/personal-info`);
  }

  updatePersonalInfo(info: Partial<PersonalInfo>): Observable<PersonalInfo> {
    return this.http.put<PersonalInfo>(`${this.API_URL}/personal-info`, info);
  }
}
