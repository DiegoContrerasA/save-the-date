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
} as const;
