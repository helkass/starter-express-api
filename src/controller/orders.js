const Order = require("../models/order");
const coreApi = require("../config/midtrans");

// GET ALL ORDERS
const getOrders = async (req, res) => {
   try {
      const response = await Order.find();

      // FORMAT RESPONSE_MIDTRANS FROM JSON TO STRING
      const newData = response.map((item) => {
         return {
            _id: item._id,
            customerId: item.customerId,
            products: item.products,
            response_midtrans: JSON.parse(item.response_midtrans),
            status: item.status,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt,
         };
      });
      res.json(newData);
   } catch (error) {
      res.status(500).json({ message: "Something went wrong!" });
   }
};

// GET ORDER BY CUSTOMER ID
const getOrderByCustomer = async (req, res) => {
   const { id } = req.params;
   try {
      const response = await Order.find({ customerId: id }).sort({
         createdAt: -1,
      });

      // FORMAT RESPONSE_MIDTRANS FROM JSON TO STRING
      const newData = response.map((item) => {
         return {
            _id: item._id,
            customerId: item.customerId,
            products: item.products,
            response_midtrans: JSON.parse(item.response_midtrans),
            status: item.status,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt,
         };
      });
      res.json(newData);
   } catch (error) {
      res.status(500).json({ message: "Something went wrong!" });
   }
};
// CREATE ORDER AND SEND DATA TO MIDTRANS SERVER
const createOrder = async (req, res) => {
   const formData = req.body;

   coreApi
      .charge(formData)
      .then((chargeResponse) => {
         const dataOrder = {
            _id: chargeResponse.order_id,
            customerId: formData.customerId,
            products: formData.products,
            response_midtrans: JSON.stringify(chargeResponse),
         };

         Order.create(dataOrder)
            .then((data) => {
               res.status(201).json(data);
            })
            .catch((err) => {
               res.status(400), jaon({ message: "Something went wrong!" });
            });
      })
      .catch((err) => {
         res.status(400).json({ message: "failed order products" });
      });
};

// MIDTRANS WILL SEND NOTIFICATION AND UPDATE RESPONSE_MIDTRANS WHEN CUSTOMER AFTER CUSTOMER PAYING ORDER
const notificationMidtrans = async (req, res) => {
   coreApi.transaction
      .notification(req.body)
      .then((statusResponse) => {
         let order_id = statusResponse.order_id;
         let responseMidtrans = JSON.stringify(statusResponse);

         Order.findByIdAndUpdate({
            _id: order_id,
            response_midtrans: responseMidtrans,
         })
            .then(() => {
               res.status(201).json({
                  message: "success update status transaction",
               });
            })
            .catch((err) => {
               res.status(400).json({ messgae: "Something went wrong!" });
            });
      })
      .catch((error) => {
         res.json({ message: "Somrthing went wrong!" });
      });
};

// CHECK ORDER STATUS FOR DEVELOPMENT PROJECT
// UPADTE STATUS AND RESPONSE MIDTRANS WHILE RESPONSE MIDTRANS CHANGE

const orderStatus = async (req, res) => {
   const { order_id } = req.params;
   coreApi.transaction
      .status(order_id)
      .then((statusResponse) => {
         let responseMidtrans = JSON.stringify(statusResponse);

         Order.findByIdAndUpdate(
            order_id,
            // { status: "accepted" },
            { response_midtrans: responseMidtrans },
            function (err, data) {
               if (err) {
                  res.json({ message: "Something went wrong!" });
               } else {
                  let setData = {
                     _id: data._id,
                     customerId: data.customerId,
                     products: data.products,
                     response_midtrans: JSON.parse(data.response_midtrans),
                     status: data.status,
                     createdAt: data.createdAt,
                     updatedAt: data.updatedAt,
                  };
                  res.json(setData);
               }
            }
         );
      })
      .catch((err) => {
         res.send({ message: "Something went wrong!" });
      });
};
const deleteOrder = async (req, res) => {
   const { id } = req.params;

   try {
      await Order.findByIdAndDelete(id);
      res.json({ messgae: "Delete successfully!" });
   } catch (error) {
      res.status(500).json({ message: "Something went wrong!" });
   }
};

module.exports = {
   getOrders,
   createOrder,
   notificationMidtrans,
   orderStatus,
   deleteOrder,
   getOrderByCustomer,
};
