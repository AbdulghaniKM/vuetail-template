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
//   export const getAuthToken = () => localStorage.getItem(KEY);
//   export const setAuthToken = (t: string | null) =>
//     t ? localStorage.setItem(KEY, t) : localStorage.removeItem(KEY);
//
// For production, prefer keeping only this short-lived ACCESS token in memory
// and the long-lived REFRESH token in an httpOnly + SameSite cookie set by your
// server. See README → "Authentication & token storage".

let accessToken: string | null = null;

/** The current access token, or null when unauthenticated. */
export const getAuthToken = (): string | null => accessToken;

/** Set (on login / refresh) or clear (pass null) the access token. */
export const setAuthToken = (token: string | null): void => {
  accessToken = token;
};

/** Clear the access token (on logout / failed refresh). */
export const clearAuthToken = (): void => {
  accessToken = null;
};

/** Whether an access token is currently held. */
export const isAuthenticated = (): boolean => accessToken !== null;
