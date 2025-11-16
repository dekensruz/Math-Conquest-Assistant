import { useState } from 'react'
import ImageUpload from './components/ImageUpload'
import ProblemDisplay from './components/ProblemDisplay'
import SolutionDisplay from './components/SolutionDisplay'
import LoadingSpinner from './components/LoadingSpinner'
import ErrorMessage from './components/ErrorMessage'

/**
 * Composant principal de l'application Math Assistant
 * Gère le flux complet : Upload -> Extraction LaTeX -> Résolution -> Affichage
 */
function App() {
  const [currentStep, setCurrentStep] = useState('upload') // 'upload' | 'latex' | 'solving' | 'solution'
  const [latexProblem, setLatexProblem] = useState('')
  const [solution, setSolution] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  /**
   * Gère l'extraction du LaTeX depuis l'image
   */
  const handleImageUpload = async (imageFile) => {
    setLoading(true)
    setError(null)
    setCurrentStep('extracting')

    try {
      const formData = new FormData()
      formData.append('file', imageFile)

      const response = await fetch('http://localhost:8000/api/extract-latex', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || 'Erreur lors de l\'extraction du LaTeX')
      }

      const data = await response.json()
      setLatexProblem(data.latex)
      setCurrentStep('latex')
    } catch (err) {
      setError(err.message || 'Une erreur est survenue lors de l\'extraction du LaTeX')
      setCurrentStep('upload')
    } finally {
      setLoading(false)
    }
  }

  /**
   * Gère la résolution du problème mathématique
   */
  const handleSolve = async () => {
    setLoading(true)
    setError(null)
    setCurrentStep('solving')

    try {
      const response = await fetch('http://localhost:8000/api/solve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ latex: latexProblem }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || 'Erreur lors de la résolution')
      }

      const data = await response.json()
      setSolution(data)
      setCurrentStep('solution')
    } catch (err) {
      setError(err.message || 'Une erreur est survenue lors de la résolution')
      setCurrentStep('latex')
    } finally {
      setLoading(false)
    }
  }

  /**
   * Réinitialise l'application pour un nouveau problème
   */
  const handleReset = () => {
    setCurrentStep('upload')
    setLatexProblem('')
    setSolution(null)
    setError(null)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            📐 Math Assistant
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">
            Résolvez vos problèmes mathématiques étape par étape
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* Affichage des erreurs */}
        {error && (
          <ErrorMessage message={error} onDismiss={() => setError(null)} />
        )}

        {/* Spinner de chargement global */}
        {loading && <LoadingSpinner />}

        {/* Étape 1: Upload d'image */}
        {currentStep === 'upload' && !loading && (
          <ImageUpload onImageUpload={handleImageUpload} />
        )}

        {/* Étape 2: Affichage du LaTeX extrait */}
        {currentStep === 'latex' && !loading && (
          <ProblemDisplay
            latex={latexProblem}
            onSolve={handleSolve}
            onReset={handleReset}
          />
        )}

        {/* Étape 3: Résolution en cours */}
        {currentStep === 'solving' && (
          <div className="text-center py-12">
            <LoadingSpinner />
            <p className="mt-4 text-gray-600">
              Résolution du problème en cours...
            </p>
          </div>
        )}

        {/* Étape 4: Affichage de la solution */}
        {currentStep === 'solution' && solution && (
          <SolutionDisplay
            problem={latexProblem}
            solution={solution}
            onReset={handleReset}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="mt-12 py-6 border-t border-gray-200 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center text-sm text-gray-500">
          <p>Math Assistant - Propulsé par OpenAI Vision & WolframAlpha</p>
        </div>
      </footer>
    </div>
  )
}

export default App

