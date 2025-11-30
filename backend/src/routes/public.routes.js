const express = require('express');
const { query } = require('../db');
const { asyncHandler } = require('../middleware/error.middleware');

const router = express.Router();

// GET /api/projects - Get all published projects
router.get('/projects', asyncHandler(async (req, res) => {
  const result = await query(`
    SELECT * FROM projects 
    WHERE published = true 
    ORDER BY featured DESC, sort_order ASC, created_at DESC
  `);
  res.json(result.rows);
}));

// GET /api/projects/:id - Get single project
router.get('/projects/:id', asyncHandler(async (req, res) => {
  const result = await query('SELECT * FROM projects WHERE id = $1 AND published = true', [req.params.id]);
  
  if (result.rows.length === 0) {
    return res.status(404).json({ error: 'Project not found' });
  }
  
  res.json(result.rows[0]);
}));

// GET /api/skills - Get all skills
router.get('/skills', asyncHandler(async (req, res) => {
  const { category } = req.query;
  
  let queryText = 'SELECT * FROM skills ORDER BY sort_order ASC, level DESC';
  let params = [];
  
  if (category) {
    queryText = 'SELECT * FROM skills WHERE category = $1 ORDER BY sort_order ASC, level DESC';
    params = [category];
  }
  
  const result = await query(queryText, params);
  res.json(result.rows);
}));

// GET /api/testimonials - Get all published testimonials
router.get('/testimonials', asyncHandler(async (req, res) => {
  const result = await query(`
    SELECT * FROM testimonials 
    WHERE published = true 
    ORDER BY featured DESC, created_at DESC
  `);
  res.json(result.rows);
}));

// GET /api/experiences - Get all experiences
router.get('/experiences', asyncHandler(async (req, res) => {
  const result = await query(`
    SELECT * FROM experiences 
    ORDER BY is_current DESC, start_date DESC
  `);
  res.json(result.rows);
}));

// GET /api/palettes - Get all palettes
router.get('/palettes', asyncHandler(async (req, res) => {
  const result = await query('SELECT * FROM palettes ORDER BY is_active DESC, name ASC');
  res.json(result.rows);
}));

// GET /api/palettes/active - Get active palette
router.get('/palettes/active', asyncHandler(async (req, res) => {
  const result = await query('SELECT * FROM palettes WHERE is_active = true LIMIT 1');
  
  if (result.rows.length === 0) {
    return res.status(404).json({ error: 'No active palette found' });
  }
  
  res.json(result.rows[0]);
}));

// GET /api/meta/:key - Get meta value
router.get('/meta/:key', asyncHandler(async (req, res) => {
  const result = await query('SELECT * FROM portfolio_meta WHERE meta_key = $1', [req.params.key]);
  
  if (result.rows.length === 0) {
    return res.status(404).json({ error: 'Meta key not found' });
  }
  
  res.json(result.rows[0]);
}));

// GET /api/meta - Get all meta
router.get('/meta', asyncHandler(async (req, res) => {
  const result = await query('SELECT * FROM portfolio_meta');
  
  // Convert to key-value object
  const meta = {};
  result.rows.forEach(row => {
    meta[row.meta_key] = row.meta_value;
  });
  
  res.json(meta);
}));

// GET /api/personal-info - Get personal info
router.get('/personal-info', asyncHandler(async (req, res) => {
  const result = await query('SELECT * FROM personal_info LIMIT 1');
  
  if (result.rows.length === 0) {
    return res.status(404).json({ error: 'Personal info not found' });
  }
  
  res.json(result.rows[0]);
}));

module.exports = router;
