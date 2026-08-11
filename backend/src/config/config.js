require("dotenv").config();

module.exports = {
  port: process.env.PORT || 5000,
  frontendUrl:
    process.env.FRONTEND_URL ||
    "https://arxzen.vercel.app",

  supabaseUrl:
    process.env.SUPABASE_URL,

  supabaseAnonKey:
    process.env.SUPABASE_ANON_KEY,

  supabaseServiceRoleKey:
    process.env.SUPABASE_SERVICE_ROLE_KEY,
};
