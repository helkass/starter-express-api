const router = require("express").Router();
const { verifyTokenAndAuthorization } = require("../middleware/verifyToken");
const {
   getOrders,
   createOrder,
   notificationMidtrans,
   orderStatus,
   deleteOrder,
   getOrderByCustomer,
   updateStatusProccessOrder,
} = require("../controller/orders");

//GET ALL ORDER
router.get("/", verifyTokenAndAuthorization, getOrders);

// OR GET ORDER BY CUSTOMER ID
router.get(
   "/findbycustomer/:id",
   verifyTokenAndAuthorization,
   getOrderByCustomer
);

// CREATE ORDER BY ID CUSTOMER
router.post("/charge", verifyTokenAndAuthorization, createOrder);

// if system on production
router.post("/notification", notificationMidtrans);

// GET STATUS TRANSACTION BY ORDER
//  UPDATE ONLY RESPONSE_MIDTRANS
router.get("/status/:order_id", verifyTokenAndAuthorization, orderStatus);

router.put(
   "/status/process/:id",
   verifyTokenAndAuthorization,
   updateStatusProccessOrder
);

router.delete("/delete/:id", verifyTokenAndAuthorization, deleteOrder);

module.exports = router;
