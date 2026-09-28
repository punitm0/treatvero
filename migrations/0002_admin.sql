-- Admin activity for treatment requests: internal notes, status changes and
-- report downloads, each attributed to the Cloudflare Access user.
CREATE TABLE request_events (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  reference    TEXT NOT NULL REFERENCES treatment_requests (reference) ON DELETE CASCADE,
  kind         TEXT NOT NULL CHECK (kind IN ('note', 'status', 'download')),
  body         TEXT,
  from_status  TEXT,
  to_status    TEXT,
  actor_email  TEXT NOT NULL,
  created_at   TEXT NOT NULL
);

CREATE INDEX idx_request_events_reference ON request_events (reference, created_at);
CREATE INDEX idx_treatment_requests_status ON treatment_requests (status, created_at);
