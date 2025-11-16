# 🔧 Guide de Dépannage

## ❌ Erreur : "Cargo, the Rust package manager, is not installed"

### Problème
Certaines dépendances Python nécessitent Rust pour compiler des extensions, ce qui peut causer des erreurs d'installation.

### Solutions

#### Solution 1 : Utiliser des wheels pré-compilées (Recommandé)

```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
# ou
source venv/bin/activate  # Linux/Mac

# Mettre à jour pip d'abord
python -m pip install --upgrade pip

# Installer les dépendances une par une
pip install fastapi
pip install uvicorn
pip install python-multipart
pip install python-dotenv
pip install openai
pip install requests
pip install pydantic
```

#### Solution 2 : Utiliser requirements-simple.txt

```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows

# Mettre à jour pip
python -m pip install --upgrade pip

# Installer avec le fichier simplifié
pip install -r requirements-simple.txt
```

#### Solution 3 : Installer Rust (si vous voulez compiler)

1. Téléchargez Rust depuis https://rustup.rs/
2. Installez Rust
3. Redémarrez votre terminal
4. Réessayez : `pip install -r requirements.txt`

#### Solution 4 : Utiliser uvicorn sans [standard]

Si `uvicorn[standard]` pose problème, utilisez simplement `uvicorn` :

```bash
pip install uvicorn
# Au lieu de uvicorn[standard]
```

## ❌ Erreur : "ModuleNotFoundError: No module named 'fastapi'"

### Problème
Les modules Python ne sont pas installés ou l'environnement virtuel n'est pas activé.

### Solutions

#### Vérifier que l'environnement virtuel est activé

**Windows :**
```bash
cd backend
venv\Scripts\activate
# Vous devriez voir (venv) au début de votre ligne de commande
```

**Linux/Mac :**
```bash
cd backend
source venv/bin/activate
# Vous devriez voir (venv) au début de votre ligne de commande
```

#### Réinstaller les dépendances

```bash
# Assurez-vous que l'environnement virtuel est activé
pip install --upgrade pip
pip install -r requirements-simple.txt
```

#### Vérifier l'installation

```bash
python -c "import fastapi; print('FastAPI installé !')"
```

## ❌ Erreur lors de l'exécution du backend

### Vérifier que vous êtes dans le bon répertoire

```bash
cd backend
python main.py
```

### Vérifier que le fichier .env existe

Créez `backend/.env` avec :
```env
OPENAI_API_KEY=QJfMX9UVq5VVhxyamx7oWeL7i05oM2OmGQkEYvh3s49I3SXP0HbYOS4YrJQfg87g41BJ24A7YTHWGQL7L
WOLFRAM_APP_ID=your_wolfram_app_id_here
```

## ✅ Installation Pas à Pas (Windows)

```powershell
# 1. Aller dans le dossier backend
cd backend

# 2. Créer l'environnement virtuel
python -m venv venv

# 3. Activer l'environnement virtuel
venv\Scripts\activate

# 4. Mettre à jour pip
python -m pip install --upgrade pip

# 5. Installer les dépendances une par une (évite les problèmes de compilation)
pip install fastapi
pip install uvicorn
pip install python-multipart
pip install python-dotenv
pip install openai
pip install requests
pip install pydantic

# 6. Vérifier l'installation
python -c "import fastapi; print('✅ FastAPI installé !')"

# 7. Créer le fichier .env (voir backend/ENV_SETUP.txt)

# 8. Lancer le backend
python main.py
```

## 🔍 Vérifications Utiles

### Vérifier la version de Python
```bash
python --version
# Doit être Python 3.9 ou supérieur
```

### Vérifier que pip est à jour
```bash
python -m pip install --upgrade pip
```

### Lister les packages installés
```bash
pip list
```

### Désinstaller et réinstaller
```bash
pip uninstall fastapi uvicorn -y
pip install fastapi uvicorn
```

## 📞 Besoin d'aide ?

Si les problèmes persistent :
1. Vérifiez que Python 3.9+ est installé
2. Assurez-vous que l'environnement virtuel est activé
3. Essayez d'installer les packages un par un pour identifier celui qui pose problème
4. Utilisez `requirements-simple.txt` au lieu de `requirements.txt`

