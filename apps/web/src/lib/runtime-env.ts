const PRODUCTION_HOSTNAMES = new Set([ "zenblog.com", "www.zenblog.com" ]);

export function isProductionDeployment() {
  if (typeof window === "undefined") {
    return process.env.NODE_ENV === "production";
  }

  return PRODUCTION_HOSTNAMES.has(window.location.hostname);
}

export function isPreviewOrDevDeployment() {
  return !isProductionDeployment();
}
