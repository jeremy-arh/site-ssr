import { getServices } from '@/lib/supabase-server'
import ServicesClient from './ServicesClient'

// Cette page est un Server Component qui récupère les données côté serveur (SSR)
export default async function Services() {
  // Récupérer les services côté serveur
  const servicesData = await getServices()

  return <ServicesClient servicesData={servicesData} />
}
