/*
 * Seção de notícias (achado 23): lista as publicações do índice do site,
 * da mais recente para a mais antiga, com data completa (com ano) e
 * categoria, filtro por categoria e páginas de 20 itens.
 */
(function () {
  'use strict';

  var lista = document.querySelector('[data-lista]');
  if (!lista || !window.APAE_INDICE) return;
  var BASE = window.APAE_BASE || '../';
  var MESES = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho',
    'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
  var POR_PAGINA = 20;
  var contagem = document.querySelector('[data-contagem]');
  var paginas = document.querySelector('[data-paginas]');

  // Publicações cujo endereço é de uma página (o WordPress abre a página) ficam de fora.
  var enderecosDePaginas = {};
  window.APAE_INDICE.forEach(function (i) { if (!i.p) enderecosDePaginas[i.u] = true; });
  var publicacoes = window.APAE_INDICE.filter(function (i) { return i.p && !enderecosDePaginas[i.u]; });

  var params = new URLSearchParams(location.search);
  var categoria = params.get('categoria') || '';
  var pagina = Math.max(1, parseInt(params.get('pagina') || '1', 10));

  function esc(t) {
    return String(t).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function dataCompleta(iso) {
    var d = iso.split('-');
    return parseInt(d[2], 10) + ' de ' + MESES[parseInt(d[1], 10) - 1] + ' de ' + d[0];
  }
  function resumo(item) {
    var t = (item.r || item.x).split(' ');
    return t.length > 30 ? t.slice(0, 30).join(' ') + '…' : t.join(' ');
  }

  function desenhar(focarLista) {
    var filtradas = publicacoes.filter(function (i) { return !categoria || i.c.indexOf(categoria) !== -1; });
    var total = Math.max(1, Math.ceil(filtradas.length / POR_PAGINA));
    pagina = Math.min(pagina, total);
    var inicio = (pagina - 1) * POR_PAGINA;
    lista.innerHTML = filtradas.slice(inicio, inicio + POR_PAGINA).map(function (i) {
      return '<li class="noticia">' +
        '<div><time class="noticia__data" datetime="' + i.d + '">' + dataCompleta(i.d) + '</time><br>' +
        '<span class="noticia__categoria">' + esc(i.c.join(', ')) + '</span></div>' +
        '<div><h2 class="noticia__titulo"><a href="' + BASE + i.u + '">' + esc(i.t) + '</a></h2>' +
        '<p class="noticia__resumo">' + esc(resumo(i)) + '</p></div>' +
        '</li>';
    }).join('');
    contagem.textContent = filtradas.length + ' publicações' + (categoria ? ' em ' + categoria : '') +
      ' · página ' + pagina + ' de ' + total;
    paginas.innerHTML =
      '<button type="button" data-ir="-1"' + (pagina === 1 ? ' disabled' : '') + '>← Mais recentes</button>' +
      '<span>Página ' + pagina + ' de ' + total + '</span>' +
      '<button type="button" data-ir="1"' + (pagina === total ? ' disabled' : '') + '>Mais antigas →</button>';
    var url = new URL(location.href);
    url.searchParams.set('pagina', pagina);
    if (categoria) url.searchParams.set('categoria', categoria); else url.searchParams.delete('categoria');
    history.replaceState(null, '', url);
    if (focarLista) contagem.scrollIntoView({ block: 'start' });
  }

  document.querySelectorAll('input[name="categoria"]').forEach(function (r) {
    r.checked = r.value === categoria;
    r.addEventListener('change', function () { categoria = r.value; pagina = 1; desenhar(false); });
  });
  paginas.addEventListener('click', function (e) {
    var b = e.target.closest('[data-ir]');
    if (!b || b.disabled) return;
    pagina += parseInt(b.getAttribute('data-ir'), 10);
    desenhar(true);
  });

  desenhar(false);
})();
