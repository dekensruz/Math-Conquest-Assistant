import { useState, useRef, useEffect } from 'react'
import { BlockMath, InlineMath } from 'react-katex'
import 'katex/dist/katex.min.css'
import LoadingSpinner from './LoadingSpinner'

/**
 * Composant de chat interactif pour poser des questions de suivi sur la solution
 * Affiche l'historique des questions/réponses et permet de poser de nouvelles questions
 */
function ChatInterface({ problem, solution }) {
  const [messages, setMessages] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  // Scroll automatique vers le bas quand de nouveaux messages arrivent
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  /**
   * Envoie une question au backend
   */
  const handleSendMessage = async (e) => {
    e.preventDefault()
    
    if (!inputValue.trim() || isLoading) return

    const question = inputValue.trim()
    setInputValue('')
    
    // Ajouter la question de l'utilisateur à l'historique
    const userMessage = {
      type: 'user',
      content: question,
      timestamp: new Date()
    }
    setMessages(prev => [...prev, userMessage])
    setIsLoading(true)

    try {
      const response = await fetch('http://localhost:8000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          problem: problem,
          solution: solution,
          question: question
        }),
      })

      if (!response.ok) {
        let errorMessage = 'Erreur lors de l\'envoi de la question'
        try {
          const errorData = await response.json()
          errorMessage = errorData.detail || errorMessage
        } catch (e) {
          // Si la réponse n'est pas du JSON, utiliser le statut
          if (response.status === 404) {
            errorMessage = 'Endpoint /api/chat non trouvé. Veuillez redémarrer le backend pour charger le nouvel endpoint.'
          } else {
            errorMessage = `Erreur ${response.status}: ${response.statusText}`
          }
        }
        throw new Error(errorMessage)
      }

      const data = await response.json()
      
      // Ajouter la réponse à l'historique
      const assistantMessage = {
        type: 'assistant',
        content: data.answer,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, assistantMessage])
    } catch (err) {
      let errorContent = err.message || 'Une erreur est survenue. Veuillez réessayer.'
      
      // Message plus explicite pour l'erreur 404
      if (err.message && (err.message.includes('404') || err.message.includes('Not Found'))) {
        errorContent = '❌ Endpoint non trouvé. Veuillez redémarrer le backend (Ctrl+C puis python main.py) pour charger le nouvel endpoint /api/chat.'
      }
      
      const errorMessage = {
        type: 'error',
        content: errorContent,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
      inputRef.current?.focus()
    }
  }

  /**
   * Extrait le LaTeX d'un texte (détecte les formules entre backticks ou patterns LaTeX)
   */
  const extractLatex = (text) => {
    // Détecte les patterns comme \frac{}{}, \sqrt{}, etc.
    const latexPattern = /(\\[a-zA-Z]+\{[^}]*\}(?:\{[^}]*\})*)/g
    const parts = []
    let lastIndex = 0
    let match

    while ((match = latexPattern.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push({ type: 'text', content: text.substring(lastIndex, match.index) })
      }
      parts.push({ type: 'latex', content: match[0] })
      lastIndex = match.index + match[0].length
    }

    if (lastIndex < text.length) {
      parts.push({ type: 'text', content: text.substring(lastIndex) })
    }

    return parts.length > 0 ? parts : [{ type: 'text', content: text }]
  }

  /**
   * Rend un message avec support LaTeX
   */
  const renderMessage = (content) => {
    const parts = extractLatex(content)
    return (
      <div>
        {parts.map((part, index) => {
          if (part.type === 'latex') {
            return (
              <span key={index} className="inline-block mx-1">
                <InlineMath math={part.content} />
              </span>
            )
          }
          return <span key={index}>{part.content}</span>
        })}
      </div>
    )
  }

  return (
    <div className="mt-6 border-t border-gray-200 pt-6">
      <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">
        💬 Questions de suivi
      </h3>
      
      {/* Zone de chat */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 flex flex-col" style={{ maxHeight: '500px' }}>
        {/* Historique des messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ minHeight: '200px', maxHeight: '300px' }}>
          {messages.length === 0 && (
            <div className="text-center text-gray-500 py-8">
              <p className="text-sm">
                Posez une question sur la solution pour obtenir des clarifications !
              </p>
              <p className="text-xs mt-2 text-gray-400">
                Exemples : "Pourquoi cette étape ?", "Peux-tu donner un exemple similaire ?"
              </p>
            </div>
          )}
          
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg px-4 py-2 ${
                  message.type === 'user'
                    ? 'bg-blue-600 text-white'
                    : message.type === 'error'
                    ? 'bg-red-50 text-red-800 border border-red-200'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {message.type === 'assistant' || message.type === 'error' ? (
                  <div className="text-sm whitespace-pre-wrap">
                    {renderMessage(message.content)}
                  </div>
                ) : (
                  <div className="text-sm">{message.content}</div>
                )}
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 rounded-lg px-4 py-2">
                <LoadingSpinner />
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Zone de saisie */}
        <form onSubmit={handleSendMessage} className="border-t border-gray-200 p-4">
          <div className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Posez une question sur la solution..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed text-sm"
            >
              Envoyer
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ChatInterface

