import { BlockMath, InlineMath } from 'react-katex'
import 'katex/dist/katex.min.css'

/**
 * Composant pour afficher le problème LaTeX extrait
 * Permet à l'utilisateur de confirmer avant de résoudre
 */
function ProblemDisplay({ latex, onSolve, onReset }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 sm:p-8">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
        Problème extrait
      </h2>

      {/* Affichage du LaTeX */}
      <div className="bg-gray-50 rounded-lg p-6 mb-6 overflow-x-auto">
        <div className="text-center">
          <BlockMath math={latex} />
        </div>
      </div>

      {/* Code LaTeX brut (optionnel, pour debug) */}
      <details className="mb-6">
        <summary className="text-sm text-gray-600 cursor-pointer hover:text-gray-900">
          Voir le code LaTeX brut
        </summary>
        <pre className="mt-2 p-4 bg-gray-100 rounded text-xs overflow-x-auto">
          {latex}
        </pre>
      </details>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={onSolve}
          className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm sm:text-base"
        >
          ✅ Résoudre ce problème
        </button>
        <button
          onClick={onReset}
          className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors text-sm sm:text-base"
        >
          🔄 Nouvelle image
        </button>
      </div>
    </div>
  )
}

export default ProblemDisplay

