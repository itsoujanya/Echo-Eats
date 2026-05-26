import React, { useEffect, useState, useContext, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import './CSS/Cart.css'
import { GlobalStateContext } from '../context/GlobalStateContext'
import { useLanguage } from '../context/LanguageContext'

const CartPage = () => {
    const { Quantity, setQuantity, isLoggedIn, user, foodData, updateQuantity, fetchFoodData } = useContext(GlobalStateContext)
    const { t } = useLanguage()
    const [cartItems, setCartItems] = useState([])
    const [total, setTotal] = useState(0)
    const [loading, setLoading] = useState(false)
    const [showPaymentModal, setShowPaymentModal] = useState(false)
    const [showOrderPopup, setShowOrderPopup] = useState(false)
    const [orderMessage, setOrderMessage] = useState('')
    const navigate = useNavigate()

    useEffect(() => {
        const itemsInCart = foodData.filter(item => item.Quantity > 0)
        setCartItems(itemsInCart)
        
        const totalPrice = itemsInCart.reduce((sum, item) => 
            sum + (parseFloat(item.Price) * item.Quantity), 0
        )
        setTotal(totalPrice)
    }, [foodData]) 

    useEffect(() => {
        if (window.location.hash === '#payment-modal' && isLoggedIn) {
            setShowPaymentModal(true)
        }
    }, [isLoggedIn])

    const handleIncreaseQuantity = async (item) => {
        await updateQuantity(item.FoodID, 1)
    }

    const handleDecreaseQuantity = async (item) => {
        if (item.Quantity > 1) {
            await updateQuantity(item.FoodID, -1)
        } else {
            await handleRemoveItem(item)
        }
    }

    const handleRemoveItem = async (item) => {
        const currentQuantity = item.Quantity
        await updateQuantity(item.FoodID, -currentQuantity)
    }

    const handleCheckout = () => {
        if (!isLoggedIn) {
            navigate('/login', { state: { from: { pathname: '/cart' } } })
            return
        }
        setShowPaymentModal(true)
        window.location.hash = 'payment-modal'
    }

    const handleCOD = async () => {
        setShowPaymentModal(false)
        window.location.hash = ''
        setLoading(true)

        try {
            console.log("[COD] Creating order for amount: ₹" + total)
            
            const orderResponse = await fetch("http://localhost:8000/create-order/", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: user.user_id,
                    amount: total,
                    items: cartItems,
                    paymentMethod: 'COD'
                })
            })

            const orderData = await orderResponse.json()

            if (!orderResponse.ok || !orderData.success) {
                console.error("[COD] Order creation failed:", orderData)
                throw new Error(orderData.error || "Failed to place order")
            }

            console.log("[COD] Order placed successfully. Order ID:", orderData.orderId)
            setOrderMessage('Order placed successfully! Your food will be delivered soon.')
            setShowOrderPopup(true)

            for (const item of cartItems) {
                await updateQuantity(item.FoodID, -item.Quantity)
            }

            setTimeout(() => {
                setOrderMessage('Your order has been delivered! Enjoy your meal! 🍕')
                setShowOrderPopup(true)
                
                setTimeout(() => {
                    setShowOrderPopup(false)
                }, 3000)
            }, 35000)

            setTimeout(() => {
                setShowOrderPopup(false)
            }, 3000)

            navigate('/orders')
        } catch (error) {
            console.error("[COD] Order error:", error.message)
            alert("Failed to place order: " + error.message)
            setLoading(false)
            setShowPaymentModal(true)
            window.location.hash = 'payment-modal'
        }
    }

    const handleUPI = async () => {
    setShowPaymentModal(false)
    window.location.hash = ''
    setLoading(true)

    try {
        const RAZORPAY_KEY = import.meta.env.VITE_RAZORPAY_KEY_ID

        if (!RAZORPAY_KEY) {
            console.error("[Payment] Razorpay key not configured in environment")
            throw new Error("Payment service not properly configured. Please contact support.")
        }

        console.log("[Payment] Creating order for amount: ₹" + total)
        
        const orderResponse = await fetch("http://localhost:8000/create-order/", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId: user.user_id,
                amount: total,
                items: cartItems,
                paymentMethod: 'UPI'
            })
        })

        if (!orderResponse.ok) {
            const errorData = await orderResponse.json()
            console.error("[Payment] Order creation HTTP error:", orderResponse.status, errorData)
            throw new Error(errorData.error || `HTTP ${orderResponse.status}: Order creation failed`)
        }

        const orderData = await orderResponse.json()
        
        if (!orderData.success) {
            console.error("[Payment] Order creation failed:", orderData)
            throw new Error(orderData.error || "Failed to create order. Please try again.")
        }

        // Check if payment method was switched to COD by backend
        const actualPaymentMethod = orderData.paymentMethod || 'UPI'
        console.log("[Payment] Actual payment method:", actualPaymentMethod)
        
        if (actualPaymentMethod === 'COD') {
            console.log("[Payment] Backend switched to COD. Processing COD payment.")
            setOrderMessage('Order placed successfully with Cash on Delivery!')
            setShowOrderPopup(true)

            for (const item of cartItems) {
                await updateQuantity(item.FoodID, -item.Quantity)
            }

            setTimeout(() => {
                setOrderMessage('Your order has been delivered! Enjoy your meal! 🍕')
                setShowOrderPopup(true)
                setTimeout(() => {
                    setShowOrderPopup(false)
                }, 3000)
            }, 35000)

            setTimeout(() => {
                setShowOrderPopup(false)
            }, 3000)

            navigate('/orders')
            setLoading(false)
            return
        }

        console.log("[Payment] Creating order for amount: ₹" + total)

        if (!window.Razorpay) {
            console.log("[Payment] Loading Razorpay SDK...")
            await new Promise((resolve, reject) => {
                const script = document.createElement('script')
                script.src = 'https://checkout.razorpay.com/v1/checkout.js'
                script.onload = () => {
                    console.log("[Payment] Razorpay SDK loaded")
                    resolve()
                }
                script.onerror = () => {
                    console.error("[Payment] Failed to load Razorpay SDK")
                    reject(new Error("Failed to load payment gateway"))
                }
                document.body.appendChild(script)
            })
        }

        const options = {
            key: RAZORPAY_KEY,
            amount: total * 100,
            currency: 'INR',
            name: 'EchoEats',
            description: 'Food Order Payment',
            order_id: orderData.razorpayOrderId,
            handler: async (response) => {
                try {
                    console.log("[Payment] Payment successful. Verifying transaction...")
                    
                    const verifyResponse = await fetch("http://localhost:8000/verify-payment/", {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_signature: response.razorpay_signature,
                            orderId: orderData.orderId
                        })
                    })

                    if (!verifyResponse.ok) {
                        const errorData = await verifyResponse.json()
                        console.error("[Payment] Verification HTTP error:", verifyResponse.status, errorData)
                        throw new Error(errorData.error || `HTTP ${verifyResponse.status}`)
                    }

                    const verifyData = await verifyResponse.json()

                    if (verifyData.success) {
                        console.log("[Payment] Verification successful. Payment ID:", response.razorpay_payment_id)
                        setOrderMessage('Payment successful! Order placed successfully!')
                        setShowOrderPopup(true)

                        // Clear cart
                        for (const item of cartItems) {
                            await updateQuantity(item.FoodID, -item.Quantity)
                        }

     
                        setTimeout(() => {
                            setOrderMessage('Your order has been delivered! Enjoy your meal! 🍕')
                            setShowOrderPopup(true)
                            setTimeout(() => {
                                setShowOrderPopup(false)
                            }, 3000)
                        }, 35000)

                    
                        setTimeout(() => {
                            setShowOrderPopup(false)
                        }, 3000)

                        navigate('/orders')
                    } else {
                        console.error("[Payment] Verification failed:", verifyData)
                        throw new Error(verifyData.error || "Payment verification failed. Please contact support.")
                    }
                } catch (error) {
                    console.error("[Payment] Verification error:", error.message)
                    alert("Payment verification failed: " + error.message)
                    setLoading(false)
                    setShowPaymentModal(true)
                    window.location.hash = 'payment-modal'
                }
            },
            prefill: {
                name: user.name,
                email: user.email
            },
            theme: {
                color: '#00d4ff'
            },
            modal: {
                ondismiss: () => {
                    console.log("[Payment] User closed payment modal")
                    setLoading(false)
                    setShowPaymentModal(true)
                    window.location.hash = 'payment-modal'
                }
            }
        }

        console.log("[Payment] Opening Razorpay checkout...")
        const razorpay = new window.Razorpay(options)
        razorpay.on('payment.failed', (response) => {
            console.error("[Payment] Payment failed:", response.error)
            setLoading(false)
            setShowPaymentModal(true)
            window.location.hash = 'payment-modal'
            alert(`Payment failed: ${response.error.description}\n\nError Code: ${response.error.code}`)
        })
        razorpay.open()
        
    } catch (error) {
        console.error("[Payment] Error:", error.message)
        alert("Payment error: " + error.message)
        setLoading(false)
        setShowPaymentModal(true)
        window.location.hash = 'payment-modal'
    }
}

    return (
        <div className="cart-container">
            {showOrderPopup && (
                <div className="order-popup">
                    <p>{orderMessage}</p>
                </div>
            )}

            {showPaymentModal && (
                <div className="payment-modal" id='payment-modal'>
                    <div className="payment-modal-content">
                        <h3>{t('cart_payment_title')}</h3>
                        <button 
                            className="payment-option cod" 
                            onClick={handleCOD}
                            disabled={loading}
                        >
                            💵 {t('cart_payment_cod')}
                        </button>
                        <button 
                            className="payment-option upi" 
                            onClick={handleUPI}
                            disabled={loading}
                        >
                            📱 {t('cart_payment_upi')}
                        </button>
                        <button 
                            className="payment-option cancel" 
                            onClick={() => {
                                setShowPaymentModal(false)
                                window.location.hash = ''
                            }}
                        >
                            {t('common_cancel')}
                        </button>
                    </div>
                </div>
            )}

            <h1>{t('cart_title')}</h1>
            {cartItems.length === 0 ? (
                <div className="empty-cart">
                    <h2>{t('cart_empty_title')}</h2>
                    <p>{t('cart_empty_desc')}</p>
                    <button onClick={() => navigate('/')}>{t('cart_browse')}</button>
                </div>
            ) : (
                <>
                    <div className="cart-items">
                        {cartItems.map((item) => (
                            <div key={item.FoodID} className="cart-item">
                                <img src={item.ImageName} alt={item.FoodName} />
                                <div className="cart-item-details">
                                    <h3>{item.FoodName}</h3>
                                    <p>₹{parseFloat(item.Price).toFixed(2)}</p>
                                </div>
                                <div className="cart-item-quantity">
                                    <button onClick={() => handleDecreaseQuantity(item)}>-</button>
                                    <span>{item.Quantity}</span>
                                    <button onClick={() => handleIncreaseQuantity(item)}>+</button>
                                </div>
                                <div className="cart-item-total">
                                    ₹{(parseFloat(item.Price) * item.Quantity).toFixed(2)}
                                </div>
                                <button className="remove-btn" onClick={() => handleRemoveItem(item)}>
                                    {t('cart_remove')}
                                </button>
                            </div>
                        ))}
                    </div>
                    <div className="cart-total">
                        <h3>{t('cart_total')} ₹{total.toFixed(2)}</h3>
                        <button 
                            className="checkout-btn" 
                            onClick={handleCheckout}
                            disabled={loading}
                        >
                            {loading ? t('cart_processing') : t('cart_checkout')}
                        </button>
                    </div>
                </>
            )}
        </div>
    )
}

export default CartPage