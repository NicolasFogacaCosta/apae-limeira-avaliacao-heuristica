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
