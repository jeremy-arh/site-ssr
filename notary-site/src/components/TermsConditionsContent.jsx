'use client'

import { useLanguage } from '@/contexts/LanguageContext'

// Traductions complètes des CGU pour toutes les langues
const termsContent = {
  fr: {
    title: "Conditions Générales d'Utilisation",
    lastUpdated: "Dernière mise à jour :",
    date: "17 novembre 2025",
    sections: {
      section1: {
        title: "1. PRÉSENTATION DE LA PLATEFORME",
        content: 'My Notary (ci-après « la Plateforme ») est un service en ligne accessible via le site mynotary.io, exploité par My Notary (ci-après « My Notary », « nous », « notre »), qui met en relation des clients avec des notaires certifiés pour la notarisation de documents destinés à un usage international. La Plateforme facilite les sessions de notarisation en ligne à distance (RON) et le traitement des apostilles conformément à la Convention de La Haye.'
      },
      section2: {
        title: "2. DÉFINITIONS",
        items: [
          { term: "Client", definition: "Toute personne physique ou morale utilisant la Plateforme pour faire notariser des documents." },
          { term: "Notaire", definition: "Notaire public certifié et agréé, partenaire de la Plateforme." },
          { term: "RON", definition: "Remote Online Notarization (Notarisation en Ligne à Distance), procédure de notarisation à distance par visioconférence." },
          { term: "Apostille", definition: "Certification officielle attestant de l'authenticité d'un document public pour un usage international." },
          { term: "Services", definition: "L'ensemble des services proposés par la Plateforme." }
        ]
      },
      section3: {
        title: "3. ACCEPTATION DES CONDITIONS",
        content: "L'utilisation de la Plateforme implique l'acceptation pleine et entière des présentes Conditions Générales d'Utilisation (CGU). En créant un compte ou en utilisant nos Services, vous reconnaissez avoir lu, compris et accepté ces CGU.",
        content2: "Si vous n'acceptez pas ces conditions, vous ne devez pas utiliser la Plateforme."
      },
      section4: {
        title: "4. INSCRIPTION ET COMPTE UTILISATEUR",
        subsection1: {
          title: "4.1 Création de compte",
          content: "Pour utiliser la Plateforme, vous devez créer un compte en fournissant des informations exactes, complètes et à jour, notamment :",
          items: [
            "Nom et prénom",
            "Adresse email valide",
            "Numéro de téléphone",
            "Adresse postale",
            "Toute autre information requise pour la fourniture des Services"
          ]
        },
        subsection2: {
          title: "4.2 Responsabilité du compte",
          content: "Vous êtes responsable de :",
          items: [
            "La confidentialité de vos identifiants de connexion",
            "Toutes les activités effectuées depuis votre compte",
            "La mise à jour de vos informations personnelles"
          ],
          content2: "Vous devez nous informer immédiatement de toute utilisation non autorisée de votre compte."
        },
        subsection3: {
          title: "4.3 Vérification d'identité",
          content: "Conformément aux exigences légales applicables aux notarisations, vous devez présenter une pièce d'identité valide lors de votre session de notarisation. Les documents d'identité acceptés comprennent :",
          items: [
            "Passeport valide",
            "Carte nationale d'identité",
            "Permis de conduire"
          ]
        }
      },
      section5: {
        title: "5. DESCRIPTION DES SERVICES",
        subsection1: {
          title: "5.1 Services proposés",
          content: "La Plateforme propose les services suivants :",
          items: [
            "Mise en relation avec des notaires certifiés",
            "Notarisation de documents à distance par visioconférence sécurisée",
            "Obtention d'apostilles pour les documents notariés",
            "Livraison des documents notariés et apostillés par courrier ou par voie électronique"
          ]
        },
        subsection2: {
          title: "5.2 Processus de notarisation",
          content: "Le processus comprend les étapes suivantes :",
          items: [
            "Téléchargement de vos documents sur la Plateforme",
            "Ajout des informations du signataire (prénom, nom, email)",
            "Paiement en ligne",
            "Vérification d'identité et session de notarisation par visioconférence",
            "Signature électronique des documents en présence du notaire",
            "Obtention du document notarisé et de l'apostille",
            "Livraison du document certifié"
          ]
        },
        subsection3: {
          title: "5.3 Limitations des services",
          content: "La Plateforme ne fournit pas :",
          items: [
            "De conseils juridiques",
            "D'interprétation du contenu de vos documents"
          ]
        }
      },
      section6: {
        title: "6. OBLIGATIONS DU CLIENT",
        content: "Vous vous engagez à :",
        items: [
          "Fournir des documents légaux et authentiques",
          "Ne pas utiliser la Plateforme à des fins frauduleuses ou illégales",
          "Être présent et disponible lors de votre session de notarisation",
          "Disposer d'une connexion internet stable et d'un équipement audiovisuel fonctionnel",
          "Présenter une pièce d'identité valide pendant la session",
          "Suivre les instructions du notaire pendant la session",
          "Ne pas enregistrer la session de visioconférence sans autorisation"
        ]
      },
      section7: {
        title: "7. RÔLE ET RESPONSABILITÉS DU NOTAIRE",
        subsection1: {
          title: "7.1 Statut du notaire",
          content: "Les notaires partenaires sont des professionnels indépendants, dûment certifiés et agréés dans leur juridiction respective. Ils ne sont pas employés de My Notary mais des prestataires indépendants."
        },
        subsection2: {
          title: "7.2 Responsabilités du notaire",
          content: "Les notaires sont responsables de :",
          items: [
            "La vérification de votre identité",
            "La conformité de la notarisation aux lois applicables",
            "L'authenticité de l'acte de notarisation",
            "Le respect des normes professionnelles applicables"
          ]
        },
        subsection3: {
          title: "7.3 Limitation de responsabilité de My Notary",
          content: "My Notary agit uniquement en tant qu'intermédiaire technologique. Nous ne sommes pas responsables de :",
          items: [
            "Erreurs ou omissions des notaires",
            "Contenu des documents notariés",
            "Acceptation ou rejet de vos documents par les autorités de destination",
            "Conséquences juridiques liées au contenu de vos documents"
          ]
        }
      },
      section8: {
        title: "8. TARIFICATION ET PAIEMENT",
        subsection1: {
          title: "8.1 Prix des services",
          content: "Les tarifs de nos Services sont indiqués sur la Plateforme dans les devises applicables (par exemple, Euros, Dollars, etc.).",
          content2: "Le prix affiché correspond au tarif par document notarisé. Ce tarif de base n'inclut pas les éléments suivants, qui sont facturés en supplément ou en option aux prix indiqués sur la Plateforme :",
          items: [
            "Le coût pour tout signataire supplémentaire ajouté au signataire principal",
            "Les frais d'apostille (service optionnel)",
            "Les frais d'expédition (service optionnel)"
          ],
          content3: "Les prix sont susceptibles de changer à tout moment, mais les tarifs applicables sont ceux en vigueur au moment de la commande."
        },
        subsection2: {
          title: "8.2 Moyens de paiement",
          content: "Le paiement s'effectue en ligne par :",
          items: [
            "Carte bancaire (Visa, Mastercard, American Express)",
            "Autres moyens de paiement disponibles sur la Plateforme"
          ],
          content2: "Les transactions financières sont sécurisées et traitées par notre prestataire de services de paiement, Stripe. Le paiement est dû au moment de la commande."
        },
        subsection3: {
          title: "8.3 Facturation",
          content: "Une facture vous sera envoyée par email après chaque transaction."
        },
        subsection4: {
          title: "8.4 Annulations",
          beforeService: {
            title: "Avant l'accès au service :",
            content: "Tant que vous n'avez pas initié la session de vérification d'identité, vous pouvez demander un avoir valable 12 mois pour une utilisation ultérieure en contactant notre service client à support@mynotary.io."
          },
          serviceInitiated: {
            title: "Service initié :",
            content: "Dès lors que la session de vérification d'identité a été lancée ou que vos documents ont été soumis pour traitement, la prestation est considérée comme engagée et en cours d'exécution. Conformément aux dispositions du Code de la consommation relatives aux prestations de services pleinement exécutées, le droit de rétractation ne peut être exercé. Aucun avoir ne pourra être émis pour une prestation engagée."
          },
          nonCompliant: {
            title: "Documents non conformes :",
            content: "Si vos documents ne peuvent être notarisés en raison d'une non-conformité (document illisible, incomplet, non éligible à la notarisation, identité non vérifiable), un avoir valable 6 mois pourra être émis après étude de votre dossier par notre service client, déduction faite des frais de traitement engagés."
          }
        }
      },
      section9: {
        title: "9. INTERRUPTION OU IMPOSSIBILITÉ DE SERVICE",
        subsection1: {
          title: "9.1 Cas d'interruption",
          content: "My Notary peut être dans l'impossibilité d'assurer la prestation dans les cas suivants :",
          items: [
            "Indisponibilité temporaire de la plateforme pour maintenance programmée ou d'urgence",
            "Problème technique affectant la visioconférence (serveurs, hébergement, prestataires tiers)",
            "Absence temporaire de notaire disponible",
            "Incident affectant nos prestataires de paiement ou de vérification d'identité",
            "Cyberattaque ou incident de sécurité nécessitant une suspension du service",
            "Cas de force majeure tel que défini dans les présentes CGU"
          ]
        },
        subsection2: {
          title: "9.2 Conséquences",
          content: "En cas d'impossibilité d'assurer la prestation pour l'une des raisons mentionnées ci-dessus, et si votre paiement a déjà été effectué, vous aurez le choix entre :",
          items: [
            "Un accès prioritaire dès rétablissement du service",
            "Un avoir valable 12 mois utilisable sur l'ensemble de nos services",
            "Un remboursement intégral sur demande expresse adressée à support@mynotary.io"
          ],
          content2: "My Notary s'engage à vous informer dans les meilleurs délais de toute interruption de service et des solutions proposées."
        },
        subsection3: {
          title: "9.3 Exclusions",
          content: "My Notary ne pourra être tenu responsable des interruptions ou impossibilités de service liées à :",
          clientIssues: {
            title: "Problèmes techniques côté client :",
            items: [
              "Votre connexion internet ou votre équipement personnel (ordinateur, webcam, microphone)",
              "Une incompatibilité de votre navigateur ou appareil avec notre plateforme",
              "Une erreur de manipulation de votre part",
              "Un défaut de réponse de votre part lors de la session de vérification",
              "Un environnement inadapté à la session de visioconférence (bruit, éclairage insuffisant)"
            ]
          },
          documentIssues: {
            title: "Problèmes liés aux documents :",
            items: [
              "Documents illisibles, flous ou de mauvaise qualité",
              "Documents incomplets ou partiellement téléchargés",
              "Documents dans un format non accepté par la plateforme",
              "Documents non éligibles à la notarisation",
              "Documents falsifiés, frauduleux ou présentant des signes d'altération",
              "Documents ne correspondant pas à l'identité du demandeur",
              "Documents rédigés dans une langue ne permettant pas leur traitement"
            ]
          },
          identityIssues: {
            title: "Problèmes liés à la vérification d'identité :",
            items: [
              "Pièce d'identité expirée, illisible ou endommagée",
              "Impossibilité de vérifier votre identité (non-correspondance entre la pièce d'identité et la personne présente)",
              "Refus de vous soumettre aux étapes de vérification d'identité requises"
            ]
          },
          content2: "Dans ces cas, un avoir valable 6 mois pourra être émis après étude de votre dossier par notre service client, déduction faite des frais de traitement engagés. Aucun remboursement ne sera accordé."
        }
      },
      section10: {
        title: "10. PROPRIÉTÉ INTELLECTUELLE",
        subsection1: {
          title: "10.1 Contenu de la Plateforme",
          content: "Tous les éléments de la Plateforme (textes, graphiques, logos, icônes, images, logiciels) sont la propriété exclusive de My Notary ou de ses partenaires et sont protégés par les lois sur la propriété intellectuelle."
        },
        subsection2: {
          title: "10.2 Licence d'utilisation",
          content: "Vous disposez d'un droit d'utilisation personnel, non exclusif et non transférable de la Plateforme, uniquement pour vos propres besoins.",
          content2: "Toute reproduction, représentation, modification ou exploitation non autorisée est interdite."
        }
      },
      section11: {
        title: "11. PROTECTION DES DONNÉES PERSONNELLES",
        subsection1: {
          title: "11.1 Collecte et traitement",
          content: "My Notary collecte et traite vos données personnelles conformément au Règlement Général sur la Protection des Données (RGPD) et aux lois applicables. Les données collectées comprennent :",
          items: [
            "Informations d'identification",
            "Coordonnées",
            "Documents d'identité",
            "Informations de paiement",
            "Données de connexion"
          ]
        },
        subsection2: {
          title: "11.2 Finalités du traitement",
          content: "Vos données sont utilisées pour :",
          items: [
            "La fourniture des Services",
            "La gestion de votre compte",
            "La communication avec vous",
            "L'amélioration des services",
            "Le respect de nos obligations légales"
          ]
        },
        subsection3: {
          title: "11.3 Durée de conservation",
          content: "Vos données sont conservées pendant la durée nécessaire aux finalités pour lesquelles elles sont traitées, et conformément aux obligations légales de conservation.",
          content2: "Les documents notariés sont archivés conformément aux exigences légales applicables aux notaires."
        },
        subsection4: {
          title: "11.4 Vos droits",
          content: "Conformément au RGPD, vous disposez des droits suivants :",
          items: [
            "Droit d'accès à vos données",
            "Droit de rectification",
            "Droit à l'effacement",
            "Droit à la limitation du traitement",
            "Droit à la portabilité des données",
            "Droit d'opposition"
          ],
          content2: "Pour exercer ces droits, contactez-nous à : support@mynotary.io"
        },
        subsection5: {
          title: "11.5 Sécurité",
          content: "Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos données contre tout accès non autorisé, perte ou destruction."
        }
      },
      section12: {
        title: "12. CONFIDENTIALITÉ ET SÉCURITÉ",
        subsection1: {
          title: "12.1 Confidentialité des documents",
          content: "Vos documents sont traités en toute confidentialité. Ils ne sont accessibles qu'au notaire assigné à votre dossier et au personnel autorisé de My Notary dans le cadre de la fourniture des Services."
        },
        subsection2: {
          title: "12.2 Sécurité des sessions",
          content: "Les sessions de notarisation par visioconférence sont sécurisées et chiffrées. Un enregistrement peut être effectué conformément aux exigences légales, mais uniquement à des fins d'archivage légal."
        },
        subsection3: {
          title: "12.3 Stockage sécurisé",
          content: "Vos documents sont stockés sur des serveurs sécurisés avec chiffrement des données."
        }
      },
      section13: {
        title: "13. RESPONSABILITÉS ET GARANTIES",
        subsection1: {
          title: "13.1 Obligation de moyens",
          content: "My Notary s'engage à mettre en œuvre tous les moyens nécessaires pour fournir un service de qualité, mais ne garantit pas un résultat spécifique concernant l'acceptation de vos documents par les autorités de destination."
        },
        subsection2: {
          title: "13.2 Limitation de responsabilité",
          content: "My Notary ne peut être tenu responsable de :",
          items: [
            "Dommages indirects, accessoires ou consécutifs",
            "Perte de profits, de données ou d'opportunités commerciales",
            "Interruptions de service liées à la force majeure",
            "Erreurs dans les documents fournis par le Client",
            "Rejet de vos documents par les autorités de destination",
            "Conséquences juridiques liées au contenu de vos documents"
          ]
        },
        subsection3: {
          title: "13.3 Garanties du client",
          content: "Vous garantissez que :",
          items: [
            "Vous avez le droit et l'autorité de faire notariser les documents soumis",
            "Vos documents sont authentiques et non frauduleux",
            "Vous utilisez les Services à des fins légales et légitimes",
            "Les informations fournies sont exactes et véridiques"
          ]
        }
      },
      section14: {
        title: "14. FORCE MAJEURE",
        content: "My Notary ne pourra être tenu responsable de l'inexécution de ses obligations en cas de force majeure, incluant notamment :",
        items: [
          "Catastrophes naturelles",
          "Pannes de réseau ou d'équipement",
          "Guerres, émeutes, troubles civils",
          "Actes gouvernementaux",
          "Grèves",
          "Épidémies"
        ]
      },
      section15: {
        title: "15. RÉSOLUTION DES LITIGES",
        subsection1: {
          title: "15.1 Réclamations",
          content: "Pour toute réclamation, contactez notre service client à : support@mynotary.io. Nous nous engageons à répondre dans un délai de 14 jours ouvrés."
        },
        subsection2: {
          title: "15.2 Médiation",
          content: "En cas de litige, vous pouvez recourir à la médiation avant toute action en justice."
        },
        subsection3: {
          title: "15.3 Loi applicable et juridiction",
          content: "Les présentes CGU sont régies par les lois applicables dans la juridiction concernée, sans préjudice des règles impératives de protection des consommateurs qui peuvent s'appliquer dans votre pays de résidence.",
          content2: "En cas de litige, et à défaut de résolution amiable, les tribunaux compétents déterminés par les règles applicables de conflit de lois et de compétence juridictionnelle seront compétents."
        }
      },
      section16: {
        title: "16. MODIFICATION DES CGU",
        content: "My Notary se réserve le droit de modifier les présentes CGU à tout moment. Les modifications prendront effet dès leur publication sur la Plateforme.",
        content2: "Vous serez informé des modifications significatives par email. Votre utilisation continue de la Plateforme après modification constitue une acceptation des nouvelles CGU."
      },
      section17: {
        title: "17. DISPOSITIONS GÉNÉRALES",
        subsection1: {
          title: "17.1 Intégralité de l'accord",
          content: "Les présentes CGU constituent l'intégralité de l'accord entre vous et My Notary concernant l'utilisation de la Plateforme."
        },
        subsection2: {
          title: "17.2 Divisibilité",
          content: "Si une disposition des présentes CGU est jugée invalide ou inapplicable, les autres dispositions resteront en vigueur."
        },
        subsection3: {
          title: "17.3 Renonciation",
          content: "Le fait pour My Notary de ne pas exercer un droit prévu par les présentes CGU ne constitue pas une renonciation à ce droit."
        },
        subsection4: {
          title: "17.4 Cession",
          content: "Vous ne pouvez pas céder vos droits ou obligations en vertu des présentes CGU sans notre consentement écrit préalable."
        }
      },
      section18: {
        title: "18. CONTACT",
        content: "Pour toute question concernant les présentes CGU ou l'utilisation de la Plateforme :",
        company: "My Notary",
        email: "support@mynotary.io"
      },
      footer: {
        content: "En utilisant la Plateforme My Notary, vous reconnaissez avoir lu, compris et accepté les présentes Conditions Générales d'Utilisation."
      }
    }
  },
  en: {
      title: "Terms & Conditions",
      lastUpdated: "Last updated:",
      date: "November 17, 2025",
      sections: {
        section1: {
          title: "1. PLATFORM PRESENTATION",
          content: 'My Notary (hereinafter "the Platform") is an online service accessible via the website mynotary.io, operated by My Notary (hereinafter "My Notary", "we", "our"), which connects clients with certified notaries for the notarization of documents intended for international use. The Platform facilitates remote online notarization (RON) sessions and apostille processing in accordance with the Hague Convention.'
        },
        section2: {
          title: "2. DEFINITIONS",
          items: [
            { term: "Client", definition: "Any natural or legal person using the Platform to have documents notarized." },
            { term: "Notary", definition: "Certified and licensed public notary, partner of the Platform." },
            { term: "RON", definition: "Remote Online Notarization, a remote notarization procedure via video conference." },
            { term: "Apostille", definition: "Official certification attesting to the authenticity of a public document for international use." },
            { term: "Services", definition: "All services offered by the Platform." }
          ]
        },
        section3: {
          title: "3. ACCEPTANCE OF TERMS",
          content: "Use of the Platform implies full acceptance of these Terms and Conditions of Use (T&C). By creating an account or using our Services, you acknowledge that you have read, understood, and accepted these T&C.",
          content2: "If you do not accept these terms, you must not use the Platform."
        },
        section4: {
          title: "4. REGISTRATION AND USER ACCOUNT",
          subsection1: {
            title: "4.1 Account Creation",
            content: "To use the Platform, you must create an account by providing accurate, complete, and up-to-date information, including:",
            items: [
              "First and last name",
              "Valid email address",
              "Phone number",
              "Postal address",
              "Any other information required for the provision of Services"
            ]
          },
          subsection2: {
            title: "4.2 Account Responsibility",
            content: "You are responsible for:",
            items: [
              "The confidentiality of your login credentials",
              "All activities performed from your account",
              "Updating your personal information"
            ],
            content2: "You must inform us immediately of any unauthorized use of your account."
          },
          subsection3: {
            title: "4.3 Identity Verification",
            content: "In accordance with legal requirements applicable to notarizations, you must present a valid identity document during your notarization session. Accepted identity documents include:",
            items: [
              "Valid passport",
              "National identity card",
              "Driver's license"
            ]
          }
        },
        section5: {
          title: "5. DESCRIPTION OF SERVICES",
          subsection1: {
            title: "5.1 Services Offered",
            content: "The Platform offers the following services:",
            items: [
              "Connection with certified notaries",
              "Remote document notarization via secure video conference",
              "Obtaining apostilles for notarized documents",
              "Delivery of notarized and apostilled documents by mail or electronically"
            ]
          },
          subsection2: {
            title: "5.2 Notarization Process",
            content: "The process includes the following steps:",
            items: [
              "Upload your documents to the Platform",
              "Add signatory information (first name, last name, email)",
              "Online payment",
              "Identity verification and notarization session via video conference",
              "Electronic signature of documents in the presence of the notary",
              "Obtaining the notarized document and apostille",
              "Delivery of the certified document"
            ]
          },
          subsection3: {
            title: "5.3 Service Limitations",
            content: "The Platform does not provide:",
            items: [
              "Legal advice",
              "Interpretation of your document content"
            ]
          }
        },
        section6: {
          title: "6. CLIENT OBLIGATIONS",
          content: "You agree to:",
          items: [
            "Provide legal and authentic documents",
            "Not use the Platform for fraudulent or illegal purposes",
            "Be present and available during your notarization session",
            "Have a stable internet connection and functional audiovisual equipment",
            "Present a valid identity document during the session",
            "Follow the notary's instructions during the session",
            "Not record the video conference session without authorization"
          ]
        },
        section7: {
          title: "7. NOTARY ROLE AND RESPONSIBILITIES",
          subsection1: {
            title: "7.1 Notary Status",
            content: "Partner notaries are independent professionals, duly certified and licensed in their respective jurisdiction. They are not employees of My Notary but independent contractors."
          },
          subsection2: {
            title: "7.2 Notary Responsibilities",
            content: "Notaries are responsible for:",
            items: [
              "Verifying your identity",
              "Compliance of notarization with applicable laws",
              "Authenticity of the notarization act",
              "Adherence to applicable professional standards"
            ]
          },
          subsection3: {
            title: "7.3 Limitation of My Notary's Liability",
            content: "My Notary acts solely as a technological intermediary. We are not responsible for:",
            items: [
              "Errors or omissions by notaries",
              "Content of notarized documents",
              "Acceptance or rejection of your documents by destination authorities",
              "Legal consequences related to the content of your documents"
            ]
          }
        },
        section8: {
          title: "8. PRICING AND PAYMENT",
          subsection1: {
            title: "8.1 Service Prices",
            content: "Our Services rates are indicated on the Platform in the applicable currencies (e.g., Euros, Dollars, etc.).",
            content2: "The displayed price corresponds to the rate per notarized document. This base rate does not include the following items, which are charged as supplements or options at the prices indicated on the Platform:",
            items: [
              "The cost for any additional signatory added to the main signatory",
              "Apostille fees (optional service)",
              "Shipping fees (optional service)"
            ],
            content3: "Prices are subject to change at any time, but the applicable rates are those in effect at the time of order."
          },
          subsection2: {
            title: "8.2 Payment Methods",
            content: "Payment is made online by:",
            items: [
              "Credit card (Visa, Mastercard, American Express)",
              "Other payment methods available on the Platform"
            ],
            content2: "Financial transactions are secured and processed by our payment service provider, Stripe. Payment is due at the time of order."
          },
          subsection3: {
            title: "8.3 Invoicing",
            content: "An invoice will be sent to you by email after each transaction."
          },
          subsection4: {
            title: "8.4 Cancellations",
            beforeService: {
              title: "Before service access:",
              content: "As long as you have not initiated the identity verification session, you can request a credit valid for 12 months for later use by contacting our customer service at support@mynotary.io."
            },
            serviceInitiated: {
              title: "Service initiated:",
              content: "Once the identity verification session has been launched or your documents have been submitted for processing, the service is considered engaged and in progress. In accordance with consumer law provisions regarding fully executed services, the right of withdrawal cannot be exercised. No credit can be issued for an engaged service."
            },
            nonCompliant: {
              title: "Non-compliant documents:",
              content: "If your documents cannot be notarized due to non-compliance (illegible document, incomplete, not eligible for notarization, unverifiable identity), a credit valid for 6 months may be issued after review of your file by our customer service, less processing fees incurred."
            }
          }
        },
        section9: {
          title: "9. SERVICE INTERRUPTION OR IMPOSSIBILITY",
          subsection1: {
            title: "9.1 Cases of Interruption",
            content: "My Notary may be unable to provide the service in the following cases:",
            items: [
              "Temporary unavailability of the platform for scheduled or emergency maintenance",
              "Technical issue affecting video conferencing (servers, hosting, third-party providers)",
              "Temporary absence of available notary",
              "Incident affecting our payment or identity verification providers",
              "Cyberattack or security incident requiring service suspension",
              "Force majeure as defined in these T&C"
            ]
          },
          subsection2: {
            title: "9.2 Consequences",
            content: "In case of impossibility to provide the service for any of the reasons mentioned above, and if your payment has already been made, you will have the choice between:",
            items: [
              "Priority access as soon as service is restored",
              "A credit valid for 12 months usable on all our services",
              "Full refund upon express request sent to support@mynotary.io"
            ],
            content2: "My Notary commits to informing you as soon as possible of any service interruption and the proposed solutions."
          },
          subsection3: {
            title: "9.3 Exclusions",
            content: "My Notary cannot be held responsible for service interruptions or impossibilities related to:",
            clientIssues: {
              title: "Client-side technical issues:",
              items: [
                "Your internet connection or personal equipment (computer, webcam, microphone)",
                "Incompatibility of your browser or device with our platform",
                "A handling error on your part",
                "Lack of response on your part during the verification session",
                "An environment unsuitable for the video conference session (noise, insufficient lighting)"
              ]
            },
            documentIssues: {
              title: "Document-related issues:",
              items: [
                "Illegible, blurry, or poor quality documents",
                "Incomplete or partially uploaded documents",
                "Documents in a format not accepted by the platform",
                "Documents not eligible for notarization",
                "Forged, fraudulent documents or documents showing signs of alteration",
                "Documents not matching the applicant's identity",
                "Documents written in a language that does not allow their processing"
              ]
            },
            identityIssues: {
              title: "Identity verification issues:",
              items: [
                "Expired, illegible, or damaged identity document",
                "Inability to verify your identity (mismatch between identity document and person present)",
                "Refusal to submit to required identity verification steps"
              ]
            },
            content2: "In these cases, a credit valid for 6 months may be issued after review of your file by our customer service, less processing fees incurred. No refund will be granted."
          }
        },
        section10: {
          title: "10. INTELLECTUAL PROPERTY",
          subsection1: {
            title: "10.1 Platform Content",
            content: "All elements of the Platform (texts, graphics, logos, icons, images, software) are the exclusive property of My Notary or its partners and are protected by intellectual property laws."
          },
          subsection2: {
            title: "10.2 License of Use",
            content: "You have a personal, non-exclusive, and non-transferable right to use the Platform, solely for your own needs.",
            content2: "Any unauthorized reproduction, representation, modification, or exploitation is prohibited."
          }
        },
        section11: {
          title: "11. PERSONAL DATA PROTECTION",
          subsection1: {
            title: "11.1 Collection and Processing",
            content: "My Notary collects and processes your personal data in accordance with the General Data Protection Regulation (GDPR) and applicable laws. Data collected includes:",
            items: [
              "Identification information",
              "Contact details",
              "Identity documents",
              "Payment information",
              "Connection data"
            ]
          },
          subsection2: {
            title: "11.2 Processing Purposes",
            content: "Your data is used for:",
            items: [
              "Provision of Services",
              "Account management",
              "Communication with you",
              "Service improvement",
              "Compliance with our legal obligations"
            ]
          },
          subsection3: {
            title: "11.3 Retention Period",
            content: "Your data is retained for the duration necessary for the purposes for which it is processed, and in accordance with legal retention obligations.",
            content2: "Notarized documents are archived in accordance with legal requirements applicable to notaries."
          },
          subsection4: {
            title: "11.4 Your Rights",
            content: "In accordance with GDPR, you have the following rights:",
            items: [
              "Right of access to your data",
              "Right of rectification",
              "Right to erasure",
              "Right to restriction of processing",
              "Right to data portability",
              "Right to object"
            ],
            content2: "To exercise these rights, contact us at: support@mynotary.io"
          },
          subsection5: {
            title: "11.5 Security",
            content: "We implement appropriate technical and organizational measures to protect your data against unauthorized access, loss, or destruction."
          }
        },
        section12: {
          title: "12. CONFIDENTIALITY AND SECURITY",
          subsection1: {
            title: "12.1 Document Confidentiality",
            content: "Your documents are treated in strict confidence. They are only accessible to the notary assigned to your case and authorized My Notary personnel in the context of Service provision."
          },
          subsection2: {
            title: "12.2 Session Security",
            content: "Video conference notarization sessions are secure and encrypted. A recording may be made in accordance with legal requirements, but only for legal archiving purposes."
          },
          subsection3: {
            title: "12.3 Secure Storage",
            content: "Your documents are stored on secure servers with data encryption."
          }
        },
        section13: {
          title: "13. RESPONSIBILITIES AND WARRANTIES",
          subsection1: {
            title: "13.1 Best Efforts Obligation",
            content: "My Notary commits to implementing all necessary means to provide quality service, but does not guarantee a specific result regarding the acceptance of your documents by destination authorities."
          },
          subsection2: {
            title: "13.2 Limitation of Liability",
            content: "My Notary cannot be held responsible for:",
            items: [
              "Indirect, incidental, or consequential damages",
              "Loss of profits, data, or business opportunities",
              "Service interruptions related to force majeure",
              "Errors in documents provided by the Client",
              "Rejection of your documents by destination authorities",
              "Legal consequences related to the content of your documents"
            ]
          },
          subsection3: {
            title: "13.3 Client Warranties",
            content: "You warrant that:",
            items: [
              "You have the right and authority to have the submitted documents notarized",
              "Your documents are authentic and not fraudulent",
              "You use the Services for legal and legitimate purposes",
              "The information provided is accurate and truthful"
            ]
          }
        },
        section14: {
          title: "14. FORCE MAJEURE",
          content: "My Notary shall not be held responsible for non-performance of its obligations in case of force majeure, including but not limited to:",
          items: [
            "Natural disasters",
            "Network or equipment failures",
            "Wars, riots, civil unrest",
            "Government acts",
            "Strikes",
            "Epidemics"
          ]
        },
        section15: {
          title: "15. DISPUTE RESOLUTION",
          subsection1: {
            title: "15.1 Complaints",
            content: "For any complaint, contact our customer service at: support@mynotary.io. We commit to responding within 14 business days."
          },
          subsection2: {
            title: "15.2 Mediation",
            content: "In case of dispute, you may resort to mediation before any legal action."
          },
          subsection3: {
            title: "15.3 Applicable Law and Jurisdiction",
            content: "These T&C are governed by the laws applicable in the relevant jurisdiction, without prejudice to mandatory consumer protection rules that may apply in your country of residence.",
            content2: "In case of dispute, and failing amicable resolution, the competent courts determined by applicable conflict-of-law and jurisdiction rules shall have authority."
          }
        },
        section16: {
          title: "16. MODIFICATION OF T&C",
          content: "My Notary reserves the right to modify these T&C at any time. Modifications will take effect upon publication on the Platform.",
          content2: "You will be informed of significant modifications by email. Your continued use of the Platform after modification constitutes acceptance of the new T&C."
        },
        section17: {
          title: "17. GENERAL PROVISIONS",
          subsection1: {
            title: "17.1 Entire Agreement",
            content: "These T&C constitute the entire agreement between you and My Notary regarding the use of the Platform."
          },
          subsection2: {
            title: "17.2 Severability",
            content: "If any provision of these T&C is deemed invalid or unenforceable, the other provisions shall remain in effect."
          },
          subsection3: {
            title: "17.3 Waiver",
            content: "My Notary's failure to exercise a right provided by these T&C does not constitute a waiver of that right."
          },
          subsection4: {
            title: "17.4 Assignment",
            content: "You may not assign your rights or obligations under these T&C without our prior written consent."
          }
        },
        section18: {
          title: "18. CONTACT",
          content: "For any questions regarding these T&C or use of the Platform:",
          company: "My Notary",
          email: "support@mynotary.io"
        },
        footer: {
          content: "By using the My Notary Platform, you acknowledge that you have read, understood, and accepted these Terms and Conditions of Use."
        }
      }
    }
  };

