// Datos del evento (una sola fuente para todas las secciones)
export const EVENT = {
  couple: "Diego Contreras & Andrea Cardona",
  venue: {
    name: "Chuscalito",
    // Enlace https de google.com/maps (sin redirecciones): en celular lo
    // intercepta la app de Google Maps si está instalada (Android App Links /
    // iOS Universal Links); si no, abre la versión web.
    mapsUrl: "https://www.google.com/maps?cid=1210118006201930761",
    // Waze: el enlace universal abre la app si está instalada, si no la web.
    // Busca por nombre; con coordenadas exactas (ll=lat,lng) sería más preciso.
    wazeUrl:
      "https://waze.com/ul?q=Chuscalito%20Medell%C3%ADn%20Colombia&navigate=yes",
  },
  // Hora de llegada (recepción)
  arrival: "4:00 pm",
  // Minuto a minuto
  schedule: [
    { id: "reception", time: "4:00 pm" },
    { id: "ceremony", time: "4:15 pm" },
    { id: "cocktail", time: "5:30 pm" },
    { id: "dinner", time: "7:30 pm" },
    { id: "party", time: "9:00 pm" },
  ],
  // Fin de la confirmación: último segundo del 15 de octubre, hora de Bogotá.
  // Un invitado puede tener su propia fecha en guests.rsvp_deadline.
  rsvpDeadline: "2026-10-15T23:59:59-05:00",
  // WhatsApp para quien quiera confirmar después de la fecha (wa.me, sin +)
  whatsapp: "573122861377",
} as const;

/**
 * Pasada la fecha límite solo pueden cambiar su respuesta quienes ya
 * confirmaron; el resto (no van o sin responder) escribe por WhatsApp.
 */
export function isRsvpClosed(guest: {
  confirmed: boolean | null;
  rsvpDeadline: string | null;
}): boolean {
  return guest.confirmed !== true && Date.now() > Date.parse(rsvpDeadlineOf(guest));
}

export function rsvpDeadlineOf(guest: { rsvpDeadline: string | null }): string {
  return guest.rsvpDeadline ?? EVENT.rsvpDeadline;
}

/** "15 de octubre" / "October 15", en hora de Bogotá */
export function formatDeadline(iso: string, lang: "en" | "es"): string {
  return new Intl.DateTimeFormat(lang === "es" ? "es-CO" : "en-US", {
    day: "numeric",
    month: "long",
    timeZone: "America/Bogota",
  }).format(new Date(iso));
}
