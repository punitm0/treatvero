-- Patient agreements: Terms of Service accepted at enquiry, and service
-- agreements coordinators send for e-signature through the patient link.

-- Terms acceptance (clickwrap) on each request. NULL for requests received
-- before the Terms checkbox existed.
ALTER TABLE treatment_requests ADD COLUMN terms_version TEXT;
ALTER TABLE treatment_requests ADD COLUMN terms_text TEXT;
ALTER TABLE treatment_requests ADD COLUMN terms_accepted_at TEXT;

-- Service agreements. `content` is a JSON snapshot of the exact text sent
-- (data/legal.ts), so later template changes never alter a signed agreement.
-- Sending a new agreement withdraws the request's unsigned ones.
CREATE TABLE service_agreements (
  id                  TEXT PRIMARY KEY,
  reference           TEXT NOT NULL REFERENCES treatment_requests (reference) ON DELETE CASCADE,
  version             TEXT NOT NULL,
  plan                TEXT NOT NULL,
  content             TEXT NOT NULL,
  created_at          TEXT NOT NULL,
  created_by          TEXT NOT NULL,
  withdrawn_at        TEXT,
  withdrawn_by        TEXT,
  -- signature
  signed_at           TEXT,
  signer_name         TEXT,
  signer_relationship TEXT,             -- NULL when the patient signed
  signed_link_id      TEXT              -- patient_links.id the signature came through
);

CREATE INDEX idx_service_agreements_reference ON service_agreements (reference, created_at);
