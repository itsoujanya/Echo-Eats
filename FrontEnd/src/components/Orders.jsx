import React, { useEffect, useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import './CSS/Orders.css'
import { GlobalStateContext } from '../context/GlobalStateContext'
import { useLanguage } from '../context/LanguageContext'
const OrdersPage = () => {
    const { isLoggedIn, user } = useContext(GlobalStateContext)
    const { t } = useLanguage()
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    useEffect(() => {
        if (!isLoggedIn) {
            navigate('/login', { state: { from: { pathname: '/orders' } } })
            return
        }

        fetchOrders()
        const intervalId = setInterval(fetchOrders, 5000)
        return () => clearInterval(intervalId)
    }, [isLoggedIn])

    const fetchOrders = async () => {
        try {
            const response = await fetch(`http://localhost:8000/orders/${user.user_id}/`)
            const data = await response.json()
            
            // Ensure data is an array
            if (Array.isArray(data)) {
                setOrders(data)
            } else if (data && data.success === false) {
                console.error("Error from server:", data.error)
                setOrders([])
            } else {
                console.error("Unexpected response format:", data)
                setOrders([])
            }
            
            setLoading(false)
        } catch (error) {
            console.error("Error fetching orders:", error)
            setOrders([])
            setLoading(false)
        }
    }

    const getStatusClass = (status) => {
        switch(status) {
            case 'placed': return 'status-placed'
            case 'confirmed': return 'status-confirmed'
            case 'preparing': return 'status-preparing'
            case 'out-for-delivery': return 'status-out-for-delivery'
            case 'delivered': return 'status-delivered'
            default: return ''
        }
    }

    const getStatusIcon = (status) => {
        switch(status) {
            case 'placed': return '📝'
            case 'confirmed': return '✅'
            case 'preparing': return '👨‍🍳'
            case 'out-for-delivery': return '🛵'
            case 'delivered': return '🍽️'
            default: return '📦'
        }
    }

    if (!isLoggedIn) {
        return null
    }

    return (
        <div className="orders-container">
            <h1>{t('orders_title')}</h1>
            
            {loading ? (
                <div className="orders-loading">{t('orders_loading')}</div>
            ) : !Array.isArray(orders) || orders.length === 0 ? (
                <div className="no-orders">
                    <h2>{t('orders_none_title')}</h2>
                    <p>{t('orders_none_desc')}</p>
                    <button onClick={() => navigate('/#items')}>{t('orders_browse')}</button>
                </div>
            ) : (
                <div className="orders-list">
                    {orders.map((order) => (
                        <div key={order.order_id} className="order-card">
                            <div className="order-header">
                                <div className="order-id">
                                    Order #{order.order_id}
                                </div>
                                <div className="order-date">
                                    {new Date(order.order_date).toLocaleDateString('en-IN', {
                                        day: 'numeric',
                                        month: 'short',
                                        year: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </div>
                            </div>

                            <div className="order-items">
                                {order.items && order.items.map((item, index) => (
                                    <div key={index} className="order-item">
                                        <span className="item-name">{item.name}</span>
                                        <span className="item-quantity">x{item.quantity}</span>
                                        <span className="item-price">₹{item.price}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="order-footer">
                                <div className="order-total">
                                    {t('orders_total')} <span>₹{order.total_amount}</span>
                                </div>
                                <div className="order-payment">
                                    {t('orders_payment')} {order.payment_method === 'COD' ? t('cart_payment_cod') : 'Online'}
                                </div>
                                <div className={`order-status ${getStatusClass(order.order_status)}`}>
                                    {getStatusIcon(order.order_status)} {order.order_status?.replace(/-/g, ' ') || 'Pending'}
                                </div>
                            </div>

                            {order.order_status === 'delivered' && (
                                <div className="order-review">
                                    <button className="review-btn">Rate & Review</button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default OrdersPage