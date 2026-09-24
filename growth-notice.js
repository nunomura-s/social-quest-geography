// 全分野共通。通知を確認するまで、学習日と一緒に保存する。
(()=>{
 const base=new URL('.',document.currentScript.src);
 const params=new URLSearchParams(location.search);
 if(params.has('sampleReview')||params.has('sampleWeak'))return;
 const css=document.createElement('link');css.rel='stylesheet';css.href=new URL('growth-notice.css',base);document.head.append(css);
 const dialog=document.createElement('dialog');dialog.id='quest-growth-notice';dialog.setAttribute('aria-labelledby','quest-growth-title');
 const title=document.createElement('h2');title.id='quest-growth-title';
 const name=document.createElement('h3'),img=document.createElement('img'),description=document.createElement('p'),message=document.createElement('p'),ok=document.createElement('button');
 ok.type='button';ok.textContent='OK';dialog.append(title,name,img,description,message,ok);document.body.append(dialog);
 let current=null,after=null,previous=null;
 function show(callback){
  if(dialog.open)return true;
  const n=QuestProgress.pending();if(!n)return false;
  current=n;after=callback;previous=document.activeElement;
  const c=CHARACTERS[n.level-1];
  title.textContent=n.levelUp?'レベルアップ！':'経験値を1獲得！';
  name.hidden=img.hidden=description.hidden=!n.levelUp;
  if(n.levelUp&&c){name.textContent=`Lv.${n.level} ${c.name}`;img.src=new URL(c.image,base);img.alt=c.name;description.textContent=c.description;}
  message.textContent=n.level===100?'最高レベル100！ 今日も学習できました。':n.levelUp?'次のレベルまで、あと3日学習しよう！':`現在 ${n.experience}／3。次のレベルまであと${n.remaining}日です。`;
  dialog.showModal();ok.focus();return true;
 }
 ok.addEventListener('click',()=>{
  if(!QuestProgress.acknowledge(current.date)){message.textContent='通知の確認を保存できませんでした。もう一度OKを押してください。';return;}
  dialog.close();const callback=after;after=null;previous?.focus();if(callback)callback();
 });
 dialog.addEventListener('cancel',e=>{e.preventDefault();ok.click();});
 document.addEventListener('click',e=>{
  const target=e.target.closest?.('#back, a[href]');if(!target||!QuestProgress.pending())return;
  const isBack=target.id==='back';
  const url=isBack?null:new URL(target.href,location.href);
  if(!isBack&&!(url.origin===base.origin&&url.pathname===new URL('index.html',base).pathname&&url.hash==='#home'))return;
  e.preventDefault();e.stopImmediatePropagation();show(()=>target.click());
 },true);
 const home=()=>{if(!location.pathname.match(/\/(geography|history)\//)&&(!location.hash||location.hash==='#home')&&!document.body.classList.contains('auth-locked'))show();};
 window.addEventListener('pageshow',home);window.addEventListener('hashchange',home);
 new MutationObserver(home).observe(document.body,{attributes:true,attributeFilter:['class']});
 home();
})();
