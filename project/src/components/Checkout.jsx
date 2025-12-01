import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Checkout({ cartTotal = 999 }) {
    const navigate = useNavigate();
    const [address, setAddress] = useState({
        name: "",
        mobile: "",
        pincode: "",
        city: "",
        state: "",
        address: "",
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setAddress({ ...address, [e.target.name]: e.target.value });
    };

    const payNow = async () => {
        if (!address.name || !address.mobile || !address.address) {
            return alert("Please fill all required address fields");
        }


        setLoading(true);

        try {
            // 1) Create Razorpay Order from backend
            const res = await fetch("http://localhost:5000/api/payment/create-order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ amount: cartTotal }),
            });

            const data = await res.json();

            if (!data.success) {
                setLoading(false);
                return alert("Failed to create order");
            }

            const options = {
                key: data.key,
                amount: data.order.amount,
                currency: "INR",
                name: "E-Shop",
                description: "Order Payment",
                order_id: data.order.id,
                handler: async function (response) {
                    // 2) Verify payment on backend
                    const verify = await fetch("http://localhost:5000/api/payment/verify", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            address,
                        }),
                    });

                    const result = await verify.json();

                    if (result.success) {
                        // Redirect to order success page with details
                        navigate("/order-success", { state: { orderDetails: result } });
                    } else {
                        alert("Payment verification failed!");
                    }
                },
                theme: { color: "#4F46E5" },
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (err) {
            console.error(err);
            alert("Payment failed. Please try again.");
        } finally {
            setLoading(false);
        }


    };

    return (<div className="checkout-wrapper"> <h2>Checkout</h2>


        {/* ADDRESS INPUTS */}
        <div className="address-form">
            <input type="text" name="name" placeholder="Full Name" onChange={handleChange} />
            <input type="text" name="mobile" placeholder="Mobile Number" onChange={handleChange} />
            <input type="text" name="address" placeholder="Full Address" onChange={handleChange} />
            <input type="text" name="pincode" placeholder="Pincode" onChange={handleChange} />
            <input type="text" name="city" placeholder="City" onChange={handleChange} />
            <input type="text" name="state" placeholder="State" onChange={handleChange} />
        </div>

        {/* PAY NOW BUTTON */}
        <button className="pay-btn" onClick={payNow} disabled={loading}>
            {loading ? "Processing..." : `Pay Now ₹${cartTotal}`}
        </button>
    </div>


    );
}

export default Checkout;
