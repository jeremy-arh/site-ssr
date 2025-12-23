/**
 * Utilitaires pour la gestion des cookies
 */

/**
 * Récupère la valeur d'un cookie par son nom
 * @param {string} name - Le nom du cookie
 * @returns {string|null} La valeur du cookie ou null si non trouvé
 */
export function getCookie(name) {
  if (typeof document === 'undefined') {
    return null
  }

  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  
  if (parts.length === 2) {
    return parts.pop().split(';').shift()
  }
  
  return null
}

/**
 * Récupère la valeur du gclid (Google Click ID)
 * @returns {string|null} La valeur du gclid ou null si non trouvé
 */
export function getGclid() {
  return getCookie('gclid')
}

/**
 * Définit un cookie
 * @param {string} name - Le nom du cookie
 * @param {string} value - La valeur du cookie
 * @param {number} days - Nombre de jours avant expiration
 * @param {string} domain - Le domaine du cookie (optionnel, auto-détecté si non spécifié)
 */
export function setCookie(name, value, days = 90, domain = null) {
  if (typeof document === 'undefined') {
    return
  }

  const expires = new Date()
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000)
  
  // Détection automatique du domaine si non spécifié
  if (domain === null && typeof window !== 'undefined') {
    const hostname = window.location.hostname
    // Utiliser .mynotary.io seulement si on est sur ce domaine
    if (hostname.includes('mynotary.io')) {
      domain = '.mynotary.io'
    }
    // Sinon, pas de domaine spécifié (cookie lié au domaine actuel uniquement)
  }
  
  const cookieParts = [
    `${name}=${value}`,
    `expires=${expires.toUTCString()}`,
    'path=/',
    'SameSite=Lax'
  ]

  if (domain) {
    cookieParts.push(`domain=${domain}`)
  }

  if (typeof window !== 'undefined' && window.location.protocol === 'https:') {
    cookieParts.push('Secure')
  }

  document.cookie = cookieParts.join('; ')
}

