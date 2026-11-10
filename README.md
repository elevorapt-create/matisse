# Matisse By Jaine Matos

Landing page e CRM para o Worker existente `matisse`. Implementação local: HTML/CSS/JavaScript, Cloudflare Workers e D1. Sem framework nem serviços externos adicionais no runtime.

**Estado:** versão preparada para o Worker existente com D1 de produção na UE. Consulte [docs/ESTADO.md](docs/ESTADO.md) para funcionalidades e limitações, e `docs/PUBLICACAO.md` para a evidência da publicação. Os comandos de desenvolvimento usam D1 local; a opção `--remote` atua sobre produção e deve ser usada apenas com revisão do destino.

## Desenvolvimento

Utilize o checkout existente em `/workspace/matisse`; cada tarefa cloud já é isolada. Não criar worktrees salvo pedido explícito.

```sh
cd /workspace/matisse
npm ci --cache /tmp/matisse-npm-cache
npm run db:local
npm run admin:setup
npm run dev
```

O comando admin:setup cria `.dev.vars` com permissões 0600 e recusa sobrescrever um ficheiro existente. Só executar uma vez; manter o ficheiro existente nas sessões seguintes. A palavra-passe local está em `LOCAL_ADMIN_PASSWORD` nesse ficheiro ignorado pelo Git. Não copiar nem mostrar valores em logs ou commits. O comando ativa o formulário exclusivamente no desenvolvimento local.

Website na porta 8787 e CRM em `/admin`. Verificação interna: GET `/api/health` deve responder `{"ok":true}`; GET `/api/config` confirma se o formulário está ativo. A verificação de saúde não comprova conectividade D1: utilizar o smoke test para validar persistência e autenticação.

## Validação

Com `npm run dev` em execução noutro terminal:

```sh
npm run check
npm test
npm run test:smoke
npm run test:browser
npm run build
```

Os testes browser usam Chromium em `/usr/bin/chromium`; ajustar `playwright.config.js` ao caminho aprovado noutro ambiente. O build é **exclusivamente um dry-run**, sem deploy. O smoke test usa dados sintéticos, autentica com a configuração local, valida o pipeline e apaga o pedido que criou. Os testes de browser podem deixar um pedido sintético `browser@example.invalid` no D1 local; podem ser removidos pelo CRM. Rate limits são reais, inclusive em testes; múltiplas execuções seguidas podem exigir aguardar a janela de 15 minutos ou usar um estado D1 local de testes isolado.

Migrations podem ser repetidas: só são aplicadas as pendentes. Nenhum segredo é necessário para a validação local além dos valores gerados no próprio ambiente.

## Publicação

Não existe script de deploy nem workflow automático incluído. O utilizador autorizou a publicação e o acesso Cloudflare já foi verificado. Fazer push para main depois dos testes e deploy com Wrangler no Worker existente. Ver `docs/CLOUDFLARE.md` para a sequência; o token atual não permite confirmar Cloudflare Builds. Não assumir deploy automático por main. Não criar outro Worker. Não assumir que processos locais, configuração .dev.vars ou autenticação sobrevivem a uma nova máquina.
