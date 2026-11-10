import {defineConfig} from '@playwright/test';
export default defineConfig({testDir:'./tests/browser',workers:1,use:{baseURL:'http://localhost:8787',headless:true,launchOptions:{executablePath:'/usr/bin/chromium',args:['--no-sandbox']},screenshot:'only-on-failure'},reporter:'list'});
