# ACHADOS.md — Especificação de correções

Os 26 achados da avaliação heurística do site da APAE de Limeira, com a correção
exigida e o critério de aceite de cada um. Esta é a especificação do projeto:
nenhuma alteração fora desta lista deve ser feita (ver `CLAUDE.md`).

Referência: *Avaliação Heurística do site da APAE Limeira* — Grupo FF, SI406, FT Unicamp.
As capturas de tela de cada achado estão no documento original.

**Ordem de execução: severidade 5 → 4 → 3 → 2.**

| Severidade | Achados |
|---|---|
| 5 — Catastrófico | 01 |
| 4 — Grave | 02, 03, 04, 05, 07, 12, 14, 16, 21 |
| 3 — Simples | 06, 08, 10, 11, 13, 15, 18, 19, 20, 22, 23, 26, 27 |
| 2 — Cosmético | 09, 17, 24, 25 |

O achado 27 não consta do documento original da avaliação: foi identificado depois,
durante a prototipação visual. Está registrado aqui com essa ressalva para que a
correspondência entre o documento entregue e o repositório permaneça honesta.

---

## Severidade 5

### [x] 01 — Botão do banner principal não é clicável
**Heurística:** 04 — Consistência e padrões · **Página:** home

O banner da página inicial anuncia a 2ª Meia-Maratona da Inclusão de Limeira com
"Inscrições abertas" e um elemento amarelo escrito "Garanta sua inscrição" com toda a
aparência de botão. O slide é composto apenas por camadas de imagem sem âncora: o
clique não produz efeito algum. O evento também não tem página própria.

**Correção:** transformar a chamada em link real para a página do evento (achado 02),
com estados de `hover` e `focus` visíveis e alvo de no mínimo 44px de altura. Vale para
todos os slides que contenham chamada para ação.

**Aceite:** clicar em qualquer chamada do banner navega para a página correspondente;
o elemento é alcançável por `Tab` e exibe foco visível; nenhum slide contém texto com
aparência de botão sem destino.

---

## Severidade 4

### [x] 02 — Eventos sem formulário ou link de inscrição
**Heurística:** 06 — Reconhecimento em vez de memorização · **Páginas:** `/apae-running-limeira/`, `/apae-beach-tennis/`, `/apae-motor-rock/`, `/da-prevencao-a-inclusao/` + nova página do evento em destaque

Nenhuma página de evento tem formulário de inscrição, link para plataforma externa,
ficha de patrocínio ou data de abertura das inscrições. O único botão dessas páginas é
"Doe Agora".

**Correção:** criar a página da 2ª Meia-Maratona da Inclusão de Limeira com formulário
de inscrição em etapas curtas (dados pessoais → categoria → pagamento) e indicador de
etapa. Nas demais páginas de evento, incluir bloco de inscrição ou, quando inscrições
estiverem encerradas, informar explicitamente a situação e a previsão da próxima edição.
Data, valores e categorias ficam como `[a confirmar com a entidade]`.

**Aceite:** toda página de evento responde à pergunta "como eu participo?" sem exigir
busca externa; o formulário valida no preenchimento, não após o envio.

### [x] 03 — Home carrega com a área principal em branco
**Heurística:** 01 — Visibilidade do status do sistema · **Página:** home

A home leva cerca de 6,5 s para concluir o carregamento (110 requisições) e, durante
todo esse tempo, a faixa central fica completamente em branco, sem indicador, sem área
reservada e sem sinal de atividade.

**Correção:** reservar a altura do banner no layout para eliminar o salto, exibir estado
de carregamento (esqueleto ou imagem de baixa resolução) e dar prioridade de carregamento
ao primeiro slide. Converter imagens para formato moderno, aplicar `loading="lazy"` em
tudo que está abaixo da dobra e reduzir o número de requisições.

**Aceite:** nenhum intervalo em que a área do banner apareça vazia e sem indicação;
sem deslocamento de layout quando o banner carrega.

### [x] 04 — Cinco itens do menu principal voltam para a home
**Heurística:** 04 — Consistência e padrões · **Páginas:** todas (cabeçalho)

"Quem Somos", "Programas", "Projetos", "Serviços" e "Eventos" têm `href="/"`. No desktop
o cursor abre o submenu, mas o clique devolve o usuário à home; no celular e por teclado,
o clique é a ação natural. "Transparência" e "Contato/Ouvidoria", no mesmo menu, abrem
suas páginas normalmente — comportamentos opostos em itens visualmente idênticos.

