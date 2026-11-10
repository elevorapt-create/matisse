# Revisão visual segundo a referência enviada

Estado: revisão autorizada para publicação. O utilizador informou que não tem os ficheiros originais e pediu a melhor aproximação possível ao modelo. A publicação é registada em PUBLICACAO.md após verificação.

## Composição revista

- Cabeçalho compacto com fundo claro e navegação em linha.
- Hero panorâmico, fotografia editorial e caixa de texto sobreposta à esquerda, com cantos arredondados.
- Título e três pilares centrados, com maior espaçamento vertical.
- Serviços em cartões fotográficos horizontais, com texto sobreposto e navegação por posições.
- Secção institucional em duas colunas, imagem à esquerda e copy à direita.
- Área de serviços com seletor lateral, fotografia, descrição e contacto contextualizado.
- Secção de três etapas em fundo claro, imagem editorial horizontal, perguntas frequentes e formulário no final da página.
- Faixa de fotografias editoriais, chamada final e rodapé com contactos e navegação.
- Um único formulário: fica no final da página e é movido para o modal quando se utiliza um CTA. Ao fechar o modal, regressa ao local original, sem duplicar IDs, componentes ou handlers.

## Tipografia adotada com autorização do utilizador

O manual identifica Le Grand Capital (Calamar) e High Spirited (Octotype). Como não foram fornecidos os ficheiros completos e o utilizador autorizou uma aproximação, são utilizadas Bodoni Moda nos títulos e Allura no detalhe manuscrito. Não são apresentadas como as fontes originais.

As fontes foram obtidas do repositório oficial google/fonts (ofl/bodonimoda e ofl/allura), convertidas para WOFF2 e alojadas no próprio website. As licenças OFL acompanham os ficheiros em public/assets/fonts/. A cobertura dos caracteres acentuados portugueses foi verificada. O browser valida o carregamento real de Bodoni Moda e a família efetivamente aplicada ao título.

O logótipo continua a usar a arte original, com a sua tipografia e assinatura intactas. A composição não altera os ficheiros oficiais do logótipo.

## Materiais

Mantidas as imagens editoriais anteriores e criadas duas adicionais com a autorização existente: hero-panoramico.webp e editorial-tecnica.webp. São explicitamente identificadas como IA e não representam a Jaine, clientes ou trabalhos realizados.

Não foram fabricados profissionais, preços, avaliações, vídeo ou mapa do espaço para preencher as secções da referência. A morada e a ligação funcional ao mapa mantêm os dados dos materiais oficiais.

## Validação local

- Seis testes de browser passaram: os quatro fluxos anteriores, serviço selecionado a abrir o mesmo formulário e pedido gravado diretamente no formulário do final da página.
- Smoke test de backend, autenticação e pipeline passou.
- Sem erros JavaScript na navegação inspecionada.
- Sem overflow horizontal em desktop 1440 px e mobile 390 px.
- Build/dry-run concluído sem publicação.
- Pré-visualizações guardadas fora do checkout em /workspace/matisse-design-review/. As prévias finais incluem as famílias de aproximação autorizadas, alojadas localmente.
