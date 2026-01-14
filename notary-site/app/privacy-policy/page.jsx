import PrivacyPolicyClient from './PrivacyPolicyClient'

// Métadonnées avec canonical
// eslint-disable-next-line react-refresh/only-export-components
export const metadata = {
  alternates: {
    canonical: 'https://www.mynotary.io/privacy-policy',
  },
}

export default function PrivacyPolicy() {
  return <PrivacyPolicyClient />
}
