# Matisse — estado de implementação

## Concluído e testado localmente

- Landing page em português, responsiva, cores oficiais #fafafa, #1e1e1c e #b13015. Logótipo e sublogo originais copiados sem alteração do ZIP autorizado.
- Formulário modal único para todos os CTAs de contacto, incluindo o botão flutuante. Ícone WhatsApp; navegação por teclado, Escape, foco e estados de erro.
- Nome, e-mail, telefone e serviço obrigatórios. Preferência temporal, objetivo e observações opcionais. Marketing e medição independentes e opcionais.
- Worker com validação de servidor, limite de tamanho de pedidos, verificação de origem, honeypot, tempo mínimo e rate limit persistente. Sem envio de mensagens automáticas.
- D1 local: leads, consentimentos, UTMs quando há medição, CTA, origem, estados e histórico. Gravação em transação e chave de idempotência. WhatsApp disponibilizado apenas após confirmação de persistência.
- CRM: seis estados, totais globais, grupos por serviço/origem/estado, taxa calculada sobre estado atual, lista dos 500 pedidos mais recentes, pesquisa/filtro, histórico e apagamento.
- Admin com palavra-passe derivada PBKDF2-SHA256, sessão opaca de oito horas, cookie HttpOnly, SameSite=Strict, Secure em HTTPS, revogação no servidor e rate limit de login. Um único perfil administrativo; não há gestão multiutilizador.
- Eventos de utilização apenas com consentimento de medição; conversões Lead, Schedule e AppointmentAttended registadas no servidor após gravação/transição. Chaves estáveis evitam duplicação. Google/Meta desativados.
- Cabeçalhos de segurança, CSP, respostas administrativas/API sem cache, noindex/nofollow e robots bloqueado. Sitemap provisório intencionalmente vazio; canonical de produção pendente de domínio definitivo.
- Documentos de privacidade/cookies provisórios, sem inventar dados legais. Formulário desativado na configuração publicada do código; a ativação existe apenas em .dev.vars local para testes.

## Auditoria externa

- Worker https://matisse.elevora-pt.workers.dev/: HTTP 200, text/plain, «Hello world» em 10/11/2026.
- Repositório GitHub elevorapt-create/matisse: vazio, default_branch main na API, sem referências Git, workflows ou deployments registados na API consultada.
- Consulta de webhooks: HTTP 403 «Resource not accessible by integration». Não permite confirmar ou excluir integração Cloudflare Builds. Não há acesso autenticado Cloudflare configurado nesta sessão.
- Não foi criado outro Worker, base remota, domínio ou repositório. A definição D1 no ficheiro Wrangler é um identificador nulo de desenvolvimento local, não uma base de produção existente.
- Não houve push ou deploy. A instrução mais recente de não publicar foi mantida.

## Materiais

Fontes locais: ZIP drive-download-20261018T224556Z-1-001.zip. Usados LOGO .png e SUBLOGO .png; paleta e aplicações consultadas como referência. Le Grand Capital e High Spirited estão indicadas no guia, mas os binários e as licenças web não foram fornecidos. O logótipo mantém a sua tipografia original; o restante texto usa Georgia/Arial provisoriamente.

As nove fotografias anexadas inline foram vistas na conversa e selecionadas editorialmente, mas não estão expostas como ficheiros nesta máquina. Nenhum retrato foi fabricado. Hero e secção sobre a Jaine usam temporariamente a identidade oficial; ainda faltam as fotografias em ficheiros acessíveis para a composição final. O ZIP de fotografias maior que 32 MiB não pôde ser transferido.

WhatsApp confirmado pelo utilizador: +351 928 276 081 (prevalece sobre o número antigo do cartão). Morada transcrita do cartão oficial: Avenida da República, 1226, 7.º andar, 4400-192 Vila Nova de Gaia. Horários não inventados.

## Pendências antes de produção

1. Confirmar no Cloudflare os settings do Worker existente, repositório/branch de Builds e bindings. Não há evidência suficiente para afirmar deploy automático por main.
2. Reutilizar, se existir, uma base D1 adequada. Se não existir, será necessário aprovar a criação/associação de persistência remota antes de a executar. Substituir database_id nulo pelo binding confirmado; aplicar migrations só após rever o destino e backups.
3. Configurar ADMIN_PASSWORD_HASH e SESSION_SECRET via mecanismo de segredos do Worker. Nunca publicar .dev.vars nem LOCAL_ADMIN_PASSWORD. Usar HTTPS.
4. Receber originais acessíveis dos retratos e trabalhos/salão. Não apresentar retratos como resultados de clientes. Galeria e avaliações foram omitidas até existirem trabalhos e testemunhos verificáveis.
5. Confirmar nomenclatura dos seis serviços inicialmente indicados, texto de apresentação, morada atual e horários. A apresentação não contém biografia, qualificações ou resultados inventados.
6. Rever responsável legal, NIF/contactos legais, fundamento do tratamento, fornecedores, retenção e exercício de direitos. Aprovar privacidade, cookies, termos e regras de marcação reais. Não há termos fictícios nem política de marcações publicada.
7. Definir retenção e executar o procedimento de eliminação correspondente; o apagamento individual já existe, mas não há expurgo automático com prazo inventado.
8. Só depois da revisão legal e operacional ativar CONTACT_ENABLED e WHATSAPP_NUMBER no ambiente público. Adicionar domínio definitivo/canonical, sitemap e indexação apenas após decisão de SEO.
9. Configurar IDs Google/Meta e rotas/concessões necessárias numa tarefa posterior. Não existe envio de conversões para essas plataformas; apenas infraestrutura interna validada.
10. Validar a fase final com fotografias, acessibilidade/performance em produção, autorização de publicação, push para main e confirmação de deploy no Worker existente. A ausência de push nesta sessão é intencional.

## Atualização após autorização de publicação

O utilizador autorizou imagens criadas e publicação. Foram geradas duas imagens editoriais ilustrativas, identificadas como IA no site, incorporadas no hero e na secção institucional. Não são resultados de clientes nem retratos da Jaine. Os logótipos oficiais permanecem intactos.

A restrição anterior de não publicar foi revogada pelo utilizador. `wrangler whoami` confirmou que falta autenticação Cloudflare. Foi guardado o requisito secreto CLOUDFLARE_API_TOKEN e o destino api.cloudflare.com nas definições do ambiente. Ver `CLOUDFLARE.md` para as permissões e a sequência de validação. A autorização não constitui acesso autenticado nem prova de deploy.
