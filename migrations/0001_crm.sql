CREATE TABLE leads (
 id TEXT PRIMARY KEY, name TEXT NOT NULL, email TEXT NOT NULL, phone TEXT NOT NULL,
 service TEXT NOT NULL, timing TEXT NOT NULL DEFAULT '', goal TEXT NOT NULL DEFAULT '', notes TEXT NOT NULL DEFAULT '',
 status TEXT NOT NULL DEFAULT 'Novo lead', source TEXT NOT NULL, utms TEXT NOT NULL, cta TEXT NOT NULL,
 marketing_consent INTEGER NOT NULL DEFAULT 0, analytics_consent INTEGER NOT NULL DEFAULT 0,
 privacy_version TEXT NOT NULL, created_at TEXT NOT NULL, updated_at TEXT NOT NULL
);
CREATE TABLE audit (id TEXT PRIMARY KEY, lead_id TEXT, actor TEXT NOT NULL, action TEXT NOT NULL, detail TEXT NOT NULL, created_at TEXT NOT NULL);
CREATE TABLE events (id TEXT PRIMARY KEY, lead_id TEXT, name TEXT NOT NULL, source TEXT NOT NULL, created_at TEXT NOT NULL);
CREATE TABLE sessions (id TEXT PRIMARY KEY, expires_at INTEGER NOT NULL);
CREATE TABLE rate_limits (key TEXT PRIMARY KEY, hits INTEGER NOT NULL, expires_at INTEGER NOT NULL);
CREATE INDEX leads_created ON leads(created_at);
CREATE INDEX audit_lead ON audit(lead_id);
CREATE INDEX sessions_expiry ON sessions(expires_at);
CREATE INDEX rate_expiry ON rate_limits(expires_at);
