// Gera o site estático em site/ a partir de src/.
// As páginas institucionais continuam sendo HTML; o Nunjucks só entra para
// incluir as partes comuns (cabeçalho, rodapé e aviso de cookies). As notícias
// são arquivos Markdown em src/noticias/publicacoes/, com listagem gerada aqui.
import { idArea, normalizar } from './src/_lib/texto.js';

const MESES = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho',
  'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
const CATEGORIAS = ['Notícias', 'Eventos', 'Programas'];
const POR_PAGINA = 12;
// Notícias até este ano ficam no arquivo do site, fora da listagem principal
const ARQUIVO_ATE = 2018;

function slug(texto) {
  return texto.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-');
}

function emPaginas(itens) {
  const paginas = [];
  for (let i = 0; i < itens.length; i += POR_PAGINA) paginas.push(itens.slice(i, i + POR_PAGINA));
  return paginas.length ? paginas : [[]];
}

export default function (eleventyConfig) {
  for (const pasta of ['assets', 'storage', 'wp-content']) {
    eleventyConfig.addPassthroughCopy(`src/${pasta}`);
  }
  // Painel de conteúdo (Decap CMS): copiado como está, sem passar pelo Nunjucks
  eleventyConfig.addPassthroughCopy('src/admin');
  eleventyConfig.ignores.add('src/admin/**');

  // Prefixo relativo até a raiz do site ("./" na home, "../" nas páginas de
  // primeiro nível). Relativo para o site funcionar em qualquer subcaminho.
  eleventyConfig.addFilter('raiz', (url) => {
    const nivel = (url || '/').replace(/[^/]*\.html$/, '').split('/').filter(Boolean).length;
    return nivel ? '../'.repeat(nivel) : './';
  });

  // Remove o espaço entre tags das partes comuns: os modelos ficam legíveis e o
  // HTML gerado fica igual ao que layout.js inseria, sem espaços entre itens inline.
  eleventyConfig.addFilter('compacto', (html) => html.replace(/>\s+</g, '><').trim());

  // Datas das notícias (o front matter "date" é lido em UTC)
  const dois = (n) => String(n).padStart(2, '0');
  eleventyConfig.addFilter('dataIso', (d) => d.toISOString().slice(0, 10));
  eleventyConfig.addFilter('dataBr', (d) => `${dois(d.getUTCDate())}/${dois(d.getUTCMonth() + 1)}/${d.getUTCFullYear()}`);
  eleventyConfig.addFilter('dataExtenso', (d) => `${d.getUTCDate()} de ${MESES[d.getUTCMonth()]} de ${d.getUTCFullYear()}`);
  eleventyConfig.addFilter('slug', slug);
  // Endereço interno ("/slug/") como link relativo a partir da página atual
  eleventyConfig.addFilter('link', (url, raiz) => raiz + url.replace(/^\//, ''));
  // Imagens sob demanda: as galerias reconstruídas trazem centenas de fotos em
  // tamanho original. Fora as duas primeiras do conteúdo (que aparecem logo),
  // toda imagem sem "loading" só carrega quando chega perto da tela.
  eleventyConfig.addTransform('imagensSobDemanda', function (html) {
    if (!(this.page.outputPath || '').endsWith('.html')) return html;
    const inicio = html.indexOf('<main');
    if (inicio === -1) return html;
    let vistas = 0;
    return html.slice(0, inicio) + html.slice(inicio).replace(/<img\b(?![^>]*\bloading=)([^>]*)>/g,
      (tag, atributos) => (++vistas <= 2 ? tag : `<img loading="lazy" decoding="async"${atributos}>`));
  });

  // Notícias cujo título contém o termo (sem acento), da mais recente para a mais antiga
  eleventyConfig.addFilter('noticiasSobre', (lista, termo) =>
    lista.slice().reverse().filter((n) => normalizar(n.data.titulo).includes(normalizar(termo))));
  // As seis notícias mais recentes, sem a da própria página
  eleventyConfig.addFilter('outrasNoticias', (lista, url) =>
    lista.slice().reverse().filter((n) => n.url !== url).slice(0, 6));

  // Notícias da mais recente para a mais antiga
  const noticias = (api) => api.getFilteredByTag('noticia').slice().reverse();
  const recentes = (api) => noticias(api).filter((n) => n.date.getUTCFullYear() > ARQUIVO_ATE);

  // Páginas da listagem: as notícias recentes, todas e por categoria, 12 por página
  eleventyConfig.addCollection('paginasNoticias', (api) => {
    const todas = recentes(api);
    const grupos = [{ categoria: null, base: '/noticias/', itens: todas }].concat(
      CATEGORIAS.map((c) => ({
        categoria: c,
        base: `/noticias/categoria/${slug(c)}/`,
        itens: todas.filter((n) => n.data.categoria === c)
      }))
    );
    return grupos.flatMap((g) => {
      const paginas = emPaginas(g.itens);
      const url = (n) => (n === 1 ? g.base : `${g.base}pagina/${n}/`);
      return paginas.map((itens, i) => ({
        categoria: g.categoria,
        numero: i + 1,
        total: paginas.length,
        quantidade: g.itens.length,
        itens,
        url: url(i + 1),
        anterior: i > 0 ? url(i) : null,
        proxima: i + 1 < paginas.length ? url(i + 2) : null
      }));
    });
  });

  // Uma página por ano, com todas as notícias daquele ano
  eleventyConfig.addCollection('anosNoticias', (api) => {
    const porAno = new Map();
    for (const n of noticias(api)) {
      const ano = n.date.getUTCFullYear();
      if (!porAno.has(ano)) porAno.set(ano, []);
      porAno.get(ano).push(n);
    }
    return [...porAno].map(([ano, itens]) => ({
      ano, itens, url: `/noticias/${ano}/`, arquivo: ano <= ARQUIVO_ATE
    }));
  });

  // Endereço da lista de documentos da Transparência já filtrada (usado nos
  // redirecionamentos das páginas antigas): "transparencia/documentos/?tema=…#tema-…"
  eleventyConfig.addFilter('documentosFiltrados', (filtros) => {
    const consulta = new URLSearchParams();
    consulta.set('tema', filtros.tema);
    if (filtros.ano) consulta.set('ano', filtros.ano);
    if (filtros.area) consulta.set('area', idArea(filtros.area));
    if (filtros.q) consulta.set('q', filtros.q);
    return `transparencia/documentos/?${consulta}#tema-${filtros.tema}`;
  });

  eleventyConfig.addGlobalData('arquivoAte', ARQUIVO_ATE);

  // Prefixo do site no servidor ("/" na raiz; "/repositorio/" no GitHub Pages).
  // Só a página 404 precisa dele, porque é servida em qualquer endereço.
  eleventyConfig.addGlobalData('caminhoBase', process.env.CAMINHO_BASE || '/');

  // Faixa "protótipo acadêmico" no topo de todas as páginas. Para tirar, gere o
  // site com AVISO_PROTOTIPO=nao.
  eleventyConfig.addGlobalData('avisoPrototipo', process.env.AVISO_PROTOTIPO !== 'nao');

  eleventyConfig.addGlobalData('categoriasNoticias', CATEGORIAS.map((c) => ({ nome: c, url: `noticias/categoria/${slug(c)}/` })));

  return {
    dir: { input: 'src', output: 'site', includes: '_includes', data: '_data' },
    templateFormats: ['html', 'njk', 'md', '11ty.js'],
    htmlTemplateEngine: 'njk',
    // O texto das notícias é conteúdo, não modelo: nada de Nunjucks dentro dele
    markdownTemplateEngine: false
  };
}
