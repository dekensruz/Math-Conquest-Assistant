# 🔧 Solution : Erreur "Failed to fetch"

## ❌ Problème

Quand vous uploadez une image, vous obtenez l'erreur "Failed to fetch".

## ✅ Solutions

### Solution 1 : Vérifier que le backend est lancé

**Le backend doit être en cours d'exécution !**

1. Ouvrez un terminal
2. Allez dans le dossier backend :
   ```powershell
   cd backend
   venv\Scripts\activate
   python main.py
   ```

3. Vous devriez voir :
   ```
   INFO:     Uvicorn running on http://0.0.0.0:8000
   ```

### Solution 2 : Vérifier les ports

- **Backend** : Doit être sur le port `8000`
- **Frontend** : Doit être sur le port `5173`

### Solution 3 : Vérifier la console du navigateur

Ouvrez la console du navigateur (F12) et vérifiez les erreurs :
- Si vous voyez "CORS error" → Le backend n'est pas lancé ou CORS mal configuré
- Si vous voyez "Network error" → Le backend n'est pas accessible

### Solution 4 : Redémarrer les serveurs

1. **Arrêter** le frontend (Ctrl+C)
2. **Arrêter** le backend (Ctrl+C)
3. **Relancer** le backend :
   ```powershell
   cd backend
   venv\Scripts\activate
   python main.py
   ```
4. **Relancer** le frontend (dans un autre terminal) :
   ```powershell
   cd frontend
   npm run dev
   ```

## 🔍 Vérification Rapide

Testez si le backend répond :
1. Ouvrez votre navigateur
2. Allez sur : `http://localhost:8000/`
3. Vous devriez voir : `{"message":"Math Assistant API is running","status":"ok"}`

Si vous ne voyez rien, le backend n'est **pas lancé**.

## 📝 Note

Les URLs ont été mises à jour pour utiliser le proxy Vite (`/api/...` au lieu de `http://localhost:8000/api/...`). Cela devrait résoudre les problèmes de connexion.

