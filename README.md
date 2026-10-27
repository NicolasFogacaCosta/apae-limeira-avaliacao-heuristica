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

---

## Como abrir o protótipo

O site é HTML, CSS e JavaScript puros, sem framework e sem etapa de build. Os links usam
URLs de pasta (`/doacoes/`), então ele precisa ser servido por HTTP. Abrir o arquivo
direto no navegador não funciona.

```bash
python -m http.server 8080 --directory site
```

Depois, acesse **http://localhost:8080**.

Para publicar, basta servir a pasta `site/` em qualquer hospedagem estática (GitHub
Pages, Netlify, Vercel ou outra).

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
site/
  index.html                 home
  busca/                     resultados da busca (equivale a /?s= no WordPress)
  <slug>/index.html          páginas e publicações, nas mesmas URLs da produção
  assets/css/estilo.css      estilos (tokens da identidade visual em :root)
  assets/js/layout.js        cabeçalho, rodapé e aviso de cookies, comuns a todas as páginas
  assets/js/principal.js     menu, busca, carrosséis, cookies, compartilhar, formulários
  assets/js/busca-indice.js  índice de busca gerado a partir do conteúdo
  assets/js/*.js             scripts específicos (inscrição, doação, trabalho, notícias)
  storage/, wp-content/      imagens, no mesmo caminho das URLs originais
ferramentas/reconstrucao/    script que gerou a base a partir da API REST do WordPress
proposta-ui/extraido/        proposta visual de referência
```

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
