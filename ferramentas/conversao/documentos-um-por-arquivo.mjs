// Divide src/_data/transparencia/documentos.json em um arquivo por documento,
// em src/_data/transparencia/documentos/, para o painel de conteúdo (Decap CMS)
// editar cada documento separadamente. O campo "ordem" guarda a posição de
// cada documento na lista original.
//
// Uso único na etapa 5 da reorganização; fica no repositório para registrar
// como os arquivos foram gerados.
//
//   node ferramentas/conversao/documentos-um-por-arquivo.mjs
import fs from 'node:fs';
import path from 'node:path';

const PASTA = path.resolve(import.meta.dirname, '..', '..', 'src', '_data', 'transparencia');
const origem = path.join(PASTA, 'documentos.json');
const destino = path.join(PASTA, 'documentos');

const slug = (t) => t.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
  .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 50).replace(/-$/, '');

const documentos = JSON.parse(fs.readFileSync(origem, 'utf8'));
fs.mkdirSync(destino, { recursive: true });
const usados = new Set();
documentos.forEach((d, i) => {
  const base = [d.tema, d.ano ?? 'sem-ano', d.area, d.detalhe, d.titulo].filter(Boolean).map(String).map(slug).join('-');
  let nome = base;
  for (let n = 2; usados.has(nome); n++) nome = `${base}-${n}`;
  usados.add(nome);
  const { origem: pagina, ...resto } = d;
  const dados = { ...resto, ordem: i + 1, origem: pagina ?? null };
  fs.writeFileSync(path.join(destino, `${nome}.json`), JSON.stringify(dados, null, 1) + '\n');
});
fs.rmSync(origem);
console.log(`${documentos.length} documentos em ${path.relative(process.cwd(), destino)}`);
