import { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE } from '@/utils/language'
import { redirect } from 'next/navigation'
import PrivacyPolicyClient from '../../privacy-policy/PrivacyPolicyClient'

// Générer les métadonnées avec canonical pour chaque langue
// eslint-disable-next-line react-refresh/only-export-components
export async function generateMetadata({ params }) {
  const { lang } = await params
  return {
    alternates: {
      canonical: `https://www.mynotary.io/${lang}/privacy-policy`,
    },
  }
}

export default async function LangPrivacyPolicy({ params }) {
  const { lang } = await params

  if (!SUPPORTED_LANGUAGES.includes(lang) || lang === DEFAULT_LANGUAGE) {
    redirect('/privacy-policy')
  }

  return <PrivacyPolicyClient />
}
