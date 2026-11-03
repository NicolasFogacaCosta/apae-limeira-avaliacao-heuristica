# Site da APAE de Limeira: avaliação heurística e protótipo corrigido

Protótipo navegável do site da **APAE de Limeira** ([www.apaelimeira.org.br](https://www.apaelimeira.org.br))
com os **27 achados** de uma avaliação heurística de usabilidade corrigidos, um commit
por achado.

A avaliação foi feita pelo **Grupo FF** na disciplina **SI406 — Interação
Humano-Computador**, da **Faculdade de Tecnologia da Unicamp**. O ponto de partida é uma
cópia fiel do site em produção, reconstruída em 26/10/2026. Por isso o histórico do Git
mostra, achado por achado, o antes e o depois de cada correção.

> **Regra do projeto:** manter o site reconhecível como o mesmo site e alterar apenas o
> que está em [`ACHADOS.md`](ACHADOS.md). Detalhes em [`CLAUDE.md`](CLAUDE.md).

> **Branch `v2-arquitetura`:** sobre os 27 achados corrigidos, esta branch reorganiza a
> arquitetura do site em cinco etapas, um commit por etapa: o site passa a ser gerado
> com o Eleventy, com notícias e documentos como dados e um painel de conteúdo. Veja
> [Reorganização da arquitetura](#reorganização-da-arquitetura-branch-v2-arquitetura).
> A branch `main` continua sendo a entrega da avaliação heurística.

---

## Como abrir o protótipo

O site é HTML, CSS e JavaScript puros, sem framework no navegador. Nesta branch, as
páginas ficam em `src/` e o [Eleventy](https://www.11ty.dev/) gera o site final em
`site/`, incluindo em cada página o cabeçalho, o rodapé e o aviso de cookies. É preciso
ter o [Node.js](https://nodejs.org/) 18 ou mais recente.

```bash
npm install
```

```bash
npm start
```

Depois, acesse **http://localhost:8080**. O `npm start` gera o site e recarrega a página
a cada alteração em `src/`.

Para publicar, rode `npm run build` e sirva a pasta `site/` em qualquer hospedagem
estática (GitHub Pages, Netlify, Vercel ou outra). Os links são relativos, então o site
funciona também num subcaminho, como `usuario.github.io/repositorio/`. Nesse caso, gere o
site com o subcaminho na variável `CAMINHO_BASE` (`CAMINHO_BASE=/repositorio/ npm run build`),
que a página de endereço inexistente (`404.html`) usa para montar os links.

## Como publicar no Netlify

O repositório já traz a configuração do Netlify (`netlify.toml`): o comando de build, a
pasta publicada, a versão do Node, o bloqueio de indexação nos buscadores e os
redirecionamentos 301 dos endereços antigos, gerados no build em `site/_redirects`.

**1. Publicar o site** (uma vez, uns 5 minutos):

1. Crie uma conta em [netlify.com](https://www.netlify.com/), entrando com o GitHub.
2. Em **Add new project › Import an existing project**, escolha o GitHub e o
   repositório `apae-limeira-avaliacao-heuristica`.
3. Em **Branch to deploy**, escolha `v2-arquitetura`. O comando (`npm run build`) e a
   pasta (`site`) já vêm preenchidos pelo `netlify.toml`.
4. Clique em **Deploy**. Em um ou dois minutos o site fica no ar num endereço como
   `nome-aleatorio.netlify.app`, que dá para trocar em **Project configuration › Change
   project name** (por exemplo, `apae-limeira-prototipo.netlify.app`).

A partir daí, cada commit na branch `v2-arquitetura`, inclusive os feitos pelo painel,
publica o site de novo sozinho.

**2. Ligar o login do painel** (opcional, para a equipe publicar em `/admin/`):

1. No GitHub, em **Settings › Developer settings › OAuth Apps › New OAuth App**, crie um
   aplicativo com:
   - **Homepage URL:** o endereço do site no Netlify;
   - **Authorization callback URL:** `https://api.netlify.com/auth/done`.
2. Gere um **client secret** e guarde o **Client ID** e o **Client secret**.
3. No Netlify, em **Project configuration › Access & security › OAuth › Install
   provider**, escolha GitHub e cole o Client ID e o Client secret.
4. Dê acesso de escrita ao repositório (**Settings › Collaborators**) às pessoas da APAE
   que vão publicar. Elas entram em `/admin/` com a própria conta do GitHub.

**Protótipo, não o site oficial:** a faixa amarela no topo das páginas avisa que o site
é um protótipo acadêmico, e o `netlify.toml` pede aos buscadores que não o indexem. Se
um dia o site virar o oficial, gere-o com `AVISO_PROTOTIPO=nao` e tire o bloco
`[[headers]]` do `netlify.toml`.

## Documentos do projeto

| Arquivo | Conteúdo |
|---|---|
| [`ACHADOS.md`](ACHADOS.md) | Especificação: os 27 achados, com heurística, severidade, correção exigida e critério de aceite |
| [`CLAUDE.md`](CLAUDE.md) | Regras do projeto: identidade visual, dados reais da entidade, terminologia, acessibilidade e formato dos commits |
| [`PENDENCIAS.md`](PENDENCIAS.md) | O que depende de servidor, de plataforma externa ou de dados da entidade, sem solução simulada |
| [`SUGESTOES.md`](SUGESTOES.md) | Melhorias percebidas no caminho que nenhum achado aponta e que, por isso, não foram feitas |
| [`proposta-ui/extraido/`](proposta-ui/extraido/) | Proposta visual das telas corrigidas, usada como referência |

## Os 27 achados e seus commits

A ordem de correção seguiu a severidade (5 → 4 → 3 → 2), com uma exceção: o achado 02
veio antes do 01, porque o link do banner (01) leva à página do evento criada no 02.

| Nº | Achado | Severidade | Commit |
|---|---|---|---|
| 01 | Botão do banner principal não é clicável | 5 — Catastrófico | [`24704e7`](../../commit/24704e7) |
| 02 | Eventos sem formulário ou link de inscrição | 4 — Grave | [`72a1cde`](../../commit/72a1cde) |
| 03 | Home carrega com a área principal em branco | 4 — Grave | [`5c42567`](../../commit/5c42567) |
| 04 | Cinco itens do menu principal voltam para a home | 4 — Grave | [`c3decba`](../../commit/c3decba) |
| 05 | "Doe Agora" leva a uma página sem meio de doação | 4 — Grave | [`a1e22c5`](../../commit/a1e22c5) |
| 07 | Teste do Pezinho não remete ao Instituto Jô Clemente | 4 — Grave | [`90c962a`](../../commit/90c962a) |
| 12 | Campos obrigatórios sem marcação e sem validação prévia | 4 — Grave | [`ec9a012`](../../commit/ec9a012) |
| 14 | Transparência é um muro de siglas sem explicação | 4 — Grave | [`e70ab9e`](../../commit/e70ab9e) |
| 16 | FAQ com base teórica e terminologia superadas | 4 — Grave | [`a8969e1`](../../commit/a8969e1) |
| 21 | Nenhum conteúdo sobre inclusão no mercado de trabalho | 4 — Grave | [`c2fa8e6`](../../commit/c2fa8e6) |
| 06 | Botão de doação abre o WhatsApp sem aviso | 3 — Simples | [`46aa764`](../../commit/46aa764) |
| 08 | Telefones e WhatsApp não são clicáveis | 3 — Simples | [`0a0365c`](../../commit/0a0365c) |
| 10 | Mensagens do sistema em inglês | 3 — Simples | [`5d958ab`](../../commit/5d958ab) |
| 11 | Busca sem resultados não oferece saída | 3 — Simples | [`ca9b81e`](../../commit/ca9b81e) |
| 13 | Pergunta antispam como barreira | 3 — Simples | [`2b3122d`](../../commit/2b3122d) |
| 15 | "Clique aqui" e downloads sem indicação de destino | 3 — Simples | [`882e99a`](../../commit/882e99a) |
| 18 | Carrossel automático sem pausa | 3 — Simples | [`4145171`](../../commit/4145171) |
| 19 | Aviso de cookies sem opção de recusar | 3 — Simples | [`5f63c48`](../../commit/5f63c48) |
| 20 | Páginas duplicadas e rótulos divergentes | 3 — Simples | [`e8a2e5d`](../../commit/e8a2e5d) |
| 22 | Vocabulário do público ausente | 3 — Simples | [`abc832b`](../../commit/abc832b) |
| 23 | Publicações sem ano e sem acesso pelo menu | 3 — Simples | [`6afc0b0`](../../commit/6afc0b0) |
| 26 | Ouvidoria reduzida a um e-mail no corpo do texto | 3 — Simples | [`eb858bc`](../../commit/eb858bc) |
| 27 | Contraste insuficiente no botão de doação | 3 — Simples | [`e7c6ab7`](../../commit/e7c6ab7) |
| 09 | Telefone e endereço em formatações divergentes | 2 — Cosmético | [`6566129`](../../commit/6566129) |
| 17 | Ortografia pré-reforma e erros de acentuação | 2 — Cosmético | [`e1b4f66`](../../commit/e1b4f66) |
| 24 | Compartilhamento social em páginas institucionais | 2 — Cosmético | [`d3e25c0`](../../commit/d3e25c0) |
| 25 | Fax anunciado como canal de contato | 2 — Cosmético | [`b56eda7`](../../commit/b56eda7) |

Dois commits marcados como `base:` não correspondem a achados:
- [`3303f3e`](../../commit/3303f3e): a reconstrução inicial do site em produção, com os
  problemas originais.
- [`6dbc285`](../../commit/6dbc285): uma correção de fidelidade da própria reconstrução,
  em que o botão da página Doações aparecia verde em vez do rosa da produção.

## Reorganização da arquitetura (branch `v2-arquitetura`)

Depois dos achados, o site foi reorganizado para ficar mais simples de usar e de manter.
As cerca de 690 páginas soltas, editadas uma a uma, viraram modelos e dados. O site
continua sendo HTML estático, sem framework no navegador, e cada endereço antigo continua
funcionando, seja como a mesma página, seja como redirecionamento. Cada etapa foi
verificada contra a anterior antes do commit: o mesmo conteúdo, nenhum link interno
quebrado e redirecionamentos que levam a algum conteúdo.

| Etapa | O que mudou | Commit |
|---|---|---|
| 1 | Cabeçalho, rodapé e aviso de cookies viram modelos do Eleventy, incluídos no build em vez de inseridos por JavaScript. O menu e os links do rodapé ficam em `src/_data/`. As páginas passam de `site/` para `src/`, e o site gerado vai para `site/` | [`e9df4d5`](../../commit/e9df4d5) |
| 2 | As 369 notícias viram arquivos Markdown, nos mesmos endereços. A listagem é gerada no build, com 12 por página e filtros por categoria e por ano que funcionam sem JavaScript. Cada notícia ganha o caminho "Início › Notícias" e a categoria como link | [`2561412`](../../commit/2561412) |
| 3 | As 209 páginas da Transparência, em até cinco níveis, viram dados: 695 documentos numa lista filtrável por tema, ano, área e palavra. Entram 23 páginas que nenhum link alcançava. Os endereços antigos levam à lista já filtrada | [`812f7ae`](../../commit/812f7ae) |
| 3 | O índice da busca passa a ser gerado no build, com as notícias novas e um resultado por tema da Transparência, que leva à lista filtrada pela palavra buscada | [`e237f0a`](../../commit/e237f0a) |
| 4 | As notícias até 2018 vão para o arquivo do site (`/arquivo/`), com aviso de conteúdo antigo, junto das galerias e páginas que estavam soltas. Saem as páginas de plugin, de exemplo, vazias e de teste; outras viram redirecionamento. Entra a página 404 | [`726563a`](../../commit/726563a) |
| 5 | Painel de conteúdo (Decap CMS) em `/admin/` para a equipe publicar notícias e documentos sem mexer em código. Os documentos passam a ser um arquivo cada | [`fff08d5`](../../commit/fff08d5) |
| 5 | O painel passa a usar o novo nome do repositório, `apae-limeira-avaliacao-heuristica` | [`4483e5b`](../../commit/4483e5b) |
| Hospedagem | Faixa de protótipo acadêmico no topo de todas as páginas, para o link público não ser confundido com o site oficial | [`955c24a`](../../commit/955c24a) |
| Hospedagem | Configuração do Netlify: build, bloqueio de indexação, 222 redirecionamentos 301 e o painel gravando na branch publicada | [`a97981e`](../../commit/a97981e) |

As etapas não alteram os achados corrigidos na `main`. O que mudou na aparência foi só o
que cada etapa acrescenta: filtros e caminho nas notícias, a lista de documentos, o
arquivo do site, a página 404 e o painel. Os scripts que converteram o conteúdo em cada
etapa ficam em [`ferramentas/conversao/`](ferramentas/conversao/).

## Principais mudanças, em resumo

- **Navegação:** os itens do menu abrem páginas de seção; o submenu funciona pelo teclado
  e no celular. Há uma seção de notícias com data completa e categoria.
- **Home:** o banner tem altura reservada, prévia de carregamento, pausa, indicadores e
  chamadas clicáveis. As imagens foram convertidas para WebP (de cerca de 12 MB para
  cerca de 1 MB). Há também uma faixa de acesso rápido.
- **Doações:** Pix, cartão com valores sugeridos e WhatsApp. O botão de doação passou a
  ter contraste de 4,95:1 em todas as ocorrências.
- **Eventos:** a página da 2ª Meia-Maratona da Inclusão tem inscrição em três etapas,
  e cada evento ganhou o bloco "Como participar".
- **Formulários:** campos obrigatórios marcados, validação ao sair de cada campo,
  mensagens em português e nenhuma pergunta antispam.
- **Conteúdo:**
  - a Transparência virou uma lista estruturada, com ano, formato e tamanho de cada documento;
  - o FAQ foi atualizado conforme a CID-11, o DSM-5-TR e a AAIDD (2021);
  - a terminologia segue o CLAUDE.md em todo o site;
  - a ortografia segue o Acordo vigente.
- **Busca:** tudo em português; quando não há resultados, a tela oferece caminhos de
  saída; e reconhece sinônimos como "neurodivergente", "TEA" e "autismo".
- **Inclusão no trabalho:** página nova com uma trilha para empresas (Lei de Cotas e
  formulário para o RH) e outra para famílias (Centro Profissionalizante e de
  Convivência).

## Estrutura

```
src/                         fonte do site (o Eleventy gera site/ a partir daqui)
  _data/                     menu.js, rodape.js, redes.js, cookies.js: os links do
                             cabeçalho e do rodapé, editados num lugar só
  _includes/partes/          cabecalho.njk, rodape.njk, cookies.njk, icones.njk,
                             filtro-noticias.njk, item-noticia.njk
  _includes/layouts/         base.njk (documento) e noticia.njk (página de notícia)
  _includes/macros.njk       ícone, redes sociais e item de lista do rodapé
  index.html                 home
  busca/                     resultados da busca (equivale a /?s= no WordPress)
  <slug>/index.html          páginas institucionais, nas mesmas URLs da produção
  noticias/publicacoes/      as 369 notícias em Markdown, publicadas em /<slug>/
  noticias/index.njk         listagem: /noticias/ e /noticias/categoria/<categoria>/
  noticias/ano.njk           uma página por ano: /noticias/<ano>/
  arquivo/index.njk          arquivo do site: notícias até 2018, galerias de fotos e páginas antigas
  404.njk                    página de endereço inexistente, com busca e caminhos
  redirecionamentos.njk      endereços sem conteúdo levam ao destino mais útil
  _data/arquivo.json         galerias e páginas antigas listadas no arquivo
  _data/redirecionamentos.json  de onde para onde vai cada endereço antigo
  transparencia/index.html   Transparência: documentos por tema, com explicação (achado 14)
  transparencia/documentos.njk  todos os documentos, com filtros: /transparencia/documentos/
  transparencia/redirecionamentos.njk  os 209 endereços antigos levam à lista já filtrada
  _data/transparencia/       temas.json, redirecionamentos.json e documentos/
                             (um arquivo .json por documento)
  admin/                     painel de conteúdo (Decap CMS): index.html e config.yml
  _redirects.njk             redirecionamentos 301 para o Netlify (site/_redirects)
  _data/transparenciaArvore.js  organiza os documentos por tema, ano e área
  _lib/texto.js              funções de texto comuns aos dados e à configuração
  assets/css/estilo.css      estilos (tokens da identidade visual em :root)
  assets/js/principal.js     menu, busca, carrosséis, cookies, compartilhar, formulários
  busca/indice.11ty.js       gera o índice da busca (assets/js/busca-indice.js) no build
  assets/js/*.js             scripts específicos (inscrição, doação, trabalho, notícias)
  storage/, wp-content/      imagens, no mesmo caminho das URLs originais
site/                        site gerado (npm run build); fora do Git
eleventy.config.js           configuração do Eleventy
netlify.toml                 configuração da hospedagem no Netlify
ferramentas/reconstrucao/    script que gerou a base a partir da API REST do WordPress
proposta-ui/extraido/        proposta visual de referência
```

Cada página inclui as partes comuns com `{% include "partes/cabecalho.njk" %}` logo após
o `<body>` e `{% include "partes/rodape.njk" %}` antes de fechar. Para mudar um item do
menu ou do rodapé, edite o arquivo correspondente em `src/_data/`.

### Painel de conteúdo

A equipe da APAE pode publicar notícias e documentos da Transparência pelo painel em
`/admin/`, sem mexer em código. Cada publicação vira um commit no repositório, e o site
é gerado de novo a partir dele.

Para usar o painel no próprio computador, com os arquivos locais e sem login, rode o
site e o servidor do painel, cada um num terminal:

```bash
npm start
```

```bash
npm run painel
```

Depois, abra **http://localhost:8080/admin/** e clique em **Entrar**.

Para usar o painel no site publicado, siga a parte 2 de
[Como publicar no Netlify](#como-publicar-no-netlify). O painel grava na branch
`v2-arquitetura`, a mesma que o Netlify publica.

### Como publicar uma notícia pelo código

Crie um arquivo em `src/noticias/publicacoes/`. O nome do arquivo vira o endereço:
`festa-junina-2026.md` é publicado em `/festa-junina-2026/`.

```markdown
---
titulo: "Festa Junina reúne famílias na APAE"
date: 2026-06-20
categoria: "Eventos"
imagem: "../storage/2026/06/festa-junina.jpg"
resumo: "Uma ou duas frases que aparecem na lista de notícias."
---

Texto da notícia em Markdown. **Negrito**, _itálico_, [links](https://exemplo.org)
e imagens em HTML (`<img src="..." width="..." height="..." alt="...">`).
```

A `categoria` é uma destas: `Notícias`, `Eventos` ou `Programas`. A `imagem` é opcional
e aparece no bloco "Outras notícias". No próximo build, a notícia entra na listagem, na
página da categoria e na página do ano, sem mais nenhuma edição.

### Como publicar um documento da Transparência pelo código

Crie um arquivo `.json` em `src/_data/transparencia/documentos/`, com qualquer nome:

```json
{
 "titulo": "Termo de fomento nº 06-2026",
 "tema": "termos-e-planos",
 "ano": 2026,
 "area": "Assistência social",
 "detalhe": "CMDCA",
 "url": "https://drive.google.com/file/d/…/view",
 "fonte": "Google Drive"
}
```

O `tema` é um dos identificadores de `temas.json`. A `area` (Assistência social,
Cultura, Educação, Esporte ou Saúde) e o `detalhe` são opcionais. O documento aparece na
lista, nos filtros e na contagem da página da Transparência no próximo build.

Os dados foram extraídos das antigas páginas da Transparência pelo script
[`ferramentas/conversao/transparencia-para-dados.py`](ferramentas/conversao/transparencia-para-dados.py)
e divididos em um arquivo por documento por
[`ferramentas/conversao/documentos-um-por-arquivo.mjs`](ferramentas/conversao/documentos-um-por-arquivo.mjs).
O campo `ordem`, que só os documentos extraídos têm, mantém a ordem da lista original.

As notícias foram convertidas do HTML da reconstrução pelo script
[`ferramentas/conversao/noticias-para-markdown.mjs`](ferramentas/conversao/noticias-para-markdown.mjs).
O índice da busca é gerado a cada build por `src/busca/indice.11ty.js`, então notícias e
documentos novos entram na busca sem mais nenhuma edição. O texto das páginas
institucionais vem de `src/_data/busca/paginas.json`, extraído na reconstrução.

## Limitações do protótipo

O que depende da entidade ou de um servidor está registrado em
[`PENDENCIAS.md`](PENDENCIAS.md). Nenhuma dessas funções finge funcionar. Os principais
pontos:

- **Pagamentos e envios:** a chave Pix, a plataforma de pagamento com cartão e o envio
  das inscrições e dos formulários ainda precisam ser definidos. Os formulários validam
  os dados e avisam que o envio ainda não está ligado; o de Contato reproduz o
  comportamento do site original.
- **Dados marcados para confirmar:** datas, valores e categorias dos eventos, o prazo da
  Ouvidoria e alguns anos de documentos aparecem como `[a confirmar com a entidade]`.
- **Textos técnicos e propostas:** as respostas atualizadas do FAQ e os textos vindos da
  proposta visual estão marcados para revisão da equipe da APAE.
- **Imagens externas:** a home e as páginas do menu têm as imagens no repositório. As
  subpáginas da Transparência e as publicações antigas ainda carregam imagens do site em
  produção.
