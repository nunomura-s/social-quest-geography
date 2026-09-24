'use strict';
const $ = id => document.getElementById(id);
const STAGES = ['はじめての冒険','お仕事ワールド','スポーツ大会','へんしんワールド','歴史の旅','季節のめぐり','未来と宇宙','物語の世界','伝説の生きもの','光り輝く、その先へ'];
let preview = {level:1, days:3, review:'live'};
function el(tag,className,text){const e=document.createElement(tag);if(className)e.className=className;if(text!==undefined)e.textContent=text;return e;}
function characterImage(c,silhouette=false){const img=el('img',silhouette?'silhouette':'');img.src=c.image;img.alt=silhouette?'次のいっしーのシルエット':c.name;img.loading='lazy';img.width=200;img.height=200;return img;}
function renderHome(){if(preview.review==='live')Object.assign(preview,Study.growth());const c=CHARACTERS[preview.level-1];$('current-level').textContent=`Lv.${c.level}`;$('character-name').textContent=c.name;$('current-image').src=c.image;$('current-image').alt=c.name;
 const max=c.level===100;$('growth-text').replaceChildren();if(max){$('growth-text').textContent='Lv.100 達成！ これからも一緒に冒険しよう';}else{$('growth-text').append('次のレベルまで ',el('strong','',`あと${preview.days}日`));}
 $('growth-count').textContent=max?'':`Lv.${c.level+1}へ`;$('growth-progress').hidden=max;$('growth-progress').setAttribute('aria-valuenow',String(3-preview.days));$('progress-fill').style.width=`${(3-preview.days)/3*100}%`;
 $('next-character').replaceChildren();$('next-character').hidden=max;if(!max){$('next-character').append(characterImage(CHARACTERS[c.level],true));const label=el('span','',`NEXT · Lv.${c.level+1}`);label.append(el('strong','','？？？'));$('next-character').append(label);}
 $('collection-total').textContent=`${c.level} / 100`;if(preview.review==='live')Study.renderHome();WeakHome.refresh();
}
function renderCollection(){const root=$('catalog');root.replaceChildren();$('unlocked-count').textContent=`出会ったいっしー ${preview.level} / 100`;
 STAGES.forEach((name,stageIndex)=>{const section=el('section','stage'),heading=el('div','stage-head');heading.append(el('h2','',`${String(stageIndex+1).padStart(2,'0')}  ${name}`),el('span','',`Lv.${stageIndex*10+1} – ${stageIndex*10+10}`));const cards=el('div','cards');CHARACTERS.slice(stageIndex*10,stageIndex*10+10).forEach(c=>{const achieved=c.level<=preview.level,next=c.level===preview.level+1,current=c.level===preview.level;const card=el('article',`character-card ${current?'current':achieved?'achieved':next?'next-card':'locked'}`);card.id=`level-${c.level}`;const label=el('div','card-label',`Lv.${c.level}`);if(current)label.append(el('b','','今のいっしー'));card.append(label);
 if(achieved){card.append(characterImage(c),el('h3','',c.name),el('p','character-description',c.description));}else if(next){card.append(characterImage(c,true),el('h3','','？？？'),el('p','',`あと${preview.days}日で出会えるよ`));}else{card.append(el('div','lock-art','◇'),el('h3','','未開放'),el('p','','これからのお楽しみ'));}cards.append(card);});section.append(heading,cards);root.append(section);});
}
function navigate(){const collection=location.hash==='#collection',study=location.hash==='#study';$('home').hidden=collection||study;$('collection').hidden=!collection;$('study').hidden=!study;if(collection)renderCollection();else if(study)Study.render();else renderHome();window.scrollTo(0,0);}
function notice(title,body){$('notice-title').textContent=title;$('notice-body').textContent=body;$('notice').showModal();}
$('open-collection').addEventListener('click',()=>{location.hash='collection';});$('back-home').addEventListener('click',()=>{location.hash='home';});window.addEventListener('hashchange',navigate);
$('jump-current').addEventListener('click',()=>{document.getElementById(`level-${preview.level}`).scrollIntoView({block:'center',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});});
document.querySelectorAll('[data-action]').forEach(button=>button.addEventListener('click',()=>{if(['geo','history'].includes(button.dataset.action)){Study.select(button.dataset.action);return;}if(button.dataset.action==='weak')WeakHome.start();}));
document.querySelectorAll('.close,.close-action').forEach(button=>button.addEventListener('click',()=>$('notice').close()));
Study.init();renderHome();navigate();
