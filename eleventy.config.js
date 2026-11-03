// Gera o site estático em site/ a partir de src/.
// As páginas continuam sendo HTML; o Nunjucks só entra para incluir as partes
// comuns (cabeçalho, rodapé e aviso de cookies), que antes vinham de layout.js.
export default function (eleventyConfig) {
  for (const pasta of ['assets', 'storage', 'wp-content']) {
    eleventyConfig.addPassthroughCopy(`src/${pasta}`);
  }

  // Prefixo relativo até a raiz do site ("./" na home, "../" nas páginas de
  // primeiro nível). Relativo para o site funcionar em qualquer subcaminho.
  eleventyConfig.addFilter('raiz', (url) => {
    const nivel = (url || '/').split('/').filter(Boolean).length;
    return nivel ? '../'.repeat(nivel) : './';
  });

  // Remove o espaço entre tags das partes comuns: os modelos ficam legíveis e o
  // HTML gerado fica igual ao que layout.js inseria, sem espaços entre itens inline.
  eleventyConfig.addFilter('compacto', (html) => html.replace(/>\s+</g, '><').trim());

  return {
    dir: { input: 'src', output: 'site', includes: '_includes', data: '_data' },
    templateFormats: ['html'],
    htmlTemplateEngine: 'njk'
  };
}
