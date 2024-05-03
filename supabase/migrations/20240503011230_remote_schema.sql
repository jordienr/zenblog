set check_function_bodies = off;

CREATE OR REPLACE FUNCTION storage.extension(name text)
 RETURNS text
 LANGUAGE plpgsql
AS $function$
DECLARE
_parts text[];
_filename text;
BEGIN
    select string_to_array(name, '/') into _parts;
    select _parts[array_length(_parts,1)] into _filename;
    -- @todo return the last part instead of 2
    return split_part(_filename, '.', 2);
END
$function$
;

CREATE OR REPLACE FUNCTION storage.filename(name text)
 RETURNS text
 LANGUAGE plpgsql
AS $function$
DECLARE
_parts text[];
BEGIN
    select string_to_array(name, '/') into _parts;
    return _parts[array_length(_parts,1)];
END
$function$
;

CREATE OR REPLACE FUNCTION storage.foldername(name text)
 RETURNS text[]
 LANGUAGE plpgsql
AS $function$
DECLARE
_parts text[];
BEGIN
    select string_to_array(name, '/') into _parts;
    return _parts[1:array_length(_parts,1)-1];
END
$function$
;

create policy "ALLOW ALL IN public 1ffg0oo_0"
on "storage"."objects"
as permissive
for select
to public
using (true);


create policy "ALLOW ALL IN public 1ffg0oo_1"
on "storage"."objects"
as permissive
for insert
to public
with check (true);


create policy "Allow owners to delete"
on "storage"."objects"
as permissive
for delete
to authenticated
using ((EXISTS ( SELECT blogs.id
   FROM blogs
  WHERE ((blogs.user_id = ( SELECT auth.uid() AS uid)) AND (split_part(objects.name, '/'::text, 1) = (blogs.id)::text)))));


create policy "Allow owners to insert"
on "storage"."objects"
as permissive
for insert
to authenticated
with check ((EXISTS ( SELECT blogs.id
   FROM blogs
  WHERE ((blogs.user_id = ( SELECT auth.uid() AS uid)) AND (split_part(objects.name, '/'::text, 1) = (blogs.id)::text)))));



