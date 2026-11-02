
const groups=["Protagonismo", "Tecnologia", "ENEM", "Carreira", "Lazer e tempo livre"], questions=[{"g": 0, "q": "Você já possui um portfólio com seus projetos e produções escolares?", "m": "Que evidências mostram suas habilidades?", "a": "Selecionar três trabalhos para iniciar um portfólio."}, {"g": 0, "q": "Você já possui certificados de cursos, oficinas ou palestras?", "m": "Que conhecimentos você adquiriu além das aulas?", "a": "Pesquisar um curso gratuito com certificado."}, {"g": 0, "q": "Você acompanha conteúdos confiáveis sobre Administração, economia ou empreendedorismo?", "m": "Como verificar a qualidade dessas fontes?", "a": "Selecionar dois canais educativos confiáveis."}, {"g": 0, "q": "Você costuma tomar iniciativa para aprender algo novo por conta própria?", "m": "Qual aprendizagem você começou sem ser obrigado?", "a": "Definir um desafio de aprendizagem para este mês."}, {"g": 1, "q": "Você utiliza inteligência artificial para estudar e verifica suas respostas?", "m": "Como identificar possíveis erros da IA?", "a": "Conferir respostas em fontes confiáveis."}, {"g": 1, "q": "Você sabe usar planilhas para organizar dados e criar gráficos?", "m": "Como isso ajuda a tomar decisões?", "a": "Criar uma planilha simples de despesas."}, {"g": 1, "q": "Você já criou apresentações ou conteúdos digitais para comunicar ideias?", "m": "Como tornar sua comunicação mais clara?", "a": "Preparar uma apresentação de dois minutos."}, {"g": 1, "q": "Você já colaborou em um projeto, no mesmo arquivo, com outros colegas usando ferramentas digitais? [Google Slides, Canva, etc.]", "m": "Como dividir responsabilidades e colaborar com respeito?", "a": "Organizar uma tarefa compartilhada em grupo."}, {"g": 2, "q": "Você já realizou um simulado com questões anteriores do ENEM?", "m": "Que áreas precisam de maior atenção?", "a": "Fazer um simulado e analisar os erros."}, {"g": 2, "q": "Você tem uma rotina semanal de estudos para o ENEM?", "m": "Seu plano também respeita o descanso?", "a": "Criar um cronograma realista."}, {"g": 2, "q": "Você já escreveu uma redação no modelo ENEM e recebeu feedback?", "m": "Que competência precisa melhorar?", "a": "Produzir uma redação e pedir devolutiva."}, {"g": 2, "q": "Você já pesquisou cursos superiores e formas de ingresso?", "m": "Que cursos combinam com seus interesses?", "a": "Pesquisar três opções de graduação."}, {"g": 3, "q": "Você já participou de um projeto empreendedor ou organizou um evento?", "m": "Que problema da escola poderia ser resolvido?", "a": "Esboçar uma proposta de iniciativa."}, {"g": 3, "q": "Você já elaborou um currículo com suas competências escolares?", "m": "Que habilidades você já tem mesmo sem emprego formal?", "a": "Montar a primeira versão do currículo."}, {"g": 3, "q": "Você já organizou um orçamento pessoal com gastos e metas?", "m": "Como distinguir necessidades e desejos?", "a": "Registrar gastos por uma semana."}, {"g": 3, "q": "Você já definiu metas para os próximos dois anos?", "m": "Qual é o primeiro passo mensurável?", "a": "Registrar três metas com prazos."}, {"g": 4, "q": "Você reserva tempo para esporte, cultura, leitura ou atividades prazerosas?", "m": "Como o lazer contribui para seu bem-estar?", "a": "Reservar um momento de lazer escolhido livremente."}, {"g": 4, "q": "Você consegue equilibrar estudos, lazer e descanso?", "m": "Que hábito poderia melhorar seu equilíbrio?", "a": "Organizar uma semana com pausas."}, {"g": 4, "q": "Você já trocou tempo de tela por convivência ou atividade presencial?", "m": "Você escolhe seu tempo ou segue os algoritmos?", "a": "Experimentar um período sem redes sociais."}, {"g": 4, "q": "Você consegue descansar sem sentir que precisa estar produzindo?", "m": "Por que descansar é um direito e uma necessidade?", "a": "Planejar um momento de descanso sem cobranças."}],colors=['#2563eb','#0891b2','#0d9488','#7c3aed','#c08422'];let state={used:[],active:-1,counts:{},notes:{},className:'',total:10,mode:null};try{const s=JSON.parse(localStorage.getItem('rodaProjetoVidaV5'));if(s&&Array.isArray(s.used))state={...state,...s}}catch(e){};const $=id=>document.getElementById(id);const saveState=()=>{state.className=$('className').value;state.total=state.mode==='individual'?1:Math.max(1,Number($('total').value)||10);try{localStorage.setItem('rodaProjetoVidaV5',JSON.stringify(state))}catch(e){}};
function setMode(mode,reset=false){
 if(!['individual','collective'].includes(mode))return;
 if(reset){state={used:[],active:-1,counts:{},notes:{},className:'',total:mode==='individual'?1:10,mode};lastGroup=-1;angle=0;wheel(0);$('className').value='';$('spinMessage').textContent='';}
 state.mode=mode;if(mode==='individual')state.total=1;
 $('welcome').classList.add('hidden');$('appMain').classList.remove('hidden');
 $('collectiveTotal').classList.toggle('hidden',mode==='individual');
 $('individualAnswer').classList.toggle('hidden',mode!=='individual');
 $('collectiveAnswer').classList.toggle('hidden',mode==='individual');
 $('modeIndicator').textContent=mode==='individual'?'EXPERIÊNCIA INDIVIDUAL':'EXPERIÊNCIA COLETIVA';
 document.querySelector('#roda .intro').textContent=mode==='individual'?'Uma questão por vez, alternando os cinco eixos. Responda SIM ou NÃO, explore a mediação e registre seus comentários para refletir sobre suas competências e possibilidades de desenvolvimento.':'Uma questão por vez, alternando os cinco eixos. Registre quantos estudantes responderam SIM, explore a mediação e registre comentários para promover o diálogo e identificar possibilidades de intervenção interdisciplinar.';
 $('totalCaption').textContent=mode==='individual'?'Participação:':'Participantes:';
 $('totalChangeHint').textContent=mode==='individual'?'Respostas individuais.':'Para alterar, volte à tela da roda.';
 $('total').value=state.total;saveState();update();tab('roda');
}
$('backWheel').onclick=()=>{tab('roda')};
$('chooseIndividual').onclick=()=>setMode('individual',true);
$('chooseCollective').onclick=()=>setMode('collective',true);
$('fullScreen').onclick=async()=>{try{if(!document.fullscreenElement)await document.documentElement.requestFullscreen();else await document.exitFullscreen()}catch(e){alert('O navegador não permitiu a tela cheia.')}};
function selectAnswer(n){$('count').value=String(n);$('answerYes').classList.toggle('selected',n===1);$('answerNo').classList.toggle('selected',n===0);saveCurrent()}
$('answerYes').onclick=()=>selectAnswer(1);$('answerNo').onclick=()=>selectAnswer(0);
function tab(name){document.querySelectorAll('main>section[id]').forEach(s=>{if(['roda','pergunta','questoes','relatorio'].includes(s.id))s.classList.toggle('hidden',s.id!==name)});document.querySelectorAll('nav button').forEach(b=>b.classList.toggle('on',b.dataset.tab===name));if(name==='relatorio')radar();if(name==='questoes')list()};document.querySelectorAll('nav button').forEach(b=>b.onclick=()=>tab(b.dataset.tab));
// Setores giram, mas seus rótulos permanecem sempre legíveis; miolo é fixo.
function wheel(rotation=angle){
 const c=$('wheel'),x=c.getContext('2d'),cx=250,cy=250,r=214;
 const rot=rotation*Math.PI/180;
 x.clearRect(0,0,500,500);
 for(let i=0;i<5;i++){
  const a=-Math.PI/2+i*2*Math.PI/5+rot,b=a+2*Math.PI/5,mid=(a+b)/2;
  x.beginPath();x.moveTo(cx,cy);x.arc(cx,cy,r,a,b);x.closePath();
  x.fillStyle=colors[i];x.fill();x.strokeStyle='#071525';x.lineWidth=5;x.stroke();
  // Letras verticais, nunca invertidas, inclusive no eixo sorteado.
  const labels=[['PROTAGONISMO'],['TECNOLOGIA'],['ENEM'],['CARREIRA'],['LAZER E','TEMPO LIVRE']][i];
  const tx=cx+145*Math.cos(mid),ty=cy+145*Math.sin(mid);
  x.save();x.translate(tx,ty);x.textAlign='center';x.textBaseline='middle';
  x.fillStyle='#fff';x.font='bold 16px system-ui';
  labels.forEach((line,j)=>x.fillText(line,0,(j-(labels.length-1)/2)*21,118));
  x.restore();
 }
 // Disco central permanece imóvel, sem encostar nas divisórias.
 x.beginPath();x.arc(cx,cy,86,0,Math.PI*2);x.fillStyle='#112742';x.fill();
 x.strokeStyle='#f5d17d';x.lineWidth=6;x.stroke();
 x.textAlign='center';x.textBaseline='middle';x.font='bold 19px system-ui';
 x.fillStyle='#fff';x.fillText('RODA DAS',cx,cy-15);
 x.fillStyle='#58dce9';x.font='bold 17px system-ui';x.fillText('COMPETÊNCIAS',cx,cy+15);
}
let isSpinning=false,angle=0,lastGroup=state.active>=0?questions[state.active].g:-1;
function select(i){if(isSpinning)return;if(!state.used.includes(i))state.used.push(i);state.active=i;lastGroup=questions[i].g;saveState();update();tab('pergunta')}
function spin(){if(isSpinning)return;const rest=questions.map((_,i)=>i).filter(i=>!state.used.includes(i));if(!rest.length){alert('As 20 perguntas já foram realizadas.');return}
// Enquanto existirem questões de outros eixos, nunca repetir o eixo imediatamente anterior.
let eligible=rest.filter(i=>questions[i].g!==lastGroup);if(!eligible.length)eligible=rest;
const i=eligible[Math.floor(Math.random()*eligible.length)],g=questions[i].g;
isSpinning=true;tab('roda');$('spin').disabled=true;$('next').disabled=true;$('spinMessage').textContent='A roda está girando…';
// Centro do setor g está em -54 + 72*g graus; alinhar ao indicador fixo no topo.
const desired=-36-72*g;const normalized=((desired-angle)%360+360)%360;
angle+=360*5+normalized;
const from=angle-(360*5+normalized),to=angle,start=performance.now(),duration=3100;
 function animate(now){const t=Math.min(1,(now-start)/duration);const eased=1-Math.pow(1-t,4);
 wheel(from+(to-from)*eased);if(t<1)requestAnimationFrame(animate);}
 requestAnimationFrame(animate);
setTimeout(()=>{isSpinning=false;state.used.push(i);state.active=i;lastGroup=g;saveState();update();$('next').disabled=false;$('spinMessage').textContent='Eixo sorteado: '+groups[g];tab('pergunta')},5100);
}
function saveCurrent(){
 if(state.active<0)return true;
 const raw=$('count').value.trim();
 if(raw!==''){
  const n=Number(raw);
  if(!Number.isInteger(n)||n<0||n>state.total){alert('Informe um número inteiro de respostas SIM entre 0 e '+state.total+'.');$('count').focus();return false}
  state.counts[state.active]=n;
 }else{delete state.counts[state.active]}
 state.notes[state.active]=$('note').value;saveState();return true;
}
$('spin').onclick=()=>{if(state.active>=0){alert('Para avançar, utilize SALVAR E SORTEAR PRÓXIMA PERGUNTA na questão atual.');tab('pergunta');return}spin()};
$('next').onclick=()=>{if(state.active<0)return; if($('count').value.trim()===''){alert('Registre e confirme a resposta SIM ou NÃO antes de continuar.');$('count').focus();return}if(saveCurrent())spin()};
$('save').onclick=()=>{if(saveCurrent())alert('Registro salvo com sucesso.')};
$('last').onclick=()=>{if(state.active>=0)tab('pergunta')};
$('count').onchange=()=>{};
$('note').onchange=()=>{};
$('className').onchange=saveState;
$('total').onchange=()=>{
 const n=Number($('total').value);
 if(!Number.isInteger(n)||n<1){alert('Informe uma quantidade válida de participantes.');$('total').value=state.total;return}
 if(Object.values(state.counts).some(v=>v>n)){if(!confirm('Algumas questões possuem mais respostas SIM do que o novo total. Esses registros serão removidos. Continuar?')){$('total').value=state.total;return}Object.keys(state.counts).forEach(k=>{if(state.counts[k]>n)delete state.counts[k]})}
 saveState();$('totalSummary').textContent=state.total;radar();
};
function list(){
 const target=$('list');target.replaceChildren();
 questions.forEach((q,i)=>{
  const unlocked=state.used.includes(i), answered=state.counts[i]!==undefined;
  const b=document.createElement('button');
  b.className='item bank-question'+(unlocked?' unlocked':' locked');
  b.disabled=!unlocked;
  const status=document.createElement('span');status.className='bank-status';
  status.textContent=!unlocked?'🔒 NÃO SORTEADA':answered?'✓ RESPONDIDA':'○ SORTEADA · SEM RESPOSTA';
  const content=document.createElement('span');content.className='bank-content';
  const title=document.createElement('strong');title.textContent=(i+1)+'. '+groups[q.g];
  const question=document.createElement('span');question.textContent=unlocked?q.q:'Questão disponível após o sorteio';
  content.append(title,question);b.append(status,content);
  if(unlocked)b.onclick=()=>{saveCurrent();select(i)};
  target.appendChild(b);
 });
}
function update(){const completed=Object.keys(state.counts).filter(k=>state.counts[k]!==null&&state.counts[k]!==undefined).length;const yesTotal=Object.values(state.counts).reduce((sum,n)=>sum+(Number(n)||0),0);$('counterTop').textContent=state.used.length+' de 20 questões sorteadas';$('answersTop').textContent=completed+' respostas registradas';$('scoreTop').textContent=yesTotal+' respostas SIM · '+state.total+' '+(state.total===1?'participante':'participantes');$('progress').style.width=(state.used.length*5)+'%';$('spin').disabled=state.used.length===20||isSpinning||state.active>=0;$('last').disabled=state.active<0;$('totalSummary').textContent=state.total;if(state.active>=0){const i=state.active,q=questions[i];$('qhead').textContent='QUESTÃO '+(i+1)+' • '+groups[q.g];$('qtext').textContent=q.q;$('med').textContent=q.m;$('action').textContent=q.a;$('count').value=state.counts[i]??'';$('answerYes').classList.toggle('selected',state.counts[i]===1);$('answerNo').classList.toggle('selected',state.counts[i]===0);$('note').value=state.notes[i]||'';$('qcontrols').classList.remove('hidden')}else{$('qhead').textContent='';$('qtext').textContent='Gire a roda para começar.';$('qcontrols').classList.add('hidden')}}
function scores(){return groups.map((_,g)=>{let ids=questions.map((q,i)=>q.g===g?i:-1).filter(i=>i>=0&&state.counts[i]!==undefined);return ids.length?Math.round(100*ids.reduce((a,i)=>a+Number(state.counts[i]),0)/(ids.length*state.total)):null})}
function reflectionData(){
 const v=scores(), entries=v.map((value,g)=>({g,value,ids:questions.map((q,i)=>q.g===g&&state.counts[i]!==undefined?i:-1).filter(i=>i>=0)})).filter(x=>x.value!==null);
 const intro='Este relatório comentado pretende auxiliar a reflexão sobre as competências para o século XXI e apoiar novas aprendizagens. Não avalia o participante nem classifica suas capacidades.';
 if(!entries.length)return [intro,'Ainda não há respostas suficientes para uma apreciação dos eixos. Ao registrar as respostas, surgirão sugestões de mediação e encaminhamento.'];
 const max=Math.max(...entries.map(x=>x.value)),min=Math.min(...entries.map(x=>x.value));
 const strong=entries.filter(x=>x.value===max),growth=entries.filter(x=>x.value===min);
 const join=a=>a.map(x=>groups[x.g]).join(a.length>1?', ':'');
 const paragraphs=[intro];
 if(max>=60)paragraphs.push('É positivo observar '+max+'% de respostas SIM em '+join(strong)+'. Essas experiências podem servir de referência para ampliar iniciativas em outras dimensões.');
 else paragraphs.push('Os percentuais registrados mostram diferentes oportunidades de desenvolvimento. Vale reconhecer as experiências já construídas e avançar gradualmente, sem comparações entre pessoas.');
 if(min<max){const focus=growth.flatMap(x=>x.ids).slice(0,3);const mediation=[...new Set(focus.map(i=>questions[i].m))];const actions=[...new Set(focus.map(i=>questions[i].a))];paragraphs.push('Em '+join(growth)+' ('+min+'%), o convite é aproveitar as práticas já presentes nos eixos de maior participação e experimentar novos passos. Para dialogar: '+(mediation.length?mediation.join(' '):'quais experiências poderiam fortalecer esse eixo?')+' Como encaminhamento: '+(actions.length?actions.join(' '):'definir uma pequena ação concreta e revisá-la depois.'));}
 else {const ids=entries.flatMap(x=>x.ids).slice(0,2);paragraphs.push('Os eixos apresentam percentuais semelhantes. A mediação pode explorar o que favoreceu essas experiências e propor um próximo passo: '+(ids.length?ids.map(i=>questions[i].a).join(' '):'planejar uma ação prática de aprendizagem.'));}
 if(entries.length<5)paragraphs.push('A leitura é parcial: há eixos ainda sem respostas registradas.');
 return paragraphs;
}
function renderReflection(){const target=$('reflectionText');if(target){target.replaceChildren(...reflectionData().map(t=>{const p=document.createElement('p');p.textContent=t;return p}))}}
function radar(){
 const c=$('radar'),x=c.getContext('2d'),cx=300,cy=265,R=172,v=scores();
 x.clearRect(0,0,600,560);x.fillStyle='#102640';x.fillRect(0,0,600,560);
 const pt=(i,r)=>{const a=-Math.PI/2+i*2*Math.PI/5;return[cx+r*Math.cos(a),cy+r*Math.sin(a)]};
 for(let level=1;level<=4;level++){x.beginPath();for(let i=0;i<5;i++){const p=pt(i,R*level/4);i?x.lineTo(...p):x.moveTo(...p)}x.closePath();x.strokeStyle='#4c6680';x.lineWidth=1.3;x.stroke()}
 for(let i=0;i<5;i++){let p=pt(i,R);x.beginPath();x.moveTo(cx,cy);x.lineTo(...p);x.strokeStyle='#4c6680';x.stroke()}
 x.beginPath();v.forEach((val,i)=>{const p=pt(i,R*(val??0)/100);i?x.lineTo(...p):x.moveTo(...p)});x.closePath();x.fillStyle='rgba(34,211,238,.26)';x.fill();x.strokeStyle='#53e2f3';x.lineWidth=4;x.stroke();
 v.forEach((val,i)=>{if(val===null)return;const p=pt(i,R*val/100);x.beginPath();x.arc(...p,6.5,0,Math.PI*2);x.fillStyle=colors[i];x.fill();x.lineWidth=2;x.strokeStyle='#f3f9ff';x.stroke()});
 // Posições fixas para os rótulos: mantêm os textos fora do pentágono e dentro do canvas.
 // A etiqueta do lazer tem duas linhas, alinhadas à direita e afastadas do vértice esquerdo.
 const captions=[
  {lines:['Protagonismo'],x:300,y:33,align:'center'},
  {lines:['Tecnologia'],x:491,y:178,align:'left'},
  {lines:['ENEM'],x:434,y:443,align:'center'},
  {lines:['Carreira'],x:166,y:443,align:'center'},
  {lines:['Lazer','e tempo livre'],x:110,y:165,align:'right'}
 ];
 captions.forEach((label,i)=>{
  x.textAlign=label.align;x.textBaseline='alphabetic';x.fillStyle='#f0f6ff';
  x.font='bold 16px system-ui, Arial, sans-serif';
  label.lines.forEach((line,j)=>x.fillText(line,label.x,label.y+j*21));
  x.font='bold 15px system-ui, Arial, sans-serif';x.fillStyle='#68e4f2';
  x.fillText(v[i]===null?'—':v[i]+'%',label.x,label.y+label.lines.length*21+5);
 });
 x.fillStyle='#d5e4f3';x.font='14px system-ui';x.textAlign='left';x.fillText('Escala: 0% (centro) a 100% (vértices)',14,543);
 $('metrics').innerHTML=groups.map((g,i)=>'<div class="metric-row"><strong>'+g+'</strong><small>'+(v[i]===null?'Sem registros':v[i]+'% de SIM')+' · '+questions.filter((q,j)=>q.g===i&&state.counts[j]!==undefined).length+'/4 perguntas com contagem</small><div class="metric-track"><div class="metric-fill" style="width:'+(v[i]??0)+'%;background:'+colors[i]+'"></div></div></div>').join('');renderReflection();
}
function summary(){const v=scores();return 'RODA DAS COMPETÊNCIAS — RELATÓRIO FORMATIVO\nTurma: '+(state.className||'Não informada')+'\nEstudantes: '+state.total+'\nQuestões realizadas: '+state.used.length+'/20\n\n'+groups.map((g,i)=>g+': '+(v[i]??'Sem dados')+(v[i]===null?'':'%')).join('\n')+'\n\nLEITURA REFLEXIVA\n'+reflectionData().join('\n\n')+'\n\n'+state.used.map(i=>'QUESTÃO '+(i+1)+' — '+questions[i].q+'\nSIM: '+(state.counts[i]??'Não informado')+' | NÃO: '+(state.counts[i]===undefined?'Não informado':state.total-state.counts[i])+'\nMEDIAÇÃO: '+questions[i].m+'\nENCAMINHAMENTO: '+questions[i].a+'\nCOMENTÁRIOS: '+(state.notes[i]||'Não registradas')).join('\n\n')}
$('copy').onclick=async()=>{try{await navigator.clipboard.writeText(summary());$('status').textContent='Resumo copiado.'}catch(e){$('status').textContent='Não foi possível copiar automaticamente.'}};
// Exportação DOCX nativa, sem dependências externas e sem conexão à internet.
const enc=new TextEncoder();
const xmlEscape=t=>String(t??'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&apos;');
function crc32(bytes){let crc=0xffffffff;for(const b of bytes){crc^=b;for(let i=0;i<8;i++)crc=(crc>>>1)^((crc&1)?0xedb88320:0)}return (crc^0xffffffff)>>>0}
function zipDocx(files){const chunks=[],central=[];let pos=0;const u16=n=>[n&255,(n>>>8)&255],u32=n=>[n&255,(n>>>8)&255,(n>>>16)&255,(n>>>24)&255];const add=a=>{chunks.push(a);pos+=a.length};
 for(const [name,bytes] of files){const nb=enc.encode(name),crc=crc32(bytes),off=pos;add(Uint8Array.from([...u32(0x04034b50),...u16(20),...u16(0),...u16(0),...u16(0),...u16(0),...u32(crc),...u32(bytes.length),...u32(bytes.length),...u16(nb.length),...u16(0)]));add(nb);add(bytes);
 central.push(Uint8Array.from([...u32(0x02014b50),...u16(20),...u16(20),...u16(0),...u16(0),...u16(0),...u16(0),...u32(crc),...u32(bytes.length),...u32(bytes.length),...u16(nb.length),...u16(0),...u16(0),...u16(0),...u16(0),...u32(0),...u32(off)]),nb)}
 const centralStart=pos;for(const c of central)add(c);const centralLen=pos-centralStart;add(Uint8Array.from([...u32(0x06054b50),...u16(0),...u16(0),...u16(files.length),...u16(files.length),...u32(centralLen),...u32(centralStart),...u16(0)]));return new Blob(chunks,{type:'application/vnd.openxmlformats-officedocument.wordprocessingml.document'})}
