import { BlockMath, InlineMath } from 'react-katex'
import 'katex/dist/katex.min.css'
import { useEffect, useRef } from 'react'
import jsPDF from 'jspdf'
import ChatInterface from './ChatInterface'

/**
 * Composant pour afficher la solution complète avec explications étape par étape
 * Inclut l'export PDF
 */
function SolutionDisplay({ problem, solution, onReset }) {
  const contentRef = useRef(null)

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

        pdf.save('solution-mathematique.pdf')
      }).catch((error) => {
        console.error('Erreur lors de la génération du PDF:', error)
        alert('Erreur lors de la génération du PDF. Veuillez réessayer.')
      })
    })
  }

  // Parser l'explication (peut être un objet JSON ou une string)
  const explanation = solution.explanation || {}
  const steps = explanation.steps || []
  const finalAnswer = explanation.final_answer || solution.wolfram_result?.result || 'Non disponible'

  return (
    <div className="space-y-6">
      {/* En-tête avec actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
          Solution complète
        </h2>
        <div className="flex gap-3">
          <button
            onClick={handleExportPDF}
            className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors text-sm sm:text-base"
          >
            📄 Télécharger en PDF
          </button>
          <button
            onClick={onReset}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors text-sm sm:text-base"
          >
            🔄 Nouveau problème
          </button>
        </div>
      </div>

      {/* Contenu de la solution (pour export PDF) */}
      <div ref={contentRef} className="bg-white rounded-lg shadow-md p-6 sm:p-8 space-y-6">
        {/* Problème original */}
        <section>
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3">
            Problème
          </h3>
          <div className="bg-gray-50 rounded-lg p-4 sm:p-6">
            <BlockMath math={problem} />
          </div>
        </section>

        {/* Type de problème et méthode */}
        {(explanation.type || explanation.method) && (
          <section>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3">
              Analyse
            </h3>
            <div className="bg-blue-50 rounded-lg p-4 sm:p-6 space-y-2">
              {explanation.type && (
                <p className="text-base sm:text-lg">
                  <span className="font-semibold">Type:</span> {explanation.type}
                </p>
              )}
              {explanation.method && (
                <p className="text-base sm:text-lg">
                  <span className="font-semibold">Méthode:</span> {explanation.method}
                </p>
              )}
            </div>
          </section>
        )}

        {/* Étapes de résolution */}
        {steps.length > 0 && (
          <section>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">
              Étapes de résolution
            </h3>
            <div className="space-y-4">
              {steps.map((step, index) => (
                <div
                  key={index}
                  className="border-l-4 border-blue-500 pl-4 sm:pl-6 py-3 bg-gray-50 rounded-r-lg"
                >
                  <div className="flex items-start gap-3 mb-2">
                    <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold text-sm">
                      {step.step_number || index + 1}
                    </span>
                    <div className="flex-1">
                      {step.description && (
                        <p className="text-base sm:text-lg text-gray-800 mb-2">
                          {step.description}
                        </p>
                      )}
                      {step.latex && (
                        <div className="bg-white rounded p-3 mb-2">
                          <BlockMath math={step.latex} />
                        </div>
                      )}
                      {step.explanation && (
                        <p className="text-sm sm:text-base text-gray-600 italic">
                          💡 {step.explanation}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Réponse finale */}
        <section>
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3">
            Réponse finale
          </h3>
          <div className="bg-green-50 rounded-lg p-4 sm:p-6 border-2 border-green-200">
            <div className="text-center">
              <BlockMath math={finalAnswer} />
            </div>
          </div>
        </section>

        {/* Résumé (si disponible) */}
        {explanation.summary && (
          <section>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3">
              Résumé
            </h3>
            <div className="bg-gray-50 rounded-lg p-4 sm:p-6">
              <p className="text-base sm:text-lg text-gray-800">
                {explanation.summary}
              </p>
            </div>
          </section>
        )}
      </div>

      {/* Chat interactif pour questions de suivi */}
      <ChatInterface problem={problem} solution={solution} />
    </div>
  )
}

export default SolutionDisplay

