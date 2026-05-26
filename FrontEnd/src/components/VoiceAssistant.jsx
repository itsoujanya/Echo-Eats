import React, { useState, useContext, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { GlobalStateContext } from '../context/GlobalStateContext';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import './CSS/Voice.css';

const playAudioFromText = async (text) => {
  const encodedText = encodeURIComponent(text);
  const googleTTSUrl = `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&q=${encodedText}&tl=en`;
  const audio = new Audio(googleTTSUrl);
  audio.crossOrigin = 'anonymous';
  
  return new Promise((resolve) => {
    let resolved = false;
    
    // Set a timeout to resolve if audio doesn't load
    const timeout = setTimeout(() => {
      if (!resolved) {
        resolved = true;
        console.warn('Google TTS timeout - audio may not have played');
        resolve();
      }
    }, 8000);
    
    audio.onended = () => {
      resolved = true;
      clearTimeout(timeout);
      resolve();
    };
    
    audio.onerror = (error) => {
      resolved = true;
      clearTimeout(timeout);
      console.warn('Google TTS playback failed, continuing with text only:', error);
      resolve(); // Resolve without throwing - allow text response to show
    };
    
    audio.onloadstart = () => {
      console.log('Audio playback started');
    };
    
    audio.play().catch((playError) => {
      if (!resolved) {
        resolved = true;
        clearTimeout(timeout);
        console.warn('Audio play failed, continuing with text only:', playError);
        resolve();
      }
    });
  });
};

const VoiceAssistant = () => {
  const navigate = useNavigate();
  const { Togg, setTogg, updateQuantity, logout, login, foodData } = useContext(GlobalStateContext);

  const [isListening, setIsListening] = useState(false);
  const [assistantResponse, setAssistantResponse] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [speechMethod, setSpeechMethod] = useState('native');
  const [hasGreeted, setHasGreeted] = useState(false);
  const [loginStep, setLoginStep] = useState(null);
  const [loginEmail, setLoginEmail] = useState('');
  const [ttsFallbackUsed, setTtsFallbackUsed] = useState(false);
  const [processedCommands, setProcessedCommands] = useState([]);
  const [transcriptTimeout, setTranscriptTimeout] = useState(null);

  const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition } =
    useSpeechRecognition();

  useEffect(() => {
    if ('speechSynthesis' in window) {
      // Load voices asynchronously
      const loadVoices = () => {
        const voices = window.speechSynthesis.getVoices();
        if (voices.length > 0) {
          setSpeechMethod('native');
          setTtsFallbackUsed(false); // Reset fallback when native voices are available
          console.log('[TTS] Native speech synthesis available with', voices.length, 'voices');
        } else {
          setSpeechMethod('google');
          console.log('[TTS] No native voices found, using Google TTS');
        }
      };
      
      if (window.speechSynthesis.getVoices().length > 0) {
        loadVoices();
      } else {
        // Wait for voices to load
        window.speechSynthesis.onvoiceschanged = loadVoices;
      }
    } else {
      setSpeechMethod('google');
      console.log('[TTS] Speech synthesis not available, using Google TTS');
    }

    if (!hasGreeted && !Togg && browserSupportsSpeechRecognition) {
      setTimeout(() => {
        const greeting = "Hello! I am your voice assistant. How can I help you today?";
        setAssistantResponse(greeting);
        
        // Small delay before speaking greeting
        setTimeout(() => {
          speakResponse(greeting);
        }, 300);
        
        setHasGreeted(true);
      }, 1000);
    }
  }, [Togg, hasGreeted, browserSupportsSpeechRecognition]); 

  // ── TTS ────────────────────────────────────────────────────────────────────
  const speakResponse = useCallback(async (text) => {
    if (!text) return;
    
    setIsSpeaking(true);
    console.log('[TTS] Starting audio playback with method:', speechMethod, 'fallback used:', ttsFallbackUsed);
    
    try {
      if (speechMethod === 'native' && 'speechSynthesis' in window && !ttsFallbackUsed) {
        window.speechSynthesis.cancel();
        
        const voices = window.speechSynthesis.getVoices();
        if (voices.length === 0) {
          console.warn('[TTS] No native voices available, falling back to Google TTS');
          setSpeechMethod('google');
          setTtsFallbackUsed(true);
          setIsSpeaking(false);
          speakResponse(text);
          return;
        }
        
        const utterance = new SpeechSynthesisUtterance(text);
        
        // Prioritize Indian English, then any English voice (avoid US)
        let selectedVoice = null;
        
        // Try Indian English first
        selectedVoice = voices.find(v => v.lang === 'en-IN' || v.lang === 'en-IN');
        if (selectedVoice) {
          console.log('[TTS] Using Indian English voice:', selectedVoice.name);
        } else {
          // Try UK English or other English variants (avoid US)
          selectedVoice = voices.find(v => 
            v.lang.startsWith('en-') && 
            !v.name.includes('United States') && 
            !v.name.includes('US')
          );
          if (selectedVoice) {
            console.log('[TTS] Using non-US English voice:', selectedVoice.name);
          } else {
            // Last resort - any English voice
            selectedVoice = voices.find(v => v.lang.startsWith('en'));
            if (selectedVoice) {
              console.log('[TTS] Using fallback English voice:', selectedVoice.name);
            }
          }
        }
        
        if (selectedVoice) {
          utterance.voice = selectedVoice;
          utterance.lang = selectedVoice.lang;
        } else {
          utterance.lang = 'en-IN'; // Default fallback
        }
        
        utterance.rate = 0.8; // Slightly slower for clarity
        utterance.pitch = 1.1; // Slightly higher pitch
        utterance.volume = 0.9;
        
        utterance.onstart = () => {
          console.log('[TTS] Speech synthesis started');
        };
        
        utterance.onend = () => {
          console.log('[TTS] Speech synthesis completed');
          setIsSpeaking(false);
        };
        
        utterance.onerror = (event) => {
          const errorType = event.error || 'unknown';
          console.error('[TTS] Speech synthesis error:', errorType);
          
          // Only fallback if it's not an interruption (which is normal)
          if (errorType !== 'interrupted') {
            console.log('[TTS] Falling back to Google TTS due to error:', errorType);
            setSpeechMethod('google');
            setTtsFallbackUsed(true);
            setIsSpeaking(false);
            speakResponse(text);
          } else {
            console.log('[TTS] Speech was interrupted (normal), not falling back');
            setIsSpeaking(false);
          }
        };
        
        window.speechSynthesis.speak(utterance);
        
      } else if (speechMethod === 'google' || ttsFallbackUsed) {
        console.log('[TTS] Using Google Text-to-Speech');
        try {
          await playAudioFromText(text);
          console.log('[TTS] Google TTS playback completed');
        } catch (error) {
          console.warn('[TTS] Google TTS error (text will still display):', error);
        }
        setIsSpeaking(false);
      }
    } catch (error) {
      console.error('[TTS] Speak response error:', error);
      setIsSpeaking(false);
    }
  }, [speechMethod, ttsFallbackUsed]);

  const handleLogin = async (email, password) => {
    try {
      const res = await fetch('http://localhost:8000/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok && data.user) {
        login(data.user);
        speakResponse('Login successful. How can I help you?');
      } else {
        speakResponse(data.message || 'Login failed. Please try again.');
      }
    } catch (error) {
      console.error('Login error:', error);
      speakResponse('Login failed. Please try again.');
    } finally {
      setLoginStep(null);
      setLoginEmail('');
    }
  };

  const handleCommand = useCallback(async (commandData) => {
    switch (commandData.command) {
      case 'FILTER':
        navigate('/');
        setTimeout(() => {
          document.getElementById('items')?.scrollIntoView({ behavior: 'smooth' });
          setTimeout(() => {
            const btns = document.querySelectorAll('.category-btn');
            for (const btn of btns) {
              if (btn.textContent === commandData.category) {
                btn.click();
                break;
              }
            }
          }, 300);
        }, 300);
        break;

      case 'NAVIGATE':
        navigate(commandData.path);
        if (commandData.path === '/#items') {
          setTimeout(() => {
            document.getElementById('items')?.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        }
        break;

      case 'ORDER':
        if (commandData.items?.length) {
          for (const item of commandData.items) {
            const foodItem = foodData.find(f =>
              f.FoodName.toLowerCase().includes(item.name.toLowerCase())
            );
            if (foodItem) {
              for (let i = 0; i < item.quantity; i++) {
                await updateQuantity(foodItem.FoodID, 1);
              }
            }
          }
        }
        break;

      case 'REMOVE':
        if (commandData.items?.length) {
          for (const item of commandData.items) {
            const foodItem = foodData.find(f =>
              f.FoodName.toLowerCase().includes(item.name.toLowerCase())
            );
            if (foodItem) {
              for (let i = 0; i < item.quantity; i++) {
                await updateQuantity(foodItem.FoodID, -1);
              }
            }
          }
        }
        break;

      case 'LOGOUT':
        await logout();
        speakResponse('Logged out successfully');
        break;

      case 'PAYMENT':
        navigate('/cart#payment-modal');
        setTimeout(() => {
          const paymentModal = document.getElementById('payment-modal');
          if (paymentModal) {
            paymentModal.scrollIntoView({ behavior: 'smooth' });
          }
        }, 300);
        break;

      default:
        break;
    }
  }, [navigate, foodData, updateQuantity, logout]);

  const processVoiceCommand = useCallback(async (command) => {
    setIsProcessing(true);
    try {
      const res = await fetch('http://localhost:8000/voice/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript: command }),
      });
      
      if (!res.ok) {
        let serverError = '';
        try {
          const errorBody = await res.json();
          serverError = errorBody?.error || errorBody?.details || '';
        } catch {
          // Ignore JSON parse errors and fallback to status-only message
        }

        if (res.status === 500) {
          throw new Error(serverError || 'Backend error (500). Check GROQ_API_KEY and backend logs.');
        }

        throw new Error(serverError || `Server error: ${res.status}`);
      }
      
      const data = await res.json();

      if (data.aiResponse) {
        setAssistantResponse(data.aiResponse.response);
        
        // Small delay to prevent speech interruptions
        setTimeout(() => {
          speakResponse(data.aiResponse.response);
        }, 200);
        
        if (data.aiResponse.command === 'NAVIGATE' && data.aiResponse.page === 'login') {
          setLoginStep('awaiting_email');
          speakResponse('Please say your email');
        } else {
          await handleCommand(data.aiResponse);
        }
      } else {
        setAssistantResponse('Sorry, I did not understand that. Could you repeat?');
        speakResponse('Sorry, I did not understand that. Could you repeat?');
      }
    } catch (error) {
      console.error('Voice command error:', error);
      const errorMsg =
        error?.name === 'TypeError'
          ? 'Cannot reach backend on port 8000. Start Django with: python manage.py runserver 8000'
          : (error?.message || 'Sorry, I encountered an error processing your command.');
      setAssistantResponse(errorMsg);
      speakResponse(errorMsg);
    } finally {
      setIsProcessing(false);
    }
  }, [speakResponse, handleCommand]);

  const processTranscript = useCallback(async (text) => {
    if (!text || processedCommands.includes(text)) return;
    setProcessedCommands(prev => [...prev, text]);

    if (loginStep === 'awaiting_email') {
      setLoginEmail(text);
      setLoginStep('awaiting_password');
      speakResponse('Please say your password');
      return;
    }
    if (loginStep === 'awaiting_password') {
      await handleLogin(loginEmail, text);
      return;
    }

    await processVoiceCommand(text);
  }, [processedCommands, loginStep, loginEmail, speakResponse, processVoiceCommand]);

  useEffect(() => {
    if (!transcript || !isListening) return;
    if (transcriptTimeout) clearTimeout(transcriptTimeout);

    const timeout = setTimeout(() => {
      if (transcript && !processedCommands.includes(transcript)) {
        processTranscript(transcript);
      }
    }, 2000);
    setTranscriptTimeout(timeout);

    return () => clearTimeout(timeout);
  }, [transcript, isListening, processedCommands, processTranscript]); 

  useEffect(() => {
    if (!listening && transcript && isListening) {
      const timer = setTimeout(stopListening, 1000);
      return () => clearTimeout(timer);
    }
  }, [listening, transcript, isListening]); 

  const startListening = () => {
    window.speechSynthesis?.cancel();
    setIsSpeaking(false);
    setIsListening(true);
    resetTranscript();
    SpeechRecognition.startListening({ continuous: true, language: 'en-IN' });
  };

  const stopListening = () => {
    setIsListening(false);
    SpeechRecognition.stopListening();
    if (transcript && !processedCommands.includes(transcript)) {
      processTranscript(transcript);
    }
  };

  const openAssistant = () => setTogg(true);

  const closeAssistant = () => {
    window.speechSynthesis?.cancel();
    setTogg(false);
    setIsListening(false);
    setAssistantResponse('');
    setProcessedCommands([]);
    setLoginStep(null);
    setLoginEmail('');
    setTtsFallbackUsed(false); // Reset fallback flag
    resetTranscript();
  };

  if (!Togg) {
    if (!browserSupportsSpeechRecognition) {
      return (
        <div className="voice-assistant-floating">
          <div className="floating-voice-button disabled" title="Voice Assistant not supported in your browser">
            <span className="mic-icon">🎤</span>
            <span style={{fontSize: '10px', marginLeft: '4px'}}>Not Supported</span>
          </div>
        </div>
      );
    }
    return (
      <div className="voice-assistant-floating">
        <button className="floating-voice-button" onClick={openAssistant} title="Open Voice Assistant">
          <span className="mic-icon">🎤</span>
          {isSpeaking && <span className="floating-pulse"></span>}
        </button>
        {isSpeaking && <div className="floating-speaking-indicator">🔊 Speaking...</div>}
      </div>
    );
  }

  return (
    <div className="voice-assistant-panel">
      <div className="voice-header">
        <h3>🎤 Voice Assistant</h3>
        {speechMethod === 'google' && (
          <p className="voice-subtitle">(Using Google TTS)</p>
        )}
      </div>

      <div className="voice-controls">
        <button
          className={`listen-button ${isListening ? 'listening' : ''}`}
          onClick={isListening ? stopListening : startListening}
          disabled={isProcessing}
        >
          {isListening ? (
            <><span className="pulse-icon"></span>Listening... Click to Stop</>
          ) : isProcessing ? 'Processing...' : '🎤 Start Voice Command'}
        </button>

        {isListening && (
          <div className="listening-indicator">
            <div className="sound-wave">
              {[...Array(5)].map((_, i) => <div key={i} className="bar"></div>)}
            </div>
            <span>Speak now...</span>
          </div>
        )}

        {isProcessing && (
          <div className="processing-indicator">
            <div className="spinner"></div>
            Processing your command...
          </div>
        )}
      </div>

      {transcript && (
        <div className="voice-transcript">
          <div className="transcript-label">You said:</div>
          <div className="transcript-text">"{transcript}"</div>
        </div>
      )}

      {assistantResponse && (
        <div className="assistant-response">
          <div className="response-label">Assistant:</div>
          <div className="response-text">{assistantResponse}</div>
          {isSpeaking && (
            <div className="speaking-indicator">
              <span className="sound-icon">🔊</span>
              {speechMethod === 'google' ? 'Playing...' : 'Speaking...'}
            </div>
          )}
        </div>
      )}

      <div className="voice-tips">
        <small>
          💡 <strong>Try saying:</strong> "Go to menu", "Show pizzas", "Add 3 burgers", "Go to cart", "Login", "Logout"
        </small>
      </div>

      <button className="close-button" onClick={closeAssistant}>✕</button>
    </div>
  );
};

export default VoiceAssistant;
