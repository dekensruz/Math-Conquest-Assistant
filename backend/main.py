"""
Math Assistant Backend - FastAPI
Gère l'upload d'images, l'extraction LaTeX via OpenAI Vision,
la résolution via WolframAlpha, et l'explication via OpenAI LLM.
"""

from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import os
from dotenv import load_dotenv
import openai
import requests
import base64
from typing import Optional
import logging
import json
import re

# Configuration du logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Charger les variables d'environnement
load_dotenv()

# Initialiser FastAPI
app = FastAPI(
    title="Math Assistant API",
    description="API pour résoudre et expliquer des problèmes mathématiques",
    version="1.0.0"
)

# Configuration CORS pour permettre les requêtes depuis le frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],  # Vite par défaut sur 5173
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configuration des API keys
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
WOLFRAM_APP_ID = os.getenv("WOLFRAM_APP_ID")

if not OPENAI_API_KEY:
    logger.warning("OPENAI_API_KEY non trouvée dans les variables d'environnement")

if not WOLFRAM_APP_ID:
    logger.warning("WOLFRAM_APP_ID non trouvée dans les variables d'environnement")

# Initialiser le client OpenAI (nouvelle API v1.x)
client = openai.OpenAI(api_key=OPENAI_API_KEY) if OPENAI_API_KEY else None


@app.get("/")
async def root():
    """Endpoint de santé pour vérifier que l'API fonctionne."""
    return {"message": "Math Assistant API is running", "status": "ok"}


@app.post("/api/extract-latex")
async def extract_latex(file: UploadFile = File(...)):
    """
    Extrait le contenu mathématique d'une image et le convertit en LaTeX.
    Utilise OpenAI Vision API (GPT-4.1 nano).
    """
    try:
        # Lire le contenu de l'image
        image_content = await file.read()
        
        # Encoder en base64 pour OpenAI Vision
        image_base64 = base64.b64encode(image_content).decode('utf-8')
        
        # Préparer la requête pour OpenAI Vision
        # Utiliser GPT-4o-mini (équivalent à 4.1 nano mentionné)
        if not client:
            raise HTTPException(status_code=500, detail="OpenAI API key non configurée")
        
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {
                    "role": "system",
                    "content": "Tu es un expert en extraction de contenu mathématique. "
                               "Extrais uniquement le contenu mathématique de l'image et retourne-le en LaTeX propre. "
                               "Ne retourne que le LaTeX, sans explication supplémentaire. "
                               "Si l'image contient du texte explicatif, ignore-le et concentre-toi uniquement sur les équations et formules mathématiques."
                },
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": "Extrais le contenu mathématique de cette image et retourne-le en LaTeX propre. "
                                    "Retourne uniquement le LaTeX, sans commentaire."
                        },
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": f"data:image/{file.content_type};base64,{image_base64}"
                            }
                        }
                    ]
                }
            ],
            max_tokens=1000
        )
        
        latex_content = response.choices[0].message.content.strip()
        
        # Nettoyer le LaTeX (enlever les markdown code blocks si présents)
        if latex_content.startswith("```"):
            latex_content = latex_content.split("```")[1]
            if latex_content.startswith("latex"):
                latex_content = latex_content[5:]
            latex_content = latex_content.strip()
        
        logger.info(f"LaTeX extrait: {latex_content[:100]}...")
        
        return JSONResponse({
            "success": True,
            "latex": latex_content
        })
        
    except openai.OpenAIError as e:
        logger.error(f"Erreur OpenAI: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Erreur lors de l'extraction LaTeX avec OpenAI: {str(e)}"
        )
    except Exception as e:
        logger.error(f"Erreur inattendue: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Erreur lors du traitement de l'image: {str(e)}"
        )


@app.post("/api/solve")
async def solve_problem(data: dict):
    """
    Résout un problème mathématique en LaTeX en utilisant WolframAlpha,
    puis génère une explication pédagogique via OpenAI LLM.
    """
    latex_problem = data.get("latex")
    
    if not latex_problem:
        raise HTTPException(status_code=400, detail="Le LaTeX du problème est requis")
    
    try:
        # Étape 1: Résoudre avec WolframAlpha
        wolfram_result = await call_wolframalpha(latex_problem)
        
        # Étape 2: Générer l'explication pédagogique avec OpenAI
        explanation = await generate_explanation(latex_problem, wolfram_result)
        
        return JSONResponse({
            "success": True,
            "problem": latex_problem,
            "wolfram_result": wolfram_result,
            "explanation": explanation
        })
        
    except Exception as e:
        logger.error(f"Erreur lors de la résolution: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Erreur lors de la résolution du problème: {str(e)}"
        )


