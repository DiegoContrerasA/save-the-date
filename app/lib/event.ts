// Datos del evento (una sola fuente para todas las secciones)
export const EVENT = {
  couple: "Diego Contreras & Andrea Cardona",
  dateLabel: "Viernes, 8 de enero de 2027",
  city: "Medellín, Colombia",
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
} as const;
