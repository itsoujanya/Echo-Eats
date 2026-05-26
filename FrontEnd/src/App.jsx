import React from 'react'
import { Outlet } from 'react-router-dom'
import { GlobalStateProvider } from './context/GlobalStateContext'
import { LanguageProvider } from './context/LanguageContext'
import Navbar from './components/Navbar'
import VoiceAssistant from './components/VoiceAssistant'
import Footer from './components/Footer'
import './components/CSS/Global.css'

const App = () => {
  return (
    <LanguageProvider>
      <GlobalStateProvider>
        <Navbar />
        <Outlet />
        <VoiceAssistant />
        <Footer />
      </GlobalStateProvider>
    </LanguageProvider>
  )
}

export default App