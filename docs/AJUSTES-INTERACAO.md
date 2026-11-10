# Ajustes de identidade, interação e conteúdo

## Alterações

- Cabeçalho usa LOGO MD_A.png e rodapé usa LOGO MD_AP.png, versões transparentes oficiais já fornecidas. As cópias têm conteúdo binário idêntico aos originais, com 6806 × 6807 e 6807 × 6807 pixels e canal alfa. Não houve reamostragem, redesenho ou alteração de cores.
- Menu sem estado vermelho permanente; cor da marca no hover/foco. CTAs usam o vermelho #b13015 no hover, com transição e deslocamento discreto; respeitam preferência por movimento reduzido.
- Hero com painel vermelho a 78% de opacidade e sem o botão “Conhecer serviços”.
- Secção “Um visual pensado para si”: sem paginação e sem CTAs nos cartões, com um único botão vermelho após o carrossel. Arrasto com rato, scroll por toque nativo e navegação por teclado.
- Secção de etapas substituída por cartões de Jaine Matos e Jhon, conforme nomes confirmados pelo utilizador. Os cartões utilizam iniciais e identidade oficial; não foram fabricados retratos, especialidades, qualificações, números pessoais ou perfis sociais individuais.
- Localização e formulário: removido o bloco lateral de contactos/endereço; adicionado mapa Google Maps com a morada confirmada pelo utilizador: Av. da República 1226, 7.º andar, 4430-204 Vila Nova de Gaia. O link externo mantém exatamente https://maps.app.goo.gl/RbegZRbY7zArmb5v8.
- O mapa só carrega após ação “Mostrar mapa”, para estabelecer ligação ao Google por escolha do visitante. Mantida uma ligação externa ao mapa como alternativa. CSP permite frames apenas de www.google.com.
- Removidos os campos “Quando pretende realizar o serviço?” e “O que gostaria de alcançar?” do componente único de formulário, abrangendo a versão inline e o modal. Registos históricos do CRM foram preservados.
- Rodapé preenchido com #b13015, logo branco transparente oficial e ícone Instagram ligado a @matisse.pt.
- Informação de privacidade/cookies atualizada para os campos atuais e para o mapa opcional; código postal do rodapé atualizado com a confirmação do utilizador.

## Verificação

Oito testes automatizados, oito testes de browser locais e smoke test passaram. Os testes novos exercitam arrasto real com rato, gesto de toque móvel, remoção dos CTAs/paginação e carregamento do iframe apenas após escolha. A correspondência do iframe com a morada confirmada é verificada. Nos testes do mapa, a requisição externa é interrompida deliberadamente: isto valida o componente e o consentimento, não o conteúdo servido pelo Google.

Inspeção em 1440 px e 390 px sem overflow horizontal; rodapé computado como rgb(177,48,21); variantes e resolução dos logos confirmadas contra os originais.

## Limitação de rede do ambiente

A abertura do link curto foi bloqueada pela política de rede. A morada foi obtida diretamente do utilizador. Foram guardados no rascunho os domínios maps.app.goo.gl, www.google.com e maps.google.com, preservando os domínios existentes. É necessário rever/guardar/publicar essa configuração do ambiente para permitir ao agente validar o conteúdo externo do Google Maps nesta nuvem. A incorporação no site usa HTTPS e a morada confirmada; nenhum endpoint do site necessita de aceder ao Google pelo servidor.

## Ícone Instagram, carrossel de profissionais e logo vetorial

- Removido o texto @matisse.pt do rodapé; mantidos o ícone, a ligação e o nome acessível para leitores de ecrã.
- Cartões de profissionais com as mesmas dimensões dos cartões de serviços: 265 × 365 px em desktop e 78% da largura disponível × 370 px em mobile. O carrossel de dois profissionais usa uma janela com parte do cartão seguinte visível, permitindo efetivamente arrastar mesmo com apenas duas pessoas.
- Ambos os carrosséis partilham o comportamento de rato, teclado e toque nativo. Interações nos botões/links dos cartões não iniciam arrasto.
- Logos do cabeçalho, rodapé e cartões substituídos por SVGs transparentes extraídos dos PDFs vetoriais oficiais LOGO MD_A.pdf e LOGO MD_AP.pdf. Os textos do logo foram preservados como contornos, sem fontes externas e sem imagens raster dentro dos SVGs. O enquadramento inclui a marca completa e a assinatura. Removido o posicionamento que recortava a imagem do cabeçalho.
- Nove testes de browser locais passaram, incluindo equivalência das dimensões em 1440/390 px, rato no carrossel profissional, toque em ambos e funcionamento do botão de contacto após arrasto. Build/dry-run passou. Inspeção visual do logo realizada com escala de ecrã 2×.
