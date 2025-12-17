# 🤝 Guide de Contribution

Ce document décrit les règles et processus pour contribuer au projet Math Conquest Assistant.

## 📋 Table des Matières

- [Workflow Git](#workflow-git)
- [Conventions de Code](#conventions-de-code)
- [Pull Requests](#pull-requests)
- [Code Review](#code-review)
- [Standards de Commit](#standards-de-commit)

---

## 🔀 Workflow Git

### Structure des Branches

- **`main`** : Code en production (protégée)
- **`develop`** : Branche de développement principale
- **`feature/*`** : Nouvelles fonctionnalités
- **`fix/*`** : Corrections de bugs
- **`hotfix/*`** : Corrections urgentes

### Créer une Nouvelle Fonctionnalité

1. **Synchroniser avec develop**
   ```bash
   git checkout develop
   git pull origin develop
   ```

2. **Créer une branche feature**
   ```bash
   git checkout -b feature/nom-fonctionnalite
   ```

3. **Développer et commiter**
   ```bash
   # Faire vos modifications
   git add .
   git commit -m "feat: description de la fonctionnalité"
   ```

4. **Pousser la branche**
   ```bash
   git push origin feature/nom-fonctionnalite
   ```

5. **Créer une Pull Request** sur GitHub vers `develop`

---

## 📝 Standards de Commit

Nous utilisons le format **Conventional Commits** :

```
<type>(<scope>): <description>

[corps optionnel]

[footer optionnel]
```

### Types de Commits

- **`feat`** : Nouvelle fonctionnalité
- **`fix`** : Correction de bug
- **`docs`** : Documentation
- **`style`** : Formatage (pas de changement de code)
- **`refactor`** : Refactorisation
- **`test`** : Ajout/modification de tests
- **`chore`** : Tâches de maintenance

### Exemples

```bash
feat(auth): add Supabase authentication
fix(api): resolve token validation error
docs(readme): update installation instructions
refactor(frontend): simplify auth context
test(backend): add unit tests for auth endpoints
```

---

## 🎨 Conventions de Code

### Frontend (React)

- **Composants** : PascalCase (`UserProfile.jsx`)
- **Fonctions** : camelCase (`handleSubmit`)
- **Constantes** : UPPER_SNAKE_CASE (`API_BASE_URL`)
- **Hooks personnalisés** : Préfixe `use` (`useAuth`)

### Backend (Python)

- **Fichiers** : snake_case (`auth_utils.py`)
- **Fonctions** : snake_case (`get_current_user`)
- **Classes** : PascalCase (`UserService`)
- **Constantes** : UPPER_SNAKE_CASE (`MAX_RETRIES`)

### Formatage

- **Frontend** : ESLint + Prettier
- **Backend** : Black + Flake8

Vérifier avant de commiter :
```bash
# Frontend
npm run lint
npm run format

# Backend
black --check .
flake8 .
```

---

## 🔄 Pull Requests

### Avant de Créer une PR

- [ ] Code testé localement
- [ ] Tests passent
- [ ] Linting OK
- [ ] Pas de secrets/clés API dans le code
- [ ] Documentation à jour si nécessaire

### Template de PR

```markdown
## Description
Brève description de ce qui a été fait.

## Type de changement
- [ ] Bug fix
- [ ] Nouvelle fonctionnalité
- [ ] Refactorisation
- [ ] Documentation

## Tests
- [ ] Tests unitaires ajoutés/modifiés
- [ ] Tests manuels effectués

## Screenshots (si UI)
Ajouter des screenshots si changement d'interface

## Checklist
- [ ] Code respecte les standards
- [ ] Tests passent
- [ ] Documentation à jour
- [ ] Pas de secrets dans le code
```

### Processus de Review

1. **Créer la PR** vers `develop`
2. **Assigner des reviewers** (au moins 1)
3. **Attendre les commentaires** et répondre
4. **Corriger** si nécessaire
5. **Une fois approuvée**, merger dans `develop`

---

## 👀 Code Review

### En tant que Reviewer

- ✅ Vérifier que le code respecte les standards
- ✅ Vérifier que les tests passent
- ✅ Vérifier qu'il n'y a pas de secrets
- ✅ Vérifier la lisibilité et maintenabilité
- ✅ Donner un feedback constructif

### En tant que Développeur

- ✅ Répondre aux commentaires
- ✅ Corriger les problèmes soulevés
- ✅ Re-merger si nécessaire
- ✅ Remercier les reviewers

---

## 🐛 Signaler un Bug

1. Créer une **Issue** sur GitHub
2. Utiliser le template "Bug Report"
3. Inclure :
   - Description du bug
   - Étapes pour reproduire
   - Comportement attendu vs actuel
   - Environnement (OS, navigateur, etc.)

---

## 💡 Proposer une Fonctionnalité

1. Créer une **Issue** sur GitHub
2. Utiliser le template "Feature Request"
3. Décrire :
   - Le problème à résoudre
   - La solution proposée
   - Les alternatives considérées

---

## 📚 Ressources

- [Conventional Commits](https://www.conventionalcommits.org/)
- [Git Flow](https://nvie.com/posts/a-successful-git-branching-model/)
- [GitHub Flow](https://guides.github.com/introduction/flow/)

---

**Merci de contribuer au projet ! 🚀**



