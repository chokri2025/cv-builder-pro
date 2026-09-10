/**
 * Minimal GA4 wrapper. Loads gtag.js only when a measurement ID is configured
 * (VITE_GA_MEASUREMENT_ID), so local dev and PR previews never send traffic to
 * production analytics. Without this, GSC/AdSense cannot tell a session that
 * used the builder from one that bounced — see the roadmap's Phase 1.5.
 */

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

const MEASUREMENT_ID = import.meta.env?.VITE_GA_MEASUREMENT_ID as string | undefined;

let initialized = false;

export function initAnalytics(): void {
  if (initialized || !MEASUREMENT_ID || typeof document === 'undefined') return;
  initialized = true;

  window.dataLayer = window.dataLayer ?? [];
  window.gtag = function gtag(...args: unknown[]) {
    window.dataLayer!.push(args);
  };
  window.gtag('js', new Date());
  window.gtag('config', MEASUREMENT_ID, { anonymize_ip: true });

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`;
  document.head.appendChild(script);
}

/**
 * Fires a GA4 event. Safe to call before initAnalytics has run or when no
 * measurement ID is configured — it just no-ops.
 */
export function trackEvent(name: string, params?: Record<string, unknown>): void {
  if (!MEASUREMENT_ID || typeof window === 'undefined' || !window.gtag) return;
  window.gtag('event', name, params);
}
