/**
 * Extrait les FAQs depuis le HTML avec microdata Schema.org
 * et les convertit en format JSON-LD
 * 
 * @param {string} htmlContent - Le contenu HTML avec microdata
 * @returns {Array<{question: string, answer: string}>} - Tableau des FAQs extraites
 */
export function extractFAQsFromHTML(htmlContent) {
  if (!htmlContent) {
    return [];
  }

  try {
    // Utiliser DOMParser si disponible (côté client)
    if (typeof DOMParser !== 'undefined') {
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlContent, 'text/html');
      
      // Trouver la section FAQPage
      const faqSection = doc.querySelector('section[itemscope][itemtype="https://schema.org/FAQPage"]');
      
      if (!faqSection) {
        return [];
      }

      // Extraire toutes les questions
      const questions = faqSection.querySelectorAll('details[itemscope][itemtype="https://schema.org/Question"]');
      
      const faqs = Array.from(questions).map((questionElement) => {
        // Extraire la question depuis summary avec itemprop="name"
        const summary = questionElement.querySelector('summary[itemprop="name"]');
        let questionText = '';
        if (summary) {
          // Récupérer le texte, en gérant les balises <strong> etc.
          questionText = summary.textContent.trim();
          // Si le texte est vide, essayer de récupérer depuis innerHTML et nettoyer
          if (!questionText && summary.innerHTML) {
            const tempDiv = doc.createElement('div');
            tempDiv.innerHTML = summary.innerHTML;
            questionText = tempDiv.textContent.trim();
          }
        }

        // Extraire la réponse depuis div avec itemprop="acceptedAnswer"
        const answerDiv = questionElement.querySelector('div[itemscope][itemtype="https://schema.org/Answer"]');
        let answerText = '';
        if (answerDiv) {
          // Chercher d'abord un paragraphe avec itemprop="text"
          const answerParagraph = answerDiv.querySelector('p[itemprop="text"]');
          if (answerParagraph) {
            answerText = answerParagraph.textContent.trim();
          } else {
            // Fallback: prendre tout le contenu textuel de la div
            answerText = answerDiv.textContent.trim();
          }
        }

        return {
          question: questionText,
          answer: answerText,
        };
      }).filter(faq => faq.question && faq.answer); // Filtrer les FAQs vides

      return faqs;
    }
    
    // Fallback côté serveur avec regex (moins précis mais fonctionne)
    // Cette approche est utilisée si DOMParser n'est pas disponible
    const faqSectionRegex = /<section[^>]*itemscope[^>]*itemtype=["']https:\/\/schema\.org\/FAQPage["'][^>]*>([\s\S]*?)<\/section>/i;
    const match = htmlContent.match(faqSectionRegex);
    
    if (!match) {
      return [];
    }

    const faqSectionContent = match[1];
    const questionRegex = /<details[^>]*itemscope[^>]*itemtype=["']https:\/\/schema\.org\/Question["'][^>]*>([\s\S]*?)<\/details>/gi;
    const questions = [];
    let questionMatch;

    while ((questionMatch = questionRegex.exec(faqSectionContent)) !== null) {
      const questionContent = questionMatch[1];
      
      // Extraire la question depuis summary (gérer les balises comme <strong>)
      const summaryMatch = questionContent.match(/<summary[^>]*itemprop=["']name["'][^>]*>([\s\S]*?)<\/summary>/i);
      let questionText = '';
      if (summaryMatch) {
        // Nettoyer le HTML pour obtenir le texte brut
        questionText = summaryMatch[1]
          .replace(/<strong>/gi, '')
          .replace(/<\/strong>/gi, '')
          .replace(/<[^>]*>/g, '')
          .trim();
      }

      // Extraire la réponse depuis div avec acceptedAnswer
      const answerMatch = questionContent.match(/<div[^>]*itemscope[^>]*itemtype=["']https:\/\/schema\.org\/Answer["'][^>]*>([\s\S]*?)<\/div>/i);
      const answerContent = answerMatch ? answerMatch[1] : '';
      const answerParagraphMatch = answerContent.match(/<p[^>]*itemprop=["']text["'][^>]*>([\s\S]*?)<\/p>/i);
      const answerText = answerParagraphMatch ? answerParagraphMatch[1].replace(/<[^>]*>/g, '').trim() : '';

      if (questionText && answerText) {
        questions.push({
          question: questionText,
          answer: answerText,
        });
      }
    }

    return questions;
  } catch (error) {
    console.error('Error extracting FAQs from HTML:', error);
    return [];
  }
}

