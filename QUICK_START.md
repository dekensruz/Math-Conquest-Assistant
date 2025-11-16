# ⚡ Démarrage Rapide

## 🎯 En 5 minutes

### 1. Configuration Backend (2 min)

```bash
cd backend

# Créer l'environnement virtuel
python -m venv venv

# Activer (Windows)
venv\Scripts\activate

# Activer (Linux/Mac)
source venv/bin/activate

# Installer les dépendances
# Option 1: Script automatique (Windows)
install_dependencies.bat

# Option 2: Script automatique (Linux/Mac)
# chmod +x install_dependencies.sh
# ./install_dependencies.sh

# Option 3: Manuel (si problèmes avec Rust)
pip install --upgrade pip
pip install fastapi uvicorn python-multipart python-dotenv openai requests pydantic

# Créer le fichier .env
# Copiez le contenu suivant dans backend/.env :
```

**Contenu de `backend/.env`** :
```env
OPENAI_API_KEY=QJfMX9UVq5VVhxyamx7oWeL7i05oM2OmGQkEYvh3s49I3SXP0HbYOS4YrJQfg87g41BJ24A7YTHWGQL7L
WOLFRAM_APP_ID=your_wolfram_app_id_here
```

### 2. Configuration Frontend (1 min)

```bash
cd frontend
npm install
```

### 3. Lancer l'Application (2 min)

**Terminal 1 - Backend** :
```bash
cd backend
python main.py
```

**Terminal 2 - Frontend** :
```bash
cd frontend
npm run dev
```

### 4. Utiliser l'Application

1. Ouvrez `http://localhost:5173` dans votre navigateur
2. Uploadez une image de problème mathématique
3. Vérifiez le LaTeX extrait
4. Cliquez sur "Résoudre"
5. Consultez la solution étape par étape
6. Téléchargez en PDF si besoin

## ✅ Vérification

- ✅ Backend accessible sur `http://localhost:8000`
- ✅ Frontend accessible sur `http://localhost:5173`
- ✅ Pas d'erreurs dans les terminaux

## 🐛 Problèmes Courants

### Erreur "Cargo/Rust not installed"
Utilisez le script `install_dependencies.bat` (Windows) ou installez les packages un par un :
```bash
pip install fastapi uvicorn python-multipart python-dotenv openai requests pydantic
```

Voir `TROUBLESHOOTING.md` pour plus de détails.

### Erreur "Module not found"
```bash
# Backend
pip install -r requirements.txt

# Frontend
npm install
```

### Erreur CORS
Vérifiez que le backend autorise `http://localhost:5173` (déjà configuré)

### Erreur OpenAI
Vérifiez que la clé API dans `.env` est correcte

## 📚 Documentation Complète

Voir `README.md` pour plus de détails.

