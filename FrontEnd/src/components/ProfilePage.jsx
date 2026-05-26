import React, { useEffect, useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import './CSS/Profile.css'
import { GlobalStateContext } from '../context/GlobalStateContext'
import { useLanguage } from '../context/LanguageContext'
const ProfilePage = () => {
    const { isLoggedIn, user, logout } = useContext(GlobalStateContext)
    const { t } = useLanguage()
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState('profile')
    const navigate = useNavigate()

    useEffect(() => {
        if (!isLoggedIn) {
            navigate('/login', { state: { from: { pathname: '/profile' } } })
            return
        }

        fetchUserOrders()
    }, [isLoggedIn])

    const fetchUserOrders = async () => {
        try {
            const response = await fetch(`http://localhost:8000/orders/${user.user_id}/`)
            const data = await response.json()
            setOrders(data)
            setLoading(false)
        } catch (error) {
            console.error("Error fetching orders:", error)
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

    if (!isLoggedIn) return null

    return (
        <div className="profile-container">
            <div className="profile-header">
                <div className="profile-avatar">
                    {user?.name?.charAt(0).toUpperCase()}
                </div>
                <div className="profile-info">
                    <h1>{user?.name}</h1>
                    <p className="profile-email">{user?.email}</p>
                </div>
            </div>

            <div className="profile-tabs">
                <button 
                    className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
                    onClick={() => setActiveTab('profile')}
                >
                    {t('profile_details')}
                </button>
                <button 
                    className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
                    onClick={() => setActiveTab('orders')}
                >
                    {t('profile_order_history')} ({orders.length})
                </button>
            </div>

            <div className="profile-content">
                {activeTab === 'profile' ? (
                    <div className="profile-details">
                        <h2>{t('profile_personal_info')}</h2>
                        <div className="info-grid">
                            <div className="info-item">
                                <label>{t('profile_full_name')}</label>
                                <p>{user?.name}</p>
                            </div>
                            <div className="info-item">
                                <label>{t('profile_email')}</label>
                                <p>{user?.email}</p>
                            </div>
                            <div className="info-item">
                                <label>{t('profile_member_since')}</label>
                                <p>{new Date().toLocaleDateString('en-IN', {
                                    month: 'long',
                                    year: 'numeric'
                                })}</p>
                            </div>
                            <div className="info-item">
                                <label>{t('profile_total_orders')}</label>
                                <p>{orders.length}</p>
                            </div>
                        </div>

                        <div className="profile-actions">
                            <button className="logout-btn" onClick={logout}>
                                Logout
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="profile-orders">
                        <h2>My Orders</h2>
                        {loading ? (
                            <div className="orders-loading">Loading orders...</div>
                        ) : orders.length === 0 ? (
                            <div className="no-orders">
                                <p>{t('profile_no_orders')}</p>
                                <button onClick={() => navigate('/')}>{t('orders_browse')}</button>
                            </div>
                        ) : (
                            <div className="orders-list">
                                {orders.map((order) => (
                                    <div key={order.order_id} className="order-card">
                                        <div className="order-header">
                                            <span className="order-id">Order #{order.order_id}</span>
                                            <span className="order-date">
                                                {new Date(order.order_date).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <div className="order-items">
                                            {order.items && order.items.map((item, idx) => (
                                                <div key={idx} className="order-item">
                                                    <span>{item.name}</span>
                                                    <span>x{item.quantity}</span>
                                                    <span>₹{item.price}</span>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="order-footer">
                                            <span className="order-total">
                                                Total: ₹{order.total_amount}
                                            </span>
                                            <span className={`order-status ${getStatusClass(order.order_status)}`}>
                                                {getStatusIcon(order.order_status)} {order.order_status}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

export default ProfilePage