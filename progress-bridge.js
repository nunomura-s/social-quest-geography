/* 地理の元画面と新トップで共有する学習日の記録。旧保存キーは変更しない。 */
const QuestProgress=(()=>{
 const key='socialQuestReleaseProgressV1';
 function day(){const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;}
 function read(){const text=localStorage.getItem(key);if(!text)return {version:1,days:[]};const s=JSON.parse(text);if(s.version!==1||!Array.isArray(s.days)||!s.days.every(d=>/^\d{4}-\d{2}-\d{2}$/.test(d)))throw Error('学習記録の形式を確認できません');return s;}
 function record(){try{const s=read(),date=day();if(!s.days.includes(date)){s.days.push(date);localStorage.setItem(key,JSON.stringify(s));}return true;}catch(e){let box=document.getElementById('quest-save-error');if(!box){box=document.createElement('p');box.id='quest-save-error';box.setAttribute('role','alert');box.style.cssText='background:#fff0e6;color:#8c2929;padding:16px';document.body.prepend(box);}box.textContent='トップへの学習記録を保存できませんでした。ブラウザーの保存設定を確認してください。既存の記録は削除していません。';return false;}}
 function growth(){try{const n=new Set(read().days).size;return {level:Math.min(100,1+Math.floor(n/3)),days:3-n%3};}catch(e){return {level:1,days:3,error:e.message};}}
 return {read,record,growth};
})();
