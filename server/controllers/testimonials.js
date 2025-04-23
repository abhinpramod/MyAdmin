// controllers/testimonialsController.js
const Testimonial = require('../model/testimonials');
const cloudinary = require('../lib/cloudinary');

// Get all testimonials with pagination and search
const getAllTestimonials = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const searchTerm = req.query.search || '';
    const skip = (page - 1) * limit;

    // Build search query
    const query = searchTerm 
      ? { 
          $or: [
            { name: { $regex: searchTerm, $options: 'i' } },
            { feedback: { $regex: searchTerm, $options: 'i' } }
          ]
        } 
      : {};

    // Execute queries in parallel
    const [testimonials, totalCount] = await Promise.all([
      Testimonial.find(query)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),
      Testimonial.countDocuments(query)
    ]);

    const hasMore = skip + limit < totalCount;

    res.json({
      success: true,
      data: testimonials,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
        totalItems: totalCount,
        hasMore
      }
    });
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error while fetching testimonials'
    });
  }
};

// Add a new testimonial
const addTestimonial = async (req, res) => {
  try {
    const { name, feedback, rating } = req.body;
    
    if (!name || !feedback || !rating || !req.file) {
      return res.status(400).json({ 
        success: false,
        message: 'Name, feedback, rating and image are required' 
      });
    }

    // Upload image to Cloudinary
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: 'testimonials' },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      );
      stream.end(req.file.buffer);
    });

    // Create new testimonial
    const newTestimonial = new Testimonial({
      name,
      feedback,
      rating,
      image: result.secure_url,
      imagepublicid: result.public_id
    });

    await newTestimonial.save();

    res.status(201).json({
      success: true,
      message: 'Testimonial added successfully',
      data: newTestimonial
    });
  } catch (error) {
    console.error('Error adding testimonial:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to add testimonial'
    });
  }
};

// Update a testimonial
const updateTestimonial = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, feedback, rating } = req.body;
    const file = req.file;

    // Find testimonial by ID
    const testimonial = await Testimonial.findById(id);
    if (!testimonial) {
      return res.status(404).json({ 
        success: false,
        message: 'Testimonial not found' 
      });
    }

    // If new image is provided
    if (file) {
      // Delete old image from Cloudinary
      await cloudinary.uploader.destroy(testimonial.imagepublicid);

      // Upload new image
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'testimonials' },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          }
        );
        stream.end(file.buffer);
      });

      testimonial.image = result.secure_url;
      testimonial.imagepublicid = result.public_id;
    }

    // Update fields
    if (name) testimonial.name = name;
    if (feedback) testimonial.feedback = feedback;
    if (rating) testimonial.rating = rating;

    await testimonial.save();

    res.json({
      success: true,
      message: 'Testimonial updated successfully',
      data: testimonial
    });
  } catch (error) {
    console.error('Error updating testimonial:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to update testimonial'
    });
  }
};

const deleteTestimonial = async (req, res) => {
  try {
    const { id } = req.params;

    // Find testimonial by ID
    const testimonial = await Testimonial.findById(id);
    if (!testimonial) {
      return res.status(404).json({ 
        success: false,
        message: 'Testimonial not found' 
      });
    }

    // Delete image from Cloudinary
    await cloudinary.uploader.destroy(testimonial.imagepublicid);

    // Delete testimonial from database
    await testimonial.deleteOne(); // Changed from remove() to deleteOne()

    res.json({
      success: true,
      message: 'Testimonial deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting testimonial:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to delete testimonial'
    });
  }
};

module.exports = {
  getAllTestimonials,
  addTestimonial,
  updateTestimonial,
  deleteTestimonial
};