**Correção:** criar as cinco páginas de seção, cada uma listando seus itens com título,
resumo de uma linha e link. Apontar o item de menu para a respectiva página. A estrutura
correta está em `CLAUDE.md`.

**Aceite:** nenhum item de menu aponta para `/`; os oito itens têm comportamento uniforme;
o submenu funciona por teclado.

### [x] 05 — "Doe Agora" leva a uma página sem meio de doação
**Heurística:** 02 — Correspondência com o mundo real · **Página:** `/doacoes/`

O botão aparece no topo fixo, no rodapé e em todas as páginas internas, e conduz a uma
página com texto institucional, a frase "Saiba como ajudar clicando no botão abaixo" e um
número de telefone. Não há PIX, dados bancários, boleto, cartão, valores sugeridos,
doação recorrente nem informação sobre dedução fiscal.

**Correção:** reconstruir a página com três blocos — PIX com chave e QR Code, cartão com
valores sugeridos (R$ 30 / R$ 50 / R$ 100 / outro) e opção mensal, e contato por WhatsApp.
Incluir linha curta sobre o destino das doações. Chave PIX e integração de pagamento ficam
como `[a confirmar com a entidade]`; se a integração não for possível no repositório,
registrar em `PENDENCIAS.md`.

**Aceite:** a página oferece pelo menos um meio de doar que se completa sem sair para
outro canal; o rótulo "Doe agora" corresponde ao que a página entrega.

### [ ] 07 — Teste do Pezinho não remete ao Instituto Jô Clemente
**Heurística:** 10 — Ajuda e documentação · **Página:** `/teste-do-pezinho/`

A página descreve bem os cinco painéis, o local de coleta, o agendamento e o pagamento,
mas não menciona nem encaminha ao Instituto Jô Clemente, responsável pelo processamento
das amostras e pelas orientações de referência em triagem neonatal.

**Correção:** incluir bloco visualmente separado com o encaminhamento ao Instituto Jô
Clemente, explicando em uma frase o que o responsável encontra lá, com link externo
identificado como tal. *Atenção ao nome: é Instituto **Jô** Clemente, não "João Clemente".*

**Aceite:** o bloco existe, é alcançável sem rolagem exaustiva e o link abre identificado
como site externo.

### [ ] 12 — Campos obrigatórios sem marcação e sem validação prévia
**Heurística:** 05 — Prevenção de erros · **Página:** `/contato/`

Os cinco campos do formulário são obrigatórios (`aria-required="true"`), mas nada na tela
indica isso: sem asterisco, sem legenda, sem distinção visual. O atributo `required` não
está presente, então a validação do navegador não dispara e o usuário só descobre o erro
depois de enviar. Os rótulos também não estão associados aos campos por `label/for`.

**Correção:** marcar os obrigatórios com asterisco e legenda explicativa, adicionar
`required`, associar todo rótulo ao campo por `for`/`id`, validar no `blur` de cada campo
e exibir a mensagem de erro abaixo do campo, em português, preservando o conteúdo digitado.

**Aceite:** leitor de tela anuncia rótulo e obrigatoriedade de cada campo; erro aparece
antes do envio; nenhum dado digitado se perde ao falhar a validação.

### [ ] 14 — Transparência é um muro de siglas sem explicação
**Heurística:** 02 — Correspondência com o mundo real · **Página:** `/transparencia/`

Cerca de vinte links em caixa alta — "AVCB", "CID – LPIE", "CEBAS", "CREMESP",
"REL. FUNC. UTILIZADOS", "DESP. PESSOAL (LEI 12.527/2011)" — sem texto explicativo, sem
agrupamento por tema, sem data de referência, separados apenas por espaços irregulares.

**Correção:** substituir por lista estruturada em que cada item traz o nome por extenso
(sigla entre parênteses), uma linha explicando o que o documento é, o ano de referência e
o formato e tamanho do arquivo. Agrupar por tema: certificações, documentos constitutivos,
prestação de contas, convênios.

**Aceite:** nenhum item exibe apenas sigla; cada documento informa ano e formato.

### [ ] 16 — FAQ com base teórica e terminologia superadas
**Heurística:** 02 — Correspondência com o mundo real · **Página:** `/duvidas-frequentes/`

O conteúdo cita o DSM-IV-TR (2003), o manual "Retardo Mental" (2006) e uma revista de
2011, e reproduz o critério de manifestação "antes dos 18 anos". Emprega "doença mental",
"Deficiência Mental" e, em publicação alcançável pela busca, "portadores de deficiências"
e "deficiência mental severa ou profunda".

