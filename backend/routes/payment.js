import express from 'express';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import 'dotenv/config';
import payment from '../Models/payment.js';

const router = express.Router();

const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_SECRET,
});

// ROUTE 1: Create Order API
router.post('/order', (req, res) => {
    const { amount } = req.body;

    try {
        const options = {
            amount: Number(amount * 100),
            currency: "INR",
            receipt: crypto.randomBytes(10).toString("hex"),
        };
        
        razorpayInstance.orders.create(options, (error, order) => {
            if (error) {
                console.log(error);
                return res.status(500).json({ message: "Something Went Wrong!" });
            }
            res.status(200).json({ data: order });
            console.log(order);
        });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error!" });
        console.log(error);
    }
});

// ROUTE 2: Verify Payment API
router.post('/verify', async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    try {
        // Generate Signature
        const sign = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSign = crypto.createHmac("sha256", process.env.RAZORPAY_SECRET)
            .update(sign.toString())
            .digest("hex");

        const isAuthentic = expectedSign === razorpay_signature;

        if (isAuthentic) {
            const newPayment = new payment({  // Renamed variable
                razorpay_order_id,
                razorpay_payment_id,
                razorpay_signature
            });

            await newPayment.save();

            res.json({ message: "Payment Successfully" });
        } else {
            res.status(400).json({ message: "Payment Verification Failed" });
        }
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error!" });
        console.log(error);
    }
});

export default router;
