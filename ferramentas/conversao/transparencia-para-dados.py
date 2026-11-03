"""Converte as páginas da Transparência em dados.

A Transparência do site original é uma árvore de até cinco níveis de páginas
(tema > ano > área > programa > documentos). Este script percorre essa árvore
a partir de src/transparencia/, junta os documentos de todas as páginas em
src/_data/transparencia/documentos.json e grava, para cada página antiga, o
endereço da nova lista filtrada (redirecionamentos.json). As páginas que
nenhum link alcança, mas que seguem o padrão de nome dos termos e das
prestações de contas, também entram, com tema, ano e área tirados do nome.

Uso único na etapa 3 da reorganização; fica no repositório para registrar
como os dados foram gerados. Ao final, as páginas antigas são apagadas de src/.

    python ferramentas/conversao/transparencia-para-dados.py
"""
import html
import json
import os
import re
import shutil

RAIZ = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
SRC = os.path.join(RAIZ, 'src')
DADOS = os.path.join(SRC, '_data', 'transparencia')

# Temas, na ordem da página da Transparência (achado 14): página de origem,
# identificador usado nos filtros e nome curto para o seletor.
TEMAS = [
    ('utilidade-publica-ano', 'utilidade-publica', 'Utilidade pública'),
    ('declaracoes', 'declaracoes', 'Declarações e certidões'),
    ('regulamentos-2', 'regulamentos', 'Regulamentos'),
    ('legislacao-transparencia', 'legislacao', 'Legislação'),
    ('balanco-relatorio-auditores-externos-ano', 'balancos', 'Balanços e auditoria'),
    ('prestacoes-de-contas-anuais-ano', 'prestacoes-de-contas', 'Prestações de contas'),
    ('lei-12-527-2011-despesa-com-pessoal-ano', 'despesa-com-pessoal', 'Despesa com pessoal'),
    ('relacao-de-funcionarios-utilizados-na-despesa-com-pessoal-ano', 'relacao-de-funcionarios', 'Relação de funcionários'),
    ('termos-e-planos-de-trabalho', 'termos-e-planos', 'Termos e planos de trabalho'),
    ('aditamento-ao-termo-de-colaboracao-10_2020-covid', 'aditamento-covid', 'Aditamento COVID-19'),
]

# Páginas fora da árvore que seguem o padrão de nome de um tema
ORFAS = [
    (re.compile(r'^termos-e-planos-de-trabalho-'), 'termos-e-planos'),
    (re.compile(r'^termo-de-colaboracao-\d'), 'termos-e-planos'),
    (re.compile(r'^prestacoes-de-contas-anuais-'), 'prestacoes-de-contas'),
]

AREAS = {
    'assistencia social': 'Assistência social', 'a.s.': 'Assistência social', 'as': 'Assistência social',
    'saude': 'Saúde', 'educacao': 'Educação', 'cultura': 'Cultura', 'cultural': 'Cultura',
    'esporte': 'Esporte', 'esportes': 'Esporte',
}

SIGLAS = {
    'ANDE', 'APAE', 'AVCB', 'CAD', 'CEBAS', 'CLI', 'CMDCA', 'CND', 'CNEAS', 'CNES', 'CNPJ', 'COVID',
    'CREMESP', 'CRCE', 'DECA', 'DOU', 'DRE', 'FEAPAES', 'FGTS', 'II', 'III', 'INSS', 'ISO', 'ITCMD',
    'IV', 'LPIE', 'PDDE', 'PRC', 'PRG', 'PRONAC', 'PRONAS', 'PSE', 'SCFV', 'SEDUC', 'SEE', 'SIGTV', 'SP',
}

# Rótulos com letra faltando no site original
CORRECOES = {'Abri': 'Abril'}

