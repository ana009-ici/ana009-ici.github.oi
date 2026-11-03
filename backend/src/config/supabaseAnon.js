require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");
// Cliente com a chave pública (anon), usado só para validar e-mail e senha no login
module.exports = () => createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY, { auth: { persistSession: false } });
