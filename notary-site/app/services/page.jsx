import { getServicesFromFiles } from '@/lib/data-loader'
import ServicesClient from './ServicesClient'

// Cette page est un Server Component qui récupère les données depuis les fichiers JSON pré-générés
export default async function Services() {
  // Récupérer les services depuis les fichiers JSON (générés par prebuild)
  const servicesData = getServicesFromFiles()

  return <ServicesClient servicesData={servicesData} />
}
