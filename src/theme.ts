/**
 * VueTail shape config.
 *
 * Change `theme.shape` here to adjust border-radius across the app.
 * Colors are controlled exclusively by `src/config/app.config.ts`.
 */

export type Shape = 'square' | 'rounded' | 'pill';

export interface UiThemeConfig {
  shape: Shape;
}

export const theme: UiThemeConfig = {
  shape: 'rounded',
};
