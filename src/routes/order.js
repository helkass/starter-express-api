const router = require("express").Router();
const { verifyToken } = require("../middleware/verifyToken");
const {
   getOrders,
   createOrder,
   notificationMidtrans,
   orderStatus,
   deleteOrder,
   getOrderByCustomer,
} = require("../controller/orders");

//GET ALL ORDER
router.get("/", getOrders);

// OR GET ORDER BY CUSTOMER ID
router.get("/findbycustomer/:id", getOrderByCustomer);

// CREATE ORDER BY ID CUSTOMER
router.post("/charge", createOrder);

// if system on production
router.post("/notification", notificationMidtrans);

// GET STATUS TRANSACTION BY ORDER
//  UPDATE ONLY RESPONSE_MIDTRANS
router.get("/status/:order_id", orderStatus);

router.delete("/delete/:id", deleteOrder);

module.exports = router;
