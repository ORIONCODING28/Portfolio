import { Injectable, signal, computed } from '@angular/core';
import { 
  Project, 
  Skill, 
  Experience, 
  Testimonial, 
  PersonalInfo,
  TimelineItem,
  ProjectCategory,
  SkillCategory
} from '../models';

@Injectable({
  providedIn: 'root'
})
export class PortfolioService {
  
  // ==========================================
  // PERSONAL INFO
  // ==========================================
  
  readonly personalInfo = signal<PersonalInfo>({
    name: 'Giuseppe Developer',
    title: 'Full Stack Developer',
    subtitle: 'Crafting Digital Experiences',
    bio: `Passionate developer with expertise in building modern web applications. 
          I specialize in Angular, TypeScript, and creating performant, accessible user experiences.
          With a keen eye for design and a love for clean code, I transform ideas into reality.`,
    email: 'hello@example.com',
    location: 'Italy',
    avatar: '/assets/images/avatar.jpg',
    resume: '/assets/resume.pdf',
    socials: [
      { name: 'GitHub', url: 'https://github.com', icon: 'github' },
      { name: 'LinkedIn', url: 'https://linkedin.com', icon: 'linkedin' },
      { name: 'Twitter', url: 'https://twitter.com', icon: 'twitter' },
      { name: 'Email', url: 'mailto:hello@example.com', icon: 'mail' }
    ]
  });

  // ==========================================
  // PROJECTS
  // ==========================================

  readonly projects = signal<Project[]>([
    {
      id: 'project-1',
      title: 'E-Commerce Platform',
      description: 'A modern e-commerce platform built with Angular and Node.js. Features include real-time inventory management, secure payment processing, and an intuitive admin dashboard.',
      shortDescription: 'Full-stack e-commerce solution with modern UI/UX',
      image: '/assets/images/projects/ecommerce.jpg',
      images: ['/assets/images/projects/ecommerce-1.jpg', '/assets/images/projects/ecommerce-2.jpg'],
      technologies: ['Angular', 'Node.js', 'MongoDB', 'Stripe', 'Tailwind CSS'],
      category: 'fullstack',
      liveUrl: 'https://example.com',
      githubUrl: 'https://github.com',
      featured: true,
      date: '2024-01',
      highlights: ['Real-time inventory sync', 'Payment gateway integration', 'Mobile-first design'],
      metrics: [
        { label: 'Performance Score', value: 98, suffix: '%' },
        { label: 'Load Time', value: 1.2, suffix: 's' },
        { label: 'Users', value: 10000, prefix: '+' }
      ]
    },
    {
      id: 'project-2',
      title: 'Task Management App',
      description: 'A collaborative task management application with real-time updates, drag-and-drop functionality, and team collaboration features.',
      shortDescription: 'Real-time collaborative task management',
      image: '/assets/images/projects/taskmanager.jpg',
      technologies: ['Angular', 'Firebase', 'RxJS', 'SCSS'],
      category: 'frontend',
      liveUrl: 'https://example.com',
      githubUrl: 'https://github.com',
      featured: true,
      date: '2024-03',
      highlights: ['Real-time sync', 'Drag-and-drop', 'Team collaboration']
    },
    {
      id: 'project-3',
      title: 'API Gateway Service',
      description: 'A scalable API gateway built with NestJS featuring rate limiting, authentication, and microservices orchestration.',
      shortDescription: 'Scalable microservices API gateway',
      image: '/assets/images/projects/api.jpg',
      technologies: ['NestJS', 'TypeScript', 'Redis', 'Docker', 'Kubernetes'],
      category: 'backend',
      githubUrl: 'https://github.com',
      featured: false,
      date: '2023-11'
    },
    {
      id: 'project-4',
      title: 'Portfolio Website',
      description: 'Modern portfolio website with 3D effects, smooth animations, and accessibility-first approach.',
      shortDescription: 'Interactive portfolio with 3D animations',
      image: '/assets/images/projects/portfolio.jpg',
      technologies: ['Angular', 'Three.js', 'GSAP', 'Tailwind CSS'],
      category: 'frontend',
      liveUrl: 'https://example.com',
      githubUrl: 'https://github.com',
      featured: true,
      date: '2024-06'
    },
    {
      id: 'project-5',
      title: 'Mobile Fitness App',
      description: 'Cross-platform fitness application with workout tracking, nutrition planning, and social features.',
      shortDescription: 'Cross-platform fitness tracking app',
      image: '/assets/images/projects/fitness.jpg',
      technologies: ['Ionic', 'Angular', 'Capacitor', 'Node.js'],
      category: 'mobile',
      liveUrl: 'https://example.com',
      featured: false,
      date: '2023-08'
    },
    {
      id: 'project-6',
      title: 'Design System Library',
      description: 'A comprehensive design system with reusable components, documentation, and theming support.',
      shortDescription: 'Reusable component library with theming',
      image: '/assets/images/projects/designsystem.jpg',
      technologies: ['Angular', 'Storybook', 'SCSS', 'TypeScript'],
      category: 'design',
      githubUrl: 'https://github.com',
      featured: false,
      date: '2023-05'
    }
  ]);

