import type { Plugin } from 'vite';
import { appIdentity } from '../src/config/identity';

export function htmlConfigPlugin(): Plugin {
  return {
    name: 'vuetail:html-config',
    transformIndexHtml(html) {
      return html
        .replace(/<title>.*?<\/title>/, `<title>${appIdentity.title}</title>`)
        .replace(/(<meta name="description" content=").*?(")/, `$1${appIdentity.description}$2`);
    },
  };
}
