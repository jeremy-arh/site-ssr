'use client'

import Image from 'next/image'
import { Icon } from '@iconify/react'
import { openCrispChat } from '@/utils/crisp'

const CHAT_CTA_IMG_1 = '/images/chat-cta.webp'
const CHAT_CTA_IMG_2 = 'https://imagedelivery.net/l2xsuW0n52LVdJ7j0fQ5lA/fdd2c406-8968-42ec-8ebd-21efcd575d00/f=webp,q=80'

/**
 * CTA "Need assistance ? Speak with an expert." avec avatars des experts.
 * Ouvre le chat Crisp au clic.
 * @param {Object} props
 * @param {string} [props.textColor='text-black'] - Couleur du texte (text-black ou text-white)
 * @param {string} [props.analyticsContext='need_assistance'] - Contexte pour le tracking
 * @param {function} [props.onTrack] - Callback (ctaText, destination, elementId) pour le tracking
 * @param {string} [props.className=''] - Classes CSS additionnelles
 */
export default function NeedAssistanceCTA({
  textColor = 'text-black',
  analyticsContext = 'need_assistance',
  onTrack,
  className = '',
}) {
  const ctaText = 'Need assistance ? Speak with an expert.'
  const elementId = `${analyticsContext.replace(/\s/g, '_')}_cta`

  const handleClick = () => {
    openCrispChat({ forceLoad: true })
    onTrack?.(ctaText, 'crisp_chat', elementId)
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`need-assistance-cta inline-flex items-center gap-2 text-sm lg:text-base font-medium mb-8 lg:mb-12 transition-all duration-200 ${textColor} ${className}`.trim()}
    >
      <div className="flex items-center -space-x-2">
        <div className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden border-2 border-white shadow-md flex-shrink-0 z-10">
          <Image src={CHAT_CTA_IMG_1} alt="" fill className="object-cover" sizes="40px" />
        </div>
        <div className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden border-2 border-white shadow-md flex-shrink-0 z-0">
          <Image src={CHAT_CTA_IMG_2} alt="" fill className="object-cover" sizes="40px" />
        </div>
      </div>
      <span className="need-assistance-glow">{ctaText}</span>
      <Icon icon="si:arrow-right-fill" className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0 -rotate-45" />
    </button>
  )
}
