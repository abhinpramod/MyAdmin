// routes/testimonials.js
const express = require('express');
const router = express.Router();
const upload = require('../middleware/multerConfig');
const {
  getAllTestimonials,
  addTestimonial,
  updateTestimonial,
  deleteTestimonial
} = require('../controllers/testimonials');

// Get all testimonials
router.get('/', getAllTestimonials);

// Add a new testimonial
router.post('/', upload.single('image'), addTestimonial);

// Update a testimonial
router.put('/:id', upload.single('image'), updateTestimonial);

// Delete a testimonial
router.delete('/:id', deleteTestimonial);

module.exports = router;