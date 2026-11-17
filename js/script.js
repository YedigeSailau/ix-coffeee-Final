// falling snow (hero only)
const hero=document.querySelector('.hero, .page-head');
if(hero&&!matchMedia('(prefers-reduced-motion: reduce)').matches){
  const flakes=['❄','❅','❆','❄','✦'];
  for(let i=0;i<26;i++){
    const l=document.createElement('span');
    l.className='leaf';l.setAttribute('aria-hidden','true');l.textContent=flakes[i%flakes.length];
    l.style.left=Math.random()*100+'%';
    l.style.fontSize=(0.8+Math.random()*1.3)+'rem';
    l.style.opacity=(0.45+Math.random()*0.5).toFixed(2);
    l.style.animationDuration=9+Math.random()*10+'s';
    l.style.animationDelay=-Math.random()*16+'s';
    hero.appendChild(l);
  }
}
