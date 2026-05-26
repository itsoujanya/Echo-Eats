import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import './CSS/Navbar.css'
import { GlobalStateContext } from '../context/GlobalStateContext'
import { useContext } from 'react';
import { useLanguage } from '../context/LanguageContext';

const Navbar = () => {
  const { displayCart, isLoggedIn, user, logout } = useContext(GlobalStateContext)
  const { language, setLanguage, t } = useLanguage()
  const [showDropdown, setShowDropdown] = useState(false)
  
  const getInitials = () => {
    if (!user || !user.name) return '?'
    const names = user.name.split(' ')
    if (names.length > 1) {
      return (names[0].charAt(0) + names[1].charAt(0)).toUpperCase()
    }
    return user.name.slice(0, 2).toUpperCase()
  }

  const handleLogout = () => {
    setShowDropdown(false)
    logout()
  }

  return (
    <div className='outerNavbar'>
        <div className='Navbar'>
            <div className='LogoImage'>
                <img src="ECHOEATS.png" alt="" />
            </div>
            <div className='NavButtons'>
                <Link to="/"><button className='navbut'>{t('nav_home')}</button></Link>
                <Link to="/about"><button className='navbut'>{t('nav_about')}</button></Link>
                {isLoggedIn && (
                  <Link to="/orders"><button className='navbut'>{t('nav_orders')}</button></Link>
                )}
                {displayCart && (
                  <Link to="/cart"><button className='navbut'>{t('nav_cart')}</button></Link>
                )}
                <select
                  className="navbut"
                  value={language}
                  aria-label={t('nav_lang')}
                  onChange={(e) => setLanguage(e.target.value)}
                >
                  <option value="en">EN</option>
                  <option value="hi">HI</option>
                </select>
                
                {isLoggedIn ? (
                  <div className="user-profile">
                    <div 
                      className="profile-circle" 
                      onClick={() => setShowDropdown(!showDropdown)}
                    >
                      {getInitials()}
                    </div>
                    
                    {showDropdown && (
                      <div className="profile-dropdown">
                        <Link to="/profile" onClick={() => setShowDropdown(false)}>
                          <div className="dropdown-item">
                            <span className="dropdown-icon">👤</span>
                            {t('nav_profile')}
                          </div>
                        </Link>
                        <Link to="/orders" onClick={() => setShowDropdown(false)}>
                          <div className="dropdown-item">
                            <span className="dropdown-icon">📦</span>
                            {t('nav_my_orders')}
                          </div>
                        </Link>
                        <div className="dropdown-divider"></div>
                        <div className="dropdown-item logout" onClick={handleLogout}>
                          <span className="dropdown-icon">🚪</span>
                          {t('nav_logout')}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link to="/login"><button className='navbutloin'>{t('nav_login_signup')}</button></Link>
                )}
            </div>
        </div>
    </div>
  )
}

export default Navbar