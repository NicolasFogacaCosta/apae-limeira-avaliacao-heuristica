// Funções de texto usadas pelos dados (src/_data/) e pela configuração do Eleventy

// Sem acentos e em minúsculas, para comparar e filtrar
export function normalizar(texto) {
  return texto.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
}

// Identificador de uma área nos filtros: "Assistência social" → "assistencia-social"
export function idArea(area) {
  return area ? normalizar(area).replace(/\s+/g, '-') : '';
}
