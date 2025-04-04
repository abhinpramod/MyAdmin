const express = require('express');
const router = express.Router();
const upload = require('../middleware/multerConfig');

const {
    getAllJobTypes,
    Addjobtype,
    updateJobType,
    deleteJobType,
    getAllProductTypes,
    Addproducttype,
    updateproductType,
    deleteProductType
} = require('../controllers/settings.control');

// Get all job types
router.get('/get-all-job-types', getAllJobTypes);

// Add a new job type
router.post('/add-job-type', upload.single('image'), Addjobtype);

// Update a job type
router.put('/editjobtype/:id', upload.single('image'), updateJobType);

// Delete a job type
router.delete('/deletejobtype/:id', deleteJobType);
router.get('/get-all-product-types', getAllProductTypes);
router.post('/add-product-type', upload.single('image'), Addproducttype);
router.put('/editproducttype/:id', upload.single('image'), updateproductType);
router.delete('/deleteproducttype/:id', deleteProductType);

module.exports = router;