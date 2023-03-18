const router = require("express").Router();
const { verifyTokenAndAuthorization } = require("../middleware/verifyToken");
const {
   getAllCustomers,
   createCustomer,
   loginCustomer,
   deleteCustomer,
   getCustomer,
   updateCustomer,
} = require("../controller/customers");

router.get("/", verifyTokenAndAuthorization, getAllCustomers);

router.post("/register", createCustomer);

router.patch("/update/:id", verifyTokenAndAuthorization, updateCustomer);

router.get("/:id", verifyTokenAndAuthorization, getCustomer);

router.post("/login", loginCustomer);

router.delete("/delete/:id", verifyTokenAndAuthorization, deleteCustomer);

module.exports = router;
