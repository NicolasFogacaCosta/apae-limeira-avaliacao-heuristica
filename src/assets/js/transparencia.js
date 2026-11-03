/*
 * Filtros da lista de documentos da Transparência: tema, ano, área e palavra.
 * Sem JavaScript, a página mostra todos os documentos, agrupados por tema e ano.
 * Os filtros ficam no endereço (?tema=…&ano=…&area=…&q=…), que pode ser
 * compartilhado e é usado pelos redirecionamentos das páginas antigas.
 */
(function () {
  'use strict';

  var form = document.querySelector('[data-filtros-docs]');
  if (!form) return;
  var contagem = document.querySelector('[data-contagem]');
  var vazio = document.querySelector('[data-vazio]');
  var temas = document.querySelectorAll('.docs__tema');
  var CAMPOS = ['tema', 'ano', 'area', 'q'];

  function normalizar(t) {
    return t.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
  }

  function valores() {
    var v = {};
    CAMPOS.forEach(function (c) { v[c] = form.elements[c].value; });
    return v;
  }

  function aplicar() {
    var v = valores();
    var palavras = normalizar(v.q).split(/\s+/).filter(Boolean);
    var total = 0;

    temas.forEach(function (tema) {
      var temaVisivel = 0;
      var temaConfere = !v.tema || tema.getAttribute('data-tema') === v.tema;
      tema.querySelectorAll('.docs__ano').forEach(function (ano) {
        var anoVisivel = 0;
        var anoConfere = temaConfere && (!v.ano || ano.getAttribute('data-ano') === v.ano);
        ano.querySelectorAll('.docs__grupo').forEach(function (grupo) {
          var grupoVisivel = 0;
          var grupoConfere = anoConfere && (!v.area || grupo.getAttribute('data-area') === v.area);
          grupo.querySelectorAll('.docs__item').forEach(function (item) {
            var texto = item.getAttribute('data-texto');
            var mostra = grupoConfere && palavras.every(function (p) { return texto.indexOf(p) !== -1; });
            item.hidden = !mostra;
            if (mostra) grupoVisivel++;
          });
          grupo.hidden = !grupoVisivel;
          anoVisivel += grupoVisivel;
        });
        ano.hidden = !anoVisivel;
        temaVisivel += anoVisivel;
      });
      tema.hidden = !temaVisivel;
      total += temaVisivel;
    });

    var filtrando = CAMPOS.some(function (c) { return v[c]; });
    contagem.textContent = total === 1 ? '1 documento' : total + ' documentos';
    if (filtrando) contagem.textContent += ' com os filtros escolhidos';
    vazio.hidden = total > 0;

    var url = new URL(location.href);
    CAMPOS.forEach(function (c) { if (v[c]) url.searchParams.set(c, v[c]); else url.searchParams.delete(c); });
    history.replaceState(null, '', url.pathname + url.search + url.hash);
  }

  var params = new URLSearchParams(location.search);
  CAMPOS.forEach(function (c) { if (params.get(c)) form.elements[c].value = params.get(c); });

  form.addEventListener('change', aplicar);
  form.elements.q.addEventListener('input', aplicar);
  form.addEventListener('submit', function (e) { e.preventDefault(); aplicar(); });
  document.querySelectorAll('[data-limpar]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      e.preventDefault();
      form.reset();
      history.replaceState(null, '', location.pathname);
      aplicar();
      form.elements.tema.focus();
    });
  });

  aplicar();
})();
