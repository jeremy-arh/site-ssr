import { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE } from '@/utils/language'
import { redirect } from 'next/navigation'
import PrivacyPolicyClient from './PrivacyPolicyClient'

export default async function LangPrivacyPolicy({ params }) {
  const { lang } = await params

  if (!SUPPORTED_LANGUAGES.includes(lang) || lang === DEFAULT_LANGUAGE) {
    redirect('/privacy-policy')
  }

  return <PrivacyPolicyClient />
}
