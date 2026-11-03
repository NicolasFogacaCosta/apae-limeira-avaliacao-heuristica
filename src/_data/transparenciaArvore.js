// Organiza os documentos da Transparência (src/_data/transparencia/: temas.json
// e documentos/, um arquivo por documento, editável pelo painel de conteúdo)
// para a página /transparencia/documentos/: tema > ano > grupo (área e
// detalhe) > documentos, com o texto usado pelo filtro de palavras.
import fs from 'node:fs';
import path from 'node:path';
import { idArea, normalizar } from '../_lib/texto.js';

const PASTA = path.join(import.meta.dirname, 'transparencia');
const ler = (nome) => JSON.parse(fs.readFileSync(path.join(PASTA, `${nome}.json`), 'utf8'));

// Documentos na ordem da lista original; os novos (sem "ordem") vão para o fim
function lerDocumentos() {
  const pasta = path.join(PASTA, 'documentos');
  return fs.readdirSync(pasta).filter((f) => f.endsWith('.json')).sort()
    .map((f) => JSON.parse(fs.readFileSync(path.join(pasta, f), 'utf8')))
    .map((d) => ({ ...d, ano: d.ano ? Number(d.ano) : null, area: d.area || null, detalhe: d.detalhe || null }))
    .sort((a, b) => (a.ordem ?? Infinity) - (b.ordem ?? Infinity));
}

const MESES = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto',
  'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

export default function () {
  const temas = ler('temas');
  const documentos = lerDocumentos();

  const arvore = temas.map((tema) => {
    const docs = documentos.filter((d) => d.tema === tema.id);
    const anos = [...new Set(docs.map((d) => d.ano))].sort((a, b) => (b ?? 0) - (a ?? 0));
    return {
      ...tema,
      quantidade: docs.length,
      faixa: anos.filter(Boolean).length
        ? `${Math.min(...anos.filter(Boolean))} a ${Math.max(...anos.filter(Boolean))}`
        : null,
      anos: anos.map((ano) => {
        const doAno = docs.filter((d) => d.ano === ano);
        const grupos = new Map();
        for (const d of doAno) {
          const rotulo = [d.area, d.detalhe].filter(Boolean).join(' · ');
          if (!grupos.has(rotulo)) grupos.set(rotulo, { rotulo, area: idArea(d.area), docs: [] });
          grupos.get(rotulo).docs.push({
            ...d,
            texto: normalizar([d.titulo, d.detalhe, d.area, tema.nome, ano].filter(Boolean).join(' '))
          });
        }
        const lista = [...grupos.values()].sort((a, b) => a.rotulo.localeCompare(b.rotulo, 'pt-BR'));
        for (const g of lista) {
          g.meses = g.docs.every((d) => MESES.includes(d.titulo));
          if (g.meses) g.docs.sort((a, b) => MESES.indexOf(a.titulo) - MESES.indexOf(b.titulo));
        }
        return { ano, grupos: lista };
      })
    };
  });

  const anos = [...new Set(documentos.map((d) => d.ano).filter(Boolean))].sort((a, b) => b - a);
  const areas = [...new Set(documentos.map((d) => d.area).filter(Boolean))].sort((a, b) => a.localeCompare(b, 'pt-BR'))
    .map((nome) => ({ id: idArea(nome), nome }));

  return {
    temas: arvore,
    porOrigem: Object.fromEntries(arvore.filter((t) => t.origem).map((t) => [t.origem, t])),
    porId: Object.fromEntries(arvore.map((t) => [t.id, t])),
    quantidade: documentos.length,
    anos,
    areas
  };
}
