# JSON-LD Schema Templates

Use these templates as the basis for auto-fix schema blocks in audit reports. Replace placeholder values with real content from the audited page.

---

## Article / Blog Post

```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "[Page Title]",
  "description": "[Meta description]",
  "author": {
    "@type": "Person",
    "name": "[Author Name]"
  },
  "publisher": {
    "@type": "Organization",
    "name": "[Site Name]",
    "logo": {
      "@type": "ImageObject",
      "url": "[Logo URL]"
    }
  },
  "datePublished": "[YYYY-MM-DD]",
  "dateModified": "[YYYY-MM-DD]",
  "image": "[Featured image URL]",
  "url": "[Canonical URL]"
}
```

---

## WooCommerce Product

```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "[Product Name]",
  "description": "[Product description]",
  "image": ["[Image URL 1]", "[Image URL 2]"],
  "sku": "[SKU]",
  "brand": {
    "@type": "Brand",
    "name": "[Brand Name]"
  },
  "offers": {
    "@type": "Offer",
    "url": "[Product URL]",
    "priceCurrency": "[USD/EUR/TND]",
    "price": "[Price]",
    "availability": "https://schema.org/InStock",
    "seller": {
      "@type": "Organization",
      "name": "[Store Name]"
    }
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "[4.5]",
    "reviewCount": "[23]"
  }
}
```

---

## FAQ Page

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "[Question 1?]",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "[Answer 1]"
      }
    },
    {
      "@type": "Question",
      "name": "[Question 2?]",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "[Answer 2]"
      }
    }
  ]
}
```

---

## Local Business

```json
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "[Business Name]",
  "image": "[Image URL]",
  "url": "[Website URL]",
  "telephone": "[+216XXXXXXXX]",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "[Street]",
    "addressLocality": "[City]",
    "addressCountry": "[TN / FR / US]"
  },
  "openingHoursSpecification": {
    "@type": "OpeningHoursSpecification",
    "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday"],
    "opens": "09:00",
    "closes": "18:00"
  }
}
```

---

## Breadcrumb

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "[https://example.com]"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "[Category Name]",
      "item": "[https://example.com/category]"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "[Page Name]",
      "item": "[https://example.com/category/page]"
    }
  ]
}
```

---

## Organization (Homepage)

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "[Organization Name]",
  "url": "[https://example.com]",
  "logo": "[https://example.com/logo.png]",
  "sameAs": [
    "[https://facebook.com/page]",
    "[https://twitter.com/handle]",
    "[https://linkedin.com/company/name]"
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "[+216XXXXXXXX]",
    "contactType": "customer service",
    "availableLanguage": ["Arabic", "French", "English"]
  }
}
```
