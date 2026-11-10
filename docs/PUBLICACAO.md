# Publicação verificada — 10 de novembro de 2026

## Endereços

- Website: https://matisse.elevora-pt.workers.dev/
- CRM protegido: https://matisse.elevora-pt.workers.dev/admin

## Código e infraestrutura

Código funcional enviado para main no commit 519d304, após a preparação de produção em 641c1e3. Publicado no Worker existente `matisse`, sem criar outro Worker, domínio ou repositório.

Base D1 exclusiva `matisse-crm`, jurisdição EU, ID d7c2fd8b-5cd2-4680-adff-e2fee1930234; migrations 0001 e 0002 aplicadas. Os segredos administrativos de produção são diferentes dos utilizados localmente. Nenhum valor de segredo foi enviado ao GitHub.

O deploy direto devolveu a versão 3510f3e5-752e-4150-9e70-5591436b877d. Na verificação posterior, a API indicou a versão ativa 02935b78-ed20-4ca0-9103-862c8f34effe, publicada pelo Wrangler às 15:35:33 UTC, com o mesmo ETag de código da versão anterior: 2aba1d0d2dca040ff4a1bdac9d1ea4671d0268a26b220a603528f3eb0c9939ea. A consulta de Cloudflare Builds continua a devolver 403; a ocorrência de outro upload não comprova, por si só, o repositório/branch associado.

## Verificações concluídas

- Sintaxe e build/dry-run passaram.
- Oito testes automatizados passaram, incluindo derivação de palavra-passe e retenção com SQLite/workerd real.
- Smoke test no endereço público passou: página HTML e cabeçalhos, bloqueio de leitura administrativa sem sessão, verificação de origem, validação de dados e eventos, gravação de lead, idempotência, ligação WhatsApp, login, três transições de estado, histórico, apagamento e revogação no logout.
- Quatro testes Chromium no endereço público passaram: desktop com formulário e registo, mobile sem overflow e com navegação por teclado, erro de gravação sem disponibilizar WhatsApp e entrada/saída no CRM.
- A verificação TLS permaneceu ativa. Foi necessário executar Chromium com acesso à base NSS de confiança fornecida pelo ambiente, fora do sandbox de ficheiros de leitura. Não foi usado ignoreHTTPSErrors nem desativada a verificação de certificados.
- Uma falha inicial de autenticação em produção foi corrigida com formato PBKDF2-SHA256 de 100000 iterações compatível com o runtime; a palavra-passe administrativa é aleatória, de elevada entropia, e o login tem rate limit.
- Os pedidos sintéticos das verificações foram eliminados. A sessão de validação foi encerrada. Não foram enviadas mensagens reais por WhatsApp.
- Cron de retenção `17 3 * * *` confirmado pela API. A execução futura do cron ainda não foi observada; a rotina passou no teste local com dados expirados e recentes.

## Acesso administrativo

As credenciais são entregues num ficheiro privado fora do checkout e dos assets. Não as incluir em documentação, commits, screenshots ou mensagens públicas. A palavra-passe não consta deste relatório.

## Limites preservados

Noindex/nofollow e robots bloqueado no domínio provisório. Google Ads, Meta e Analytics não ativados. Galeria de resultados e avaliações reais não foram fabricadas. As duas imagens editoriais estão identificadas como criadas com IA. Fontes web oficiais e fotografias originais em ficheiros continuam disponíveis para integração futura quando forem fornecidas; o logótipo original está preservado.

## Revisão visual publicada — referência e tipografia aproximada

O utilizador confirmou que não possui os ficheiros originais e autorizou reproduzir o modelo da melhor forma e publicar. A revisão local 26e1c1c e a finalização 07e15a9 foram enviadas para main.

Publicada a composição revista: hero panorâmico com painel sobreposto, serviços fotográficos horizontais, apresentação em duas colunas, seletor de serviços, imagem editorial, formulário reutilizável também no final da página e rodapé reorganizado.

Tipografia: Bodoni Moda para títulos e Allura para o detalhe manuscrito, alojadas localmente com licenças OFL. São aproximações autorizadas, não as fontes originais Le Grand Capital e High Spirited. O logótipo oficial não foi alterado. O carregamento efetivo das fontes foi observado no browser.

Wrangler confirmou publicação no Worker existente, versão a3149f10-5b9c-4e0c-9b4b-d753166e0652. A página pública respondeu HTTP 200 e /api/health respondeu ok. Os seis testes de browser passaram no URL público, com TLS ativo: formulário modal, mobile sem overflow, falha de gravação, CRM, seletor de serviços e registo no formulário do final da página. Os pedidos sintéticos criados pelos testes foram eliminados pelos próprios testes.

Antes da publicação passaram os oito testes automatizados, os seis testes de browser locais, o smoke test de integração e o build/dry-run. A infraestrutura D1, os segredos administrativos e o backend foram preservados.
