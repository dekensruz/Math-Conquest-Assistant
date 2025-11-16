# 🔧 Solution Rapide - Erreur Rust/Cargo

## ✅ Solution Immédiate (Windows)

### Étape 1 : Aller dans le dossier backend
```powershell
cd backend
```

### Étape 2 : Activer l'environnement virtuel
```powershell
venv\Scripts\activate
```
Vous devriez voir `(venv)` au début de votre ligne de commande.

### Étape 3 : Mettre à jour pip
```powershell
python -m pip install --upgrade pip
```

### Étape 4 : Installer les dépendances UNE PAR UNE
Cela évite les problèmes de compilation Rust :

```powershell
pip install fastapi
pip install uvicorn
pip install python-multipart
pip install python-dotenv
pip install openai
pip install requests
pip install pydantic
```

### Étape 5 : Vérifier l'installation
```powershell
python -c "import fastapi; print('✅ FastAPI installé !')"
python -c "import uvicorn; print('✅ Uvicorn installé !')"
```

### Étape 6 : Créer le fichier .env
Créez un fichier nommé `.env` dans le dossier `backend/` avec ce contenu :

```env
OPENAI_API_KEY=QJfMX9UVq5VVhxyamx7oWeL7i05oM2OmGQkEYvh3s49I3SXP0HbYOS4YrJQfg87g41BJ24A7YTHWGQL7L
WOLFRAM_APP_ID=your_wolfram_app_id_here
```

### Étape 7 : Lancer le backend
```powershell
python main.py
```

Vous devriez voir :
```
INFO:     Uvicorn running on http://0.0.0.0:8000
```

## 🚀 Alternative : Utiliser le Script Automatique

Si vous préférez, utilisez le script automatique :

```powershell
cd backend
venv\Scripts\activate
install_dependencies.bat
```

## ❓ Pourquoi cette erreur ?

L'erreur "Cargo/Rust not installed" apparaît quand pip essaie de compiler certaines extensions Python qui nécessitent Rust. En installant les packages un par un, pip utilise généralement des versions pré-compilées (wheels) qui ne nécessitent pas de compilation.

## 📚 Plus d'aide

Voir `TROUBLESHOOTING.md` pour d'autres solutions et problèmes courants.

