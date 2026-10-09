const b=document.getElementById('burger'),m=document.getElementById('menu');
b.addEventListener('click',()=>{const o=m.classList.toggle('open');b.setAttribute('aria-expanded',o)});
m.addEventListener('click',e=>{if(e.target.closest('a')){m.classList.remove('open');b.setAttribute('aria-expanded',false)}});
