# PENDENCIAS.md

Correções que dependem de servidor, de plataforma externa ou de decisão da entidade
e que, por isso, não foram simuladas no repositório (ver `CLAUDE.md`).

## Achado 02: envio e pagamento da inscrição na 2ª Meia-Maratona da Inclusão

**O que está no repositório:** a página `/meia-maratona-da-inclusao/` traz o formulário
em três etapas (dados, categoria, pagamento), com indicador de etapa e validação de
cada campo ao preenchê-lo. Ao confirmar, o formulário avisa que a inscrição **não foi
enviada**. Ele não exibe uma confirmação falsa.

**O que falta:**
- Definir a plataforma de inscrição e pagamento (própria, Sympla, Ticket Sports ou
  outra) e integrar o formulário a ela: recebimento dos dados, cobrança por Pix e
  cartão, e e-mail de confirmação ao participante.
- Confirmar com a entidade: data, local de largada, trajeto, categorias, distâncias e
  valores. Todos estão marcados como `[a confirmar com a entidade]` na página.

## Achado 02: situação das inscrições nos demais eventos

**O que está no repositório:** APAE Motor Rock, APAE Beach Tennis e Da Prevenção à
Inclusão ganharam o bloco "Como participar", com telefone e e-mail da entidade.
APAE Running informa que a edição de 2026 é a 2ª Meia-Maratona da Inclusão e leva à
página de inscrição.

**O que falta:** a entidade precisa informar, para cada evento, se as inscrições estão
abertas ou encerradas e a data da próxima edição. Esses dados estão marcados como
`[a confirmar com a entidade]`.

## Achado 05: chave Pix, QR Code e pagamento com cartão na página Doações

**O que está no repositório:** a página `/doacoes/` tem os três blocos: Pix (QR Code,
chave, botão de copiar e passo a passo), cartão (R$ 30 / R$ 50 / R$ 100 / outro valor,
opção de doação mensal) e WhatsApp. Também tem a linha sobre o destino das doações,
com link para a Transparência.

**O que falta para o critério de aceite ("um meio de doar que se completa sem sair
para outro canal"):**
- **Chave Pix:** a entidade precisa informar a chave. Basta preencher
  `data-chave="..."` no botão "Copiar a chave Pix" e trocar os dois marcadores
  `[a confirmar com a entidade: chave PIX]`. O botão de copiar já funciona assim que
  a chave existir.
- **QR Code:** depende da chave. Pode ser gerado uma vez, como imagem estática no
  repositório, sem biblioteca no site. O QR também pode ser o "Pix copia e cola" com
  valor livre, gerado pelo banco da entidade.
- **Cartão:** depende de plataforma de pagamento (PagSeguro, Mercado Pago, Stripe ou
  outra), inclusive para a cobrança mensal recorrente. Hoje, o botão "Doar" confere
  o valor e avisa que o pagamento ainda não está disponível. Ele não simula a doação.

## Achado 14: dados que faltam na Transparência

**O que está no repositório:** a página `/transparencia/` lista os 20 documentos em
quatro grupos: certificações e títulos, documentos constitutivos, prestação de contas
e convênios. Cada documento traz o nome por extenso, uma explicação, o ano e o
formato. Ano, formato e tamanho saíram dos próprios arquivos: nome, tamanho e texto
dos PDFs no Google Drive, além dos anos listados em cada subpágina.

**O que falta confirmar com a entidade:**
- Ano dos títulos de utilidade pública, das declarações/CND/certificados e dos
  regulamentos de compras e de contratação de pessoal. Esses documentos ficam em
  subpáginas e não informam o ano.
- Nome por extenso da sigla CID, no documento da Lei Paulista de Incentivo ao
  Esporte. O PDF é uma imagem escaneada, sem texto.
- **Certificado ISO 9001:2015 vencido:** o documento publicado vale de 17/06/2023 a
  17/06/2026. Em 26/10/2026 ele já passou da validade. A página mostra a validade
  como está no documento; cabe à entidade publicar o certificado renovado.

## Achado 16: revisão técnica da equipe da APAE antes de publicar

**O que está no repositório:** `/duvidas-frequentes/` virou um acordeão, com uma
pergunta por bloco. As respostas 1, 2 e 8 e o texto e as referências de
`/sobre-a-deficiencia-intelectual/` foram atualizados conforme a CID-11 (OMS, 2022),
o DSM-5-TR (APA, 2022) e a AAIDD, 12ª edição (2021). A principal mudança é o critério
de manifestação: durante o período de desenvolvimento, antes dos 22 anos, no lugar de
"antes dos 18 anos". Cada trecho alterado está marcado como "Aguarda revisão da
equipe técnica da APAE".

**O que falta:** a equipe técnica da APAE precisa revisar e aprovar esses trechos.
Depois disso, as marcas e o aviso do topo da página podem ser retirados. As respostas
não alteradas continuam com o texto original.

## Achado 21: canal das empresas e revisão dos textos da página de trabalho

**O que está no repositório:** a página `/inclusao-no-trabalho/` tem duas trilhas.
- **Empresas:** Lei 8.213/1991 com os percentuais da cota, etapas da contratação,
  adaptação do posto, acompanhamento e formulário para o setor de RH.
- **Famílias:** CPC, as três etapas, idade a partir de 14 anos e como encaminhar.

Também tem a seção do Selo Empresa Cidadã. A página entra no menu Programas, na
página de seção Programas e na faixa "Acesso rápido" da home.

**O que falta:**
- **Envio do formulário das empresas:** depende de servidor. Hoje ele valida os campos
  e monta um e-mail para `apae@apaelimeira.org.br` com os dados preenchidos. A
  entidade precisa dizer se há um canal próprio para empresas, marcado como
  `[a confirmar com a entidade: canal do setor de inclusão no trabalho]`.
- **Textos que precisam de revisão:** as etapas da contratação, a adaptação do posto e
  o acompanhamento depois da contratação vieram da proposta visual e estão marcados
  como proposta de texto. Os textos do CPC e do Selo foram tirados das páginas do
  próprio site.