@app.post("/api/chat")
async def chat_about_solution(data: dict):
    """
    Endpoint pour poser des questions de suivi sur une solution.
    Prend en entrée : le problème original, la solution, et la question de l'utilisateur.
    """
    problem = data.get("problem")
    solution = data.get("solution")
    question = data.get("question")
    
    if not problem or not solution or not question:
        raise HTTPException(
            status_code=400,
            detail="Les champs 'problem', 'solution' et 'question' sont requis"
        )
    
    try:
        if not client:
            raise HTTPException(status_code=500, detail="OpenAI API key non configurée")
        
        # Préparer le contexte pour le chat
        solution_text = json.dumps(solution, ensure_ascii=False, indent=2)
        
        prompt = f"""Tu es un professeur de mathématiques patient et pédagogue. 
Un étudiant vient de résoudre un problème mathématique et a maintenant une question de suivi.

Problème original (en LaTeX): {problem}

Solution complète:
{solution_text}

Question de l'étudiant: {question}

Réponds à la question de l'étudiant de manière claire et pédagogique. 
- Si la question concerne une étape spécifique, explique cette étape en détail
- Si la question demande un exemple similaire, fournis-en un avec explication
- Si la question demande une clarification, explique le concept de manière simple
- Utilise du LaTeX pur (sans $ ou $$) pour les formules mathématiques si nécessaire
- Sois encourageant et pédagogique

Réponds en français, de manière conversationnelle mais professionnelle."""

        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {
                    "role": "system",
                    "content": "Tu es un professeur de mathématiques expert et patient. Tu réponds aux questions des étudiants de manière claire, pédagogique et encourageante."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            max_tokens=1500,
            temperature=0.7
        )
        
        answer = response.choices[0].message.content.strip()
        
        # Nettoyer les symboles $ du LaTeX dans la réponse
        answer = clean_latex_string(answer)
        
        return JSONResponse({
            "success": True,
            "answer": answer
        })
        
    except Exception as e:
        logger.error(f"Erreur lors du chat: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Erreur lors de la génération de la réponse: {str(e)}"
        )


def clean_latex_string(text: str) -> str:
    """
    Nettoie les symboles $ et $$ d'une chaîne de caractères.
    """
    if not isinstance(text, str):
        return text
    # Enlever les $ et $$ qui entourent le LaTeX
    text = re.sub(r'\$\$?([^$]+)\$?\$?', r'\1', text)
    return text


async def call_wolframalpha(latex_problem: str) -> dict:
    """
    Appelle l'API WolframAlpha pour résoudre le problème mathématique.
    """
    if not WOLFRAM_APP_ID:
        # Si pas de clé WolframAlpha, retourner un résultat simulé
        logger.warning("WOLFRAM_APP_ID non configurée, utilisation d'un résultat simulé")
        return {
            "result": "Résultat calculé (WolframAlpha non configuré)",
            "steps": ["Étape 1: Analyse du problème", "Étape 2: Application de la méthode"],
            "error": "WolframAlpha API key non configurée"
        }
    
    try:
        # Convertir le LaTeX en format texte pour WolframAlpha
        # WolframAlpha comprend certains formats LaTeX, mais on peut aussi simplifier
        query = latex_problem.replace("\\", "").replace("{", "").replace("}", "")
        
        url = "https://api.wolframalpha.com/v2/query"
        params = {
            "input": query,
            "appid": WOLFRAM_APP_ID,
            "output": "json",
            "format": "plaintext"
        }
        
        response = requests.get(url, params=params, timeout=10)
        response.raise_for_status()
        
        data = response.json()
        
        # Parser la réponse de WolframAlpha
        result_text = "Résultat non disponible"
        if "queryresult" in data and "pods" in data["queryresult"]:
            pods = data["queryresult"]["pods"]
            for pod in pods:
                if pod.get("id") == "Result" or pod.get("title") == "Result":
                    if "subpods" in pod and len(pod["subpods"]) > 0:
                        result_text = pod["subpods"][0].get("plaintext", "Résultat non disponible")
                        break
        
        return {
            "result": result_text,
            "raw_response": data
        }
        
    except requests.exceptions.RequestException as e:
        logger.error(f"Erreur WolframAlpha API: {str(e)}")
        return {
            "result": "Erreur lors de l'appel à WolframAlpha",
            "error": str(e)
        }


