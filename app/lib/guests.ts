export type Guest = {
  slug: string;
  name: string;
  confirmed: boolean | null;
  vegetarian: boolean;
  restrictions: string | null;
  roleMessage: string | null;
};

// TEMPORAL: datos de ejemplo mientras no existe la tabla `guests` en Supabase.
// Se reemplaza por la consulta real en el paso de base de datos.
const MOCK: Record<string, Guest> = {
  demo: {
    slug: "demo",
    name: "Angela Uribe",
    confirmed: null,
    vegetarian: false,
    restrictions: null,
    roleMessage: null,
  },
  "demo-rol": {
    slug: "demo-rol",
    name: "Alberto Cardona",
    confirmed: null,
    vegetarian: false,
    restrictions: null,
    roleMessage: "Tenemos una misión muy especial para ti",
  },
};

export async function getGuestBySlug(slug: string): Promise<Guest | null> {
  return MOCK[decodeURIComponent(slug)] ?? null;
}