**Correção:** atualizar as referências para as classificações vigentes, substituir a
terminologia conforme `CLAUDE.md` e reestruturar as perguntas em acordeão com uma
pergunta por bloco. Alterações de conteúdo técnico devem ser marcadas para revisão da
equipe da APAE antes de publicação.

**Aceite:** nenhuma ocorrência dos termos vedados em todo o repositório; referências
datadas de forma verificável.

### [ ] 21 — Nenhum conteúdo sobre inclusão no mercado de trabalho
**Heurística:** 10 — Ajuda e documentação · **Página:** nova + `/cpc/`

A página do Centro Profissionalizante descreve as oficinas oferecidas aos usuários, mas
nada trata da perspectiva do empregador: sem Lei de Cotas, sem etapas de contratação, sem
apoio à adaptação do posto, sem canal para empresas, sem orientação a responsáveis sobre
encaminhamento profissional. O "Selo Empresa Cidadã" aparece na home sem página própria.

**Correção:** criar página com duas trilhas visualmente distintas. **Para empresas:**
Lei 8.213/1991, etapas da contratação, apoio da APAE na adaptação e no acompanhamento,
formulário curto para RH. **Para famílias:** como funciona o CPC, as três etapas (Oficina
de Iniciação, Oficinas de Qualificação, Oficinas Ocupacionais / Grupo Conviver), a partir
de 14 anos, e como encaminhar. Incluir seção sobre o Selo Empresa Cidadã. Ligar a página
ao menu e à faixa de acesso rápido da home.

**Aceite:** empresa e responsável encontram, cada um, o passo seguinte concreto e um canal
de contato dedicado.

---

## Severidade 3

### [x] 06 — Botão de doação abre o WhatsApp sem aviso
**Heurística:** 01 — Visibilidade do status do sistema · **Página:** `/doacoes/`

O botão "Clique aqui para ajudar! (19) 99304-6428" abre `api.whatsapp.com` sem ícone,
sem menção ao WhatsApp no rótulo e sem indicação de que o usuário deixará o site.

**Correção:** rotular como "Falar no WhatsApp: (19) 99304-6428", com ícone do aplicativo e
indicação de que abre em nova janela.
**Aceite:** o destino é previsível antes do clique.

### [ ] 08 — Telefones e WhatsApp não são clicáveis
**Heurística:** 07 — Flexibilidade e eficiência de uso · **Páginas:** todas

Os números aparecem como texto inerte no topo fixo, no rodapé, em `/contato/`,
`/teste-do-pezinho/` e `/duvidas-frequentes/`. Só o número de `/doacoes/` é clicável.

**Correção:** converter todos em links `tel:` e `https://wa.me/`, mantendo a formatação
visível legível. **Aceite:** nenhum número em texto puro no repositório.

### [ ] 10 — Mensagens do sistema em inglês
**Heurística:** 02 — Correspondência com o mundo real · **Páginas:** busca e listagens

O documento declara `lang="pt-BR"`, mas a busca vazia exibe "Nothing Found", a listagem é
encabeçada por "Search Results for:" e as chamadas trazem "Read more".

**Correção:** traduzir todas as cadeias de interface. **Aceite:** varredura do repositório
não encontra nenhuma dessas cadeias nem outras em inglês visíveis ao usuário.

### [ ] 11 — Busca sem resultados não oferece saída
**Heurística:** 09 — Recuperação de erros · **Página:** resultados de busca

A tela exibe apenas "Nothing Found" e o campo preenchido novamente. Sem explicação, sem
sugestão de grafia, sem conteúdos populares, sem link para seções ou atendimento.

**Correção:** mensagem em português explicando o que ocorreu, sugestões de termos
relacionados, atalhos para as seções mais procuradas e link para os canais de contato.
**Aceite:** a tela de busca vazia sempre oferece pelo menos dois caminhos de saída.

### [ ] 13 — Pergunta antisspam como barreira
**Heurística:** 05 — Prevenção de erros · **Página:** `/contato/`

"QUAL NÚMERO É MAIOR: 13 OU 26?" em campo de texto livre, sem instrução de formato, sem
alternativa e sem explicar por que está ali.

