import { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE } from '@/utils/language'
import { redirect } from 'next/navigation'
import TermsConditionsClient from './TermsConditionsClient'

export default async function LangTermsConditions({ params }) {
  const { lang } = await params

  if (!SUPPORTED_LANGUAGES.includes(lang) || lang === DEFAULT_LANGUAGE) {
    redirect('/terms-conditions')
  }

  return <TermsConditionsClient />
}
