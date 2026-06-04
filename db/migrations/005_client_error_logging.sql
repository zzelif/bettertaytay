-- Migration: 005_client_error_logging.sql
-- Create client_errors table to store front-end JavaScript render exceptions

CREATE TABLE IF NOT EXISTS client_errors (
  id TEXT PRIMARY KEY,
  error_message TEXT NOT NULL,
  error_stack TEXT,
  component_stack TEXT,
  url TEXT NOT NULL,
  user_agent TEXT,
  timestamp TEXT DEFAULT (datetime('now'))
);

-- Index for common lookups
CREATE INDEX IF NOT EXISTS idx_client_errors_timestamp ON client_errors(timestamp DESC);