FONTES = {
    'drive.google.com': 'Google Drive',
    'versalic.cultura.gov.br': 'Salic, do Ministério da Cultura',
    'www.imprensaoficial.com.br': 'Diário Oficial do Estado',
    'www.in.gov.br': 'Diário Oficial da União',
    'pesquisa.in.gov.br': 'Diário Oficial da União',
    'www.planalto.gov.br': 'Portal da Legislação, do Planalto',
}


def sem_acento(t):
    return (t.lower().replace('á', 'a').replace('ã', 'a').replace('â', 'a').replace('à', 'a')
            .replace('é', 'e').replace('ê', 'e').replace('í', 'i').replace('ó', 'o').replace('õ', 'o')
            .replace('ô', 'o').replace('ú', 'u').replace('ç', 'c'))


def texto(trecho):
    """Texto de um link: as tags internas saem sem deixar espaço (há palavras partidas em <span>)."""
    t = html.unescape(re.sub(r'<[^>]+>', '', trecho))
    return re.sub(r'\s+', ' ', t).strip(' –-')


def frase(t):
    """Texto em maiúsculas (ou quase todo) vira frase, preservando as siglas."""
    letras = [c for c in t if c.isalpha() and c not in 'ºª']
    if not letras:
        return t
    if sum(c.isupper() for c in letras) < len(letras) / 2:
        return t[:1].upper() + t[1:]
    palavras = re.split(r'(\s+|[–/-])', t.lower())
    saida = []
    for p in palavras:
        base = re.sub(r'[^\wÀ-ÿ]', '', p).upper()
        saida.append(p.upper() if base in SIGLAS else p)
    resultado = ''.join(saida)
    return resultado[:1].upper() + resultado[1:]


def principal(slug):
    with open(os.path.join(SRC, slug, 'index.html'), encoding='utf-8') as f:
        h = f.read()
    return re.search(r'<main.*?</main>', h, re.S).group(0)


def links(trecho):
    return [(u, texto(t)) for u, t in re.findall(r'<a[^>]*href="([^"]+)"[^>]*>(.*?)</a>', trecho, re.S)]


def existe(slug):
    return bool(slug) and os.path.exists(os.path.join(SRC, slug, 'index.html'))


def caminho_pelo_nome(slug):
    """Rótulos (ano, área, programa) tirados do nome de uma página fora da árvore."""
    m = re.search(r'(\d{4})', slug)
    ano = m.group(1) if m else None
    resto = slug[m.end():].strip('-') if m else ''
    rotulos = [ano] if ano else []
    if slug.startswith('termo-de-colaboracao-'):
        n = re.match(r'termo-de-colaboracao-(\d+)-(\d{4})', slug)
        return [n.group(2), f'Termo de colaboração {n.group(1)}/{n.group(2)}']
    partes = resto.split('-') if resto else []
    if partes and partes[0] in AREAS:
        rotulos.append(AREAS[partes.pop(0)])
    if partes and partes[0].upper() in SIGLAS:
        rotulos.append(partes.pop(0).upper())
    if partes:
        # "termo-12-2018" vira "Termo 12-2018"
        rotulos.append(re.sub(r'(\d) (\d)', r'\1-\2', ' '.join(partes)).capitalize())
    return rotulos


def campos(rotulos):
    ano, area, detalhe = None, None, []
    for r in rotulos:
        if re.fullmatch(r'\d{4}', r):
            ano = int(r)
        elif sem_acento(r) in AREAS:
            area = AREAS[sem_acento(r)]
        elif r:
            detalhe.append(frase(r))
    return ano, area, detalhe


