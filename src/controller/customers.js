const Customer = require("../models/customer");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
// GET ALL CUSTOMERS

const getAllCustomers = (req, res) => {
    try {
        Customer.find().then(data => {
            res.send(data)
        }).catch(err => {
            res.send(err)
        })
    } catch (error) {
        res.send(error);
    }
}

// GET CUSTOMER BY ID
const getCustomer = async (req, res) => {
    const id = req.params.id;
    
    try {
        Customer.findById(id)
            .then(response => res.send(response))
            .catch(err => console.log(err))
    } catch (error) {
        res.status(500).json(error);
    }
}

// REGISTER
const createCustomer = async (req, res) => {

    if(!req.body) return res.send({message : "please enter the data completely"})

    const validate = await Customer.findOne({email: req.body.email});

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
    })
    // check alredy email
    if(validate) return res.status(400).json({
        status: false,
        message: "email already exist!"
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

        const {password, ...others} = saved._doc;
        res.send({...others, accessToken});
    } catch (error) {
        res.status(500).json({
            status: false,
            message: error.mesage
        })
    }
}

// LOGIN
const loginCustomer = async (req, res) => {
    try {
        const customer = await Customer.findOne({ email: req.body.email });
        !customer && res.status(401).json({error : "wrong email"})
        // hashing
        const hashedPassword = CryptoJS.AES.decrypt(
          customer.password,
          process.env.SECRET
        );
    
        const originalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);
      
        // compare password
        originalPassword != req.body.password && res.status(401).json({error: "Wrong Password"});
  
        const accessToken = jwt.sign(
          {
            email: customer.email,
            password: customer.password,
          },
          process.env.SECRET,
          { expiresIn: "1d" }
        );
    
        const { password, ...others } = customer._doc
        res.send({ ...others, accessToken, status: true });
      } catch (error) {
        res.status(500).json(error);
      }
}

const deleteCustomer = async (req, res) => {
    const id = req.params.id;

    try {
        const response = await Customer.findByIdAndDelete(id);
        res.send(response);
    } catch (error) {
        res.status(500).json(error)
    }
}

module.exports = {
    getAllCustomers,
    getCustomer,
    createCustomer,
    loginCustomer,
    deleteCustomer
}