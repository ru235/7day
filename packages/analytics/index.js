export function snippet({ ga4, metrika }) {
  return `<script>window.s555ev=(n,d)=>{try{gtag&&gtag('event',n,d);ym&&ym(${JSON.stringify(metrika)},'reachGoal',n,d)}catch(e){}}</script>
${ga4 ? `<script async src="https://www.googletagmanager.com/gtag/js?id=${ga4}"></script><script>window.dataLayer=[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${ga4}')</script>` : ''}
${metrika ? `<script src="https://mc.yandex.ru/metrika/tag.js"></script><script>ym(${JSON.stringify(metrika)},'init',{clickmap:true,trackLinks:true})</script>` : ''}`;
}