**Correção:** substituir por mecanismo que não exija esforço do usuário (campo honeypot ou
verificação no servidor). Se for necessário manter um desafio visível, informar o formato
esperado e oferecer alternativa.
**Aceite:** o envio do formulário não depende de raciocínio ou digitação adicional.

### [ ] 15 — "Clique aqui" e downloads sem indicação de destino
**Heurística:** 06 — Reconhecimento em vez de memorização · **Páginas:** `/transparencia/`, `/doacoes/`

O único botão destacado da página de Transparência diz apenas "Clique aqui". Os documentos
levam a arquivos no Google Drive sem indicar saída do site, formato, tamanho ou download.

**Correção:** todo link com texto descritivo do destino; arquivos externos identificados
com formato, tamanho e marcação de link externo.
**Aceite:** a lista de links lida fora de contexto continua compreensível.

### [ ] 18 — Carrossel automático sem pausa
**Heurística:** 03 — Controle e liberdade do usuário · **Página:** home

Três banners alternam sozinhos, sem botão de pausa e sem indicadores de posição. Apenas
uma seta de avanço fica visível.

**Correção:** incluir botão de pausa, indicadores clicáveis e setas nos dois sentidos;
pausar ao receber foco ou ponteiro; respeitar `prefers-reduced-motion`.
**Aceite:** é possível parar a rotação e voltar a um slide específico.

### [ ] 19 — Aviso de cookies sem opção de recusar
**Heurística:** 03 — Controle e liberdade do usuário · **Páginas:** todas

A faixa fixa oferece "Aceitar todos" em destaque e "Configurações de cookies". Recusar os
não essenciais exige entrar nas configurações e ajustar opções. A faixa cobre conteúdo
enquanto não houver decisão.

**Correção:** incluir "Recusar não essenciais" no primeiro nível, com o mesmo peso visual
de "Aceitar todos", e impedir que a faixa cubra conteúdo interativo.
**Aceite:** aceitar e recusar custam o mesmo número de cliques.

### [ ] 20 — Páginas duplicadas e rótulos divergentes
**Heurística:** 04 — Consistência e padrões · **Páginas:** `/fabrica-de-paletes/`, `/reforma-de-pallets/`, `/estrutura/`, `/conselho/`

Duas páginas para o mesmo serviço: "Fábrica de Paletes" (no menu) e "Reforma de pallets"
(órfã, fora do menu, grafia inglesa). Além disso, "A Entidade" leva a uma página intitulada
"SOBRE A ASSOCIAÇÃO", e "Conselho" aparece como "O Conselho" no rodapé e "CONSELHOS" no
título da página.

**Correção:** consolidar as duas páginas de paletes em uma, com redirecionamento da URL
antiga. Padronizar rótulo de menu, título da página e entrada de rodapé com o mesmo texto.
**Aceite:** o texto clicado reaparece como título na página de destino; nenhuma página
órfã permanece.

### [ ] 22 — Vocabulário do público ausente
**Heurística:** 02 — Correspondência com o mundo real · **Páginas:** conteúdo geral e busca

A busca por "neurodivergente" e "neurodiversidade" não retorna nada. "Autismo" e "TEA"
aparecem apenas em uma publicação antiga que usa "autistas" ao lado de "portadores de
deficiências". Todo o conteúdo se estrutura em "Deficiência Intelectual".

**Correção:** incorporar os termos usados pelo público nos textos onde forem corretos, e
mapear sinônimos na busca interna para que levem ao conteúdo existente.
**Aceite:** buscar "neurodivergente", "neurodiversidade", "TEA" e "autismo" retorna
conteúdo pertinente.

### [ ] 23 — Publicações sem ano e sem acesso pelo menu
**Heurística:** 01 — Visibilidade do status do sistema · **Páginas:** publicações

As notícias exibem apenas "01 ABRIL", sem ano, embora tratem de norma de 2012/2013.
Aparecem classificadas como "Sem categoria" e não há item de menu que leve a elas — só a
busca alcança esse conteúdo.

**Correção:** exibir data completa com ano, substituir a categoria padrão por categorias
reais e criar seção de notícias acessível pela navegação.
**Aceite:** nenhuma publicação sem ano visível ou marcada como "Sem categoria".

### [ ] 26 — Ouvidoria reduzida a um e-mail no corpo do texto
**Heurística:** 10 — Ajuda e documentação · **Página:** `/contato/`

O menu anuncia "Contato/Ouvidoria", mas a ouvidoria é uma linha solta no texto com um
endereço de e-mail. Sem formulário, sem escopo, sem prazo de resposta, sem opção anônima,
sem acompanhamento.

