// V2: light drifting leaves only above the RSVP section. No interaction blocking.
(()=>{
 const main=document.querySelector('main'),rsvp=document.querySelector('.rsvp-section');
 if(!main||!rsvp||document.getElementById('v2-leaves'))return;
 const sheet=document.createElement('style');
 sheet.textContent=`#v2-leaves{position:fixed;top:0;height:100dvh;overflow:hidden;pointer-events:none!important;z-index:10;contain:layout paint}#v2-leaves *{pointer-events:none!important}.v2-leaf{position:absolute;top:-18px;width:var(--size);height:calc(var(--size)*.52);background:#7d9c66;border-radius:100% 0 100% 0;opacity:var(--opacity);transform-origin:50% 50%;animation:v2-leaf-fall var(--time) linear var(--delay) infinite;will-change:transform}@keyframes v2-leaf-fall{from{transform:translate3d(0,-20px,0) rotate(-20deg)}to{transform:translate3d(var(--drift),calc(100dvh + 30px),0) rotate(210deg)}}@media(prefers-reduced-motion:reduce){#v2-leaves{display:none}}#v2-leaves[data-paused] .v2-leaf{animation-play-state:paused}`;
 document.head.append(sheet);
 const layer=document.createElement('div');layer.id='v2-leaves';layer.setAttribute('aria-hidden','true');document.body.append(layer);
 for(let i=0;i<12;i++){
  const el=document.createElement('span');el.className='v2-leaf';el.style.left=Math.random()*100+'%';
  for(const [name,val] of Object.entries({'size':(8+Math.random()*6)+'px','opacity':(.19+Math.random()*.25).toFixed(2),'time':(16+Math.random()*15)+'s','delay':(-Math.random()*30)+'s','drift':(Math.random()*100-50)+'px'}))el.style.setProperty('--'+name,val);
  layer.append(el);
 }
 let queued=false;
 function align(){const a=main.getBoundingClientRect(),b=rsvp.getBoundingClientRect(),h=layer.getBoundingClientRect().height||innerHeight;const top=Math.min(h,Math.max(0,a.top));const bottom=Math.max(top,Math.min(h,b.top));layer.style.left=a.left+'px';layer.style.width=a.width+'px';layer.style.clipPath=`inset(${top}px 0 ${Math.max(0,h-bottom)}px 0)`;layer.style.visibility=bottom>top?'visible':'hidden';queued=false}
 const schedule=()=>{if(!queued){queued=true;requestAnimationFrame(align)}};
 align();addEventListener('scroll',schedule,{passive:true});addEventListener('resize',schedule,{passive:true});
 if(typeof ResizeObserver==='function'){const ro=new ResizeObserver(schedule);ro.observe(main);ro.observe(rsvp)}
 const pause=()=>layer.toggleAttribute('data-paused',document.hidden);document.addEventListener('visibilitychange',pause);pause();
})();
