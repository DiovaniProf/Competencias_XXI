/* V62: ajusta a pergunta ao espaço REAL, sem reduzir preventivamente
   a fonte para o tamanho pequeno observado nas fotografias. */
(()=>{
 const q=document.getElementById('qtext'),p=document.getElementById('pergunta');
 if(!q||!p)return;
 let raf=0;
 function fit(){
  raf=0;
  if(p.classList.contains('hidden'))return;
  q.style.removeProperty('font-size');
  const cssSize=parseFloat(getComputedStyle(q).fontSize)||64;
  const viewportH=window.innerHeight||document.documentElement.clientHeight;
  const maxBoxH=Math.max(240,Math.min(viewportH*.43,520));
  let size=cssSize;
  // Apenas limitar casos extremos (perguntas longas); permitir quebra de linhas.
  while(q.getBoundingClientRect().height>maxBoxH && size>32){
    size=Math.max(32,size-2);
    q.style.setProperty('font-size',size+'px','important');
  }
  q.dataset.fontPx=Math.round(size);
 }
 function schedule(){if(!raf)raf=requestAnimationFrame(fit)}
 new MutationObserver(schedule).observe(q,{childList:true,characterData:true,subtree:true});
 new MutationObserver(schedule).observe(p,{attributes:true,attributeFilter:['class']});
 window.addEventListener('resize',schedule,{passive:true});
 document.addEventListener('fullscreenchange',schedule);
 window.addEventListener('orientationchange',schedule,{passive:true});
 schedule();
})();
