-- Invitación de boda · tabla `guests` (una fila por persona)
-- Ejecutar en Supabase → SQL Editor.

create table if not exists public.guests (
  id            uuid primary key default gen_random_uuid(),
  slug          text not null unique
                  check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),   -- /<slug> individual
  name          text not null check (char_length(name) between 1 and 120),
  phone         text,                                          -- las parejas comparten el mismo número
  confirmed     boolean,                                       -- null = sin responder
  vegetarian    boolean not null default false,
  restrictions  text check (char_length(restrictions) <= 500), -- alergias / restricciones
  has_role      boolean not null default false                 -- rol especial en la boda (mensaje extra)
);

-- Seguridad: RLS activado SIN policies => solo la service role key (servidor)
-- puede leer/escribir. El navegador con la anon/publishable key no ve nada.
alter table public.guests enable row level security;

-- Consultas útiles (SQL Editor):
-- select count(*) filter (where confirmed) as van,
--        count(*) filter (where confirmed is false) as no_van,
--        count(*) filter (where confirmed is null) as sin_responder,
--        count(*) filter (where confirmed and vegetarian) as vegetarianos
-- from public.guests;
-- select name, restrictions from public.guests where confirmed and restrictions is not null;
