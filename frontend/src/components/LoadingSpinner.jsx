/**
 * Composant de chargement réutilisable
 * Affiche un spinner animé
 */
function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center py-8">
      <div className="relative">
        <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    </div>
  )
}

export default LoadingSpinner

