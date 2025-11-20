# 🔍 Comment ça marche ? Qui résout quoi ?

## 📊 Vue d'ensemble du flux

Votre application utilise **3 services différents** qui travaillent ensemble :

```
Image → OpenAI Vision → LaTeX → WolframAlpha → Calcul exact
                                    ↓
                              OpenAI LLM → Explication pédagogique
```

## 🎯 Qui fait quoi ?

### 1. **OpenAI Vision API** (Extraction)
- **Rôle** : Extrait le texte mathématique de l'image
- **Fait** : Convertit l'image en LaTeX propre
- **Exemple** : Votre photo de `2x - 3 = -7` devient `2x - 3 = -7` en LaTeX

### 2. **WolframAlpha API** (Résolution)
- **Rôle** : **RÉSOUT** le problème mathématique
- **Fait** : Calcule la réponse exacte
- **Exemple** : Pour `2x - 3 = -7`, WolframAlpha calcule que `x = -2`
- **Important** : C'est **WolframAlpha qui fait le calcul**, pas LaTeX ni OpenAI !

### 3. **OpenAI LLM (GPT-4o-mini)** (Explication)
- **Rôle** : Génère l'explication pédagogique étape par étape
- **Fait** : Prend le problème (LaTeX) + la réponse (WolframAlpha) et crée une explication détaillée
- **Exemple** : Explique pourquoi on ajoute 3, puis divise par 2, etc.
- **Important** : OpenAI **n'effectue PAS le calcul**, il explique seulement comment y arriver !

## 🔄 Flux complet détaillé

1. **Vous uploadez une image** → Frontend
2. **Extraction LaTeX** → OpenAI Vision analyse l'image et retourne le LaTeX
3. **Résolution** → Le LaTeX est envoyé à WolframAlpha qui calcule la réponse
4. **Explication** → OpenAI LLM reçoit :
   - Le problème (LaTeX)
   - La réponse (de WolframAlpha)
   - Et génère les étapes pédagogiques
5. **Affichage** → Tout est affiché sur le frontend

## ❓ Pourquoi cette architecture ?

- **WolframAlpha** = Calculs **exacts** et **fiables** (moteur mathématique professionnel)
- **OpenAI** = Explications **pédagogiques** et **humaines** (comme un professeur)
- **Combinaison** = Meilleur des deux mondes : exactitude + pédagogie

## 🐛 Problèmes courants

### "Résultat non disponible" avec caractères bizarres
- **Cause** : Problème d'encodage UTF-8
- **Solution** : Les corrections récentes devraient résoudre cela

### Erreur de parsing JSON
- **Cause** : OpenAI retourne parfois du JSON mal formaté
- **Solution** : Utilisation de `response_format={"type": "json_object"}` pour forcer le JSON valide

### Pas d'étapes affichées
- **Cause** : Le JSON n'est pas correctement parsé
- **Solution** : Le backend essaie maintenant de récupérer au moins les steps même si le JSON complet échoue

## 📝 Résumé

| Service | Fait quoi ? | Exemple |
|---------|-------------|---------|
| **OpenAI Vision** | Extrait le LaTeX de l'image | `2x - 3 = -7` |
| **WolframAlpha** | **RÉSOUT** le problème | `x = -2` |
| **OpenAI LLM** | Explique comment résoudre | "Ajoute 3 des deux côtés..." |

**En bref** : WolframAlpha = le calculateur, OpenAI = le professeur qui explique ! 🎓

