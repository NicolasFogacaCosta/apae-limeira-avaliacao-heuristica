"""Reconstrução estática do site www.apaelimeira.org.br.

Gera em `site/` uma cópia navegável do site em produção (estado de 26/10/2026),
a partir da API REST pública do WordPress e dos CSS do Elementor de cada página.

A cópia reproduz o site como ele é, inclusive os problemas apontados em
ACHADOS.md: as correções são feitas depois, um commit por achado. Este script
só serve para gerar a base; depois do commit inicial, os arquivos de `site/`
são editados diretamente.

Uso:  python ferramentas/reconstrucao/reconstruir.py
"""

import glob
import html
import json
import os
import re
import sys
import urllib.parse
import urllib.request
from html.parser import HTMLParser

RAIZ = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
SITE = os.path.join(RAIZ, 'site')
CACHE = os.path.join(os.path.dirname(os.path.abspath(__file__)), '.cache')
ORIGEM = 'https://www.apaelimeira.org.br'
UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/130 Safari/537.36'

# Páginas alcançáveis pela navegação: as imagens delas são baixadas para o
# repositório. As demais (subpáginas da Transparência, publicações antigas)
# continuam apontando para as imagens do site em produção.
PAGINAS_MENU = [
    'estrutura', 'diretoria', 'conselho', 'politica-de-qualidade', 'parceiros',
    'revista-apae-limeira-50-anos', 'cap', 'cad', 'cat',
    'escola-de-educacao-especial-joao-ometto', 'cpc', 'equoterapia',
    'apae-esporte', 'apae-cultural', 'conexao-teen', 'teste-do-pezinho',
    'bazar-e-estacionamento', 'organizacao-de-eventos', 'fabrica-de-paletes',
    'da-prevencao-a-inclusao', 'apae-motor-rock', 'apae-running-limeira',
    'apae-beach-tennis', 'transparencia', 'contato', 'doacoes',
    'duvidas-frequentes', 'sobre-a-deficiencia-intelectual',
    'prevencao-da-deficiencia-intelectual',
]
# Páginas internas do WordPress que não fazem parte do site público.
IGNORAR = {'home', 'home-2025', 'pagina-exemplo', 'pagina-exemplo-2'}

MESES = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho',
         'agosto', 'setembro', 'outubro', 'novembro', 'dezembro']

# Imagens fixas do layout e da home (baixadas sempre).
IMAGENS_FIXAS = [
    '/storage/2025/05/logo-60-anos-sitetopo.png',
    '/storage/2025/05/logo-60-anos-siterodape.png',
    '/storage/2025/05/icon_wm.png',
    '/wp-content/uploads/2025/05/bg_doe.jpg',
    '/wp-content/uploads/2025/05/bg_rodape.jpg',
    '/storage/2026/06/Banner-SIte.png',
    '/storage/2026/04/banner_site_60anos.jpg',
    '/storage/2026/10/banner-site-selo.jpg',
    '/storage/2025/05/servico01.png',
    '/storage/2025/05/servico03.png',
    '/storage/2025/05/servico04.png',
    '/storage/2026/09/paletes.png',
    '/wp-content/uploads/2025/05/evento01.png',
    '/wp-content/uploads/2025/05/evento02.png',
    '/wp-content/uploads/2025/05/evento03.png',
    '/wp-content/uploads/2025/05/evento04.png',
] + ['/storage/2025/05/programa0%d.png' % i for i in (6, 7, 2, 3, 4, 5)]


# --------------------------------------------------------------------------
# Download e cache

def baixar(url, destino=None):
    req = urllib.request.Request(url, headers={'User-Agent': UA})
    with urllib.request.urlopen(req, timeout=60) as r:
        dados = r.read()
    if destino:
        os.makedirs(os.path.dirname(destino), exist_ok=True)
        with open(destino, 'wb') as f:
            f.write(dados)
    return dados


