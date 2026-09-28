-- Coordination workflow: ownership and follow-ups, payment, treatment options
-- shared with the patient, secure patient links, hospital case sends and an
-- admin audit log.

-- Ownership, follow-ups and manual payment tracking on each request.
ALTER TABLE treatment_requests ADD COLUMN assigned_to TEXT;
ALTER TABLE treatment_requests ADD COLUMN follow_up_on TEXT;       -- YYYY-MM-DD (IST)
ALTER TABLE treatment_requests ADD COLUMN paid_at TEXT;
ALTER TABLE treatment_requests ADD COLUMN payment_note TEXT;

CREATE INDEX idx_treatment_requests_follow_up ON treatment_requests (follow_up_on);
CREATE INDEX idx_treatment_requests_assigned ON treatment_requests (assigned_to);

-- request_events gains more kinds. The CHECK constraint is dropped (kinds are
-- only ever written by server code, typed in lib/admin/requests.ts) so adding
-- a kind no longer needs a table rebuild.
CREATE TABLE request_events_new (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  reference    TEXT NOT NULL REFERENCES treatment_requests (reference) ON DELETE CASCADE,
  kind         TEXT NOT NULL,
  body         TEXT,
  from_status  TEXT,
  to_status    TEXT,
  actor_email  TEXT NOT NULL,
  created_at   TEXT NOT NULL
);
INSERT INTO request_events_new (id, reference, kind, body, from_status, to_status, actor_email, created_at)
  SELECT id, reference, kind, body, from_status, to_status, actor_email, created_at FROM request_events;
DROP TABLE request_events;
ALTER TABLE request_events_new RENAME TO request_events;
CREATE INDEX idx_request_events_reference ON request_events (reference, created_at);

-- Treatment options prepared for the patient (one per hospital quote).
CREATE TABLE request_options (
  id             TEXT PRIMARY KEY,
  reference      TEXT NOT NULL REFERENCES treatment_requests (reference) ON DELETE CASCADE,
  position       INTEGER NOT NULL DEFAULT 0,
  hospital_slug  TEXT,                 -- data/hospitals.ts; NULL for an unlisted hospital
  hospital_name  TEXT NOT NULL,
  city           TEXT,
  doctor         TEXT,
  procedure_name TEXT,
  currency       TEXT NOT NULL DEFAULT 'USD',
  cost_min       INTEGER,
  cost_max       INTEGER,
  hospital_days  TEXT,
  total_days     TEXT,
  inclusions     TEXT,
  exclusions     TEXT,
  notes          TEXT,
  valid_until    TEXT,                 -- YYYY-MM-DD
  recommended    INTEGER NOT NULL DEFAULT 0,
  created_at     TEXT NOT NULL,
  updated_at     TEXT NOT NULL
);

CREATE INDEX idx_request_options_reference ON request_options (reference, position);

-- Private links that let a patient view their options, reply and add
-- reports. The token is an HMAC of `id` keyed by the SESSION_SECRET Worker
-- secret, so the database alone can't produce a working link; lookups use a
-- SHA-256 hash of the token.
CREATE TABLE patient_links (
  id             TEXT PRIMARY KEY,
  token_hash     TEXT NOT NULL UNIQUE,
  reference      TEXT NOT NULL REFERENCES treatment_requests (reference) ON DELETE CASCADE,
  created_at     TEXT NOT NULL,
  created_by     TEXT NOT NULL,
  expires_at     TEXT NOT NULL,
  revoked_at     TEXT,
  first_viewed_at TEXT,
  last_viewed_at TEXT,
  view_count     INTEGER NOT NULL DEFAULT 0,
  -- Patient's reply: an option id, 'call' (wants a call) or NULL.
  choice         TEXT,
  choice_message TEXT,
  choice_at      TEXT
);

CREATE INDEX idx_patient_links_reference ON patient_links (reference, created_at);

-- Anonymised case summaries sent to hospitals for quotes.
CREATE TABLE hospital_sends (
  id             INTEGER PRIMARY KEY AUTOINCREMENT,
  reference      TEXT NOT NULL REFERENCES treatment_requests (reference) ON DELETE CASCADE,
  hospital_slug  TEXT,
  hospital_name  TEXT NOT NULL,
  sent_at        TEXT NOT NULL,
  sent_by        TEXT NOT NULL,
  status         TEXT NOT NULL DEFAULT 'awaiting', -- awaiting | quoted | declined
  responded_at   TEXT,
  note           TEXT
);

CREATE INDEX idx_hospital_sends_reference ON hospital_sends (reference, sent_at);

-- Admin actions not tied to one request's timeline (exports, deletions,
-- retention purges). Holds no patient details.
CREATE TABLE admin_audit (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  action       TEXT NOT NULL,
  detail       TEXT,
  actor_email  TEXT NOT NULL,
  created_at   TEXT NOT NULL
);

CREATE INDEX idx_admin_audit_created ON admin_audit (created_at);
