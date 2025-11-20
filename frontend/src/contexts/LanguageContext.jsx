import React, { createContext, useState, useContext, useEffect } from 'react';

const LanguageContext = createContext();

export const translations = {
  fr: {
    // App Globals
    appTitle: "Math Assistant",
    appSubtitle: "Résolvez vos problèmes mathématiques étape par étape",
    loading: "Analyse en cours...",
    analyzing: "Résolution du problème...",
    analyzingSub: "L'intelligence artificielle analyse les étapes...",
    error: "Une erreur est survenue",
    
    // Upload Screen
    uploadTitle: "Prenez une photo ou uploadez une image",
    uploadSubtitle: "Glissez-déposez votre fichier ici, ou",
    browse: "parcourez vos dossiers",
    formats: "Formats supportés: JPG, PNG, WebP",
    qualityTip: "Assurez-vous que l'image soit nette et bien éclairée",
    processing: "Traitement en cours...",
    or: "ou",
    enterManually: "Saisir manuellement",
    chooseFile: "Choisir un fichier",
    takePhoto: "Prendre une photo",
    
    // Problem Display
    problemDetected: "Problème détecté",
    edit: "Modifier",
    save: "Enregistrer",
    cancel: "Annuler",
    solveButton: "Résoudre",
    back: "Retour",
    
    // Solution Display
    solutionTitle: "Solution complète",
    problemSection: "Problème",
    stepsTitle: "Étapes de résolution",
    step: "Étape",
    note: "Note",
    finalAnswer: "Réponse finale",
    summary: "Résumé",
    newProblem: "Nouveau problème",
    exportPDF: "PDF",
    noSteps: "Aucune étape détaillée disponible.",
    type: "Type",
    method: "Méthode",
    
    // Chat
    chatTitle: "Discussion",
    chatPlaceholder: "Posez une question sur la solution...",
    chatSuggested: "Questions suggérées",
    whyStep: "Pourquoi cette étape ?",
    example: "Exemple similaire",
    explainConcept: "Expliquer le concept",
    otherMethod: "Autre méthode ?",
    commonErrors: "Erreurs fréquentes",
    send: "Envoyer",
    
    // History Sidebar
    history: "Historique",
    entries: "Entrées",
    clearHistory: "Tout effacer",
    emptyHistory: "Aucun historique",
    emptyHistorySub: "Vos résolutions apparaîtront ici",
    deleteConfirm: "Supprimer ce problème ?",
    clearConfirm: "Tout effacer ?",
    delete: "Supprimer",
    
    // Footer
    footerText: "Math Assistant. Créé par",
  },
  en: {
    // App Globals
    appTitle: "Math Assistant",
    appSubtitle: "Solve your math problems step by step",
    loading: "Analyzing...",
    analyzing: "Solving problem...",
    analyzingSub: "Artificial intelligence is analyzing the steps...",
    error: "An error occurred",
    
    // Upload Screen
    uploadTitle: "Take a photo or upload an image",
    uploadSubtitle: "Drag and drop your file here, or",
    browse: "browse your files",
    formats: "Supported formats: JPG, PNG, WebP",
    qualityTip: "Ensure the image is clear and well-lit",
    processing: "Processing...",
    or: "or",
    enterManually: "Enter manually",
    chooseFile: "Choose a file",
    takePhoto: "Take a photo",
    
    // Problem Display
    problemDetected: "Detected Problem",
    edit: "Edit",
    save: "Save",
    cancel: "Cancel",
    solveButton: "Solve",
    back: "Back",
    
    // Solution Display
    solutionTitle: "Full Solution",
    problemSection: "Problem",
    stepsTitle: "Resolution Steps",
    step: "Step",
    note: "Note",
    finalAnswer: "Final Answer",
    summary: "Summary",
    newProblem: "New Problem",
    exportPDF: "PDF",
    noSteps: "No detailed steps available.",
    type: "Type",
    method: "Method",
    
    // Chat
    chatTitle: "Discussion",
    chatPlaceholder: "Ask a question about the solution...",
    chatSuggested: "Suggested Questions",
    whyStep: "Why this step?",
    example: "Similar example",
    explainConcept: "Explain concept",
    otherMethod: "Other method?",
    commonErrors: "Common errors",
    send: "Send",
    
    // History Sidebar
    history: "History",
    entries: "Entries",
    clearHistory: "Clear all",
    emptyHistory: "No history",
    emptyHistorySub: "Your solutions will appear here",
    deleteConfirm: "Delete this problem?",
    clearConfirm: "Clear all history?",
    delete: "Delete",
    
    // Footer
    footerText: "Math Assistant. Created by",
  }
};

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('math-app-lang') || 'fr';
  });

  useEffect(() => {
    localStorage.setItem('math-app-lang', language);
  }, [language]);

  const t = (key) => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
