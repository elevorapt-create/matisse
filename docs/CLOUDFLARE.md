# Cloudflare — operação

## Destino

Usar exclusivamente o Worker existente `matisse`, na conta Elevora, que serve https://matisse.elevora-pt.workers.dev/. O utilizador autorizou publicação e imagens editoriais geradas. A configuração testada está em `wrangler.jsonc`; a base D1 `matisse-crm` tem jurisdição UE.

## Credenciais

O token CLOUDFLARE_API_TOKEN é fornecido pelo ambiente através da rota autorizada para api.cloudflare.com. Não o copiar, imprimir ou colocar no repositório. Acesso de leitura/escrita Workers e D1 foi verificado por operações reais. A consulta Cloudflare Builds devolveu 403; não pedir outro token para realizar o deploy manual já autorizado.

ADMIN_PASSWORD_HASH e SESSION_SECRET são segredos do Worker e diferentes dos valores locais de desenvolvimento. O ficheiro privado `/workspace/matisse-private/production-admin.json` não está no checkout nem é um asset público. Nunca o copiar para a pasta public, documentação ou commits.

## Atualizações

1. Usar o checkout existente, preservando alterações do utilizador.
2. Rever migrations e destino antes de executar `npx wrangler d1 migrations apply matisse-crm --remote`. As migrations 0001 e 0002 já estão aplicadas.
3. Executar os testes do README e `npm run build` (dry-run).
4. Rever o diff, fazer commit e push para main conforme autorização vigente.
5. Enquanto a integração Cloudflare Builds não estiver confirmada, fazer deploy direto com `XDG_CONFIG_HOME=/tmp/matisse-config WRANGLER_SEND_METRICS=false npx wrangler deploy`.
6. Confirmar a versão indicada pelo Wrangler, GET /, /api/health e /api/config no endereço público; testar um pedido sintético, administração e apagamento desse pedido. Não disparar mensagens WhatsApp reais.
7. Registar evidência em PUBLICACAO.md. Não afirmar deploy automático por main sem o verificar.

## Retenção

O trigger diário `17 3 * * *` corre a limpeza de dados às 03:17 UTC. Há teste de integração com SQLite/workerd que confirma a eliminação de pedidos antigos e dos respetivos dados e a preservação de registos recentes. A primeira execução agendada de produção só pode ser afirmada depois de observada; a configuração do cron não comprova execução futura.
