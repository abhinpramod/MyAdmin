const Jobtypes = require("../model/JobTypes.js");
const cloudinary = require("../lib/cloudinary.js");

// Get all job types
const getAllJobTypes = async (req, res) => {
    try {
        const jobTypes = await Jobtypes.find();
        res.json(jobTypes);
    } catch (error) {
        res.status(500).json({ error: error.message });
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

module.exports = { getAllJobTypes, Addjobtype, updateJobType, deleteJobType };