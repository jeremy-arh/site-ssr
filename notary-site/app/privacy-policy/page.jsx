import PrivacyPolicyClient from './PrivacyPolicyClient'

// Métadonnées avec canonical et hreflang
// eslint-disable-next-line react-refresh/only-export-components
export const metadata = {
  alternates: {
    canonical: 'https://www.mynotary.io/privacy-policy',
    languages: {
      'x-default': 'https://www.mynotary.io/privacy-policy',
      'en': 'https://www.mynotary.io/privacy-policy',
      'fr': 'https://www.mynotary.io/fr/privacy-policy',
      'es': 'https://www.mynotary.io/es/privacy-policy',
      'de': 'https://www.mynotary.io/de/privacy-policy',
      'it': 'https://www.mynotary.io/it/privacy-policy',
      'pt': 'https://www.mynotary.io/pt/privacy-policy',
    },
  },
}

export default function PrivacyPolicy() {
  return <PrivacyPolicyClient />
}
