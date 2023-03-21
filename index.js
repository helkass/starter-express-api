const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const bodyParser = require("body-parser");

const orderRoute = require("./src/routes/order");
const adminRoute = require("./src/routes/admin");
const blogRoute = require("./src/routes/blog");
const itemRoute = require("./src/routes/item");
const customerRoute = require("./src/routes/customer");
const galleryRoute = require("./src/routes/gallery");

const app = express();
dotenv.config();
const PORT = process.env.PORT || 4000;

mongoose.set("strictQuery", false);
mongoose
   .connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
   })
   .then(() => console.log("db connected"))
   .catch((err) => console.log(err));

// cors options while development
// if client on mode productions or deploy, origin set a valid url client for unblocked cores and privacy policy
// * all data cant used method
const corsOptions = {
   // origin: "https://horizon-mern-vercel.vercel.app/",
   origin: "*",
   optionSuccessStatus: 200,
};

// handling permission and policy
app.use(cors());

// handling file for request
app.use(bodyParser.json({ limit: "100mb" }));
app.use(
   bodyParser.urlencoded({
      limit: "100mb",
      extended: true,
   })
);

app.listen(PORT, () => {
   console.log(`backend is running on port ${PORT}`);
});

app.get("/", (req, res) => {
   res.send("server is running!");
});

app.use("/api/order", orderRoute);
app.use("/api/admin", adminRoute);
app.use("/api/blog", blogRoute);
app.use("/api/item", itemRoute);
app.use("/api/customer", customerRoute);
app.use("/api/gallery", galleryRoute);
