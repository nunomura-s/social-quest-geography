(function(){
  'use strict';
  const PASSWORD='geography2026';
  const AUTH_KEY='socialQuestUnifiedAuthenticatedV1';
  const FAIL_KEY='socialQuestUnifiedAuthFailuresV1';
  const LOCK_KEY='socialQuestUnifiedAuthLockedUntilV1';
  const MAX_FAILURES=5;
  const LOCK_MS=30000;
  let timer=null;

  const gate=document.getElementById('authGate');
  const input=document.getElementById('authPassword');
  const submit=document.getElementById('authSubmit');
  const toggle=document.getElementById('authToggle');
  const message=document.getElementById('authMessage');

  function storageGet(key){try{return localStorage.getItem(key)}catch(_){return null}}
  function storageSet(key,value){try{localStorage.setItem(key,value)}catch(_){}}
  function storageRemove(key){try{localStorage.removeItem(key)}catch(_){}}
  function unlock(){
    document.body.classList.remove('auth-locked');
    gate.classList.add('hidden');
    storageSet(AUTH_KEY,'true');
    storageRemove(FAIL_KEY);storageRemove(LOCK_KEY);
    if(timer){clearInterval(timer);timer=null}
    const target=new URLSearchParams(location.search).get('return');
    if(target && /^(geography|history)\/index\.html(?:[?#].*)?$/.test(target)){location.replace(new URL(target,location.href).href);}
  }
  function lockedUntil(){return Number(storageGet(LOCK_KEY)||0)}
  function setControls(disabled){input.disabled=disabled;submit.disabled=disabled;toggle.disabled=disabled}
  function updateLock(){
    const remain=lockedUntil()-Date.now();
    if(remain<=0){
      storageRemove(LOCK_KEY);storageRemove(FAIL_KEY);setControls(false);message.textContent='';
      if(timer){clearInterval(timer);timer=null}
      input.focus();return;
    }
    setControls(true);
    message.textContent=`5回連続で間違えました。あと${Math.ceil(remain/1000)}秒お待ちください。`;
  }
  function startLockCountdown(){
    updateLock();
    if(!timer) timer=setInterval(updateLock,250);
  }
  function attempt(){
    if(lockedUntil()>Date.now()){startLockCountdown();return}
    if(input.value===PASSWORD){unlock();return}
    const failures=Number(storageGet(FAIL_KEY)||0)+1;
    input.value='';
    if(failures>=MAX_FAILURES){
      storageSet(LOCK_KEY,String(Date.now()+LOCK_MS));storageSet(FAIL_KEY,'0');startLockCountdown();
    }else{
      storageSet(FAIL_KEY,String(failures));
      message.textContent=`パスワードが違います。あと${MAX_FAILURES-failures}回間違えると30秒間入力できません。`;
      input.focus();
    }
  }

  if(storageGet(AUTH_KEY)==='true'){unlock();return}
  if(lockedUntil()>Date.now()) startLockCountdown(); else setTimeout(()=>input.focus(),0);
  submit.addEventListener('click',attempt);
  input.addEventListener('keydown',e=>{if(e.key==='Enter')attempt()});
  toggle.addEventListener('click',()=>{
    const show=input.type==='password';input.type=show?'text':'password';
    toggle.textContent=show?'隠す':'表示';toggle.setAttribute('aria-pressed',String(show));input.focus();
  });
})();