require('dotenv').config();
const bcrypt = require('bcryptjs');
const { pool, query } = require('./index');

async function seedDatabase() {
  try {
    console.log('🌱 Seeding database...');

    // Create admin user
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@portfolio.dev';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
    const passwordHash = await bcrypt.hash(adminPassword, 12);

    await query(`
      INSERT INTO users (email, password_hash, name, role)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (email) DO UPDATE SET password_hash = $2
    `, [adminEmail, passwordHash, 'Admin', 'admin']);
    console.log(`✅ Admin user created: ${adminEmail}`);

    // Seed personal info
    await query(`
      INSERT INTO personal_info (name, title, email, location, bio, socials)
      VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT DO NOTHING
    `, [
      'Giuseppe Pepe',
      'Full Stack Developer',
      'giuseppe@example.com',
      'Italia',
      'Sviluppatore appassionato con oltre 5 anni di esperienza nella creazione di applicazioni web moderne e performanti.',
      JSON.stringify([
        { name: 'GitHub', icon: 'github', url: 'https://github.com/ORIONCODING28' },
        { name: 'LinkedIn', icon: 'linkedin', url: 'https://linkedin.com/in/' },
        { name: 'Twitter', icon: 'twitter', url: 'https://twitter.com/' }
      ])
    ]);
    console.log('✅ Personal info seeded');

    // Seed projects
    const projects = [
      {
        title: 'E-Commerce Platform',
        short_description: 'Piattaforma e-commerce completa con Angular e Node.js',
        description: 'Una piattaforma e-commerce moderna con gestione prodotti, carrello, pagamenti Stripe e dashboard admin.',
        technologies: ['Angular', 'Node.js', 'PostgreSQL', 'Stripe', 'Tailwind CSS'],
        categories: ['fullstack', 'frontend'],
        highlights: ['Pagamenti sicuri con Stripe', '1000+ prodotti gestiti', 'Dashboard analytics'],
        featured: true,
        published: true
      },
      {
        title: 'Task Management App',
        short_description: 'App per gestione task con drag & drop',
        description: 'Applicazione per la gestione dei task con board Kanban, drag & drop, e collaborazione in tempo reale.',
        technologies: ['Angular', 'Firebase', 'RxJS', 'SCSS'],
        categories: ['frontend'],
        highlights: ['Real-time sync', 'Drag & Drop', 'Team collaboration'],
        featured: true,
        published: true
      },
      {
        title: 'Weather Dashboard',
        short_description: 'Dashboard meteo con API e grafici interattivi',
        description: 'Dashboard per visualizzare dati meteo con grafici interattivi e previsioni a 7 giorni.',
        technologies: ['Angular', 'Chart.js', 'OpenWeather API', 'Tailwind'],
        categories: ['frontend'],
        highlights: ['Previsioni 7 giorni', 'Grafici interattivi', 'Geolocalizzazione'],
        featured: false,
        published: true
      },
      {
        title: 'REST API Backend',
        short_description: 'API RESTful scalabile con Node.js',
        description: 'Backend API completo con autenticazione JWT, rate limiting, caching Redis e documentazione Swagger.',
        technologies: ['Node.js', 'Express', 'PostgreSQL', 'Redis', 'Swagger'],
        categories: ['backend'],
        highlights: ['JWT Auth', 'Rate limiting', 'API Documentation'],
        featured: false,
        published: true
      }
    ];

    for (const project of projects) {
      await query(`
        INSERT INTO projects (title, short_description, description, technologies, categories, highlights, featured, published)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      `, [
        project.title,
        project.short_description,
        project.description,
        project.technologies,
        project.categories,
        project.highlights,
        project.featured,
        project.published
      ]);
    }
    console.log(`✅ ${projects.length} projects seeded`);

    // Seed skills
    const skills = [
      { name: 'Angular', category: 'frontend', level: 95, icon: 'angular' },
      { name: 'TypeScript', category: 'frontend', level: 90, icon: 'typescript' },
      { name: 'React', category: 'frontend', level: 75, icon: 'react' },
      { name: 'Tailwind CSS', category: 'frontend', level: 90, icon: 'tailwind' },
      { name: 'SCSS/Sass', category: 'frontend', level: 85, icon: 'sass' },
      { name: 'Three.js', category: 'frontend', level: 70, icon: 'threejs' },
      { name: 'Node.js', category: 'backend', level: 85, icon: 'nodejs' },
      { name: 'Python', category: 'backend', level: 75, icon: 'python' },
      { name: 'PostgreSQL', category: 'backend', level: 80, icon: 'postgresql' },
      { name: 'MongoDB', category: 'backend', level: 75, icon: 'mongodb' },
      { name: 'GraphQL', category: 'backend', level: 70, icon: 'graphql' },
      { name: 'Git', category: 'tools', level: 90, icon: 'git' },
      { name: 'Docker', category: 'tools', level: 75, icon: 'docker' },
      { name: 'VS Code', category: 'tools', level: 95, icon: 'vscode' },
      { name: 'Figma', category: 'tools', level: 70, icon: 'figma' },
      { name: 'Communication', category: 'soft', level: 90, icon: 'chat' },
      { name: 'Team Work', category: 'soft', level: 85, icon: 'users' },
      { name: 'Problem Solving', category: 'soft', level: 95, icon: 'lightbulb' }
    ];

    for (const skill of skills) {
      await query(`
        INSERT INTO skills (name, category, level, icon)
        VALUES ($1, $2, $3, $4)
      `, [skill.name, skill.category, skill.level, skill.icon]);
    }
    console.log(`✅ ${skills.length} skills seeded`);

    // Seed testimonials
    const testimonials = [
      {
        author: 'Marco Rossi',
        role: 'CEO',
        company: 'TechStart Italia',
        text: 'Collaborare con Giuseppe è stata un\'esperienza eccezionale. Ha trasformato la nostra visione in realtà con un\'applicazione che ha superato ogni aspettativa.',
        rating: 5,
        featured: true
      },
      {
        author: 'Laura Bianchi',
        role: 'Product Manager',
        company: 'InnovateTech',
        text: 'Professionista eccezionale con una profonda comprensione delle esigenze del cliente. Il risultato finale è stato impeccabile.',
        rating: 5,
        featured: true
      },
      {
        author: 'Alessandro Verdi',
        role: 'CTO',
        company: 'StartupHub',
        text: 'Competenza tecnica di alto livello e capacità di problem solving eccezionale. Consiglio vivamente.',
        rating: 5,
        featured: false
      }
    ];

    for (const testimonial of testimonials) {
      await query(`
        INSERT INTO testimonials (author, role, company, text, rating, featured)
        VALUES ($1, $2, $3, $4, $5, $6)
      `, [testimonial.author, testimonial.role, testimonial.company, testimonial.text, testimonial.rating, testimonial.featured]);
    }
    console.log(`✅ ${testimonials.length} testimonials seeded`);

    // Seed experiences
    const experiences = [
      {
        title: 'Senior Frontend Developer',
        company: 'TechCorp',
        location: 'Milano, Italia',
        start_date: '2022-01-01',
        is_current: true,
        description: 'Sviluppo di applicazioni enterprise con Angular, gestione team di 4 sviluppatori.',
        technologies: ['Angular', 'TypeScript', 'RxJS', 'NgRx'],
        type: 'work'
      },
      {
        title: 'Full Stack Developer',
        company: 'StartupXYZ',
        location: 'Roma, Italia',
        start_date: '2020-03-01',
        end_date: '2021-12-31',
        description: 'Sviluppo full stack di piattaforme SaaS con Node.js e Angular.',
        technologies: ['Angular', 'Node.js', 'PostgreSQL', 'Docker'],
        type: 'work'
      },
      {
        title: 'Laurea in Informatica',
        company: 'Università degli Studi',
        location: 'Italia',
        start_date: '2016-09-01',
        end_date: '2020-02-28',
        description: 'Laurea magistrale in Informatica con specializzazione in sviluppo web.',
        technologies: [],
        type: 'education'
      }
    ];

    for (const exp of experiences) {
      await query(`
        INSERT INTO experiences (title, company, location, start_date, end_date, is_current, description, technologies, type)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      `, [exp.title, exp.company, exp.location, exp.start_date, exp.end_date || null, exp.is_current, exp.description, exp.technologies, exp.type]);
    }
    console.log(`✅ ${experiences.length} experiences seeded`);

    // Seed palettes/themes
    const palettes = [
      {
        name: 'Violet Dreams',
        slug: 'default',
        colors: {
          bgPrimary: '#1a1a3e',
          bgSecondary: '#252558',
          bgTertiary: '#0f0f24',
          accentPrimary: '#9D4EDD',
          accentSecondary: '#00D9FF',
          accentTertiary: '#00B8CC',
          textPrimary: '#FFFFFF',
          textSecondary: '#A1A1A6'
        },
        is_active: true
      },
      {
        name: 'Minimalist Light',
        slug: 'light',
        colors: {
          bgPrimary: '#ffffff',
          bgSecondary: '#f8f9fa',
          bgTertiary: '#f0f1f3',
          accentPrimary: '#7c3aed',
          accentSecondary: '#0891b2',
          accentTertiary: '#0d9488',
          textPrimary: '#1a1a2e',
          textSecondary: '#6b7280'
        },
        is_active: false
      },
      {
        name: 'Neon Futurism',
        slug: 'neon',
        colors: {
          bgPrimary: '#0A0E27',
          bgSecondary: '#0f1433',
          bgTertiary: '#050811',
          accentPrimary: '#FF006E',
          accentSecondary: '#00F5FF',
          accentTertiary: '#B537F2',
          textPrimary: '#f0f0ff',
          textSecondary: '#a0a0b0'
        },
        is_active: false
      },
      {
        name: 'Matrix Hacker',
        slug: 'hacker',
        colors: {
          bgPrimary: '#000000',
          bgSecondary: '#0a0f0a',
          bgTertiary: '#000000',
          accentPrimary: '#00ff41',
          accentSecondary: '#00ff41',
          accentTertiary: '#00cc33',
          textPrimary: '#00ff41',
          textSecondary: 'rgba(0, 255, 65, 0.7)'
        },
        is_active: false
      }
    ];

    for (const palette of palettes) {
      await query(`
        INSERT INTO palettes (name, slug, colors, is_active)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (slug) DO UPDATE SET colors = $3
      `, [palette.name, palette.slug, JSON.stringify(palette.colors), palette.is_active]);
    }
    console.log(`✅ ${palettes.length} palettes seeded`);

    // Seed portfolio meta
    const metaData = [
      { key: 'hero_greeting', value: '👋 Benvenuto nel mio portfolio' },
      { key: 'hero_name', value: 'Giuseppe Pepe' },
      { key: 'hero_title', value: 'Full Stack Developer' },
      { key: 'hero_subtitle', value: 'Creo esperienze digitali innovative e performanti' },
      { key: 'hero_cta', value: 'Vedi i Progetti' },
      { key: 'about_title', value: 'Chi Sono' },
      { key: 'about_intro', value: 'Trasformo idee in esperienze digitali' }
    ];

    for (const meta of metaData) {
      await query(`
        INSERT INTO portfolio_meta (meta_key, meta_value)
        VALUES ($1, $2)
        ON CONFLICT (meta_key) DO UPDATE SET meta_value = $2
      `, [meta.key, meta.value]);
    }
    console.log(`✅ ${metaData.length} meta entries seeded`);

    console.log('\n🎉 Database seeding completed successfully!');
    console.log(`\n📧 Admin login: ${adminEmail}`);
    console.log(`🔑 Admin password: ${adminPassword}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

seedDatabase();
