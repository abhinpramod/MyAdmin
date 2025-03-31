const Jobtypes = require("../model/JobTypes.js");
const cloudinary = require("../lib/cloudinary.js");
const ProductType = require("../model/ProductType.js");

// Get all job types
const getAllJobTypes = async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const searchTerm = req.query.search || '';
      const skip = (page - 1) * limit;
  
      // Build search query
      const query = searchTerm 
        ? { name: { $regex: searchTerm, $options: 'i' } } 
        : {};
  
      // Execute queries in parallel
      const [jobTypes, totalCount] = await Promise.all([
        Jobtypes.find(query)
          .skip(skip)
          .limit(limit)
          .sort({ createdAt: -1 }),
        Jobtypes.countDocuments(query)
      ]);
  
      const hasMore = skip + limit < totalCount;
  
      res.json({
        success: true,
        data: jobTypes,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalCount / limit),
          totalItems: totalCount,
          hasMore
        }
      });
    } catch (error) {
      console.error('Error fetching job types:', error);
      res.status(500).json({ 
        success: false,
        message: 'Server error while fetching job types'
      });
    }
  };

// Add a new job type
const Addjobtype = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name || !req.file) {
            return res.status(400).json({ message: 'Name and image are required' });
        }

        // Upload image to Cloudinary
        const result = await cloudinary.uploader.upload_stream({
            folder: 'job_types',
        }, async (error, result) => {
            if (error) {
                console.error('Cloudinary upload error:', error);
                return res.status(500).json({ message: 'Image upload failed' });
            }

            // Save job type in database
            const newJobType = new Jobtypes({
                name,
                image: result.secure_url,
                imagepublicid: result.public_id,
            });

            await newJobType.save();

            res.status(201).json({ message: 'Job type added successfully' });
        });

        result.end(req.file.buffer);
    } catch (error) {
        console.error('Error adding job type:', error);
        res.status(500).json({ message: 'Failed to add job type' });
    }
};

// Update a job type
const updateJobType = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;
        const file = req.file;

        // Find the job type by ID
        const jobType = await Jobtypes.findById(id);
        if (!jobType) {
            return res.status(404).json({ message: 'Job type not found' });
        }

        // If a new image is provided, upload it to Cloudinary and delete the old image
        if (file) {
            // Delete the old image from Cloudinary
            await cloudinary.uploader.destroy(jobType.imagepublicid);

            // Upload the new image to Cloudinary
            const result = await cloudinary.uploader.upload_stream({
                folder: 'job_types',
            }, async (error, result) => {
                if (error) {
                    console.error('Cloudinary upload error:', error);
                    return res.status(500).json({ message: 'Image upload failed' });
                }

                // Update the job type with the new image
                jobType.image = result.secure_url;
                jobType.imagepublicid = result.public_id;

                // If a new name is provided, update it
                if (name) {
                    jobType.name = name;
                }

                await jobType.save();
                res.status(200).json({ message: 'Job type updated successfully' });
            });

            result.end(file.buffer);
        } else {
            // If no new image is provided, only update the name (if provided)
            if (name) {
                jobType.name = name;
                await jobType.save();
            }
            res.status(200).json({ message: 'Job type updated successfully' });
        }
    } catch (error) {
        console.error('Error updating job type:', error);
        res.status(500).json({ message: 'Failed to update job type' });
    }
};

// Delete a job type
const deleteJobType = async (req, res) => {
    try {
        const { id } = req.params;

        // Find the job type by ID
        const jobType = await Jobtypes.findById(id);
        if (!jobType) {
            return res.status(404).json({ message: 'Job type not found' });
        }

        // Delete the image from Cloudinary
        await cloudinary.uploader.destroy(jobType.imagepublicid);

        // Delete the job type from the database
        await Jobtypes.findByIdAndDelete(id);

        res.status(200).json({ message: 'Job type deleted successfully' });
    } catch (error) {
        console.error('Error deleting job type:', error);
        res.status(500).json({ message: 'Failed to delete job type' });
    }
};


const getAllProductTypes = async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const searchTerm = req.query.search || '';
      const skip = (page - 1) * limit;
  
      // Build search query
      const query = searchTerm 
        ? { name: { $regex: searchTerm, $options: 'i' } } 
        : {};
  
      // Execute queries in parallel
      const [productTypes, totalCount] = await Promise.all([
        ProductType.find(query)
          .skip(skip)
          .limit(limit)
          .sort({ createdAt: -1 }),
        ProductType.countDocuments(query)
      ]);
  
      const hasMore = skip + limit < totalCount;
  
      res.json({
        success: true,
        data: productTypes,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalCount / limit),
          totalItems: totalCount,
          hasMore
        }
      });
    } catch (error) {
      console.error('Error fetching product types:', error);
      res.status(500).json({ 
        success: false,
        message: 'Server error while fetching product types'
      });
    }
  };

  const Addproducttype = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name || !req.file) {
            return res.status(400).json({ message: 'Name and image are required' });
        }

        // Upload image to Cloudinary using promise-based function
        const result = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                { folder: 'product_types' },
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

        // Save product type in database
        const newProductType = new ProductType({
            name,
            image: result.secure_url,
            imagepublicid: result.public_id,
        });

        await newProductType.save();
        res.status(201).json({ message: 'Product type added successfully' });

    } catch (error) {
        console.error('Error adding product type:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}; 

const updateproductType = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;
        const file = req.file;

        // Find the product type by ID
        const productType = await ProductType.findById(id);
        if (!productType) {
            return res.status(404).json({ message: 'Product type not found' });
        }        

        // If a new image is provided, upload it to Cloudinary and delete the old image
        if (file) {
            // Delete the old image from Cloudinary
            await cloudinary.uploader.destroy(productType.imagepublicid);

            // Upload the new image to Cloudinary
            const result = await cloudinary.uploader.upload_stream({
                folder: 'product_types',
            });

            // Update the product type with the new image
            productType.image = result.secure_url;
            productType.imagepublicid = result.public_id;

            // If a new name is provided, update it
            if (name) {
                productType.name = name;
            }

            await productType.save();
            res.status(200).json({ message: 'Product type updated successfully' });
        } else {
            // If no new image is provided, only update the name (if provided)
            if (name) {
                productType.name = name;
                await productType.save();
            }
            res.status(200).json({ message: 'Product type updated successfully' });
        }                
    } catch (error) {
        console.error('Error updating product type:', error);
        res.status(500).json({ message: 'Failed to update product type' });
    }
};


const deleteProductType = async (req, res) => {
    try {
        const { id } = req.params;

        // Find the product type by ID
        const productType = await ProductType.findById(id);
        if (!productType) {
            return res.status(404).json({ message: 'Product type not found' });
        }

        // Delete the image from Cloudinary
        await cloudinary.uploader.destroy(productType.imagepublicid);

        // Delete the product type from the database
        await ProductType.findByIdAndDelete(id);

        res.status(200).json({ message: 'Product type deleted successfully' });
    } catch (error) {
        console.error('Error deleting product type:', error);
        res.status(500).json({ message: 'Failed to delete product type' });
    }
};

   
  

module.exports = { getAllJobTypes, Addjobtype, updateJobType, deleteJobType, getAllProductTypes, Addproducttype,updateproductType, deleteProductType };