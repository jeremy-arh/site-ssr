/**
 * Normalise une chaîne de caractères pour la recherche (minuscules, suppression des accents)
 * @param {string} str - La chaîne à normaliser
 * @returns {string} La chaîne normalisée
 */
const normalizeString = (str) => {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Supprime les accents
    .trim();
};

/**
 * Calcule un score de similarité entre deux chaînes
 * @param {string} text - Le texte dans lequel chercher
 * @param {string} query - La requête de recherche
 * @returns {number} Score entre 0 et 1 (1 = correspondance parfaite)
 */
const calculateSimilarity = (text, query) => {
  const normalizedText = normalizeString(text);
  const normalizedQuery = normalizeString(query);
  
  if (!normalizedQuery) return 1;
  if (!normalizedText) return 0;
  
  // Correspondance exacte
  if (normalizedText === normalizedQuery) return 1;
  
  // Commence par la requête
  if (normalizedText.startsWith(normalizedQuery)) return 0.9;
  
  // Contient la requête complète
  if (normalizedText.includes(normalizedQuery)) return 0.8;
  
  // Recherche de mots individuels
  const queryWords = normalizedQuery.split(/\s+/).filter(word => word.length > 0);
  const textWords = normalizedText.split(/\s+/);
  
  if (queryWords.length === 0) return 0;
  
  let matchedWords = 0;
  let totalWordScore = 0;
  
  queryWords.forEach(queryWord => {
    let bestMatch = 0;
    textWords.forEach(textWord => {
      if (textWord.startsWith(queryWord)) {
        bestMatch = Math.max(bestMatch, 0.7);
      } else if (textWord.includes(queryWord)) {
        bestMatch = Math.max(bestMatch, 0.5);
      } else {
        // Recherche de caractères dans l'ordre
        let queryIndex = 0;
        for (let i = 0; i < textWord.length && queryIndex < queryWord.length; i++) {
          if (textWord[i] === queryWord[queryIndex]) {
            queryIndex++;
          }
        }
        if (queryIndex === queryWord.length) {
          bestMatch = Math.max(bestMatch, 0.3);
        }
      }
    });
    
    if (bestMatch > 0) {
      matchedWords++;
      totalWordScore += bestMatch;
    }
  });
  
  // Score basé sur le nombre de mots correspondants et leur qualité
  const wordMatchRatio = matchedWords / queryWords.length;
  const averageWordScore = matchedWords > 0 ? totalWordScore / matchedWords : 0;
  
  return wordMatchRatio * averageWordScore;
};

/**
 * Effectue une recherche floue dans une liste de FAQs
 * @param {Array} faqs - Liste des FAQs à rechercher
 * @param {string} query - Requête de recherche
 * @param {number} threshold - Seuil minimum de score pour inclure un résultat (0-1)
 * @returns {Array} Liste des FAQs filtrées et triées par score décroissant
 */
export const fuzzySearchFAQs = (faqs, query, threshold = 0.1) => {
  if (!query || query.trim().length === 0) {
    return faqs.map((faq, index) => ({ ...faq, originalIndex: index, score: 1 }));
  }
  
  const results = faqs.map((faq, index) => {
    const questionScore = calculateSimilarity(faq.question, query);
    const answerScore = calculateSimilarity(faq.answer, query);
    
    // Le score de la question a plus de poids que celui de la réponse
    const totalScore = questionScore * 0.7 + answerScore * 0.3;
    
    return {
      ...faq,
      originalIndex: index,
      score: totalScore
    };
  });
  
  // Filtrer par seuil et trier par score décroissant
  return results
    .filter(result => result.score >= threshold)
    .sort((a, b) => b.score - a.score);
};

/**
 * Effectue une recherche floue dans une liste de services
 * @param {Array} services - Liste des services à rechercher
 * @param {string} query - Requête de recherche
 * @param {number} threshold - Seuil minimum de score pour inclure un résultat (0-1)
 * @returns {Array} Liste des services filtrés et triés par score décroissant
 */
export const fuzzySearchServices = (services, query, threshold = 0.1) => {
  if (!query || query.trim().length === 0) {
    return services.map((service, index) => ({ ...service, originalIndex: index, score: 1 }));
  }
  
  const results = services.map((service, index) => {
    const name = service.name || service.list_title || '';
    const description = service.description || service.short_description || '';
    
    const nameScore = calculateSimilarity(name, query);
    const descriptionScore = calculateSimilarity(description, query);
    
    // Le score du nom a plus de poids que celui de la description
    const totalScore = nameScore * 0.7 + descriptionScore * 0.3;
    
    return {
      ...service,
      originalIndex: index,
      score: totalScore
    };
  });
  
  // Filtrer par seuil et trier par score décroissant
  return results
    .filter(result => result.score >= threshold)
    .sort((a, b) => b.score - a.score);
};

