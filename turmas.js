/* V37 — Gestão local de turmas, histórico e backup JSON. Sem serviços externos. */
(()=>{
'use strict';
const KEY='rodaXXITurmasV37', MAX_BYTES=5*1024*1024;
const el=id=>document.getElementById(id);
const empty=()=>({version:37,classes:[]});
let db=empty(), selected=null, loadedClassId=null;
window.currentClassId='';
const stamp=()=>new Date().toISOString();
const uid=()=>('c'+Date.now().toString(36)+Math.random().toString(36).slice(2,9));
const status=t=>{el('cmStatus').textContent=t};
const clone=x=>JSON.parse(JSON.stringify(x));
const safeStr=(v,n=1500)=>typeof v==='string'?v.slice(0,n):'';
const isObj=v=>v!==null&&typeof v==='object'&&!Array.isArray(v);
function read(){try{const d=JSON.parse(localStorage.getItem(KEY)||'null');if(isObj(d)&&Array.isArray(d.classes)){db=d;let changed=false;db.classes.forEach(c=>{if((c.experiences||[]).length>1){c.experiences.sort((a,b)=>Date.parse(b.date||0)-Date.parse(a.date||0));c.experiences=c.experiences.slice(0,1);changed=true}if(!c.updatedAt&&c.experiences?.length){c.updatedAt=c.experiences[0].date;changed=true}});if(changed)persist();const remembered=localStorage.getItem('rodaXXISelectedClass');selected=db.classes.some(c=>c.id===remembered)?remembered:null;window.currentClassId=selected||''}}catch(e){status('Não foi possível ler as turmas armazenadas.')}}
function persist(){try{localStorage.setItem(KEY,JSON.stringify(db));return true}catch(e){status('Falha ao salvar: armazenamento indisponível ou cheio. Exporte uma cópia de segurança.');return false}}
function current(){return db.classes.find(c=>c.id===selected)}
function loadedClass(){return db.classes.find(c=>c.id===loadedClassId)}
function hasData(){return state.used.length>0||Object.keys(state.counts).length>0||Object.values(state.notes).some(x=>String(x||'').trim())}
function intRecords(){return typeof getInterventions==='function'?clone(getInterventions()):[]}
function snapshot(){return {id:uid(),date:stamp(),mode:state.mode,participants:state.total,used:clone(state.used),active:state.active,counts:clone(state.counts),notes:clone(state.notes),interventions:intRecords()}}
function restoreInterventions(records){if(!Array.isArray(records))return;try{localStorage.setItem(intKey(),JSON.stringify(records.slice(0,5)))}catch(e){status('Não foi possível recuperar as intervenções no armazenamento local.')}}
function archiveCurrentExperience(silent=false){const c=loadedClass();if(!c||state.mode!=='collective')return false;
 if(state.className!==c.name){if(!silent)status('A experiência carregada não corresponde à turma ativa.');return false}
 const snap=snapshot();const old=(c.experiences||[])[0];const signature=x=>JSON.stringify([x.used,x.counts,x.notes,x.interventions,x.participants]);
 if(old&&signature(old)===signature(snap)){if(!silent)status('Nenhuma alteração desde a última edição.');return true}
 snap.id=old?.id||snap.id;c.experiences=[snap];c.updatedAt=snap.date;
 if(!persist())return false;
 if(!silent)status('Dados de '+c.name+' atualizados em '+new Date(c.updatedAt).toLocaleString('pt-BR')+'.');renderClasses();return true}
function pendingChanges(){const c=loadedClass();if(!c||state.mode!=='collective')return false;
 const old=c.experiences?.[0];const currentData=snapshot();
 const normalize=x=>JSON.stringify([x.used||[],x.counts||{},x.notes||{},x.interventions||[],Number(x.participants)]);
 return !old?hasData()||intRecords().some(x=>x.plan||x.evidence||x.reeval):normalize(old)!==normalize(currentData)
}
function askSaveBeforeSwitch(targetName,proceed){
 if(!loadedClassId||loadedClassId===selected&&loadedClass()?.name===targetName||!pendingChanges()){proceed();return}
 const overlay=document.getElementById('cmSaveOverlay');
 document.getElementById('cmSwitchDescription').textContent='Existem registros de experiência ou intervenção ainda não salvos para '+loadedClass().name+'. Antes de acessar '+targetName+', escolha como continuar.';
 overlay.classList.remove('hidden');overlay.setAttribute('aria-hidden','false');
 const close=()=>{overlay.classList.add('hidden');overlay.setAttribute('aria-hidden','true')};
 document.getElementById('cmSwitchSave').onclick=()=>{if(!archiveCurrentExperience(true)){status('Não foi possível salvar. A troca foi cancelada.');close();return}close();proceed()};
 document.getElementById('cmSwitchDiscard').onclick=()=>{close();proceed()};
 document.getElementById('cmSwitchCancel').onclick=()=>{close();renderClasses()};
}
function chooseClass(id){const target=db.classes.find(c=>c.id===id);if(!target){selected=null;renderClasses();return}
 askSaveBeforeSwitch(target.name,()=>{selected=id;window.currentClassId=id;localStorage.setItem('rodaXXISelectedClass',id);renderClasses();if(window.renderV47Dashboard)renderV47Dashboard();status('Turma selecionada: '+target.name+'. Use ABRIR RESULTADOS ou ABRIR INTERVENÇÕES para carregar somente seus registros.')})
}
function clearInterventions(){try{localStorage.removeItem(intKey())}catch(e){}}
function applyRecord(c,r,destination){
 selected=c.id;loadedClassId=c.id;window.currentClassId=c.id;localStorage.setItem('rodaXXISelectedClass',selected);
 setMode('collective',true);
 state.used=clone(r?.used||[]).filter(x=>Number.isInteger(x)&&x>=0&&x<20);
 state.active=Number.isInteger(r?.active)&&r.active>=0&&r.active<20?r.active:-1;
 state.counts=clone(r?.counts||{});state.notes=clone(r?.notes||{});
 state.className=c.name;state.total=c.participants;
 el('className').value=c.name;el('total').value=c.participants;
 if(r)restoreInterventions(r.interventions);else clearInterventions();
 saveState();update();tab(destination);if(typeof radar==='function')radar();renderClasses();if(window.renderV47Dashboard)renderV47Dashboard();status('Dados carregados exclusivamente da turma '+c.name+'.')
}

window.archiveCurrentExperience=archiveCurrentExperience;
function element(tag,cls,txt){const e=document.createElement(tag);if(cls)e.className=cls;if(txt!==undefined)e.textContent=txt;return e}
function btn(label,callback,cls='alt'){const b=element('button',cls,label);b.type='button';b.onclick=callback;return b}
function renderClasses(){
 const list=el('cmClasses');list.replaceChildren();
 if(!db.classes.length){list.append(element('p','cm-empty','Nenhuma turma cadastrada. Clique em + NOVA TURMA.'))}
 else {
  const label=element('label','cm-select-label','ESCOLHER TURMA');label.htmlFor='cmChoose';list.append(label);
  const select=element('select','cm-choose');select.id='cmChoose';const blank=element('option','','Selecione uma turma');blank.value='';select.append(blank);
  db.classes.forEach(c=>{const opt=element('option','',c.name+' · '+c.year);opt.value=c.id;opt.selected=c.id===selected;select.append(opt)});
  select.onchange=()=>chooseClass(select.value||'');list.append(select);
  const c=current();if(c){const b=element('div','cm-class active');b.append(element('strong','',c.name),element('small','',c.year+' · '+c.participants+' participantes'));list.append(b)}
 }
 const c=current();el('cmSelected').textContent=c?c.name:'Selecione uma turma';el('cmStart').disabled=el('cmExportClass').disabled=!c;el('cmArchive').disabled=!c||loadedClassId!==c.id;
 const stats=el('cmStats');stats.replaceChildren();const hist=el('cmHistory');hist.replaceChildren();
 if(!c){hist.append(element('p','cm-empty','Selecione uma turma para visualizar exclusivamente os seus dados.'));return}
 const date=c.updatedAt?new Date(c.updatedAt):null;
 const dateText=date&&!Number.isNaN(date.getTime())?date.toLocaleString('pt-BR'):'Nenhuma edição registrada';
 const badge=element('div','cm-stat');badge.append(element('span','','Ano '+c.year),element('strong','',c.participants+' participantes'),element('span','','Última edição: '+dateText));stats.append(badge);
 const r=(c.experiences||[])[0];
 if(!r){hist.append(element('p','cm-empty','Nenhum registro salvo para esta turma. Inicie uma experiência coletiva.'))}
 else {const card=element('div','cm-history-card');const title=element('div','cm-history-title');title.append(element('strong','','REGISTRO ÚNICO DA TURMA'),element('span','',Object.keys(r.counts||{}).length+' questões respondidas · última edição: '+dateText));card.append(title);
 const actions=element('div','cm-actions');actions.append(btn('ABRIR RESULTADOS',()=>loadExperience(c,r,'relatorio')),btn('ABRIR INTERVENÇÕES',()=>loadExperience(c,r,'intervencao')),btn('EXCLUIR REGISTRO',()=>{if(!confirm('Excluir os dados salvos desta turma? A turma permanecerá cadastrada.'))return;c.experiences=[];c.updatedAt=stamp();persist();renderClasses()},'out danger'));card.append(actions);hist.append(card)}
}

window.renderClasses=renderClasses;
window.v47Classes=()=>db.classes.map(c=>({id:c.id,name:c.name,year:c.year,participants:c.participants,record:clone(c.experiences?.[0]||null)}));
window.v47SelectedClass=()=>selected;
window.v47ChooseClass=(id)=>chooseClass(id);
window.v47StartSelected=()=>{const c=current();if(c)startClass(c);else status('Selecione uma turma primeiro.')};
window.v47OpenCreate=()=>{tab('turmas');el('cmNew').click()};
window.v47ManageSelected=()=>{tab('turmas');renderClasses()};
window.v47EditParticipants=()=>{const c=current();if(!c){status('Selecione uma turma.');return}const raw=prompt('Novo número de participantes para '+c.name+' (1 a 1000):',String(c.participants));if(raw===null)return;const n=Number(raw);if(!Number.isInteger(n)||n<1||n>1000){status('Informe um número inteiro de 1 a 1000.');return}const old=c.participants;if(n<old&&c.experiences?.[0]&&Object.values(c.experiences[0].counts||{}).some(v=>v>n)){status('Há respostas SIM superiores ao novo total. Refaça as perguntas antes de reduzir os participantes.');return}if(!confirm('Alterar participantes de '+old+' para '+n+'?'))return;c.participants=n;c.updatedAt=stamp();if(c.experiences?.[0])c.experiences[0].participants=n;if(loadedClassId===c.id){state.total=n;el('total').value=n;saveState();update()}persist();renderClasses();if(window.renderV47Dashboard)renderV47Dashboard();status('Participantes atualizados para '+n+'.')};
window.v47RedoQuestions=()=>{const c=current();if(!c){status('Selecione uma turma.');return}if(!confirm('REFAZER AS 20 PERGUNTAS de '+c.name+'? Isso apagará respostas, comentários e intervenções salvos desta turma. Exporte um backup antes de continuar.'))return;if(!confirm('Confirmar reinício definitivo da experiência desta turma?'))return;c.experiences=[];c.updatedAt=stamp();if(loadedClassId===c.id){state.used=[];state.active=-1;state.counts={};state.notes={};clearInterventions();saveState();update()}persist();renderClasses();if(window.renderV47Dashboard)renderV47Dashboard();status('Perguntas reiniciadas para '+c.name+'.')};
window.v47DeleteClass=()=>{const c=current();if(!c){status('Selecione uma turma.');return}if(!confirm('EXCLUIR TURMA '+c.name+' e todos os registros? Esta ação não pode ser desfeita.'))return;if(!confirm('Confirma a exclusão definitiva da turma '+c.name+'?'))return;const id=c.id;db.classes=db.classes.filter(x=>x.id!==id);if(loadedClassId===id){loadedClassId=null;state.used=[];state.active=-1;state.counts={};state.notes={};clearInterventions();saveState();update()}selected=null;window.currentClassId='';localStorage.removeItem('rodaXXISelectedClass');persist();renderClasses();if(window.renderV47Dashboard)renderV47Dashboard();status('Turma excluída.')};

function startClass(c){askSaveBeforeSwitch(c.name,()=>applyRecord(c,c.experiences?.[0]||null,'roda'))}
function loadExperience(c,r,destination){askSaveBeforeSwitch(c.name,()=>applyRecord(c,r,destination))}
function download(data,name){const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json;charset=utf-8'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),3000)}
function exportAll(){archiveCurrentExperience(true);download({format:'roda-xxi-backup',version:37,exportedAt:stamp(),classes:clone(db.classes)},'Roda_Seculo_XXI_Turmas_Backup.json');status('Cópia JSON exportada. Guarde o arquivo em local protegido.')}
function exportClass(){const c=current();if(!c)return;if(loadedClassId===c.id)archiveCurrentExperience(true);download({format:'roda-xxi-backup',version:37,exportedAt:stamp(),classes:[clone(c)]},'Roda_XXI_'+c.name.replace(/[^a-z0-9-]/gi,'_')+'.json')}
function validRecord(r){if(!isObj(r)||!Array.isArray(r.used)||!isObj(r.counts)||!isObj(r.notes)||!Array.isArray(r.interventions))return false;if(!Number.isInteger(r.participants)||r.participants<1||r.participants>1000)return false;if(r.used.length>20||r.used.some(x=>!Number.isInteger(x)||x<0||x>19))return false;return Object.entries(r.counts).every(([k,v])=>/^\d{1,2}$/.test(k)&&Number(k)<20&&Number.isInteger(v)&&v>=0&&v<=r.participants)}
function validClass(c){return isObj(c)&&typeof c.name==='string'&&c.name.trim().length>0&&c.name.length<=90&&Number.isInteger(c.year)&&c.year>=2000&&c.year<=2100&&Number.isInteger(c.participants)&&c.participants>=1&&c.participants<=1000&&Array.isArray(c.experiences)&&c.experiences.length<=500&&c.experiences.every(validRecord)}
function normalizeClass(c){return {id:safeStr(c.id,80)||uid(),name:c.name.trim(),year:c.year,participants:c.participants,createdAt:safeStr(c.createdAt,60)||stamp(),updatedAt:stamp(),experiences:c.experiences.slice(0,1).map(r=>({id:safeStr(r.id,80)||uid(),date:safeStr(r.date,60)||stamp(),mode:'collective',participants:r.participants,used:r.used.slice(),active:Number.isInteger(r.active)?r.active:-1,counts:clone(r.counts),notes:Object.fromEntries(Object.entries(r.notes).map(([k,v])=>[k,safeStr(v,2000)])),interventions:r.interventions.slice(0,5).map(x=>({plan:safeStr(x.plan,3000),status:['planejada','em_andamento','realizada'].includes(x.status)?x.status:'planejada',date:safeStr(x.date,12),evidence:safeStr(x.evidence,3000),reeval:safeStr(x.reeval,3000)}))}))}}
async function importFile(file){if(!file)return;if(file.size>MAX_BYTES){status('Arquivo maior que 5 MB. Importação cancelada.');return}try{const data=JSON.parse(await file.text());let incoming=[];
 if(data.format==='roda-xxi-backup'&&data.version===37&&Array.isArray(data.classes))incoming=data.classes;
 else if(data.version==='36'&&Array.isArray(data.questions)&&Array.isArray(data.interventions)){
 const participants=Number(data.participants);const counts={},used=[],notes={};data.questions.forEach((q,i)=>{if(q.yes!==null&&q.yes!==undefined){counts[i]=Number(q.yes);used.push(i)}});
 incoming=[{id:uid(),name:safeStr(data.turma,90)||'Turma importada (V36)',year:new Date().getFullYear(),participants,experiences:[{id:uid(),date:safeStr(data.exportedAt,60)||stamp(),participants,used,active:-1,counts,notes,interventions:data.interventions}]}]
 }else throw Error('Formato incompatível. Selecione backup V37 ou exportação V36.');
 if(!incoming.length||incoming.length>100||!incoming.every(validClass))throw Error('Arquivo contém dados inválidos ou incompletos.');
 const cleaned=incoming.map(normalizeClass);const count=cleaned.reduce((a,c)=>a+c.experiences.length,0);
 if(!confirm('Importar '+cleaned.length+' turma(s) e '+count+' experiência(s)?\n\nOK = mesclar com as turmas atuais. Cancelar = não importar.'))return;
 let added=0,merged=0;for(const c of cleaned){let old=db.classes.find(x=>x.id===c.id);if(!old){db.classes.push(c);added++;continue}const candidate=c.experiences[0],previous=old.experiences?.[0];if(candidate&&(!previous||Date.parse(candidate.date||0)>Date.parse(previous.date||0))){old.experiences=[candidate];old.updatedAt=candidate.date;merged++}}
 if(!persist())return;selected=cleaned[0].id;window.currentClassId=selected;localStorage.setItem('rodaXXISelectedClass',selected);renderClasses();status('Importação concluída: '+added+' novas turmas e '+merged+' experiências adicionadas a turmas existentes.');
 }catch(e){status('Importação cancelada: '+e.message)}finally{el('cmFile').value=''}}
el('cmNew').onclick=()=>{el('cmForm').classList.remove('hidden');el('cmYear').value=new Date().getFullYear();el('cmName').focus()};
el('cmCancel').onclick=()=>el('cmForm').classList.add('hidden');
el('cmCreate').onclick=()=>{const name=el('cmName').value.trim(),year=Number(el('cmYear').value),participants=Number(el('cmSize').value);if(!name||name.length>90||!Number.isInteger(year)||year<2000||year>2100||!Number.isInteger(participants)||participants<1||participants>1000){status('Preencha nome, ano e número válido de participantes.');return}const c={id:uid(),name,year,participants,createdAt:stamp(),updatedAt:stamp(),experiences:[]};db.classes.push(c);if(!persist()){db.classes.pop();return}selected=c.id;window.currentClassId=c.id;localStorage.setItem('rodaXXISelectedClass',selected);el('cmForm').classList.add('hidden');el('cmName').value='';renderClasses();status('Turma cadastrada. Você já pode iniciar a experiência coletiva.')};
el('cmStart').onclick=()=>{const c=current();if(c)startClass(c)};
el('cmArchive').onclick=()=>{if(!archiveCurrentExperience())status('Abra primeiro os dados da turma para salvar.');};
el('cmExport').onclick=exportAll;el('cmExportClass').onclick=exportClass;el('cmImport').onclick=()=>el('cmFile').click();el('cmFile').onchange=e=>importFile(e.target.files[0]);
read();renderClasses();
})();
