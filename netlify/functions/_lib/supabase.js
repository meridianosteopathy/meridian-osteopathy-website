// Supabase service-role client for server-side writes.
// Uses the SERVICE_ROLE key — bypasses RLS. NEVER expose this to the browser.

const { createClient } = require("@supabase/supabase-js");

let cached = null;

function getSupabase() {
  if (cached) return cached;
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set");
  }
  cached = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    db: { schema: "website" },
  });
  return cached;
}

// Separate client for storage (uses default public schema for bucket ops).
let storageClient = null;
function getStorageClient() {
  if (storageClient) return storageClient;
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set");
  }
  storageClient = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return storageClient;
}

module.exports = { getSupabase, getStorageClient };
