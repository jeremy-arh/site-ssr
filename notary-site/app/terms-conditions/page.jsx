import TermsConditionsClient from './TermsConditionsClient'

// Métadonnées avec canonical
export const metadata = {
  alternates: {
    canonical: 'https://www.mynotary.io/terms-conditions',
  },
}

export default function TermsConditions() {
  return <TermsConditionsClient />
}