def api(tipo):
    """Todas as páginas ou publicações, do cache ou da API REST."""
    itens = []
    for n in range(1, 10):
        arq = os.path.join(CACHE, '%s%d.json' % (tipo, n))
        if not os.path.exists(arq):
            extra = '&_embed=wp:featuredmedia' if tipo == 'posts' else ''
            try:
                baixar('%s/wp-json/wp/v2/%s?per_page=100&page=%d%s' % (ORIGEM, tipo, n, extra), arq)
            except Exception:
                break
        lote = json.load(open(arq, encoding='utf-8'))
        if not lote:
            break
        itens += lote
    return itens


def css_elementor(post_id):
    arq = os.path.join(CACHE, 'post-%s.css' % post_id)
    if not os.path.exists(arq):
        try:
            baixar('%s/storage/elementor/css/post-%s.css' % (ORIGEM, post_id), arq)
        except Exception:
            open(arq, 'w').close()
    return open(arq, encoding='utf-8', errors='replace').read()


def caminho_local(url):
    """URL de imagem do site -> caminho dentro de site/ (espelha a URL)."""
    p = urllib.parse.urlparse(url)
    return urllib.parse.unquote(p.path).lstrip('/')


IMAGENS_BAIXADAS = set()


def garantir_imagem(url):
    rel = caminho_local(url)
    destino = os.path.join(SITE, rel)
    if not os.path.exists(destino):
        try:
            baixar(urllib.parse.urljoin(ORIGEM, urllib.parse.quote(urllib.parse.urlparse(url).path)), destino)
        except Exception as e:
            print('  ! falha ao baixar', url, e)
            return None
    IMAGENS_BAIXADAS.add(rel)
    return rel


# --------------------------------------------------------------------------
# Conversão do HTML do WordPress/Elementor em HTML limpo

ATRIBUTOS = {
    'a': {'href', 'target', 'title', 'rel'},
    'img': {'src', 'alt', 'width', 'height', 'title'},
    'iframe': {'src', 'width', 'height', 'title', 'allowfullscreen', 'frameborder', 'allow'},
    'td': {'colspan', 'rowspan'}, 'th': {'colspan', 'rowspan'},
    'ol': {'start', 'type'},
    'form': {'action', 'method'},
    'input': {'type', 'name', 'value', 'placeholder', 'size', 'maxlength', 'aria-required', 'autocomplete'},
    'textarea': {'name', 'cols', 'rows', 'maxlength', 'aria-required'},
    'select': {'name', 'aria-required'}, 'option': {'value'},
    'video': {'src', 'controls', 'width', 'height', 'poster'}, 'source': {'src', 'type'},
}
MANTER = {'p', 'br', 'hr', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'a', 'img',
          'strong', 'b', 'em', 'i', 'u', 's', 'sub', 'sup', 'small', 'blockquote',
          'table', 'thead', 'tbody', 'tfoot', 'tr', 'td', 'th', 'caption', 'iframe',
          'figure', 'figcaption', 'form', 'label', 'input', 'textarea', 'select', 'option',
          'video', 'source', 'pre', 'code', 'dl', 'dt', 'dd'}
DESCARTAR = {'script', 'style', 'svg', 'noscript', 'button', 'link', 'meta'}
VAZIOS = {'br', 'hr', 'img', 'input', 'source'}
ESTILOS = {'color', 'text-decoration', 'text-align', 'font-weight', 'font-style', 'background-color'}


