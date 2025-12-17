# 🔐 Spécifications Techniques - Authentification & Base de Données

## 📋 Vue d'ensemble

Ce document décrit les spécifications techniques pour l'implémentation de l'authentification et de la gestion de données dans l'application Math Conquest Assistant.

**🎯 Solution choisie : PostgreSQL ou MySQL**
- Base de données relationnelle robuste
- Contrôle total sur le schéma et les données
- Support pour les transactions
- Excellent pour les applications à croissance
- Choix entre PostgreSQL (recommandé) ou MySQL selon préférence

---

## 🗄️ Architecture de la Base de Données

### Choix Technologique
- **Base de données :** PostgreSQL (recommandé) ou MySQL
- **ORM :** SQLAlchemy (Python) - compatible avec les deux
- **Migrations :** Alembic (pour SQLAlchemy)
- **Avantages :**
  - Contrôle total sur le schéma
  - Support des transactions
  - Performance optimale
  - Scalabilité
  - Support JSON/JSONB (PostgreSQL) ou JSON (MySQL 5.7+)

### Schéma de Base de Données

#### Table `users`
```sql
-- PostgreSQL
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    email_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- MySQL
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    email_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
```

**Champs :**
- `id` : Identifiant unique
- `email` : Email de l'utilisateur (unique, utilisé pour la connexion)
- `password_hash` : Hash bcrypt du mot de passe
- `email_verified` : Email vérifié ou non
- `is_active` : Compte actif ou désactivé
- `created_at` : Date de création du compte
- `updated_at` : Date de dernière mise à jour

#### Table `user_profiles`
```sql
-- PostgreSQL
CREATE TABLE user_profiles (
    id SERIAL PRIMARY KEY,
    user_id INT UNIQUE NOT NULL,
    -- Données onboarding
    education_level VARCHAR(50),
    preferred_domains JSONB,
    learning_goals JSONB,
    difficulty_level VARCHAR(20),
    preferred_language VARCHAR(10) DEFAULT 'fr',
    -- Statut onboarding
    onboarding_completed BOOLEAN DEFAULT FALSE,
    onboarding_completed_at TIMESTAMP NULL,
    -- Préférences générales
    preferences JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- MySQL
CREATE TABLE user_profiles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT UNIQUE NOT NULL,
    -- Données onboarding
    education_level VARCHAR(50),
    preferred_domains JSON,
    learning_goals JSON,
    difficulty_level VARCHAR(20),
    preferred_language VARCHAR(10) DEFAULT 'fr',
    -- Statut onboarding
    onboarding_completed BOOLEAN DEFAULT FALSE,
    onboarding_completed_at TIMESTAMP NULL,
    -- Préférences générales
    preferences JSON DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX idx_user_profiles_onboarding ON user_profiles(onboarding_completed);
```

**Champs :**
- `id` : Identifiant unique
- `user_id` : Référence à l'utilisateur
- `education_level` : Niveau scolaire (primary, middle, high, university, self-taught)
- `preferred_domains` : Domaines mathématiques préférés (JSON array)
- `learning_goals` : Objectifs d'apprentissage (JSON array)
- `difficulty_level` : Niveau de difficulté préféré (beginner, intermediate, advanced, mixed)
- `preferred_language` : Langue préférée (fr, en)
- `onboarding_completed` : Onboarding complété ou non
- `onboarding_completed_at` : Date de complétion de l'onboarding
- `preferences` : Autres préférences utilisateur (JSON)
- `created_at` : Date de création
- `updated_at` : Date de dernière mise à jour

#### Table `problems`
```sql
-- PostgreSQL
CREATE TABLE problems (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    latex TEXT NOT NULL,
    image_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- MySQL
CREATE TABLE problems (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    latex TEXT NOT NULL,
    image_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_problems_user_id ON problems(user_id);
CREATE INDEX idx_problems_created_at ON problems(created_at);
```

**Champs :**
- `id` : Identifiant unique
- `user_id` : Référence à l'utilisateur propriétaire
- `latex` : LaTeX extrait du problème
- `image_url` : URL de l'image uploadée (optionnel)
- `created_at` : Date de création
- `updated_at` : Date de dernière mise à jour

