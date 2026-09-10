import React from 'react';

export const SEOHead = () => {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "CyberRide",
    "url": "https://cyberride.ae",
    "logo": "https://cyberride.ae/assets/nexus-hero.png",
    "description": "Engineered in Dubai. The NEXUS LED Smart Backpack and premium riding technology.",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Dubai Design District (d3), Building 5",
      "addressLocality": "Dubai",
      "addressRegion": "Dubai",
      "postalCode": "00000",
      "addressCountry": "AE"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+971-50-000-0000",
      "contactType": "customer service",
      "areaServed": ["AE", "SA", "QA", "KW", "OM", "BH"],
      "availableLanguage": ["English", "Arabic"]
    }
  };

  const productSchema = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": "CYBERRIDE NEXUS LED SMART BACKPACK",
    "image": [
      "https://cyberride.ae/assets/nexus-hero.png",
      "https://cyberride.ae/assets/nexus-lifestyle.png"
    ],
    "description": "A hardshell aerodynamic motorcycle backpack featuring dual programmable LED eye displays controlled via Bluetooth smartphone app. Built for Dubai riders.",
    "sku": "CB-NEXUS-01",
    "mpn": "NEXUS-LED-DUBAI",
    "brand": {
      "@type": "Brand",
      "name": "CyberRide"
    },
    "offers": {
      "@type": "Offer",
      "url": "https://cyberride.ae",
      "priceCurrency": "AED",
      "price": "349.00",
      "priceValidUntil": "2027-12-31",
      "itemCondition": "https://schema.org/NewCondition",
      "availability": "https://schema.org/InStock",
      "seller": {
        "@type": "Organization",
        "name": "CyberRide FZ-LLC"
      }
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "128"
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
    </>
  );
};
