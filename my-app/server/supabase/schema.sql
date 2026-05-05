create extension if not exists pgcrypto;

create table if not exists public.stands (
  id bigint generated always as identity primary key,
  slug text not null unique,
  title text not null,
  mall_name text not null,
  address text not null,
  city text not null,
  description text not null,
  lat double precision not null,
  lng double precision not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.stand_images (
  id bigint generated always as identity primary key,
  stand_id bigint not null references public.stands(id) on delete cascade,
  image_url text not null,
  sort_order integer not null default 0
);

create table if not exists public.requests (
  id bigint generated always as identity primary key,
  stand_id bigint references public.stands(id) on delete set null,
  client_name text not null,
  phone text not null,
  email text not null,
  message text,
  is_viewed boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.faqs (
  id bigint generated always as identity primary key,
  question text not null,
  answer text not null,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.admins (
  id bigint generated always as identity primary key,
  login text not null unique,
  email text not null unique,
  password_hash text not null,
  reset_token_hash text,
  reset_token_expires_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists idx_stands_slug on public.stands (slug);
create index if not exists idx_stands_mall_name on public.stands (mall_name);
create index if not exists idx_stands_is_active on public.stands (is_active);
create index if not exists idx_stand_images_stand_id on public.stand_images (stand_id);
create index if not exists idx_requests_stand_id on public.requests (stand_id);
create index if not exists idx_requests_is_viewed on public.requests (is_viewed);
create index if not exists idx_faqs_sort_order on public.faqs (sort_order);
