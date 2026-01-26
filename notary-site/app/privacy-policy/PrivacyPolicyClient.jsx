'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { memo } from 'react'
import SEOHead from '@/components/SEOHead'
import { useTranslation } from '@/hooks/useTranslation'
import MobileCTA from '@/components/MobileCTA'

// SVG Icon inline pour éviter @iconify/react
const IconArrowLeft = memo(() => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M19 12H5M12 19l-7-7 7-7"/>
  </svg>
));

IconArrowLeft.displayName = 'IconArrowLeft';

export default function PrivacyPolicyClient({ serverLanguage }) {
  const pathname = usePathname()
  // Utiliser la langue serveur pour éviter le flash
  const { t } = useTranslation(serverLanguage)
  
  return (
    <div className="min-h-screen">
      <SEOHead
        title={`Privacy Policy - ${t('seo.siteName')}`}
        description={`Privacy Policy for ${t('seo.siteName')} services`}
        ogTitle={`Privacy Policy - ${t('seo.siteName')}`}
        ogDescription={`Privacy Policy for ${t('seo.siteName')} services`}
        twitterTitle={`Privacy Policy - ${t('seo.siteName')}`}
        twitterDescription={`Privacy Policy for ${t('seo.siteName')} services`}
        serverLanguage={serverLanguage}
      />
      {/* Hero Section */}
      <section className="bg-gray-900 text-white pt-32 pb-16 px-[30px]">
        <div className="max-w-[1100px] mx-auto">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            Privacy Policy
          </h1>
          <p className="text-lg text-gray-300">
            Last updated: November 17, 2025
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-20 px-[30px]">
        <div className="max-w-[1100px] mx-auto">
          <div className="prose prose-lg max-w-none">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">MY NOTARY</h2>
              <hr className="border-gray-300 my-6" />
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mb-6 mt-12">1. INTRODUCTION</h2>
            <p className="text-gray-600 mb-6">
              My Notary (hereinafter "we", "our", "My Notary"), places great importance on protecting your personal data and respecting your privacy.
            </p>
            <p className="text-gray-600 mb-6">
              This Privacy Policy describes how we collect, use, store, and protect your personal data when you use our platform accessible via the website mynotary.io (hereinafter "the Platform").
            </p>
            <p className="text-gray-600 mb-6">
              This policy complies with applicable data protection regulations, including the General Data Protection Regulation (GDPR - Regulation EU 2016/679) where relevant.
            </p>

            <h2 className="text-3xl font-bold text-gray-900 mb-6 mt-12">2. DATA CONTROLLER</h2>
            <p className="text-gray-600 mb-4">The data controller for your personal data is:</p>
            <div className="text-gray-600 mb-6 space-y-2">
              <p><strong>My Notary</strong></p>
              <p>Email: <a href="mailto:support@mynotary.io" className="text-black font-semibold hover:underline">support@mynotary.io</a></p>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mb-6 mt-12">3. PERSONAL DATA COLLECTED</h2>
            
            <h3 className="text-2xl font-bold text-gray-900 mb-4 mt-8">3.1 Data Collected Directly</h3>
            <p className="text-gray-600 mb-4">We collect data that you provide directly when:</p>
            
            <p className="text-gray-600 mb-2 mt-4"><strong>Creating an account:</strong></p>
            <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
              <li>First and last name</li>
              <li>Email address</li>
              <li>Phone number</li>
              <li>Complete postal address</li>
              <li>Country of residence</li>
            </ul>

            <p className="text-gray-600 mb-2 mt-4"><strong>Booking and notarization:</strong></p>
            <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
              <li>Signatory information (first name, last name, email)</li>
              <li>Documents to be notarized</li>
              <li>Identity documents (passport, ID card, driver's license)</li>
              <li>Photograph of your face (during identity verification)</li>
              <li>Video recording of notarization session (in accordance with legal requirements)</li>
            </ul>

            <p className="text-gray-600 mb-2 mt-4"><strong>Payment:</strong></p>
            <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
              <li>Billing information</li>
              <li>Transaction data (via our payment provider Stripe)</li>
              <li>Payment history</li>
            </ul>

            <p className="text-gray-600 mb-2 mt-4"><strong>Communication:</strong></p>
            <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-2">
              <li>Content of your messages with our customer service</li>
              <li>Complaints and requests</li>
              <li>Communication preferences</li>
            </ul>

            <h3 className="text-2xl font-bold text-gray-900 mb-4 mt-8">3.2 Automatically Collected Data</h3>
            <p className="text-gray-600 mb-4">When using the Platform, we automatically collect:</p>
            
            <p className="text-gray-600 mb-2 mt-4"><strong>Connection data:</strong></p>
            <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
              <li>IP address</li>
              <li>Browser type and version</li>
              <li>Operating system</li>
              <li>Pages viewed and visit duration</li>
              <li>Referral source</li>
              <li>Approximate location data (based on IP)</li>
            </ul>

            <p className="text-gray-600 mb-2 mt-4"><strong>Cookies and similar technologies:</strong></p>
            <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-2">
              <li>Session identifiers</li>
              <li>User preferences</li>
              <li>Analytics data (via Google Tag Manager)</li>
            </ul>

            <h3 className="text-2xl font-bold text-gray-900 mb-4 mt-8">3.3 Sensitive Data</h3>
            <p className="text-gray-600 mb-4">
              We may process data considered sensitive under GDPR, including:
            </p>
            <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
              <li>Biometric data (facial recognition for identity verification)</li>
              <li>Data contained in your documents (which may reveal sensitive information)</li>
            </ul>
            <p className="text-gray-600 mb-6">
              Processing of this data is strictly necessary for the provision of our notarization services and is based on your explicit consent.
            </p>

            <h2 className="text-3xl font-bold text-gray-900 mb-6 mt-12">4. PURPOSES AND LEGAL BASES OF PROCESSING</h2>
            <p className="text-gray-600 mb-6">We process your personal data for the following purposes:</p>
            
            <h3 className="text-2xl font-bold text-gray-900 mb-4 mt-8">4.1 Contract Performance</h3>
            <p className="text-gray-600 mb-4"><strong>Purpose:</strong> Provide our notarization services</p>
            <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
              <li>Creating and managing your account</li>
              <li>Processing your bookings</li>
              <li>Organizing notarization sessions</li>
              <li>Verifying your identity</li>
              <li>Obtaining and sending apostilles</li>
              <li>Communication related to your orders</li>
            </ul>
            <p className="text-gray-600 mb-6"><strong>Legal basis:</strong> Contract performance (Article 6.1.b GDPR)</p>

            <h3 className="text-2xl font-bold text-gray-900 mb-4 mt-8">4.2 Legal Obligation</h3>
            <p className="text-gray-600 mb-4"><strong>Purpose:</strong> Comply with our legal obligations</p>
            <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
              <li>Retention of notarized documents and recordings</li>
              <li>Legal archiving of notarization acts</li>
              <li>Identity verification (fraud prevention and KYC compliance)</li>
              <li>Invoicing and accounting</li>
              <li>Response to requests from competent authorities</li>
            </ul>
            <p className="text-gray-600 mb-6"><strong>Legal basis:</strong> Legal obligation (Article 6.1.c GDPR)</p>

            <h3 className="text-2xl font-bold text-gray-900 mb-4 mt-8">4.3 Legitimate Interest</h3>
            <p className="text-gray-600 mb-4"><strong>Purpose:</strong> Improve our services and ensure security</p>
            <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
              <li>Analysis and improvement of the Platform</li>
              <li>Fraud detection and prevention</li>
              <li>IT system security</li>
              <li>Complaint and dispute management</li>
              <li>User experience optimization</li>
            </ul>
            <p className="text-gray-600 mb-6"><strong>Legal basis:</strong> Legitimate interest (Article 6.1.f GDPR)</p>

            <h3 className="text-2xl font-bold text-gray-900 mb-4 mt-8">4.4 Consent</h3>
            <p className="text-gray-600 mb-4"><strong>Purpose:</strong> Marketing and communication</p>
            <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
              <li>Sending newsletters and promotional offers</li>
              <li>Personalized marketing communication</li>
              <li>Non-essential cookies and advertising trackers</li>
            </ul>
            <p className="text-gray-600 mb-6">
              <strong>Legal basis:</strong> Consent (Article 6.1.a GDPR)
            </p>
            <p className="text-gray-600 mb-6">
              You may withdraw your consent at any time via unsubscribe links in our emails or by contacting us.
            </p>

            <h2 className="text-3xl font-bold text-gray-900 mb-6 mt-12">5. DATA RECIPIENTS</h2>
            <p className="text-gray-600 mb-6">Your personal data is accessible to the following categories of recipients:</p>
            
            <h3 className="text-2xl font-bold text-gray-900 mb-4 mt-8">5.1 Internal Recipients</h3>
            <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-2">
              <li>Authorized My Notary personnel (customer support, technical team)</li>
              <li>Partner notaries assigned to your case (limited access to necessary data)</li>
            </ul>

            <h3 className="text-2xl font-bold text-gray-900 mb-4 mt-8">5.2 Service Providers</h3>
            <p className="text-gray-600 mb-4">We use third-party providers for:</p>
            
            <p className="text-gray-600 mb-2 mt-4"><strong>Hosting and technical infrastructure:</strong></p>
            <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
              <li>Supabase (database hosting)</li>
              <li>Cloud services for secure document storage</li>
            </ul>

            <p className="text-gray-600 mb-2 mt-4"><strong>Payment:</strong></p>
            <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
              <li>Stripe (payment processing)</li>
            </ul>

            <p className="text-gray-600 mb-2 mt-4"><strong>Communication:</strong></p>
            <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
              <li>Transactional email services</li>
              <li>Secure video conferencing platform for RON sessions</li>
            </ul>

            <p className="text-gray-600 mb-2 mt-4"><strong>Analytics and marketing:</strong></p>
            <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
              <li>Google Tag Manager (traffic analysis)</li>
              <li>Conversion and optimization tools</li>
            </ul>

            <p className="text-gray-600 mb-2 mt-4"><strong>Postal services:</strong></p>
            <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-2">
              <li>Delivery providers for document shipping</li>
            </ul>

            <p className="text-gray-600 mb-6">
              All our providers are carefully selected and contractually bound to respect the confidentiality and security of your data.
            </p>

            <h3 className="text-2xl font-bold text-gray-900 mb-4 mt-8">5.3 Competent Authorities</h3>
            <p className="text-gray-600 mb-4">We may be required to communicate your data to legal authorities in case of:</p>
            <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-2">
              <li>Legal obligation</li>
              <li>Court order</li>
              <li>Protection of our legal rights</li>
            </ul>

            <h3 className="text-2xl font-bold text-gray-900 mb-4 mt-8">5.4 International Transfers</h3>
            <p className="text-gray-600 mb-4">
              Some of our providers may be located outside the European Union. In this case, we ensure that:
            </p>
            <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
              <li>The country benefits from an adequacy decision by the European Commission, or</li>
              <li>Appropriate safeguards are in place (EU-approved standard contractual clauses)</li>
            </ul>
            <p className="text-gray-600 mb-6">
              Transfers to the United States are carried out as part of the notarization service execution, which requires the intervention of certified notaries.
            </p>

            <h2 className="text-3xl font-bold text-gray-900 mb-6 mt-12">6. RETENTION PERIOD</h2>
            <p className="text-gray-600 mb-6">
              We retain your personal data only for the duration necessary for the purposes for which it was collected.
            </p>
            
            <h3 className="text-2xl font-bold text-gray-900 mb-4 mt-8">6.1 Account Data</h3>
            <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-2">
              <li><strong>Active account:</strong> throughout the duration of Platform use</li>
              <li><strong>Inactive account:</strong> 3 years after last activity, then deletion</li>
              <li><strong>After account deletion:</strong> immediate deletion, except legal obligations</li>
            </ul>

            <h3 className="text-2xl font-bold text-gray-900 mb-4 mt-8">6.2 Notarization Documents and Recordings</h3>
            <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-2">
              <li><strong>Notarized documents:</strong> retained for minimum 10 years (legal obligation)</li>
              <li><strong>Video recordings:</strong> retained for 10 years (in accordance with notarization requirements)</li>
              <li><strong>Identity documents:</strong> retained for the duration of contractual relationship + 5 years</li>
            </ul>

            <h3 className="text-2xl font-bold text-gray-900 mb-4 mt-8">6.3 Payment Data</h3>
            <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-2">
              <li><strong>Billing information:</strong> 10 years (accounting obligation)</li>
              <li><strong>Credit card data:</strong> not retained by My Notary (managed by Stripe)</li>
            </ul>

            <h3 className="text-2xl font-bold text-gray-900 mb-4 mt-8">6.4 Communication Data</h3>
            <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-2">
              <li><strong>Support exchanges:</strong> 3 years after last interaction</li>
              <li><strong>Complaints:</strong> time necessary for dispute processing + 5 years</li>
            </ul>

            <h3 className="text-2xl font-bold text-gray-900 mb-4 mt-8">6.5 Marketing Data</h3>
            <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-2">
              <li><strong>Active consent:</strong> until consent withdrawal</li>
              <li><strong>Inactivity:</strong> 3 years without interaction, then deletion</li>
            </ul>

            <h2 className="text-3xl font-bold text-gray-900 mb-6 mt-12">7. YOUR RIGHTS</h2>
            <p className="text-gray-600 mb-6">
              In accordance with GDPR, you have the following rights regarding your personal data:
            </p>
            
            <h3 className="text-2xl font-bold text-gray-900 mb-4 mt-8">7.1 Right of Access</h3>
            <p className="text-gray-600 mb-4">You have the right to obtain:</p>
            <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-2">
              <li>Confirmation that your data is being processed</li>
              <li>A copy of your personal data</li>
              <li>Information about processing purposes</li>
            </ul>

            <h3 className="text-2xl font-bold text-gray-900 mb-4 mt-8">7.2 Right of Rectification</h3>
            <p className="text-gray-600 mb-6">
              You may request correction of inaccurate or incomplete data.
            </p>

            <h3 className="text-2xl font-bold text-gray-900 mb-4 mt-8">7.3 Right to Erasure ("right to be forgotten")</h3>
            <p className="text-gray-600 mb-4">You may request deletion of your data in the following cases:</p>
            <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
              <li>Data is no longer necessary</li>
              <li>You withdraw your consent</li>
              <li>You object to processing</li>
              <li>Data has been unlawfully processed</li>
            </ul>
            <p className="text-gray-600 mb-6">
              <strong>Limitations:</strong> This right does not apply to data we must retain to comply with legal obligations (notarized documents, recordings, accounting data).
            </p>

            <h3 className="text-2xl font-bold text-gray-900 mb-4 mt-8">7.4 Right to Restriction of Processing</h3>
            <p className="text-gray-600 mb-4">You may request restriction of processing in certain situations:</p>
            <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-2">
              <li>You contest the accuracy of data</li>
              <li>Processing is unlawful but you do not wish erasure</li>
              <li>You need the data to establish, exercise, or defend legal rights</li>
            </ul>

            <h3 className="text-2xl font-bold text-gray-900 mb-4 mt-8">7.5 Right to Data Portability</h3>
            <p className="text-gray-600 mb-6">
              You may receive your data in a structured, commonly used format and transmit it to another data controller.
            </p>

            <h3 className="text-2xl font-bold text-gray-900 mb-4 mt-8">7.6 Right to Object</h3>
            <p className="text-gray-600 mb-4">You may object to processing of your data:</p>
            <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-2">
              <li>For reasons relating to your particular situation (processing based on legitimate interest)</li>
              <li>At any time for direct marketing</li>
            </ul>

            <h3 className="text-2xl font-bold text-gray-900 mb-4 mt-8">7.7 Right to Withdraw Consent</h3>
            <p className="text-gray-600 mb-6">
              When processing is based on your consent, you may withdraw it at any time. This does not affect the lawfulness of processing performed before withdrawal.
            </p>

            <h3 className="text-2xl font-bold text-gray-900 mb-4 mt-8">7.8 Right to Define Post-Mortem Directives</h3>
            <p className="text-gray-600 mb-6">
              You may define directives regarding retention, erasure, and communication of your data after your death.
            </p>

            <h3 className="text-2xl font-bold text-gray-900 mb-4 mt-8">7.9 Exercising Your Rights</h3>
            <p className="text-gray-600 mb-4">
              To exercise your rights, contact us at: <a href="mailto:support@mynotary.io" className="text-black font-semibold hover:underline">support@mynotary.io</a>
            </p>
            <p className="text-gray-600 mb-4">
              We commit to responding within a maximum of one month from receipt of your request.
            </p>
            <p className="text-gray-600 mb-6">
              You must provide proof of identity for security reasons.
            </p>

            <h3 className="text-2xl font-bold text-gray-900 mb-4 mt-8">7.10 Right to Lodge a Complaint</h3>
            <p className="text-gray-600 mb-4">
              If you believe your rights are not being respected, you may lodge a complaint with the competent data protection authority in your place of habitual residence, your place of work, or the place of the alleged infringement.
            </p>

            <h2 className="text-3xl font-bold text-gray-900 mb-6 mt-12">8. DATA SECURITY</h2>
            <p className="text-gray-600 mb-6">
              We implement appropriate technical and organizational measures to protect your personal data against:
            </p>
            <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-2">
              <li>Unauthorized access</li>
              <li>Accidental loss</li>
              <li>Destruction</li>
              <li>Alteration</li>
              <li>Unauthorized disclosure</li>
            </ul>
            
            <h3 className="text-2xl font-bold text-gray-900 mb-4 mt-8">8.1 Technical Measures</h3>
            <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-2">
              <li><strong>Encryption:</strong> SSL/TLS encryption for all data transmissions</li>
              <li><strong>Encryption at rest:</strong> Documents and sensitive data encrypted in database</li>
              <li><strong>Strong authentication:</strong> Account protection by secure passwords</li>
              <li><strong>Monitoring:</strong> Continuous system monitoring to detect intrusions</li>
              <li><strong>Backups:</strong> Regular and secure data backups</li>
            </ul>

            <h3 className="text-2xl font-bold text-gray-900 mb-4 mt-8">8.2 Organizational Measures</h3>
            <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-2">
              <li><strong>Limited access:</strong> Only authorized persons have access to data</li>
              <li><strong>Training:</strong> Personnel trained in data protection</li>
              <li><strong>Confidentiality:</strong> Confidentiality clauses with all employees and providers</li>
              <li><strong>Security policy:</strong> Strict internal security procedures</li>
              <li><strong>Audits:</strong> Regular reviews of our security practices</li>
            </ul>

            <h3 className="text-2xl font-bold text-gray-900 mb-4 mt-8">8.3 Breach Notification</h3>
            <p className="text-gray-600 mb-6">
              In case of a data breach likely to result in a high risk to your rights and freedoms, we will inform you as soon as possible in accordance with GDPR.
            </p>

            <h2 className="text-3xl font-bold text-gray-900 mb-6 mt-12">9. COOKIES AND SIMILAR TECHNOLOGIES</h2>
            
            <h3 className="text-2xl font-bold text-gray-900 mb-4 mt-8">9.1 What is a Cookie?</h3>
            <p className="text-gray-600 mb-6">
              A cookie is a small text file placed on your device when you visit the Platform. Cookies allow recognition of your browser and collection of information.
            </p>

            <h3 className="text-2xl font-bold text-gray-900 mb-4 mt-8">9.2 Types of Cookies Used</h3>
            
            <p className="text-gray-600 mb-2 mt-4"><strong>Strictly Necessary Cookies:</strong></p>
            <p className="text-gray-600 mb-4">These cookies are essential for Platform operation:</p>
            <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
              <li>Authentication and security</li>
              <li>Shopping cart and session</li>
              <li>Load balancing</li>
            </ul>
            <p className="text-gray-600 mb-6">These cookies do not require your consent.</p>

            <p className="text-gray-600 mb-2 mt-4"><strong>Performance and Analytics Cookies:</strong></p>
            <p className="text-gray-600 mb-4">These cookies help us understand how visitors use the Platform:</p>
            <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
              <li>Google Tag Manager</li>
              <li>Traffic statistics</li>
              <li>Conversion measurement</li>
            </ul>

            <p className="text-gray-600 mb-2 mt-4"><strong>Functionality Cookies:</strong></p>
            <p className="text-gray-600 mb-4">These cookies enhance your experience:</p>
            <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
              <li>Language preferences</li>
              <li>Display preferences</li>
            </ul>

            <p className="text-gray-600 mb-2 mt-4"><strong>Advertising Cookies:</strong></p>
            <p className="text-gray-600 mb-6">These cookies may be used to personalize advertising (if applicable)</p>

            <h3 className="text-2xl font-bold text-gray-900 mb-4 mt-8">9.3 Cookie Management</h3>
            <p className="text-gray-600 mb-4">You can manage your cookie preferences at any time via:</p>
            <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
              <li>The cookie banner during your first visit</li>
              <li>Your browser settings</li>
              <li>Our cookie management tool accessible on the Platform</li>
            </ul>

            <p className="text-gray-600 mb-2 mt-4"><strong>Browser Configuration:</strong></p>
            <p className="text-gray-600 mb-4">You can configure your browser to:</p>
            <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
              <li>Accept all cookies</li>
              <li>Reject all cookies</li>
              <li>Be notified when a cookie is placed</li>
            </ul>
            <p className="text-gray-600 mb-4">For more information:</p>
            <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
              <li>Chrome: <a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="text-black font-semibold hover:underline">https://support.google.com/chrome/answer/95647</a></li>
              <li>Firefox: <a href="https://support.mozilla.org/en-US/kb/cookies-information-websites-store-on-your-computer" target="_blank" rel="noopener noreferrer" className="text-black font-semibold hover:underline">https://support.mozilla.org/en-US/kb/cookies-information-websites-store-on-your-computer</a></li>
              <li>Safari: <a href="https://support.apple.com/guide/safari/manage-cookies-sfri11471/mac" target="_blank" rel="noopener noreferrer" className="text-black font-semibold hover:underline">https://support.apple.com/guide/safari/manage-cookies-sfri11471/mac</a></li>
              <li>Edge: <a href="https://support.microsoft.com/en-us/microsoft-edge" target="_blank" rel="noopener noreferrer" className="text-black font-semibold hover:underline">https://support.microsoft.com/en-us/microsoft-edge</a></li>
            </ul>
            <p className="text-gray-600 mb-6">
              <strong>Warning:</strong> Refusing certain cookies may affect Platform functionality.
            </p>

            <h3 className="text-2xl font-bold text-gray-900 mb-4 mt-8">9.4 Cookie Retention Period</h3>
            <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-2">
              <li><strong>Session cookies:</strong> deleted when browser closes</li>
              <li><strong>Persistent cookies:</strong> variable duration, maximum 13 months</li>
            </ul>

            <h2 className="text-3xl font-bold text-gray-900 mb-6 mt-12">10. MARKETING AND COMMUNICATION</h2>
            
            <h3 className="text-2xl font-bold text-gray-900 mb-4 mt-8">10.1 Transactional Communications</h3>
            <p className="text-gray-600 mb-4">We send you emails related to use of our services:</p>
            <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
              <li>Booking confirmation</li>
              <li>Appointment reminders</li>
              <li>Document status notifications</li>
              <li>Invoices</li>
            </ul>
            <p className="text-gray-600 mb-6">
              These communications are necessary for contract performance and do not require your consent.
            </p>

            <h3 className="text-2xl font-bold text-gray-900 mb-4 mt-8">10.2 Marketing Communications</h3>
            <p className="text-gray-600 mb-4">With your consent, we may send you:</p>
            <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
              <li>Newsletters</li>
              <li>Promotional offers</li>
              <li>News and features</li>
            </ul>
            <p className="text-gray-600 mb-4">You can unsubscribe at any time via:</p>
            <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-2">
              <li>The unsubscribe link in each email</li>
              <li>Your user account</li>
              <li>By contacting us at <a href="mailto:support@mynotary.io" className="text-black font-semibold hover:underline">support@mynotary.io</a></li>
            </ul>

            <h2 className="text-3xl font-bold text-gray-900 mb-6 mt-12">11. MINORS</h2>
            <p className="text-gray-600 mb-6">
              The Platform is not intended for persons under 18 years of age. We do not knowingly collect personal data concerning minors.
            </p>
            <p className="text-gray-600 mb-6">
              If you are a parent or guardian and believe your child has provided us with personal data, contact us immediately at <a href="mailto:support@mynotary.io" className="text-black font-semibold hover:underline">support@mynotary.io</a> so we can delete this data.
            </p>

            <h2 className="text-3xl font-bold text-gray-900 mb-6 mt-12">12. LINKS TO OTHER SITES</h2>
            <p className="text-gray-600 mb-6">
              The Platform may contain links to third-party sites. We are not responsible for the privacy practices of these sites. We encourage you to read their privacy policies.
            </p>

            <h2 className="text-3xl font-bold text-gray-900 mb-6 mt-12">13. POLICY MODIFICATIONS</h2>
            <p className="text-gray-600 mb-4">We may modify this Privacy Policy at any time to reflect:</p>
            <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
              <li>Changes in our practices</li>
              <li>Legal or regulatory developments</li>
              <li>Service improvements</li>
            </ul>
            <p className="text-gray-600 mb-4">Significant modifications will be notified to you by:</p>
            <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
              <li>Email</li>
              <li>Platform notification</li>
              <li>Update of "Last updated" date</li>
            </ul>
            <p className="text-gray-600 mb-6">
              Your continued use of the Platform after modification constitutes acceptance of the new policy.
            </p>

            <h2 className="text-3xl font-bold text-gray-900 mb-6 mt-12">14. DATA PROTECTION OFFICER (DPO)</h2>
            <p className="text-gray-600 mb-4">
              For any questions regarding the protection of your personal data, you may contact our dedicated service:
            </p>
            <div className="text-gray-600 mb-6 space-y-2">
              <p>Email: <a href="mailto:support@mynotary.io" className="text-black font-semibold hover:underline">support@mynotary.io</a></p>
              <p>Subject: "Personal Data Protection"</p>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mb-6 mt-12">15. CONTACT</h2>
            <p className="text-gray-600 mb-4">
              For any questions regarding this Privacy Policy or processing of your personal data:
            </p>
            <div className="text-gray-600 mb-6 space-y-2">
              <p><strong>My Notary</strong></p>
              <p>Email: <a href="mailto:support@mynotary.io" className="text-black font-semibold hover:underline">support@mynotary.io</a></p>
            </div>

            <hr className="border-gray-300 my-8" />

            <p className="text-gray-600 mb-6 italic">
              <strong>By using the My Notary Platform, you acknowledge that you have read and understood this Privacy Policy.</strong>
            </p>
          </div>

          {/* Back to Home Button */}
          <div className="mt-12 text-center">
            <Link href="/" className="primary-cta text-lg px-8 py-4 inline-flex items-center gap-3">
              <IconArrowLeft />
              <span className="btn-text inline-block">Back to Home</span>
            </Link>
          </div>
        </div>
      </section>

      <MobileCTA />
    </div>
  )
}
