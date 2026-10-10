// 계좌정보 수정 위치. 유호영님의 은행명은 미제공되어 비워 두었습니다.
// bank에 은행명을 넣으면 화면과 복사 내용에 자동 반영됩니다.
const WEDDING_ACCOUNTS = [
 {side:'신랑측',people:[
  {role:'아버지',name:'유구현',bank:'기업은행',number:'305-032671-01-010'},
  {role:'어머니',name:'정진춘',bank:'산업은행',number:'020-0255-1745-310'},
  {role:'신랑',name:'유호영',bank:'산업은행',number:'020-9200-2108-316'}
 ]},
 {side:'신부측',people:[
  {role:'아버지',name:'차도현',bank:'기업은행',number:'027-107188-02-013'},
  {role:'어머니',name:'강순천',bank:'기업은행',number:'027-112268-01-011'},
  {role:'신부',name:'차우진',bank:'신한은행',number:'110-207-680429'}
 ]}
];
const accountGroups=document.querySelector('#account-groups'),accountStatus=document.querySelector('#account-status'),accountManual=document.querySelector('#account-manual'),accountText=document.querySelector('#account-copy-text');
async function copyAccount(person,button){
 const text=[person.bank,person.number].filter(Boolean).join(' ');accountManual.hidden=true;button.disabled=true;
 try{if(!navigator.clipboard?.writeText)throw Error();await navigator.clipboard.writeText(text);accountStatus.textContent=`${person.name}님의 계좌번호를 복사했습니다.`}
 catch{accountText.value=text;accountManual.hidden=false;accountText.focus();accountText.select();accountStatus.textContent='자동 복사가 되지 않았습니다. 아래 계좌번호를 직접 복사해 주세요.'}
 finally{button.disabled=false}
}
WEDDING_ACCOUNTS.forEach(group=>{
 const details=document.createElement('details');details.className='account-group';const summary=document.createElement('summary');summary.textContent=group.side==='신랑측'?'신랑측에게':'신부측에게';details.append(summary);const list=document.createElement('div');list.className='account-list';
 group.people.forEach(person=>{const row=document.createElement('div');row.className='account-row';const info=document.createElement('div'),name=document.createElement('span');name.className='account-person';name.append(document.createTextNode(person.role+' '));const personName=document.createElement('strong');personName.className='account-name';personName.textContent=person.name;name.append(personName);info.append(name);const number=document.createElement('span');number.className=person.number?'account-number':'account-pending';number.textContent=person.number?[person.bank,person.number].filter(Boolean).join(' '):'계좌정보 준비 중';info.append(number);row.append(info);if(person.number){const button=document.createElement('button');button.type='button';button.className='account-copy';button.textContent='계좌번호 복사하기';button.setAttribute('aria-label',`${person.name}님의 계좌번호 복사`);button.onclick=()=>copyAccount(person,button);row.append(button)}list.append(row)});
 details.append(list);accountGroups.append(details);
});
