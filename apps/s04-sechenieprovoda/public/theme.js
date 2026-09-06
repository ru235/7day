(function(){var b=document.getElementById('ttheme');if(!b)return;
function cur(){return document.documentElement.getAttribute('data-theme')||(window.matchMedia&&matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light')}
function paint(){b.textContent=cur()==='dark'?'☀ светлая':'◐ тёмная'}
paint();b.onclick=function(){var n=cur()==='dark'?'light':'dark';document.documentElement.setAttribute('data-theme',n);try{localStorage.setItem('s555theme',n)}catch(e){}paint();try{window.s555ev&&s555ev('theme_toggle',{theme:n})}catch(e){}}})();
