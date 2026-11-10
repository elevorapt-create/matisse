import {test,expect} from '@playwright/test';
import {readFileSync} from 'node:fs';
let browserLeadId;
test('desktop: consentimento, formulário e WhatsApp só após registo',async({page})=>{
 const events=[];page.on('request',req=>{if(req.url().endsWith('/api/events'))events.push(req);});
 await page.goto('/');await expect(page.getByRole('heading',{level:1})).toContainText('A sua beleza é única');await page.evaluate(()=>document.fonts.ready);expect(await page.evaluate(()=>document.fonts.check('40px \"Bodoni Moda\"'))).toBe(true);await expect(page.getByRole('heading',{level:1})).toHaveCSS('font-family','\"Bodoni Moda\", serif');
 await page.getByRole('button',{name:'Só necessários'}).click();expect(events).toHaveLength(0);
 await page.getByRole('button',{name:'Quero transformar o meu cabelo'}).click();
 await expect(page.getByRole('dialog')).toBeVisible();await expect(page.locator('#open-whatsapp')).toBeHidden();
 await page.getByLabel('Nome',{exact:true}).fill('Teste browser');await page.getByLabel('E-mail',{exact:true}).fill('browser@example.invalid');await page.getByLabel('WhatsApp',{exact:true}).fill('+351900000001');await page.getByLabel('Serviço pretendido').selectOption('Cortes femininos');
 await page.waitForTimeout(1600);const savedResponse=page.waitForResponse(r=>r.url().endsWith('/api/leads')&&r.request().method()==='POST');await page.getByRole('button',{name:'Registar pedido e continuar'}).click();const saved=await (await savedResponse).json();browserLeadId=saved.id;
 await expect(page.locator('#lead-success')).toBeVisible();await expect(page.locator('#open-whatsapp')).toHaveAttribute('href',/^https:\/\/wa.me\/351928276081/);expect(events).toHaveLength(0);
 await page.getByRole('button',{name:'Fechar formulário'}).click();await expect(page.getByRole('dialog')).not.toBeVisible();
});
test('mobile: sem overflow e formulário contextualizado acessível por teclado',async({page})=>{
 await page.setViewportSize({width:390,height:844});await page.goto('/');await page.getByRole('button',{name:'Só necessários'}).click();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await page.getByRole('button',{name:'Quero escolher o meu serviço'}).click();await expect(page.getByLabel('Serviço pretendido')).toHaveValue('');await page.keyboard.press('Escape');await expect(page.getByRole('dialog')).not.toBeVisible();
 await page.screenshot({path:'test-results/mobile.png',fullPage:true});
});
test('erros de gravação não abrem o WhatsApp',async({page})=>{
 await page.goto('/');await page.getByRole('button',{name:'Só necessários'}).click();await page.route('**/api/leads',route=>route.fulfill({status:503,contentType:'application/json',body:JSON.stringify({error:'Teste: gravação indisponível'})}));
 await page.getByRole('button',{name:'Quero transformar o meu cabelo'}).click();await page.getByLabel('Nome',{exact:true}).fill('Teste erro');await page.getByLabel('E-mail',{exact:true}).fill('fail@example.invalid');await page.getByLabel('WhatsApp',{exact:true}).fill('+351900000002');await page.getByLabel('Serviço pretendido').selectOption('Visagismo');await page.getByRole('button',{name:'Registar pedido e continuar'}).click();await expect(page.getByRole('status')).toContainText('gravação indisponível');await expect(page.locator('#open-whatsapp')).toBeHidden();
});
test('admin: login e painel sem dados expostos antes de autenticação',async({page})=>{
 await page.goto('/admin');await expect(page.locator('#crm')).toBeHidden();const password=process.env.MATISSE_ADMIN_FILE?JSON.parse(readFileSync(process.env.MATISSE_ADMIN_FILE,'utf8')).password:readFileSync('.dev.vars','utf8').match(/^LOCAL_ADMIN_PASSWORD=(.+)$/m)[1];await page.getByLabel('Palavra-passe').fill(password);await page.getByRole('button',{name:'Entrar no CRM'}).click();await expect(page.locator('#crm')).toBeVisible();await expect(page.locator('#stats')).toContainText('Total de leads');if(browserLeadId){const r=await page.request.delete('/api/admin/leads/'+browserLeadId,{headers:{Origin:new URL(page.url()).origin,'Content-Type':'application/json'},data:{}});expect(r.status()).toBe(200);}await page.getByRole('button',{name:'Terminar sessão'}).click();await expect(page.locator('#crm')).toBeHidden();
});
test('seletor de serviços abre o mesmo formulário com a escolha atual e devolve-o ao rodapé',async({page})=>{
 await page.goto('/');await page.getByRole('button',{name:'Só necessários'}).click();
 await expect(page.locator('#inline-form-host #lead-form')).toHaveCount(1);
 const tab=page.getByRole('tab',{name:'Visagismo',exact:true});await tab.click();await expect(tab).toHaveAttribute('aria-selected','true');await expect(page.locator('#detail-title')).toHaveText('Visagismo');
 await page.getByRole('button',{name:'Conversar sobre este serviço'}).click();
 await expect(page.locator('#lead-dialog #lead-form')).toHaveCount(1);await expect(page.getByLabel('Serviço pretendido')).toHaveValue('Visagismo');await expect(page.locator('#lead-form')).toHaveCount(1);
 await page.keyboard.press('Escape');await expect(page.locator('#inline-form-host #lead-form')).toHaveCount(1);await expect(page.getByRole('dialog')).not.toBeVisible();
});
test('formulário do final da página regista um pedido sem precisar de abrir um modal',async({page})=>{
 await page.goto('/');await page.getByRole('button',{name:'Só necessários'}).click();
 await page.getByLabel('Nome',{exact:true}).fill('Teste inline');await page.getByLabel('E-mail',{exact:true}).fill('inline@example.invalid');await page.getByLabel('WhatsApp',{exact:true}).fill('+351900000003');await page.getByLabel('Serviço pretendido').selectOption('Visagismo');
 await page.waitForTimeout(1600);const response=page.waitForResponse(r=>r.url().endsWith('/api/leads')&&r.request().method()==='POST');await page.getByRole('button',{name:'Registar pedido e continuar'}).click();const savedResponse=await response;expect(savedResponse.status()).toBe(201);const saved=await savedResponse.json();expect(JSON.parse(savedResponse.request().postData()).cta).toBe('inline-form');await expect(page.locator('#lead-success')).toBeVisible();await expect(page.getByRole('dialog')).not.toBeVisible();
 const password=process.env.MATISSE_ADMIN_FILE?JSON.parse(readFileSync(process.env.MATISSE_ADMIN_FILE,'utf8')).password:readFileSync('.dev.vars','utf8').match(/^LOCAL_ADMIN_PASSWORD=(.+)$/m)[1];const origin=new URL(page.url()).origin;const headers={Origin:origin,'Content-Type':'application/json'};
 const login=await page.request.post('/api/admin/login',{headers,data:{password}});expect(login.status()).toBe(200);const remove=await page.request.delete('/api/admin/leads/'+saved.id,{headers,data:{}});expect(remove.status()).toBe(200);const logout=await page.request.post('/api/admin/logout',{headers,data:{}});expect(logout.status()).toBe(200);
});