class Limpador(HTMLParser):
    def __init__(self, reescrever_url):
        super().__init__(convert_charrefs=False)
        self.saida = []
        self.pilha = []          # (tag, emitida)
        self.descartando = 0
        self.url = reescrever_url

    def _estilo(self, valor):
        partes = []
        for decl in (valor or '').split(';'):
            if ':' in decl:
                k, v = decl.split(':', 1)
                if k.strip().lower() in ESTILOS:
                    partes.append('%s: %s' % (k.strip().lower(), v.strip()))
        return '; '.join(partes)

    def _classe_elementor(self, classes, dados):
        """Mantém a estrutura de colunas do Elementor com classes curtas."""
        c = classes.split()
        el_id = next((x[len('elementor-element-'):] for x in c
                      if x.startswith('elementor-element-') and len(x) > 18), None)
        extra = ' el-%s' % el_id if el_id else ''
        if 'elementor-section' in c or 'e-con' in c:
            return 'el-secao' + extra
        if 'elementor-container' in c:
            return 'el-container'
        if 'elementor-column' in c:
            col = next((x for x in c if re.match(r'elementor-col-\d+$', x)), 'elementor-col-100')
            return 'el-col el-col-%s%s' % (col.split('-')[-1], extra)
        if 'elementor-widget' in c:
            tipo = next((x[len('elementor-widget-'):] for x in c
                         if x.startswith('elementor-widget-') and x != 'elementor-widget-container'), 'x')
            alin = next((' el-alinha-' + x.split('-')[-1] for x in c
                         if re.match(r'elementor-align-(center|left|right|justify)$', x)), '')
            return 'el-w el-w-%s%s%s' % (tipo, alin, extra)
        if 'elementor-divider' in c:
            return 'el-divisor'
        return None

    def handle_starttag(self, tag, attrs, fechada=False):
        if self.descartando:
            if tag not in VAZIOS and not fechada:
                self.descartando += 1
            return
        a = dict(attrs)
        classes = a.get('class') or ''
        if tag in DESCARTAR or (tag == 'i' and re.search(r'\b(fa[sbr]?|eicon|fa-[\w-]+)\b', classes)) \
                or (tag == 'div' and 'wpcf7-response-output' in classes) \
                or (a.get('style') or '').replace(' ', '').find('display:none') >= 0 and tag in ('div', 'span'):
            if tag not in VAZIOS and not fechada:
                self.descartando = 1
            return
        if tag in ('div', 'section', 'span', 'article', 'header', 'footer', 'center', 'font', 'aside', 'nav'):
            cls = self._classe_elementor(classes, a) if tag in ('div', 'section') else None
            if cls is None and tag == 'span' and 'elementor-button-text' in classes:
                cls = None
            if cls:
                self.saida.append('<div class="%s">' % cls)
                self.pilha.append((tag, True))
            else:
                self.pilha.append((tag, False))
            return
        if tag not in MANTER:
            if tag not in VAZIOS and not fechada:
                self.pilha.append((tag, False))
            return
        if tag == 'input' and a.get('type') == 'hidden':
            return
        partes = [tag]
        if tag == 'form':
            # Contact Form 7: sem servidor, o envio é simulado por principal.js
            # com as mesmas mensagens e o mesmo momento de validação do plugin.
            self.saida.append('<form action="#" method="post" novalidate data-formulario-contato>')
            self.pilha.append((tag, True))
            return
        for k, v in attrs:
            if k in ATRIBUTOS.get(tag, ()):
                if k in ('href', 'src') and v:
                    v = self.url(v, tag)
                partes.append('%s="%s"' % (k, html.escape(v, quote=True)) if v is not None else k)
            elif k == 'data-src' and tag == 'img' and not a.get('src', '').startswith('http'):
                partes.append('src="%s"' % html.escape(self.url(v, tag)))
        if tag == 'img' and 'alt' not in a:
            pass  # o site em produção tem imagens sem alt; mantido como está
        estilo = self._estilo(a.get('style'))
        if estilo:
            partes.append('style="%s"' % html.escape(estilo))
        if tag == 'a' and 'elementor-button' in classes:
            partes.append('class="botao"')
        if tag == 'img':
            alin = re.search(r'\b(aligncenter|alignleft|alignright)\b', classes)
            if alin:
                partes.append('class="%s"' % alin.group(1))
        if tag in ('h1', 'h2', 'h3', 'h4', 'h5', 'h6') and 'elementor-heading-title' in classes:
            partes.append('class="el-titulo"')
        self.saida.append('<%s>' % ' '.join(partes))
        if tag not in VAZIOS and not fechada:
            self.pilha.append((tag, True))

    def handle_startendtag(self, tag, attrs):
        self.handle_starttag(tag, attrs, fechada=True)

    def handle_endtag(self, tag):
        if self.descartando:
            if tag not in VAZIOS:
                self.descartando -= 1
            return
        if tag in VAZIOS:
            return
        # fecha até a tag correspondente
        for i in range(len(self.pilha) - 1, -1, -1):
            if self.pilha[i][0] == tag:
                for t, emitida in reversed(self.pilha[i:]):
                    if emitida:
                        self.saida.append('</div>' if t in ('div', 'section') else '</%s>' % t)
                del self.pilha[i:]
                return

    def handle_data(self, d):
        if not self.descartando:
            self.saida.append(d)

    def handle_entityref(self, n):
        if not self.descartando:
            self.saida.append('&%s;' % n)

    def handle_charref(self, n):
        if not self.descartando:
            self.saida.append('&#%s;' % n)

    def resultado(self):
        for t, emitida in reversed(self.pilha):
            if emitida:
                self.saida.append('</div>' if t in ('div', 'section') else '</%s>' % t)
        s = ''.join(self.saida)
        s = re.sub(r'[ \t]*\n\s*\n+', '\n', s)
        s = re.sub(r'<div class="el-container">\s*</div>', '', s)
        return s.strip()


