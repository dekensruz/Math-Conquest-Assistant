# 🎯 Spécifications - Système d'Onboarding

## 📋 Vue d'ensemble

Le système d'onboarding permet de collecter des informations sur les utilisateurs lors de leur première connexion pour adapter l'application à leurs besoins et niveaux.

---

## 🎯 Objectifs de l'Onboarding

1. **Collecter des informations utilisateur** pour personnaliser l'expérience
2. **Adapter le niveau d'explication** selon le niveau scolaire
3. **Suggérer des problèmes** selon les domaines mathématiques préférés
4. **Personnaliser l'interface** selon les préférences
5. **Améliorer l'engagement** avec une expérience personnalisée

---

## 📊 Données Collectées

### 1. Niveau Scolaire
- Primaire (CP-CM2)
- Collège (6ème-3ème)
- Lycée (2nde-Terminale)
- Supérieur (Université, Classes préparatoires)
- Autodidacte / Autre

### 2. Domaines Mathématiques Préférés
- Algèbre
- Géométrie
- Trigonométrie
- Calcul différentiel et intégral
- Probabilités et statistiques
- Arithmétique
- Tous (pas de préférence)

### 3. Objectifs d'Apprentissage
- Comprendre les concepts
- Résoudre des exercices
- Préparer un examen
- Révision générale
- Apprentissage autonome

### 4. Niveau de Difficulté Préféré
- Débutant
- Intermédiaire
- Avancé
- Mixte (selon le sujet)

### 5. Langue Préférée (optionnel)
- Français
- Anglais

---

## 🗄️ Modèle de Données

### Table `user_profiles`

```sql
CREATE TABLE user_profiles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL UNIQUE,
    -- Données onboarding
    education_level VARCHAR(50), -- 'primary', 'middle', 'high', 'university', 'self-taught'
    preferred_domains JSON, -- ['algebra', 'geometry', 'trigonometry', ...]
    learning_goals JSON, -- ['understand', 'practice', 'exam', 'review', 'self-learning']
    difficulty_level VARCHAR(20), -- 'beginner', 'intermediate', 'advanced', 'mixed'
    preferred_language VARCHAR(10) DEFAULT 'fr', -- 'fr', 'en'
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

---

## 🎨 Interface d'Onboarding

### Structure (Wizard Multi-étapes)

#### Étape 1 : Bienvenue
- **Titre :** "Bienvenue sur Math Conquest Assistant !"
- **Contenu :** 
  - Présentation de l'application
  - Explication de l'onboarding (2-3 minutes)
  - Bouton "Commencer"

#### Étape 2 : Niveau Scolaire
- **Titre :** "Quel est votre niveau scolaire ?"
- **Type :** Sélection unique (cartes ou radio buttons)
- **Options :**
  - 🎒 Primaire
  - 📚 Collège
  - 🎓 Lycée
  - 🏛️ Supérieur
  - 📖 Autodidacte / Autre
- **Validation :** Requis

#### Étape 3 : Domaines Mathématiques
- **Titre :** "Quels domaines mathématiques vous intéressent ?"
- **Type :** Sélection multiple (checkboxes)
- **Options :**
  - ➕ Algèbre
  - 📐 Géométrie
  - 📊 Trigonométrie
  - ∫ Calcul différentiel et intégral
  - 🎲 Probabilités et statistiques
  - 🔢 Arithmétique
  - 🌟 Tous (pas de préférence)
- **Validation :** Au moins 1 sélection

#### Étape 4 : Objectifs
- **Titre :** "Quels sont vos objectifs d'apprentissage ?"
- **Type :** Sélection multiple (checkboxes)
- **Options :**
  - 💡 Comprendre les concepts
  - ✏️ Résoudre des exercices
  - 📝 Préparer un examen
  - 📚 Révision générale
  - 🎯 Apprentissage autonome
- **Validation :** Au moins 1 sélection

#### Étape 5 : Niveau de Difficulté
- **Titre :** "Quel niveau de difficulté préférez-vous ?"
- **Type :** Sélection unique (cartes)
- **Options :**
  - 🌱 Débutant
  - 🌿 Intermédiaire
  - 🌳 Avancé
  - 🌍 Mixte (selon le sujet)
- **Validation :** Requis

#### Étape 6 : Confirmation
- **Titre :** "Presque terminé !"
- **Contenu :**
  - Récapitulatif des choix
  - Message de personnalisation
  - Bouton "Finaliser et commencer"

---

## 🔌 API Endpoints

### `POST /api/onboarding/start`
Démarrer l'onboarding pour un utilisateur.

**Request :**
```json
{
  "user_id": 1
}
```

**Response :**
```json
{
  "success": true,
  "onboarding_id": "uuid-here",
  "current_step": 1,
  "total_steps": 6
}
```

### `POST /api/onboarding/step`
Enregistrer une étape de l'onboarding.

**Request :**
```json
{
  "onboarding_id": "uuid-here",
  "step": 2,
  "data": {
    "education_level": "high"
  }
}
```

**Response :**
```json
{
  "success": true,
  "current_step": 3,
  "next_step": "domains"
}
```

### `POST /api/onboarding/complete`
Finaliser l'onboarding.

**Request :**
```json
{
  "onboarding_id": "uuid-here",
  "data": {
    "education_level": "high",
    "preferred_domains": ["algebra", "geometry"],
    "learning_goals": ["understand", "practice"],
    "difficulty_level": "intermediate",
    "preferred_language": "fr"
  }
}
```

**Response :**
```json
{
  "success": true,
  "message": "Onboarding completed successfully",
  "profile": {
    "user_id": 1,
    "education_level": "high",
    "preferred_domains": ["algebra", "geometry"],
    "learning_goals": ["understand", "practice"],
    "difficulty_level": "intermediate",
    "onboarding_completed": true
  }
}
```

### `GET /api/onboarding/status`
Vérifier le statut de l'onboarding.

**Request :**
```
GET /api/onboarding/status?user_id=1
```

**Response :**
```json
{
  "onboarding_completed": false,
  "current_step": 3,
  "progress": 50
}
```

---

## 🎨 Personnalisation Basée sur l'Onboarding

### 1. Niveau d'Explication

Selon le niveau scolaire, adapter la complexité des explications :

- **Primaire/Collège :** Explications simples, vocabulaire accessible
- **Lycée :** Explications détaillées avec terminologie appropriée
- **Supérieur :** Explications techniques, notation formelle

**Exemple de prompt OpenAI :**
```python
if education_level == "primary":
    complexity = "simple, accessible language for elementary students"
