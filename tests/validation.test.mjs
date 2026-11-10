import { pbkdf2Sync } from 'node:crypto';
import test from 'node:test';
import assert from 'node:assert/strict';
import { validateLead, passwordValid, SERVICES, STATUSES } from '../src/worker.js';
const valid={id:'b197fd4e-7575-4a43-85ea-605855c1c23f',name:'Teste Matisse',email:'teste@example.invalid',phone:'+351 900 000 000',service:SERVICES[0],marketingConsent:false};
test('pedido válido não exige marketing',()=>assert.deepEqual(validateLead(valid).errors,{}));
test('campos obrigatórios são validados no servidor',()=>{const {errors}=validateLead({});for(const key of ['name','email','phone','service','form'])assert.ok(errors[key]);});
test('não aceita serviços ou identificadores arbitrários',()=>{const {errors}=validateLead({...valid,id:'1',service:'serviço inventado'});assert.ok(errors.service);assert.ok(errors.form);});
test('normaliza e limita dados de texto',()=>{const {data}=validateLead({...valid,email:' TESTE@EXAMPLE.INVALID ',notes:'a'.repeat(5000)});assert.equal(data.email,'teste@example.invalid');assert.equal(data.notes.length,2000);});
test('rejeita consentimento ambíguo',()=>assert.ok(validateLead({...valid,marketingConsent:'true'}).errors.form));
test('estados distinguem pedidos, marcações e realização',()=>{assert.equal(STATUSES.length,6);for(const s of ['Novo lead','Marcação confirmada','Serviço realizado'])assert.ok(STATUSES.includes(s));});

test('hash administrativo compatível com produção valida apenas a palavra-passe correta',async()=>{const salt='0123456789abcdef0123456789abcdef';const password='test-only-generated-password';const hash=pbkdf2Sync(password,salt,100000,32,'sha256').toString('hex');const spec='100000:'+salt+':'+hash;assert.equal(await passwordValid(password,spec),true);assert.equal(await passwordValid('wrong',spec),false);assert.equal(await passwordValid(password,'1:'+salt+':'+hash),false);});
