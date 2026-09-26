-- Treatment requests submitted through /get-treatment-options.
-- Contains personal and health data: restrict dashboard/API access to the
-- coordination team and never export to analytics.
CREATE TABLE treatment_requests (
  reference        TEXT PRIMARY KEY,
  created_at       TEXT NOT NULL,
  status           TEXT NOT NULL DEFAULT 'new',
  plan             TEXT NOT NULL CHECK (plan IN ('basic', 'concierge')),
  -- patient
  country          TEXT NOT NULL,
  age              INTEGER NOT NULL,
  treatment        TEXT NOT NULL,
  description      TEXT NOT NULL,
  -- preferences
  destination      TEXT NOT NULL,
  city             TEXT,
  timing           TEXT,
  budget           TEXT,
  -- contact
  full_name        TEXT NOT NULL,
  email            TEXT NOT NULL,
  whatsapp         TEXT NOT NULL,
  -- consent
  consent_text     TEXT NOT NULL,
  consent_at       TEXT NOT NULL
);

CREATE INDEX idx_treatment_requests_created_at ON treatment_requests (created_at);

-- Reports attached to a request (objects live in the private R2 bucket).
CREATE TABLE request_reports (
  report_id   TEXT PRIMARY KEY,
  reference   TEXT NOT NULL REFERENCES treatment_requests (reference) ON DELETE CASCADE,
  file_name   TEXT NOT NULL,
  mime_type   TEXT NOT NULL,
  size_bytes  INTEGER NOT NULL
);

CREATE INDEX idx_request_reports_reference ON request_reports (reference);
