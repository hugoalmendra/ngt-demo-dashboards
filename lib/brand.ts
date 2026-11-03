// =====================================================================
// Student branding. IAU-tagged students see IAU's colors and logo; everyone
// else sees NGT. Colors are CSS variables (app/globals.css), switched by
// data-brand="iau" on <html>. In production the brand comes from the student's
// IAU tag (isIauStudent); this prototype previews both with a local setting.
// =====================================================================

export type Brand = "ngt" | "iau";

export const BRAND_STORAGE_KEY = "ngt-demo-brand";

/** Self-contained: also inlined before first paint (BRAND_INIT_SCRIPT) so there's no yellow flash. */
export function applyBrand() {
  var key = "ngt-demo-brand";
  var stored = null;
  var q = new URLSearchParams(location.search).get("brand");
  try {
    if (q === "iau" || q === "ngt") localStorage.setItem(key, q);
    stored = localStorage.getItem(key);
  } catch (e) {}
  var brand = q === "iau" || q === "ngt" ? q : stored;
  // Staff views, the landing page and login never carry a student's brand.
  if (brand === "iau" && /\/(student|learn)(\/|$)/.test(location.pathname)) {
    document.documentElement.setAttribute("data-brand", "iau");
  } else {
    document.documentElement.removeAttribute("data-brand");
  }
}

export const BRAND_INIT_SCRIPT = `(${applyBrand.toString()})()`;

export function setPreviewBrand(brand: Brand) {
  try {
    localStorage.setItem(BRAND_STORAGE_KEY, brand);
  } catch {
    /* storage blocked: the preview only lasts for this page */
  }
  const url = new URL(location.href);
  if (url.searchParams.has("brand")) {
    url.searchParams.delete("brand");
    history.replaceState(null, "", url);
  }
  applyBrand();
}
