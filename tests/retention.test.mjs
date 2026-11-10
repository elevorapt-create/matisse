import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { Miniflare, convertV4MiniflareOptions } from 'miniflare';
import { purgeExpiredData } from '../src/worker.js';
test('limpeza elimina dados expirados e preserva pedidos recentes',async()=>{
 const mf=new Miniflare(convertV4MiniflareOptions({modules:true,script:'export default { fetch(){ return new Response("ok"); } }',compatibilityDate:'2026-11-10',d1Databases:['DB']}));
 try{
 const DB=await mf.getD1Database('DB');
 for(const sql of readFileSync('migrations/0001_crm.sql','utf8').split(';').map(x=>x.trim()).filter(Boolean))await DB.prepare(sql).run();
 const now=Date.parse('2026-11-10T12:00:00Z'), recent=new Date(now-86400000).toISOString(),old=new Date(now-200*86400000).toISOString();
 for(const [id,date] of [['old',old],['new',recent]])await DB.prepare('INSERT INTO leads(id,name,email,phone,service,status,source,utms,cta,privacy_version,created_at,updated_at) VALUES(?,?,?,?,?,?,?,?,?,?,?,?)').bind(id,'Teste','test@example.invalid','900000000','Visagismo','Novo lead','direto','{}','test','2026-11-10',date,date).run();
 await DB.prepare('INSERT INTO events VALUES(?,?,?,?,?)').bind('old-lead-event','old','Lead','server',recent).run();
 await DB.prepare('INSERT INTO audit VALUES(?,?,?,?,?,?)').bind('old-lead-audit','old','visitor','created','{}',recent).run();
 await DB.prepare('INSERT INTO events VALUES(?,?,?,?,?)').bind('old-anonymous-event',null,'PageView','browser',old).run();
 await DB.prepare('INSERT INTO events VALUES(?,?,?,?,?)').bind('new-anonymous-event',null,'PageView','browser',recent).run();
 await DB.prepare('INSERT INTO sessions VALUES(?,?)').bind('expired',now-1000).run();
 await DB.prepare('INSERT INTO sessions VALUES(?,?)').bind('active',now+1000).run();
 await purgeExpiredData({DB},now);
 assert.deepEqual((await DB.prepare('SELECT id FROM leads').all()).results,[{id:'new'}]);
 assert.deepEqual((await DB.prepare('SELECT id FROM events').all()).results,[{id:'new-anonymous-event'}]);
 assert.equal((await DB.prepare('SELECT count(*) AS n FROM audit').first()).n,0);
 assert.deepEqual((await DB.prepare('SELECT id FROM sessions').all()).results,[{id:'active'}]);
 }finally{await mf.dispose();}
});