def main():
    # Percurso em largura a partir dos temas, guardando os rótulos do caminho
    fila, visitadas, paginas = [], set(), {}
    for origem, tema, _ in TEMAS:
        fila.append((origem, tema, []))
        visitadas.add(origem)

    def percorrer():
        while fila:
            slug, tema, rotulos = fila.pop(0)
            trecho = principal(slug)
            docs = []
            for u, t in links(trecho):
                if u.startswith('../'):
                    filho = u[3:].strip('/')
                    if existe(filho) and filho not in visitadas and filho != 'transparencia':
                        visitadas.add(filho)
                        fila.append((filho, tema, rotulos + [t]))
                elif u.startswith('http'):
                    docs.append((u, t))
            paginas[slug] = {'tema': tema, 'rotulos': rotulos, 'docs': docs,
                             'titulo': texto(re.search(r'<h1[^>]*>(.*?)</h1>', trecho, re.S).group(1))}

    percorrer()
    for slug in sorted(os.listdir(SRC)):
        if slug in visitadas or not existe(slug):
            continue
        for padrao, tema in ORFAS:
            if padrao.match(slug):
                visitadas.add(slug)
                fila.append((slug, tema, caminho_pelo_nome(slug)))
                break
    percorrer()

    documentos, vistos = [], set()
    for slug, p in paginas.items():
        ano, area, detalhe = campos(p['rotulos'])
        if ano is None:
            m = re.search(r'(20\d{2})', slug)
            ano = int(m.group(1)) if m else None
        for u, t in p['docs']:
            # O mesmo arquivo pode aparecer em anos ou áreas diferentes; só se
            # repete à toa dentro do mesmo grupo
            chave = (p['tema'], ano, area, tuple(detalhe), u)
            if chave in vistos:
                continue
            vistos.add(chave)
            dominio = re.match(r'https?://([^/]+)', u).group(1)
            if dominio == 'dev.triader.com.br':
                continue  # imagens do site de desenvolvimento antigo, fora do ar
            titulo = frase(t) or (detalhe[-1] if detalhe else frase(p['titulo']))
            titulo = CORRECOES.get(titulo, titulo)
            documentos.append({
                'titulo': titulo, 'tema': p['tema'], 'ano': ano, 'area': area,
                'detalhe': ' · '.join(d for d in detalhe if d != titulo) or None,
                'url': u, 'fonte': FONTES.get(dominio, dominio), 'origem': slug,
            })

    def encontra(filtros):
        """Há documento para estes filtros? (mesma regra de assets/js/transparencia.js)"""
        nomes = {tema: nome for _, tema, nome in TEMAS}
        palavras = sem_acento(filtros.get('q', '')).split()
        for d in documentos:
            texto = sem_acento(' '.join(str(x) for x in [d['titulo'], d['detalhe'], d['area'], nomes[d['tema']], d['ano']] if x))
            if (d['tema'] == filtros['tema'] and filtros.get('ano') in (None, d['ano'])
                    and filtros.get('area') in (None, d['area']) and all(w in texto for w in palavras)):
                return True
        return False

    redirecionamentos = []
    for slug, p in paginas.items():
        ano, area, detalhe = campos(p['rotulos'])
        filtros = {'tema': p['tema']}
        if ano:
            filtros['ano'] = ano
        if area:
            filtros['area'] = area
        if detalhe:
            filtros['q'] = ' '.join(detalhe)
        # Página antiga sem documento: o filtro vai ficando mais amplo
        for campo in ('q', 'area', 'ano'):
            if encontra(filtros):
                break
            filtros.pop(campo, None)
        redirecionamentos.append({'de': slug, 'filtros': filtros, 'titulo': frase(p['titulo'])})

    temas = [{'id': tema, 'nome': nome, 'origem': origem} for origem, tema, nome in TEMAS]
    os.makedirs(DADOS, exist_ok=True)
    for nome, dados in [('temas', temas), ('documentos', documentos), ('redirecionamentos', redirecionamentos)]:
        with open(os.path.join(DADOS, nome + '.json'), 'w', encoding='utf-8', newline='\n') as f:
            json.dump(dados, f, ensure_ascii=False, indent=1)
            f.write('\n')
    for slug in paginas:
        shutil.rmtree(os.path.join(SRC, slug))
    print(f'{len(paginas)} páginas, {len(documentos)} documentos')


if __name__ == '__main__':
    main()
