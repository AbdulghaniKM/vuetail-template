// ─── Error reporting: one exit for every unexpected error ───────────────────
//
// Render errors, unhandled promise rejections, and failed queries and mutations all end up in
// reportError(). By default it logs to the console. Point it at your error tracker once, at boot:
//
//   import * as Sentry from '@sentry/vue';
//   setErrorReporter((error, context) => Sentry.captureException(error, { extra: { ...context } }));
//
// Expected HTTP outcomes are not reported: a 4xx is the API answering (validation, auth, not
// found), a cancelled request is a query that was no longer needed, and a request with no response
// is the user being offline. The axios interceptor already tells the user about those. A 5xx, or
// any error that isn't from axios (a bug in your code), is reported.

import { isAxiosError, isCancel } from 'axios';

export interface ErrorContext {
  /** Where the error was caught. */
  source: 'vue' | 'unhandledrejection' | 'query' | 'mutation';
  /** Vue's lifecycle hint, e.g. "setup function". */
  info?: string;
  /** The failed query's or mutation's key. */
  key?: readonly unknown[];
}

export type ErrorReporter = (error: unknown, context: ErrorContext) => void;

const consoleReporter: ErrorReporter = (error, context) => {
  console.error(`[${context.source}]`, context.info ?? context.key ?? '', error);
};

let reporter: ErrorReporter = consoleReporter;

/** Replace where errors go (Sentry, your own endpoint). Pass nothing to go back to the console. */
export const setErrorReporter = (next: ErrorReporter = consoleReporter): void => {
  reporter = next;
};

/** Whether an error is a normal HTTP outcome rather than something to investigate. */
export const isExpectedHttpError = (error: unknown): boolean => {
  if (isCancel(error)) return true;
  if (!isAxiosError(error)) return false;
  const status = error.response?.status;
  return status === undefined || status < 500;
};

export const reportError = (error: unknown, context: ErrorContext): void => {
  if (isExpectedHttpError(error)) return;
  try {
    reporter(error, context);
  } catch (reporterError) {
    // A broken reporter must not take the app down with it.
    console.error('[errorReporter] reporter threw', reporterError, error);
  }
};
