# Site da APAE de Limeira: protótipo de correções

Cópia estática do site www.apaelimeira.org.br, reconstruída a partir do site em
produção em 26/10/2026. Os 27 achados da avaliação heurística são corrigidos sobre
essa base, um commit por achado.

- [`CLAUDE.md`](CLAUDE.md): regras do projeto (identidade visual, dados da entidade, terminologia, commits).
- [`ACHADOS.md`](ACHADOS.md): especificação. Cada achado traz a correção e o critério de aceite.
- [`proposta-ui/extraido/`](proposta-ui/extraido/): proposta visual das telas corrigidas.

## Como abrir

O site é HTML, CSS e JavaScript puros e não precisa de build. Os links usam URLs de
pasta (`/doacoes/`), então ele precisa ser servido por HTTP. Abrir o arquivo direto
no navegador não funciona.

```bash
python -m http.server 8080 --directory site
```

Depois, acesse http://localhost:8080.

## Estrutura

```
site/
  index.html                 home
  busca/index.html           resultados da busca (equivale a /?s= no WordPress)
  <slug>/index.html          310 páginas e 370 publicações, nas mesmas URLs da produção
  assets/css/estilo.css      estilos do tema, do Elementor e dos componentes
  assets/js/layout.js        cabeçalho, rodapé e aviso de cookies (um só lugar para todas as páginas)
  assets/js/principal.js     menu, busca, carrosséis, cookies, compartilhar, formulário
  assets/js/busca-indice.js  índice de busca gerado a partir do conteúdo
  storage/, wp-content/      imagens baixadas, no mesmo caminho das URLs originais
ferramentas/reconstrucao/    script que gerou a base (usado uma vez, antes do primeiro commit)
```

## O que a base reproduz de propósito

A base copia o site como ele está hoje, **inclusive os problemas** apontados em
`ACHADOS.md`. Exemplos:

- os itens de menu com submenu usam `href="#"`;
- o banner não tem link;
- a busca exibe "Nothing Found" e "Read more";
- o formulário só valida depois do envio e mantém a pergunta antispam.

Assim, cada commit de correção mostra o antes e o depois.

## Limitações da cópia estática

- **Formulário de contato:** não há servidor. O envio é simulado no navegador, com as
  mesmas mensagens e o mesmo momento de validação do Contact Form 7.
- **Imagens:** as imagens da home e das páginas do menu estão no repositório. As
  subpáginas da Transparência e as publicações antigas ainda carregam as imagens do
  site em produção.
- **Links externos:** documentos (Google Drive, PDFs) e o mapa continuam apontando
  para os endereços originais.
