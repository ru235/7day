// История расчётов + шаринг через URL
export function saveHist(key, entry) {
  try { const h = JSON.parse(localStorage.getItem(key) || '[]'); h.unshift({ ...entry, t: Date.now() }); localStorage.setItem(key, JSON.stringify(h.slice(0, 20))); } catch {}
}
export function shareURL(params) {
  const u = new URL(location.href); Object.entries(params).forEach(([k, v]) => u.searchParams.set(k, v));
  history.replaceState(null, '', u); return u.toString();
}
