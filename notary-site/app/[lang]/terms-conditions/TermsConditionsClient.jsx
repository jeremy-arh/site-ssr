'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { memo } from 'react'
import SEOHead from '@/components/SEOHead'
import { useTranslation } from '@/hooks/useTranslation'
import MobileCTA from '@/components/MobileCTA'
import { useLanguage } from '@/contexts/LanguageContext'
import TermsConditionsContent from '@/components/TermsConditionsContent'

// SVG Icon inline pour éviter @iconify/react
const IconArrowLeft = memo(() => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M19 12H5M12 19l-7-7 7-7"/>
  </svg>
));

export default function TermsConditionsClient() {
  const pathname = usePathname()
  const { t } = useTranslation()
  const { getLocalizedPath, language } = useLanguage()
  
  // Contenu traduit pour le titre et la date
  const titleContent = {
    en: "Terms & Conditions",
    fr: "Conditions Générales d'Utilisation",
    es: "Términos y Condiciones",
    de: "Allgemeine Geschäftsbedingungen",
    it: "Termini e Condizioni",
    pt: "Termos e Condições"
  }
  
  const lastUpdatedContent = {
    en: "Last updated:",
    fr: "Dernière mise à jour :",
    es: "Última actualización:",
    de: "Zuletzt aktualisiert:",
    it: "Ultimo aggiornamento:",
    pt: "Última atualização:"
  }
  
  const dateContent = {
    en: "November 17, 2025",
    fr: "17 novembre 2025",
    es: "17 de noviembre de 2025",
    de: "17. November 2025",
    it: "17 novembre 2025",
    pt: "17 de novembro de 2025"
  }
  
  const backToHomeContent = {
    en: "Back to Home",
    fr: "Retour à l'accueil",
    es: "Volver al inicio",
    de: "Zurück zur Startseite",
    it: "Torna alla home",
    pt: "Voltar ao início"
  }
  
  const lang = language || 'en'
  const title = titleContent[lang] || titleContent.en
  const lastUpdated = lastUpdatedContent[lang] || lastUpdatedContent.en
  const date = dateContent[lang] || dateContent.en
  const backToHome = backToHomeContent[lang] || backToHomeContent.en
  
  return (
    <div className="min-h-screen">
      <SEOHead
        title={`${title} - ${t('seo.siteName')}`}
        description={`${title} for ${t('seo.siteName')} services`}
        ogTitle={`${title} - ${t('seo.siteName')}`}
        ogDescription={`${title} for ${t('seo.siteName')} services`}
        twitterTitle={`${title} - ${t('seo.siteName')}`}
        twitterDescription={`${title} for ${t('seo.siteName')} services`}
        canonicalPath={pathname}
      />
      {/* Hero Section */}
      <section className="bg-gray-900 text-white pt-32 pb-16 px-[30px]">
        <div className="max-w-[1100px] mx-auto">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            {title}
          </h1>
          <p className="text-lg text-gray-300">
            {lastUpdated} {date}
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-20 px-[30px]">
        <div className="max-w-[1100px] mx-auto">
          <TermsConditionsContent />
            <h2 className="text-3xl font-bold text-gray-900 mb-6 mt-12">1. PLATFORM OVERVIEW</h2>
            <p className="text-gray-600 mb-6">
              My Notary (hereinafter "the Platform") is an online service accessible via the website mynotary.io, operated by My Notary (hereinafter "My Notary", "we", "our"), which connects clients with certified notaries for the notarization of documents intended for international use. The Platform facilitates appointment scheduling, remote online notarization (RON) sessions, and apostille processing in accordance with the Hague Convention.
            </p>

            <h2 className="text-3xl font-bold text-gray-900 mb-6 mt-12">2. DEFINITIONS</h2>
            <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-2">
              <li><strong>Client</strong>: Any natural or legal person using the Platform to have documents notarized.</li>
              <li><strong>Notary</strong>: Certified and licensed public notary, partner of the Platform.</li>
              <li><strong>RON</strong>: Remote Online Notarization, a remote notarization procedure via video conference.</li>
              <li><strong>Apostille</strong>: Official certification attesting to the authenticity of a public document for international use.</li>
              <li><strong>Services</strong>: All services offered by the Platform.</li>
            </ul>

            <h2 className="text-3xl font-bold text-gray-900 mb-6 mt-12">3. ACCEPTANCE OF TERMS</h2>
            <p className="text-gray-600 mb-6">
              Use of the Platform implies full acceptance of these Terms and Conditions of Use (T&C). By creating an account or using our Services, you acknowledge that you have read, understood, and accepted these T&C.
            </p>
            <p className="text-gray-600 mb-6">
              If you do not accept these terms, you must not use the Platform.
            </p>

            <h2 className="text-3xl font-bold text-gray-900 mb-6 mt-12">4. REGISTRATION AND USER ACCOUNT</h2>
            
            <h3 className="text-2xl font-bold text-gray-900 mb-4 mt-8">4.1 Account Creation</h3>
            <p className="text-gray-600 mb-4">
              To use the Platform, you must create an account by providing accurate, complete, and up-to-date information, including:
            </p>
            <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-2">
              <li>First and last name</li>
              <li>Valid email address</li>
              <li>Phone number</li>
              <li>Postal address</li>
              <li>Any other information required for the provision of Services</li>
            </ul>

            <h3 className="text-2xl font-bold text-gray-900 mb-4 mt-8">4.2 Account Responsibility</h3>
            <p className="text-gray-600 mb-4">You are responsible for:</p>
            <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
              <li>The confidentiality of your login credentials</li>
              <li>All activities performed from your account</li>
              <li>Updating your personal information</li>
            </ul>
            <p className="text-gray-600 mb-6">
              You must inform us immediately of any unauthorized use of your account.
            </p>

            <h3 className="text-2xl font-bold text-gray-900 mb-4 mt-8">4.3 Identity Verification</h3>
            <p className="text-gray-600 mb-4">
              In accordance with legal requirements applicable to notarizations, you must provide valid identification during your notarization appointment. Accepted identity documents include:
            </p>
            <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-2">
              <li>Valid passport</li>
              <li>National identity card</li>
              <li>Driver's license</li>
            </ul>

            <h2 className="text-3xl font-bold text-gray-900 mb-6 mt-12">5. DESCRIPTION OF SERVICES</h2>
            
            <h3 className="text-2xl font-bold text-gray-900 mb-4 mt-8">5.1 Services Offered</h3>
            <p className="text-gray-600 mb-4">The Platform offers the following services:</p>
            <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-2">
              <li>Connection with certified notaries</li>
              <li>Online appointment scheduling for RON sessions</li>
              <li>Remote document notarization via secure video conference</li>
              <li>Obtaining apostilles for notarized documents</li>
              <li>Delivery of notarized and apostilled documents by mail or electronically</li>
            </ul>

            <h3 className="text-2xl font-bold text-gray-900 mb-4 mt-8">5.2 Notarization Process</h3>
            <p className="text-gray-600 mb-4">The process includes the following steps:</p>
            <ol className="list-decimal pl-6 text-gray-600 mb-6 space-y-2">
              <li>Upload your documents to the Platform</li>
              <li>Add signatory information (first name, last name, email)</li>
              <li>Book an appointment with an available notary</li>
              <li>Identity verification and notarization session via video conference</li>
              <li>Electronic signature of documents in the presence of the notary</li>
              <li>Obtaining the notarized document and apostille</li>
              <li>Delivery of the certified document</li>
            </ol>

            <h3 className="text-2xl font-bold text-gray-900 mb-4 mt-8">5.3 Service Limitations</h3>
            <p className="text-gray-600 mb-4">The Platform does not provide:</p>
            <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-2">
              <li>Legal advice</li>
              <li>Interpretation of your document content</li>
            </ul>

            <h2 className="text-3xl font-bold text-gray-900 mb-6 mt-12">6. CLIENT OBLIGATIONS</h2>
            <p className="text-gray-600 mb-4">You agree to:</p>
            <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-2">
              <li>Provide legal and authentic documents</li>
              <li>Not use the Platform for fraudulent or illegal purposes</li>
              <li>Be present and available during your notarization appointment</li>
              <li>Have a stable internet connection and functional audiovisual equipment</li>
              <li>Provide valid identification during the session</li>
              <li>Follow the notary's instructions during the session</li>
              <li>Not record the video conference session without authorization</li>
            </ul>

            <h2 className="text-3xl font-bold text-gray-900 mb-6 mt-12">7. NOTARY ROLE AND RESPONSIBILITIES</h2>
            
            <h3 className="text-2xl font-bold text-gray-900 mb-4 mt-8">7.1 Notary Status</h3>
            <p className="text-gray-600 mb-6">
              Partner notaries are independent professionals, duly certified and licensed in their respective jurisdiction. They are not employees of My Notary but independent contractors.
            </p>

            <h3 className="text-2xl font-bold text-gray-900 mb-4 mt-8">7.2 Notary Responsibilities</h3>
            <p className="text-gray-600 mb-4">Notaries are responsible for:</p>
            <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-2">
              <li>Verifying your identity</li>
              <li>Compliance of notarization with applicable laws</li>
              <li>Authenticity of the notarization act</li>
              <li>Adherence to applicable professional standards</li>
            </ul>

            <h3 className="text-2xl font-bold text-gray-900 mb-4 mt-8">7.3 Limitation of My Notary's Liability</h3>
            <p className="text-gray-600 mb-4">
              My Notary acts solely as a technological intermediary. We are not responsible for:
            </p>
            <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-2">
              <li>Errors or omissions by notaries</li>
              <li>Content of notarized documents</li>
              <li>Acceptance or rejection of your documents by destination authorities</li>
              <li>Legal consequences related to the content of your documents</li>
            </ul>

            <h2 className="text-3xl font-bold text-gray-900 mb-6 mt-12">8. PRICING AND PAYMENT</h2>
            
            <h3 className="text-2xl font-bold text-gray-900 mb-4 mt-8">8.1 Service Prices</h3>
            <p className="text-gray-600 mb-6">
              Our Services rates are indicated on the Platform in the applicable currencies (e.g., Euros, Dollars, etc.).
            </p>
            <p className="text-gray-600 mb-4">
              The displayed price corresponds to the rate per notarized document. This base rate does not include the following items, which are charged as supplements or options at the prices indicated on the Platform:
            </p>
            <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
              <li>The cost for any additional signatory added to the main signatory</li>
              <li>Apostille fees (optional service)</li>
              <li>Shipping fees (optional service)</li>
            </ul>
            <p className="text-gray-600 mb-6">
              Prices are subject to change at any time, but the applicable rates are those in effect at the time of booking.
            </p>

            <h3 className="text-2xl font-bold text-gray-900 mb-4 mt-8">8.2 Payment Methods</h3>
            <p className="text-gray-600 mb-4">Payment is made online by:</p>
            <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
              <li>Credit card (Visa, Mastercard, American Express)</li>
              <li>Other payment methods available on the Platform</li>
            </ul>
            <p className="text-gray-600 mb-6">
              Financial transactions are secured and processed by our payment service provider, Stripe. Payment is due at the time of appointment booking.
            </p>

            <h3 className="text-2xl font-bold text-gray-900 mb-4 mt-8">8.3 Invoicing</h3>
            <p className="text-gray-600 mb-6">
              An invoice will be sent to you by email after each transaction.
            </p>

            <h3 className="text-2xl font-bold text-gray-900 mb-4 mt-8">8.4 Modifications and Cancellations</h3>
            <p className="text-gray-600 mb-2">
              <strong>Schedule changes:</strong>
            </p>
            <p className="text-gray-600 mb-4">
              You may reschedule your appointment free of charge up to 24 hours before the scheduled time via your client area.
            </p>
            <p className="text-gray-600 mb-2">
              <strong>Cancellation by the client:</strong>
            </p>
            <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
              <li>More than 48 hours before: credit valid for 12 months for a new appointment</li>
              <li>Between 24 and 48 hours before: 50% credit valid for 6 months</li>
              <li>Less than 24 hours before: no credit or refund</li>
            </ul>
            <p className="text-gray-600 mb-2">
              <strong>Exceptional refund:</strong>
            </p>
            <p className="text-gray-600 mb-6">
              A full refund will be granted only if My Notary or the notary is unable to complete the notarization due to technical reasons attributable to us.
            </p>

            <h2 className="text-3xl font-bold text-gray-900 mb-6 mt-12">9. RESCHEDULING AND CANCELLATION BY MY NOTARY</h2>
            
            <h3 className="text-2xl font-bold text-gray-900 mb-4 mt-8">9.1 Rescheduling of the Appointment</h3>
            <p className="text-gray-600 mb-4">
              We reserve the right to reschedule an appointment in the event of:
            </p>
            <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
              <li>Force majeure</li>
              <li>Unforeseen notary unavailability</li>
              <li>Major technical issues</li>
              <li>Inappropriate documents or suspicion of fraud</li>
            </ul>
            
            <h3 className="text-2xl font-bold text-gray-900 mb-4 mt-8">9.2 In Case of Rescheduling</h3>
            <p className="text-gray-600 mb-4">
              In such cases, you will be offered the choice between:
            </p>
            <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-2">
              <li>A new appointment at the earliest availability (priority in scheduling)</li>
              <li>A credit valid for 12 months</li>
              <li>A full refund (only upon explicit request)</li>
            </ul>

            <h2 className="text-3xl font-bold text-gray-900 mb-6 mt-12">10. INTELLECTUAL PROPERTY</h2>
            
            <h3 className="text-2xl font-bold text-gray-900 mb-4 mt-8">10.1 Platform Content</h3>
            <p className="text-gray-600 mb-6">
              All elements of the Platform (texts, graphics, logos, icons, images, software) are the exclusive property of My Notary or its partners and are protected by intellectual property laws.
            </p>

            <h3 className="text-2xl font-bold text-gray-900 mb-4 mt-8">10.2 License of Use</h3>
            <p className="text-gray-600 mb-4">
              You have a personal, non-exclusive, and non-transferable right to use the Platform, solely for your own needs.
            </p>
            <p className="text-gray-600 mb-6">
              Any unauthorized reproduction, representation, modification, or exploitation is prohibited.
            </p>

            <h2 className="text-3xl font-bold text-gray-900 mb-6 mt-12">11. PERSONAL DATA PROTECTION</h2>
            
            <h3 className="text-2xl font-bold text-gray-900 mb-4 mt-8">11.1 Collection and Processing</h3>
            <p className="text-gray-600 mb-4">
              My Notary collects and processes your personal data in accordance with the General Data Protection Regulation (GDPR) and applicable laws. Data collected includes:
            </p>
            <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-2">
              <li>Identification information</li>
              <li>Contact details</li>
              <li>Identity documents</li>
              <li>Payment information</li>
              <li>Connection data</li>
            </ul>

            <h3 className="text-2xl font-bold text-gray-900 mb-4 mt-8">11.2 Processing Purposes</h3>
            <p className="text-gray-600 mb-4">Your data is used for:</p>
            <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-2">
              <li>Provision of Services</li>
              <li>Account management</li>
              <li>Communication with you</li>
              <li>Service improvement</li>
              <li>Compliance with our legal obligations</li>
            </ul>

            <h3 className="text-2xl font-bold text-gray-900 mb-4 mt-8">11.3 Retention Period</h3>
            <p className="text-gray-600 mb-6">
              Your data is retained for the duration necessary for the purposes for which it is processed, and in accordance with legal retention obligations.
            </p>
            <p className="text-gray-600 mb-6">
              Notarized documents are archived in accordance with legal requirements applicable to notaries.
            </p>

            <h3 className="text-2xl font-bold text-gray-900 mb-4 mt-8">11.4 Your Rights</h3>
            <p className="text-gray-600 mb-4">In accordance with GDPR, you have the following rights:</p>
            <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
              <li>Right of access to your data</li>
              <li>Right of rectification</li>
              <li>Right to erasure</li>
              <li>Right to restriction of processing</li>
              <li>Right to data portability</li>
              <li>Right to object</li>
            </ul>
            <p className="text-gray-600 mb-6">
              To exercise these rights, contact us at: <a href="mailto:support@mynotary.io" className="text-black font-semibold hover:underline">support@mynotary.io</a>
            </p>

            <h3 className="text-2xl font-bold text-gray-900 mb-4 mt-8">11.5 Security</h3>
            <p className="text-gray-600 mb-6">
              We implement appropriate technical and organizational measures to protect your data against unauthorized access, loss, or destruction.
            </p>

            <h2 className="text-3xl font-bold text-gray-900 mb-6 mt-12">12. CONFIDENTIALITY AND SECURITY</h2>
            
            <h3 className="text-2xl font-bold text-gray-900 mb-4 mt-8">12.1 Document Confidentiality</h3>
            <p className="text-gray-600 mb-6">
              Your documents are treated in strict confidence. They are only accessible to the notary assigned to your case and authorized My Notary personnel in the context of Service provision.
            </p>

            <h3 className="text-2xl font-bold text-gray-900 mb-4 mt-8">12.2 Session Security</h3>
            <p className="text-gray-600 mb-6">
              Video conference notarization sessions are secure and encrypted. A recording may be made in accordance with legal requirements, but only for legal archiving purposes.
            </p>

            <h3 className="text-2xl font-bold text-gray-900 mb-4 mt-8">12.3 Secure Storage</h3>
            <p className="text-gray-600 mb-6">
              Your documents are stored on secure servers with data encryption.
            </p>

            <h2 className="text-3xl font-bold text-gray-900 mb-6 mt-12">13. RESPONSIBILITIES AND WARRANTIES</h2>
            
            <h3 className="text-2xl font-bold text-gray-900 mb-4 mt-8">13.1 Best Efforts Obligation</h3>
            <p className="text-gray-600 mb-6">
              My Notary commits to implementing all necessary means to provide quality service, but does not guarantee a specific result regarding the acceptance of your documents by destination authorities.
            </p>

            <h3 className="text-2xl font-bold text-gray-900 mb-4 mt-8">13.2 Limitation of Liability</h3>
            <p className="text-gray-600 mb-4">My Notary cannot be held responsible for:</p>
            <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-2">
              <li>Indirect, incidental, or consequential damages</li>
              <li>Loss of profits, data, or business opportunities</li>
              <li>Service interruptions related to force majeure</li>
              <li>Errors in documents provided by the Client</li>
              <li>Rejection of your documents by destination authorities</li>
              <li>Legal consequences related to the content of your documents</li>
            </ul>

            <h3 className="text-2xl font-bold text-gray-900 mb-4 mt-8">13.3 Client Warranties</h3>
            <p className="text-gray-600 mb-4">You warrant that:</p>
            <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-2">
              <li>You have the right and authority to have the submitted documents notarized</li>
              <li>Your documents are authentic and not fraudulent</li>
              <li>You use the Services for legal and legitimate purposes</li>
              <li>The information provided is accurate and truthful</li>
            </ul>

            <h2 className="text-3xl font-bold text-gray-900 mb-6 mt-12">14. FORCE MAJEURE</h2>
            <p className="text-gray-600 mb-4">
              My Notary shall not be held responsible for non-performance of its obligations in case of force majeure, including but not limited to:
            </p>
            <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-2">
              <li>Natural disasters</li>
              <li>Network or equipment failures</li>
              <li>Wars, riots, civil unrest</li>
              <li>Government acts</li>
              <li>Strikes</li>
              <li>Epidemics</li>
            </ul>

            <h2 className="text-3xl font-bold text-gray-900 mb-6 mt-12">15. DISPUTE RESOLUTION</h2>
            
            <h3 className="text-2xl font-bold text-gray-900 mb-4 mt-8">15.1 Complaints</h3>
            <p className="text-gray-600 mb-6">
              For any complaint, contact our customer service at: <a href="mailto:support@mynotary.io" className="text-black font-semibold hover:underline">support@mynotary.io</a> We commit to responding within [X] business days.
            </p>

            <h3 className="text-2xl font-bold text-gray-900 mb-4 mt-8">15.2 Mediation</h3>
            <p className="text-gray-600 mb-6">
              In case of dispute, you may resort to mediation before any legal action. Mediator contact information: [to be completed]
            </p>

            <h3 className="text-2xl font-bold text-gray-900 mb-4 mt-8">15.3 Applicable Law and Jurisdiction</h3>
            <p className="text-gray-600 mb-4">
              These T&C are governed by the laws applicable in the relevant jurisdiction, without prejudice to mandatory consumer protection rules that may apply in your country of residence.
            </p>
            <p className="text-gray-600 mb-6">
              In case of dispute, and failing amicable resolution, the competent courts determined by applicable conflict-of-law and jurisdiction rules shall have authority.
            </p>

            <h2 className="text-3xl font-bold text-gray-900 mb-6 mt-12">16. MODIFICATION OF T&C</h2>
            <p className="text-gray-600 mb-6">
              My Notary reserves the right to modify these T&C at any time. Modifications will take effect upon publication on the Platform.
            </p>
            <p className="text-gray-600 mb-6">
              You will be informed of significant modifications by email. Your continued use of the Platform after modification constitutes acceptance of the new T&C.
            </p>

            <h2 className="text-3xl font-bold text-gray-900 mb-6 mt-12">17. GENERAL PROVISIONS</h2>
            
            <h3 className="text-2xl font-bold text-gray-900 mb-4 mt-8">17.1 Entire Agreement</h3>
            <p className="text-gray-600 mb-6">
              These T&C constitute the entire agreement between you and My Notary regarding the use of the Platform.
            </p>

            <h3 className="text-2xl font-bold text-gray-900 mb-4 mt-8">17.2 Severability</h3>
            <p className="text-gray-600 mb-6">
              If any provision of these T&C is deemed invalid or unenforceable, the other provisions shall remain in effect.
            </p>

            <h3 className="text-2xl font-bold text-gray-900 mb-4 mt-8">17.3 Waiver</h3>
            <p className="text-gray-600 mb-6">
              My Notary's failure to exercise a right provided by these T&C does not constitute a waiver of that right.
            </p>

            <h3 className="text-2xl font-bold text-gray-900 mb-4 mt-8">17.4 Assignment</h3>
            <p className="text-gray-600 mb-6">
              You may not assign your rights or obligations under these T&C without our prior written consent.
            </p>

            <h2 className="text-3xl font-bold text-gray-900 mb-6 mt-12">18. CONTACT</h2>
            <p className="text-gray-600 mb-4">
              For any questions regarding these T&C or use of the Platform:
            </p>
            <div className="text-gray-600 mb-6 space-y-2">
              <p><strong>My Notary</strong></p>
              <p>Email: <a href="mailto:support@mynotary.io" className="text-black font-semibold hover:underline">support@mynotary.io</a></p>
            </div>

          {/* Back to Home Button */}
          <div className="mt-12 text-center">
            <Link href={getLocalizedPath('/')} className="primary-cta text-lg px-8 py-4 inline-flex items-center gap-3">
              <IconArrowLeft />
              <span className="btn-text inline-block">{backToHome}</span>
            </Link>
          </div>
        </div>
      </section>

      <MobileCTA />
    </div>
  )
}

