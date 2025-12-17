# 📊 Spécifications - Analyse des Activités Utilisateurs (Analytics)

## 📋 Contexte
Document destiné à **Verbeck et Sarah**.
En plus de l'onboarding (capture des besoins), nous devons analyser comment les utilisateurs interagissent avec l'application pour améliorer continuellement l'IA et l'UX.

---

## 🎯 Objectifs de l'Analyse

1.  **Valider l'adéquation** entre le niveau déclaré (Onboarding) et la réalité des problèmes soumis.
2.  **Identifier les points de friction** (abandons, erreurs récurrentes, demandes de "retry").
3.  **Mesurer l'engagement** (fréquence, temps passé, nombre de problèmes résolus).

---

## 📈 KPIs à Suivre

### 1. Métriques d'Acquisition & Onboarding
- **Tax de complétion de l'onboarding** : % d'utilisateurs qui finissent le wizard.
- **Distribution des niveaux** : Répartition (Collège vs Lycée vs Sup).
- **Intérêts** : Domaines mathématiques les plus sélectionnés.

### 2. Métriques d'Utilisation (Core Loop)
- **Nombre de problèmes soumis / utilisateur / jour**.
- **Taux de succès de l'OCR** : % d'images converties en LaTeX sans édition manuelle.
- **Taux de satisfaction solution** : Utilisation du bouton "Retry/Directives" vs "Nouveau problème".
- **Temps de lecture** : Temps passé sur la page de solution (indique si l'utilisateur lit vraiment).

### 3. Métriques d'Interaction Solvabilité
- **Utilisation du Chat** : % de problèmes suivis d'une question dans le chat.
- **Nature des questions** : "Expliquer une étape" vs "Pourquoi ce résultat ?".

---

## 🛠️ Implémentation Technique (Proposition)

### Backend (Python/FastAPI)
- Créer une table `user_events` pour logger les actions clés.
- Middleware pour tracker les temps de réponse API.

```sql
CREATE TABLE user_events (
    id SERIAL PRIMARY KEY,
    user_id INT,
    event_type VARCHAR(50), -- e.g., 'problem_submitted', 'chat_message', 'pdf_export'
    event_data JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);
```

### Frontend (React)
- Utiliser un utilitaire simple pour envoyer les événements.
- Ne pas bloquer l'UI pour les appels analytics.

```javascript
// utils/analytics.js
export const trackEvent = (eventName, properties = {}) => {
  // Envoyer à l'API en "fire and forget"
  fetch('/api/analytics/track', {
    method: 'POST',
    body: JSON.stringify({ event: eventName, ...properties }),
    keepalive: true
  }).catch(console.error);
};
```

---

## 📅 Plan d'Action pour Verbeck & Sarah

1.  **Phase 1 :** Implémenter le tracking basique (soumission problème, fin onboarding).
2.  **Phase 2 :** Créer un dashboard simple (Metabase ou Streamlit) connecté à la BDD pour visualiser les KPIs.
3.  **Phase 3 :** Analyser les directives données dans le chat pour affiner les prompts du solveur.
