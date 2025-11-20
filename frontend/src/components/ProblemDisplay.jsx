import { useState, useEffect, useRef } from 'react'
import { BlockMath } from 'react-katex'
import 'katex/dist/katex.min.css'
import { useLanguage } from '../contexts/LanguageContext'
import { fixLatexInText, latexToPlainText } from '../utils/latexHelper'
import { naturalToLatex } from '../utils/mathParser'

/**
 * Composant pour afficher et éditer le problème mathématique
 * Interface type "Calculatrice Scientifique" avec onglets
 */
function ProblemDisplay({ latex, onSolve, onReset }) {
  const { t } = useLanguage()
  const [editableLatex, setEditableLatex] = useState('')
  const [simpleInput, setSimpleInput] = useState('')
  const [editorMode, setEditorMode] = useState('natural')
  const [activeTab, setActiveTab] = useState('basic')
  const latexTextareaRef = useRef(null)
  const naturalTextareaRef = useRef(null)

  useEffect(() => {
    const cleanLatex = latex ? fixLatexInText(latex.replace(/^\\\[|\\\]$/g, '').trim()) : ''
    setEditableLatex(cleanLatex)
    setSimpleInput(latexToPlainText(cleanLatex))
  }, [latex])

  const handleSolve = () => {
    onSolve(editableLatex.trim())
  }

  const updateNaturalInput = (value) => {
    setSimpleInput(value)
    setEditableLatex(naturalToLatex(value))
  }

  const handleModeChange = (mode) => {
    setEditorMode(mode)
    if (mode === 'natural') {
      setSimpleInput((prev) => prev || latexToPlainText(editableLatex))
    }
  }

  const applyInsertion = (ref, currentValue, updater, config = {}) => {
    if (!ref.current) return
    const input = ref.current
    const { start = '', end = '', cursorOffset = 0 } = config
    const selStart = input.selectionStart ?? currentValue.length
    const selEnd = input.selectionEnd ?? currentValue.length

    const before = currentValue.substring(0, selStart)
    const selection = currentValue.substring(selStart, selEnd)
    const after = currentValue.substring(selEnd)
    const nextValue = before + start + selection + end + after

    updater(nextValue)

    requestAnimationFrame(() => {
      input.focus()
      if (selection.length > 0) {
        input.setSelectionRange(selStart + start.length, selEnd + start.length)
      } else {
        const newCursorPos = selStart + start.length + cursorOffset
        input.setSelectionRange(newCursorPos, newCursorPos)
      }
    })
  }

  const handleInsertSymbol = (symbol) => {
    if (editorMode === 'natural') {
      if (!symbol.natural) return
      const config = symbol.natural
      applyInsertion(naturalTextareaRef, simpleInput, updateNaturalInput, config)
    } else {
      const config = symbol.latex || { start: symbol.label }
      applyInsertion(latexTextareaRef, editableLatex, setEditableLatex, config)
    }
  }

  // Configuration des catégories de symboles
  const categories = {
    basic: { label: t('keyboardBasic'), icon: '+−' },
    algebra: { label: t('keyboardAlgebra'), icon: 'x²' },
    functions: { label: t('keyboardFunctions'), icon: 'f(x)' },
    calculus: { label: t('keyboardCalculus'), icon: '∫dx' },
    greek: { label: t('keyboardGreek'), icon: 'αβ' }
  }

  const symbols = {
    basic: [
      { label: '+', latex: { start: '+' }, natural: { start: '+' } },
      { label: '−', latex: { start: '-' }, natural: { start: '-' } },
      { label: '×', latex: { start: '\\times ' }, natural: { start: '×' } },
      { label: '÷', latex: { start: '\\div ' }, natural: { start: '÷' } },
      { label: '=', latex: { start: '=' }, natural: { start: '=' } },
      { label: '≠', latex: { start: '\\neq ' }, natural: { start: '≠' } },
      { label: '±', latex: { start: '\\pm ' }, natural: { start: '±' } },
      { label: '(', latex: { start: '(', end: ')' }, natural: { start: '(', end: ')' } },
      { label: ')', latex: { start: ')' }, natural: { start: ')' } },
      { label: '[ ]', latex: { start: '[', end: ']' }, natural: { start: '[', end: ']' } },
      { label: '{ }', latex: { start: '\\{', end: '\\}' }, natural: { start: '{', end: '}' } },
    ],
    algebra: [
      { label: 'x²', latex: { start: '^{2}' }, natural: { start: '^2' } },
      { label: 'xⁿ', latex: { start: '^{', end: '}' }, natural: { start: '^(', end: ')' } },
      { label: '√', latex: { start: '\\sqrt{', end: '}' }, natural: { start: '√(', end: ')' } },
      { label: '³√', latex: { start: '\\sqrt[3]{', end: '}' }, natural: { start: '∛(', end: ')' } },
      { label: 'a/b', latex: { start: '\\frac{', end: '}{}', cursorOffset: -1 }, natural: { start: '(', end: ')/()', cursorOffset: 0 } },
      { label: '|x|', latex: { start: '|', end: '|' }, natural: { start: '|', end: '|' } },
      { label: '∞', latex: { start: '\\infty ' }, natural: { start: '∞' } },
      { label: 'π', latex: { start: '\\pi ' }, natural: { start: 'π' } },
      { label: '<', latex: { start: '<' }, natural: { start: '<' } },
      { label: '>', latex: { start: '>' }, natural: { start: '>' } },
      { label: '≤', latex: { start: '\\leq ' }, natural: { start: '≤' } },
      { label: '≥', latex: { start: '\\geq ' }, natural: { start: '≥' } },
    ],
    functions: [
      { label: 'sin', latex: { start: '\\sin(', end: ')' }, natural: { start: 'sin(', end: ')' } },
      { label: 'cos', latex: { start: '\\cos(', end: ')' }, natural: { start: 'cos(', end: ')' } },
      { label: 'tan', latex: { start: '\\tan(', end: ')' }, natural: { start: 'tan(', end: ')' } },
      { label: 'log', latex: { start: '\\log(', end: ')' }, natural: { start: 'log(', end: ')' } },
      { label: 'ln', latex: { start: '\\ln(', end: ')' }, natural: { start: 'ln(', end: ')' } },
      { label: 'logₙ', latex: { start: '\\log_{', end: '}()', cursorOffset: 0 }, natural: { start: 'log_(', end: ')( )', cursorOffset: -2 } },
      { label: 'eˣ', latex: { start: 'e^{', end: '}' }, natural: { start: 'e^(', end: ')' } },
      { label: 'f(x)', latex: { start: 'f(x)' }, natural: { start: 'f(x)' } },
    ],
    calculus: [
      { label: '∫', latex: { start: '\\int ' }, natural: { start: '∫ ' } },
      { label: '∫ₐᵇ', latex: { start: '\\int_{', end: '}^{} ' }, natural: { start: '∫_(', end: ')^() ', cursorOffset: 0 } },
      { label: 'lim', latex: { start: '\\lim_{x \\to ', end: '} ' }, natural: { start: 'lim(', end: ')→()', cursorOffset: -2 } },
      { label: 'Σ', latex: { start: '\\sum_{', end: '}^{} ' }, natural: { start: 'Σ_(', end: ')^() ', cursorOffset: 0 } },
      { label: '∂x', latex: { start: '\\partial ' }, natural: { start: '∂' } },
      { label: 'dy/dx', latex: { start: '\\frac{d}{dx}' }, natural: { start: 'dy/dx' } },
      { label: '→', latex: { start: '\\to ' }, natural: { start: '→' } },
      { label: '∈', latex: { start: '\\in ' }, natural: { start: '∈' } },
    ],
    greek: [
      { label: 'α', latex: { start: '\\alpha ' }, natural: { start: 'α' } },
      { label: 'β', latex: { start: '\\beta ' }, natural: { start: 'β' } },
      { label: 'γ', latex: { start: '\\gamma ' }, natural: { start: 'γ' } },
      { label: 'δ', latex: { start: '\\delta ' }, natural: { start: 'δ' } },
      { label: 'Δ', latex: { start: '\\Delta ' }, natural: { start: 'Δ' } },
      { label: 'θ', latex: { start: '\\theta ' }, natural: { start: 'θ' } },
      { label: 'λ', latex: { start: '\\lambda ' }, natural: { start: 'λ' } },
      { label: 'μ', latex: { start: '\\mu ' }, natural: { start: 'μ' } },
      { label: 'σ', latex: { start: '\\sigma ' }, natural: { start: 'σ' } },
      { label: 'ω', latex: { start: '\\omega ' }, natural: { start: 'ω' } },
      { label: 'Ω', latex: { start: '\\Omega ' }, natural: { start: 'Ω' } },
    ]
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6 border border-gray-100 dark:border-gray-700 transition-colors">
      <div className="flex flex-col gap-4 mb-4">
        <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <span className="w-2 h-6 bg-blue-600 rounded-full"></span>
          {t('problemDetected')}
        </h2>
        <div className="inline-flex items-center gap-2 bg-gray-100 dark:bg-gray-900 rounded-full p-1 text-xs font-semibold">
          <button
            onClick={() => handleModeChange('natural')}
            className={`px-3 py-1 rounded-full transition-all ${editorMode === 'natural' ? 'bg-white dark:bg-gray-700 text-blue-600 shadow' : 'text-gray-500 dark:text-gray-400'}`}
          >
            {t('naturalMode')}
          </button>
          <button
            onClick={() => handleModeChange('latex')}
            className={`px-3 py-1 rounded-full transition-all ${editorMode === 'latex' ? 'bg-white dark:bg-gray-700 text-blue-600 shadow' : 'text-gray-500 dark:text-gray-400'}`}
          >
            {t('latexMode')}
          </button>
        </div>
        </div>
      </div>

      {/* Zone de prévisualisation (Rendu Math) */}
      <div className="bg-slate-50 dark:bg-gray-900/80 rounded-xl p-6 mb-6 border-2 border-slate-100 dark:border-gray-700 flex items-center justify-center min-h-[120px] shadow-inner">
        <div className="text-center text-xl sm:text-2xl overflow-x-auto max-w-full text-slate-800 dark:text-slate-100">
          {editableLatex ? (
             <BlockMath math={fixLatexInText(editableLatex)} />
          ) : (
             <span className="text-gray-400 italic text-base">{t('problemPreviewPlaceholder')}</span>
          )}
        </div>
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
        {editorMode === 'natural' ? t('naturalHelper') : t('problemHint')}
      </p>

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
          {symbols[activeTab].map((sym, idx) => {
            const isDisabled = editorMode === 'natural' && !sym.natural
            return (
              <button
                key={idx}
                type="button"
                disabled={isDisabled}
                onClick={() => !isDisabled && handleInsertSymbol(sym)}
                className={`h-10 flex items-center justify-center rounded-lg border text-sm font-medium transition-all ${
                  isDisabled
                    ? 'bg-gray-100 dark:bg-gray-900 border-gray-200 dark:border-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed opacity-60'
                    : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:border-blue-400 dark:hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 hover:shadow-md active:scale-95 shadow-sm'
                }`}
                title={editorMode === 'natural' ? sym.natural?.start || sym.latex?.start || sym.label : sym.latex?.start || sym.label}
              >
                {sym.label}
              </button>
            )
          })}
        </div>

        {/* Zone de texte */}
        {editorMode === 'natural' ? (
          <div className="relative border-t border-gray-200 dark:border-gray-700">
            <textarea
              ref={naturalTextareaRef}
              value={simpleInput}
              onChange={(e) => updateNaturalInput(e.target.value)}
              className="w-full px-4 py-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-medium text-base focus:outline-none focus:bg-blue-50/10 dark:focus:bg-blue-900/10 resize-y min-h-[120px]"
              placeholder={t('naturalPlaceholder')}
            />
            <div className="absolute bottom-2 right-3 text-[10px] text-gray-400 dark:text-gray-500 pointer-events-none">
              {t('naturalMode')}
            </div>
          </div>
        ) : (
          <div className="relative border-t border-gray-200 dark:border-gray-700">
            <textarea
              ref={latexTextareaRef}
              value={editableLatex}
              onChange={(e) => setEditableLatex(e.target.value)}
              className="w-full px-4 py-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-mono text-sm focus:outline-none focus:bg-blue-50/10 dark:focus:bg-blue-900/10 resize-y min-h-[100px]"
              placeholder={t('problemPlaceholder')}
              spellCheck="false"
            />
            <div className="absolute bottom-2 right-3 text-[10px] text-gray-400 dark:text-gray-500 pointer-events-none">
              {t('latexLabel')}
            </div>
          </div>
        )}
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
