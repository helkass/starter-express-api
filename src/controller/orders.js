const Order = require("../models/order");
const Customer = require("../models/customer");
const coreApi = require("../config/midtrans");
const nodemailer = require("nodemailer");
const Mailgen = require("mailgen");

// GET ALL ORDERS
const getOrders = async (req, res) => {
   try {
      const response = await Order.find().sort({ createdAt: -1 });

      // FORMAT RESPONSE_MIDTRANS FROM JSON TO STRING
      const newData = response.map((item) => {
         return {
            _id: item._id,
            customerId: item.customerId,
            customer_name: item?.customer_name,
            products: item.products,
            response_midtrans: JSON.parse(item.response_midtrans),
            status: item.status,
            review: item.review,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt,
         };
      });
      res.status(200).json(newData);
   } catch (error) {
      res.status(500);
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
            customer_name: item?.customer_name,
            products: item.products,
            response_midtrans: JSON.parse(item.response_midtrans),
            status: item.status,
            review: item.review,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt,
         };
      });
      res.json(newData);
   } catch (error) {
      res.status(500);
   }
};
// CREATE ORDER AND SEND DATA TO MIDTRANS SERVER
const createOrder = async (req, res) => {
   const formData = req.body;

   let customer = await Customer.findById(formData.customerId);

   coreApi
      .charge(formData)
      .then((chargeResponse) => {
         const dataOrder = {
            _id: chargeResponse.order_id,
            customerId: formData.customerId,
            customer_name: formData?.customer_name,
            review: formData?.review,
            products: formData.products,
            response_midtrans: JSON.stringify(chargeResponse),
         };

         Order.create(dataOrder).then((data) => {
            const midtrans = JSON.parse(data.response_midtrans);
            let formatMessageMail = {
               products: formData.products,
               customer_name: formData.customer_name,
               customer_email: customer.email,
               gross_amount: midtrans?.gross_amount,
               order_id: midtrans?.order_id,
               payment_type: formData.payment_type.toString().replace("_", " "),
            };

            // send message to customer email
            createEmailNotification(formatMessageMail);

            res.status(201).json({ message: "Order has been created" });
         });
      })
      .catch((err) => {
         res.status(400);
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

// update process status for admin while product on process delivery
const updateStatusProccessOrder = async (req, res) => {
   const { id } = req.params;

   Order.findByIdAndUpdate(id, { status: "accepted" })
      .then((res) => res.send(res))
      .catch((err) => res.send(err));
};

// update review order => true || after review update this
const updateStatusReviewOrder = async (id) => {
   await Order.findByIdAndUpdate(id, { review: true });
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
            { response_midtrans: responseMidtrans },
            function (err, data) {
               if (err) {
                  res.json({ message: "Something went wrong!" });
               } else {
                  let setData = {
                     _id: data._id,
                     customerId: data.customerId,
                     products: data.products,
                     customer_name: data?.customer_name,
                     response_midtrans: JSON.parse(data.response_midtrans),
                     status: data.status,
                     review: data.review,
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

// SEND EMAIL MESSAGE AFTER CHARGE
const createEmailNotification = async ({ ...params }) => {
   const {
      products,
      customer_email,
      gross_amount,
      order_id,
      payment_type,
      customer_name,
   } = params;
   let config = {
      service: "gmail",
      auth: {
         user: process.env.EMAIL,
         pass: process.env.PASSEMAIL,
      },
   };

   let transporter = new nodemailer.createTransport(config);

   let MailGenerator = new Mailgen({
      theme: "default",
      product: {
         name: "Horizon Coffee",
         link: "https://mailgen.js/",
      },
   });

   let response = {
      body: {
         name: customer_name,
         intro: [
            "Selamat order kamu telah berhasil dibuat.",
            `Order Id : ${order_id}`,
         ],
         table: {
            data: products.map((product) => ({
               item: product?.product_name,
               quantity: product?.quantity,
            })),
            columns: {
               customAlignment: {
                  quantity: "center",
               },
            },
         },
         outro: [
            `Metode pembayaran : ${payment_type}`,
            `Total pembayaran : Rp.${gross_amount}`,
         ],
      },
   };

   let mail = MailGenerator.generate(response);

   let message = {
      from: process.env.EMAIL,
      to: customer_email,
      subject: "Detail Order",
      html: mail,
   };

   transporter.sendMail(message);
};

module.exports = {
   getOrders,
   createOrder,
   notificationMidtrans,
   orderStatus,
   deleteOrder,
   getOrderByCustomer,
   updateStatusProccessOrder,
   updateStatusReviewOrder,
};
