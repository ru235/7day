(function(){var b=document.getElementById('ttheme');if(!b)return;
function cur(){return document.documentElement.getAttribute('data-theme')||'light'}
function paint(){var d=cur()==='dark';b.textContent=d?'☀':'◐';b.setAttribute('aria-label',d?'Светлая тема':'Тёмная тема');b.title=d?'Светлая тема':'Тёмная тема'}
paint();b.onclick=function(){var n=cur()==='dark'?'light':'dark';document.documentElement.setAttribute('data-theme',n);try{localStorage.setItem('s555theme',n)}catch(e){}paint();try{window.s555ev&&s555ev('theme_toggle',{theme:n})}catch(e){}};})();
(function(){var bg=document.querySelector('.burger'),nv=document.getElementById('navlinks');if(!bg||!nv)return;
function set(open){bg.classList.toggle('open',open);nv.classList.toggle('open',open);bg.setAttribute('aria-expanded',open?'true':'false')}
bg.addEventListener('click',function(){set(!nv.classList.contains('open'))});
nv.addEventListener('click',function(e){if(e.target.closest('a'))set(false)});
document.addEventListener('keydown',function(e){if(e.key==='Escape')set(false)});})();
