/*
 * Comportamentos do site, reproduzidos do site em produção:
 * menu, busca do cabeçalho, carrosséis da home, aviso de cookies,
 * botões de compartilhar e formulário de contato (Contact Form 7).
 */
(function () {
  'use strict';

  var BASE = window.APAE_BASE || '';
  var mobile = window.matchMedia('(max-width: 1024px)');

  function armazenar(chave, valor) {
    try {
      if (valor === undefined) return window.localStorage.getItem(chave);
      window.localStorage.setItem(chave, valor);
    } catch (e) { return null; }
    return null;
  }

  /* Menu ------------------------------------------------------------------ */
  var menu = document.querySelector('.menu-principal');
  if (menu) {
    menu.querySelector('.menu-principal__alternar').addEventListener('click', function () {
      menu.classList.toggle('aberto');
    });
    // No celular, tocar no item com submenu abre o submenu.
    menu.querySelectorAll('.tem-submenu > .menu-principal__link').forEach(function (link) {
      link.addEventListener('click', function (e) {
        if (!mobile.matches) return;
        e.preventDefault();
        link.parentNode.classList.toggle('aberto');
      });
    });
  }

  /* Busca do cabeçalho: o ícone abre o campo ----------------------------- */
  var busca = document.querySelector('.busca-topo');
  if (busca) {
    var campo = busca.querySelector('.busca-topo__campo');
    busca.querySelector('.busca-topo__icone').addEventListener('click', function () {
      if (busca.classList.contains('aberta') && campo.value.trim()) {
        busca.submit();
        return;
      }
      busca.classList.toggle('aberta');
      if (busca.classList.contains('aberta')) campo.focus();
    });
    document.addEventListener('click', function (e) {
      if (!busca.contains(e.target) && !campo.value) busca.classList.remove('aberta');
    });
  }

  /* Carrosséis da home ----------------------------------------------------- */
  function carrossel(raiz, opcoes) {
    if (!raiz) return;
    var trilho = raiz.querySelector(opcoes.trilho);
    var itens = trilho.children;
    var visiveis = opcoes.visiveis ? opcoes.visiveis() : 1;
    var atual = 0;
    var timer = null;

    function total() { return Math.max(1, itens.length - (opcoes.visiveis ? opcoes.visiveis() : 1) + 1); }
    function ir(i) {
      var n = total();
      atual = (i + n) % n;
      var passo = itens[0].getBoundingClientRect().width + (opcoes.espaco || 0);
      trilho.style.transform = 'translateX(' + (-atual * passo) + 'px)';
    }
    function iniciar() { parar(); timer = setInterval(function () { ir(atual + 1); }, opcoes.intervalo); }
    function parar() { if (timer) clearInterval(timer); timer = null; }

    var ant = raiz.querySelector('[data-anterior]');
    var prox = raiz.querySelector('[data-proximo]');
    if (ant) ant.addEventListener('click', function () { ir(atual - 1); if (opcoes.reiniciar) iniciar(); });
    if (prox) prox.addEventListener('click', function () { ir(atual + 1); if (opcoes.reiniciar) iniciar(); });
    if (opcoes.pausarNoPonteiro) {
      raiz.addEventListener('mouseenter', parar);
      raiz.addEventListener('mouseleave', iniciar);
    }
    window.addEventListener('resize', function () { ir(Math.min(atual, total() - 1)); });
    iniciar();
    return { ir: ir };
  }

  var banner = document.querySelector('.banner');
  if (banner) {
    // O slider só aparece quando todas as imagens terminam de carregar.
    window.addEventListener('load', function () { banner.classList.add('carregado'); });
    carrossel(banner, { trilho: '.banner__trilho', intervalo: 5000, reiniciar: true });
  }
  carrossel(document.querySelector('.eventos__carrossel'), {
    trilho: '.eventos__trilho', intervalo: 5000, reiniciar: true, pausarNoPonteiro: true
  });
  carrossel(document.querySelector('.programas'), {
    trilho: '.programas__trilho', intervalo: 5000, espaco: 27, pausarNoPonteiro: true, reiniciar: true,
    visiveis: function () {
      return window.matchMedia('(max-width: 767px)').matches ? 1 : (mobile.matches ? 2 : 4);
    }
  });

  /* Aviso de cookies ------------------------------------------------------- */
  var aviso = document.getElementById('aviso-cookies');
  var modal = document.getElementById('modal-cookies');
  var reabrir = document.querySelector('.cookies-reabrir');
  if (aviso) {
    var consentimento = armazenar('apae-cookies');
    if (consentimento) reabrir.hidden = false; else aviso.hidden = false;

    document.addEventListener('click', function (e) {
      var alvo = e.target.closest('[data-cookies]');
      if (!alvo) return;
      var acao = alvo.getAttribute('data-cookies');
      if (acao === 'config') { modal.hidden = false; return; }
      if (acao === 'fechar') { modal.hidden = true; return; }
      if (acao === 'aceitar' || acao === 'salvar') {
        armazenar('apae-cookies', acao === 'aceitar' ? 'todos' : 'personalizado');
        aviso.hidden = true;
        modal.hidden = true;
        reabrir.hidden = false;
      }
    });
  }

  /* Compartilhar ----------------------------------------------------------- */
  document.querySelectorAll('[data-compartilhar] [data-rede]').forEach(function (botao) {
    function abrir() {
      var u = encodeURIComponent(location.href);
      var t = encodeURIComponent(document.title);
      var destinos = {
        facebook: 'https://www.facebook.com/sharer.php?u=' + u,
        whatsapp: 'https://api.whatsapp.com/send?text=' + t + '%20' + u,
        twitter: 'https://twitter.com/intent/tweet?text=' + t + '&url=' + u,
        pinterest: 'https://www.pinterest.com/pin/create/button/?url=' + u,
        linkedin: 'https://www.linkedin.com/shareArticle?mini=true&url=' + u
      };
      window.open(destinos[botao.getAttribute('data-rede')], '_blank', 'width=600,height=500');
    }
    botao.addEventListener('click', abrir);
    botao.addEventListener('keydown', function (e) { if (e.key === 'Enter') abrir(); });
  });

  /* Formulário de contato (Contact Form 7) ----------------------------------
     Sem servidor nesta cópia: o envio é simulado. A validação acontece só
     depois de clicar em "Enviar", como no plugin. */
  document.querySelectorAll('form[data-formulario-contato]').forEach(function (form) {
    var resposta = document.createElement('div');
    resposta.className = 'formulario-resposta';
    resposta.hidden = true;
    form.appendChild(resposta);

    function limparErros() {
      form.querySelectorAll('.formulario-erro').forEach(function (el) { el.remove(); });
    }
    function erro(campo, texto) {
      var span = document.createElement('span');
      span.className = 'formulario-erro';
      span.style.cssText = 'display:block;color:#dc3232;font-size:1em;font-weight:normal;';
      span.textContent = texto;
      campo.insertAdjacentElement('afterend', span);
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      limparErros();
      var falhou = false;
      var quizErrado = false;
      form.querySelectorAll('input[aria-required="true"], textarea[aria-required="true"]').forEach(function (campo) {
        var v = campo.value.trim();
        if (!v) { erro(campo, 'Preencha este campo.'); falhou = true; return; }
        if (campo.type === 'email' && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v)) {
          erro(campo, 'Digite um endereço de e-mail.'); falhou = true; return;
        }
        if (campo.name === 'quiz' && v !== '26') {
          erro(campo, 'A resposta para o quiz está incorreta.'); falhou = true; quizErrado = true;
        }
      });
      resposta.hidden = false;
      if (falhou) {
        resposta.className = 'formulario-resposta formulario-resposta--erro';
        resposta.textContent = 'Um ou mais campos possuem um erro. Verifique e tente novamente.';
        return;
      }
      resposta.className = 'formulario-resposta';
      resposta.textContent = 'Agradecemos a sua mensagem. Ela foi enviada.';
      form.reset();
    });
  });

  /* Busca (página busca/) ---------------------------------------------------- */
  var areaBusca = document.getElementById('resultados-busca');
  if (areaBusca && window.APAE_INDICE) {
    var MESES = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho',
      'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
    var params = new URLSearchParams(location.search);
    var termo = (params.get('s') || '').trim();
    var pagina = Math.max(1, parseInt(params.get('pagina') || '1', 10));
    var POR_PAGINA = 10;

    function esc(t) {
      return String(t).replace(/[&<>"']/g, function (c) {
        return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
      });
    }
    function normalizar(t) { return t.toLowerCase(); }

    // Como no WordPress: todas as palavras precisam aparecer no título,
    // no resumo ou no conteúdo; resultados do mais recente ao mais antigo.
    var palavras = normalizar(termo).split(/\s+/).filter(Boolean);
    var achados = palavras.length ? window.APAE_INDICE.filter(function (item) {
      var alvo = normalizar(item.t + ' ' + item.r + ' ' + item.x);
      return palavras.every(function (p) { return alvo.indexOf(p) !== -1; });
    }) : window.APAE_INDICE.slice();

    document.title = 'Resultados da pesquisa por “' + termo + '” – APAE Limeira';

    function resumo(item) {
      var texto = item.r || item.x;
      var palavrasTexto = texto.split(' ');
      return palavrasTexto.length > 55 ? palavrasTexto.slice(0, 55).join(' ') + '…' : texto;
    }

    var html;
    if (!achados.length) {
      html = '<section class="no-results"><h1 class="busca__titulo">Nothing Found</h1>' +
        '<form class="busca__form" role="search" method="get" action="' + BASE + 'busca/">' +
        '<label for="s"><input type="text" value="' + esc(termo) + '" placeholder="Search …" name="s" id="s"></label>' +
        '<button type="submit" aria-label="Search"><svg class="icone" aria-hidden="true"><use href="#i-busca"></use></svg></button>' +
        '</form></section>';
    } else {
      var inicio = (pagina - 1) * POR_PAGINA;
      html = '<h1 class="busca__titulo">Search Results for: <span>' + esc(termo) + '</span></h1>' +
        achados.slice(inicio, inicio + POR_PAGINA).map(function (item) {
          var link = BASE + item.u;
          var d = item.d.split('-');
          var meta = item.p ? '<div class="resultado__meta">' +
            '<span><svg class="icone" aria-hidden="true"><use href="#i-pessoa"></use></svg><a href="#">apae_limeira</a></span>' +
            (item.c.length ? '<span><svg class="icone" aria-hidden="true"><use href="#i-pasta"></use></svg>' +
              item.c.map(function (c) { return '<a href="#">' + esc(c) + '</a>'; }).join(', ') + '</span>' : '') +
            '</div>' : '';
          return '<article class="resultado">' +
            (item.i ? '<div class="resultado__imagem"><a href="' + link + '"><img src="' + item.i + '" alt="" loading="lazy"></a></div>' : '') +
            '<header class="resultado__cabecalho">' +
              '<div class="resultado__data">' + d[2] + ' <i>' + MESES[parseInt(d[1], 10) - 1] + '</i></div>' +
              '<div><h2 class="resultado__titulo"><a href="' + link + '">' + esc(item.t) + '</a></h2>' + meta + '</div>' +
            '</header>' +
            '<div class="resultado__resumo"><p>' + esc(resumo(item)) + '</p></div>' +
            '<div class="resultado__leia"><a href="' + link + '">Read more</a></div>' +
            '</article>';
        }).join('');
      var nav = '';
      if (inicio + POR_PAGINA < achados.length) {
        nav += '<div><a href="?s=' + encodeURIComponent(termo) + '&pagina=' + (pagina + 1) + '">Publicações mais antigas</a></div>';
      } else { nav += '<div></div>'; }
      if (pagina > 1) {
        nav += '<div><a href="?s=' + encodeURIComponent(termo) + '&pagina=' + (pagina - 1) + '">Publicações mais recentes</a></div>';
      }
      html += '<nav class="busca__paginacao" aria-label="Posts"><h2 style="position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)">Navegação por posts</h2>' + nav + '</nav>';
    }
    areaBusca.innerHTML = html;
    var campoTopo = document.querySelector('.busca-topo__campo');
    if (campoTopo) campoTopo.value = termo;
  }
})();
