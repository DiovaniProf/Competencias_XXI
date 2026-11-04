/* V61 — ajuste responsivo para TVs e computadores, sem interferir na lógica da roda. */
(()=>{
  const question=document.getElementById('qtext');
  const panel=document.getElementById('pergunta');
  if(!question||!panel)return;
  let scheduled=false;
  function fit(){
    scheduled=false;
    if(panel.classList.contains('hidden'))return;
    question.style.removeProperty('font-size');
    const viewportWidth=window.innerWidth||document.documentElement.clientWidth;
    const viewportHeight=window.innerHeight||document.documentElement.clientHeight;
    const baseline=parseFloat(getComputedStyle(question).fontSize)||54;
    const maxHeight=Math.max(135,Math.min(viewportHeight*.36,450));
    let size=baseline;
    // Aumentar a fonte quando houver espaço e reduzir apenas quando necessário.
    // Medição real do texto renderizado, inclusive em navegadores de Smart TV.
    question.style.setProperty('font-size',size+'px','important');
    for(let i=0;i<35 && question.getBoundingClientRect().height>maxHeight && size>28;i++){
      size=Math.max(28,size-2);
      question.style.setProperty('font-size',size+'px','important');
    }
    question.dataset.v61FontPx=String(Math.round(size));
    document.documentElement.dataset.v61Viewport=viewportWidth+'x'+viewportHeight;
  }
  function schedule(){if(!scheduled){scheduled=true;requestAnimationFrame(fit)}}
  new MutationObserver(schedule).observe(question,{childList:true,characterData:true,subtree:true});
  new MutationObserver(schedule).observe(panel,{attributes:true,attributeFilter:['class']});
  window.addEventListener('resize',schedule,{passive:true});
  document.addEventListener('fullscreenchange',schedule);
  window.addEventListener('orientationchange',schedule,{passive:true});
  if(window.ResizeObserver){new ResizeObserver(schedule).observe(document.documentElement)}
  schedule();
})();
