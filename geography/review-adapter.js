// 既存の出題・答え・解説・画像拡大を復習でも使用する。
let activeReview=null;
const sampleReview=new URLSearchParams(location.search).get("sampleReview");
function openRequestedReview(){
 const params=new URLSearchParams(location.search);let id=params.get('review'),interval=Number(params.get('interval'));
 if(sampleReview){const category=sampleReview==='check'?'確認':'入試',q=DATA.find(q=>q.lessonOrder===(DATA[0]?.subject==='hist'?6:2)&&q.category===category);interval=sampleReview==='check'?3:14;QuestReviews.observe(q,DATA,QuestReviews.addDays(QuestReviews.today(),-interval));id=QuestReviews.group(q);const banner=document.createElement('p');banner.textContent='お試し復習：学習記録やいっしーの成長には保存されません。';banner.style.cssText='padding:16px;background:#fff4cf;color:#493a12';document.body.prepend(banner);}
 if(!id)return;
 try{const task=QuestReviews.task(id,interval);if(!task||![3,14].includes(interval)||task.due>QuestReviews.today()){showReviewMessage('この復習はまだ開始できません。トップから予定をご確認ください。');return;}activeReview={id,interval};pool=DATA.filter(q=>task.questions.includes(q.id));if(pool.length!==task.questions.length)throw Error('問題の読み込みを確認してください');$('selectScreen').classList.add('hidden');$('studyScreen').classList.remove('hidden');nextReviewQuestion();}catch(e){showReviewMessage('復習記録を読み込めません。記録は削除していません。トップへ戻って確認してください。');}
}
function showReviewMessage(message){$('selectScreen').classList.add('hidden');$('studyScreen').classList.remove('hidden');$('question').textContent=message;$('progressText').textContent='復習';['showAnswer','showExplanation','known','next','again'].forEach(id=>{if($(id))$(id).disabled=true;});$('back').textContent='トップへ戻る';$('back').onclick=()=>location.href='../index.html#home';}
function nextReviewQuestion(){
 const t=QuestReviews.task(activeReview.id,activeReview.interval);if(t.completed){showReviewMessage(`${t.category}問題の${t.interval}日後の復習が終わりました。よく頑張りました！`);$('progressText').textContent=`${t.name}｜${t.category}問題　${t.questions.length} / ${t.questions.length}問 完了`;$('bar').style.width='100%';$('answer').classList.add('hidden');$('answerPlaceholder').classList.remove('hidden');return;}
 current=pool.find(q=>!t.answered.includes(q.id));resetResponsePanels();$('answer').classList.add('text-answer');$('answer').innerHTML=`<div class="fit-text" id="answerTextFit">${esc(current.answer||'答えが登録されていません。')}</div>`;$('known').disabled=false;$('known').classList.remove('known-done');$('known').textContent='知ってる！';$('next').disabled=false;prepareExplanationButton();renderQuestionArea();updateReviewProgress();
}
function updateReviewProgress(){const t=QuestReviews.task(activeReview.id,activeReview.interval);$('progressText').textContent=`${t.name}｜${t.category}問題・${t.interval}日後の復習　${t.answered.length} / ${t.questions.length}問`;$('bar').style.width=`${100*t.answered.length/t.questions.length}%`;}
function recordReviewAnswer(){if(!current)return false;if(!QuestReviews.answer(activeReview.id,activeReview.interval,current.id))return false;if(!sampleReview)QuestProgress.record();return true;}
function reviewKnown(){if(!recordReviewAnswer())return;const t=QuestReviews.task(activeReview.id,activeReview.interval);if(t.completed){nextReviewQuestion();return;}$('known').disabled=true;$('known').classList.add('known-done');$('known').textContent='知ってる！登録済み';updateReviewProgress();}
function reviewNext(){const t=QuestReviews.task(activeReview.id,activeReview.interval);if(!t.answered.includes(current.id)){if($('answer').classList.contains('hidden')){$('showAnswer').click();return;}if(!recordReviewAnswer())return;}nextReviewQuestion();}
