const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;
const GOOGLE_TAG_SCRIPT_ID = "homefix-google-analytics";

let initialized = false;
let lastTrackedPath = "";
let previousPageLocation = "";

function hasValidMeasurementId() {
  return typeof measurementId === "string" && measurementId.startsWith("G-");
}

export function initializeAnalytics() {
  if (!hasValidMeasurementId() || typeof window === "undefined") {
    return false;
  }

  if (initialized) {
    return true;
  }

  window.dataLayer = window.dataLayer || [];
  window.gtag =
    window.gtag ||
    function gtag() {
      window.dataLayer.push(arguments);
    };

  if (!document.getElementById(GOOGLE_TAG_SCRIPT_ID)) {
    const script = document.createElement("script");
    script.id = GOOGLE_TAG_SCRIPT_ID;
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(
      measurementId,
    )}`;
    document.head.appendChild(script);
  }

  window.gtag("js", new Date());
  window.gtag("config", measurementId, {
    send_page_view: false,
  });

  initialized = true;
  return true;
}

export function trackPageView(path) {
  if (!initializeAnalytics() || path === lastTrackedPath) {
    return;
  }

  const pageLocation = `${window.location.origin}${path}`;
  const parameters = {
    page_path: path,
    page_location: pageLocation,
    page_title: document.title,
  };

  if (previousPageLocation) {
    parameters.page_referrer = previousPageLocation;
  }

  window.gtag("event", "page_view", parameters);
  previousPageLocation = pageLocation;
  lastTrackedPath = path;
}
