const express= require('express')
const router = express.Router();
const  {
    requeststepone,
    // requestdocuments
} =require( "../controllers/contractor.control")
 

router.get("/requests/step-one", requeststepone)
// router.get("/requests/documents", requestdocuments)

module.exports = router