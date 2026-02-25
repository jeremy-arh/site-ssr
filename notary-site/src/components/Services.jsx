'use client'

import { useLanguage } from '../contexts/LanguageContext'
import { useTranslation } from '../hooks/useTranslation'
import { useServicesList } from '../hooks/useServices'
import { formatServicesForLanguage } from '../utils/services'
import ServicesGridBlock from './ServicesGridBlock'

const Services = ({ servicesData = null }) => {
  const { language } = useLanguage()
  const { t } = useTranslation()

  const hookResult = useServicesList({ showInListOnly: true })

  const allServices = servicesData
    ? formatServicesForLanguage(servicesData.filter(s => s.show_in_list === true), language)
    : hookResult.services
  const isLoading = servicesData ? false : hookResult.isLoading

  return (
    <ServicesGridBlock
      services={allServices}
      title={`${t('services.heading')} ${t('services.headingHighlight')}`}
      analyticsContext="homepage_services"
      isLoading={isLoading}
    />
  )
}

export default Services;
