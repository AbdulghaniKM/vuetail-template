// ─── Auth access token — single source of truth ─────────────────────────────
//
// DEFAULT: in-memory storage. The token lives only in this module's closure, so
// it is never readable by other scripts (no localStorage / no JS-readable
// cookie) and therefore cannot be exfiltrated by an XSS payload doing
// `localStorage.getItem(...)`. This is the safest default.
//
// TRADEOFF: a full page reload clears the token, so the user appears logged out
// on refresh. Pair this with a silent-refresh flow — register a `refreshToken`
// on the axios AuthProvider (see src/main.ts / src/plugins/axios.ts) that calls
// your backend's refresh endpoint (which reads an httpOnly refresh cookie) and
// feeds the new access token back via `setAuthToken`.
//
// TO PERSIST ACROSS RELOADS (less secure — opt in): replace the in-memory
// variable below with localStorage/sessionStorage reads/writes. Everything else
// in the app (router guard, axios interceptor) goes through these functions, so
// this is the ONLY file you need to change.
//
//   const KEY = 'auth-token';
//   const accessToken = shallowRef<string | null>(localStorage.getItem(KEY));
//   watch(accessToken, (t) => (t ? localStorage.setItem(KEY, t) : localStorage.removeItem(KEY)));
//
// For production, prefer keeping only this short-lived ACCESS token in memory
// and the long-lived REFRESH token in an httpOnly + SameSite cookie set by your
// server. See README → "Authentication & token storage".

import { shallowRef } from 'vue';

// A shallowRef rather than a plain variable, so a computed that calls getAuthToken() (useAuth's
// isAuthenticated, a header showing "Sign out") updates when any caller clears the token.
const accessToken = shallowRef<string | null>(null);

/** The current access token, or null when unauthenticated. Reactive inside computed/watch. */
export const getAuthToken = (): string | null => accessToken.value;

/** Set (on login / refresh) or clear (pass null) the access token. */
export const setAuthToken = (token: string | null): void => {
  accessToken.value = token;
};

/** Clear the access token (on logout / failed refresh). */
export const clearAuthToken = (): void => {
  accessToken.value = null;
};

/** Whether an access token is currently held. Reactive inside computed/watch. */
export const isAuthenticated = (): boolean => accessToken.value !== null;
