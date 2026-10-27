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
    // Achado 04: o link do item leva à página de seção; no celular, o botão
    // ao lado abre o submenu. No computador o submenu abre ao passar o mouse
    // ou quando o foco do teclado entra no item; Esc fecha.
    menu.querySelectorAll('.submenu-alternar').forEach(function (botao) {
      botao.addEventListener('click', function () {
        var aberto = botao.parentNode.classList.toggle('aberto');
        botao.setAttribute('aria-expanded', aberto ? 'true' : 'false');
      });
    });
    menu.addEventListener('keydown', function (e) {
      var item = e.target.closest('.tem-submenu');
      if (!item) return;
      if (e.key === 'Escape') {
        item.classList.add('fechado');
        item.querySelector('.menu-principal__link').focus();
      } else if (e.key === 'ArrowDown' && e.target.classList.contains('menu-principal__link')) {
        e.preventDefault();
        item.classList.remove('fechado');
        item.querySelector('.submenu a').focus();
      }
    });
    menu.addEventListener('focusout', function (e) {
      var item = e.target.closest('.tem-submenu');
      if (item && !item.contains(e.relatedTarget)) item.classList.remove('fechado');
    });
    menu.addEventListener('mouseover', function (e) {
      var item = e.target.closest('.tem-submenu');
      if (item) item.classList.remove('fechado');
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
    return { ir: ir, parar: parar, iniciar: iniciar };
  }

  var banner = document.querySelector('.banner');
  if (banner) {
    // Achado 03: o banner aparece de imediato (com a prévia em baixa resolução);
    // quando o primeiro slide termina de carregar, os demais começam a carregar.
    var primeira = banner.querySelector('.banner__slide img');
    function bannerCarregado() {
      banner.setAttribute('aria-busy', 'false');
      primeira.style.background = '';
      banner.querySelectorAll('img[loading="lazy"]').forEach(function (img) { img.loading = 'eager'; });
    }
    if (primeira.complete && primeira.naturalWidth) bannerCarregado();
    else primeira.addEventListener('load', bannerCarregado);
    // Achado 18: o banner pode ser pausado, tem indicadores clicáveis e setas
    // nos dois sentidos; para ao receber foco ou ponteiro e não gira sozinho
    // para quem pediu menos movimento no sistema.
    (function () {
      var trilho = banner.querySelector('.banner__trilho');
      var itens = Array.prototype.slice.call(trilho.children);
      var pontos = Array.prototype.slice.call(banner.querySelectorAll('[data-ir-slide]'));
      var botaoPausar = banner.querySelector('[data-pausar]');
      var textoPausar = banner.querySelector('[data-pausar-texto]');
      var posicao = banner.querySelector('[data-posicao]');
      var menosMovimento = window.matchMedia('(prefers-reduced-motion: reduce)');
      var atual = 0, timer = null, pausado = menosMovimento.matches, ponteiro = false, foco = false;

      function ir(i) {
        atual = (i + itens.length) % itens.length;
        trilho.style.transform = 'translateX(' + (-atual * itens[0].getBoundingClientRect().width) + 'px)';
        pontos.forEach(function (p, n) {
          if (n === atual) p.setAttribute('aria-current', 'true'); else p.removeAttribute('aria-current');
        });
        posicao.textContent = 'Slide ' + (atual + 1) + ' de ' + itens.length;
      }
      function parar() { if (timer) clearInterval(timer); timer = null; }
      function tocar() {
        parar();
        if (pausado || ponteiro || foco) return;
        timer = setInterval(function () { ir(atual + 1); }, 5000);
      }
      function definirPausa(valor) {
        pausado = valor;
        textoPausar.textContent = pausado ? 'Continuar' : 'Pausar';
        botaoPausar.classList.toggle('pausado', pausado);
        // Enquanto gira sozinho, a posição não é anunciada a cada troca.
        posicao.setAttribute('aria-live', pausado ? 'polite' : 'off');
        tocar();
      }

      botaoPausar.addEventListener('click', function () { definirPausa(!pausado); });
      // Escolher um slide para a rotação, para a pessoa conseguir ler.
      pontos.forEach(function (p, n) { p.addEventListener('click', function () { ir(n); definirPausa(true); }); });
      banner.querySelector('[data-anterior]').addEventListener('click', function () { ir(atual - 1); definirPausa(true); });
      banner.querySelector('[data-proximo]').addEventListener('click', function () { ir(atual + 1); definirPausa(true); });

      banner.addEventListener('pointerenter', function () { ponteiro = true; parar(); });
      banner.addEventListener('pointerleave', function () { ponteiro = false; tocar(); });
      banner.addEventListener('focusin', function (e) {
        foco = true; parar();
        // Achado 01: a chamada que recebe foco fica visível na tela.
        var slide = e.target.closest('.banner__slide');
        if (slide) ir(itens.indexOf(slide));
      });
      banner.addEventListener('focusout', function (e) {
        if (!banner.contains(e.relatedTarget)) { foco = false; tocar(); }
      });
      menosMovimento.addEventListener('change', function () { if (menosMovimento.matches) definirPausa(true); });
      window.addEventListener('resize', function () { ir(atual); });

      definirPausa(pausado);
      ir(0);
    })();
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

    // Achado 19: a faixa não cobre o conteúdo. Enquanto ela (ou a aba
    // "Gerenciar consentimento") está visível, a página ganha um espaço no
    // fim do mesmo tamanho, e o elemento focado rola para cima dela.
    function reservarEspaco() {
      var visivel = !aviso.hidden ? aviso : (!reabrir.hidden ? reabrir : null);
      var altura = visivel ? visivel.getBoundingClientRect().height : 0;
      document.documentElement.style.setProperty('--altura-aviso-cookies', Math.ceil(altura) + 'px');
    }
    reservarEspaco();
    window.addEventListener('resize', reservarEspaco);

    document.addEventListener('click', function (e) {
      var alvo = e.target.closest('[data-cookies]');
      if (!alvo) return;
      var acao = alvo.getAttribute('data-cookies');
      if (acao === 'config') { modal.hidden = false; return; }
      if (acao === 'fechar') { modal.hidden = true; return; }
      if (acao === 'aceitar' || acao === 'recusar' || acao === 'salvar') {
        armazenar('apae-cookies', { aceitar: 'todos', recusar: 'necessarios', salvar: 'personalizado' }[acao]);
        aviso.hidden = true;
        modal.hidden = true;
        reabrir.hidden = false;
        reservarEspaco();
      }
    });
  }

  /* Compartilhar ----------------------------------------------------------- */
  document.querySelectorAll('[data-compartilhar] [data-rede]').forEach(function (botao) {
    // Achado 15: o nome do botão diz o que ele faz, mesmo lido fora de contexto.
    botao.setAttribute('aria-label', 'Compartilhar esta página no ' + botao.textContent.trim() + ' (abre em nova janela)');
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

  /* Formulário de contato ----------------------------------------------------
     Achado 12: cada campo é validado ao sair dele (blur), com a mensagem em
     português logo abaixo do campo; o que foi digitado nunca é apagado quando
     a validação falha. Sem servidor nesta cópia, o envio é simulado com a
     mensagem do Contact Form 7. */
  document.querySelectorAll('form[data-formulario-contato]').forEach(function (form) {
    var resposta = form.querySelector('.formulario-resposta');
    var MENSAGENS = {
      'your-name': function (v) { return v ? '' : 'Preencha o seu nome.'; },
      'your-email': function (v) {
        if (!v) return 'Preencha o seu e-mail.';
        return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v) ? '' : 'Confira o e-mail: falta uma parte. Exemplo: nome@email.com.br';
      },
      'your-subject': function (v) { return v ? '' : 'Preencha o assunto.'; },
      'your-message': function (v) { return v ? '' : 'Escreva a sua mensagem.'; }
    };
    var campos = Array.prototype.slice.call(form.querySelectorAll('[required]'));

    function validar(campo) {
      var regra = MENSAGENS[campo.name];
      var msg = regra ? regra(campo.value.trim()) : '';
      var erro = document.getElementById(campo.id + '-erro');
      erro.textContent = msg;
      erro.hidden = !msg;
      if (msg) campo.setAttribute('aria-invalid', 'true'); else campo.removeAttribute('aria-invalid');
      return !msg;
    }

    campos.forEach(function (campo) {
      var mexeu = false;
      campo.addEventListener('input', function () {
        mexeu = true;
        if (campo.getAttribute('aria-invalid') === 'true') validar(campo);
        resposta.hidden = true;
      });
      campo.addEventListener('blur', function () { if (mexeu || campo.value) validar(campo); });
    });

    // Achado 13: sem pergunta antispam. O campo armadilha (fora da tela) só é
    // preenchido por robôs; a verificação definitiva deve ficar no servidor.
    var armadilha = form.querySelector('[name="website"]');

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (armadilha && armadilha.value) {
        resposta.hidden = false;
        resposta.className = 'formulario-resposta formulario-resposta--erro';
        resposta.textContent = 'Houve um erro ao tentar enviar sua mensagem. Tente novamente mais tarde.';
        return;
      }
      var invalidos = campos.filter(function (campo) { return !validar(campo); });
      resposta.hidden = false;
      if (invalidos.length) {
        resposta.className = 'formulario-resposta formulario-resposta--erro';
        resposta.textContent = 'Um ou mais campos possuem um erro. Verifique e tente novamente.';
        invalidos[0].focus();
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

    // Achado 11: sugestão de grafia. Compara cada palavra buscada com as
    // palavras dos títulos do site (sem acento) e só sugere se a busca
    // corrigida tiver resultados.
    function semAcento(t) { return t.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase(); }
    function distancia(a, b) {
      if (Math.abs(a.length - b.length) > 2) return 99;
      var ant = [], i, j;
      for (j = 0; j <= b.length; j++) ant[j] = j;
      for (i = 1; i <= a.length; i++) {
        var atual = [i];
        for (j = 1; j <= b.length; j++) {
          atual[j] = Math.min(ant[j] + 1, atual[j - 1] + 1, ant[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
        }
        ant = atual;
      }
      return ant[b.length];
    }
    function sugerirGrafia(lista) {
      if (!lista.length) return '';
      var vocab = {};
      window.APAE_INDICE.forEach(function (item) {
        item.t.split(/[^A-Za-zÀ-ÿ]+/).forEach(function (w) {
          if (w.length >= 4) { var k = semAcento(w); if (!vocab[k]) vocab[k] = w.toLowerCase(); }
        });
      });
      var mudou = false;
      var corrigidas = lista.map(function (p) {
        var alvo = semAcento(p);
        if (vocab[alvo]) return vocab[alvo] === p ? p : (mudou = true, vocab[alvo]);
        var melhor = '', menor = alvo.length > 5 ? 3 : 2;
        Object.keys(vocab).forEach(function (k) {
          var d = distancia(alvo, k);
          if (d < menor) { menor = d; melhor = vocab[k]; }
        });
        if (melhor) { mudou = true; return melhor; }
        return p;
      });
      if (!mudou) return '';
      var temResultado = window.APAE_INDICE.some(function (item) {
        var t = normalizar(item.t + ' ' + item.r + ' ' + item.x);
        return corrigidas.every(function (p) { return t.indexOf(p) !== -1; });
      });
      return temResultado ? corrigidas.join(' ') : '';
    }

    // Como no WordPress: todas as palavras precisam aparecer no título,
    // no resumo ou no conteúdo; resultados do mais recente ao mais antigo.
    var palavras = normalizar(termo).split(/\s+/).filter(Boolean);

    // Achado 22: vocabulário do público. Cada palavra buscada também encontra
    // os sinônimos do grupo; termos de até 3 letras (como "TEA") só casam como
    // palavra inteira, para não trazer "teatro".
    var AUTISMO = ['autismo', 'autista', 'autistas', 'tea', 'espectro autista', 'transtorno do espectro autista'];
    var SINONIMOS = {
      autismo: AUTISMO, autista: AUTISMO, autistas: AUTISMO, tea: AUTISMO,
      neurodivergente: AUTISMO, neurodivergentes: AUTISMO, neurodivergência: AUTISMO,
      neurodiversidade: AUTISMO, neuroatípico: AUTISMO, neuroatípicos: AUTISMO, neuroatípica: AUTISMO
    };
    var TEMA_AUTISMO = [
      ['Escola de Educação Especial “João Ometto”', 'escola-de-educacao-especial-joao-ometto/', 'Educação especializada que inclui estudantes com Transtorno do Espectro Autista (TEA) associado à deficiência intelectual.'],
      ['Centro de Apoio Diagnóstico', 'cad/', 'Triagens e avaliações do desenvolvimento infantil, porta de entrada da APAE.'],
      ['Sobre a deficiência intelectual', 'sobre-a-deficiencia-intelectual/', 'O que é, como se manifesta e quais são as causas.'],
      ['Dúvidas frequentes', 'duvidas-frequentes/', 'Respostas às perguntas mais comuns das famílias.']
    ];
    function contem(alvo, termoBusca) {
      if (termoBusca.length <= 3) return new RegExp('(^|[^a-zà-ÿ0-9])' + termoBusca + '([^a-zà-ÿ0-9]|$)').test(alvo);
      return alvo.indexOf(termoBusca) !== -1;
    }
    var expandiu = palavras.some(function (p) { return SINONIMOS[p]; });
    var achados = palavras.length ? window.APAE_INDICE.filter(function (item) {
      var alvo = normalizar(item.t + ' ' + item.r + ' ' + item.x);
      return palavras.every(function (p) {
        return (SINONIMOS[p] || [p]).some(function (s) { return contem(alvo, s); });
      });
    }) : window.APAE_INDICE.slice();

    document.title = 'Resultados da pesquisa por “' + termo + '” – APAE Limeira';

    function resumo(item) {
      var texto = item.r || item.x;
      var palavrasTexto = texto.split(' ');
      return palavrasTexto.length > 55 ? palavrasTexto.slice(0, 55).join(' ') + '…' : texto;
    }

    var html;
    if (!achados.length) {
      // Achado 11: a busca vazia explica o que houve e oferece caminhos de saída.
      var sugestao = sugerirGrafia(palavras);
      var link = function (q) { return BASE + 'busca/?s=' + encodeURIComponent(q); };
      var POPULARES = ['Teste do Pezinho', 'doações', 'deficiência intelectual', 'eventos', 'Transparência'];
      var SECOES = [
        ['Doações', 'doacoes/'], ['Teste do Pezinho', 'teste-do-pezinho/'], ['Eventos', 'eventos/'],
        ['Programas', 'programas/'], ['Transparência', 'transparencia/'], ['Dúvidas frequentes', 'duvidas-frequentes/']
      ];
      html = '<section class="sem-resultados"><h1 class="busca__titulo">Nenhum resultado encontrado</h1>' +
        '<p class="sem-resultados__explica">' + (termo
          ? 'A busca por <strong>“' + esc(termo) + '”</strong> não encontrou nenhuma página ou publicação do site. Confira a grafia ou tente uma palavra mais curta ou mais geral.'
          : 'Digite uma palavra para buscar no site.') + '</p>' +
        (sugestao ? '<p class="sem-resultados__sugestao">Você quis dizer <a href="' + link(sugestao) + '">' + esc(sugestao) + '</a>?</p>' : '') +
        '<form class="busca__form" role="search" method="get" action="' + BASE + 'busca/">' +
        '<label for="s"><input type="text" value="' + esc(termo) + '" placeholder="Buscar…" name="s" id="s" aria-label="Buscar no site"></label>' +
        '<button type="submit" aria-label="Buscar"><svg class="icone" aria-hidden="true"><use href="#i-busca"></use></svg></button>' +
        '</form>' +
        '<div class="sem-resultados__caminhos">' +
          '<section><h2>Buscas mais comuns</h2><ul>' + POPULARES.map(function (q) {
            return '<li><a href="' + link(q) + '">' + esc(q) + '</a></li>';
          }).join('') + '</ul></section>' +
          '<section><h2>Seções mais procuradas</h2><ul>' + SECOES.map(function (s) {
            return '<li><a href="' + BASE + s[1] + '">' + s[0] + '</a></li>';
          }).join('') + '</ul></section>' +
          '<section><h2>Fale com a APAE</h2><ul>' +
            '<li><a href="tel:+551934041569">Telefone: (19) 3404-1569</a></li>' +
            '<li><a href="mailto:apae@apaelimeira.org.br">E-mail: apae@apaelimeira.org.br</a></li>' +
            '<li><a href="' + BASE + 'contato/">Página de contato e ouvidoria</a></li>' +
          '</ul></section>' +
        '</div></section>';
    } else {
      var inicio = (pagina - 1) * POR_PAGINA;
      html = '<h1 class="busca__titulo">Resultados da busca por: <span>' + esc(termo) + '</span></h1>' +
        (expandiu && pagina === 1 ? '<p class="busca__relacionados">Mostrando também resultados para termos relacionados: autismo, autista, TEA e transtorno do espectro autista.</p>' +
          '<section class="busca__tema" aria-labelledby="busca-tema-titulo"><h2 id="busca-tema-titulo">Conteúdo sobre o tema</h2><ul>' +
          TEMA_AUTISMO.map(function (t) {
            return '<li><a href="' + BASE + t[1] + '">' + t[0] + '</a><span>' + t[2] + '</span></li>';
          }).join('') + '</ul></section>' : '') +
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
            '<div class="resultado__leia"><a href="' + link + '">Leia mais<span class="visualmente-oculto">: ' + esc(item.t) + '</span></a></div>' +
            '</article>';
        }).join('');
      var nav = '';
      if (inicio + POR_PAGINA < achados.length) {
        nav += '<div><a href="?s=' + encodeURIComponent(termo) + '&pagina=' + (pagina + 1) + '">Publicações mais antigas</a></div>';
      } else { nav += '<div></div>'; }
      if (pagina > 1) {
        nav += '<div><a href="?s=' + encodeURIComponent(termo) + '&pagina=' + (pagina - 1) + '">Publicações mais recentes</a></div>';
      }
      html += '<nav class="busca__paginacao" aria-label="Páginas de resultados"><h2 class="visualmente-oculto">Navegação pelas páginas de resultados</h2>' + nav + '</nav>';
    }
    areaBusca.innerHTML = html;
    var campoTopo = document.querySelector('.busca-topo__campo');
    if (campoTopo) campoTopo.value = termo;
  }
})();
