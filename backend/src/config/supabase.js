const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

const supabase = createClient(
  supabaseUrl,
  supabaseServiceRoleKey
);

const supabaseAuth = createClient(
  supabaseUrl,
  supabaseAnonKey
);

module.exports = supabase;
module.exports.authClient = supabaseAuth;
