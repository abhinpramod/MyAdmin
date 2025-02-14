const contractor = require("../model/contractor.js")   


const requeststepone = async (req, res) => {
    try {
        console.log("requeststepone");
        
       const data = await  contractor.find({registrationStep: 1}&&{approvalStatus: "Pending"});
        res.status(200).json(data); 
    } catch (error) {
        console.log("error from requeststepone", error.message);
        res.status(500).json({ msg: error.message }); 
    }
};


module.exports = { requeststepone };