import { useRef, useState } from 'react'

/**
 * Composant pour l'upload d'image (fichier ou caméra)
 * Mobile-first avec support de la caméra
 */
function ImageUpload({ onImageUpload }) {
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

  /**
   * Gère la capture depuis la caméra (mobile)
   */
  const handleCameraCapture = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.capture = 'environment' // Utilise la caméra arrière sur mobile
    input.onchange = (e) => {
      if (e.target.files && e.target.files[0]) {
        handleFileSelect(e.target.files[0])
      }
    }
    input.click()
  }

  return (
    <div className="w-full">
      <div
        className={`
          relative border-2 border-dashed rounded-lg p-8 sm:p-12
          transition-colors duration-200
          ${dragActive 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 bg-white hover:border-gray-400'
          }
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
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

        <div className="text-center">
          {/* Icône */}
          <div className="mx-auto flex items-center justify-center h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-gray-100 mb-4">
            <svg
              className="h-8 w-8 sm:h-10 sm:w-10 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>

          {/* Texte principal */}
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
            Prenez une photo ou uploadez une image
          </h3>
          <p className="text-sm sm:text-base text-gray-600 mb-6">
            Glissez-déposez une image ici, ou cliquez pour sélectionner
          </p>

          {/* Boutons d'action */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={handleButtonClick}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm sm:text-base"
            >
              📁 Choisir un fichier
            </button>
            <button
              onClick={handleCameraCapture}
              className="px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors text-sm sm:text-base"
            >
              📷 Prendre une photo
            </button>
          </div>

          {/* Preview de l'image */}
          {preview && (
            <div className="mt-6">
              <img
                src={preview}
                alt="Preview"
                className="max-w-full h-auto max-h-64 mx-auto rounded-lg shadow-md"
              />
            </div>
          )}
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-4 text-center text-sm text-gray-500">
        <p>Formats supportés: JPG, PNG, WebP</p>
        <p className="mt-1">Assurez-vous que l'image soit nette et bien éclairée</p>
      </div>
    </div>
  )
}

export default ImageUpload

