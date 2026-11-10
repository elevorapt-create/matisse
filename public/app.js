const $ = selector => document.querySelector(selector);
const waIcon = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.52 3.48A11.91 11.91 0 0 0 12.05 0C5.47 0 .11 5.35.1 11.94c0 2.1.55 4.15 1.6 5.96L0 24l6.26-1.64a11.96 11.96 0 0 0 5.78 1.47h.01c6.58 0 11.94-5.36 11.95-11.94a11.86 11.86 0 0 0-3.48-8.41zM12.05 21.8a9.9 9.9 0 0 1-5.05-1.38l-.36-.21-3.72.97.99-3.63-.24-.38a9.86 9.86 0 0 1-1.52-5.23c0-5.47 4.45-9.91 9.92-9.91a9.85 9.85 0 0 1 7.02 2.91 9.85 9.85 0 0 1 2.9 7.02c0 5.47-4.45 9.91-9.94 9.91zm5.44-7.42c-.3-.15-1.76-.87-2.03-.97-.28-.1-.48-.15-.68.15-.2.3-.77.97-.94 1.17-.18.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.8-1.49-1.78-1.67-2.08-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.49 0 1.47 1.07 2.89 1.22 3.09.15.2 2.1 3.21 5.08 4.5.71.3 1.27.49 1.7.62.71.23 1.36.2 1.87.12.57-.08 1.76-.72 2.01-1.42.25-.7.25-1.3.18-1.42-.08-.13-.28-.2-.58-.35z"/></svg>';
for (const button of document.querySelectorAll('.contact')) button.insertAdjacentHTML('afterbegin',waIcon);
$('#open-whatsapp').insertAdjacentHTML('afterbegin',waIcon);
let config = null, opener, openedAt = Date.now(), leadId = crypto.randomUUID(), consent = null;
const storage = { get(k) { try { return localStorage.getItem(k); } catch { return null; } }, set(k,v) { try { localStorage.setItem(k,v); } catch {} }, remove(k) { try { localStorage.removeItem(k); } catch {} } };
try { consent = JSON.parse(storage.get('matisse-consent')); if (consent?.version !== 1 || !Number.isFinite(Date.parse(consent.at)) || Date.now()-Date.parse(consent.at)>180*86400000) consent=null; } catch { consent=null; }
let pageTracked = false;
async function track(name) {
 if (!consent?.analytics) return;
 try { await fetch('/api/events',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({id:crypto.randomUUID(),name,consent:true})}); } catch {}
}
function captureUtms() {
 if (!consent?.analytics) return {};
 let stored={}; try {stored=JSON.parse(sessionStorage.getItem('matisse-utms') || '{}');} catch {}
 const query=new URLSearchParams(location.search), utms={...stored};
 for (const k of ['utm_source','utm_medium','utm_campaign','utm_content','utm_term']) if(query.has(k)) utms[k]=query.get(k).slice(0,200);
 try {sessionStorage.setItem('matisse-utms',JSON.stringify(utms));} catch {}
 return utms;
}
function updateConsent(analytics) {
 consent={version:1,analytics,at:new Date().toISOString()}; storage.set('matisse-consent',JSON.stringify(consent)); $('#consent-banner').hidden=true;
 if(analytics){captureUtms();if(!pageTracked){pageTracked=true;track('PageView');}}
 else {try {sessionStorage.removeItem('matisse-utms');} catch {}}
}
$('#consent-banner').hidden=!!consent;
$('#accept-consent').onclick=()=>updateConsent(true);
$('#reject-consent').onclick=()=>updateConsent(false);
$('#cookie-settings').onclick=()=>{$('#consent-banner').hidden=false;$('#reject-consent').focus();};
if(consent?.analytics){captureUtms();pageTracked=true;track('PageView');}
async function loadConfig(){
 const res=await fetch('/api/config'); if(!res.ok)throw new Error('Não foi possível carregar o formulário. Tente novamente.');
 config=await res.json();
 const select=$('[name="service"]');
 for(const name of config.services){const option=new Option(name,name);select.add(option);}
 return config;
}
const configReady=loadConfig().catch(()=>null);
const dialog=$('#lead-dialog'), form=$('#lead-form'), status=$('#form-status');
const leadPanel=$('#lead-panel'), inlineHost=$('#inline-form-host');
if(inlineHost&&leadPanel)inlineHost.append(leadPanel);
$('#submit-lead').disabled=true;
configReady.then(()=>{
 $('#submit-lead').disabled=!config?.contactEnabled;
 if(!config)status.textContent='Não foi possível carregar o formulário. Atualize a página para tentar novamente.';
 else if(!config.contactEnabled)status.textContent='O formulário está em preparação. Ainda não é possível registar pedidos.';
});
function closeForm(){
 dialog.close();document.body.classList.remove('modal-open');
 if(inlineHost&&leadPanel)inlineHost.append(leadPanel);
 const previous=opener;opener=null;previous?.focus();
}
$('#close-form').onclick=closeForm;
dialog.addEventListener('cancel',event=>{event.preventDefault();closeForm();});
let inlineFormSeen=false;
form.addEventListener('focusin',()=>{if(!dialog.open&&!inlineFormSeen){inlineFormSeen=true;track('OpenLeadForm');}});
document.addEventListener('matisse:view-service',()=>track('ViewService'));
for(const button of document.querySelectorAll('.contact')) button.addEventListener('click',async()=>{
 opener=button;openedAt=Date.now();leadId=crypto.randomUUID();form.reset();form.hidden=false;$('#lead-success').hidden=true;status.textContent='';
 if(leadPanel)dialog.append(leadPanel);
 dialog.showModal();document.body.classList.add('modal-open');
 await configReady;
 if(!config){status.textContent='Não foi possível carregar o formulário. Feche e tente novamente.';$('#submit-lead').disabled=true;return;}
 $('[name="service"]').value=button.dataset.service||'';
 if(!config.contactEnabled){status.textContent='O formulário está em preparação. Ainda não é possível registar pedidos.';$('#submit-lead').disabled=true;}else{$('#submit-lead').disabled=false;}
 if(button.dataset.service)track('ViewService');
 track('OpenLeadForm');
 $('[name="name"]').focus();
});
form.addEventListener('submit',async event=>{
 event.preventDefault();if(!form.reportValidity())return;
 const submit=$('#submit-lead');submit.disabled=true;status.textContent='A registar o seu pedido…';
 const fields=Object.fromEntries(new FormData(form));
 const body={...fields,id:leadId,cta:opener?.dataset.cta||'inline-form',elapsed:Date.now()-openedAt,marketingConsent:form.elements.marketingConsent.checked,analyticsConsent:consent?.analytics===true,utms:captureUtms()};
 try{
  const res=await fetch('/api/leads',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
  const result=await res.json();if(!res.ok)throw new Error(result.errors?Object.values(result.errors).join(' '):result.error);
  if(!result.saved||!result.whatsappUrl)throw new Error('Não foi possível confirmar o registo. Tente novamente.');
  form.hidden=true;$('#lead-success').hidden=false;$('#open-whatsapp').href=result.whatsappUrl;$('#open-whatsapp').focus();
  // Lead é criado no servidor após persistência. Não emitir uma segunda conversão no browser.
  if(consent?.analytics&&result.eventId)document.dispatchEvent(new CustomEvent('matisse:lead-saved',{detail:{eventId:result.eventId}}));
 }catch(error){status.textContent=error.message||'Falha de ligação. Tente novamente. O WhatsApp não foi aberto.';}
 finally{submit.disabled=false;}
});
$('#open-whatsapp').onclick=()=>track('ClickWhatsApp');
