const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

const orderRoute = require("./src/routes/order");
const adminRoute = require("./src/routes/admin");
const blogRoute = require("./src/routes/blog");
const itemRoute = require("./src/routes/item");
const customerRoute = require("./src/routes/customer");
const galleryRoute = require("./src/routes/gallery");
const bodyParser = require("body-parser");

const app = express();
dotenv.config();
const PORT = process.env.PORT || 4000;

mongoose.set("strictQuery", false);
mongoose
   .connect(process.env.MONGO_URL)
   .then(() => console.log("db connected"))
   .catch((err) => console.log(err));

app.use(bodyParser.json());

app.use((req, res, next) => {
   res.setHeader(
      "Access-Control-Allow-Origin",
      "*"
      // "https://horizon-mern-vercel.vercel.app/"
   );
   res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, DELETE, PUT, PATCH, OPTION"
   );
   res.setHeader("Access-Control-Allow-Methods", "Content-Type, Authorization");
   next();
});

// cors options while development
// if client on mode productions or deploy, origin set a valid url client for unblocked cores and policy
// * all data cant used method
const corsOptions = [
   "https://horizon-mern-vercel.vercel.app/",
   "https://horizon-mern-vercel-git-main-helkass.vercel.app/",
];

// handling permission and policy
// app.use(cors(corsOptions));

app.use((req, res, next) => {
   if (corsOptions.indexOf(req.headers.origin) !== -1) {
      res.header("Access-Control-Allow-Origin", req.headers.origin);
      res.header(
         "Access-Control-Allow-Headers",
         "Origin, X-Requested-With, Content-Type, Acccept"
      );
   }
   next();
});

// handling file for request
app.use(bodyParser.json());
app.use(
   bodyParser.urlencoded({
      limit: "500mb",
      extended: true,
      parameterLimit: 5000000,
   })
);

app.listen(PORT, () => {
   console.log(`backend is running on port ${PORT}`);
});

app.get("/", (req, res) => {
   res.send("server is running!");
});

//Routes go here
// app.all('*', (req,res) => {
//   res.json({"every thing":"is awesome"})
// })

app.use("/api/order", orderRoute);
app.use("/api/admin", adminRoute);
app.use("/api/blog", blogRoute);
app.use("/api/item", itemRoute);
app.use("/api/customer", customerRoute);
app.use("/api/gallery", galleryRoute);
