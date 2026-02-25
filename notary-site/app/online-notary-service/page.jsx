import OnlineNotaryServiceClient from './OnlineNotaryServiceClient'
import { getServices } from '@/lib/supabase-server'
import { formatServicesForLanguage } from '@/utils/services'
import { DEFAULT_LANGUAGE } from '@/utils/language'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Online Notary Service | Notarize Documents Online in Minutes',
  description: 'Professional online notary service. Get your documents notarized online 24/7. Fast, secure, and legally recognized worldwide. Certified true copies, affidavits, apostilles & more.',
  alternates: {
    canonical: 'https://www.mynotary.io/online-notary-service',
  },
}

export default async function OnlineNotaryServicePage() {
  const servicesData = await getServices()
  const relatedServices = servicesData
    .filter(s => s.is_active && s.show_in_list)
    .slice(0, 9)

  const formattedRelatedServices = formatServicesForLanguage(relatedServices, DEFAULT_LANGUAGE)

  return (
    <OnlineNotaryServiceClient
      relatedServicesData={formattedRelatedServices}
    />
  )
}