// Si la langue demandée n'a pas de traduction, utiliser l'anglais
function getContent(lang) {
  if (termsContent[lang] && termsContent[lang] !== null) {
    return termsContent[lang];
  }
  return termsContent.en;
}

export default function TermsConditionsContent() {
  const { language } = useLanguage()
  const lang = language || 'en'
  const content = getContent(lang)
  const s = content.sections

  return (
    <div className="prose prose-lg max-w-none">
      {/* Section 1 */}
      <h2 className="text-3xl font-bold text-gray-900 mb-6 mt-12">{s.section1.title}</h2>
      <p className="text-gray-600 mb-6">{s.section1.content}</p>

      {/* Section 2 */}
      <h2 className="text-3xl font-bold text-gray-900 mb-6 mt-12">{s.section2.title}</h2>
      <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-2">
        {s.section2.items.map((item, idx) => (
          <li key={idx}><strong>{item.term}</strong>: {item.definition}</li>
        ))}
      </ul>

      {/* Section 3 */}
      <h2 className="text-3xl font-bold text-gray-900 mb-6 mt-12">{s.section3.title}</h2>
      <p className="text-gray-600 mb-6">{s.section3.content}</p>
      <p className="text-gray-600 mb-6">{s.section3.content2}</p>

      {/* Section 4 */}
      <h2 className="text-3xl font-bold text-gray-900 mb-6 mt-12">{s.section4.title}</h2>
      <h3 className="text-2xl font-bold text-gray-900 mb-4 mt-8">{s.section4.subsection1.title}</h3>
      <p className="text-gray-600 mb-4">{s.section4.subsection1.content}</p>
      <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-2">
        {s.section4.subsection1.items.map((item, idx) => (
          <li key={idx}>{item}</li>
        ))}
      </ul>

      <h3 className="text-2xl font-bold text-gray-900 mb-4 mt-8">{s.section4.subsection2.title}</h3>
      <p className="text-gray-600 mb-4">{s.section4.subsection2.content}</p>
      <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
        {s.section4.subsection2.items.map((item, idx) => (
          <li key={idx}>{item}</li>
        ))}
      </ul>
      <p className="text-gray-600 mb-6">{s.section4.subsection2.content2}</p>

      <h3 className="text-2xl font-bold text-gray-900 mb-4 mt-8">{s.section4.subsection3.title}</h3>
      <p className="text-gray-600 mb-4">{s.section4.subsection3.content}</p>
      <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-2">
        {s.section4.subsection3.items.map((item, idx) => (
          <li key={idx}>{item}</li>
        ))}
      </ul>

      {/* Section 5 */}
      <h2 className="text-3xl font-bold text-gray-900 mb-6 mt-12">{s.section5.title}</h2>
      <h3 className="text-2xl font-bold text-gray-900 mb-4 mt-8">{s.section5.subsection1.title}</h3>
      <p className="text-gray-600 mb-4">{s.section5.subsection1.content}</p>
      <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-2">
        {s.section5.subsection1.items.map((item, idx) => (
          <li key={idx}>{item}</li>
        ))}
      </ul>

      <h3 className="text-2xl font-bold text-gray-900 mb-4 mt-8">{s.section5.subsection2.title}</h3>
      <p className="text-gray-600 mb-4">{s.section5.subsection2.content}</p>
      <ol className="list-decimal pl-6 text-gray-600 mb-6 space-y-2">
        {s.section5.subsection2.items.map((item, idx) => (
          <li key={idx}>{item}</li>
        ))}
      </ol>

      <h3 className="text-2xl font-bold text-gray-900 mb-4 mt-8">{s.section5.subsection3.title}</h3>
      <p className="text-gray-600 mb-4">{s.section5.subsection3.content}</p>
      <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-2">
        {s.section5.subsection3.items.map((item, idx) => (
          <li key={idx}>{item}</li>
        ))}
      </ul>

      {/* Section 6 */}
      <h2 className="text-3xl font-bold text-gray-900 mb-6 mt-12">{s.section6.title}</h2>
      <p className="text-gray-600 mb-4">{s.section6.content}</p>
      <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-2">
        {s.section6.items.map((item, idx) => (
          <li key={idx}>{item}</li>
        ))}
      </ul>

      {/* Section 7 */}
      <h2 className="text-3xl font-bold text-gray-900 mb-6 mt-12">{s.section7.title}</h2>
      <h3 className="text-2xl font-bold text-gray-900 mb-4 mt-8">{s.section7.subsection1.title}</h3>
      <p className="text-gray-600 mb-6">{s.section7.subsection1.content}</p>

      <h3 className="text-2xl font-bold text-gray-900 mb-4 mt-8">{s.section7.subsection2.title}</h3>
      <p className="text-gray-600 mb-4">{s.section7.subsection2.content}</p>
      <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-2">
        {s.section7.subsection2.items.map((item, idx) => (
          <li key={idx}>{item}</li>
        ))}
      </ul>

      <h3 className="text-2xl font-bold text-gray-900 mb-4 mt-8">{s.section7.subsection3.title}</h3>
      <p className="text-gray-600 mb-4">{s.section7.subsection3.content}</p>
      <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-2">
        {s.section7.subsection3.items.map((item, idx) => (
          <li key={idx}>{item}</li>
        ))}
      </ul>

      {/* Section 8 */}
      <h2 className="text-3xl font-bold text-gray-900 mb-6 mt-12">{s.section8.title}</h2>
      <h3 className="text-2xl font-bold text-gray-900 mb-4 mt-8">{s.section8.subsection1.title}</h3>
      <p className="text-gray-600 mb-6">{s.section8.subsection1.content}</p>
      <p className="text-gray-600 mb-4">{s.section8.subsection1.content2}</p>
      <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
        {s.section8.subsection1.items.map((item, idx) => (
          <li key={idx}>{item}</li>
        ))}
      </ul>
      <p className="text-gray-600 mb-6">{s.section8.subsection1.content3}</p>

      <h3 className="text-2xl font-bold text-gray-900 mb-4 mt-8">{s.section8.subsection2.title}</h3>
      <p className="text-gray-600 mb-4">{s.section8.subsection2.content}</p>
      <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
        {s.section8.subsection2.items.map((item, idx) => (
          <li key={idx}>{item}</li>
        ))}
      </ul>
      <p className="text-gray-600 mb-6">{s.section8.subsection2.content2}</p>

      <h3 className="text-2xl font-bold text-gray-900 mb-4 mt-8">{s.section8.subsection3.title}</h3>
      <p className="text-gray-600 mb-6">{s.section8.subsection3.content}</p>

      <h3 className="text-2xl font-bold text-gray-900 mb-4 mt-8">{s.section8.subsection4.title}</h3>
      <p className="text-gray-600 mb-2"><strong>{s.section8.subsection4.beforeService.title}</strong></p>
      <p className="text-gray-600 mb-4">{s.section8.subsection4.beforeService.content}</p>
      <p className="text-gray-600 mb-2"><strong>{s.section8.subsection4.serviceInitiated.title}</strong></p>
      <p className="text-gray-600 mb-4">{s.section8.subsection4.serviceInitiated.content}</p>
      <p className="text-gray-600 mb-2"><strong>{s.section8.subsection4.nonCompliant.title}</strong></p>
      <p className="text-gray-600 mb-6">{s.section8.subsection4.nonCompliant.content}</p>

      {/* Section 9 */}
      <h2 className="text-3xl font-bold text-gray-900 mb-6 mt-12">{s.section9.title}</h2>
      <h3 className="text-2xl font-bold text-gray-900 mb-4 mt-8">{s.section9.subsection1.title}</h3>
      <p className="text-gray-600 mb-4">{s.section9.subsection1.content}</p>
      <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
        {s.section9.subsection1.items.map((item, idx) => (
          <li key={idx}>{item}</li>
        ))}
      </ul>

      <h3 className="text-2xl font-bold text-gray-900 mb-4 mt-8">{s.section9.subsection2.title}</h3>
      <p className="text-gray-600 mb-4">{s.section9.subsection2.content}</p>
      <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
        {s.section9.subsection2.items.map((item, idx) => (
          <li key={idx}>{item}</li>
        ))}
      </ul>
      <p className="text-gray-600 mb-6">{s.section9.subsection2.content2}</p>

      <h3 className="text-2xl font-bold text-gray-900 mb-4 mt-8">{s.section9.subsection3.title}</h3>
      <p className="text-gray-600 mb-4">{s.section9.subsection3.content}</p>
      <p className="text-gray-600 mb-2"><strong>{s.section9.subsection3.clientIssues.title}</strong></p>
      <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
        {s.section9.subsection3.clientIssues.items.map((item, idx) => (
          <li key={idx}>{item}</li>
        ))}
      </ul>
      <p className="text-gray-600 mb-2"><strong>{s.section9.subsection3.documentIssues.title}</strong></p>
      <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
        {s.section9.subsection3.documentIssues.items.map((item, idx) => (
          <li key={idx}>{item}</li>
        ))}
      </ul>
      <p className="text-gray-600 mb-2"><strong>{s.section9.subsection3.identityIssues.title}</strong></p>
      <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
        {s.section9.subsection3.identityIssues.items.map((item, idx) => (
          <li key={idx}>{item}</li>
        ))}
      </ul>
      <p className="text-gray-600 mb-6">{s.section9.subsection3.content2}</p>

      {/* Section 10 */}
      <h2 className="text-3xl font-bold text-gray-900 mb-6 mt-12">{s.section10.title}</h2>
      <h3 className="text-2xl font-bold text-gray-900 mb-4 mt-8">{s.section10.subsection1.title}</h3>
      <p className="text-gray-600 mb-6">{s.section10.subsection1.content}</p>

      <h3 className="text-2xl font-bold text-gray-900 mb-4 mt-8">{s.section10.subsection2.title}</h3>
      <p className="text-gray-600 mb-4">{s.section10.subsection2.content}</p>
      <p className="text-gray-600 mb-6">{s.section10.subsection2.content2}</p>

      {/* Section 11 */}
      <h2 className="text-3xl font-bold text-gray-900 mb-6 mt-12">{s.section11.title}</h2>
      <h3 className="text-2xl font-bold text-gray-900 mb-4 mt-8">{s.section11.subsection1.title}</h3>
      <p className="text-gray-600 mb-4">{s.section11.subsection1.content}</p>
      <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-2">
        {s.section11.subsection1.items.map((item, idx) => (
          <li key={idx}>{item}</li>
        ))}
      </ul>

      <h3 className="text-2xl font-bold text-gray-900 mb-4 mt-8">{s.section11.subsection2.title}</h3>
      <p className="text-gray-600 mb-4">{s.section11.subsection2.content}</p>
      <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-2">
        {s.section11.subsection2.items.map((item, idx) => (
          <li key={idx}>{item}</li>
        ))}
      </ul>

      <h3 className="text-2xl font-bold text-gray-900 mb-4 mt-8">{s.section11.subsection3.title}</h3>
      <p className="text-gray-600 mb-6">{s.section11.subsection3.content}</p>
      <p className="text-gray-600 mb-6">{s.section11.subsection3.content2}</p>

      <h3 className="text-2xl font-bold text-gray-900 mb-4 mt-8">{s.section11.subsection4.title}</h3>
      <p className="text-gray-600 mb-4">{s.section11.subsection4.content}</p>
      <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
        {s.section11.subsection4.items.map((item, idx) => (
          <li key={idx}>{item}</li>
        ))}
      </ul>
      <p className="text-gray-600 mb-6">
        {s.section11.subsection4.content2.split('support@mynotary.io')[0]}
        <a href="mailto:support@mynotary.io" className="text-black font-semibold hover:underline">support@mynotary.io</a>
      </p>

      <h3 className="text-2xl font-bold text-gray-900 mb-4 mt-8">{s.section11.subsection5.title}</h3>
      <p className="text-gray-600 mb-6">{s.section11.subsection5.content}</p>

      {/* Section 12 */}
      <h2 className="text-3xl font-bold text-gray-900 mb-6 mt-12">{s.section12.title}</h2>
      <h3 className="text-2xl font-bold text-gray-900 mb-4 mt-8">{s.section12.subsection1.title}</h3>
      <p className="text-gray-600 mb-6">{s.section12.subsection1.content}</p>

      <h3 className="text-2xl font-bold text-gray-900 mb-4 mt-8">{s.section12.subsection2.title}</h3>
      <p className="text-gray-600 mb-6">{s.section12.subsection2.content}</p>

      <h3 className="text-2xl font-bold text-gray-900 mb-4 mt-8">{s.section12.subsection3.title}</h3>
      <p className="text-gray-600 mb-6">{s.section12.subsection3.content}</p>

      {/* Section 13 */}
      <h2 className="text-3xl font-bold text-gray-900 mb-6 mt-12">{s.section13.title}</h2>
      <h3 className="text-2xl font-bold text-gray-900 mb-4 mt-8">{s.section13.subsection1.title}</h3>
      <p className="text-gray-600 mb-6">{s.section13.subsection1.content}</p>

      <h3 className="text-2xl font-bold text-gray-900 mb-4 mt-8">{s.section13.subsection2.title}</h3>
      <p className="text-gray-600 mb-4">{s.section13.subsection2.content}</p>
      <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-2">
        {s.section13.subsection2.items.map((item, idx) => (
          <li key={idx}>{item}</li>
        ))}
      </ul>

      <h3 className="text-2xl font-bold text-gray-900 mb-4 mt-8">{s.section13.subsection3.title}</h3>
      <p className="text-gray-600 mb-4">{s.section13.subsection3.content}</p>
      <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-2">
        {s.section13.subsection3.items.map((item, idx) => (
          <li key={idx}>{item}</li>
        ))}
      </ul>

      {/* Section 14 */}
      <h2 className="text-3xl font-bold text-gray-900 mb-6 mt-12">{s.section14.title}</h2>
      <p className="text-gray-600 mb-4">{s.section14.content}</p>
      <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-2">
        {s.section14.items.map((item, idx) => (
          <li key={idx}>{item}</li>
        ))}
      </ul>

      {/* Section 15 */}
      <h2 className="text-3xl font-bold text-gray-900 mb-6 mt-12">{s.section15.title}</h2>
      <h3 className="text-2xl font-bold text-gray-900 mb-4 mt-8">{s.section15.subsection1.title}</h3>
      <p className="text-gray-600 mb-6">
        {s.section15.subsection1.content.split('support@mynotary.io')[0]}
        <a href="mailto:support@mynotary.io" className="text-black font-semibold hover:underline">support@mynotary.io</a>
        {s.section15.subsection1.content.split('support@mynotary.io')[1]}
      </p>

      <h3 className="text-2xl font-bold text-gray-900 mb-4 mt-8">{s.section15.subsection2.title}</h3>
      <p className="text-gray-600 mb-6">{s.section15.subsection2.content}</p>

      <h3 className="text-2xl font-bold text-gray-900 mb-4 mt-8">{s.section15.subsection3.title}</h3>
      <p className="text-gray-600 mb-4">{s.section15.subsection3.content}</p>
      <p className="text-gray-600 mb-6">{s.section15.subsection3.content2}</p>

      {/* Section 16 */}
      <h2 className="text-3xl font-bold text-gray-900 mb-6 mt-12">{s.section16.title}</h2>
      <p className="text-gray-600 mb-6">{s.section16.content}</p>
      <p className="text-gray-600 mb-6">{s.section16.content2}</p>

      {/* Section 17 */}
      <h2 className="text-3xl font-bold text-gray-900 mb-6 mt-12">{s.section17.title}</h2>
      <h3 className="text-2xl font-bold text-gray-900 mb-4 mt-8">{s.section17.subsection1.title}</h3>
      <p className="text-gray-600 mb-6">{s.section17.subsection1.content}</p>

      <h3 className="text-2xl font-bold text-gray-900 mb-4 mt-8">{s.section17.subsection2.title}</h3>
      <p className="text-gray-600 mb-6">{s.section17.subsection2.content}</p>

      <h3 className="text-2xl font-bold text-gray-900 mb-4 mt-8">{s.section17.subsection3.title}</h3>
      <p className="text-gray-600 mb-6">{s.section17.subsection3.content}</p>

      <h3 className="text-2xl font-bold text-gray-900 mb-4 mt-8">{s.section17.subsection4.title}</h3>
      <p className="text-gray-600 mb-6">{s.section17.subsection4.content}</p>

      {/* Section 18 */}
      <h2 className="text-3xl font-bold text-gray-900 mb-6 mt-12">{s.section18.title}</h2>
      <p className="text-gray-600 mb-4">{s.section18.content}</p>
      <div className="text-gray-600 mb-6 space-y-2">
        <p><strong>{s.section18.company}</strong></p>
        <p>
          Email: <a href={`mailto:${s.section18.email}`} className="text-black font-semibold hover:underline">{s.section18.email}</a>
        </p>
      </div>

      <hr className="border-gray-300 my-8" />

      <p className="text-gray-600 mb-6 italic">
        <strong>{s.footer.content}</strong>
      </p>
    </div>
  )
}
