/**
 * Insère des blocs CTA dans le contenu HTML après chaque 3ème H2
 * 
 * @param {string} htmlContent - Le contenu HTML
 * @param {string} ctaHTML - Le HTML du bloc CTA à insérer
 * @returns {string} - Le HTML modifié avec les CTAs insérés
 */
export function insertCTAsInContent(htmlContent, ctaHTML) {
  if (!htmlContent || !ctaHTML) {
    return htmlContent;
  }

  try {
    // Nettoyer le HTML du CTA
    const cleanCTAHtml = ctaHTML.trim();
    
    if (!cleanCTAHtml) {
      console.warn('CTA HTML is empty after trim');
      return htmlContent;
    }
    
    // Trouver tous les H2 avec regex
    const h2Regex = /<h2[^>]*>.*?<\/h2>/gi;
    const matches = [];
    let match;
    
    // Réinitialiser lastIndex pour éviter les problèmes
    h2Regex.lastIndex = 0;
    
    while ((match = h2Regex.exec(htmlContent)) !== null) {
      matches.push({
        index: match.index,
        fullMatch: match[0]
      });
    }

    console.log(`Found ${matches.length} H2 elements in content`);

    if (matches.length === 0) {
      console.warn('No H2 elements found in content');
      return htmlContent;
    }

    // Insérer les CTAs en partant de la fin pour ne pas décaler les indices
    let result = htmlContent;
    let insertedCount = 0;

    for (let i = matches.length - 1; i >= 0; i--) {
      const h2Index = i + 1; // Index 1-based (1, 2, 3, ...)
      
      // Après le 3ème, 6ème, 9ème H2, etc.
      if (h2Index % 3 === 0) {
        // Trouver la fin de la balise H2 fermante
        const h2Start = matches[i].index;
        
        // Chercher la position après </h2>
        const afterH2 = result.indexOf('</h2>', h2Start);
        
        if (afterH2 !== -1) {
          const insertPosition = afterH2 + 5; // Après </h2> (5 caractères)
          // Ajouter un saut de ligne avant le CTA pour une meilleure lisibilité
          result = result.slice(0, insertPosition) + '\n' + cleanCTAHtml + '\n' + result.slice(insertPosition);
          insertedCount++;
          console.log(`Inserted CTA after H2 #${h2Index} at position ${insertPosition}`);
        } else {
          console.warn(`Could not find </h2> closing tag after H2 #${h2Index}`);
        }
      }
    }

    console.log(`Inserted ${insertedCount} CTAs after ${matches.length} H2 elements.`);

    return result;
  } catch (error) {
    console.error('Error inserting CTAs in content:', error);
    return htmlContent;
  }
}
