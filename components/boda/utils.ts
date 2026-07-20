// components/boda/utils.ts

export function formatCurrency(v: number, c: 'MXN' | 'USD') {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: c,
  }).format(v);
}

export function formatDateLong(iso: string) {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString('es-MX', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return iso;
  }
}

export function nightsBetween(startISO: string, endISO: string) {
  const a = new Date(startISO);
  const b = new Date(endISO);
  const ms = b.getTime() - a.getTime();
  return Math.max(0, Math.round(ms / (1000 * 60 * 60 * 24)));
}

/** Días que faltan a partir de ahora (redondeado hacia arriba). Negativo si ya pasó. */
export function daysUntil(iso: string) {
  const ms = new Date(iso).getTime() - Date.now();
  return Math.ceil(ms / (1000 * 60 * 60 * 24));
}

/** true si ya pasó la fecha límite de tarifa de grupo (o no hay fecha límite -> false) */
export function isVencido(fechaLimite?: string) {
  if (!fechaLimite) return false;
  return daysUntil(fechaLimite) <= 0;
}

/**
 * Genera un data-URI ICS para “Agregar al calendario”.
 * Usamos UTC en DTSTART/DTEND como recomienda el formato iCal.
 */
export function icsFromEvent(
  slug: string,
  title: string,
  startISO: string,
  durationHours = 6
): string {
  const dt = new Date(startISO);

  const pad = (n: number) => String(n).padStart(2, '0');

  const toUTC = (date: Date) => {
    const y = date.getUTCFullYear();
    const m = pad(date.getUTCMonth() + 1);
    const d = pad(date.getUTCDate());
    const h = pad(date.getUTCHours());
    const min = pad(date.getUTCMinutes());
    const s = pad(date.getUTCSeconds());
    return `${y}${m}${d}T${h}${min}${s}Z`;
  };

  const dtStart = toUTC(dt);
  const dtEnd = toUTC(new Date(dt.getTime() + durationHours * 60 * 60 * 1000));

  // Usa CRLF como recomienda RFC 5545
  const EOL = '\r\n';
  const body =
    'BEGIN:VCALENDAR' + EOL +
    'VERSION:2.0' + EOL +
    'PRODID:-//Flymingo Weddings//Guest Link//ES' + EOL +
    'BEGIN:VEVENT' + EOL +
    `UID:${slug}@flymingoweddings` + EOL +
    `DTSTAMP:${dtStart}` + EOL +
    `DTSTART:${dtStart}` + EOL +
    `DTEND:${dtEnd}` + EOL +
    `SUMMARY:${escapeText(title)}` + EOL +
    `DESCRIPTION:${escapeText(`Detalles y tarifas en flymingoweddings.com/boda/${slug}`)}` + EOL +
    'END:VEVENT' + EOL +
    'END:VCALENDAR';

  return 'data:text/calendar;charset=utf-8,' + encodeURIComponent(body);
}

/** Escapa comas, punto y coma y comillas para ICS */
function escapeText(text: string) {
  return text.replace(/([,;])/g, '\\$1').replace(/\n/g, '\\n');
}