def clean_latex_symbols(data: dict) -> dict:
    """
    Nettoie les symboles $ et $$ du LaTeX dans les données d'explication.
    """
    def clean_string(text: str) -> str:
        if not isinstance(text, str):
            return text
        # Enlever les $ et $$ qui entourent le LaTeX
        text = re.sub(r'^\$\$?(.*?)\$?\$?$', r'\1', text, flags=re.MULTILINE)
        # Enlever les $ isolés
        text = text.replace('$$', '').strip()
        return text
    
    # Nettoyer le final_answer
    if 'final_answer' in data and isinstance(data['final_answer'], str):
        data['final_answer'] = clean_string(data['final_answer'])
    
    # Nettoyer les steps
    if 'steps' in data and isinstance(data['steps'], list):
        for step in data['steps']:
            if isinstance(step, dict):
                if 'latex' in step and isinstance(step['latex'], str):
                    step['latex'] = clean_string(step['latex'])
                if 'description' in step and isinstance(step['description'], str):
                    step['description'] = clean_string(step['description'])
    
    return data


async def generate_explanation(latex_problem: str, wolfram_result: dict) -> dict:
    """
    Génère une explication pédagogique étape par étape en utilisant OpenAI LLM.
    """
    try:
        wolfram_answer = wolfram_result.get("result", "Résultat non disponible")
        
        prompt = f"""Tu es un professeur de mathématiques patient et pédagogue. 
Un étudiant a besoin d'aide pour comprendre comment résoudre ce problème mathématique.

Problème (en LaTeX): {latex_problem}

Résultat de WolframAlpha: {wolfram_answer}

Génère une explication pédagogique étape par étape qui:
1. Identifie le type de problème (dérivée, intégrale, équation, etc.)
2. Explique la méthode à utiliser
3. Montre chaque étape de calcul de manière claire
4. Utilise du LaTeX pour les formules intermédiaires (format LaTeX pur, sans symboles $ ou $$)
5. Explique pourquoi chaque étape est nécessaire
6. Conclut avec la réponse finale

Formatte ta réponse en JSON avec cette structure:
{{
  "type": "type de problème",
  "method": "méthode utilisée",
  "steps": [
    {{
      "step_number": 1,
      "description": "description textuelle de l'étape",
      "latex": "formule LaTeX de l'étape (optionnel)",
      "explanation": "pourquoi cette étape est importante"
    }}
  ],
  "final_answer": "réponse finale en LaTeX",
  "summary": "résumé de la solution"
}}

Réponds UNIQUEMENT avec le JSON, sans texte supplémentaire."""

        if not client:
            raise Exception("OpenAI API key non configurée")
        
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {
                    "role": "system",
                    "content": "Tu es un professeur de mathématiques expert. Tu expliques les concepts de manière claire et pédagogique, étape par étape."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            max_tokens=2000,
            temperature=0.7
        )
        
        explanation_text = response.choices[0].message.content.strip()
        
        # Essayer de parser le JSON
        try:
            explanation_json = json.loads(explanation_text)
            # Nettoyer les symboles $ et $$ du LaTeX
            explanation_json = clean_latex_symbols(explanation_json)
            return explanation_json
        except json.JSONDecodeError:
            # Si ce n'est pas du JSON valide, retourner le texte brut
            logger.warning("La réponse n'est pas du JSON valide, retour du texte brut")
            return {
                "type": "Problème mathématique",
                "method": "Méthode standard",
                "steps": [
                    {
                        "step_number": 1,
                        "description": explanation_text,
                        "latex": latex_problem,
                        "explanation": "Explication générée par l'IA"
                    }
                ],
                "final_answer": wolfram_answer,
                "summary": explanation_text
            }
        
    except Exception as e:
        logger.error(f"Erreur lors de la génération de l'explication: {str(e)}")
        return {
            "type": "Erreur",
            "method": "N/A",
            "steps": [
                {
                    "step_number": 1,
                    "description": f"Erreur lors de la génération de l'explication: {str(e)}",
                    "latex": "",
                    "explanation": ""
                }
            ],
            "final_answer": wolfram_result.get("result", "N/A"),
            "summary": "Une erreur est survenue lors de la génération de l'explication."
        }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
