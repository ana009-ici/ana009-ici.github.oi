import { supabase } from "./supabase";
const base = import.meta.env.VITE_API_URL || "http://localhost:3333/api";
export async function api(caminho, { method = "GET", body } = {}) {
  const { data } = await supabase.auth.getSession();
  const res = await fetch(base + caminho, {
    method, headers: { "Content-Type": "application/json", Authorization: `Bearer ${data.session?.access_token}` },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (res.status === 204) return null;
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.details?.[0]?.message || json.message || "Erro na requisição.");
  return json;
}
// Envia arquivos para o Storage privado (pasta = id do usuário) e devolve os metadados
export async function enviarArquivos(files) {
  const { data } = await supabase.auth.getUser();
  const saida = [];
  for (const file of files) {
    if (file.size > 20 * 1024 * 1024) throw new Error(`${file.name} excede 20 MB.`);
    const path = `${data.user.id}/${crypto.randomUUID()}-${file.name}`;
    const { error } = await supabase.storage.from("evidencias").upload(path, file);
    if (error) throw new Error(error.message);
    saida.push({ titulo: file.name, arquivo_path: path, tipo_arquivo: file.type });
  }
  return saida;
}
// Leitura pública (sem token)
export async function apiPublica(caminho) {
  const res = await fetch(base + caminho);
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.message || "Erro na requisição.");
  return json;
}