def fabrica_url(profundidade, slugs, baixar_imagens):
    prefixo = '../' * profundidade

    def reescrever(url, tag):
        url = html.unescape(url).strip()
        if url.startswith('//'):
            url = 'https:' + url
        p = urllib.parse.urlparse(url)
        do_site = p.netloc in ('www.apaelimeira.org.br', 'apaelimeira.org.br') or (not p.netloc and url.startswith('/'))
        if not do_site:
            return url
        caminho = p.path or '/'
        if '/wp-json/' in caminho:
            # paginação gerada pela própria API ao renderizar o conteúdo; aponta para a página atual
            return '#'
        eh_imagem = re.search(r'\.(png|jpe?g|gif|webp|svg)$', caminho, re.I)
        if tag == 'img' or (tag == 'a' and eh_imagem):
            if baixar_imagens and eh_imagem:
                rel = garantir_imagem(url)
                if rel:
                    return prefixo + urllib.parse.quote(rel)
            return ORIGEM + caminho
        if tag == 'iframe':
            return ORIGEM + caminho + ('?' + p.query if p.query else '')
        partes = [x for x in caminho.split('/') if x]
        if not partes:
            return prefixo or './'
        slug = partes[-1] if len(partes) == 1 else None
        if slug and slug in slugs:
            return prefixo + slug + '/' + ('#' + p.fragment if p.fragment else '')
        # arquivos, páginas de autor/categoria e endereços que não existem na cópia
        return ORIGEM + caminho + ('?' + p.query if p.query else '')
    return reescrever


def limpar(conteudo, profundidade, slugs, baixar_imagens):
    lim = Limpador(fabrica_url(profundidade, slugs, baixar_imagens))
    lim.feed(conteudo)
    lim.close()
    return lim.resultado()


def css_da_pagina(post_id):
    """Converte o CSS do Elementor da página em regras sobre as classes curtas."""
    css = css_elementor(post_id)
    css = re.sub(r'@media[^{]*\{(?:[^{}]*\{[^{}]*\})*[^{}]*\}', '', css)
    props_ok = {'text-align', 'color', 'font-family', 'font-size', 'font-weight', 'line-height',
                'text-transform', 'background-color', 'border-radius', 'padding', 'font-style',
                'letter-spacing', 'border-color', 'border-top-color', 'width', 'max-width', 'margin'}
    regras = []
    for sel, corpo in re.findall(r'([^{}]+)\{([^{}]*)\}', css):
        m = re.search(r'\.elementor-element-([0-9a-f]{6,8})\b(.*)$', sel.split(',')[0].strip())
        if not m:
            continue
        el, resto = m.group(1), m.group(2)
        decl = []
        for d in corpo.split(';'):
            if ':' not in d:
                continue
            k, v = [x.strip() for x in d.split(':', 1)]
            if k in props_ok and 'var(' not in v:
                if k in ('width', 'max-width', 'margin') and 'divider' not in resto:
                    continue
                decl.append('%s:%s' % (k, v.replace('Sans-serif', 'sans-serif')))
        if not decl:
            continue
        if '.elementor-button' in resto:
            alvo = '.el-%s .botao' % el
        elif 'heading-title' in resto:
            alvo = '.el-%s .el-titulo' % el
        elif 'divider-separator' in resto:
            alvo = '.el-%s .el-divisor' % el
        elif '> .elementor-container' in resto or '> .elementor-widget-wrap' in resto or 'motion-effects' in resto:
            continue
        elif resto.strip() in ('', '.elementor-widget-text-editor', '> .elementor-widget-container'):
            alvo = '.el-%s' % el
        elif re.search(r'\s(p|a|h\d|li|strong)\b', resto):
            alvo = '.el-%s %s' % (el, resto.strip().split()[-1])
        else:
            continue
        regras.append('%s{%s}' % (alvo, ';'.join(decl)))
    return '\n'.join(regras)


