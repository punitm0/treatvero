-- The listed hospital and/or doctor a patient asked about when they opened
-- the enquiry form from a hospital or doctor page (slugs from
-- data/hospitals.ts and data/doctors.ts). NULL when none was chosen.
ALTER TABLE treatment_requests ADD COLUMN preferred_hospital TEXT;
ALTER TABLE treatment_requests ADD COLUMN preferred_doctor TEXT;
