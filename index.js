const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

const orderRoute = require('./src/routes/order');
const adminRoute = require("./src/routes/admin");
const blogRoute = require("./src/routes/blog");
const itemRoute = require("./src/routes/item");
const customerRoute = require("./src/routes/customer");
const galleryRoute = require("./src/routes/gallery");

const app = express();
dotenv.config();
const PORT = process.env.PORT || 4000;

mongoose.set("strictQuery", false);
mongoose.connect(process.env.MONGO_URL).then(()=> console.log("db connected")).catch(err => console.log(err))

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, PUT, PATCH, OPTION');
  res.setHeader('Access-Control-Allow-Methods', 'Content-Type, Authorization');
  next();
})

app.use(cors()) 
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb', extended: false}));

app.listen(PORT, () => {
  console.log(`backend is running on port ${PORT}`);
});

app.get('/', (req, res) => {
  res.send("server is running!")
})

app.use("/api", orderRoute);
app.use("/api/admin", adminRoute);
app.use("/api/blog", blogRoute);
app.use("/api/item", itemRoute);
app.use("/api/customer", customerRoute);
app.use("/api/gallery", galleryRoute);