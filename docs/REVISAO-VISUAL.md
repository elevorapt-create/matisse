# Revisão visual segundo a referência enviada

Estado: revisão local testada, não enviada para main nem publicada. A tipografia exata pedida pelo utilizador é um requisito ainda pendente de ficheiros.

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

## Tipografia — requisito ainda não concluído

O manual confirma Le Grand Capital (Calamar) e High Spirited (Octotype). Não existem ficheiros .otf, .ttf, .woff ou .woff2 dessas fontes no ZIP fornecido.

Os PDFs contêm subsets de fontes, não os desenhos completos. A inspeção das tabelas glyf confirmou, por exemplo, apenas os desenhos ABCDESabcde num dos subsets Le Grand Capital, apesar de a tabela cmap enumerar muitos outros caracteres. Os restantes subsets das aplicações também só contêm as letras efetivamente usadas em cada arte. Extraí-los como uma suposta fonte completa faria desaparecer letras do website.

CSS identifica os nomes das famílias oficiais, mas ainda utiliza uma fonte de sistema para permitir trabalhar na composição local. Isso não significa que Le Grand Capital ou High Spirited estejam carregadas. Não publicar esta revisão como concluída sem os ficheiros originais e sem verificar visualmente a tipografia aplicada.

O logótipo continua a usar a arte original, que já preserva as suas letras e assinatura.

## Materiais

Mantidas as imagens editoriais anteriores e criadas duas adicionais com a autorização existente: hero-panoramico.webp e editorial-tecnica.webp. São explicitamente identificadas como IA e não representam a Jaine, clientes ou trabalhos realizados.

Não foram fabricados profissionais, preços, avaliações, vídeo ou mapa do espaço para preencher as secções da referência. A morada e a ligação funcional ao mapa mantêm os dados dos materiais oficiais.

## Validação local

- Seis testes de browser passaram: os quatro fluxos anteriores, serviço selecionado a abrir o mesmo formulário e pedido gravado diretamente no formulário do final da página.
- Smoke test de backend, autenticação e pipeline passou.
- Sem erros JavaScript na navegação inspecionada.
- Sem overflow horizontal em desktop 1440 px e mobile 390 px.
- Build/dry-run concluído sem publicação.
- Pré-visualizações guardadas fora do checkout em /workspace/matisse-design-review/. A fonte de sistema visível nessas imagens é temporária; falta receber os dois ficheiros de fonte.
