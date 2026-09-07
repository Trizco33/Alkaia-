import { supabase } from "./supabase";

/**
 * Redimensiona uma imagem no navegador (máx. 1920px no maior lado) e converte
 * para WebP (~0.85 de qualidade). Fotos de celular facilmente passam dos 8MB
 * permitidos no bucket — depois do resize ficam bem abaixo disso.
 */
async function resizeImage(file: File): Promise<Blob> {
  const MAX = 1920;
  const bitmap = await createImageBitmap(file).catch(() => null);
  if (!bitmap) return file; // formato não suportado pelo canvas — envia como está

  let { width, height } = bitmap;
  if (width > MAX || height > MAX) {
    const scale = MAX / Math.max(width, height);
    width = Math.round(width * scale);
    height = Math.round(height * scale);
  }

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return file;
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/webp", 0.85)
  );
  return blob ?? file;
}

/**
 * Envia uma imagem para o bucket público `site-images` e devolve a URL pública.
 * Lança Error com mensagem em português em caso de falha.
 */
export async function uploadImage(file: File): Promise<string> {
  if (!supabase) throw new Error("Conexão com o servidor indisponível.");
  if (!file.type.startsWith("image/")) throw new Error("Envie um arquivo de imagem (foto).");

  const blob = await resizeImage(file);
  const isWebp = blob !== file;
  const ext = isWebp ? "webp" : (file.name.split(".").pop() || "jpg").toLowerCase();
  const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  const { error } = await supabase.storage.from("site-images").upload(path, blob, {
    contentType: isWebp ? "image/webp" : file.type,
    cacheControl: "31536000",
    upsert: false,
  });
  if (error) throw new Error(`Falha ao enviar a foto: ${error.message}`);

  const { data } = supabase.storage.from("site-images").getPublicUrl(path);
  return data.publicUrl;
}
