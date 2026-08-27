import { chromium } from 'playwright';
const B='http://202.59.200.26:3226';
const b=await chromium.launch(); const p=await b.newPage();
const errs=[]; p.on('pageerror',e=>errs.push(String(e)));
p.on('response',r=>{ if(r.status()>=500) errs.push('HTTP '+r.status()+' '+r.url()); });

await p.goto(B+'/login',{waitUntil:'networkidle'});
await p.fill("input[name=identifier]","superadmin");
await p.fill('input[type="password"]','Nuha2026!');
await p.click("form button");
await p.waitForURL(u=>!u.pathname.includes('login'),{timeout:20000});
await p.waitForLoadState('networkidle');
console.log('after login url:', p.url());

const tabs=['daftar','piket','jurnal','presensi','beban-jam','arsip-sk','struktur'];
for(const t of tabs){
  await p.goto(`${B}/kepegawaian?tab=${t}`,{waitUntil:'networkidle'});
  const h=await p.locator('.card-judul, h3, h2').first().innerText().catch(()=>'?');
  const rows=await p.locator('table tbody tr').count();
  console.log(`tab=${t} url=${p.url().includes('kepegawaian')?'ok':'REDIRECT '+p.url()} rows=${rows} judul="${h.slice(0,60)}"`);
}
// chip lembaga
await p.goto(B+'/kepegawaian?tab=daftar',{waitUntil:'networkidle'});
const chips=await p.locator('.chip').allInnerTexts();
console.log('chips:',JSON.stringify(chips));
for(const u of ['SMP','MA','Pondok']){
  await p.goto(`${B}/kepegawaian?tab=daftar&unit=${u}`,{waitUntil:'networkidle'});
  console.log(`unit=${u} rows=${await p.locator('table tbody tr').count()} judul="${await p.locator('h3').first().innerText().catch(()=>'?')}"`);
}
// tab-switch mempertahankan filter
await p.goto(`${B}/kepegawaian?tab=daftar&unit=MA`,{waitUntil:'networkidle'});
await p.click('nav.tabbar a:has-text("Struktur Organisasi")');
await p.waitForLoadState('networkidle');
console.log('setelah pindah tab:',p.url());
console.log('ERRORS:',errs.length?errs:'none');
await b.close();