#### Table `solutions`
```sql
-- PostgreSQL
CREATE TABLE solutions (
    id SERIAL PRIMARY KEY,
    problem_id INT NOT NULL,
    explanation JSONB NOT NULL,
    wolfram_result JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (problem_id) REFERENCES problems(id) ON DELETE CASCADE
);

-- MySQL
CREATE TABLE solutions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    problem_id INT NOT NULL,
    explanation JSON NOT NULL,
    wolfram_result JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (problem_id) REFERENCES problems(id) ON DELETE CASCADE
);

CREATE INDEX idx_solutions_problem_id ON solutions(problem_id);
```

**Champs :**
- `id` : Identifiant unique
- `problem_id` : Référence au problème résolu
- `explanation` : JSON avec les explications étape par étape
- `wolfram_result` : Résultat de WolframAlpha (JSON)
- `created_at` : Date de création

#### Table `chat_history`
```sql
-- PostgreSQL
CREATE TABLE chat_history (
    id SERIAL PRIMARY KEY,
    solution_id INT NOT NULL,
    messages JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (solution_id) REFERENCES solutions(id) ON DELETE CASCADE
);

-- MySQL
CREATE TABLE chat_history (
    id INT PRIMARY KEY AUTO_INCREMENT,
    solution_id INT NOT NULL,
    messages JSON NOT NULL DEFAULT '[]',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (solution_id) REFERENCES solutions(id) ON DELETE CASCADE
);

CREATE INDEX idx_chat_history_solution_id ON chat_history(solution_id);
```

**Champs :**
- `id` : Identifiant unique
- `solution_id` : Référence à la solution concernée
- `messages` : JSON array avec l'historique des messages du chat
- `created_at` : Date de création
- `updated_at` : Date de dernière mise à jour

---

## 🔐 Authentification

### Technologie
- **JWT (JSON Web Tokens)** pour l'authentification stateless
- **bcrypt** pour le hashage des mots de passe
- **python-jose** ou **PyJWT** pour la gestion des tokens

### Configuration JWT

```python
# Variables d'environnement
JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")  # Clé secrète pour signer les tokens
JWT_ALGORITHM = "HS256"
JWT_ACCESS_TOKEN_EXPIRE_MINUTES = 30  # 30 minutes
JWT_REFRESH_TOKEN_EXPIRE_DAYS = 7    # 7 jours
```

### Flux d'Authentification

#### 1. Inscription (Register)
```
POST /api/auth/register
Body: {
    "email": "user@example.com",
    "password": "securePassword123"
}

Response: {
    "success": true,
    "user": {
        "id": 1,
        "email": "user@example.com",
        "created_at": "2025-12-09T10:00:00Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "refresh_token_here"
}
```

**Validation :**
- Email valide et unique
- Mot de passe : minimum 8 caractères, au moins 1 majuscule, 1 minuscule, 1 chiffre

#### 2. Connexion (Login)
```
POST /api/auth/login
Body: {
    "email": "user@example.com",
    "password": "securePassword123"
}

Response: {
    "success": true,
    "user": {
        "id": 1,
        "email": "user@example.com"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "refresh_token_here"
}
```

#### 3. Renouvellement de Token (Refresh)
```
POST /api/auth/refresh
Headers: {
    "Authorization": "Bearer <refresh_token>"
}

Response: {
    "success": true,
    "token": "new_access_token",
    "refresh_token": "new_refresh_token"
}
```

#### 4. Déconnexion (Logout)
```
POST /api/auth/logout
Headers: {
    "Authorization": "Bearer <token>"
}

Response: {
    "success": true,
    "message": "Logged out successfully"
}
```

#### 5. Profil Utilisateur (Me)
```
GET /api/auth/me
Headers: {
    "Authorization": "Bearer <token>"
}

Response: {
    "success": true,
    "user": {
        "id": 1,
        "email": "user@example.com",
        "created_at": "2025-12-09T10:00:00Z",
        "profile": {
            "education_level": "high",
            "preferred_domains": ["algebra", "geometry"],
            "onboarding_completed": true
        }
    }
}
```

### Protection des Routes

#### Middleware d'Authentification
```python
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import jwt

security = HTTPBearer()

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    try:
        payload = jwt.decode(token, JWT_SECRET_KEY, algorithms=[JWT_ALGORITHM])
        user_id = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        # Récupérer l'utilisateur depuis la base de données
        user = get_user_by_id(user_id)
        if user is None:
            raise HTTPException(status_code=401, detail="User not found")
        return user
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")
```

#### Utilisation dans les Endpoints
```python
@app.post("/api/solve")
async def solve_problem(
    request: SolveRequest,
    current_user: User = Depends(get_current_user)
):
    # L'utilisateur est authentifié
    user_id = current_user.id
    # Créer le problème associé à user_id
    pass
```

