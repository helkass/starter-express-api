const router = require("express").Router();
const Order = require("../models/order");
const coreApi = require("../config/midtrans");

//GET ALL ORDER
router.get('/', async (req,res)=> {
    try {
        const data = await Order.find({});

        const newData = data.map(item=> {
            return {
                _id: item._id,
                customerId: item.customerId,
                products: item.products,
                response_midtrans: JSON.parse(item.response_midtrans),
                status: item.status,
                createdAt: item.createdAt,
                updatedAt: item.updatedAt,
            }
        })
        res.status(200).json(newData)
    } catch (error) {
        res.status(404).json({message: "data not found!"})
    }
})

// CREATE ORDER BY ID CUSTOMER
router.post('/charge', async (req, res)=> {
    const formData = req.body;

    coreApi.charge(formData)
        .then((chargeResponse)=>{

        const dataOrder ={
            _id: chargeResponse.order_id,
            customerId: formData.customerId,
            products: formData.products,
            response_midtrans: JSON.stringify(chargeResponse)
        }

        Order.create(dataOrder).then(data => {
            res.status(200).json({
                status: true,
                message: "success order",
                data: data
            })
        }).catch(err => {
            res.status(500).json({
                status: false,
                message: "order failure"+ err.message,
                data:[]
            })
        })
    })
    .catch((e)=>{
        res.status(400).json({message: "failed order products"})
    })
})

// if system on production
router.post('/notification', (req, res) => {
    coreApi.transaction.notification(req.body)
    .then(statusResponse => {
        let order_id = statusResponse.order_id;
        let responseMidtrans = JSON.stringify(statusResponse);

        Order.findByIdAndUpdate({_id:order_id, response_midtrans: responseMidtrans})
            .then(()=> {
                res.status(201).json({
                    status: true,
                    message: "success update status transaction",
                    data: []
                })
            }).catch(err => {
                res.status(400).json({
                    status: false,
                    message: "update failure",
                    data: []
                })
            })
    })
})

//GET ORDER BY CUSTOMER_ID
router.get('/:customerId', (req, res, next) => {
    let id = req.params.customerId;

    try {
        const query = Order.find({customerId: id})
        query.exec(function(err, data) {
            if(err) return next(err);
            

            // SET FORMAT STRING TO JSON RESPONSE MIDTRANS
                const newOrders = data.map(item => {
                    return {
                    _id: item._id,
                    customerId: item.customerId,
                    products: item.products,
                    response_midtrans: JSON.parse(item.response_midtrans),
                    status : item.status,
                    createdAt: item.createdAt,
                    updatedAt: item.updatedAt,
                }});

            res.status(200).json(newOrders);
        })
    } catch (error) {
        res.status(404).json({message: "order not found!"})
    }
})

// GET STATUS TRANSACTION BY ORDER 
//  UPDATE ONLY RESPONSE_MIDTRANS
router.get('/status/:order_id', (req, res) => {
    coreApi.transaction.status(req.params.order_id)
        .then(statusResponse => {
            let responseMidtrans = JSON.stringify(statusResponse);

            Order.findByIdAndUpdate(req.params.order_id,{response_midtrans: responseMidtrans}, function (err, data){
                if(err){
                    res.status(400).json({error: "update failed"+ err.message})
                }else{
                    let setData = {
                        _id : data._id,
                        customerId : data.customerId,
                        products : data.products,
                        response_midtrans : JSON.parse(data.response_midtrans),
                        status: data.status,
                        createdAt : data.createdAt,
                        updatedAt : data.updatedAt
                    }
                    res.status(200).json(setData);
                }
            })

        }).catch(err => {
            res.status(500).json({
                status: false,
                message: "check status falied"+ err.message,
                data: []
            })
        })
})

// update status order by order id 
router.get('/acceptOrder/:order_id', async (req, res) => {
    Order.findByIdAndUpdate(req.params.order_id, {status : "accepted"}, function(err, data){
                if(err){
                    res.status(404).json(err)
                }else{
                    let setData = {
                        _id : data._id,
                        customerId : data.customerId,
                        products : data.products,
                        response_midtrans : JSON.parse(data.response_midtrans),
                        status: data.status,
                        createdAt : data.createdAt,
                        updatedAt : data.updatedAt
                    }
                    res.status(200).json(setData);
                }
            })
})

router.delete('/delete/:order_id', async (req, res) => {
    const id = req.params.order_id;

    try {
        const response = await Order.findByIdAndDelete(id);
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json(error);
    }
})

module.exports = router;