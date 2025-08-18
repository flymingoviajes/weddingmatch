// Dispara la apertura del RSVP con un payload opcional (ocupación, total, etc.)
export function emitOpenRSVP(payload?: any) {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent('rsvp:open', { detail: payload }));
}