function makeDocx(){
 const v=scores(),paragraphs=[];
 const P=(text,heading=false)=>{paragraphs.push('<w:p><w:pPr>'+(heading?'<w:pStyle w:val="Heading2"/>':'')+'<w:spacing w:after="160"/></w:pPr><w:r><w:t xml:space="preserve">'+xmlEscape(text)+'</w:t></w:r></w:p>')};
 P('RODA DAS COMPETÊNCIAS PARA O SÉCULO XXI',true);P('Laboratório de Projeto de Vida — Protagonismo estudantil • Currículo • Profissão');P('Modalidade: '+(state.mode==='individual'?'Individual':'Coletiva'));P('Turma: '+(state.className||'Não informada'));P('Participantes: '+state.total);P('Questões sorteadas: '+state.used.length+' de 20');
 P('PENTÁGONO DAS COMPETÊNCIAS',true);
 // O gráfico é incluído como PNG dentro do arquivo DOCX.
 paragraphs.push('<w:p><w:r><w:drawing><wp:inline xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing"><wp:extent cx="5486400" cy="5120640"/><wp:docPr id="1" name="Pentágono de resultados"/><a:graphic xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main"><a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/picture"><pic:pic xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture"><pic:nvPicPr><pic:cNvPr id="0" name="Pentagono.png"/><pic:cNvPicPr/></pic:nvPicPr><pic:blipFill><a:blip r:embed="rId2" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"/><a:stretch><a:fillRect/></a:stretch></pic:blipFill><pic:spPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="5486400" cy="5120640"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom></pic:spPr></pic:pic></a:graphicData></a:graphic></wp:inline></w:drawing></w:r></w:p>');
 P('Percentuais de respostas SIM nas questões efetivamente registradas.');groups.forEach((g,i)=>P(g+': '+(v[i]===null?'Sem registros':v[i]+'%')));
 P('LEITURA REFLEXIVA',true);reflectionData().forEach(t=>P(t));P('REGISTROS POR QUESTÃO',true);
 state.used.forEach(i=>{const q=questions[i];P((i+1)+'. '+groups[q.g],true);P(q.q);P('SIM: '+(state.counts[i]??'Não registrado')+' | NÃO: '+(state.counts[i]===undefined?'Não registrado':state.total-state.counts[i]));P('Ponte — Mediação: '+q.m);P('Ponte — Encaminhamento: '+q.a);P('Comentários: '+(state.notes[i]||'Não registrados'))});
 P('Este material é formativo e não classifica estudantes. Evite dados pessoais sensíveis.');
 const documentXml='<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing"><w:body>'+paragraphs.join('')+'<w:sectPr><w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="1100" w:right="1000" w:bottom="1100" w:left="1000"/></w:sectPr></w:body></w:document>';
 const contentTypes='<?xml version="1.0" encoding="UTF-8"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Default Extension="png" ContentType="image/png"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/><Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/></Types>';
 const rels='<?xml version="1.0" encoding="UTF-8"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>';
 const docrels='<?xml version="1.0" encoding="UTF-8"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="media/pentagono.png"/></Relationships>';
 const styles='<?xml version="1.0" encoding="UTF-8"?><w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:style w:type="paragraph" w:styleId="Heading2"><w:name w:val="heading 2"/><w:rPr><w:b/><w:color w:val="1768C7"/><w:sz w:val="30"/></w:rPr></w:style></w:styles>';
 const png=$('radar').toDataURL('image/png').split(',')[1],binary=atob(png),img=Uint8Array.from(binary,c=>c.charCodeAt(0));
 return zipDocx([['[Content_Types].xml',enc.encode(contentTypes)],['_rels/.rels',enc.encode(rels)],['word/document.xml',enc.encode(documentXml)],['word/styles.xml',enc.encode(styles)],['word/_rels/document.xml.rels',enc.encode(docrels)],['word/media/pentagono.png',img]]);
}
$('export').onclick=()=>{try{saveState();radar();const blob=makeDocx(),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='Roda_das_Competencias_Sec_XXI_Relatorio.docx';document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),30000);$('status').textContent='Relatório DOCX gerado e disponibilizado para download.'}catch(e){$('status').textContent='Não foi possível gerar o DOCX: '+e.message;console.error(e)}};
$('reportBack').onclick=()=>tab('roda');$('reportReset').onclick=()=>$('resetHome').click();$('resetHome').onclick=()=>{if(!confirm('Apagar todos os registros e reiniciar?'))return;state={used:[],active:-1,counts:{},notes:{},className:state.className,total:state.total,mode:state.mode};lastGroup=-1;angle=0;wheel(0);$('spinMessage').textContent='';saveState();update();tab('roda')};$('changeExperience').onclick=()=>{const hasRecords=state.used.length>0||Object.keys(state.counts).length>0||Object.values(state.notes).some(v=>String(v||'').trim());if(hasRecords&&!confirm('Finalizar esta experiência e voltar à escolha de modalidade? As respostas e comentários desta experiência serão apagados. Se desejar guardá-los, baixe antes o relatório DOCX.'))return;state={used:[],active:-1,counts:{},notes:{},className:'',total:10,mode:null};lastGroup=-1;angle=0;wheel(0);$('spinMessage').textContent='';$('className').value='';$('total').value='10';$('welcome').classList.remove('hidden');$('appMain').classList.add('hidden');try{localStorage.removeItem('rodaProjetoVidaV5')}catch(e){};update();window.scrollTo(0,0)};$('className').value=state.className;$('total').value=state.total;$('totalSummary').textContent=state.total;wheel();update();

// v19: manter o layout sincronizado com o modo de tela cheia.
document.addEventListener('fullscreenchange',()=>{
  document.documentElement.classList.toggle('fullscreen-active',Boolean(document.fullscreenElement));
  const btn=document.getElementById('fullScreen');
  if(btn)btn.textContent=document.fullscreenElement?'⛶ SAIR DA TELA CHEIA':'⛶ TELA CHEIA';
  window.dispatchEvent(new Event('resize'));
});
