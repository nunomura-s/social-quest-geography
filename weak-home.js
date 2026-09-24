const WeakHome={
 refresh(){const b=document.querySelector('[data-action="weak"]');try{const s=QuestWeak.status(),active=s.session&&!s.session.completed;b.disabled=!active&&!s.count;b.querySelector('small').textContent=active?`途中から再開（${Object.keys(s.session.known).length} / ${s.session.queue.length}問）`:s.count?`${Math.min(10,s.count)}問に挑戦しよう`:'今は苦手な問題はありません';}catch(e){b.disabled=true;b.querySelector('small').textContent='記録を読み込めません。保存設定をご確認ください。';}},
 async start(demo=false){const b=document.querySelector('[data-action="weak"]');b.disabled=true;try{const se=demo?await QuestWeak.seedDemo():await QuestWeak.start();if(se)location.href=QuestWeak.route(se,demo);}catch(e){notice('記録を確認してください','苦手な問題を開けません。元の記録は残しています。'+e.message);}finally{this.refresh();}}
};
