import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ 
  title, 
  description, 
  image = 'https://stockfinder-dhruva.netlify.app/og-image.jpg', 
  url = 'https://stockfinder-dhruva.netlify.app', 
  type = 'website', 
  robots = 'index, follow',
  schema 
}) => {
  const siteTitle = title ? `${title} | STOCK FINDER` : 'STOCK FINDER — Instant Stock Intelligence';
  const fullUrl = url.startsWith('http') ? url : `https://stockfinder-dhruva.netlify.app${url}`;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{siteTitle}</title>
      <meta name="description" content={description || 'Premium real-time inventory discovery across Gujarat premier retail nodes.'} />
      <meta name="robots" content={robots} />
      <link rel="canonical" href={fullUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content="STOCK FINDER" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={fullUrl} />
      <meta name="twitter:title" content={siteTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Structured Data */}
      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;
