import PrivacyPolicyClient from './PrivacyPolicyClient'

// Métadonnées avec canonical
export const metadata = {
  alternates: {
    canonical: 'https://www.mynotary.io/privacy-policy',
  },
}

export default function PrivacyPolicy() {
  return <PrivacyPolicyClient />
}