# --------------------------------------------------------------------------
# Modelos de página

def documento(titulo, corpo, profundidade, classe_body='', estilo_extra='', descricao=''):
    p = '../' * profundidade
    estilo = '\n<style>\n%s\n</style>' % estilo_extra if estilo_extra else ''
    return f'''<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{titulo}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Engagement&family=Montserrat:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,400&family=Open+Sans:ital,wght@0,400;0,600;0,700;1,400&family=Roboto:wght@400;500;700&family=Rubik:wght@300;400&family=Sansita:wght@400;700&display=swap">
<link rel="stylesheet" href="{p}assets/css/estilo.css">{estilo}
</head>
<body class="{classe_body}">
<script src="{p}assets/js/layout.js" data-parte="cabecalho"></script>
{corpo}
<script src="{p}assets/js/layout.js" data-parte="rodape"></script>
<script src="{p}assets/js/principal.js"></script>
</body>
</html>
'''


COMPARTILHE = '''<section class="compartilhe">
  <div class="container compartilhe__inner">
    <h2 class="compartilhe__titulo">Compartilhe:</h2>
    <div class="compartilhe__botoes" data-compartilhar>
      <a class="compartilhe__btn compartilhe__btn--facebook" data-rede="facebook" role="button" tabindex="0">Facebook</a>
      <a class="compartilhe__btn compartilhe__btn--whatsapp" data-rede="whatsapp" role="button" tabindex="0">WhatsApp</a>
      <a class="compartilhe__btn compartilhe__btn--twitter" data-rede="twitter" role="button" tabindex="0">Twitter</a>
      <a class="compartilhe__btn compartilhe__btn--pinterest" data-rede="pinterest" role="button" tabindex="0">Pinterest</a>
      <a class="compartilhe__btn compartilhe__btn--linkedin" data-rede="linkedin" role="button" tabindex="0">LinkedIn</a>
    </div>
  </div>
</section>'''


def pagina_html(pg, slugs, baixar_imagens):
    titulo = pg['title']['rendered']
    conteudo = limpar(pg['content']['rendered'], 1, slugs, baixar_imagens)
    estilo = css_da_pagina(pg['id']) if 'elementor' in pg['content']['rendered'][:300] else ''
    corpo = f'''<main id="conteudo" class="pagina">
  <header class="pagina__topo">
    <h1 class="pagina__titulo">{titulo}</h1>
    <div class="pagina__divisor"></div>
  </header>
  <div class="container pagina__conteudo">
{conteudo}
  </div>
</main>
{COMPARTILHE}'''
    return documento('%s – APAE Limeira' % html.unescape(titulo), corpo, 1,
                     'pagina-interna pagina-%s' % pg['slug'], estilo)


def data_br(iso):
    a, m, d = iso[:10].split('-')
    return '%s/%s/%s' % (d, m, a)


def data_extenso(iso):
    a, m, d = iso[:10].split('-')
    return '%d de %s de %s' % (int(d), MESES[int(m) - 1], a)


def imagem_destacada(post):
    try:
        return post['_embedded']['wp:featuredmedia'][0]['source_url']
    except (KeyError, IndexError, TypeError):
        return None


