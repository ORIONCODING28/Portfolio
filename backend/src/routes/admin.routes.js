const express = require('express');
const { body, validationResult } = require('express-validator');
const { query } = require('../db');
const { authMiddleware, adminOnly } = require('../middleware/auth.middleware');
const { asyncHandler } = require('../middleware/error.middleware');

const router = express.Router();

// Apply auth middleware to all admin routes
router.use(authMiddleware);
router.use(adminOnly);

// ============================================
// PROJECTS CRUD
// ============================================

// GET /api/admin/projects - Get all projects (including unpublished)
router.get('/projects', asyncHandler(async (req, res) => {
  const result = await query('SELECT * FROM projects ORDER BY sort_order ASC, created_at DESC');
  res.json(result.rows);
}));

// POST /api/admin/projects - Create project
router.post('/projects', [
  body('title').notEmpty().withMessage('Title is required'),
  body('description').notEmpty().withMessage('Description is required')
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { title, short_description, description, image_url, live_url, github_url, technologies, categories, highlights, featured, published } = req.body;

  const result = await query(`
    INSERT INTO projects (title, short_description, description, image_url, live_url, github_url, technologies, categories, highlights, featured, published)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
    RETURNING *
  `, [title, short_description, description, image_url, live_url, github_url, technologies || [], categories || [], highlights || [], featured || false, published || false]);

  res.status(201).json(result.rows[0]);
}));

// PUT /api/admin/projects/:id - Update project
router.put('/projects/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, short_description, description, image_url, live_url, github_url, technologies, categories, highlights, featured, published, sort_order } = req.body;

  const result = await query(`
    UPDATE projects SET
      title = COALESCE($1, title),
      short_description = COALESCE($2, short_description),
      description = COALESCE($3, description),
      image_url = COALESCE($4, image_url),
      live_url = COALESCE($5, live_url),
      github_url = COALESCE($6, github_url),
      technologies = COALESCE($7, technologies),
      categories = COALESCE($8, categories),
      highlights = COALESCE($9, highlights),
      featured = COALESCE($10, featured),
      published = COALESCE($11, published),
      sort_order = COALESCE($12, sort_order)
    WHERE id = $13
    RETURNING *
  `, [title, short_description, description, image_url, live_url, github_url, technologies, categories, highlights, featured, published, sort_order, id]);

  if (result.rows.length === 0) {
    return res.status(404).json({ error: 'Project not found' });
  }

  res.json(result.rows[0]);
}));

// DELETE /api/admin/projects/:id - Delete project
router.delete('/projects/:id', asyncHandler(async (req, res) => {
  const result = await query('DELETE FROM projects WHERE id = $1 RETURNING id', [req.params.id]);

  if (result.rows.length === 0) {
    return res.status(404).json({ error: 'Project not found' });
  }

  res.json({ message: 'Project deleted', id: result.rows[0].id });
}));

// ============================================
// SKILLS CRUD
// ============================================

router.get('/skills', asyncHandler(async (req, res) => {
  const result = await query('SELECT * FROM skills ORDER BY category, sort_order ASC');
  res.json(result.rows);
}));

router.post('/skills', [
  body('name').notEmpty().withMessage('Name is required'),
  body('category').notEmpty().withMessage('Category is required')
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, category, level, icon, description } = req.body;

  const result = await query(`
    INSERT INTO skills (name, category, level, icon, description)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
  `, [name, category, level || 80, icon, description]);

  res.status(201).json(result.rows[0]);
}));

router.put('/skills/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, category, level, icon, description, sort_order } = req.body;

  const result = await query(`
    UPDATE skills SET
      name = COALESCE($1, name),
      category = COALESCE($2, category),
      level = COALESCE($3, level),
      icon = COALESCE($4, icon),
      description = COALESCE($5, description),
      sort_order = COALESCE($6, sort_order)
    WHERE id = $7
    RETURNING *
  `, [name, category, level, icon, description, sort_order, id]);

  if (result.rows.length === 0) {
    return res.status(404).json({ error: 'Skill not found' });
  }

  res.json(result.rows[0]);
}));

