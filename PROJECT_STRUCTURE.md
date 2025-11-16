# 📁 Structure du Projet Math Assistant

```
Conquest Math Assistant/
│
├── backend/                          # Backend FastAPI
│   ├── main.py                      # API principale avec endpoints
│   ├── requirements.txt             # Dépendances Python
│   ├── test_flow.py                 # Script de test du flux complet
│   ├── .env                         # Variables d'environnement (à créer)
│   ├── .env.example                 # Exemple de .env
│   ├── .gitignore                   # Fichiers à ignorer
│   ├── .flake8                      # Configuration Flake8 (linting)
│   └── pyproject.toml               # Configuration Black (formatage)
│
├── frontend/                         # Frontend React + Vite
│   ├── src/
│   │   ├── App.jsx                  # Composant principal
│   │   ├── main.jsx                 # Point d'entrée React
│   │   ├── index.css                # Styles globaux + Tailwind
│   │   └── components/
│   │       ├── ImageUpload.jsx      # Upload/capture d'image
│   │       ├── ProblemDisplay.jsx    # Affichage du LaTeX extrait
│   │       ├── SolutionDisplay.jsx   # Affichage de la solution complète
│   │       ├── LoadingSpinner.jsx    # Spinner de chargement
│   │       └── ErrorMessage.jsx      # Messages d'erreur
│   ├── index.html                   # HTML de base
│   ├── package.json                  # Dépendances npm
│   ├── vite.config.js               # Configuration Vite
│   ├── tailwind.config.js           # Configuration Tailwind CSS
│   ├── postcss.config.js            # Configuration PostCSS
│   ├── .eslintrc.cjs                # Configuration ESLint
│   └── .gitignore                   # Fichiers à ignorer
│
├── README.md                         # Documentation principale
├── SETUP.md                          # Guide de configuration rapide
├── IMPROVEMENTS.md                   # Suggestions d'améliorations
├── PROJECT_STRUCTURE.md               # Ce fichier
├── start.bat                         # Script de démarrage Windows
├── start.sh                          # Script de démarrage Linux/Mac
└── .gitignore                        # Git ignore global
```

## 🔄 Flux de Données

```
1. Utilisateur upload une image
   ↓
2. Frontend → POST /api/extract-latex
   ↓
3. Backend → OpenAI Vision API
   ↓
4. Backend retourne LaTeX extrait
   ↓
5. Frontend affiche le LaTeX (confirmation utilisateur)
   ↓
6. Utilisateur clique "Résoudre"
   ↓
7. Frontend → POST /api/solve {latex: "..."}
   ↓
8. Backend → WolframAlpha API (résolution)
   ↓
9. Backend → OpenAI Chat API (explication)
   ↓
10. Backend retourne solution complète
   ↓
11. Frontend affiche solution étape par étape
   ↓
12. Utilisateur peut exporter en PDF
```

## 🛠️ Technologies Utilisées

### Backend
- **FastAPI** : Framework web asynchrone
- **OpenAI** : Vision API + Chat API
- **WolframAlpha** : API de résolution mathématique
- **Python-dotenv** : Gestion des variables d'environnement
- **Uvicorn** : Serveur ASGI

### Frontend
- **React 18** : Bibliothèque UI
- **Vite** : Build tool et dev server
- **Tailwind CSS** : Framework CSS utility-first
- **KaTeX** : Rendu des formules mathématiques
- **jsPDF** : Génération de PDF
- **html2canvas** : Capture d'écran pour PDF

## 📝 Endpoints API

### `GET /`
- **Description** : Vérification de santé de l'API
- **Réponse** : `{"message": "Math Assistant API is running", "status": "ok"}`

### `POST /api/extract-latex`
- **Description** : Extrait le LaTeX d'une image
- **Body** : `FormData` avec fichier image
- **Réponse** : `{"success": true, "latex": "..."}`

### `POST /api/solve`
- **Description** : Résout un problème et génère une explication
- **Body** : `{"latex": "..."}`
- **Réponse** : `{"success": true, "problem": "...", "wolfram_result": {...}, "explanation": {...}}`

## 🔐 Variables d'Environnement

### Backend (.env)
```env
OPENAI_API_KEY=your_key_here
WOLFRAM_APP_ID=your_app_id_here
```

## 📦 Installation des Dépendances

### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # ou venv\Scripts\activate sur Windows
pip install -r requirements.txt
```

### Frontend
```bash
cd frontend
npm install
```

## 🚀 Démarrage

### Méthode 1 : Scripts automatiques
- **Windows** : `start.bat`
- **Linux/Mac** : `./start.sh`

### Méthode 2 : Manuel
1. Terminal 1 (Backend) :
   ```bash
   cd backend
   python main.py
   ```

2. Terminal 2 (Frontend) :
   ```bash
   cd frontend
   npm run dev
   ```

## 🧪 Tests

```bash
cd backend
python test_flow.py
```

## 📄 Documentation Additionnelle

- **README.md** : Documentation complète
- **SETUP.md** : Guide de configuration rapide
- **IMPROVEMENTS.md** : Suggestions d'améliorations

