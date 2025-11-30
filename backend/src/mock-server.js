// Mock API Server for testing without PostgreSQL
// This allows testing the admin panel without a real database

const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = 'mock-jwt-secret-for-testing';

// Middleware
app.use(cors({ origin: 'http://localhost:4200', credentials: true }));
app.use(express.json());

// Data file path
const DATA_FILE = path.join(__dirname, 'mock-data.json');

// Initialize data
let data = {
  users: [
    {
      id: '1',
      email: 'admin@portfolio.dev',
      password: bcrypt.hashSync('admin123', 10),
      name: 'Admin',
      role: 'admin'
    }
  ],
  projects: [
    { id: '1', title: 'E-Commerce Platform', short_description: 'Full-stack e-commerce', description: 'A complete e-commerce solution with Angular and Node.js', image_url: '', live_url: '', github_url: '', technologies: ['Angular', 'Node.js', 'PostgreSQL'], categories: ['Web App'], highlights: [], featured: true, published: true, sort_order: 1, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: '2', title: 'Task Management App', short_description: 'Productivity tool', description: 'A modern task management application', image_url: '', live_url: '', github_url: '', technologies: ['React', 'TypeScript', 'Firebase'], categories: ['Web App'], highlights: [], featured: false, published: true, sort_order: 2, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }
  ],
  skills: [
    { id: '1', name: 'Angular', category: 'Frontend', level: 95, icon: '🅰️', description: '', sort_order: 1 },
    { id: '2', name: 'TypeScript', category: 'Languages', level: 90, icon: '📘', description: '', sort_order: 2 },
    { id: '3', name: 'Node.js', category: 'Backend', level: 85, icon: '🟢', description: '', sort_order: 3 },
    { id: '4', name: 'React', category: 'Frontend', level: 80, icon: '⚛️', description: '', sort_order: 4 },
    { id: '5', name: 'PostgreSQL', category: 'Database', level: 75, icon: '🐘', description: '', sort_order: 5 }
  ],
  testimonials: [
    { id: '1', author: 'Marco Rossi', role: 'CEO', company: 'TechCorp', text: 'Excellent work on our project!', avatar_url: '', rating: 5, featured: true, published: true, created_at: new Date().toISOString() },
    { id: '2', author: 'Laura Bianchi', role: 'CTO', company: 'StartupXYZ', text: 'Very professional and skilled developer.', avatar_url: '', rating: 5, featured: false, published: true, created_at: new Date().toISOString() }
  ],
  experiences: [
    { id: '1', title: 'Senior Developer', company: 'TechCorp', location: 'Milano, IT', start_date: '2022-01-01', end_date: null, is_current: true, description: 'Leading frontend development team', technologies: ['Angular', 'TypeScript'], type: 'work', sort_order: 1 },
    { id: '2', title: 'Full Stack Developer', company: 'WebAgency', location: 'Roma, IT', start_date: '2020-01-01', end_date: '2021-12-31', is_current: false, description: 'Building web applications', technologies: ['React', 'Node.js'], type: 'work', sort_order: 2 }
  ],
  palettes: [
    { id: '1', name: 'Default Violet', slug: 'default', colors: { primary: '#9D4EDD', secondary: '#00D9FF', accent: '#00B8CC', background: '#1a1a3e', text: '#ffffff', textSecondary: '#94a3b8' }, content: {}, is_active: true },
    { id: '2', name: 'Minimal Dark', slug: 'minimal', colors: { primary: '#6366f1', secondary: '#a855f7', accent: '#ec4899', background: '#0f0f0f', text: '#ffffff', textSecondary: '#a1a1aa' }, content: {}, is_active: false },
    { id: '3', name: 'Hacker', slug: 'hacker', colors: { primary: '#00ff00', secondary: '#00cc00', accent: '#00ff00', background: '#000000', text: '#00ff00', textSecondary: '#00aa00' }, content: {}, is_active: false }
  ],
  meta: [],
  personalInfo: { name: 'Developer', title: 'Full Stack Developer', email: 'dev@example.com', phone: '', location: 'Italia', bio: '', avatar_url: '', resume_url: '', socials: {} }
};

