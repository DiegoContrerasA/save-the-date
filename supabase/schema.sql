-- Invitación de boda · tabla `guests` (una fila por persona)
-- Ejecutar en Supabase → SQL Editor, en este orden: schema.sql, seed.sql, rpc.sql.

create table if not exists public.guests (
  id            uuid primary key default gen_random_uuid(),
  slug          text not null unique
                  check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),   -- /<slug> individual
  name          text not null check (char_length(name) between 1 and 120),
  phone         text,                                          -- las parejas comparten el mismo número
  confirmed     boolean,                                       -- null = sin responder
  vegetarian    boolean not null default false,
  restrictions  text check (char_length(restrictions) <= 500), -- alergias / restricciones
  has_role      boolean not null default false,                -- rol especial en la boda (mensaje extra)
  language      text not null default 'es'
                  check (language in ('en', 'es'))             -- idioma de la invitación
);

-- Seguridad: RLS activado SIN policies => la publishable key no puede leer ni
-- escribir la tabla. La app solo accede por las funciones de rpc.sql.
alter table public.guests enable row level security;

-- Consultas útiles (SQL Editor):
-- select count(*) filter (where confirmed) as van,
--        count(*) filter (where confirmed is false) as no_van,
--        count(*) filter (where confirmed is null) as sin_responder,
--        count(*) filter (where confirmed and vegetarian) as vegetarianos
-- from public.guests;
-- select name, restrictions from public.guests where confirmed and restrictions is not null;
