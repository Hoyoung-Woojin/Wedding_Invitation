const INVITATION_SHARE={title:'유호영 ♥ 차우진 결혼합니다',text:'2026년 12월 12일 토요일 오후 12시',url:'https://hoyoung-woojin.github.io/Wedding_Invitation/'};
const shareStatus=document.querySelector('#share-status'),shareManual=document.querySelector('#share-manual'),shareText=document.querySelector('#share-copy-text'),shareHelp=document.querySelector('#share-help'),shareButton=document.querySelector('#share-invitation');
let sharing=false;
async function copyInvitation(){shareManual.hidden=true;try{if(!navigator.clipboard?.writeText)throw Error();await navigator.clipboard.writeText(INVITATION_SHARE.url);shareStatus.textContent='청첩장 링크를 복사했습니다.'}catch{shareText.value=INVITATION_SHARE.url;shareManual.hidden=false;shareText.focus();shareText.select();shareStatus.textContent='아래 주소를 직접 복사해 주세요.'}}
function showShareHelp(failed){document.querySelector('#share-help-message').textContent=failed?'이 브라우저에서 공유창을 열지 못했습니다. 브라우저 메뉴의 공유 기능을 이용하거나, Chrome·삼성 인터넷·Safari에서 청첩장을 열어 주세요.':'이 브라우저는 공유창 기능을 지원하지 않습니다. 앱에서 열었다면 메뉴의 ‘다른 브라우저로 열기’를 선택한 뒤 다시 공유해 주세요. 링크를 복사해 전달하셔도 됩니다.';if(!shareHelp.open)shareHelp.showModal()}
document.querySelector('#share-open-browser').href=INVITATION_SHARE.url;
document.querySelector('#share-help-close').onclick=()=>{shareHelp.close();shareButton.focus()};
document.querySelector('#share-help-copy').onclick=()=>{shareHelp.close();copyInvitation()};
document.querySelector('#copy-invitation').onclick=copyInvitation;
shareButton.onclick=async()=>{
 if(sharing)return;shareManual.hidden=true;shareStatus.textContent='';
 if(typeof navigator.share!=='function'){showShareHelp(false);return}
 // 링크만 전달: 설명은 페이지의 OG 미리보기 안에 표시됩니다.
 let payload={url:'https://hoyoung-woojin.github.io/Wedding_Invitation/share.html'};
 if(typeof navigator.canShare==='function'&&!navigator.canShare(payload))payload={url:'https://hoyoung-woojin.github.io/Wedding_Invitation/share.html'};
 sharing=true;shareButton.disabled=true;
 try{await navigator.share(payload)}catch(e){if(e.name!=='AbortError')showShareHelp(true)}finally{sharing=false;shareButton.disabled=false}
};
