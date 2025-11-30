export interface MetaTags {
  [key: string]: string;
}

export interface OpenGraphTags {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: string;
  siteName?: string;
  locale?: string;
}

export interface TwitterCardTags {
  card?: 'summary' | 'summary_large_image' | 'app' | 'player';
  title?: string;
  description?: string;
  image?: string;
  site?: string;
  creator?: string;
}

export interface StructuredData {
  '@context'?: string;
  '@type'?: string;
  [key: string]: any;
}

export interface SeoConfig {
  title?: string;
  description?: string;
  icon?: string;
  canonical?: string;
  metaTags?: MetaTags;
  openGraph?: OpenGraphTags;
  twitter?: TwitterCardTags;
  structuredData?: StructuredData | StructuredData[];
  robots?: string;
  keywords?: string;
}

const updateOrCreateMetaTag = (name: string, content: string, attribute: 'name' | 'property' = 'name'): void => {
  let metaTag = document.querySelector<HTMLMetaElement>(`meta[${attribute}="${name}"]`);
  if (!metaTag) {
    metaTag = document.createElement('meta');
    metaTag.setAttribute(attribute, name);
    document.head.appendChild(metaTag);
  }
  metaTag.content = content;
};

const updateOrCreateLinkTag = (rel: string, href: string, attributes?: Record<string, string>): void => {
  let linkTag = document.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!linkTag) {
    linkTag = document.createElement('link');
    linkTag.rel = rel;
    document.head.appendChild(linkTag);
  }
  linkTag.href = href;
  if (attributes) {
    Object.entries(attributes).forEach(([key, value]) => {
      linkTag.setAttribute(key, value);
    });
  }
};

const removeMetaTag = (name: string, attribute: 'name' | 'property' = 'name'): void => {
  const metaTag = document.querySelector<HTMLMetaElement>(`meta[${attribute}="${name}"]`);
  if (metaTag) {
    metaTag.remove();
  }
};

const removeStructuredData = (): void => {
  const scripts = document.querySelectorAll('script[type="application/ld+json"]');
  scripts.forEach((script) => script.remove());
};

export const useSeo = (config: SeoConfig): void => {
  // Title
  if (config.title) {
    document.title = config.title;
    updateOrCreateMetaTag('title', config.title);
  }

  // Description
  if (config.description) {
    updateOrCreateMetaTag('description', config.description);
  }

  // Keywords
  if (config.keywords) {
    updateOrCreateMetaTag('keywords', config.keywords);
  }

  // Robots
  if (config.robots) {
    updateOrCreateMetaTag('robots', config.robots);
  }

  // Favicon
  if (config.icon) {
    updateOrCreateLinkTag('icon', config.icon);
  }

  // Canonical URL
  if (config.canonical) {
    updateOrCreateLinkTag('canonical', config.canonical);
  }

  // Open Graph Tags
  if (config.openGraph) {
    const og = config.openGraph;
    if (og.title) updateOrCreateMetaTag('og:title', og.title, 'property');
    if (og.description) updateOrCreateMetaTag('og:description', og.description, 'property');
    if (og.image) updateOrCreateMetaTag('og:image', og.image, 'property');
    if (og.url) updateOrCreateMetaTag('og:url', og.url, 'property');
    if (og.type) updateOrCreateMetaTag('og:type', og.type, 'property');
    if (og.siteName) updateOrCreateMetaTag('og:site_name', og.siteName, 'property');
    if (og.locale) updateOrCreateMetaTag('og:locale', og.locale, 'property');
  }

  // Twitter Card Tags
  if (config.twitter) {
    const twitter = config.twitter;
    if (twitter.card) updateOrCreateMetaTag('twitter:card', twitter.card);
    if (twitter.title) updateOrCreateMetaTag('twitter:title', twitter.title);
    if (twitter.description) updateOrCreateMetaTag('twitter:description', twitter.description);
    if (twitter.image) updateOrCreateMetaTag('twitter:image', twitter.image);
    if (twitter.site) updateOrCreateMetaTag('twitter:site', twitter.site);
    if (twitter.creator) updateOrCreateMetaTag('twitter:creator', twitter.creator);
  }

  // Custom Meta Tags
  if (config.metaTags) {
    Object.entries(config.metaTags).forEach(([key, value]) => {
      updateOrCreateMetaTag(key, value);
    });
  }

  // Structured Data (JSON-LD)
  if (config.structuredData) {
    removeStructuredData();
    const dataArray = Array.isArray(config.structuredData) ? config.structuredData : [config.structuredData];
    dataArray.forEach((data) => {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify({
        '@context': 'https://schema.org',
        ...data,
      });
      document.head.appendChild(script);
    });
  }
};

export const clearSeo = (): void => {
  // Remove common meta tags
  const metaTagsToRemove = [
    'description',
    'keywords',
    'robots',
    'og:title',
    'og:description',
    'og:image',
    'og:url',
    'og:type',
    'og:site_name',
    'og:locale',
    'twitter:card',
    'twitter:title',
    'twitter:description',
    'twitter:image',
    'twitter:site',
    'twitter:creator',
  ];

  metaTagsToRemove.forEach((tag) => {
    removeMetaTag(tag, tag.startsWith('og:') ? 'property' : 'name');
  });

  removeStructuredData();
};
