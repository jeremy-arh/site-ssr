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
 * Détermine le domaine du cookie selon l'environnement
 * @returns {string|null} Le domaine du cookie ou null pour le domaine actuel
 */
function getCookieDomain() {
  if (typeof window === 'undefined') {
    return null
  }

  const hostname = window.location.hostname
  
  // Si c'est mynotary.io ou un sous-domaine, utiliser .mynotary.io pour le partage
  if (hostname.endsWith('.mynotary.io') || hostname === 'mynotary.io') {
    return '.mynotary.io'
  }
  
  // Pour Vercel, localhost, etc., ne pas spécifier de domaine
  // Le cookie sera limité au domaine exact
  return null
}

/**
 * Définit un cookie
 * @param {string} name - Le nom du cookie
 * @param {string} value - La valeur du cookie
 * @param {number} days - Nombre de jours avant expiration
 * @param {string|null} domain - Le domaine du cookie (optionnel, null = auto-détection)
 */
export function setCookie(name, value, days = 90, domain = null) {
  if (typeof document === 'undefined') {
    return
  }

  // Auto-détection du domaine si non spécifié
  const cookieDomain = domain !== null ? domain : getCookieDomain()

  const expires = new Date()
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000)
  
  const cookieParts = [
    `${name}=${value}`,
    `expires=${expires.toUTCString()}`,
    'path=/',
    'SameSite=Lax'
  ]

  if (cookieDomain) {
    cookieParts.push(`domain=${cookieDomain}`)
  }

  if (window.location.protocol === 'https:') {
    cookieParts.push('Secure')
  }

  document.cookie = cookieParts.join('; ')
}

