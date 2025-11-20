import { InlineMath } from 'react-katex'
import 'katex/dist/katex.min.css'
import { fixLatexInText } from '../utils/latexHelper'

/**
 * Composant pour afficher une description d'étape avec support LaTeX inline
 * Utilise une approche de regex simple et directe pour détecter les formules LaTeX
 */
function StepDescription({ description }) {
  if (!description) return null

  // Corriger le LaTeX mal formaté (rac{}{} -> \frac{}{}, etc.)
  let fixedText = fixLatexInText(description)

  // Fonction pour extraire les formules LaTeX avec une regex simple
  // Cette approche est plus directe et robuste
  const extractLatexFormulas = (text) => {
    const parts = []
    let lastIndex = 0

    // Pattern pour détecter \frac{...}{...} avec gestion des accolades imbriquées
    // On utilise une approche itérative pour gérer les accolades imbriquées
    const patterns = [
      // D'abord, chercher \frac{...}{...} (avec backslash)
      {
        regex: /\\frac\{/g,
        process: (match, index, text) => {
          let braceCount = 1
          let i = index + 6 // Après "\frac{"
          let endIndex = -1
          
          // Trouver la fin de la première paire d'accolades
          while (i < text.length && braceCount > 0) {
            if (text[i] === '{') braceCount++
            else if (text[i] === '}') braceCount--
            i++
          }
          
          // Maintenant chercher la deuxième paire d'accolades
          if (i < text.length && text[i] === '{') {
            braceCount = 1
            i++
            while (i < text.length && braceCount > 0) {
              if (text[i] === '{') braceCount++
              else if (text[i] === '}') braceCount--
              i++
            }
            endIndex = i
          }
          
          if (endIndex > index) {
            return {
              start: index,
              end: endIndex,
              content: text.substring(index, endIndex),
              type: 'latex'
            }
          }
          return null
        }
      },
      // Chercher rac{...}{...} (sans backslash, doit être converti en \frac)
      {
        regex: /rac\{/g,
        process: (match, index, text) => {
          let braceCount = 1
          let i = index + 4 // Après "rac{"
          let endIndex = -1
          
          // Trouver la fin de la première paire d'accolades
          while (i < text.length && braceCount > 0) {
            if (text[i] === '{') braceCount++
            else if (text[i] === '}') braceCount--
            i++
          }
          
          // Maintenant chercher la deuxième paire d'accolades
          if (i < text.length && text[i] === '{') {
            braceCount = 1
            i++
            while (i < text.length && braceCount > 0) {
              if (text[i] === '{') braceCount++
              else if (text[i] === '}') braceCount--
              i++
            }
            endIndex = i
          }
          
          if (endIndex > index) {
            const racContent = text.substring(index, endIndex)
            const fracContent = '\\frac' + racContent.substring(3) // Remplacer "rac" par "\frac"
            return {
              start: index,
              end: endIndex,
              content: fracContent,
              type: 'latex'
            }
          }
          return null
        }
      },
      // Chercher \sqrt{...}
      {
        regex: /\\sqrt\{/g,
        process: (match, index, text) => {
          let braceCount = 1
          let i = index + 6 // Après "\sqrt{"
          let endIndex = -1
          
          while (i < text.length && braceCount > 0) {
            if (text[i] === '{') braceCount++
            else if (text[i] === '}') braceCount--
            i++
          }
          endIndex = i
          
          if (endIndex > index) {
            return {
              start: index,
              end: endIndex,
              content: text.substring(index, endIndex),
              type: 'latex'
            }
          }
          return null
        }
      },
      // Chercher sqrt{...} (sans backslash)
      {
        regex: /sqrt\{/g,
        process: (match, index, text) => {
          // Vérifier qu'on n'est pas dans "rac{" (fraction)
          if (index > 0 && text[index - 1] === 'a' && text.substring(Math.max(0, index - 3), index) === 'r') {
            return null
          }
          // Vérifier qu'on n'est pas déjà dans une commande avec backslash
          if (index > 0 && text[index - 1] === '\\') {
            return null
          }
          
          let braceCount = 1
          let i = index + 5 // Après "sqrt{"
          let endIndex = -1
          
          while (i < text.length && braceCount > 0) {
            if (text[i] === '{') braceCount++
            else if (text[i] === '}') braceCount--
            i++
          }
          endIndex = i
          
          if (endIndex > index) {
            const sqrtContent = text.substring(index, endIndex)
            const sqrtCommand = '\\sqrt' + sqrtContent.substring(4) // Remplacer "sqrt" par "\sqrt"
            return {
              start: index,
              end: endIndex,
              content: sqrtCommand,
              type: 'latex'
            }
          }
          return null
        }
      },
      // Chercher \( ... \) pour inline LaTeX
      {
        regex: /\\\(([^)]+)\\\)/g,
        process: (match, index, text) => {
          return {
            start: index,
            end: index + match[0].length,
            content: match[1],
            type: 'latex'
          }
        }
      }
    ]

    const matches = []
    
    // Appliquer tous les patterns
    for (const pattern of patterns) {
      let match
      const regex = new RegExp(pattern.regex.source, pattern.regex.flags)
      while ((match = regex.exec(text)) !== null) {
        const result = pattern.process(match, match.index, text)
        if (result) {
          // Vérifier qu'il n'y a pas de chevauchement
          const isOverlapping = matches.some(m => 
            (result.start >= m.start && result.start < m.end) ||
            (result.end > m.start && result.end <= m.end) ||
            (result.start <= m.start && result.end >= m.end)
          )
          if (!isOverlapping) {
            matches.push(result)
          }
        }
      }
    }

    // Trier par position
    matches.sort((a, b) => a.start - b.start)

    // Construire les parties
    for (const match of matches) {
      // Ajouter le texte avant
      if (match.start > lastIndex) {
        parts.push({ type: 'text', content: text.substring(lastIndex, match.start) })
      }
      
      // Ajouter la formule LaTeX
      parts.push({ type: 'latex', content: match.content })
      
      lastIndex = match.end
    }

    // Ajouter le reste du texte
    if (lastIndex < text.length) {
      parts.push({ type: 'text', content: text.substring(lastIndex) })
    }

    return parts.length > 0 ? parts : [{ type: 'text', content: text }]
  }

  const parts = extractLatexFormulas(fixedText)

  return (
    <>
      {parts.map((part, index) => {
        if (part.type === 'latex') {
          try {
            // Nettoyer le contenu LaTeX
            let cleanLatex = part.content.trim()
            
            // S'assurer que les commandes sont bien formatées
            if (cleanLatex.startsWith('rac{')) {
              cleanLatex = '\\frac' + cleanLatex.substring(3)
            }
            
            return (
              <span key={index} className="inline-block mx-0.5 align-middle">
                <InlineMath math={cleanLatex} />
              </span>
            )
          } catch (e) {
            console.warn('Erreur de rendu LaTeX:', part.content, e)
            return (
              <span key={index} className="font-mono text-sm text-red-600 dark:text-red-400">
                {part.content}
              </span>
            )
          }
        }
        return <span key={index}>{part.content}</span>
      })}
    </>
  )
}

export default StepDescription
