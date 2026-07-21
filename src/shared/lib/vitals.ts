// src/shared/lib/vitals.ts
import { onCLS, onINP, onLCP, type Metric } from 'web-vitals';

function report(metric: Metric) {
  // Dev: log. Production (Module 8's Sentry/analytics): send upstream.
  if (import.meta.env.DEV) {
    console.log(`[vitals] ${metric.name}: ${Math.round(metric.value)} (${metric.rating})`);
  }
}

export function initVitals() {
  onLCP(report);
  onINP(report);
  onCLS(report);
}