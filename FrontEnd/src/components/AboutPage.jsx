import React from 'react'
import './CSS/About.css'
import { useLanguage } from '../context/LanguageContext'

const AboutPage = () => {
  const { t } = useLanguage()
  return (
    <div className="about-container">
      <div className="about-header">
        <h1>{t('about_title')}</h1>
        <p>{t('about_subtitle')}</p>
      </div>

      <div className="about-content">
        <div className="highlight-section">
          <div className="highlight-badge">🚀 INNOVATION</div>
          <h2 className="highlight-title">Voice-Based Food Ordering System</h2>
          <p className="highlight-description">
            EchoEats introduces a revolutionary way to order food — just use your voice. 
            Our advanced voice recognition technology allows you to browse menus, place orders, 
            and track deliveries completely hands-free. Simply speak your cravings, and we'll take care of everything else.
          </p>
          <div className="voice-features">
            <div className="voice-feature">
              <span className="voice-icon">🎤</span>
              <span>Hands-free ordering</span>
            </div>
            <div className="voice-feature">
              <span className="voice-icon">🗣️</span>
              <span>Multi-language support</span>
            </div>
            <div className="voice-feature">
              <span className="voice-icon">⚡</span>
              <span>Instant voice recognition</span>
            </div>
            <div className="voice-feature">
              <span className="voice-icon">🔊</span>
              <span>Voice confirmation</span>
            </div>
          </div>
        </div>

        <div className="about-section">
          <h2>{t('about_mission')}</h2>
          <p>
            To bring restaurant-quality meals to your doorstep with exceptional speed and care. 
            We believe great food brings people together, and we're committed to making every 
            dining experience — whether at home or at work — truly memorable.
          </p>
        </div>

        <div className="features-section">
          <h2>{t('about_diff')}</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🎙️</div>
              <h3>Voice Customization</h3>
              <p>Your EchoEats learns your preferences. Say "the usual" and we'll know exactly what you want — your favorite pizza with extra cheese, no olives.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🌙</div>
              <h3>Smart Mood Ordering</h3>
              <p>Not sure what you want? Just say "I'm feeling cozy" or "something spicy" and our AI suggests meals that match your mood.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">👥</div>
              <h3>Group Voice Orders</h3>
              <p>Hosting friends? Everyone speaks their order aloud, and EchoEats compiles it into one seamless group checkout. No more passing phones around.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔄</div>
              <h3>Repeat & Schedule</h3>
              <p>Say "Order my Tuesday lunch routine" and we'll schedule recurring deliveries. Perfect for meal-preppers and busy professionals.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔔</div>
              <h3>Voice Notifications</h3>
              <p>Get real-time voice updates on your order status. "Your biryani is 5 minutes away" — no need to check your phone constantly.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🌎</div>
              <h3>Local Dialect Support</h3>
              <p>Order in Hindi, Tamil, Bengali, Kannada, and more. EchoEats understands regional accents and local food terms naturally.</p>
            </div>
          </div>
        </div>

        <div className="stats-section">
          <div className="stat-item">
            <h3>500+</h3>
            <p>Restaurant Partners</p>
          </div>
          <div className="stat-item">
            <h3>50k+</h3>
            <p>Happy Customers</p>
          </div>
          <div className="stat-item">
            <h3>20 min</h3>
            <p>Avg. Delivery Time</p>
          </div>
          <div className="stat-item">
            <h3>4.8 ★</h3>
            <p>Customer Rating</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AboutPage