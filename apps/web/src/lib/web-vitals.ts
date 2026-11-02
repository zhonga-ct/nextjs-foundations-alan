import { type Metric, onCLS, onINP, onLCP } from "web-vitals";

// Thresholds ("good"): LCP < 2500ms, INP < 200ms, CLS < 0.1
export function registerWebVitals() {
  onLCP((metric) => {
    console.log("LCP:", metric.value, "ms", "Target: <2500ms");
    sendToAnalytics(metric);
  });

  onINP((metric) => {
    console.log("INP:", metric.value, "ms", "Target: <200ms");
    sendToAnalytics(metric);
  });

  onCLS((metric) => {
    console.log("CLS:", metric.value, "Target: <0.1");
    sendToAnalytics(metric);
  });
}

function sendToAnalytics(metric: Metric) {
  const { id, name, value, rating } = metric;

  // Send to our own reporting endpoint (absolute path on the same origin)
  fetch("/api/analytics/vitals", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      id,
      name,
      value,
      rating,
      url: window.location.pathname,
      timestamp: Date.now(),
    }),
    keepalive: true, // CLS/INP often report on page hide; let the request outlive the page
  }).catch((error) => {
    console.error("Failed to send vitals:", error);
  });
}
