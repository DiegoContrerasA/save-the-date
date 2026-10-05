-- Funciones para que la app (con la publishable key) lea y guarde RSVPs SIN
-- abrir la tabla `guests`: RLS sigue activo sin policies, así que nadie puede
-- listar invitados ni ver teléfonos. Solo se puede buscar UN invitado por su
-- slug exacto y guardar su propia respuesta.
-- Ejecutar en Supabase → SQL Editor (después de schema.sql).

create or replace function public.get_guest(p_slug text)
returns table (
  slug         text,
  name         text,
  confirmed    boolean,
  vegetarian   boolean,
  restrictions text,
  has_role     boolean
)
language sql
stable
security definer
set search_path = ''
as $$
  select g.slug, g.name, g.confirmed, g.vegetarian, g.restrictions, g.has_role
  from public.guests g
  where g.slug = p_slug;
$$;

create or replace function public.save_rsvp(
  p_slug         text,
  p_confirmed    boolean,
  p_vegetarian   boolean,
  p_restrictions text
)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  n int;
begin
  update public.guests g
  set confirmed    = p_confirmed,
      vegetarian   = p_confirmed and coalesce(p_vegetarian, false),
      restrictions = case
        when p_confirmed then nullif(left(btrim(coalesce(p_restrictions, '')), 500), '')
        else null
      end
  where g.slug = p_slug;
  get diagnostics n = row_count;
  return n > 0;
end;
$$;

revoke all on function public.get_guest(text) from public;
revoke all on function public.save_rsvp(text, boolean, boolean, text) from public;
grant execute on function public.get_guest(text) to anon, authenticated;
grant execute on function public.save_rsvp(text, boolean, boolean, text) to anon, authenticated;
