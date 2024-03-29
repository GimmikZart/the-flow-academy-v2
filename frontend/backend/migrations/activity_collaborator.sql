create table
  public.activity_collaborator (
    id bigint generated by default as identity,
    activity_id bigint not null,
    collaborator_id bigint not null,
    created_at timestamp with time zone not null default now(),
    constraint actvity_collaborator_pkey primary key (id),
    constraint activity_collaborator_activity_id_fkey foreign key (activity_id) references activities (id) on delete cascade,
    constraint activity_collaborator_collaborator_id_fkey foreign key (collaborator_id) references collaborators (id) on delete cascade
  ) tablespace pg_default;