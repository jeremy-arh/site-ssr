import { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE } from '@/utils/language'
import { redirect } from 'next/navigation'
import TermsConditionsClient from '../../terms-conditions/TermsConditionsClient'

// Générer les métadonnées avec canonical et hreflang pour chaque langue
// eslint-disable-next-line react-refresh/only-export-components
export async function generateMetadata({ params }) {
  const { lang } = await params
  return {
    alternates: {
      canonical: `https://www.mynotary.io/${lang}/terms-conditions`,
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
}

export default async function LangTermsConditions({ params }) {
  const { lang } = await params

  if (!SUPPORTED_LANGUAGES.includes(lang) || lang === DEFAULT_LANGUAGE) {
    redirect('/terms-conditions')
  }

  return <TermsConditionsClient serverLanguage={lang} />
}
