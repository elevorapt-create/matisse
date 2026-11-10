# Matisse — estado de implementação

Atualizado em 10 de novembro de 2026. Esta versão foi publicada e verificada no Worker existente. Os resultados do deploy e dos testes no endereço público estão em `PUBLICACAO.md`.

## Implementado

- Landing page em português, responsiva, com paleta e logótipos oficiais e duas imagens editoriais criadas com IA, identificadas como ilustrações.
- Formulário único: nome, e-mail, WhatsApp e serviço; campos opcionais para preferência temporal, objetivo e observações. Marketing e medição são escolhas facultativas e separadas.
- Worker com validação no servidor, limite de tamanho, verificação de origem, honeypot, tempo mínimo e rate limit persistente. O WhatsApp só fica disponível após confirmação da gravação. Nenhuma mensagem é enviada automaticamente.
- CRM: seis estados, métricas globais, grupos por serviço/origem/estado, taxa baseada nos estados atuais, listagem dos 500 pedidos mais recentes, pesquisa, filtros, histórico e eliminação de dados. Alterações concorrentes de estado são verificadas antes de confirmar.
- Administração protegida por palavra-passe derivada com PBKDF2, sessões opacas de oito horas, cookie HttpOnly/SameSite Strict/Secure em HTTPS, rate limit e revogação no logout. Não existe gestão multiutilizador.
- Eventos PageView/ViewService/OpenLeadForm/ClickWhatsApp mediante consentimento. Lead/Schedule/AppointmentAttended apenas no servidor após operações confirmadas, com deduplicação. UTMs não são guardadas sem consentimento de medição.
- Limpeza automática diária: pedidos e histórico após 180 dias sem atualização; eventos após 90 dias; auditoria administrativa não associada a pedidos após 365 dias; sessões e limites expirados eliminados. Teste em SQLite local verifica expurgo e preservação dos dados recentes.
- Privacidade, cookies e utilização do website descrevem os dados e funcionalidades implementados, com contacto transcrito dos materiais oficiais. Não há pagamento, reserva automática ou taxas de cancelamento inventadas.
- CSP e cabeçalhos de segurança; respostas da API sem cache; noindex/nofollow, robots bloqueado e sitemap provisório vazio. Canonical/indexação ficam dependentes do domínio definitivo.

## Cloudflare

- Conta autenticada pelo token introduzido pelo utilizador, sem expor o valor. Worker existente `matisse` confirmado; antes desta publicação respondia «Hello world» e não tinha bindings.
- Criada base exclusiva `matisse-crm`, jurisdição UE, ID d7c2fd8b-5cd2-4680-adff-e2fee1930234, ligada como DB. Duas bases de outro projeto existentes na conta não foram alteradas.
- Migrations 0001 e 0002 aplicadas na base remota. Configurados ADMIN_PASSWORD_HASH e SESSION_SECRET exclusivos de produção; sem reutilizar a palavra-passe de testes.
- Cloudflare Builds: consulta devolve 403 com este token. Não se pode afirmar que main está ligado ao deploy automático. O deploy desta versão é feito diretamente com Wrangler no Worker existente, depois do push do código testado para main.
- Nenhum Worker, domínio ou repositório alternativo foi criado.

## Validação

- `npm run check`: sintaxe dos módulos.
- `npm test`: oito testes, incluindo limpeza de dados em SQLite/workerd.
- Smoke test: gravação, idempotência, validação, origem, eventos, autenticação, pipeline, histórico, apagamento e revogação da sessão.
- Quatro testes Chromium: desktop, mobile, falha de gravação e login do CRM.
- `npm run build`: dry-run do bundle e configuração Cloudflare.
- Verificação pública pós-deploy: resultados e versão em `PUBLICACAO.md`.

## Materiais e limites

- Logótipo/sublogo e paleta do ZIP oficial preservados. Le Grand Capital e High Spirited não foram fornecidas como fontes web; texto usa Georgia/Arial, enquanto o logótipo mantém a tipografia original.
- Retratos enviados inline foram vistos, mas não estão expostos como ficheiros nesta máquina. O utilizador autorizou imagens geradas: foram criadas duas imagens editoriais sem representar a Jaine, clientes, resultados, produtos endossados ou o espaço real.
- WhatsApp confirmado pelo utilizador: +351 928 276 081. Morada e e-mail transcritos do cartão oficial. Não foram inventados horários, qualificações, biografia, preços, avaliações ou resultados.
- Galeria de clientes e avaliações não são apresentadas enquanto não houver materiais verificáveis. Os serviços correspondem à lista inicial fornecida pelo utilizador.
- Não existe integração ativa Google Ads, Google Analytics ou Meta. Não se afirma validação de conversões nessas plataformas. O envio exige os identificadores e configuração respetivos.
- As condições específicas de cada marcação devem ser combinadas diretamente com a Matisse. Não foi criada uma política com prazos ou penalizações fictícias.
