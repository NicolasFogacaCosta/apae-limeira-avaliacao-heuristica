// Cada arquivo desta pasta é uma notícia, publicada no mesmo endereço do site
// original: src/noticias/publicacoes/<slug>.md → /<slug>/
export default {
  layout: 'layouts/noticia.njk',
  tags: 'noticia',
  permalink: (data) => `/${data.page.fileSlug}/`,
  eleventyComputed: {
    tituloPagina: (data) => data.titulo
  }
};
