import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const origin=process.env.MATISSE_TEST_ORIGIN||'http://localhost:8787';
const headers={'Content-Type':'application/json',Origin:origin};
const password=readFileSync('.dev.vars','utf8').match(/^LOCAL_ADMIN_PASSWORD=(.+)$/m)?.[1];
const call=(path,method='GET',body,extra={})=>fetch(origin+path,{method,headers:{...headers,...extra},...(body?{body:JSON.stringify(body)}:{})});
let id=crypto.randomUUID(),cookie;
try{
 let r=await call('/');assert.equal(r.status,200);assert.equal(r.headers.get('x-robots-tag'),'noindex, nofollow');assert.match(await r.text(),/A sua beleza é única/);
 r=await call('/api/admin/leads');assert.equal(r.status,401);
 r=await fetch(origin+'/api/leads',{method:'POST',headers:{'Content-Type':'application/json',Origin:'https://evil.example'},body:'{}'});assert.equal(r.status,403);
 r=await call('/api/leads','POST',{});assert.equal(r.status,422);
 r=await call('/api/events','POST',{id:crypto.randomUUID(),name:'Lead',consent:true});assert.equal(r.status,422);
 const lead={id,name:'Teste funcional',email:'smoke@example.invalid',phone:'+351900000000',service:'Visagismo',elapsed:2000,marketingConsent:false,analyticsConsent:true,cta:'smoke',utms:{utm_source:'teste'},goal:'Teste local de integração'};
 r=await call('/api/leads','POST',lead);assert.equal(r.status,201);const saved=await r.json();assert.equal(saved.saved,true);assert.match(saved.whatsappUrl,/^https:\/\/wa.me\/351928276081\?text=/);assert.equal(saved.eventId,id+':Lead');
 r=await call('/api/leads','POST',lead);assert.equal(r.status,201);
 r=await call('/api/admin/login','POST',{password:'wrong'});assert.equal(r.status,401);
 r=await call('/api/admin/login','POST',{password});assert.equal(r.status,200);cookie=r.headers.get('set-cookie').split(';')[0];assert.match(r.headers.get('set-cookie'),/HttpOnly/);assert.match(r.headers.get('set-cookie'),/SameSite=Strict/);
 const auth={Cookie:cookie};r=await call('/api/admin/leads','GET',null,auth);assert.equal(r.status,200);let data=await r.json();assert.equal(data.leads.filter(l=>l.id===id).length,1);assert.equal(data.leads.find(l=>l.id===id).marketing_consent,0);
 for(const status of ['Contactado','Marcação confirmada','Serviço realizado']){r=await call('/api/admin/leads/'+id,'PATCH',{status},auth);assert.equal(r.status,200);}
 r=await call('/api/admin/leads/'+id+'/history','GET',null,auth);assert.equal(r.status,200);assert.equal((await r.json()).filter(x=>x.action==='status_changed').length,3);
 r=await call('/api/admin/leads/'+id,'PATCH',{status:'inventado'},auth);assert.equal(r.status,422);
 r=await call('/api/admin/leads/'+id,'DELETE',{},auth);assert.equal(r.status,200);
 r=await call('/api/admin/leads','GET',null,auth);data=await r.json();assert.ok(!data.leads.find(l=>l.id===id));
 r=await call('/api/admin/logout','POST',{},auth);assert.equal(r.status,200);
 r=await call('/api/admin/leads','GET',null,auth);assert.equal(r.status,401);
 console.log('PASS: página, cabeçalhos, CSRF, validação, consentimento, gravação, idempotência, WhatsApp, autenticação, pipeline, histórico, apagamento e revogação da sessão.');
}catch(e){console.error('FAIL:',e.message);process.exitCode=1;}
