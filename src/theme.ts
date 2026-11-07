// The short file you edit to restyle the app. Values live in the VueTail tokens
// (styles/tokens.css in the registry); this only picks which preset the app starts on and
// how each preset's fonts load. Runtime switching goes through useAppUi().

export type Preset = 'ink' | 'pine' | 'console';

export interface ThemeConfig {
  /** The preset a first-time visitor sees. Ink is the VueTail default. */
  preset: Preset;
}

export const theme: ThemeConfig = {
  preset: 'ink',
};

/** Shown in preset pickers. */
export const presetInfo: Record<Preset, { label: string; description: string }> = {
  ink: {
    label: 'Ink',
    description: 'Quiet and exact: ink actions, signal blue, borders over shadows.',
  },
  pine: { label: 'Pine', description: 'Soft depth, pine green, rounder corners.' },
  console: {
    label: 'Console',
    description: 'Dense: 32px controls and 13px text, for data-heavy screens.',
  },
};

/**
 * Loads a preset's faces the first time it is used. Ink's faces are imported in main.ts so
 * the default never waits on a font. Leave an entry out to rely on fonts you load yourself.
 */
export const presetFonts: Partial<Record<Preset, () => Promise<unknown>>> = {
  pine: () =>
    Promise.all([
      import('@fontsource-variable/plus-jakarta-sans'),
      import('@fontsource-variable/jetbrains-mono'),
    ]),
  console: () =>
    Promise.all([
      import('@fontsource-variable/ibm-plex-sans'),
      import('@fontsource/ibm-plex-mono/400.css'),
      import('@fontsource/ibm-plex-mono/500.css'),
    ]),
};