**Correção:** bloco próprio da Ouvidoria informando o que pode ser tratado, o prazo de
resposta, a possibilidade de manifestação anônima e o canal; incluir "Manifestação de
ouvidoria" no seletor de assunto do formulário.
**Aceite:** o usuário sabe o que acontece depois de enviar antes de enviar.

---

## Severidade 2

### [ ] 09 — Telefone e endereço em formatações divergentes
**Heurística:** 04 — Consistência e padrões · **Páginas:** todas

O mesmo telefone aparece como "(19) 3404-1569", "(19) 3404.1569" e "3404 15 69". O
endereço aparece como "Av. Antônio D'Andréa, 364", "Av. Antônio d'Andrea, 364" e
"Av. Antônio D'Andrea, 364,Parque Nossa Senhora das Dores" (sem espaço após a vírgula).

**Correção:** padronizar conforme `CLAUDE.md`, de preferência em um parcial ou componente
único reaproveitado. **Aceite:** uma só grafia de cada dado em todo o repositório.

### [ ] 17 — Ortografia pré-reforma e erros de acentuação
**Heurística:** 04 — Consistência e padrões · **Páginas:** `/duvidas-frequentes/`, menu

Título "DÚVIDAS FREQÜENTES" com trema, enquanto o link do rodapé escreve "Dúvidas
Frequentes (FAQ)". No corpo: "idéias", "sócio-econômicas", "dia-a-dia", "individuo" sem
acento. No menu: "Da Prevenção á Inclusão", com acento agudo no lugar da crase.

**Correção:** revisão ortográfica conforme o Acordo vigente; rótulo do link e título da
página com a mesma grafia. **Aceite:** revisão ortográfica sem ocorrências.

### [ ] 24 — Compartilhamento social em páginas institucionais
**Heurística:** 08 — Estética e design minimalista · **Página:** `/transparencia/` e similares

Barra com Facebook, WhatsApp, Twitter, Pinterest e LinkedIn abaixo do bloco de prestação
de contas. Inclui Pinterest, sem relação com o conteúdo, e o rótulo "Twitter", nome
substituído pela plataforma em 2023.

**Correção:** remover a barra das páginas institucionais, mantendo-a apenas onde o
compartilhamento faz sentido (eventos, campanhas). Onde permanecer, atualizar o rótulo.
**Aceite:** nenhuma página institucional exibe convite a compartilhar.

### [ ] 25 — Fax anunciado como canal de contato
**Heurística:** 02 — Correspondência com o mundo real · **Página:** `/contato/`

A página traz "Tel.: (19) 3404.1569 | Fax: 3404.1569" — fax com o mesmo número do
telefone e sem código de área —, enquanto o WhatsApp, canal efetivamente usado pela
entidade, não é mencionado.

**Correção:** remover o fax e incluir o WhatsApp entre os canais.
**Aceite:** os canais listados são os que a entidade de fato atende.

---

## Achado adicional — identificado na prototipação

### [ ] 27 — Contraste insuficiente no botão de doação
**Heurística:** 04 — Consistência e padrões (critério de acessibilidade) · **Páginas:** todas

O rosa `#FF448D` do botão "Doe agora" não sustenta texto legível em nenhuma das duas
combinações usadas ou propostas até aqui:

| Combinação | Contraste | AA para texto normal (4.5:1) |
|---|---|---|
| Branco sobre `#FF448D` | ≈ 3,25:1 | reprova |
| `#063560` sobre `#FF448D` | ≈ 3,83:1 | reprova |

O site atual usa branco. A proposta visual troca por azul escuro e afirma alcançar
4,5:1 — mas, se o azul usado for o institucional `#063560`, ainda reprova. É o botão
mais importante do site e aparece em todas as páginas, o que amplia o alcance da falha.

**Correção:** uma das duas saídas, nunca as duas pela metade.

1. Manter o rosa como fundo e usar texto bem mais escuro que o institucional — a partir
   de `#042440` o par alcança ≈ 4,85:1.
2. Escurecer o próprio rosa até que o branco alcance 4,5:1, preservando a família
   cromática.

A opção 1 preserva melhor a identidade atual. Decida uma, aplique em todas as
ocorrências do botão e registre a escolha no commit.

**Aceite:** verificador de contraste acusa no mínimo 4,5:1 na combinação final, em
todas as ocorrências do botão, inclusive nos estados `hover` e `focus`.

