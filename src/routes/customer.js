const router = require("express").Router();
const { verifyToken } = require("../middleware/verifyToken");
const {
   getAllCustomers,
   createCustomer,
   loginCustomer,
   deleteCustomer,
   getCustomer,
   updateCustomer,
} = require("../controller/customers");

router.get("/", getAllCustomers);

router.post("/register", createCustomer);

router.patch("/update/:id", updateCustomer);

router.get("/:id", getCustomer);

router.post("/login", loginCustomer);

router.delete("/delete/:id", deleteCustomer);

module.exports = router;
