import React from 'react'
import { Link } from 'react-router-dom'
import './CSS/Footer.css'
import { useLanguage } from '../context/LanguageContext'

const Footer = () => {
  const { t } = useLanguage()
  return (
    <div className='outerFooter'>
        <div className='Footer'>
            <div className='FooterContent'>
                <div className='FooterSection'>
                    <h3>{t('footer_about')}</h3>
                    <ul>
                        <li><Link to="/about">{t('footer_story')}</Link></li>
                        <li><Link to="/careers">{t('footer_careers')}</Link></li>
                        <li><Link to="/press">{t('footer_press')}</Link></li>
                        <li><Link to="/blog">{t('footer_blog')}</Link></li>
                    </ul>
                </div>
                
                <div className='FooterSection'>
                    <h3>{t('footer_quick')}</h3>
                    <ul>
                        <li><Link to="/home">{t('nav_home')}</Link></li>
                        <li><Link to="/menu">{t('footer_menu')}</Link></li>
                        <li><Link to="/offers">{t('nav_login_signup')}</Link></li>
                        <li><Link to="/contact">{t('footer_contact')}</Link></li>
                    </ul>
                </div>
                
                <div className='FooterSection'>
                    <h3>{t('footer_support')}</h3>
                    <ul>
                        <li><Link to="/faq">{t('footer_faq')}</Link></li>
                        <li><Link to="/terms">{t('footer_terms')}</Link></li>
                        <li><Link to="/privacy">{t('footer_privacy')}</Link></li>
                        <li><Link to="/help">{t('footer_help')}</Link></li>
                    </ul>
                </div>
                
                <div className='FooterSection'>
                    <h3>{t('footer_follow')}</h3>
                    <div className='SocialIcons'>
                        <a href="" target="_blank" rel="noopener noreferrer">FB</a>
                        <a href="" target="_blank" rel="noopener noreferrer">TW</a>
                        <a href="" target="_blank" rel="noopener noreferrer">IG</a>
                        <a href="
                        " target="_blank" rel="noopener noreferrer">LI</a>
                    </div>
                </div>
            </div>
            
            <div className='FooterBottom'>
                <p>&copy; 2026 EchoEats. {t('footer_rights')} | Designed with ❤️ for food lovers</p>
            </div>
        </div>
    </div>
  )
}

export default Footer