// Google-hosted transport frame is invisible; all guest UI is rendered by GitHub Pages.
let connectionPromise;
const pending=new Map();
function randomId(){return Array.from(crypto.getRandomValues(new Uint8Array(16)),v=>v.toString(16).padStart(2,'0')).join('')}
function connectRsvp(){
 if(connectionPromise)return connectionPromise;
 connectionPromise=new Promise((resolve,reject)=>{
  let url;try{url=new URL(window.RSVP_WEB_APP_URL);if(url.origin!=='https://script.google.com'||!/^\/macros\/s\/[^/]+\/exec$/.test(url.pathname))throw Error()}catch{reject(Error('저장 주소를 설정해 주세요.'));return}
  const nonce=randomId();let source,origin,ready=false;
  const frame=document.createElement('iframe');frame.hidden=true;frame.title='RSVP 저장 연결';frame.setAttribute('aria-hidden','true');
  const timer=setTimeout(()=>{if(!ready){window.removeEventListener('message',onMessage);frame.remove();connectionPromise=undefined;reject(Error('연결 시간이 초과되었습니다.'))}},25000);
  function onMessage(e){
   const m=e.data;if(!m||m.channel!=='wedding-rsvp'||m.nonce!==nonce)return;
   let host;try{host=new URL(e.origin).hostname}catch{return}
   if(e.origin!=='https://script.google.com'&&!(e.origin.startsWith('https://')&&(host==='script.googleusercontent.com'||host.endsWith('-script.googleusercontent.com'))))return;
   if(m.kind==='ready'&&!ready){ready=true;source=e.source;origin=e.origin;clearTimeout(timer);resolve({send(payload){return new Promise((ok,fail)=>{const id=randomId();const timeout=setTimeout(()=>{pending.delete(id);fail(Error('저장 확인 시간이 초과되었습니다.'))},25000);pending.set(id,{ok,fail,timeout});source.postMessage({channel:'wedding-rsvp',nonce,kind:'save',id,payload},origin)})}});return}
   if(e.source!==source||e.origin!==origin)return;
   const p=pending.get(m.id);if(!p)return;
   if(m.kind==='result'||m.kind==='error'){clearTimeout(p.timeout);pending.delete(m.id);if(m.kind==='result'&&m.result?.ok===true)p.ok(m.result);else p.fail(Error('저장에 실패했습니다.'))}
  }
  window.addEventListener('message',onMessage);url.searchParams.set('mode','bridge');url.searchParams.set('nonce',nonce);frame.src=url.href;document.body.append(frame);
 });return connectionPromise;
}
async function sendRsvp(payload){const connection=await connectRsvp();return connection.send(payload)}