  // Computed signals
  readonly featuredProjects = computed(() => 
    this.projects().filter(p => p.featured)
  );

  readonly projectsByCategory = computed(() => {
    const grouped = new Map<ProjectCategory, Project[]>();
    this.projects().forEach(project => {
      const existing = grouped.get(project.category) || [];
      grouped.set(project.category, [...existing, project]);
    });
    return grouped;
  });

  // ==========================================
  // SKILLS
  // ==========================================

  readonly skills = signal<Skill[]>([
    // Frontend
    { id: 'angular', name: 'Angular', icon: 'angular', level: 95, category: 'frontend', description: 'Expert in Angular 15+, Signals, RxJS' },
    { id: 'typescript', name: 'TypeScript', icon: 'typescript', level: 92, category: 'frontend', description: 'Strong typing, generics, decorators' },
    { id: 'react', name: 'React', icon: 'react', level: 75, category: 'frontend', description: 'Hooks, Context, Redux' },
    { id: 'tailwind', name: 'Tailwind CSS', icon: 'tailwind', level: 90, category: 'frontend', description: 'Utility-first CSS framework' },
    { id: 'scss', name: 'SCSS', icon: 'sass', level: 88, category: 'frontend', description: 'Advanced SCSS, mixins, variables' },
    { id: 'threejs', name: 'Three.js', icon: 'threejs', level: 70, category: 'frontend', description: '3D graphics and WebGL' },
    
    // Backend
    { id: 'nodejs', name: 'Node.js', icon: 'nodejs', level: 85, category: 'backend', description: 'Express, NestJS, APIs' },
    { id: 'python', name: 'Python', icon: 'python', level: 80, category: 'backend', description: 'Django, FastAPI, scripting' },
    { id: 'postgresql', name: 'PostgreSQL', icon: 'postgresql', level: 82, category: 'backend', description: 'Complex queries, optimization' },
    { id: 'mongodb', name: 'MongoDB', icon: 'mongodb', level: 78, category: 'backend', description: 'NoSQL, aggregation pipelines' },
    { id: 'graphql', name: 'GraphQL', icon: 'graphql', level: 75, category: 'backend', description: 'Apollo, schema design' },
    
    // Tools
    { id: 'git', name: 'Git', icon: 'git', level: 90, category: 'tools', description: 'Version control, branching strategies' },
    { id: 'docker', name: 'Docker', icon: 'docker', level: 80, category: 'tools', description: 'Containerization, compose' },
    { id: 'vscode', name: 'VS Code', icon: 'vscode', level: 95, category: 'tools', description: 'Extensions, debugging, shortcuts' },
    { id: 'figma', name: 'Figma', icon: 'figma', level: 72, category: 'tools', description: 'UI/UX design, prototyping' },
    { id: 'jira', name: 'Jira', icon: 'jira', level: 85, category: 'tools', description: 'Agile, sprint planning' },
    
    // Soft Skills
    { id: 'communication', name: 'Communication', icon: 'chat', level: 90, category: 'soft', description: 'Clear technical communication' },
    { id: 'teamwork', name: 'Team Collaboration', icon: 'users', level: 92, category: 'soft', description: 'Cross-functional team experience' },
    { id: 'problem-solving', name: 'Problem Solving', icon: 'lightbulb', level: 95, category: 'soft', description: 'Analytical thinking, debugging' },
    { id: 'leadership', name: 'Leadership', icon: 'award', level: 80, category: 'soft', description: 'Mentoring, code reviews' }
  ]);

  readonly skillsByCategory = computed(() => {
    const grouped = new Map<SkillCategory, Skill[]>();
    this.skills().forEach(skill => {
      const existing = grouped.get(skill.category) || [];
      grouped.set(skill.category, [...existing, skill]);
    });
    return grouped;
  });

  // ==========================================
  // EXPERIENCE
  // ==========================================

