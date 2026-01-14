'use client'

import { memo } from 'react'
import Image from 'next/image'

const TopBanner = memo(() => {
  return (
    <div className="top-banner-container">
      <div className="top-banner-inner">
        <div className="w-full px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="flex items-center justify-between text-white text-[10px] xs:text-xs sm:text-sm">
            {/* Left - Customers count - visible sur tous les écrans */}
            <div className="flex items-center flex-shrink-0">
              <span className="whitespace-nowrap">Already over 5000 customers</span>
            </div>

            {/* Right - Reviews avec étoiles vertes */}
            <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
              <span className="font-semibold whitespace-nowrap">4.7 Excellent</span>
              <div className="relative w-12 h-2.5 sm:w-14 sm:h-3 flex-shrink-0">
                <Image
                  src="https://imagedelivery.net/l2xsuW0n52LVdJ7j0fQ5lA/ec7e0448-41ea-4fef-ee59-b617ab362f00/public"
                  alt="5 stars"
                  fill
                  className="object-contain object-left"
                  unoptimized
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
})

TopBanner.displayName = 'TopBanner'

export default TopBanner

