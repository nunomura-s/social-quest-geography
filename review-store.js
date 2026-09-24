/* 単元と出題区分を組にして、復習予定を独立管理する。 */
const QuestReviews=(()=>{
 const KEY='socialQuestReleaseReviewsV1';
 const demo=typeof location!=='undefined'&&new URLSearchParams(location.search).has('sampleReview');
 let demoState=null;
 function today(){const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;}
 function addDays(day,n){const d=new Date(day+'T00:00:00Z');d.setUTCDate(d.getUTCDate()+n);return d.toISOString().slice(0,10);}
 function group(q){return `${q.subject==='hist'?'hist':'geo'}:${q.quizNo}:${q.lessonOrder}:${q.category}`;}
 function read(){const raw=demo?demoState:localStorage.getItem(KEY);const s=raw?JSON.parse(raw):{version:1,groups:{}};if(s.version!==1||!s.groups||typeof s.groups!=='object'||Array.isArray(s.groups))throw Error('復習記録の形式を確認できません');for(const g of Object.values(s.groups)){if(!g||!Array.isArray(g.questions)||!g.questions.length||!Array.isArray(g.reviews)||g.reviews.length!==2||!g.reviews.every(r=>[3,14].includes(r.interval)&&typeof r.due==='string'&&Array.isArray(r.answered)))throw Error('復習記録が破損しています');}return s;}
 function change(action){try{const s=read();action(s);if(demo)demoState=JSON.stringify(s);else localStorage.setItem(KEY,JSON.stringify(s));return true;}catch(e){let p=document.getElementById('review-save-error');if(!p){p=document.createElement('p');p.id='review-save-error';p.setAttribute('role','alert');p.style.cssText='padding:15px;background:#fff0e6;color:#8c2929';document.body.prepend(p);}p.textContent='復習記録を保存できません。元の記録は残しています。保存設定を確認してから、もう一度お試しください。';return false;}}
 function observe(q,bank,day=today()){return change(s=>{const id=group(q);if(s.groups[id])return;const scope=bank.filter(x=>group(x)===id).map(x=>x.id);s.groups[id]={id,name:q.lessonName,category:q.category,started:day,questions:scope,reviews:[3,14].map(interval=>({interval,due:addDays(day,interval),answered:[],completed:null}))};});}
 function task(id,interval){const g=read().groups[id],r=g?.reviews.find(r=>r.interval===interval);return g&&r?{...r,id:g.id,name:g.name,category:g.category,questions:g.questions}:null;}
 function answer(id,interval,qid,day=today()){return change(s=>{const g=s.groups[id],r=g?.reviews.find(r=>r.interval===interval);if(!r||!g.questions.includes(qid))throw Error('対象外の問題です');if(r.completed)return;if(!r.answered.includes(qid))r.answered.push(qid);if(g.questions.every(q=>r.answered.includes(q)))r.completed=day;});}
 function due(day=today()){return Object.values(read().groups).flatMap(g=>g.reviews.filter(r=>!r.completed&&r.due<=day).map(r=>({...r,id:g.id,name:g.name,category:g.category,total:g.questions.length}))).sort((a,b)=>a.due.localeCompare(b.due)||a.id.localeCompare(b.id)||a.interval-b.interval);}
 function completedToday(day=today()){return Object.values(read().groups).some(g=>g.reviews.some(r=>r.completed===day));}
 return {today,addDays,group,read,observe,task,answer,due,completedToday};
})();
