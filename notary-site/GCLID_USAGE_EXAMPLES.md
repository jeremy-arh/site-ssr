# Exemples d'utilisation du GCLID

## 1. Utilisation dans un formulaire de conversion

```javascript
'use client'

import { useState } from 'react'
import { getGclid } from '@/utils/cookies'

export default function BookingForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    service: ''
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Récupérer le gclid du cookie
    const gclid = getGclid()
    
    // Préparer les données à envoyer
    const submissionData = {
      ...formData,
      gclid: gclid, // Ajouter le gclid aux données
      timestamp: new Date().toISOString(),
      source: 'website'
    }
    
    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData)
      })
      
      if (response.ok) {
        // Envoyer l'événement de conversion à Google Ads via GTM
        if (window.dataLayer) {
          window.dataLayer.push({
            event: 'conversion',
            gclid: gclid,
            conversion_value: formData.service === 'apostille' ? 50 : 30,
            currency: 'EUR'
          })
        }
        
        alert('Réservation confirmée!')
      }
    } catch (error) {
      console.error('Erreur lors de la soumission:', error)
    }
  }
  
  return (
    <form onSubmit={handleSubmit}>
      {/* Champs du formulaire */}
      <input
        type="text"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        placeholder="Nom"
        required
      />
      <input
        type="email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        placeholder="Email"
        required
      />
      <select
        value={formData.service}
        onChange={(e) => setFormData({ ...formData, service: e.target.value })}
        required
      >
        <option value="">Sélectionner un service</option>
        <option value="apostille">Apostille</option>
        <option value="notarization">Notarisation</option>
      </select>
      <button type="submit">Réserver</button>
    </form>
  )
}
```

## 2. Utilisation avec un hook personnalisé

```javascript
'use client'

import { useGclid } from '@/hooks/useGclid'
import { useEffect } from 'react'

export default function ConversionPage() {
  const gclid = useGclid()
  
  useEffect(() => {
    if (gclid) {
      // Envoyer un événement personnalisé lorsque le gclid est disponible
      console.log('Utilisateur vient d\'une campagne Google Ads:', gclid)
      
      // Personnaliser l'expérience utilisateur
      // Par exemple, afficher un message spécifique
      // ou suivre le parcours différemment
    }
  }, [gclid])
  
  return (
    <div>
      {gclid && (
        <div className="bg-blue-50 p-4 rounded-lg mb-4">
          <p className="text-sm text-blue-800">
            🎉 Profitez de notre offre spéciale Google Ads !
          </p>
        </div>
      )}
      {/* Reste du contenu de la page */}
    </div>
  )
}
```

## 3. Envoi du GCLID à une API backend

```javascript
// api/bookings/route.js (Next.js App Router)
import { NextResponse } from 'next/server'

export async function POST(request) {
  const body = await request.json()
  const { name, email, service, gclid } = body
  
  try {
    // Enregistrer dans votre base de données
    const booking = await saveBooking({
      name,
      email,
      service,
      gclid, // Stocker le gclid pour le suivi des conversions
      created_at: new Date()
    })
    
    // Optionnel : Envoyer à Google Ads Conversion API
    if (gclid) {
      await sendGoogleAdsConversion({
        gclid,
        conversion_action: 'booking_completed',
        conversion_value: 50,
        currency: 'EUR'
      })
    }
    
    return NextResponse.json({ success: true, booking })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
```

## 4. Utilisation avec Supabase

```javascript
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { getGclid } from '@/utils/cookies'

export async function createBooking(bookingData) {
  const supabase = createClientComponentClient()
  const gclid = getGclid()
  
  const { data, error } = await supabase
    .from('bookings')
    .insert({
      ...bookingData,
      gclid: gclid,
      created_at: new Date().toISOString()
    })
    .select()
  
  if (error) {
    console.error('Erreur Supabase:', error)
    throw error
  }
  
  return data
}
```

## 5. Tracking Google Ads avec GTM (Google Tag Manager)

```javascript
'use client'

import { useGclid } from '@/hooks/useGclid'
import { useEffect } from 'react'

export default function ThankYouPage() {
  const gclid = useGclid()
  
  useEffect(() => {
    // Envoyer la conversion à Google Ads via GTM
    if (gclid && window.dataLayer) {
      window.dataLayer.push({
        event: 'purchase_completed',
        gclid: gclid,
        transaction_id: Date.now(),
        value: 50.00,
        currency: 'EUR',
        items: [{
          item_name: 'Apostille Service',
          item_category: 'Notary Services',
          price: 50.00,
          quantity: 1
        }]
      })
    }
  }, [gclid])
  
  return (
    <div>
      <h1>Merci pour votre commande !</h1>
      {/* Contenu de la page */}
    </div>
  )
}
```

## 6. Vérifier la présence du GCLID côté serveur

```javascript
// app/api/check-gclid/route.js
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET() {
  const cookieStore = cookies()
  const gclid = cookieStore.get('gclid')
  
  return NextResponse.json({
    has_gclid: !!gclid,
    gclid_value: gclid?.value || null
  })
}
```

## 7. Composant de débogage (développement uniquement)

```javascript
'use client'

import { useGclid } from '@/hooks/useGclid'

export default function GclidDebugger() {
  const gclid = useGclid()
  
  // N'afficher qu'en développement
  if (process.env.NODE_ENV !== 'development') {
    return null
  }
  
  return (
    <div 
      style={{
        position: 'fixed',
        bottom: 10,
        right: 10,
        background: 'black',
        color: 'white',
        padding: '10px',
        borderRadius: '5px',
        fontSize: '12px',
        zIndex: 9999
      }}
    >
      <strong>GCLID Debug:</strong>
      <br />
      {gclid ? `✅ ${gclid}` : '❌ Non détecté'}
    </div>
  )
}
```

## Notes importantes

1. **Conformité RGPD** : Assurez-vous de mentionner l'utilisation des cookies de tracking dans votre politique de confidentialité
2. **Durée de vie** : Le cookie gclid est conservé pendant 90 jours (standard Google)
3. **Domaine** : Le cookie est partagé sur tous les sous-domaines de `mynotary.io`
4. **Sécurité** : Le cookie est sécurisé (HTTPS uniquement) et utilise `SameSite=Lax`
5. **Backend** : Pensez à créer une colonne `gclid` dans vos tables de base de données pour stocker cette information

