import {test,expect} from '@playwright/test';
import {readFileSync} from 'node:fs';
test('desktop: consentimento, formulário e WhatsApp só após registo',async({page})=>{
 const events=[];page.on('request',req=>{if(req.url().endsWith('/api/events'))events.push(req);});
 await page.goto('/');await expect(page.getByRole('heading',{level:1})).toContainText('A sua beleza é única');
 await page.getByRole('button',{name:'Só necessários'}).click();expect(events).toHaveLength(0);
 await page.getByRole('button',{name:'Quero transformar o meu cabelo'}).click();
 await expect(page.getByRole('dialog')).toBeVisible();await expect(page.locator('#open-whatsapp')).toBeHidden();
 await page.getByLabel('Nome',{exact:true}).fill('Teste browser');await page.getByLabel('E-mail',{exact:true}).fill('browser@example.invalid');await page.getByLabel('WhatsApp',{exact:true}).fill('+351900000001');await page.getByLabel('Serviço pretendido').selectOption('Cortes femininos');
 await page.waitForTimeout(1600);await page.getByRole('button',{name:'Registar pedido e continuar'}).click();
 await expect(page.locator('#lead-success')).toBeVisible();await expect(page.locator('#open-whatsapp')).toHaveAttribute('href',/^https:\/\/wa.me\/351928276081/);expect(events).toHaveLength(0);
 await page.getByRole('button',{name:'Fechar formulário'}).click();await expect(page.getByRole('dialog')).not.toBeVisible();
});
test('mobile: sem overflow e formulário contextualizado acessível por teclado',async({page})=>{
 await page.setViewportSize({width:390,height:844});await page.goto('/');await page.getByRole('button',{name:'Só necessários'}).click();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await page.getByRole('button',{name:'Conversar sobre mechas'}).click();await expect(page.getByLabel('Serviço pretendido')).toHaveValue('Mechas e iluminação');await page.keyboard.press('Escape');await expect(page.getByRole('dialog')).not.toBeVisible();
 await page.screenshot({path:'test-results/mobile.png',fullPage:true});
});
test('erros de gravação não abrem o WhatsApp',async({page})=>{
 await page.goto('/');await page.getByRole('button',{name:'Só necessários'}).click();await page.route('**/api/leads',route=>route.fulfill({status:503,contentType:'application/json',body:JSON.stringify({error:'Teste: gravação indisponível'})}));
 await page.getByRole('button',{name:'Quero transformar o meu cabelo'}).click();await page.getByLabel('Nome',{exact:true}).fill('Teste erro');await page.getByLabel('E-mail',{exact:true}).fill('fail@example.invalid');await page.getByLabel('WhatsApp',{exact:true}).fill('+351900000002');await page.getByLabel('Serviço pretendido').selectOption('Visagismo');await page.getByRole('button',{name:'Registar pedido e continuar'}).click();await expect(page.getByRole('status')).toContainText('gravação indisponível');await expect(page.locator('#open-whatsapp')).toBeHidden();
});
test('admin: login e painel sem dados expostos antes de autenticação',async({page})=>{
 await page.goto('/admin');await expect(page.locator('#crm')).toBeHidden();const password=readFileSync('.dev.vars','utf8').match(/^LOCAL_ADMIN_PASSWORD=(.+)$/m)[1];await page.getByLabel('Palavra-passe').fill(password);await page.getByRole('button',{name:'Entrar no CRM'}).click();await expect(page.locator('#crm')).toBeVisible();await expect(page.locator('#stats')).toContainText('Total de leads');await page.getByRole('button',{name:'Terminar sessão'}).click();await expect(page.locator('#crm')).toBeHidden();
});
