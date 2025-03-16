const jobtypes = require("../model/JobTypes.js");


const getAllJobTypes = async (req, res) => {
    try {
        const jobTypes = await jobtypes.find();
        res.json(jobTypes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const Addjobtype = async (req, res) => {
    try {
      const { name } = req.body;
      if (!req.file || !name) {
        return res.status(400).json({ error: 'Both name and image are required' });
      }
  
      // Cloudinary URL is in req.file.path
      const jobType = new  jobtypes ({
        name,
        image: req.file.path, 
        // Cloudinary URL
      });
  
      await jobType.save();
      res.status(201).json(jobType);
    } catch (error) {
      console.error('Error adding job type:', error);
      res.status(500).json({ error: error.message });
    }
  };
  

module.exports = { getAllJobTypes, Addjobtype };