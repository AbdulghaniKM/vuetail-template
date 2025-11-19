export interface MetaTags {
  [key: string]: string;
}

export interface SeoConfig {
  title?: string;
  icon?: string;
  metaTags?: MetaTags;
}

export const useSeo = (config: SeoConfig) => {
  if (config.title) {
    document.title = config.title;
  }

  if (config.icon) {
    let iconLink = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
    if (!iconLink) {
      iconLink = document.createElement('link');
      iconLink.rel = 'icon';
      document.head.appendChild(iconLink);
    }
    iconLink.href = config.icon;
  }

  if (config.metaTags) {
    Object.keys(config.metaTags).forEach((key) => {
      let metaTag = document.querySelector<HTMLMetaElement>(`meta[name="${key}"]`);
      if (!metaTag) {
        metaTag = document.createElement('meta');
        metaTag.name = key;
        document.head.appendChild(metaTag);
      }
      metaTag.content = config.metaTags![key];
    });
  }
};
