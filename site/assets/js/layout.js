/*
 * Cabeçalho, rodapé e aviso de cookies comuns a todas as páginas.
 *
 * Cada página inclui este arquivo duas vezes: com data-parte="cabecalho" logo
 * após <body> e com data-parte="rodape" antes de fechar o <body>. O HTML é
 * inserido de forma síncrona no ponto do <script>, sem salto de layout.
 * Reproduz o cabeçalho e o rodapé do site em produção (Elementor Header &
 * Footer Builder), inclusive os links dos itens de menu com submenu.
 */
(function () {
  'use strict';

  var script = document.currentScript;
  var BASE = script.src.replace(/assets\/js\/layout\.js(\?.*)?$/, '');
  var parte = script.getAttribute('data-parte');

  function url(caminho) { return BASE + caminho; }

  // Ícones (Material Design Icons e Remix Icon, licença Apache 2.0)
  var SPRITE =
    '<svg xmlns="http://www.w3.org/2000/svg" style="display:none">' +
    '<symbol id="i-coracao" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></symbol>' +
    '<symbol id="i-email" viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></symbol>' +
    '<symbol id="i-telefone" viewBox="0 0 24 24"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></symbol>' +
    '<symbol id="i-busca" viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></symbol>' +
    '<symbol id="i-menu" viewBox="0 0 24 24"><path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/></symbol>' +
    '<symbol id="i-baixo" viewBox="0 0 24 24"><path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/></symbol>' +
    '<symbol id="i-seta" viewBox="0 0 24 24"><path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/></symbol>' +
    '<symbol id="i-esquerda" viewBox="0 0 24 24"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></symbol>' +
    '<symbol id="i-direita" viewBox="0 0 24 24"><path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z"/></symbol>' +
    '<symbol id="i-pessoa" viewBox="0 0 24 24"><path d="M12 6c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2m0 10c2.7 0 5.8 1.29 6 2H6c.23-.72 3.31-2 6-2m0-12C9.79 4 8 5.79 8 8s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 10c-2.67 0-8 1.34-8 4v3h16v-3c0-2.66-5.33-4-8-4z"/></symbol>' +
    '<symbol id="i-pasta" viewBox="0 0 24 24"><path d="M20 6h-8l-2-2H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 12H4V8h16v10z"/></symbol>' +
    '<symbol id="i-facebook" viewBox="0 0 24 24"><path d="M14 13.5h2.5l1-4H14v-2c0-1.03 0-2 2-2h1.5V2.14c-.326-.043-1.557-.14-2.857-.14C11.928 2 10 3.657 10 6.7v2.8H7v4h3V22h4v-8.5z"/></symbol>' +
    '<symbol id="i-instagram" viewBox="0 0 24 24"><path d="M12 2c2.717 0 3.056.01 4.122.06 1.065.05 1.79.217 2.428.465.66.254 1.216.598 1.772 1.153a4.908 4.908 0 0 1 1.153 1.772c.247.637.415 1.363.465 2.428.047 1.066.06 1.405.06 4.122 0 2.717-.01 3.056-.06 4.122-.05 1.065-.218 1.79-.465 2.428a4.883 4.883 0 0 1-1.153 1.772 4.915 4.915 0 0 1-1.772 1.153c-.637.247-1.363.415-2.428.465-1.066.047-1.405.06-4.122.06-2.717 0-3.056-.01-4.122-.06-1.065-.05-1.79-.218-2.428-.465a4.89 4.89 0 0 1-1.772-1.153 4.904 4.904 0 0 1-1.153-1.772c-.248-.637-.415-1.363-.465-2.428C2.013 15.056 2 14.717 2 12c0-2.717.01-3.056.06-4.122.05-1.066.217-1.79.465-2.428a4.88 4.88 0 0 1 1.153-1.772A4.897 4.897 0 0 1 5.45 2.525c.638-.248 1.362-.415 2.428-.465C8.944 2.013 9.283 2 12 2zm0 5a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm6.5-.25a1.25 1.25 0 0 0-2.5 0 1.25 1.25 0 0 0 2.5 0zM12 9a3 3 0 1 1 0 6 3 3 0 0 1 0-6z"/></symbol>' +
    '<symbol id="i-youtube" viewBox="0 0 24 24"><path d="M21.543 6.498C22 8.28 22 12 22 12s0 3.72-.457 5.502c-.254.985-.997 1.76-1.938 2.022C17.896 20 12 20 12 20s-5.893 0-7.605-.476c-.945-.266-1.687-1.04-1.938-2.022C2 15.72 2 12 2 12s0-3.72.457-5.502c.254-.985.997-1.76 1.938-2.022C6.107 4 12 4 12 4s5.896 0 7.605.476c.945.266 1.687 1.04 1.938 2.022zM10 15.5l6-3.5-6-3.5v7z"/></symbol>' +
    '</svg>';

  function icone(id) {
    return '<svg class="icone" aria-hidden="true"><use href="#i-' + id + '"></use></svg>';
  }

  var REDES = [
    ['Facebook', 'https://www.facebook.com/apaedelimeira', 'facebook'],
    ['Instagram', 'https://www.instagram.com/apaedelimeira/', 'instagram'],
    ['Youtube', 'https://www.youtube.com/@apaelimeira2365', 'youtube']
  ];

  function redes(classe) {
    return '<div class="' + classe + '">' + REDES.map(function (r) {
      return '<a class="rede" href="' + r[1] + '" target="_blank" rel="noopener">' + icone(r[2]) + '<span>' + r[0] + ' da APAE Limeira (abre em nova janela)</span></a>';
    }).join('') + '</div>';
  }

  // Achado 08: o telefone do topo e do rodapé é um link tel:.
  // Achado 09: telefone e endereço na grafia única do CLAUDE.md.
  // Menu principal. Achado 04: cada item com submenu abre a sua página de
  // seção e "Home" leva à página inicial; nenhum item usa mais href="#".
  var MENU = [
    ['Home', ''],
    ['Quem Somos', 'quem-somos/', [
      ['A Entidade', 'estrutura/'],
      ['A Diretoria', 'diretoria/'],
      ['Conselhos', 'conselho/'],
      ['Política de Qualidade', 'politica-de-qualidade/'],
      ['Parceiros', 'parceiros/'],
      ['Revista APAE Limeira 50 anos', 'revista-apae-limeira-50-anos/']
    ]],
    ['Programas', 'programas/', [
      ['Centro de Ações Preventivas', 'cap/'],
      ['Centro de Apoio Diagnóstico', 'cad/'],
      ['Centro de Atenção Terapêutica', 'cat/'],
      ['Escola de Educação Especial “João Ometto”', 'escola-de-educacao-especial-joao-ometto/'],
      ['Centro Profissionalizante e de Convivência', 'cpc/'],
      ['Inclusão no mercado de trabalho', 'inclusao-no-trabalho/']
    ]],
    ['Projetos', 'projetos/', [
      ['EquoterAPAE', 'equoterapia/'],
      ['APAE Esporte', 'apae-esporte/'],
      ['APAE Cultural', 'apae-cultural/'],
      ['Conexão Teen', 'conexao-teen/']
    ]],
    ['Serviços', 'servicos/', [
      ['Teste do Pezinho', 'teste-do-pezinho/'],
      ['Bazar e Estacionamento', 'bazar-e-estacionamento/'],
      ['Organização de Eventos', 'organizacao-de-eventos/'],
      ['Fábrica de Paletes', 'fabrica-de-paletes/']
    ]],
    ['Eventos', 'eventos/', [
      ['Da Prevenção á Inclusão: vencendo desafios', 'da-prevencao-a-inclusao/'],
      ['APAE Motor Rock', 'apae-motor-rock/'],
      ['APAE Running', 'apae-running-limeira/'],
      ['APAE Beach Tennis', 'apae-beach-tennis/'],
      ['Selo Empresa Cidadã', 'selo-empresa-cidada-2026/']
    ]],
    ['Transparência', 'transparencia/'],
    ['Contato/Ouvidoria', 'contato/']
  ];

  function menu() {
    return '<ul class="menu-principal__lista">' + MENU.map(function (item, i) {
      var sub = item[2];
      var idSub = 'submenu-' + i;
      return '<li class="menu-principal__item' + (sub ? ' tem-submenu' : '') + '">' +
        '<a class="menu-principal__link" href="' + url(item[1]) + '">' + item[0] +
        (sub ? '<span class="menu-principal__seta" aria-hidden="true">' + icone('baixo') + '</span>' : '') + '</a>' +
        // No celular, o submenu abre por um botão próprio; o link leva à página de seção.
        (sub ? '<button class="submenu-alternar" type="button" aria-expanded="false" aria-controls="' + idSub + '">' +
          icone('baixo') + '<span class="visualmente-oculto">Mostrar as páginas de ' + item[0] + '</span></button>' : '') +
        (sub ? '<ul class="submenu" id="' + idSub + '">' + sub.map(function (s) {
          return '<li><a href="' + url(s[1]) + '">' + s[0] + '</a></li>';
        }).join('') + '</ul>' : '') +
        '</li>';
    }).join('') + '</ul>';
  }

  function cabecalho() {
    return SPRITE +
      '<div class="barra-topo">' +
        '<div class="barra-topo__inner">' +
          '<div class="barra-topo__boasvindas">Seja bem-vindo a <strong>APAE Limeira!</strong></div>' +
          '<div class="barra-topo__direita">' +
            '<div class="barra-topo__contato">' + icone('email') + ' apae@apaelimeira.org.br &nbsp;| ' + '<a class="barra-topo__tel" href="tel:+551934041569">' + icone('telefone') + ' (19) 3404-1569</a></div>' +
            redes('barra-topo__redes') +
            '<a class="botao-doe-topo" href="' + url('doacoes/') + '" target="_blank">' + icone('coracao') +
              '<span class="botao-doe-topo__texto">Doe Agora</span></a>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<header class="cabecalho">' +
        '<div class="cabecalho__inner">' +
          '<div class="cabecalho__logo"><a href="' + url('') + '"><img src="' + url('storage/2025/05/logo-60-anos-sitetopo.png') + '" alt="APAE Limeira, 60 anos: página inicial"></a></div>' +
          '<div class="cabecalho__direita">' +
            '<form class="busca-topo" role="search" action="' + url('busca/') + '" method="get">' +
              '<input class="busca-topo__campo" type="search" name="s" title="Buscar no site" aria-label="Buscar no site" value="">' +
              '<span class="busca-topo__icone" aria-hidden="true">' + icone('busca') + '</span>' +
            '</form>' +
            '<nav class="menu-principal">' +
              '<button class="menu-principal__alternar" type="button" aria-label="Menu">' + icone('menu') + '</button>' +
              menu() +
            '</nav>' +
          '</div>' +
        '</div>' +
      '</header>';
  }

  function itemLista(texto, destino) {
    return '<li><a href="' + destino + '">' + icone('seta') + '<span>' + texto + '</span></a></li>';
  }

  function rodape() {
    return '<footer class="rodape">' +
        '<div class="rodape__inner">' +
          '<div class="rodape__col rodape__col--marca">' +
            '<div class="rodape__logo"><a href="' + url('') + '"><img src="' + url('storage/2025/05/logo-60-anos-siterodape.png') + '" alt="APAE Limeira, 60 anos: página inicial"></a></div>' +
            '<p class="rodape__endereco">Av. Antônio D&#39;Andréa, 364<br>Parque Nossa Senhora das Dores<br>Limeira/SP — CEP 13483-000</p>' +
            '<p class="rodape__email">apae@apaelimeira.org.br</p>' +
            '<p class="rodape__telefone"><a href="tel:+551934041569">(19) 3404-1569</a></p>' +
            '<a class="rodape__doe" href="' + url('doacoes/') + '">' + icone('coracao') + 'Doe Agora</a>' +
          '</div>' +
          '<div class="rodape__col rodape__col--menu">' +
            '<h2 class="rodape__titulo">Menu</h2>' +
            '<ul class="rodape__lista">' +
              itemLista('Home', url('')) +
              itemLista('A Entidade', url('estrutura/')) +
              itemLista('A Diretoria', url('diretoria/')) +
              itemLista('Conselhos', url('conselho/')) +
              itemLista('Política de Qualidade', url('politica-de-qualidade/')) +
              itemLista('Transparência', url('transparencia/')) +
              itemLista('Notícias', url('noticias/')) +
              itemLista('Contato', url('contato/')) +
            '</ul>' +
          '</div>' +
          '<div class="rodape__col rodape__col--redes">' +
            '<h2 class="rodape__titulo">Siga-nos</h2>' +
            redes('rodape__redes') +
            '<div class="rodape__uteis">' +
              '<h2 class="rodape__titulo">Links Úteis</h2>' +
              '<ul class="rodape__lista">' +
                itemLista('Dúvidas Frequentes (FAQ)', url('duvidas-frequentes/')) +
                itemLista('Sobre a Deficiência Intelectual', url('sobre-a-deficiencia-intelectual/')) +
                itemLista('Prevenção da Deficiência Intelectual', url('prevencao-da-deficiencia-intelectual/')) +
              '</ul>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</footer>' +
      '<div class="rodape-base">' +
        '<div class="rodape-base__inner">' +
          '<span>Copyright © 2026 <strong>APAE Limeira</strong> | Todos os direitos reservados.</span>' +
          '<a href="https://wmalaman.com.br/" target="_blank"><strong>WM</strong>alaman <img src="' + url('storage/2025/05/icon_wm.png') + '" alt=""></a>' +
        '</div>' +
      '</div>' +
      avisoCookies();
  }

  function avisoCookies() {
    var categorias = [
      ['Funcional', 'Os cookies funcionais ajudam a executar certas funcionalidades, como compartilhar o conteúdo do site em plataformas de mídia social, coletar feedbacks e outros recursos de terceiros.'],
      ['Desempenho', 'Os cookies de desempenho são usados para entender e analisar os principais índices de desempenho do site, o que ajuda a oferecer uma melhor experiência de usuário aos visitantes.'],
      ['Analíticos', 'Os cookies analíticos são usados para entender como os visitantes interagem com o site. Esses cookies ajudam a fornecer informações sobre métricas de número de visitantes, taxa de rejeição, origem de tráfego, etc.'],
      ['Propaganda', 'Os cookies de publicidade são usados para fornecer aos visitantes anúncios e campanhas de marketing relevantes. Esses cookies rastreiam os visitantes em sites e coletam informações para fornecer anúncios personalizados.'],
      ['Outros', 'Outros cookies não categorizados são aqueles que estão sendo analisados e ainda não foram classificados em uma categoria.']
    ];
    return '<div class="cookies" id="aviso-cookies" hidden>' +
        '<p class="cookies__texto">Nós utilizamos cookies para lembrar suas preferências e te fornecer a melhor experiência de navegação possível no nosso site. Ao clicar em "aceitar todos", você consente o uso de todos os cookies. Você também pode clicar em "Configurações de cookies" para alterar as configurações.</p>' +
        '<div class="cookies__acoes">' +
          '<button class="cookies__btn cookies__btn--config" type="button" data-cookies="config">Configurações de cookies</button>' +
          // Achado 19: recusar custa o mesmo clique que aceitar, com o mesmo peso visual
          '<button class="cookies__btn cookies__btn--escolha" type="button" data-cookies="recusar">Recusar não essenciais</button>' +
          '<button class="cookies__btn cookies__btn--escolha" type="button" data-cookies="aceitar">Aceitar todos</button>' +
        '</div>' +
      '</div>' +
      '<button class="cookies-reabrir" type="button" data-cookies="config" hidden>Gerenciar consentimento</button>' +
      '<div class="cookies-modal" id="modal-cookies" role="dialog" aria-labelledby="modal-cookies-titulo" hidden>' +
        '<div class="cookies-modal__caixa">' +
          '<button class="cookies-modal__fechar" type="button" data-cookies="fechar" aria-label="Fechar">×</button>' +
          '<h4 class="cookies-modal__titulo" id="modal-cookies-titulo">Visão geral de privacidade</h4>' +
          '<p>Este site usa cookies para melhorar a sua experiência enquanto navega pelo site. Destes, os cookies que são categorizados como necessários são armazenados no seu navegador, pois são essenciais para o funcionamento das funcionalidades básicas do site. Também usamos cookies de terceiros que nos ajudam a analisar e entender como você usa este site. Esses cookies serão armazenados em seu navegador apenas com o seu consentimento. Você também tem a opção de cancelar esses cookies. Porém, a desativação de alguns desses cookies pode afetar sua experiência de navegação.</p>' +
          '<details class="cookies-modal__categoria"><summary>Necessários <span class="cookies-modal__sempre">Sempre ativado</span></summary>' +
            '<p>Os cookies necessários são absolutamente essenciais para o bom funcionamento do site. Esses cookies garantem funcionalidades básicas e recursos de segurança do site, anonimamente.</p></details>' +
          categorias.map(function (c) {
            return '<details class="cookies-modal__categoria"><summary>' + c[0] +
              ' <input type="checkbox" data-categoria="' + c[0].toLowerCase() + '" checked></summary><p>' + c[1] + '</p></details>';
          }).join('') +
          '<div class="cookies-modal__rodape">' +
            '<button class="cookies-modal__salvar" type="button" data-cookies="salvar">SALVAR E ACEITAR</button>' +
            '<small>Desenvolvido por CookieYes</small>' +
          '</div>' +
        '</div>' +
      '</div>';
  }

  script.insertAdjacentHTML('beforebegin', parte === 'rodape' ? rodape() : cabecalho());
  window.APAE_BASE = BASE;
})();
