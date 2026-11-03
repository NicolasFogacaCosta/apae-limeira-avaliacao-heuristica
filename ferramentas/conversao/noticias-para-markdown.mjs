// Converte as publicações (notícias) de src/<slug>/index.html em arquivos
// Markdown com front matter, em src/noticias/publicacoes/<slug>.md.
//
// Uso único na etapa 2 da reorganização; fica no repositório para registrar
// como os arquivos foram gerados. A categoria, o resumo e a imagem destacada
// vêm do índice de busca (src/assets/js/busca-indice.js).
//
//   node ferramentas/conversao/noticias-para-markdown.mjs
import fs from 'node:fs';
import path from 'node:path';
import TurndownService from 'turndown';

const RAIZ = path.resolve(import.meta.dirname, '..', '..');
const SRC = path.join(RAIZ, 'src');
const DESTINO = path.join(SRC, 'noticias', 'publicacoes');

const indiceJs = fs.readFileSync(path.join(SRC, 'assets', 'js', 'busca-indice.js'), 'utf8');
const indice = JSON.parse(indiceJs.slice(indiceJs.indexOf('['), indiceJs.lastIndexOf(']') + 1));

// Publicações cujo endereço é de uma página não existem no site (a página vence).
const enderecosDePaginas = new Set(indice.filter((i) => !i.p).map((i) => i.u));
const publicacoes = indice.filter((i) => i.p && !enderecosDePaginas.has(i.u));

const td = new TurndownService({ headingStyle: 'atx', emDelimiter: '_', strongDelimiter: '**', bulletListMarker: '-' });
// Figuras, imagens (com largura e altura), vídeos e tabelas ficam em HTML
td.keep(['figure', 'iframe', 'table']);
// A regra de imagem do Turndown vence o keep(); esta vence a dele
td.addRule('imagem', { filter: 'img', replacement: (_, no) => no.outerHTML });

// Negrito: o espaço nas bordas vai para fora dos asteriscos, negrito só de
// pontuação some e, quando o Markdown não reconheceria os "**" (pontuação
// colada em letra), o negrito fica em HTML.
const PONTUACAO = /[\p{P}\p{S}]/u;
const ESPACO = /\s/;
function vizinho(no, lado) {
  const irmao = lado === 'antes' ? no.previousSibling : no.nextSibling;
  const texto = irmao ? irmao.textContent : '';
  return (lado === 'antes' ? texto.slice(-1) : texto.slice(0, 1)) || ' ';
}
td.addRule('negrito', {
  filter: ['strong', 'b'],
  replacement(conteudo, no) {
    const [, ini, meio, fim] = conteudo.match(/^(\s*)([\s\S]*?)(\s*)$/);
    if (!meio) return conteudo;
    if (!/[\p{L}\p{N}]/u.test(meio)) return ini + meio + fim;
    const antes = ini ? ' ' : vizinho(no, 'antes');
    const depois = fim ? ' ' : vizinho(no, 'depois');
    const primeiro = meio[0];
    const ultimo = meio[meio.length - 1];
    const abre = !PONTUACAO.test(primeiro) || ESPACO.test(antes) || PONTUACAO.test(antes);
    const fecha = !PONTUACAO.test(ultimo) || ESPACO.test(depois) || PONTUACAO.test(depois);
    return ini + (abre && fecha ? `**${meio}**` : `<strong>${meio}</strong>`) + fim;
  }
});

function decodificar(t) {
  return t
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&');
}

function resumo(item) {
  const palavras = (item.r || item.x).split(' ');
  return palavras.length > 30 ? palavras.slice(0, 30).join(' ') + '…' : palavras.join(' ');
}

fs.mkdirSync(DESTINO, { recursive: true });
let convertidas = 0;
for (const item of publicacoes) {
  const slug = item.u.replace(/\/$/, '');
  const arquivo = path.join(SRC, slug, 'index.html');
  const html = fs.readFileSync(arquivo, 'utf8');
  const data = html.match(/<time class="publicacao__data" datetime="([^"]+)">/)[1];
  const titulo = html.match(/<h1 class="publicacao__titulo">([\s\S]*?)<\/h1>/)[1];
  const corpo = html.match(/<div class="publicacao__conteudo">\n([\s\S]*?)\n    <\/div>\n  <\/div>\n<\/main>/)[1];
  // Alguns títulos vêm com <strong>; o h1 já é negrito
  const tituloTexto = decodificar(titulo.replace(/<[^>]+>/g, '')).trim();

  // Strings em JSON também são YAML válido
  const frente = [
    '---',
    `titulo: ${JSON.stringify(tituloTexto)}`,
    `date: ${data}`,
    `categoria: ${JSON.stringify(item.c[0])}`,
    item.i ? `imagem: ${JSON.stringify(item.i)}` : null,
    `resumo: ${JSON.stringify(resumo(item))}`,
    '---'
  ].filter(Boolean).join('\n');

  // "1)" no começo da linha viraria lista numerada, "![" viraria imagem e uma
  // linha só com <img> seguida de quebra viraria bloco HTML, engolindo a seguinte
  const markdown = td.turndown(corpo).trim()
    .replace(/^(\d+)\)/gm, '$1\\)')
    .replace(/^((?:> )*<img[^>]*>) {2}$/gm, '$1<br>')
    .replace(/(^|[^\\])!\[/g, '$1\\![');
  fs.writeFileSync(path.join(DESTINO, `${slug}.md`), `${frente}\n\n${markdown}\n`);
  fs.rmSync(path.join(SRC, slug), { recursive: true });
  convertidas++;
}
console.log(`${convertidas} publicações convertidas para ${path.relative(RAIZ, DESTINO)}`);