---

## 🔄 Migration de l'Historique

### Stratégie de Migration

1. **Phase 1 : Double écriture** (transition)
   - Écrire dans localStorage ET dans la base de données
   - Lire depuis la base de données en priorité, fallback sur localStorage

2. **Phase 2 : Migration complète**
   - Script de migration pour transférer les données localStorage → DB
   - Supprimer le code localStorage après migration

3. **Phase 3 : Base de données uniquement**
   - Toutes les opérations se font via l'API
   - localStorage utilisé uniquement pour le token JWT

### Script de Migration - Backend

```python
# backend/migrations/migrate_localstorage.py
from sqlalchemy.orm import Session
from datetime import datetime

def migrate_user_history(db: Session, user_id: int, local_storage_data: list):
    """
    Migre l'historique depuis localStorage vers la base de données
    """
    for item in local_storage_data:
        # Créer le problème
        problem = Problem(
            user_id=user_id,
            latex=item['problem'],
            created_at=datetime.fromtimestamp(item['timestamp']/1000)
        )
        db.add(problem)
        db.flush()  # Pour obtenir l'ID
        
        # Créer la solution
        solution = Solution(
            problem_id=problem.id,
            explanation=item['solution']['explanation'],
            wolfram_result=item['solution']['wolfram_result']
        )
        db.add(solution)
    
    db.commit()
```

---

## 🔒 Sécurité

### Bonnes Pratiques

1. **Mots de passe**
   - Hashage avec bcrypt (coût = 12)
   - Validation côté serveur
   - Ne jamais stocker en clair

2. **Tokens JWT**
   - Expiration courte pour access token (30 min)
   - Refresh token avec expiration plus longue (7 jours)
   - Stockage sécurisé côté client (httpOnly cookies ou localStorage)

3. **CORS**
   - Configuration stricte en production
   - Autoriser uniquement les domaines autorisés

4. **Rate Limiting**
   - Limiter les tentatives de connexion (5 tentatives / 15 min)
   - Limiter les requêtes API par utilisateur

5. **Validation**
   - Valider toutes les entrées utilisateur
   - Sanitizer les données avant insertion en DB
   - Utiliser des requêtes paramétrées (protection SQL injection)

6. **Base de données**
   - Utiliser des transactions pour les opérations critiques
   - Backups réguliers
   - Connexions sécurisées (SSL/TLS)

---

## 📡 Endpoints API

### Endpoints d'Authentification

1. `POST /api/auth/register` - Inscription
2. `POST /api/auth/login` - Connexion
3. `POST /api/auth/logout` - Déconnexion
4. `POST /api/auth/refresh` - Renouvellement token
5. `GET /api/auth/me` - Profil utilisateur

### Endpoints d'Onboarding

1. `POST /api/onboarding/start` - Démarrer l'onboarding
2. `POST /api/onboarding/step` - Enregistrer une étape
3. `POST /api/onboarding/complete` - Finaliser l'onboarding
4. `GET /api/onboarding/status` - Vérifier le statut

### Endpoints Fonctionnalités (Protégés)

1. `POST /api/extract-latex` - Extraction LaTeX (nécessite auth)
2. `POST /api/solve` - Résolution de problème (nécessite auth)
3. `POST /api/chat` - Chat interactif (nécessite auth)
4. `GET /api/history` - Historique des problèmes (nécessite auth)
5. `GET /api/history/:id` - Détails d'un problème (nécessite auth)
6. `DELETE /api/history/:id` - Supprimer un problème (nécessite auth)
7. `PUT /api/preferences` - Mettre à jour les préférences (nécessite auth)

---

## 🎨 Frontend - Composants à Créer

### Pages
1. **LoginPage.jsx** - Page de connexion
2. **RegisterPage.jsx** - Page d'inscription
3. **ProfilePage.jsx** - Page de profil utilisateur
4. **OnboardingPage.jsx** - Page d'onboarding (wizard)

### Contextes
1. **AuthContext.jsx** - Gestion de l'état d'authentification
   - `user` : Utilisateur actuel
   - `token` : Token JWT
   - `login(email, password)` : Fonction de connexion
   - `register(email, password)` : Fonction d'inscription
   - `logout()` : Fonction de déconnexion
   - `isAuthenticated` : Boolean

### Utilitaires
1. **authClient.js** - Client API pour l'authentification
2. **protectedRoute.jsx** - HOC pour protéger les routes
3. **tokenStorage.js** - Gestion du stockage des tokens