elif education_level == "middle":
    complexity = "clear explanations suitable for middle school students"
elif education_level == "high":
    complexity = "detailed explanations with appropriate terminology for high school"
else:
    complexity = "technical explanations with formal notation for university level"
```

### 2. Suggestions de Problèmes

Selon les domaines préférés, suggérer des problèmes pertinents :

```python
def get_suggested_problems(user_profile):
    preferred_domains = user_profile.preferred_domains
    difficulty = user_profile.difficulty_level
    
    # Filtrer les problèmes selon les préférences
    suggestions = filter_problems_by_domain(preferred_domains)
    suggestions = filter_by_difficulty(suggestions, difficulty)
    
    return suggestions
```

### 3. Adaptation de l'Interface

- **Débutant :** Plus d'aides visuelles, explications étape par étape
- **Intermédiaire :** Interface standard
- **Avancé :** Interface épurée, accès rapide aux fonctions avancées

### 4. Adaptation des Prompts OpenAI

```python
def build_personalized_prompt(problem, user_profile):
    base_prompt = f"Solve this problem: {problem}"
    
    # Adapter selon le niveau
    if user_profile.education_level == "primary":
        base_prompt += " Explain in simple terms suitable for elementary students."
    elif user_profile.education_level == "high":
        base_prompt += " Provide detailed explanations with appropriate mathematical terminology."
    
    # Adapter selon les objectifs
    if "understand" in user_profile.learning_goals:
        base_prompt += " Focus on explaining the concepts and reasoning behind each step."
    
    # Adapter selon la difficulté
    if user_profile.difficulty_level == "beginner":
        base_prompt += " Break down each step in detail."
    
    return base_prompt
```

---

## 🎨 Composants Frontend

### `OnboardingWizard.jsx`
Composant principal du wizard d'onboarding.

**Props :**
- `onComplete`: Callback quand l'onboarding est terminé
- `onSkip`: Callback pour sauter l'onboarding (optionnel)

**État :**
- `currentStep`: Étape actuelle (1-6)
- `formData`: Données collectées
- `loading`: État de chargement

### `OnboardingStep.jsx`
Composant pour chaque étape.

**Props :**
- `step`: Numéro de l'étape
- `title`: Titre de l'étape
- `children`: Contenu de l'étape
- `onNext`: Callback pour passer à l'étape suivante
- `onBack`: Callback pour revenir en arrière
- `canProceed`: Boolean pour activer/désactiver le bouton suivant

### `EducationLevelSelector.jsx`
Sélecteur de niveau scolaire.

### `DomainSelector.jsx`
Sélecteur de domaines mathématiques (multi-sélection).

### `GoalSelector.jsx`
Sélecteur d'objectifs d'apprentissage.

### `DifficultySelector.jsx`
Sélecteur de niveau de difficulté.

---

## 🔄 Flux Utilisateur

1. **Inscription/Connexion** → Utilisateur créé
2. **Vérification onboarding** → `GET /api/onboarding/status`
3. **Si non complété** → Redirection vers `/onboarding`
4. **Wizard d'onboarding** → 6 étapes
5. **Sauvegarde progressive** → Chaque étape sauvegardée
6. **Finalisation** → `POST /api/onboarding/complete`
7. **Redirection** → Page principale avec personnalisation activée

---

## 🧪 Tests

### Tests Backend
- [ ] Test de création d'onboarding
- [ ] Test de sauvegarde d'étape
- [ ] Test de finalisation
- [ ] Test de récupération du statut
- [ ] Test de validation des données

### Tests Frontend
- [ ] Test de navigation entre les étapes
- [ ] Test de validation des formulaires
- [ ] Test de sauvegarde progressive
- [ ] Test de finalisation
- [ ] Test de redirection après onboarding

### Tests d'Intégration
- [ ] Test du flux complet d'onboarding
- [ ] Test de personnalisation après onboarding
- [ ] Test de persistance des données

---

## 📝 Checklist d'Implémentation

### Backend
- [ ] Modèle `user_profiles` créé
- [ ] Endpoints d'onboarding implémentés
- [ ] Validation des données
- [ ] Logique de personnalisation
- [ ] Tests unitaires

### Frontend
- [ ] Composant `OnboardingWizard` créé
- [ ] Toutes les étapes implémentées
- [ ] Intégration avec l'API
- [ ] Design responsive
- [ ] Tests des composants

### Intégration
- [ ] Flux complet testé
- [ ] Personnalisation fonctionnelle
- [ ] Documentation à jour

---

**Dernière mise à jour :** 09 Décembre 2025

