import { useEffect } from "react";

export function PWAMeta() {
  useEffect(() => {
    // Add PWA meta tags programmatically
    const metaTags = [
      { name: 'viewport', content: 'width=device-width, initial-scale=1, shrink-to-fit=no' },
      { name: 'theme-color', content: '#3b82f6' },
      { name: 'apple-mobile-web-app-capable', content: 'yes' },
      { name: 'apple-mobile-web-app-status-bar-style', content: 'default' },
      { name: 'apple-mobile-web-app-title', content: 'SmartCity' },
      { name: 'application-name', content: 'SmartCity' },
      { name: 'msapplication-TileColor', content: '#3b82f6' },
      { name: 'msapplication-TileImage', content: '/smartcity-icon-192.png' },
      { name: 'msapplication-config', content: '/browserconfig.xml' }
    ];

    const linkTags = [
      { rel: 'manifest', href: '/manifest.json' },
      { rel: 'apple-touch-icon', href: '/smartcity-icon-192.png' },
      { rel: 'icon', type: 'image/png', sizes: '192x192', href: '/smartcity-icon-192.png' },
      { rel: 'icon', type: 'image/png', sizes: '512x512', href: '/smartcity-icon-512.png' }
    ];

    // Add meta tags
    metaTags.forEach(tag => {
      let existingTag = document.querySelector(`meta[name="${tag.name}"]`);
      if (!existingTag) {
        existingTag = document.createElement('meta');
        existingTag.setAttribute('name', tag.name);
        document.head.appendChild(existingTag);
      }
      existingTag.setAttribute('content', tag.content);
    });

    // Add link tags
    linkTags.forEach(tag => {
      let existingTag = document.querySelector(`link[rel="${tag.rel}"]${tag.sizes ? `[sizes="${tag.sizes}"]` : ''}`);
      if (!existingTag) {
        existingTag = document.createElement('link');
        existingTag.setAttribute('rel', tag.rel);
        if (tag.type) existingTag.setAttribute('type', tag.type);
        if (tag.sizes) existingTag.setAttribute('sizes', tag.sizes);
        document.head.appendChild(existingTag);
      }
      existingTag.setAttribute('href', tag.href);
    });

    // Add canonical URL
    let canonicalTag = document.querySelector('link[rel="canonical"]');
    if (!canonicalTag) {
      canonicalTag = document.createElement('link');
      canonicalTag.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalTag);
    }
    canonicalTag.setAttribute('href', window.location.origin + window.location.pathname);

  }, []);

  return null;
}