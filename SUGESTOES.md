# SUGESTOES.md

Melhorias percebidas durante as correções que **não correspondem a nenhum achado** de
`ACHADOS.md` e, por isso, não foram feitas (ver `CLAUDE.md`).

## Imagens quebradas em /quem-somos/ e /eventos/

Percebido no achado 04. Essas duas páginas já existiam no WordPress e passaram a ser as
páginas de seção do menu. Cada uma traz uma imagem apontando para um servidor de
desenvolvimento antigo (`dev.triader.com.br`), que não responde mais:

- `/quem-somos/`: foto "equipe" (`equipe1.jpg`);
- `/eventos/`: cartaz do APAE Motor Rock de 2016 (`cartaz-motor-rock.jpg`), alinhado à esquerda.

**Sugestão:** remover as duas imagens ou trocá-las por fotos atuais fornecidas pela entidade.

## Contraste do texto do aviso de cookies

Percebido no achado 19. O texto da faixa de cookies, amarelo `#F2DC79` sobre azul
`#0066BF`, tem contraste de 4,19:1, abaixo do mínimo de 4,5:1 do CLAUDE.md para texto
normal. Os botões da faixa foram corrigidos no achado 19; o texto, não, porque nenhum
achado o aponta.

**Sugestão:** texto branco sobre o mesmo azul (5,75:1) ou um azul mais escuro na faixa.

## Páginas órfãs de plugins antigos, com título em inglês

Percebido no achado 24. A cópia do WordPress inclui páginas criadas por plugins de loja
e de agendamento que não existem mais: `/checkout/`, `/my-bookings/`, `/products-page/`,
`/transaction-results/`, `/your-account/` e `/preschool/`, além de `/pagina-exemplo-3/`.
Nenhum link do site leva a elas, mas os títulos estão em inglês ou são de exemplo.

**Sugestão:** retirá-las do servidor (com redirecionamento para a home), já que não
fazem parte do site da entidade.
