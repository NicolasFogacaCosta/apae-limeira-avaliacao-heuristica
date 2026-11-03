// Funções de texto usadas pelos dados (src/_data/) e pela configuração do Eleventy

// Sem acentos e em minúsculas, para comparar e filtrar
export function normalizar(texto) {
  return texto.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
}

// Identificador de uma área nos filtros: "Assistência social" → "assistencia-social"
export function idArea(area) {
  return area ? normalizar(area).replace(/\s+/g, '-') : '';
}

// Texto corrido de um trecho de HTML, para o índice de busca
export function textoPuro(html) {
  return html
    .replace(/<(script|style)[^>]*>[\s\S]*?<\/\1>/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&nbsp;/g, ' ').replace(/&quot;/g, '"').replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();
}
