# 📐 Math Conquest Assistant

Application web complète pour résoudre et expliquer des problèmes mathématiques étape par étape. Prenez une photo d'un problème, obtenez une solution détaillée avec explications pédagogiques, et discutez avec l'IA pour mieux comprendre.

![Math Conquest Assistant](https://img.shields.io/badge/Math-Assistant-blue) ![React](https://img.shields.io/badge/React-18-61DAFB) ![FastAPI](https://img.shields.io/badge/FastAPI-Python-009688) ![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4-412991)

## ✨ Fonctionnalités

- 📷 **Upload d'image ou capture photo** - Prenez une photo de votre problème mathématique (mobile-friendly)
- 🔍 **Extraction LaTeX automatique** - Via OpenAI Vision API pour reconnaître les formules
- 🧮 **Résolution exacte** - Via WolframAlpha API pour obtenir la réponse précise
- 📚 **Explications pédagogiques** - Explications étape par étape générées par OpenAI LLM
- 💬 **Chat interactif** - Widget de chat flottant pour poser des questions sur la solution
- 📄 **Export PDF** - Exportez la solution complète en PDF avec formules mathématiques nettes
- 📱 **Interface responsive** - Design mobile-first avec Tailwind CSS
- 🌍 **Multilingue** - Support français et anglais
- 📊 **Historique** - Sauvegarde automatique de vos problèmes résolus

## 🚀 Démarrage rapide

### Prérequis

- Python 3.8+
- Node.js 16+
- Clés API :
  - OpenAI API Key
  - WolframAlpha App ID (optionnel)

### Installation

1. **Cloner le repository**
```bash
git clone https://github.com/votre-username/math-conquest-assistant.git
cd math-conquest-assistant
```

2. **Configurer le backend**

```bash
cd backend
pip install -r requirements.txt
```

Créer un fichier `.env` dans le dossier `backend` :
```env
OPENAI_API_KEY=votre_clé_openai
WOLFRAM_APP_ID=votre_app_id_wolfram
```

3. **Configurer le frontend**

```bash
cd frontend
npm install
```

4. **Lancer l'application**

**Backend** (dans `backend/`) :
```bash
python main.py
```

**Frontend** (dans `frontend/`) :
```bash
npm run dev
```

L'application sera accessible sur `http://localhost:5173`

## 🛠️ Stack technique

### Frontend
- **React 18** - Framework UI
- **Vite** - Build tool ultra-rapide
- **Tailwind CSS** - Framework CSS utility-first
- **KaTeX** - Rendu des formules mathématiques LaTeX
- **jsPDF + html2canvas** - Export PDF

### Backend
- **FastAPI** - Framework web Python moderne
- **OpenAI API** - Vision API pour extraction LaTeX + Chat API pour explications
- **WolframAlpha API** - Résolution mathématique exacte
- **Python 3.8+** - Langage backend

## 📁 Structure du projet

```
Math-Conquest-Assistant/
├── backend/
│   ├── main.py              # API FastAPI principale
│   ├── requirements.txt     # Dépendances Python
│   └── .env                 # Variables d'environnement (à créer)
├── frontend/
│   ├── src/
│   │   ├── components/      # Composants React
│   │   ├── contexts/        # Contextes (Theme, Language)
│   │   └── utils/           # Utilitaires
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## 🎯 Utilisation

1. **Uploader une image** : Cliquez sur la zone de drop ou utilisez le bouton "Prendre une photo"
2. **Vérifier l'extraction** : L'application extrait automatiquement le LaTeX de l'image
3. **Résoudre** : Cliquez sur "Résoudre" pour obtenir la solution complète
4. **Discuter** : Utilisez le widget de chat flottant pour poser des questions
5. **Exporter** : Téléchargez la solution en PDF

## 🌐 Déploiement

### Frontend (Vercel)

1. Connectez votre repository GitHub à Vercel
2. Configurez les variables d'environnement :
   - `VITE_API_BASE_URL` : URL de votre backend (ex: `https://votre-backend.onrender.com`)
3. Déployez !

### Backend (Render)

1. Créez un nouveau Web Service sur Render
2. Connectez votre repository GitHub
3. Configurez :
   - **Build Command** : `pip install -r requirements.txt`
   - **Start Command** : `uvicorn main:app --host 0.0.0.0 --port $PORT`
4. Ajoutez les variables d'environnement :
   - `OPENAI_API_KEY`
   - `WOLFRAM_APP_ID`
5. Mettez à jour le CORS dans `main.py` avec votre URL Vercel

## 📝 API Endpoints

### `POST /api/extract-latex`
Extrait le LaTeX d'une image
- **Body** : `FormData` avec fichier image
- **Response** : `{ "success": true, "latex": "..." }`

### `POST /api/solve`
Résout un problème mathématique
- **Body** : `{ "latex": "...", "language": "fr" }`
- **Response** : `{ "success": true, "explanation": {...}, "wolfram_result": {...} }`

### `POST /api/chat`
Chat interactif sur une solution
- **Body** : `{ "problem": "...", "solution": {...}, "question": "...", "language": "fr", "history": [...] }`
- **Response** : `{ "success": true, "answer": "..." }`

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou soumettre une pull request.

## 📄 Licence

Ce projet est sous licence MIT.

## 👤 Équipe & Contributeurs

Ce projet est réalisé par une équipe dédiée. Voir [ASSIGNMENTS.md](./ASSIGNMENTS.md) pour les rôles détaillés.
- Dekens (Frontend Lead)
- Israël (DB)
- Thibaut (Auth)
- Verbeck & Sarah (Onboarding)

## 🙏 Remerciements

- OpenAI pour l'API Vision et Chat
- WolframAlpha pour l'API de résolution mathématique
- La communauté open-source pour les outils utilisés

---

⭐ Si ce projet vous a aidé, n'hésitez pas à lui donner une étoile !

