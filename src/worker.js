export const SERVICES = ['Mechas e iluminação', 'Coloração personalizada', 'Cortes femininos', 'Alisamentos', 'Visagismo', 'Consultoria de cor'];
export const STATUSES = ['Novo lead', 'Contactado', 'Em acompanhamento', 'Marcação confirmada', 'Serviço realizado', 'Perdido'];
const PRIVACY = '2026-11-10';
const encoder = new TextEncoder();
const json = (data, status = 200) => new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' } });
const safeText = (v, max) => typeof v === 'string' ? v.trim().slice(0, max) : '';
const hex = bytes => [...new Uint8Array(bytes)].map(x => x.toString(16).padStart(2, '0')).join('');
const uuid = x => typeof x === 'string' && /^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i.test(x);
export function validateLead(b) {
 const errors = {};
 if (!b || typeof b !== 'object') return { errors: { form: 'Pedido inválido.' } };
 const data = { name: safeText(b.name, 100), email: safeText(b.email, 254).toLowerCase(), phone: safeText(b.phone, 32), service: safeText(b.service, 80), timing: safeText(b.timing, 100), goal: safeText(b.goal, 1000), notes: safeText(b.notes, 2000), cta: safeText(b.cta, 80) || 'unknown' };
 if (data.name.length < 2) errors.name = 'Indique o seu nome.';
 if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errors.email = 'Indique um e-mail válido.';
 if (!/^\+?[\d\s()-]{7,25}$/.test(data.phone) || data.phone.replace(/\D/g, '').length < 7) errors.phone = 'Indique um número válido.';
 if (!SERVICES.includes(data.service)) errors.service = 'Selecione um serviço.';
 if (!uuid(b.id)) errors.form = 'Identificador inválido. Volte a abrir o formulário.';
 if (b.marketingConsent !== undefined && typeof b.marketingConsent !== 'boolean') errors.form = 'Consentimento inválido.';
 return { data, errors };
}
async function readBody(req) {
 if (!req.headers.get('content-type')?.startsWith('application/json')) throw new Error('Content-Type inválido.');
 if (Number(req.headers.get('content-length') || 0) > 16384) throw new Error('Pedido demasiado grande.');
 const reader = req.body?.getReader(); if (!reader) throw new Error('Pedido vazio.');
 let size = 0; const chunks = [];
 while (true) { const { value, done } = await reader.read(); if (done) break; size += value.length; if (size > 16384) { await reader.cancel(); throw new Error('Pedido demasiado grande.'); } chunks.push(value); }
 const bytes = new Uint8Array(size); let offset = 0; for (const c of chunks) { bytes.set(c, offset); offset += c.length; }
 const parsed = JSON.parse(new TextDecoder().decode(bytes));
 if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) throw new Error('Pedido inválido.');
 return parsed;
}
async function digest(value) { return hex(await crypto.subtle.digest('SHA-256', encoder.encode(value))); }
async function rate(req, env, category, limit, seconds) {
 const bucket = Math.floor(Date.now() / 1000 / seconds);
 const ip = req.headers.get('CF-Connecting-IP') || 'local';
 const key = await digest(`${env.SESSION_SECRET}:${category}:${ip}:${bucket}`);
 const row = await env.DB.prepare('INSERT INTO rate_limits(key,hits,expires_at) VALUES(?,1,?) ON CONFLICT(key) DO UPDATE SET hits=hits+1 RETURNING hits').bind(key, (bucket + 1) * seconds).first();
 await env.DB.prepare('DELETE FROM rate_limits WHERE expires_at < ?').bind(Math.floor(Date.now() / 1000) - 60).run();
 return row.hits <= limit;
}
async function session(req, env) {
 const cookie = req.headers.get('Cookie') || '';
 const id = cookie.match(/(?:^|;\s*)matisse_session=([a-f0-9]{64})(?:;|$)/)?.[1];
 if (!id) return null;
 const hash = await digest(id);
 const row = await env.DB.prepare('SELECT id FROM sessions WHERE id=? AND expires_at>?').bind(hash, Date.now()).first();
 return row ? hash : null;
}
function sessionCookie(req, value, maxAge) { return `matisse_session=${value}; HttpOnly; SameSite=Strict; Path=/api/admin; Max-Age=${maxAge}${new URL(req.url).protocol === 'https:' ? '; Secure' : ''}`; }
export async function passwordValid(password, spec) {
 if (typeof password !== 'string' || password.length > 256) return false;
 const legacy = /^[a-f0-9]{32}:[a-f0-9]{64}$/.test(spec || '');
 if (!legacy && !/^100000:[a-f0-9]{32}:[a-f0-9]{64}$/.test(spec || '')) return false;
 const [salt, expected] = (legacy ? spec : spec.slice(7)).split(':');
 const key = await crypto.subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, ['deriveBits']);
 const result = hex(await crypto.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt: encoder.encode(salt), iterations: legacy ? 310000 : 100000 }, key, 256));
 let diff = 0; for (let i = 0; i < result.length; i++) diff |= result.charCodeAt(i) ^ expected.charCodeAt(i);
 return diff === 0;
}
function audit(env, lead, action, detail) { return env.DB.prepare('INSERT INTO audit VALUES(?,?,?,?,?,?)').bind(crypto.randomUUID(), lead, 'admin', action, JSON.stringify(detail), new Date().toISOString()); }
function event(env, id, lead, name, source) { return env.DB.prepare('INSERT OR IGNORE INTO events VALUES(?,?,?,?,?)').bind(id, lead, name, source, new Date().toISOString()); }
async function handle(req, env) {
 const url = new URL(req.url), path = url.pathname;
 if (path.startsWith('/api/') && !['GET', 'HEAD'].includes(req.method)) {
  if (req.headers.get('Origin') !== url.origin) return json({ error: 'Origem não autorizada.' }, 403);
 }
 if (path === '/api/config' && req.method === 'GET') return json({ services: SERVICES, contactEnabled: env.CONTACT_ENABLED === 'true' && !!env.DB && !!env.SESSION_SECRET && /^\d{9,15}$/.test(env.WHATSAPP_NUMBER || ''), privacyVersion: PRIVACY });
 if (path === '/api/health') return json({ ok: true });
 if (path.startsWith('/api/') && (!env.DB || !env.SESSION_SECRET)) return json({ error: 'Serviço temporariamente indisponível.' }, 503);
 if (path === '/api/leads' && req.method === 'POST') {
  if (env.CONTACT_ENABLED !== 'true' || !/^\d{9,15}$/.test(env.WHATSAPP_NUMBER || '')) return json({ error: 'Pedidos de contacto ainda indisponíveis.' }, 503);
  const b = await readBody(req), { data: d, errors } = validateLead(b);
  if (Object.keys(errors).length) return json({ errors }, 422);
  if (b.website || !Number.isFinite(b.elapsed) || b.elapsed < 1500) return json({ error: 'Não foi possível validar o pedido.' }, 400);
  if (!await rate(req, env, 'leads', 5, 900)) return json({ error: 'Demasiados pedidos. Tente mais tarde.' }, 429);
  const existing = await env.DB.prepare('SELECT name,email,phone,service,analytics_consent FROM leads WHERE id=?').bind(b.id).first();
  if (existing && ['name','email','phone','service'].some(key => existing[key] !== d[key])) return json({ error: 'Pedido já registado com outros dados. Volte a abrir o formulário.' },409);
  const analytics = existing ? existing.analytics_consent === 1 : b.analyticsConsent === true;
  const utms = {};
  if (analytics) for (const k of ['utm_source','utm_medium','utm_campaign','utm_content','utm_term']) if (typeof b.utms?.[k] === 'string') utms[k] = safeText(b.utms[k], 200);
  const source = utms.utm_source || 'direto';
  const stamp = new Date().toISOString();
  await env.DB.batch([
   env.DB.prepare('INSERT OR IGNORE INTO leads(id,name,email,phone,service,timing,goal,notes,status,source,utms,cta,marketing_consent,analytics_consent,privacy_version,created_at,updated_at) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)').bind(b.id,d.name,d.email,d.phone,d.service,d.timing,d.goal,d.notes,'Novo lead',source,JSON.stringify(utms),d.cta,b.marketingConsent === true ? 1 : 0,analytics ? 1 : 0,PRIVACY,stamp,stamp),
   env.DB.prepare('INSERT OR IGNORE INTO audit SELECT ?,id,?,?,?,? FROM leads WHERE id=?').bind(`${b.id}:created`,'visitor','created',JSON.stringify({ privacyVersion: PRIVACY, marketing: b.marketingConsent === true, analytics }),stamp,b.id),
   ...(analytics ? [event(env,`${b.id}:Lead`,b.id,'Lead','server')] : [])
  ]);
  const message = `Olá, Matisse! Sou ${d.name} e tenho interesse em ${d.service}.${d.goal ? ' O meu objetivo: '+d.goal : ''}`;
  return json({ id: b.id, saved: true, eventId: analytics ? `${b.id}:Lead` : null, whatsappUrl: `https://wa.me/${env.WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}` }, 201);
 }
 if (path === '/api/events' && req.method === 'POST') {
  const b = await readBody(req);
  if (b.consent !== true || !uuid(b.id) || !['PageView','ViewService','OpenLeadForm','ClickWhatsApp'].includes(b.name)) return json({ error: 'Evento inválido.' }, 422);
  if (!await rate(req, env, 'events', 100, 900)) return json({ error: 'Limite atingido.' }, 429);
  await event(env,b.id,null,b.name,'browser').run(); return json({ saved: true });
 }
 if (path === '/api/admin/login' && req.method === 'POST') {
  if (!env.ADMIN_PASSWORD_HASH) return json({ error: 'Acesso administrativo não configurado.' }, 503);
  if (!await rate(req, env, 'login', 5, 900)) return json({ error: 'Demasiadas tentativas. Tente mais tarde.' }, 429);
  const b = await readBody(req);
  if (!await passwordValid(b.password, env.ADMIN_PASSWORD_HASH)) return json({ error: 'Credenciais inválidas.' }, 401);
  const id = hex(crypto.getRandomValues(new Uint8Array(32)));
  await env.DB.batch([env.DB.prepare('DELETE FROM sessions WHERE expires_at<?').bind(Date.now()),env.DB.prepare('INSERT INTO sessions VALUES(?,?)').bind(await digest(id), Date.now()+8*3600000),audit(env,null,'login',{})]);
  const res = json({ ok: true }); res.headers.set('Set-Cookie',sessionCookie(req,id,28800)); return res;
 }
 if (path.startsWith('/api/admin/')) {
  const auth = await session(req,env); if (!auth) return json({ error: 'Autenticação necessária.' }, 401);
  if (path === '/api/admin/logout' && req.method === 'POST') {
   await env.DB.batch([env.DB.prepare('DELETE FROM sessions WHERE id=?').bind(auth),audit(env,null,'logout',{})]);
   const res = json({ ok: true }); res.headers.set('Set-Cookie',sessionCookie(req,'',0)); return res;
  }
  if (path === '/api/admin/leads' && req.method === 'GET') {
   const leads = await env.DB.prepare('SELECT * FROM leads ORDER BY created_at DESC LIMIT 500').all();
   const count = await env.DB.prepare('SELECT count(*) AS total FROM leads').first();
   const groups = {};
   for (const [key, col] of [['services','service'],['sources','source'],['statuses','status']]) groups[key] = (await env.DB.prepare(`SELECT ${col} AS label,count(*) AS count FROM leads GROUP BY ${col}`).all()).results;
   await audit(env,null,'view_leads',{}).run();
   return json({ leads:leads.results, total:count.total, groups, statuses:STATUSES, limit:500 });
  }
  const match = path.match(/^\/api\/admin\/leads\/([a-f0-9-]{36})$/i);
  if (match && req.method === 'PATCH') {
   const b = await readBody(req);
   if (!STATUSES.includes(b.status)) return json({ error: 'Estado inválido.' }, 422);
   const lead = await env.DB.prepare('SELECT * FROM leads WHERE id=?').bind(match[1]).first();
   if (!lead) return json({ error: 'Registo não encontrado.' }, 404);
   if (lead.status === b.status) return json({ ok:true });
   const stamp = new Date().toISOString();
   const statements = [
    env.DB.prepare('INSERT INTO audit SELECT ?,id,?,?,?,? FROM leads WHERE id=? AND status=?').bind(crypto.randomUUID(),'admin','status_changed',JSON.stringify({ from:lead.status,to:b.status }),stamp,lead.id,lead.status),
    env.DB.prepare('UPDATE leads SET status=?,updated_at=? WHERE id=? AND status=?').bind(b.status,stamp,lead.id,lead.status)
   ];
   const name = b.status === 'Marcação confirmada' ? 'Schedule' : b.status === 'Serviço realizado' ? 'AppointmentAttended' : null;
   if (name) statements.push(env.DB.prepare('INSERT OR IGNORE INTO events SELECT ?,id,?,?,? FROM leads WHERE id=? AND status=? AND analytics_consent=1').bind(`${lead.id}:${name}`,name,'server',stamp,lead.id,b.status));
   const result = await env.DB.batch(statements);
   if (!result[1].meta.changes) return json({ error:'O pedido foi atualizado entretanto. Atualize a lista antes de tentar novamente.' },409);
   return json({ ok:true });
  }
  if (match && req.method === 'DELETE') {
   await env.DB.batch([env.DB.prepare('DELETE FROM events WHERE lead_id=?').bind(match[1]), env.DB.prepare('DELETE FROM audit WHERE lead_id=?').bind(match[1]),env.DB.prepare('DELETE FROM leads WHERE id=?').bind(match[1]),audit(env,null,'lead_deleted',{ id:match[1] })]);
   return json({ ok:true });
  }
  const history = path.match(/^\/api\/admin\/leads\/([a-f0-9-]{36})\/history$/i);
  if (history && req.method === 'GET') return json((await env.DB.prepare('SELECT action,detail,created_at FROM audit WHERE lead_id=? ORDER BY created_at').bind(history[1]).all()).results);
 }
 if (path.startsWith('/api/')) return json({ error:'Pedido não encontrado.' },404);
 if (path === '/sitemap.xml') return new Response('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>',{headers:{'Content-Type':'application/xml'}});
 return env.ASSETS.fetch(req);
}
export async function purgeExpiredData(env, now = Date.now()) {
 const cutoff = days => new Date(now - days * 86400000).toISOString();
 await env.DB.batch([
  env.DB.prepare('DELETE FROM events WHERE lead_id IN (SELECT id FROM leads WHERE updated_at < ?)').bind(cutoff(180)),
  env.DB.prepare('DELETE FROM audit WHERE lead_id IN (SELECT id FROM leads WHERE updated_at < ?)').bind(cutoff(180)),
  env.DB.prepare('DELETE FROM leads WHERE updated_at < ?').bind(cutoff(180)),
  env.DB.prepare('DELETE FROM events WHERE created_at < ?').bind(cutoff(90)),
  env.DB.prepare('DELETE FROM audit WHERE created_at < ?').bind(cutoff(365)),
  env.DB.prepare('DELETE FROM sessions WHERE expires_at < ?').bind(now),
  env.DB.prepare('DELETE FROM rate_limits WHERE expires_at < ?').bind(Math.floor(now / 1000))
 ]);
}
export default { scheduled(controller, env, ctx) { ctx.waitUntil(purgeExpiredData(env)); }, async fetch(req,env) {
 let res;
 try { res = await handle(req,env); } catch(e) { res = json({ error: e instanceof SyntaxError || /Pedido|Content-Type/.test(e.message) ? 'Pedido inválido.' : 'Não foi possível concluir. Tente novamente.' }, e instanceof SyntaxError || /Pedido|Content-Type/.test(e.message) ? 400 : 503); }
 const result = new Response(res.body,res);
 for (const [k,v] of Object.entries({ 'X-Content-Type-Options':'nosniff','Referrer-Policy':'strict-origin-when-cross-origin','X-Frame-Options':'DENY','Permissions-Policy':'camera=(), microphone=(), geolocation=()','X-Robots-Tag':'noindex, nofollow','Content-Security-Policy':"default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; connect-src 'self'; font-src 'self'; frame-src https://www.google.com; frame-ancestors 'none'; form-action 'self'; base-uri 'self'; object-src 'none'" })) result.headers.set(k,v);
 if (new URL(req.url).pathname.startsWith('/api/') || new URL(req.url).pathname.startsWith('/admin')) result.headers.set('Cache-Control','no-store');
 return result;
} };