router.delete('/skills/:id', asyncHandler(async (req, res) => {
  const result = await query('DELETE FROM skills WHERE id = $1 RETURNING id', [req.params.id]);

  if (result.rows.length === 0) {
    return res.status(404).json({ error: 'Skill not found' });
  }

  res.json({ message: 'Skill deleted', id: result.rows[0].id });
}));

// ============================================
// TESTIMONIALS CRUD
// ============================================

router.get('/testimonials', asyncHandler(async (req, res) => {
  const result = await query('SELECT * FROM testimonials ORDER BY created_at DESC');
  res.json(result.rows);
}));

router.post('/testimonials', [
  body('author').notEmpty().withMessage('Author is required'),
  body('text').notEmpty().withMessage('Text is required')
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { author, role, company, text, avatar_url, rating, featured, published } = req.body;

  const result = await query(`
    INSERT INTO testimonials (author, role, company, text, avatar_url, rating, featured, published)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING *
  `, [author, role, company, text, avatar_url, rating || 5, featured || false, published !== false]);

  res.status(201).json(result.rows[0]);
}));

router.put('/testimonials/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { author, role, company, text, avatar_url, rating, featured, published } = req.body;

  const result = await query(`
    UPDATE testimonials SET
      author = COALESCE($1, author),
      role = COALESCE($2, role),
      company = COALESCE($3, company),
      text = COALESCE($4, text),
      avatar_url = COALESCE($5, avatar_url),
      rating = COALESCE($6, rating),
      featured = COALESCE($7, featured),
      published = COALESCE($8, published)
    WHERE id = $9
    RETURNING *
  `, [author, role, company, text, avatar_url, rating, featured, published, id]);

  if (result.rows.length === 0) {
    return res.status(404).json({ error: 'Testimonial not found' });
  }

  res.json(result.rows[0]);
}));

router.delete('/testimonials/:id', asyncHandler(async (req, res) => {
  const result = await query('DELETE FROM testimonials WHERE id = $1 RETURNING id', [req.params.id]);

  if (result.rows.length === 0) {
    return res.status(404).json({ error: 'Testimonial not found' });
  }

  res.json({ message: 'Testimonial deleted', id: result.rows[0].id });
}));

// ============================================
// EXPERIENCES CRUD
// ============================================

router.get('/experiences', asyncHandler(async (req, res) => {
  const result = await query('SELECT * FROM experiences ORDER BY start_date DESC');
  res.json(result.rows);
}));

router.post('/experiences', [
  body('title').notEmpty().withMessage('Title is required')
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { title, company, location, start_date, end_date, is_current, description, technologies, type } = req.body;

  const result = await query(`
    INSERT INTO experiences (title, company, location, start_date, end_date, is_current, description, technologies, type)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    RETURNING *
  `, [title, company, location, start_date, end_date, is_current || false, description, technologies || [], type || 'work']);

  res.status(201).json(result.rows[0]);
}));

router.put('/experiences/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, company, location, start_date, end_date, is_current, description, technologies, type, sort_order } = req.body;

  const result = await query(`
    UPDATE experiences SET
      title = COALESCE($1, title),
      company = COALESCE($2, company),
      location = COALESCE($3, location),
      start_date = COALESCE($4, start_date),
      end_date = $5,
      is_current = COALESCE($6, is_current),
      description = COALESCE($7, description),
      technologies = COALESCE($8, technologies),
      type = COALESCE($9, type),
      sort_order = COALESCE($10, sort_order)
    WHERE id = $11
    RETURNING *
  `, [title, company, location, start_date, end_date, is_current, description, technologies, type, sort_order, id]);

  if (result.rows.length === 0) {
    return res.status(404).json({ error: 'Experience not found' });
  }

  res.json(result.rows[0]);
}));

router.delete('/experiences/:id', asyncHandler(async (req, res) => {
  const result = await query('DELETE FROM experiences WHERE id = $1 RETURNING id', [req.params.id]);

  if (result.rows.length === 0) {
    return res.status(404).json({ error: 'Experience not found' });
  }

  res.json({ message: 'Experience deleted', id: result.rows[0].id });
}));

