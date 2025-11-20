/**
 * Utilitaires pour détecter et corriger le LaTeX dans les textes
 */

/**
 * Détecte et corrige les formules LaTeX mal formatées dans un texte
 * Ex: "rac{-4}{2}" -> "\frac{-4}{2}"
 */
export function fixLatexInText(text) {
  if (!text || typeof text !== 'string') return text

  // 1. NETTOYAGE AGRESSIF : Suppression des caractères de contrôle
  // Le caractère \f (Form Feed, \x0C) est le coupable principal qui s'affiche comme un carré ou casse le rendu
  // On supprime aussi tous les caractères ASCII de contrôle non imprimables
  let clean = text.replace(/\f/g, '').replace(/\x0c/g, '').replace(/[\x00-\x08\x0B\x0E-\x1F\x7F]/g, '')

  // 2. CORRECTIONS DE SYNTAXE
  
  // "rac{a}{b}" -> "\frac{a}{b}"
  clean = clean.replace(/rac\{([^}]+)\}\{([^}]+)\}/g, '\\frac{$1}{$2}')
  
  // "sqrt{a}" sans backslash -> "\sqrt{a}"
  clean = clean.replace(/(?<!\\)sqrt\{/g, '\\sqrt{')
  
  // Commandes mathématiques courantes sans backslash
  const commonCommands = [
    'int', 'sum', 'pi', 'infty', 'theta', 'alpha', 'beta', 'gamma', 'delta', 
    'sigma', 'omega', 'lambda', 'mu', 'phi', 'psi', 'rho', 'tau', 'approx',
    'neq', 'leq', 'geq', 'pm', 'times', 'div'
  ]
  
  commonCommands.forEach(cmd => {
    const regex = new RegExp(`(?<!\\\\)\\b${cmd}\\b`, 'g')
    clean = clean.replace(regex, `\\${cmd}`)
  })

  return clean.trim()
}