// Load data from file if exists
try {
  if (fs.existsSync(DATA_FILE)) {
    data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  }
} catch (e) {
  console.log('Using default data');
}

// Save data to file
const saveData = () => {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
};

// Generate UUID
const uuid = () => Date.now().toString(36) + Math.random().toString(36).substr(2);

// Auth middleware
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (e) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// =================== AUTH ROUTES ===================
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const user = data.users.find(u => u.email === email);
  
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  
  const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
  const refreshToken = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '30d' });
  
  res.json({
    token,
    refreshToken,
    user: { id: user.id, email: user.email, name: user.name, role: user.role }
  });
});

app.get('/api/auth/me', authMiddleware, (req, res) => {
  const user = data.users.find(u => u.id === req.user.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json({ id: user.id, email: user.email, name: user.name, role: user.role });
});

app.post('/api/auth/refresh', (req, res) => {
  const { refreshToken } = req.body;
  try {
    const decoded = jwt.verify(refreshToken, JWT_SECRET);
    const token = jwt.sign({ id: decoded.id }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token });
  } catch (e) {
    res.status(401).json({ error: 'Invalid refresh token' });
  }
});

app.post('/api/auth/logout', (req, res) => res.json({ message: 'Logged out' }));

// =================== PUBLIC ROUTES ===================
app.get('/api/projects', (req, res) => res.json(data.projects.filter(p => p.published)));
app.get('/api/projects/:id', (req, res) => {
  const project = data.projects.find(p => p.id === req.params.id);
  project ? res.json(project) : res.status(404).json({ error: 'Not found' });
});
app.get('/api/skills', (req, res) => res.json(data.skills));
app.get('/api/testimonials', (req, res) => res.json(data.testimonials.filter(t => t.published)));
app.get('/api/experiences', (req, res) => res.json(data.experiences));
app.get('/api/palettes', (req, res) => res.json(data.palettes));
app.get('/api/palettes/active', (req, res) => res.json(data.palettes.find(p => p.is_active) || data.palettes[0]));
app.get('/api/meta', (req, res) => res.json(data.meta));
app.get('/api/personal-info', (req, res) => res.json(data.personalInfo));