test('carrossel sem CTAs nos cartões permite arrastar com o rato e mapa só carrega por escolha',async({page})=>{
 let mapRequests=0;await page.route('https://www.google.com/maps?**',route=>{mapRequests++;return route.abort();});
 await page.goto('/');await page.getByRole('button',{name:'Só necessários'}).click();
 await expect(page.locator('#service-rail button,#service-rail a')).toHaveCount(0);await expect(page.locator('.rail-controls')).toHaveCount(0);await expect(page.locator('#servicos .contact')).toHaveCount(1);
 const rail=page.locator('#service-rail');await rail.scrollIntoViewIfNeeded();const box=await rail.boundingBox();const x=box.x+box.width*.7,y=box.y+130;await page.mouse.move(x,y);await page.mouse.down();await page.mouse.move(x-330,y,{steps:12});await page.mouse.up();await expect.poll(()=>rail.evaluate(r=>r.scrollLeft)).toBeGreaterThan(100);
 await expect(page.locator('[name="timing"],[name="goal"]')).toHaveCount(0);await expect(page.locator('#location-map iframe')).toHaveCount(0);expect(mapRequests).toBe(0);
 await page.getByRole('button',{name:'Mostrar mapa'}).click();await expect(page.locator('#location-map iframe')).toHaveCount(1);const mapUrl=new URL(await page.locator('#location-map iframe').getAttribute('src'));expect(mapUrl.searchParams.get('q')).toContain('4430-204 Vila Nova de Gaia');await expect.poll(()=>mapRequests).toBe(1);
});
test('carrossel responde ao deslize de dedo num ecrã móvel',async({browser})=>{
 const context=await browser.newContext({hasTouch:true,isMobile:true,viewport:{width:390,height:844},...(process.env.MATISSE_TEST_ORIGIN?.startsWith('https:')&&process.env.HTTPS_PROXY?{proxy:{server:process.env.HTTPS_PROXY}}:{})});
 try{const page=await context.newPage();await page.goto(process.env.MATISSE_TEST_ORIGIN||'http://localhost:8787');await page.getByRole('button',{name:'Só necessários'}).click();const client=await context.newCDPSession(page);for(const selector of ['#service-rail','#professional-rail']){const rail=page.locator(selector);await rail.scrollIntoViewIfNeeded();const b=await rail.boundingBox();const x=b.x+b.width*.8,y=b.y+150;
 await client.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x,y}]});for(let i=1;i<=10;i++){await client.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:x-i*19,y}]});}await client.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await expect.poll(()=>rail.evaluate(r=>r.scrollLeft)).toBeGreaterThan(50);}
 }finally{await context.close();}
});

test('profissionais têm as dimensões dos serviços e o carrossel preserva os botões de contacto',async({page})=>{
 await page.setViewportSize({width:1440,height:1000});await page.goto('/');await page.getByRole('button',{name:'Só necessários'}).click();
 const rail=page.locator('#professional-rail');await rail.scrollIntoViewIfNeeded();
 for(const width of [1440,390]){await page.setViewportSize({width,height:1000});const sizes=await page.evaluate(()=>{const a=document.querySelector('.service').getBoundingClientRect(),b=document.querySelector('.professional-card').getBoundingClientRect();return {service:[a.width,a.height],professional:[b.width,b.height]};});expect(Math.abs(sizes.service[0]-sizes.professional[0])).toBeLessThan(1);expect(sizes.service[1]).toBe(sizes.professional[1]);}
 await page.setViewportSize({width:1440,height:1000});await rail.scrollIntoViewIfNeeded();const b=await rail.boundingBox();await page.mouse.move(b.x+b.width*.8,b.y+130);await page.mouse.down();await page.mouse.move(b.x+40,b.y+130,{steps:12});await page.mouse.up();await expect.poll(()=>rail.evaluate(r=>r.scrollLeft)).toBeGreaterThan(40);
 await page.locator('[data-cta="professional-jhon"]').click();await expect(page.getByRole('dialog')).toBeVisible();await expect(page.getByLabel('Observações')).toHaveValue('Gostaria de falar com Jhon.');
 await expect(page.locator('footer .instagram-link')).toHaveText('');
});
