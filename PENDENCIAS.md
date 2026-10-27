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
