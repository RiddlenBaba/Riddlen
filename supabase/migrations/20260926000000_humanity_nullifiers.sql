-- One World ID nullifier per riddle session: the attester refuses to issue a second entry pass
-- for the same human. The game contract enforces the same rule on-chain (humanEntered); this is
-- the off-chain half, so passes are never issued in the first place.

create table if not exists public.humanity_nullifiers (
    action      text          not null,  -- riddlen:<chainId>:<gameContract>:<sessionId>
    nullifier   numeric(78,0) not null,  -- World ID nullifier (field element, stored as decimal)
    player      text          not null,  -- lowercase wallet the entry pass was issued to
    session_id  numeric(78,0) not null,
    created_at  timestamptz   not null default now(),
    primary key (action, nullifier)
);

-- Only the server (service role) reads or writes; no client access.
alter table public.humanity_nullifiers enable row level security;
