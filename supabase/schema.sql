-- Invitación de boda · tabla `guests` (una fila por persona)
-- Ejecutar en Supabase → SQL Editor.

create table if not exists public.guests (
  id            uuid primary key default gen_random_uuid(),
  slug          text not null unique
                  check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),   -- /<slug> individual
  name          text not null check (char_length(name) between 1 and 120),
  group_name    text,                                          -- familia/pareja (solo para ustedes)
  confirmed     boolean,                                       -- null = sin responder
  vegetarian    boolean not null default false,
  restrictions  text check (char_length(restrictions) <= 500), -- alergias / restricciones
  has_role      boolean not null default false,                -- rol especial en la boda (mensaje extra)
  table_number  int,
  responded_at  timestamptz,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- updated_at automático
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists guests_set_updated_at on public.guests;
create trigger guests_set_updated_at
  before update on public.guests
  for each row execute function public.set_updated_at();

-- Seguridad: RLS activado SIN policies => solo la service role key (servidor)
-- puede leer/escribir. El navegador con la anon/publishable key no ve nada.
alter table public.guests enable row level security;

-- Consultas útiles para ustedes (SQL Editor):
-- select count(*) filter (where confirmed) as van,
--        count(*) filter (where confirmed is false) as no_van,
--        count(*) filter (where responded_at is null) as sin_responder,
--        count(*) filter (where confirmed and vegetarian) as vegetarianos
-- from public.guests;
-- select name, restrictions from public.guests where confirmed and restrictions is not null;
