// Índice da busca do site (window.APAE_INDICE), gerado a cada build:
// - páginas institucionais: src/_data/busca/paginas.json (da reconstrução);
// - notícias: os arquivos Markdown de src/noticias/publicacoes/;
// - Transparência: um resultado por tema, que leva à lista já filtrada.
// Os campos seguem o formato que assets/js/principal.js espera:
// u (endereço), t (título), d (data), p (1 = notícia), c (categorias),
// r (resumo), x (texto), i (imagem).
import { textoPuro } from '../_lib/texto.js';

export default class {
  data() {
    return {
      permalink: '/assets/js/busca-indice.js',
      eleventyExcludeFromCollections: true
    };
  }

  render({ busca, collections, transparenciaArvore }) {
    const dataDe = (d) => d.toISOString().slice(0, 10);

    const noticias = collections.noticia.map((n) => ({
      u: n.url.replace(/^\//, ''),
      t: n.data.titulo,
      d: dataDe(n.date),
      p: 1,
      c: [n.data.categoria],
      r: n.data.resumo,
      x: textoPuro(n.content).slice(0, 6000),
      i: n.data.imagem || null
    }));

    // A data dos temas é a da página da Transparência
    const transparencia = busca.paginas.find((p) => p.u === 'transparencia/');
    const temas = transparenciaArvore.temas.map((tema) => {
      const titulos = new Set();
      for (const ano of tema.anos) {
        for (const g of ano.grupos) {
          for (const d of g.docs) titulos.add([d.titulo, g.rotulo, ano.ano].filter(Boolean).join(' '));
        }
      }
      return {
        u: `transparencia/documentos/?tema=${tema.id}#tema-${tema.id}`,
        t: `Transparência: ${tema.nome}`,
        d: transparencia.d,
        p: 0,
        c: [],
        r: `Lista com ${tema.quantidade} documentos${tema.faixa ? `, de ${tema.faixa}` : ''}, com filtros por ano e área.`,
        x: [...titulos].join(' · ').slice(0, 6000),
        i: null
      };
    });

    const indice = [...busca.paginas, ...noticias, ...temas].sort((a, b) => b.d.localeCompare(a.d));
    return `/* Gerado no build por src/busca/indice.11ty.js */\nwindow.APAE_INDICE = ${JSON.stringify(indice)};\n`;
  }
}
