import { BlockMath } from 'react-katex'
import 'katex/dist/katex.min.css'
import { useEffect, useRef } from 'react'
import jsPDF from 'jspdf'
import ChatInterface from './ChatInterface'
import { addToHistory } from '../utils/historyStorage'
import StepDescription from './StepDescription'
import { fixLatexInText, latexToPlainText } from '../utils/latexHelper'
import { useLanguage } from '../contexts/LanguageContext'

/**
 * Composant pour afficher la solution complète avec explications étape par étape
 * Inclut l'export PDF
 */
function SolutionDisplay({ problem, solution, onReset }) {
  const { t } = useLanguage()
  const contentRef = useRef(null)

  // Sauvegarder dans l'historique quand la solution est affichée
  useEffect(() => {
    if (problem && solution) {
      addToHistory(problem, solution)
    }
  }, [problem, solution])

  /**
   * Exporte la solution en PDF
   */
  const handleExportPDF = () => {
    if (!contentRef.current) return

    // Utiliser html2canvas pour capturer le contenu
    import('html2canvas').then((html2canvas) => {
      html2canvas.default(contentRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
      }).then((canvas) => {
        const imgData = canvas.toDataURL('image/png')
        const pdf = new jsPDF('p', 'mm', 'a4')
        const imgWidth = 210 // A4 width in mm
        const pageHeight = 297 // A4 height in mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width
        let heightLeft = imgHeight

        let position = 0

        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
        heightLeft -= pageHeight

        while (heightLeft >= 0) {
          position = heightLeft - imgHeight
          pdf.addPage()
          pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
          heightLeft -= pageHeight
        }
        pdf.save('solution-math-conquest-assistant.pdf')
      })
    })
  }

  // Parsing de l'explication si c'est une string JSON brute
  let explanation = solution.explanation || {};
  if (typeof explanation === 'string') {
    const originalText = explanation;
    try {
      // Essayer d'extraire le JSON d'un bloc de code markdown
      const jsonMatch = explanation.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
      if (jsonMatch) {
        explanation = JSON.parse(jsonMatch[1]);
      } else {
        // Essayer de parser directement
        explanation = JSON.parse(explanation);
      }
    } catch (e) {
      console.error("Erreur de parsing JSON:", e);
      // Fallback si le parsing échoue
      explanation = {
        steps: [],
        summary: 'Erreur lors du parsing de l\'explication.',
        raw_text: originalText
      };
    }
  }

  // Traitement de la réponse finale avec nettoyage agressif
  const wolframResult = solution?.wolfram_result?.result
  let rawFinalAnswer = explanation.final_answer || wolframResult || ''
  if (typeof rawFinalAnswer === 'string') {
    rawFinalAnswer = fixLatexInText(rawFinalAnswer).replace(/\s+/g, ' ').trim()
  } else {
    rawFinalAnswer = ''
  }

  const plainFinalAnswer = latexToPlainText(rawFinalAnswer)
  const displayFinalAnswer = plainFinalAnswer || rawFinalAnswer || t('resultUnavailable')
  const showLatexNotation = rawFinalAnswer && plainFinalAnswer !== rawFinalAnswer

  // Nettoyer le problème pour l'affichage (retirer les délimiteurs \[ \] s'ils sont présents)
  const displayProblem = typeof problem === 'string' ? fixLatexInText(problem.replace(/^\\\[|\\\]$/g, '').trim()) : problem;

  return (
    <div className="space-y-6">
      {/* En-tête avec actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
          {t('solutionTitle')}
        </h2>
        <div className="flex gap-3">
          <button
            onClick={handleExportPDF}
            className="px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm font-medium flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            {t('exportPDF')}
          </button>
          <button
            onClick={onReset}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            {t('newProblem')}
          </button>
        </div>
      </div>

      {/* Contenu exportable */}
      <div ref={contentRef} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 sm:p-8 border border-gray-100 dark:border-gray-700">
        
        {/* Problème original */}
        <div className="mb-8 pb-6 border-b border-gray-100 dark:border-gray-700">
          <h3 className="text-sm uppercase tracking-wider text-gray-500 dark:text-gray-400 font-semibold mb-3">
            {t('problemSection')}
          </h3>
          <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 overflow-x-auto">
            <BlockMath math={displayProblem} />
          </div>
        </div>

        {/* Étapes de résolution */}
        {explanation.steps && explanation.steps.length > 0 ? (
          <div className="space-y-8">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center text-xs">
                {explanation.steps.length}
              </span>
              {t('stepsTitle')}
            </h3>
            
            <div className="relative border-l-2 border-blue-100 dark:border-blue-900/30 ml-3 space-y-8 pl-6 pb-2">
              {explanation.steps.map((step, index) => (
                <div key={index} className="relative">
                  {/* Point sur la ligne temporelle */}
                  <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-white dark:bg-gray-800 border-2 border-blue-500 z-10"></div>
                  
                  <div className="space-y-3">
                    <div className="flex items-baseline gap-3">
                      <h4 className="text-base font-semibold text-gray-800 dark:text-gray-200">
                        {t('step')} {step.step_number}
                      </h4>
                    </div>

                    <div className="text-gray-600 dark:text-gray-300 leading-relaxed">
                      <StepDescription description={step.description} />
                    </div>

                    {step.latex && (
                      <div className="my-3 bg-blue-50/50 dark:bg-blue-900/10 rounded-lg p-3 overflow-x-auto border border-blue-100 dark:border-blue-900/20">
                         <div className="text-blue-900 dark:text-blue-100">
                          <BlockMath math={fixLatexInText(step.latex)} />
                         </div>
                      </div>
                    )}

                    {step.explanation && (
                      <p className="text-sm text-gray-500 dark:text-gray-400 italic bg-gray-50 dark:bg-gray-900/50 p-3 rounded-lg">
                        <span className="font-medium not-italic mr-1">{t('note')}:</span>
                        {step.explanation}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            {t('noSteps')}
            {explanation.raw_text && (
               <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-900 rounded text-left text-sm font-mono overflow-x-auto whitespace-pre-wrap">
                 {explanation.raw_text}
               </div>
            )}
            {explanation.type && (
              <span className="block mt-2">
                Type: {explanation.type || 'N/A'}, Méthode: {explanation.method || 'N/A'}
              </span>
            )}
          </div>
        )}

        {/* Réponse finale */}
        <div className="mt-8 pt-8 border-t border-gray-100 dark:border-gray-700">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-4">
            {t('finalAnswer')}
          </h3>
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/10 rounded-xl p-6 border border-green-100 dark:border-green-800/30 shadow-sm">
            <div className="text-center space-y-4">
              <p className="text-2xl font-semibold text-green-900 dark:text-green-100">
                {displayFinalAnswer}
              </p>

              {showLatexNotation && (
                <div className="bg-white/70 dark:bg-white/5 border border-green-100/60 dark:border-green-800/40 rounded-lg p-4">
                  <p className="text-xs uppercase tracking-wider text-green-700 dark:text-green-300 mb-2 font-semibold">
                    {t('mathNotation')}
                  </p>
                  <div className="text-green-900 dark:text-green-100">
                    <BlockMath math={rawFinalAnswer} />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Résumé (si disponible) */}
        {explanation.summary && (
          <div className="mt-8">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-3">
              {t('summary')}
            </h3>
            <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-6 border border-gray-100 dark:border-gray-700">
              <div className="text-base text-gray-700 dark:text-gray-300">
                <StepDescription description={explanation.summary} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Chat interactif pour questions de suivi */}
      <ChatInterface problem={problem} solution={solution} />
    </div>
  )
}

export default SolutionDisplay
