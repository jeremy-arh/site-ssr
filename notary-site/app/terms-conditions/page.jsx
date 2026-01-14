import TermsConditionsClient from './TermsConditionsClient'

// Métadonnées avec canonical
// eslint-disable-next-line react-refresh/only-export-components
export const metadata = {
  alternates: {
    canonical: 'https://www.mynotary.io/terms-conditions',
  },
}

export default function TermsConditions() {
  return <TermsConditionsClient />
}