// ============================================
// PALETTES/THEMES CRUD
// ============================================

router.get('/palettes', asyncHandler(async (req, res) => {
  const result = await query('SELECT * FROM palettes ORDER BY name ASC');
  res.json(result.rows);
}));

router.post('/palettes', [
  body('name').notEmpty().withMessage('Name is required'),
  body('slug').notEmpty().withMessage('Slug is required'),
  body('colors').isObject().withMessage('Colors object is required')
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, slug, colors, content } = req.body;

  const result = await query(`
    INSERT INTO palettes (name, slug, colors, content)
    VALUES ($1, $2, $3, $4)
    RETURNING *
  `, [name, slug, JSON.stringify(colors), content ? JSON.stringify(content) : null]);

  res.status(201).json(result.rows[0]);
}));

router.put('/palettes/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, colors, content, is_active } = req.body;

  // If setting this palette as active, deactivate others
  if (is_active) {
    await query('UPDATE palettes SET is_active = false WHERE is_active = true');
  }

  const result = await query(`
    UPDATE palettes SET
      name = COALESCE($1, name),
      colors = COALESCE($2, colors),
      content = COALESCE($3, content),
      is_active = COALESCE($4, is_active)
    WHERE id = $5
    RETURNING *
  `, [name, colors ? JSON.stringify(colors) : null, content ? JSON.stringify(content) : null, is_active, id]);

  if (result.rows.length === 0) {
    return res.status(404).json({ error: 'Palette not found' });
  }

  res.json(result.rows[0]);
}));

router.delete('/palettes/:id', asyncHandler(async (req, res) => {
  const result = await query('DELETE FROM palettes WHERE id = $1 RETURNING id', [req.params.id]);

  if (result.rows.length === 0) {
    return res.status(404).json({ error: 'Palette not found' });
  }

  res.json({ message: 'Palette deleted', id: result.rows[0].id });
}));

// ============================================
// META/CONTENT CRUD
// ============================================

router.get('/meta', asyncHandler(async (req, res) => {
  const result = await query('SELECT * FROM portfolio_meta ORDER BY meta_key ASC');
  res.json(result.rows);
}));

router.put('/meta/:key', asyncHandler(async (req, res) => {
  const { key } = req.params;
  const { value, json } = req.body;

  const result = await query(`
    INSERT INTO portfolio_meta (meta_key, meta_value, meta_json)
    VALUES ($1, $2, $3)
    ON CONFLICT (meta_key) DO UPDATE SET
      meta_value = COALESCE($2, portfolio_meta.meta_value),
      meta_json = COALESCE($3, portfolio_meta.meta_json)
    RETURNING *
  `, [key, value, json ? JSON.stringify(json) : null]);

  res.json(result.rows[0]);
}));

// ============================================
// PERSONAL INFO
// ============================================

router.get('/personal-info', asyncHandler(async (req, res) => {
  const result = await query('SELECT * FROM personal_info LIMIT 1');
  res.json(result.rows[0] || {});
}));

router.put('/personal-info', asyncHandler(async (req, res) => {
  const { name, title, email, phone, location, bio, avatar_url, resume_url, socials } = req.body;

  // Upsert personal info
  const result = await query(`
    INSERT INTO personal_info (id, name, title, email, phone, location, bio, avatar_url, resume_url, socials)
    VALUES (uuid_generate_v4(), $1, $2, $3, $4, $5, $6, $7, $8, $9)
    ON CONFLICT (id) DO UPDATE SET
      name = COALESCE($1, personal_info.name),
      title = COALESCE($2, personal_info.title),
      email = COALESCE($3, personal_info.email),
      phone = COALESCE($4, personal_info.phone),
      location = COALESCE($5, personal_info.location),
      bio = COALESCE($6, personal_info.bio),
      avatar_url = COALESCE($7, personal_info.avatar_url),
      resume_url = COALESCE($8, personal_info.resume_url),
      socials = COALESCE($9, personal_info.socials)
    RETURNING *
  `, [name, title, email, phone, location, bio, avatar_url, resume_url, socials ? JSON.stringify(socials) : null]);

  res.json(result.rows[0]);
}));

module.exports = router;
