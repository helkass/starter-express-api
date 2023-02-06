const Customer = require("../models/customer");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
// GET ALL CUSTOMERS

const getAllCustomers = async (req, res) => {
   try {
      const customers = await Customer.find();

      res.json(customers);
   } catch (error) {
      res.status(500).json({ message: "Something went wrong!" });
   }
};

// GET CUSTOMER BY ID
const getCustomer = async (req, res) => {
   const id = req.params.id;

   try {
      const customer = await Customer.findById(id);

      res.status(200).json(customer);
   } catch (error) {
      res.status(500).json({ message: "Something went wrong!" });
   }
};

// REGISTER
const createCustomer = async (req, res) => {
   if (!req.body)
      return res.status(400).json({ message: "Something went wrong!" });

   const validate = await Customer.findOne({ email: req.body.email });

   const newCustomer = new Customer({
      fullname: req.body.fullname,
      email: req.body.email,
      password: CryptoJS.AES.encrypt(
         req.body.password,
         process.env.SECRET
      ).toString(),
      phone: req.body.phone,
      address: req.body.address,
      city: req.body.city,
      province: req.body.province,
      profilePic: req.body.profilePic,
   });
   // check alredy email
   if (validate)
      return res.status(400).json({
         message: "email already exist!",
      });

   try {
      const saved = await newCustomer.save();

      const accessToken = jwt.sign(
         {
            email: saved.email,
            password: saved.password,
         },
         process.env.SECRET,
         { expiresIn: "1d" }
      );

      const { password, ...others } = saved._doc;
      res.status(201).json({ ...others, accessToken });
   } catch (error) {
      res.status(500).json({
         message: "Something went wrong!",
      });
   }
};

// LOGIN
const loginCustomer = async (req, res) => {
   try {
      const customer = await Customer.findOne({ email: req.body.email });
      if (!customer) {
         return res.status(404).json({
            message: "Email unauthorized!",
         });
      }
      // hashing
      const hashedPassword = CryptoJS.AES.decrypt(
         customer.password,
         process.env.SECRET
      );

      const originalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);

      // compare password
      const checkPassword = originalPassword != req.body.password;

      if (checkPassword) {
         return res.status(404).json({
            message: "Invalid password",
         });
      }

      const accessToken = jwt.sign(
         {
            email: customer.email,
            password: customer.password,
         },
         process.env.SECRET,
         { expiresIn: "3d" }
      );

      const { password, ...others } = customer._doc;
      res.status(200).json({ ...others, accessToken, status: true });
   } catch (error) {
      res.status(500).json({ message: "something went wrong!" });
   }
};

const deleteCustomer = async (req, res) => {
   const id = req.params.id;

   try {
      const response = await Customer.findByIdAndDelete(id);
      res.json({ message: "Delete successfully!" });
   } catch (error) {
      res.status(500).json({ message: "Something went wrong!" });
   }
};

module.exports = {
   getAllCustomers,
   getCustomer,
   createCustomer,
   loginCustomer,
   deleteCustomer,
};