### Modifications des Composants Existants
1. **App.jsx** - Ajouter la gestion des routes protégées et onboarding
2. **HistorySidebar.jsx** - Lire depuis l'API au lieu de localStorage
3. **ImageUpload.jsx** - Envoyer le token dans les requêtes

---

## 📦 Dépendances à Ajouter

### Backend (requirements.txt)
```
sqlalchemy>=2.0.0
alembic>=1.12.0          # Migrations de base de données
bcrypt>=4.0.0            # Hashage des mots de passe
python-jose[cryptography]>=3.3.0  # JWT
python-multipart>=0.0.6  # Pour les formulaires
psycopg2-binary>=2.9.0   # Driver PostgreSQL (ou PyMySQL pour MySQL)
```

### Frontend (package.json)
```json
{
  "dependencies": {
    "react-router-dom": "^6.20.0",
    "axios": "^1.6.0"
  }
}
```

---

## 🧪 Tests à Implémenter

### Backend
- [ ] Tests unitaires pour l'authentification
- [ ] Tests d'intégration pour les endpoints protégés
- [ ] Tests de la base de données (CRUD)
- [ ] Tests de sécurité (tentatives de connexion, tokens invalides)
- [ ] Tests de l'API d'onboarding

### Frontend
- [ ] Tests des composants d'authentification
- [ ] Tests de la protection des routes
- [ ] Tests de l'onboarding
- [ ] Tests de la migration de l'historique
- [ ] Tests E2E du flux d'authentification

---

## 📝 Checklist d'Implémentation

### Backend
- [ ] Configuration de la base de données (SQLAlchemy)
- [ ] Création des modèles (User, UserProfile, Problem, Solution, ChatHistory)
- [ ] Scripts de migration (Alembic)
- [ ] Implémentation de l'authentification (JWT)
- [ ] Endpoints d'authentification
- [ ] Endpoints d'onboarding
- [ ] Protection des routes existantes
- [ ] Endpoints pour l'historique
- [ ] Script de migration localStorage → DB
- [ ] Tests unitaires et d'intégration

### Frontend
- [ ] Pages d'authentification (Login, Register, Profile)
- [ ] Interface d'onboarding complète
- [ ] AuthContext pour la gestion d'état
- [ ] Protection des routes
- [ ] Modification des composants pour utiliser l'API
- [ ] Migration de l'historique localStorage → API
- [ ] Gestion des tokens (stockage, refresh)
- [ ] Tests des composants

### DevOps
- [ ] Configuration de PostgreSQL/MySQL en production
- [ ] Variables d'environnement (JWT_SECRET_KEY, DATABASE_URL)
- [ ] Scripts de migration en production
- [ ] Backup de la base de données

---

## 🚀 Guide de Démarrage Rapide

### 1. Configuration de la Base de Données

**PostgreSQL :**
```bash
# Installation locale
# Windows: Télécharger depuis postgresql.org
# Mac: brew install postgresql
# Linux: sudo apt-get install postgresql

# Créer la base de données
createdb math_assistant

# Ou via psql
psql -U postgres
CREATE DATABASE math_assistant;
```

**MySQL :**
```bash
# Installation locale
# Windows: Télécharger depuis mysql.com
# Mac: brew install mysql
# Linux: sudo apt-get install mysql-server

# Créer la base de données
mysql -u root -p
CREATE DATABASE math_assistant;
```

### 2. Configuration Backend

```bash
cd backend
pip install -r requirements.txt

# Créer le fichier .env
```

**Contenu de `backend/.env` :**
```env
DATABASE_URL=postgresql://user:password@localhost:5432/math_assistant
# Ou pour MySQL:
# DATABASE_URL=mysql+pymysql://user:password@localhost:3306/math_assistant

JWT_SECRET_KEY=your-secret-key-here
JWT_ALGORITHM=HS256
JWT_ACCESS_TOKEN_EXPIRE_MINUTES=30
JWT_REFRESH_TOKEN_EXPIRE_DAYS=7

OPENAI_API_KEY=your-openai-key
WOLFRAM_APP_ID=your-wolfram-app-id
```

### 3. Migrations

```bash
# Initialiser Alembic
alembic init alembic

# Créer une migration
alembic revision --autogenerate -m "Initial schema"

# Appliquer les migrations
alembic upgrade head
```

---

**Dernière mise à jour :** 09 Décembre 2025  
**Solution :** PostgreSQL ou MySQL (implémentation manuelle)
