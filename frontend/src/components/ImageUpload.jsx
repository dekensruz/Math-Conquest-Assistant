import { useRef, useState } from 'react'
import { useLanguage } from '../contexts/LanguageContext'

/**
 * Composant pour l'upload d'image (fichier ou caméra)
 * Mobile-first avec support de la caméra - Redesign Moderne
 */
function ImageUpload({ onImageUpload }) {
  const { t } = useLanguage()
  const fileInputRef = useRef(null)
  const [dragActive, setDragActive] = useState(false)
  const [preview, setPreview] = useState(null)

  /**
   * Gère la sélection de fichier
   */
  const handleFileSelect = (file) => {
    if (file && file.type.startsWith('image/')) {
      // Créer une preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result)
      }
      reader.readAsDataURL(file)
      
      onImageUpload(file)
    } else {
      alert('Veuillez sélectionner une image valide')
    }
  }

  /**
   * Gère le clic sur le bouton d'upload
   */
  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  /**
   * Gère le drag and drop
   */
  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  /**
   * Gère le drop de fichier
   */
  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0])
    }
  }

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div
        className={`
          relative group cursor-pointer
          border-2 border-dashed rounded-2xl p-10 sm:p-16
          transition-all duration-300 ease-out
          ${dragActive 
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 scale-[1.02]' 
            : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-gray-50 dark:hover:bg-gray-700/50'
          }
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={handleButtonClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              handleFileSelect(e.target.files[0])
            }
          }}
        />

        <div className="flex flex-col items-center justify-center text-center space-y-6">
          {/* Animated Icon Container */}
          <div className={`
            w-20 h-20 rounded-2xl flex items-center justify-center
            transition-all duration-500
            ${dragActive 
              ? 'bg-blue-600 text-white rotate-12 scale-110 shadow-lg shadow-blue-500/30' 
              : 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 group-hover:scale-110 group-hover:rotate-3'
            }
          `}>
            <svg 
              className="w-10 h-10 transition-transform duration-500" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>

          <div className="space-y-2">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white transition-colors">
              {t('uploadTitle')}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
              Glissez-déposez votre fichier ici, ou <span className="text-blue-600 dark:text-blue-400 font-medium border-b border-blue-600/30 hover:border-blue-600 transition-colors">parcourez vos dossiers</span>
            </p>
          </div>

          {/* Format Badges */}
          <div className="flex items-center gap-2 text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider">
            <span className="px-2 py-1 rounded bg-gray-100 dark:bg-gray-700">JPG</span>
            <span className="px-2 py-1 rounded bg-gray-100 dark:bg-gray-700">PNG</span>
            <span className="px-2 py-1 rounded bg-gray-100 dark:bg-gray-700">WEBP</span>
          </div>
        </div>

        {/* Preview Overlay */}
        {preview && (
          <div className="absolute inset-0 z-10 bg-white dark:bg-gray-800 rounded-2xl flex flex-col items-center justify-center p-4">
            <img
              src={preview}
              alt="Preview"
              className="max-w-full max-h-[80%] rounded-lg shadow-lg object-contain mb-4"
            />
            <p className="text-sm font-medium text-blue-600 dark:text-blue-400 animate-pulse">
              Traitement en cours...
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ImageUpload

