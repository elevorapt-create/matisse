import { randomBytes, pbkdf2Sync } from 'node:crypto';
import { writeFileSync } from 'node:fs';
const password = randomBytes(20).toString('base64url');
const salt = randomBytes(16).toString('hex');
const hash = pbkdf2Sync(password, salt, 100000, 32, 'sha256').toString('hex');
writeFileSync('.dev.vars', `ADMIN_PASSWORD_HASH=100000:${salt}:${hash}\nSESSION_SECRET=${randomBytes(32).toString('hex')}\nLOCAL_ADMIN_PASSWORD=${password}\nCONTACT_ENABLED=true\nWHATSAPP_NUMBER=351928276081\n`, { flag: 'wx', mode: 0o600 });
console.log('Configuração local criada em .dev.vars (ignorado pelo Git). Consulte LOCAL_ADMIN_PASSWORD nesse ficheiro. Nunca o publique.');
