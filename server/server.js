const express = require("express");
const app = express();
const dotenv = require("dotenv");
const {connectDB }= require("./lib/db");
const admincontrol = require("./routes/adminroutes")
const contractorcontrol = require("./routes/contractorcontrol")
const Usercontrol = require("./routes/usercontrol.routes")
const settingscontrol = require("./routes/settings.routes")
const storecontrol = require("./routes/store.routes")
const testimonials = require("./routes/testimonials.routes")
dotenv.config();
const cors = require("cors");
const CookieParser = require("cookie-parser");
app.use(express.json());
app.use(CookieParser());
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));


app.use('/api/admin',admincontrol)
app.use('/api/contractor',contractorcontrol)
app.use('/api/user',Usercontrol)
app.use('/api/settings',settingscontrol)
app.use('/api/stores',storecontrol)
app.use('/api/testimonials',testimonials)
connectDB()
  .then(() => {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`server is running on port ${PORT}`);
    });
  })
  .catch((error) => console.log("data base connection error", error.message));    