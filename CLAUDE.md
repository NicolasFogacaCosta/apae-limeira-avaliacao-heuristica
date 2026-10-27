# CLAUDE.md — Projeto de correção do site da APAE de Limeira

Este repositório contém uma cópia reconstruída (reverse engineering) do site
institucional da APAE de Limeira — www.apaelimeira.org.br. O objetivo do projeto é
**corrigir os 26 achados de usabilidade** registrados na avaliação heurística do
Grupo FF (disciplina SI406, Faculdade de Tecnologia da Unicamp), **mantendo o site
reconhecível como o mesmo site**.

Leia `ACHADOS.md` antes de qualquer alteração. Ele é a especificação deste projeto.

---

## Regra central

> Mantenha a base. Altere apenas o que está em `ACHADOS.md`.

Toda alteração precisa ser rastreável a um achado numerado. Se uma mudança que
você considera boa não corresponde a nenhum achado, **não a faça** — registre a
sugestão em `SUGESTOES.md` e siga em frente.

Não faça, em nenhuma hipótese, sem pedido explícito:

- migração para framework (React, Vue, Next, Astro, Tailwind, bundlers);
- redesenho visual de páginas ou seções que não estão em `ACHADOS.md`;
- troca de tipografia, paleta, grid ou espaçamento geral do site;
- renomeação ou remoção de arquivos, páginas ou URLs existentes;
- reescrita de textos institucionais que nenhum achado aponta como problema;
- inclusão de analytics, pixels, fontes externas novas ou bibliotecas pesadas;
- "limpeza" ou refatoração oportunista de código não relacionado ao achado.

## Identidade visual — valores extraídos do site em produção

Use estes valores. Não substitua por aproximações nem por uma paleta "melhor".

| Token | Valor | Uso |
|---|---|---|
| `--azul-institucional` | `#063560` | barra superior, rodapé, títulos de seção |
| `--amarelo` | `#F5AB32` | destaques, detalhes de apoio, sublinhados |
| `--rosa-doacao` | `#FF448D` | exclusivo do botão de doação |
| `--texto` | `#404040` | corpo de texto |
| `--fundo-alt` | `#F3F5F7` | blocos de fundo alternado |
| `--branco` | `#FFFFFF` | fundo padrão |

Tipografia: **Montserrat** em títulos e botões, **Open Sans** no corpo (mínimo 16px).
A fonte decorativa *Engagement* aparece em alguns títulos de seção do site original —
preserve onde já existe, não amplie o uso.

## Dados reais da entidade

Use sempre estes valores. **Nunca invente** telefone, e-mail, chave PIX, CNPJ, data
de evento, valor de inscrição ou prazo.

- Endereço: Av. Antônio D'Andréa, 364 — Parque Nossa Senhora das Dores — Limeira/SP — CEP 13483-000
- Telefone geral: (19) 3404-1569
- E-mail geral: apae@apaelimeira.org.br
- WhatsApp de doações: (19) 99304-6428
- WhatsApp do Teste do Pezinho: (19) 97164-2831
- Ouvidoria: ger.geral@apaelimeira.org.br
- Centro de Apoio Diagnóstico: cad@apaelimeira.org.br

Onde um dado for necessário mas desconhecido, use um marcador visível no formato
`[a confirmar com a entidade: chave PIX]`. Um marcador explícito é aceitável; um
dado inventado não é.

## Estrutura de navegação correta

```
Home | Quem Somos | Programas | Projetos | Serviços | Eventos | Transparência | Contato/Ouvidoria
```

- **Quem Somos**: A Entidade, A Diretoria, Conselhos, Política de Qualidade, Parceiros, Revista 50 anos
- **Programas**: Centro de Ações Preventivas, Centro de Apoio Diagnóstico, Centro de Atenção Terapêutica, Escola de Educação Especial "João Ometto", Centro Profissionalizante e de Convivência
- **Projetos**: EquoterAPAE, APAE Esporte, APAE Cultural, Conexão Teen
- **Serviços**: Teste do Pezinho, Bazar e Estacionamento, Organização de Eventos, Fábrica de Paletes
- **Eventos**: Da Prevenção à Inclusão, APAE Motor Rock, APAE Running, APAE Beach Tennis, Selo Empresa Cidadã

Cada um dos cinco itens com submenu deve abrir **uma página de seção própria** listando
seus itens. Nenhum item de menu pode apontar para `/` (achado 04).

## Idioma e terminologia

- Tudo em português do Brasil. Nenhuma palavra em inglês em rótulo, botão, título ou
  mensagem de sistema — inclusive mensagens de busca vazia, paginação e "leia mais".
- Use **"pessoa com deficiência"** e **"deficiência intelectual"**.
- Nunca use "portador de deficiência", "deficiência mental", "retardo mental",
  "excepcional" (exceto no nome oficial da entidade) ou "doença mental" como sinônimo
  de deficiência.
- Ortografia conforme o Acordo Ortográfico vigente: "frequentes", "ideias",
  "socioeconômicas", "dia a dia".

## Acessibilidade — requisito, não enfeite

O público principal do site são responsáveis por pessoas neurodivergentes, e parte dos
usuários depende de tecnologia assistiva.

- Contraste mínimo 4.5:1 em texto normal, 3:1 em texto grande e em componentes.
- Todo campo de formulário com `<label for>` associado. Nunca apenas `placeholder`.
- Campos obrigatórios marcados visualmente e com `required` no HTML.
- Todo link e botão com texto descritivo. Nenhum "clique aqui", "saiba mais" solto.
- Toda imagem informativa com `alt` descritivo; imagem decorativa com `alt=""`.
- Alvos de toque de no mínimo 44×44px.
- Navegação completa por teclado, com foco visível.
- Hierarquia de títulos sem saltos (`h1` → `h2` → `h3`).

## Disciplina de commits

Um commit por achado corrigido. O histórico do Git é parte da entrega acadêmica e
precisa mostrar a correspondência entre avaliação e correção.

```
achado 04: menu principal abre páginas de seção em vez de voltar à home

Corrige o href="/" dos itens Quem Somos, Programas, Projetos, Serviços e Eventos,
criando as cinco páginas de seção correspondentes.

Heurística 04 — Consistência e padrões | Severidade 4 — Grave
```

Não agrupe achados não relacionados no mesmo commit. Não faça commit de alterações
que não estejam descritas em `ACHADOS.md`.

## Como trabalhar

1. Leia `ACHADOS.md` inteiro antes de começar.
2. Antes de editar, mapeie qual arquivo do repositório corresponde à página do achado.
3. Corrija um achado por vez, na ordem de severidade (5 → 4 → 3 → 2).
4. Verifique o critério de aceite do achado antes de dar por concluído.
5. Marque o achado como feito em `ACHADOS.md` (`[ ]` → `[x]`) no mesmo commit.
6. Se um achado não puder ser corrigido no repositório (depende de servidor, de
   plataforma de pagamento ou de decisão da entidade), **não simule a solução**:
   registre a limitação em `PENDENCIAS.md` com o que seria necessário.
