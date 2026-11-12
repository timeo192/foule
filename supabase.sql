create table products(slug text primary key,name text not null,description text,price_cents int not null,file_path text,active bool default true,position int default 0);
create table profiles(id uuid primary key references auth.users on delete cascade,email text,is_admin bool default false,created_at timestamptz default now());
create table orders(id uuid primary key default gen_random_uuid(),user_id uuid references auth.users,email text,status text default 'pending',total_cents int,stripe_session_id text,created_at timestamptz default now());
create table order_items(id bigserial primary key,order_id uuid references orders on delete cascade,slug text,name text,price_cents int);
alter table products enable row level security; alter table profiles enable row level security; alter table orders enable row level security; alter table order_items enable row level security;
create policy "produits publics" on products for select using (active);
create policy "mon profil" on profiles for select using (auth.uid()=id);
create policy "mes commandes" on orders for select using (auth.uid()=user_id);
create policy "mes lignes" on order_items for select using (exists(select 1 from orders o where o.id=order_id and o.user_id=auth.uid()));
create function handle_new_user() returns trigger language plpgsql security definer as $$ begin insert into profiles(id,email) values(new.id,new.email); return new; end $$;
create trigger on_signup after insert on auth.users for each row execute function handle_new_user();
insert into products values
('journal','Le journal du coureur','Un carnet numérique pour noter ses kilomètres, ses chronos, ses sensations et ses objectifs personnels.',990,'journal.pdf',true,1),
('guide','Le guide du coureur','Un guide pratique sur l’équipement, l’organisation d’une course et la préparation matérielle.',1490,'guide.pdf',true,2),
('tableau','Le tableau de progression','Un fichier pour enregistrer ses sorties et visualiser ses statistiques.',790,'tableau.xlsx',true,3);
-- Storage : créez un bucket PRIVÉ nommé "produits" et déposez-y les 3 fichiers.
-- Admin : update profiles set is_admin=true where email='vous@exemple.fr';
