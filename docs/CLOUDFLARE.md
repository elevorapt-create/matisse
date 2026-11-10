# Acesso e publicação no Worker existente

O utilizador autorizou a publicação e imagens editoriais geradas com IA. Não criar outro Worker ou usar uma conta temporária. O destino é exclusivamente o Worker `matisse` da conta que responde por `matisse.elevora-pt.workers.dev`.

## Acesso em falta

`wrangler whoami` confirmou ausência de autenticação nesta sessão. A configuração do ambiente não contém credenciais Cloudflare. A autorização verbal permite o trabalho, mas não fornece acesso à conta.

Foi guardado no rascunho do ambiente o requisito secreto `CLOUDFLARE_API_TOKEN`, destinado apenas a `api.cloudflare.com`; o domínio foi incluído automaticamente no acesso de rede. Nenhum valor foi pedido no chat, guardado no repositório ou inventado.

Na conta Cloudflare da Elevora, criar token personalizado em https://dash.cloudflare.com/profile/api-tokens com:

- Account / Workers Scripts / Edit.
- Account / D1 / Edit.
- Account / Account Settings / Read, para identificar a conta.
- Account Resources: apenas a conta da Elevora que contém o Worker existente. Não conceder permissões DNS/zonas nem acesso a outras contas.

Introduzir o valor em `CLOUDFLARE_API_TOKEN` nas definições seguras deste ambiente, guardar o rascunho e publicar a configuração quando a interface o exigir. O rascunho guardado pelo agente não aplica credenciais à máquina.

## Sequência depois de o acesso estar disponível

1. Atualizar o estado observado do ambiente e verificar o binding sem imprimir o valor.
2. Executar `wrangler whoami` com a configuração de proxy/CA fornecida. Confirmar a conta correta; não escolher automaticamente outra conta por conveniência.
3. Consultar os settings e bindings do Worker `matisse` e a integração Cloudflare Builds existente. Confirmar a branch `main`, comandos e diretório raiz antes de afirmar que o push dispara deploy.
4. Identificar e reutilizar a persistência adequada. Se não houver D1, preparar a base necessária ao CRM na mesma conta, após confirmar que não duplica uma base existente. Não reutilizar tabelas incompatíveis. Substituir o identificador D1 nulo apenas pelo ID confirmado.
5. Separar autenticação/segredos de desenvolvimento e produção. Nunca transferir .dev.vars ou a palavra-passe administrativa de testes para produção. Configurar os segredos do Worker de forma segura; combinar um meio seguro para entregar acesso administrativo.
6. Manter CONTACT_ENABLED=false enquanto os dados de privacidade e condições reais não forem aprovados; a primeira publicação informativa não deve captar dados pessoais com informação legal incompleta.
7. Executar testes e dry-run com os bindings finais, publicar no Worker existente, confirmar o deployment e fazer pedidos reais ao endereço provisório. Só chamar à publicação concluída após essa verificação.

## Imagens

Duas imagens editoriais criadas com IA por autorização do utilizador, convertidas para WebP sem alterar o conteúdo visual: `editorial-cabelo.webp` e `editorial-cuidado.webp`. Legendas e texto alternativo identificam a origem ilustrativa. Não representam clientes, trabalhos da Matisse, produtos endossados ou o espaço real. Nenhuma pessoa fictícia foi apresentada como Jaine.