  readonly experiences = signal<Experience[]>([
    {
      id: 'exp-1',
      title: 'Senior Frontend Developer',
      company: 'Tech Innovation Co.',
      location: 'Milan, Italy',
      startDate: '2022-03',
      current: true,
      description: 'Leading the frontend architecture for enterprise applications.',
      achievements: [
        'Led migration from AngularJS to Angular 17, improving performance by 40%',
        'Implemented micro-frontend architecture for scalable applications',
        'Mentored team of 5 junior developers',
        'Reduced bundle size by 60% through optimization strategies'
      ],
      technologies: ['Angular', 'TypeScript', 'RxJS', 'NgRx', 'Tailwind CSS']
    },
    {
      id: 'exp-2',
      title: 'Full Stack Developer',
      company: 'Digital Agency XYZ',
      location: 'Rome, Italy',
      startDate: '2020-01',
      endDate: '2022-02',
      current: false,
      description: 'Developed full-stack web applications for various clients.',
      achievements: [
        'Built 15+ client projects from scratch',
        'Implemented CI/CD pipelines reducing deployment time by 70%',
        'Created reusable component library adopted across projects',
        'Achieved 95+ Lighthouse scores on all projects'
      ],
      technologies: ['Angular', 'Node.js', 'MongoDB', 'Docker', 'AWS']
    },
    {
      id: 'exp-3',
      title: 'Junior Web Developer',
      company: 'StartUp Innovations',
      location: 'Naples, Italy',
      startDate: '2018-06',
      endDate: '2019-12',
      current: false,
      description: 'Started my professional journey building web applications.',
      achievements: [
        'Developed responsive websites for 10+ clients',
        'Learned modern JavaScript frameworks',
        'Contributed to open-source projects',
        'Improved SEO scores by average of 30%'
      ],
      technologies: ['JavaScript', 'HTML/CSS', 'jQuery', 'WordPress', 'PHP']
    }
  ]);

  // ==========================================
  // TESTIMONIALS
  // ==========================================

  readonly testimonials = signal<Testimonial[]>([
    {
      id: 'test-1',
      name: 'Marco Rossi',
      role: 'CTO',
      company: 'Tech Innovation Co.',
      avatar: '/assets/images/testimonials/avatar1.jpg',
      content: 'An exceptional developer with a keen eye for detail. Delivered our project ahead of schedule with outstanding quality.',
      rating: 5,
      date: '2024-01'
    },
    {
      id: 'test-2',
      name: 'Laura Bianchi',
      role: 'Product Manager',
      company: 'Digital Agency XYZ',
      avatar: '/assets/images/testimonials/avatar2.jpg',
      content: 'Great communicator and problem solver. Always goes above and beyond to ensure client satisfaction.',
      rating: 5,
      date: '2023-08'
    },
    {
      id: 'test-3',
      name: 'Andrea Verdi',
      role: 'Lead Designer',
      company: 'Creative Studio',
      avatar: '/assets/images/testimonials/avatar3.jpg',
      content: 'Transforms designs into pixel-perfect implementations. A pleasure to work with on every project.',
      rating: 5,
      date: '2023-05'
    }
  ]);

  // ==========================================
  // TIMELINE
  // ==========================================

  readonly timeline = signal<TimelineItem[]>([
    { id: 'tl-1', year: '2024', title: 'Senior Frontend Developer', description: 'Promoted to senior role, leading frontend architecture', type: 'work' },
    { id: 'tl-2', year: '2023', title: 'Open Source Contributor', description: 'Started contributing to major Angular ecosystem projects', type: 'achievement' },
    { id: 'tl-3', year: '2022', title: 'Full Stack Developer', description: 'Joined Tech Innovation Co. as full stack developer', type: 'work' },
    { id: 'tl-4', year: '2020', title: 'First Major Project', description: 'Launched first large-scale enterprise application', type: 'project' },
    { id: 'tl-5', year: '2018', title: 'Started Career', description: 'Began professional journey as web developer', type: 'work' },
    { id: 'tl-6', year: '2017', title: 'Computer Science Degree', description: 'Graduated with honors in Computer Science', type: 'education' }
  ]);

  // ==========================================
  // METHODS
  // ==========================================

  getProjectById(id: string): Project | undefined {
    return this.projects().find(p => p.id === id);
  }

  getProjectsByCategory(category: ProjectCategory): Project[] {
    return this.projects().filter(p => p.category === category);
  }

  getSkillsByCategory(category: SkillCategory): Skill[] {
    return this.skills().filter(s => s.category === category);
  }

  searchSkills(query: string): Skill[] {
    const lowerQuery = query.toLowerCase();
    return this.skills().filter(s => 
      s.name.toLowerCase().includes(lowerQuery) ||
      s.description?.toLowerCase().includes(lowerQuery)
    );
  }

  searchProjects(query: string): Project[] {
    const lowerQuery = query.toLowerCase();
    return this.projects().filter(p => 
      p.title.toLowerCase().includes(lowerQuery) ||
      p.description.toLowerCase().includes(lowerQuery) ||
      p.technologies.some(t => t.toLowerCase().includes(lowerQuery))
    );
  }
}
