import { useState, useEffect, useRef } from 'react'
import { BlockMath } from 'react-katex'
import 'katex/dist/katex.min.css'
import { useLanguage } from '../contexts/LanguageContext'

/**
 * Composant pour afficher et éditer le problème mathématique
 * Interface type "Calculatrice Scientifique" avec onglets
 */
function ProblemDisplay({ latex, onSolve, onReset }) {
  const { t } = useLanguage()
  const [editableLatex, setEditableLatex] = useState(latex)
  const [activeTab, setActiveTab] = useState('basic')
  const textareaRef = useRef(null)

  useEffect(() => {
    const cleanLatex = latex ? latex.replace(/^\\\[|\\\]$/g, '').trim() : ''
    setEditableLatex(cleanLatex)
  }, [latex])

  const handleSolve = () => {
    onSolve(editableLatex)
  }

  /**
   * Insère un symbole ou enveloppe la sélection
   * @param {string} start - Partie gauche du symbole (ex: \sqrt{)
   * @param {string} end - Partie droite du symbole (ex: })
   * @param {number} cursorOffset - Décalage du curseur après insertion (optionnel)
   */
  const insertMath = (start, end = '', cursorOffset = 0) => {
    if (!textareaRef.current) return

    const input = textareaRef.current
    const selStart = input.selectionStart
    const selEnd = input.selectionEnd
    const text = editableLatex
    
    const selection = text.substring(selStart, selEnd)
    const before = text.substring(0, selStart)
    const after = text.substring(selEnd)

    // Insérer le texte
    const newText = before + start + selection + end + after
    setEditableLatex(newText)

    // Replacer le curseur et redonner le focus
    setTimeout(() => {
      input.focus()
      // Si on a enveloppé une sélection, on sélectionne le contenu enveloppé
      if (selection.length > 0) {
        input.setSelectionRange(selStart + start.length, selEnd + start.length)
      } else {
        // Sinon on place le curseur à l'intérieur (ou à la position spécifiée)
        const newCursorPos = selStart + start.length + cursorOffset
        input.setSelectionRange(newCursorPos, newCursorPos)
      }
    }, 0)
  }

  // Configuration des catégories de symboles
  const categories = {
    basic: { label: 'Basique', icon: '+−' },
    algebra: { label: 'Algèbre', icon: 'x²' },
    functions: { label: 'Fonctions', icon: 'f(x)' },
    calculus: { label: 'Analyse', icon: '∫dx' },
    greek: { label: 'Grec', icon: 'αβ' }
  }

  const symbols = {
    basic: [
      { label: '+', insert: '+' },
      { label: '−', insert: '-' },
      { label: '×', insert: '\\times ' },
      { label: '÷', insert: '\\div ' },
      { label: '=', insert: '=' },
      { label: '≠', insert: '\\neq ' },
      { label: '±', insert: '\\pm ' },
      { label: '(', insert: '(', end: ')' },
      { label: ')', insert: ')' },
      { label: '[ ]', insert: '[', end: ']' },
      { label: '{ }', insert: '\\{', end: '\\}' },
    ],
    algebra: [
      { label: 'x²', insert: '^{2}' },
      { label: 'xⁿ', insert: '^{', end: '}' },
      { label: '√', insert: '\\sqrt{', end: '}' },
      { label: '³√', insert: '\\sqrt[3]{', end: '}' },
      { label: 'a/b', insert: '\\frac{', end: '}{}' }, // Curseur au numérateur
      { label: '|x|', insert: '|', end: '|' },
      { label: '∞', insert: '\\infty' },
      { label: 'π', insert: '\\pi' },
      { label: '<', insert: '<' },
      { label: '>', insert: '>' },
      { label: '≤', insert: '\\leq ' },
      { label: '≥', insert: '\\geq ' },
    ],
    functions: [
      { label: 'sin', insert: '\\sin(', end: ')' },
      { label: 'cos', insert: '\\cos(', end: ')' },
      { label: 'tan', insert: '\\tan(', end: ')' },
      { label: 'log', insert: '\\log(', end: ')' },
      { label: 'ln', insert: '\\ln(', end: ')' },
      { label: 'logₙ', insert: '\\log_{', end: '}()', offset: 0 },
      { label: 'eˣ', insert: 'e^{', end: '}' },
      { label: 'f(x)', insert: 'f(x)' },
    ],
    calculus: [
      { label: '∫', insert: '\\int ' },
      { label: '∫ₐᵇ', insert: '\\int_{', end: '}^{} ' },
      { label: 'lim', insert: '\\lim_{x \\to ', end: '} ' },
      { label: 'Σ', insert: '\\sum_{', end: '}^{} ' },
      { label: '∂x', insert: '\\partial ' },
      { label: 'dy/dx', insert: '\\frac{d}{dx}' },
      { label: '→', insert: '\\to ' },
      { label: '∈', insert: '\\in ' },
    ],
    greek: [
      { label: 'α', insert: '\\alpha ' },
      { label: 'β', insert: '\\beta ' },
      { label: 'γ', insert: '\\gamma ' },
      { label: 'δ', insert: '\\delta ' },
      { label: 'Δ', insert: '\\Delta ' },
      { label: 'θ', insert: '\\theta ' },
      { label: 'λ', insert: '\\lambda ' },
      { label: 'μ', insert: '\\mu ' },
      { label: 'σ', insert: '\\sigma ' },
      { label: 'ω', insert: '\\omega ' },
      { label: 'Ω', insert: '\\Omega ' },
    ]
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6 border border-gray-100 dark:border-gray-700 transition-colors">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <span className="w-2 h-6 bg-blue-600 rounded-full"></span>
          {t('problemDetected')}
        </h2>
      </div>

      {/* Zone de prévisualisation (Rendu Math) */}
      <div className="bg-slate-50 dark:bg-gray-900/80 rounded-xl p-6 mb-6 border-2 border-slate-100 dark:border-gray-700 flex items-center justify-center min-h-[120px] shadow-inner">
        <div className="text-center text-xl sm:text-2xl overflow-x-auto max-w-full text-slate-800 dark:text-slate-100">
          {editableLatex ? (
             <BlockMath math={editableLatex} />
          ) : (
             <span className="text-gray-400 italic text-base">Le problème s'affichera ici...</span>
          )}
        </div>
      </div>

      {/* Interface Éditeur Calculatrice */}
      <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-sm bg-white dark:bg-gray-800">
        
        {/* Onglets de catégories */}
        <div className="flex overflow-x-auto scrollbar-thin border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50">
          {Object.entries(categories).map(([key, cat]) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`
                flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap transition-all
                ${activeTab === key 
                  ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400 shadow-sm' 
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'
                }
              `}
            >
              <span className="font-mono text-xs opacity-70">{cat.icon}</span>
              {cat.label}
            </button>
          ))}
        </div>

        {/* Grille de symboles */}
        <div className="p-3 bg-gray-50 dark:bg-gray-900/30 grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2 max-h-48 overflow-y-auto scrollbar-thin">
          {symbols[activeTab].map((sym, idx) => (
            <button
              key={idx}
              onClick={() => insertMath(sym.insert, sym.end, sym.offset)}
              className="h-10 flex items-center justify-center rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm hover:border-blue-400 dark:hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 hover:shadow-md active:scale-95 transition-all text-sm font-medium text-gray-700 dark:text-gray-200"
              title={sym.insert}
            >
              {sym.label}
            </button>
          ))}
        </div>

        {/* Zone de texte */}
        <div className="relative border-t border-gray-200 dark:border-gray-700">
          <textarea
            ref={textareaRef}
            value={editableLatex}
            onChange={(e) => setEditableLatex(e.target.value)}
            className="w-full px-4 py-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-mono text-sm focus:outline-none focus:bg-blue-50/10 dark:focus:bg-blue-900/10 resize-y min-h-[100px]"
            placeholder="Utilisez les boutons ci-dessus pour écrire..."
            spellCheck="false"
          />
          <div className="absolute bottom-2 right-3 text-[10px] text-gray-400 dark:text-gray-500 pointer-events-none">
            LaTeX
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 mt-6">
        <button
          onClick={handleSolve}
          className="flex-1 px-6 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/30 active:scale-[0.98] transition-all text-base flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {t('solveButton')}
        </button>
        <button
          onClick={onReset}
          className="px-6 py-3.5 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-all text-sm"
        >
          {t('cancel')}
        </button>
      </div>
    </div>
  )
}

export default ProblemDisplay
