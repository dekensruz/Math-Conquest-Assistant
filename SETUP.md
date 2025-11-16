# 🚀 Guide de Configuration Rapide

## Configuration du Backend

1. **Créer le fichier `.env` dans le dossier `backend/`** :

```bash
cd backend
```

Créez un fichier `.env` avec le contenu suivant :

```env
OPENAI_API_KEY=QJfMX9UVq5VVhxyamx7oWeL7i05oM2OmGQkEYvh3s49I3SXP0HbYOS4YrJQfg87g41BJ24A7YTHWGQL7L
WOLFRAM_APP_ID=your_wolfram_app_id_here
```

> **Note** : La clé OpenAI est déjà fournie. Pour WolframAlpha, vous pouvez obtenir une clé gratuite sur [https://products.wolframalpha.com/api/](https://products.wolframalpha.com/api/)

2. **Installer les dépendances Python** :

```bash
python -m venv venv
# Windows
venv\Scripts\activate
# Linux/Mac
source venv/bin/activate

pip install -r requirements.txt
```

3. **Lancer le backend** :

```bash
python main.py
```

Le backend sera accessible sur `http://localhost:8000`

## Configuration du Frontend

1. **Installer les dépendances** :

```bash
cd frontend
npm install
```

2. **Lancer le frontend** :

```bash
npm run dev
```

Le frontend sera accessible sur `http://localhost:5173`

## ✅ Vérification

Ouvrez votre navigateur sur `http://localhost:5173` et testez l'upload d'une image de problème mathématique !