// =================== ADMIN ROUTES ===================
// Projects
app.get('/api/admin/projects', authMiddleware, (req, res) => res.json(data.projects));
app.post('/api/admin/projects', authMiddleware, (req, res) => {
  const project = { id: uuid(), ...req.body, created_at: new Date().toISOString(), updated_at: new Date().toISOString() };
  data.projects.push(project);
  saveData();
  res.status(201).json(project);
});
app.put('/api/admin/projects/:id', authMiddleware, (req, res) => {
  const idx = data.projects.findIndex(p => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  data.projects[idx] = { ...data.projects[idx], ...req.body, updated_at: new Date().toISOString() };
  saveData();
  res.json(data.projects[idx]);
});
app.delete('/api/admin/projects/:id', authMiddleware, (req, res) => {
  const idx = data.projects.findIndex(p => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  data.projects.splice(idx, 1);
  saveData();
  res.json({ message: 'Deleted', id: req.params.id });
});

// Skills
app.get('/api/admin/skills', authMiddleware, (req, res) => res.json(data.skills));
app.post('/api/admin/skills', authMiddleware, (req, res) => {
  const skill = { id: uuid(), ...req.body };
  data.skills.push(skill);
  saveData();
  res.status(201).json(skill);
});
app.put('/api/admin/skills/:id', authMiddleware, (req, res) => {
  const idx = data.skills.findIndex(s => s.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  data.skills[idx] = { ...data.skills[idx], ...req.body };
  saveData();
  res.json(data.skills[idx]);
});
app.delete('/api/admin/skills/:id', authMiddleware, (req, res) => {
  const idx = data.skills.findIndex(s => s.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  data.skills.splice(idx, 1);
  saveData();
  res.json({ message: 'Deleted', id: req.params.id });
});

// Testimonials
app.get('/api/admin/testimonials', authMiddleware, (req, res) => res.json(data.testimonials));
app.post('/api/admin/testimonials', authMiddleware, (req, res) => {
  const item = { id: uuid(), ...req.body, created_at: new Date().toISOString() };
  data.testimonials.push(item);
  saveData();
  res.status(201).json(item);
});
app.put('/api/admin/testimonials/:id', authMiddleware, (req, res) => {
  const idx = data.testimonials.findIndex(t => t.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  data.testimonials[idx] = { ...data.testimonials[idx], ...req.body };
  saveData();
  res.json(data.testimonials[idx]);
});
app.delete('/api/admin/testimonials/:id', authMiddleware, (req, res) => {
  const idx = data.testimonials.findIndex(t => t.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  data.testimonials.splice(idx, 1);
  saveData();
  res.json({ message: 'Deleted', id: req.params.id });
});

// Experiences
app.get('/api/admin/experiences', authMiddleware, (req, res) => res.json(data.experiences));
app.post('/api/admin/experiences', authMiddleware, (req, res) => {
  const item = { id: uuid(), ...req.body };
  data.experiences.push(item);
  saveData();
  res.status(201).json(item);
});
app.put('/api/admin/experiences/:id', authMiddleware, (req, res) => {
  const idx = data.experiences.findIndex(e => e.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  data.experiences[idx] = { ...data.experiences[idx], ...req.body };
  saveData();
  res.json(data.experiences[idx]);
});
app.delete('/api/admin/experiences/:id', authMiddleware, (req, res) => {
  const idx = data.experiences.findIndex(e => e.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  data.experiences.splice(idx, 1);
  saveData();
  res.json({ message: 'Deleted', id: req.params.id });
});

// Palettes
app.get('/api/admin/palettes', authMiddleware, (req, res) => res.json(data.palettes));
app.post('/api/admin/palettes', authMiddleware, (req, res) => {
  const item = { id: uuid(), ...req.body };
  data.palettes.push(item);
  saveData();
  res.status(201).json(item);
});
app.put('/api/admin/palettes/:id', authMiddleware, (req, res) => {
  const idx = data.palettes.findIndex(p => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  if (req.body.is_active) {
    data.palettes.forEach(p => p.is_active = false);
  }
  data.palettes[idx] = { ...data.palettes[idx], ...req.body };
  saveData();
  res.json(data.palettes[idx]);
});
app.delete('/api/admin/palettes/:id', authMiddleware, (req, res) => {
  const idx = data.palettes.findIndex(p => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  data.palettes.splice(idx, 1);
  saveData();
  res.json({ message: 'Deleted', id: req.params.id });
});

// Meta
app.get('/api/admin/meta', authMiddleware, (req, res) => res.json(data.meta));
app.put('/api/admin/meta/:key', authMiddleware, (req, res) => {
  const idx = data.meta.findIndex(m => m.meta_key === req.params.key);
  const item = { id: uuid(), meta_key: req.params.key, meta_value: req.body.value, meta_json: req.body.json };
  if (idx === -1) {
    data.meta.push(item);
  } else {
    data.meta[idx] = item;
  }
  saveData();
  res.json(item);
});

// Personal Info
app.get('/api/admin/personal-info', authMiddleware, (req, res) => res.json(data.personalInfo));
app.put('/api/admin/personal-info', authMiddleware, (req, res) => {
  data.personalInfo = { ...data.personalInfo, ...req.body };
  saveData();
  res.json(data.personalInfo);
});

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok', mode: 'mock' }));

// Start server
app.listen(PORT, () => {
  console.log(`\n🚀 Mock API Server running on http://localhost:${PORT}`);
  console.log(`📦 Using file-based storage (mock-data.json)`);
  console.log(`\n🔐 Admin login: admin@portfolio.dev / admin123`);
  console.log(`\n📡 Endpoints:`);
  console.log(`   GET  /api/health`);
  console.log(`   POST /api/auth/login`);
  console.log(`   GET  /api/projects, /api/skills, /api/testimonials, etc.`);
  console.log(`   GET  /api/admin/* (requires auth)`);
  console.log('\n');
});
