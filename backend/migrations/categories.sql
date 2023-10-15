create table
  public.categories (
    id bigint generated by default as identity,
    name character varying null,
    created_at timestamp with time zone not null default now(),
    constraint categories_pkey primary key (id)
  ) tablespace pg_default;