# 📐 Math Assistant

Application web complète pour résoudre et expliquer des problèmes mathématiques étape par étape.

## 🎯 Fonctionnalités

- **📷 Upload d'image** : Prenez une photo ou uploadez une image de votre problème mathématique
- **🔍 Extraction LaTeX** : Utilise OpenAI Vision API pour extraire le contenu mathématique et le convertir en LaTeX
- **🧮 Résolution** : Résout le problème via WolframAlpha API pour obtenir une solution exacte
- **📚 Explication pédagogique** : Génère une explication étape par étape via OpenAI LLM
- **📄 Export PDF** : Téléchargez la solution complète en PDF
- **📱 Mobile-First** : Interface responsive optimisée pour mobile

## 🛠️ Technologies

### Frontend
- **React 18** + **Vite** - Framework et build tool
- **Tailwind CSS** - Styling
- **KaTeX** - Rendu des formules mathématiques LaTeX
- **jsPDF** + **html2canvas** - Export PDF
- **Axios** - Requêtes HTTP

### Backend
- **FastAPI** - Framework Python asynchrone
- **OpenAI API** - Vision (extraction LaTeX) + Chat (explications)
- **WolframAlpha API** - Résolution mathématique

## 📋 Prérequis

- **Node.js** 18+ et **npm** (ou **yarn**)
- **Python** 3.9+
- **Clé API OpenAI** (obligatoire)
- **Clé API WolframAlpha** (optionnelle, mais recommandée)

## 🚀 Installation

### 1. Cloner le projet

```bash
git clone <votre-repo>
cd "Conquest Math Assistant"
```

### 2. Configuration du Backend

```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate

# Linux/Mac
source venv/bin/activate

# Installer les dépendances
# Si vous rencontrez des erreurs de compilation Rust, utilisez requirements-simple.txt
pip install -r requirements.txt
# ou
pip install -r requirements-simple.txt
```

Créer un fichier `.env` dans le dossier `backend/` :

```env
OPENAI_API_KEY=votre_cle_openai_ici
WOLFRAM_APP_ID=votre_cle_wolfram_ici
```

> **Note** : Si vous n'avez pas de clé WolframAlpha, l'application fonctionnera quand même mais utilisera des résultats simulés.

### 3. Configuration du Frontend

```bash
cd frontend
npm install
```

## ▶️ Lancement

### Backend (Terminal 1)

```bash
cd backend
# Activer le venv si pas déjà fait
venv\Scripts\activate  # Windows
# ou
source venv/bin/activate  # Linux/Mac

python main.py
```

Le backend sera accessible sur `http://localhost:8000`

> **⚠️ Important** : Après chaque modification du fichier `main.py`, redémarrez le backend (Ctrl+C puis relancez `python main.py`) pour que les changements soient pris en compte.

### Frontend (Terminal 2)

```bash
cd frontend
npm run dev
```

Le frontend sera accessible sur `http://localhost:5173`

## 📖 Utilisation

1. **Ouvrez** `http://localhost:5173` dans votre navigateur
2. **Uploadez** ou **prenez une photo** de votre problème mathématique
3. **Vérifiez** le LaTeX extrait (corrigez si nécessaire)
4. **Cliquez** sur "Résoudre ce problème"
5. **Consultez** la solution étape par étape
6. **Téléchargez** en PDF si besoin

## 🧪 Test

Un script de test est disponible pour valider le flux complet :

```bash
cd backend
python test_flow.py
```

## 📁 Structure du Projet

```
Conquest Math Assistant/
├── backend/
│   ├── main.py              # API FastAPI principale
│   ├── requirements.txt     # Dépendances Python
│   ├── .env.example         # Exemple de variables d'environnement
│   └── test_flow.py         # Script de test
├── frontend/
│   ├── src/
│   │   ├── App.jsx          # Composant principal
│   │   ├── components/      # Composants React
│   │   │   ├── ImageUpload.jsx
│   │   │   ├── ProblemDisplay.jsx
│   │   │   ├── SolutionDisplay.jsx
│   │   │   ├── LoadingSpinner.jsx
│   │   │   └── ErrorMessage.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
└── README.md
```

## 🔧 Configuration

### Variables d'environnement

- `OPENAI_API_KEY` : **Obligatoire** - Clé API OpenAI
- `WOLFRAM_APP_ID` : **Optionnelle** - Clé API WolframAlpha

### Ports

- Frontend : `5173` (Vite par défaut)
- Backend : `8000` (FastAPI par défaut)

## 🎨 Amélioration "Wow" Suggérée

**💡 Chat interactif pour questions de suivi** : Après avoir résolu un problème, permettre à l'utilisateur de poser des questions supplémentaires sur la solution (ex: "Pourquoi cette étape ?", "Peux-tu donner un exemple similaire ?"). Cela transforme l'application en véritable tuteur mathématique interactif.

## 🐛 Dépannage

### Erreur CORS
Assurez-vous que le backend autorise les requêtes depuis `http://localhost:5173` (déjà configuré dans `main.py`).

### Erreur OpenAI
Vérifiez que votre clé API OpenAI est valide et que vous avez des crédits disponibles.

### Erreur WolframAlpha
Si vous n'avez pas de clé WolframAlpha, l'application utilisera des résultats simulés. Pour une meilleure expérience, obtenez une clé sur [WolframAlpha API](https://products.wolframalpha.com/api/).

## 📝 Bonnes Pratiques

- ✅ Code linté avec ESLint (frontend) et Flake8/Black (backend)
- ✅ Variables d'environnement pour les clés API
- ✅ Gestion d'erreurs complète
- ✅ Interface mobile-first
- ✅ Commentaires dans le code

## 📄 Licence

Ce projet est un projet éducatif.

## 👨‍💻 Auteur

**Dekens Ruzuba**

Développé dans le cadre de la "Vibe-code Conquest".

Portfolio : [https://portfoliodek.netlify.app/](https://portfoliodek.netlify.app/)

---

**Bon courage avec vos problèmes mathématiques ! 🚀**

