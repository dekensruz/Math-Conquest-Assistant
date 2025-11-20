import { BlockMath } from 'react-katex'
import 'katex/dist/katex.min.css'
import { useLanguage } from '../contexts/LanguageContext'
import { fixLatexInText } from '../utils/latexHelper'

function ProblemReview({ latex, onEdit, onSolve, onReset }) {
  const { t } = useLanguage()
  const cleanedLatex = latex ? fixLatexInText(latex.replace(/^\\\[|\\\]$/g, '').trim()) : ''

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-6 sm:p-8 space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-wider text-blue-500 dark:text-blue-300 font-semibold mb-1">
            {t('problemDetected')}
          </p>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {t('confirmTitle')}
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-2xl">
            {t('confirmSubtitle')}
          </p>
        </div>
        <button
          onClick={onReset}
          className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          {t('back')}
        </button>
      </div>

      <div className="bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-100 dark:border-slate-700 p-6 min-h-[160px] flex items-center justify-center text-center overflow-x-auto shadow-inner">
        {cleanedLatex ? (
          <BlockMath math={cleanedLatex} />
        ) : (
          <p className="text-gray-400 italic">{t('problemPreviewPlaceholder')}</p>
        )}
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <button
          onClick={onSolve}
          className="px-5 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-lg shadow-blue-500/30 hover:scale-[1.01] transition-all"
        >
          {t('solveButton')}
        </button>
        <button
          onClick={onEdit}
          className="px-5 py-3 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 font-medium hover:border-blue-400 dark:hover:border-blue-400 transition-all"
        >
          {t('edit')}
        </button>
        <button
          onClick={onReset}
          className="px-5 py-3 rounded-xl bg-gray-100 dark:bg-gray-900 border border-dashed border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-300 font-medium hover:bg-gray-200 dark:hover:bg-gray-800 transition-all"
        >
          {t('chooseAnother')}
        </button>
      </div>
    </div>
  )
}

export default ProblemReview