def post_html(post, slugs, recentes):
    titulo = post['title']['rendered']
    conteudo = limpar(post['content']['rendered'], 1, slugs, False)
    cards = []
    for r in recentes:
        img = imagem_destacada(r)
        thumb = f'<a class="outras__thumb" href="../{r["slug"]}/" tabindex="-1"><img src="{img}" alt="" loading="lazy"></a>' if img else ''
        cards.append(f'''      <article class="outras__item">
        {thumb}
        <h3 class="outras__titulo"><a href="../{r["slug"]}/">{r["title"]["rendered"]}</a></h3>
        <span class="outras__data">{data_extenso(r["date"])}</span>
      </article>''')
    corpo = f'''<main id="conteudo" class="publicacao">
  <div class="container publicacao__inner">
    <time class="publicacao__data" datetime="{post["date"][:10]}">{data_br(post["date"])}</time>
    <h1 class="publicacao__titulo">{titulo}</h1>
    <div class="publicacao__conteudo">
{conteudo}
    </div>
  </div>
</main>
{COMPARTILHE}
<section class="outras">
  <div class="container">
    <h2 class="outras__cabecalho">Outras notícias</h2>
    <div class="outras__grade">
{chr(10).join(cards)}
    </div>
  </div>
</section>'''
    return documento('%s – APAE Limeira' % html.unescape(titulo), corpo, 1, 'publicacao-interna')


def texto_puro(h):
    h = re.sub(r'<(script|style)[^>]*>.*?</\1>', ' ', h, flags=re.S)
    h = re.sub(r'<[^>]+>', ' ', h)
    return re.sub(r'\s+', ' ', html.unescape(h)).strip()


# --------------------------------------------------------------------------

def main():
    sys.stdout.reconfigure(encoding='utf-8')
    os.makedirs(SITE, exist_ok=True)
    paginas = [p for p in api('pages') if p['slug'] not in IGNORAR]
    posts = api('posts')
    categorias = {c['id']: c['name'] for c in json.load(open(os.path.join(CACHE, 'cats.json'), encoding='utf-8'))}
    slugs = {p['slug'] for p in paginas} | {p['slug'] for p in posts}
    print('páginas: %d  publicações: %d' % (len(paginas), len(posts)))

    for img in IMAGENS_FIXAS:
        garantir_imagem(ORIGEM + img)

    for pg in paginas:
        destino = os.path.join(SITE, pg['slug'], 'index.html')
        os.makedirs(os.path.dirname(destino), exist_ok=True)
        with open(destino, 'w', encoding='utf-8', newline='\n') as f:
            f.write(pagina_html(pg, slugs, pg['slug'] in PAGINAS_MENU))

    # Quando uma página e uma publicação têm o mesmo slug, o WordPress abre a página.
    slugs_paginas = {p['slug'] for p in paginas}
    posts.sort(key=lambda p: p['date'], reverse=True)
    recentes = posts[:6]
    for post in posts:
        if post['slug'] in slugs_paginas:
            continue
        destino = os.path.join(SITE, post['slug'], 'index.html')
        os.makedirs(os.path.dirname(destino), exist_ok=True)
        with open(destino, 'w', encoding='utf-8', newline='\n') as f:
            f.write(post_html(post, slugs, recentes))

    # Índice da busca: o WordPress procura o termo no título, no resumo e no conteúdo
    # de páginas e publicações e ordena por data, da mais recente para a mais antiga.
    indice = []
    for item in posts + paginas:
        eh_post = item['type'] == 'post'
        cats = [categorias.get(c, '') for c in item.get('categories', [])] if eh_post else []
        indice.append({
            'u': item['slug'] + '/',
            't': html.unescape(item['title']['rendered']),
            'd': item['date'][:10],
            'p': 1 if eh_post else 0,
            'c': cats,
            'r': texto_puro(item['excerpt']['rendered'])[:400] if item.get('excerpt') else '',
            'x': texto_puro(item['content']['rendered'])[:6000],
            'i': imagem_destacada(item) if eh_post else None,
        })
    indice.sort(key=lambda x: x['d'], reverse=True)
    os.makedirs(os.path.join(SITE, 'assets', 'js'), exist_ok=True)
    with open(os.path.join(SITE, 'assets', 'js', 'busca-indice.js'), 'w', encoding='utf-8', newline='\n') as f:
        f.write('/* Gerado por ferramentas/reconstrucao/reconstruir.py */\nwindow.APAE_INDICE = ')
        json.dump(indice, f, ensure_ascii=False, separators=(',', ':'))
        f.write(';\n')

    print('imagens locais: %d' % len(IMAGENS_BAIXADAS))


if __name__ == '__main__':
    main()
