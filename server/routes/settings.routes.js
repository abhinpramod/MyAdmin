const express= require('express');
const router = express.Router();
const upload = require('../middleware/multerConfig');

const { getAllJobTypes,Addjobtype } = require('../controllers/settings.control');



router.get('/get-all-job-types',getAllJobTypes) 
router.post('/add-job-type', upload.single('image'), Addjobtype);

module.exports = router
