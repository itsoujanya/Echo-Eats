import React, { useState, useContext } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import "./CSS/Login.css"
import { GlobalStateContext } from '../context/GlobalStateContext'
import { useLanguage } from '../context/LanguageContext'
const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  
  const { login } = useContext(GlobalStateContext)
  const { t } = useLanguage()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/'

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    try {
      if (isLogin) {
        const response = await fetch("http://localhost:8000/login/", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password })
        })
        
        const data = await response.json()
        
        if (response.ok) {
          login(data.user)
          navigate(from, { replace: true })
        } else {
          setError(data.error)
        }
      } else {
        const response = await fetch("http://localhost:8000/signup/", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name, email, password })
        })
        
        const data = await response.json()
        
        if (response.ok) {
          login(data.user)
          navigate(from, { replace: true })
        } else {
          setError(data.error)
        }
      }
    } catch (error) {
      setError(t('login_server_error'))
    }
  }

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-card">
        <h2>{isLogin ? t('login_login') : t('login_signup')}</h2>
        
        {error && <div className="error-message">{error}</div>}

        {!isLogin && (
          <input
            type="text"
            placeholder={t('login_full_name')}
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="login-input"
            required
          />
        )}

        <input
          type="email"
          placeholder={t('login_email')}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="login-input"
          required
        />

        <input
          type="password"
          placeholder={t('login_password')}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="login-input"
          required
        />

        <button type="submit" className="login-button">
          {isLogin ? t('login_login') : t('login_signup')}
        </button>

        <p className="login-toggle">
          {isLogin ? t('login_no_account') : t('login_have_account')}
          <span onClick={() => setIsLogin(!isLogin)}>
            {" "}
            {isLogin ? t('login_signup') : t('login_login')}
          </span>
        </p>
      </form>
    </div>
  )
}

export default LoginPage