import TermsConditionsClient from './TermsConditionsClient'

// Métadonnées avec canonical et hreflang
// eslint-disable-next-line react-refresh/only-export-components
export const metadata = {
  alternates: {
    canonical: 'https://www.mynotary.io/terms-conditions',
    languages: {
      'x-default': 'https://www.mynotary.io/terms-conditions',
      'en': 'https://www.mynotary.io/terms-conditions',
      'fr': 'https://www.mynotary.io/fr/terms-conditions',
      'es': 'https://www.mynotary.io/es/terms-conditions',
      'de': 'https://www.mynotary.io/de/terms-conditions',
      'it': 'https://www.mynotary.io/it/terms-conditions',
      'pt': 'https://www.mynotary.io/pt/terms-conditions',
    },
  },
}

export default function TermsConditions() {
  return <TermsConditionsClient />
}
