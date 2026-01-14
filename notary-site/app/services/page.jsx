import { getServices } from '@/lib/supabase-server'
import ServicesClient from './ServicesClient'

// Forcer le rendu dynamique (SSR) - pas de prerendering statique
export const dynamic = 'force-dynamic'

// Métadonnées avec canonical
export const metadata = {
  alternates: {
    canonical: 'https://www.mynotary.io/services',
  },
}

export default async function Services() {
  const servicesData = await getServices()
  return <ServicesClient servicesData={servicesData} />
}
