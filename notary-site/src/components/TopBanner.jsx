'use client'

import { memo } from 'react'

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
              <div className="flex gap-0.5 items-center">
                {[...Array(5)].map((_, i) => (
                  <svg 
                    key={i} 
                    className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#04DA8D] flex-shrink-0" 
                    viewBox="0 0 20 20" 
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="whitespace-nowrap">161 reviews</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
})

TopBanner.displayName = 'TopBanner'

export default TopBanner

