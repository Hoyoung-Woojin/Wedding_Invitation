(() => {
  'use strict';
  // 2026년 12월 1일 하루 전체를 포함, 한국 시간 12월 2일 0시 마감.
  const closesAt = Date.parse('2026-12-02T00:00:00+09:00');
  const day = 86400000;
  let serverClosed = false;
  const isClosed = () => serverClosed || Date.now() >= closesAt;
  const style = document.createElement('style');
  style.textContent = `
.rsvp-deadline{display:flex;justify-content:center;align-items:baseline;flex-wrap:wrap;gap:3px 5px;margin:12px 0 0!important;font-family:inherit;font-size:calc(11px + 2pt)!important;line-height:1.7!important;color:#777!important;word-break:keep-all;letter-spacing:-.35px}
.rsvp-deadline strong,.rsvp-deadline time{color:#98556e;font-weight:700}.rsvp-deadline strong{font-size:calc(12px + 2pt)}
.rsvp-closed-card{border:0;border-radius:6px;padding:28px 14px;margin:22px auto 0;max-width:340px;background:#f0e5e9;text-align:center;color:#555}
.rsvp-closed-icon{display:flex;align-items:center;justify-content:center;width:34px;height:34px;border:2px solid #b996af;border-radius:50%;margin:0 auto 18px;color:#b996af;font:24px/1 Georgia,serif}
.rsvp-closed-card strong{font-size:calc(14px + 2pt);line-height:1.8}.rsvp-closed-card p{font-size:calc(12px + 2pt)!important;line-height:1.8;color:#999!important;margin:10px 0 0}
.rsvp-expired .rsvp-section>p:has(#open),#welcome.rsvp-expired .wedding-card,#modal.rsvp-expired #form{display:none!important}
#welcome .rsvp-deadline,#modal .rsvp-deadline{font-size:calc(10px + 2pt)!important}#modal .deadline-close{display:block;margin:18px auto 0;border:0;background:transparent;color:#999;font-size:13px}
`;
  document.head.append(style);
  const main = document.querySelector('.rsvp-section');
  const welcome = document.querySelector('#welcome');
  const modal = document.querySelector('#modal');
  const notices = [];
  function notice(parent, before) {
    const el = document.createElement('p');
    el.className = 'rsvp-deadline';
    el.setAttribute('aria-live','polite');
    el.innerHTML = '<span>참석 여부 전달 마감일&nbsp;&nbsp;</span><time datetime="2026-12-01">2026년 12월 1일 (화)</time><span aria-hidden="true">·</span><strong></strong>';
    parent.insertBefore(el,before || null);
    notices.push(el);
  }
  notice(main);
  notice(welcome,document.querySelector('#welcome-close'));
  // 입력 모달에는 마감일 안내를 표시하지 않습니다.
  const couple = welcome.querySelector('.couple');
  if (couple) {
    for (const node of Array.from(couple.childNodes)) {
      if (node.nodeType !== Node.TEXT_NODE) continue;
      const parts = node.textContent.split(/(유호영|차우진)/);
      const fragment = document.createDocumentFragment();
      parts.forEach(part => {
        if (part === '유호영' || part === '차우진') {
          const name = document.createElement('strong');
          name.textContent = part; name.style.fontWeight = '700'; fragment.append(name);
        } else fragment.append(document.createTextNode(part));
      });
      node.replaceWith(fragment);
    }
  }
  [main,welcome,modal].forEach(parent => {
    const card = document.createElement('div');
    card.className = 'rsvp-closed-card'; card.hidden = true;
    card.setAttribute('role','status');
    card.innerHTML = '<span class="rsvp-closed-icon" aria-hidden="true">!</span><strong>참석 응답이 마감되었습니다</strong><p>마감일이 지나 더 이상 응답을 받을 수 없습니다.</p>';
    parent.insertBefore(card,parent === welcome ? document.querySelector('#welcome-close') : null);
  });
  const closeButton = document.createElement('button');
  closeButton.type = 'button';closeButton.className = 'deadline-close';closeButton.textContent = '닫기';closeButton.hidden = true;
  closeButton.onclick = () => {modal.close();document.body.style.overflow='';};modal.append(closeButton);
  function refresh() {
    const closed = isClosed();
    // KST 자정 기준 날짜 차이: 마감 당일은 D-day.
    const today = Math.floor((Date.now()+9*3600000)/day);
    const target = Math.floor(Date.UTC(2026,11,1)/day);
    notices.forEach(el => {el.hidden=closed;const label=target-today;el.querySelector('strong').textContent=label===0?'D-day':'D-'+Math.max(0,label);});
    document.body.classList.toggle('rsvp-expired',closed);
    [main,welcome,modal].forEach(el=>{el.classList.toggle('rsvp-expired',closed);el.querySelector('.rsvp-closed-card').hidden=!closed;});
    ['open','welcome-next','submit'].forEach(id=>{const button=document.getElementById(id);if(closed)button.disabled=true;});
    closeButton.hidden=!closed;
    return closed;
  }
  window.RsvpDeadline = {isClosed,refresh,close:()=>{serverClosed=true;refresh();}};
  refresh();setInterval(refresh,1000);
  window.addEventListener('focus',refresh);
  document.addEventListener('visibilitychange',refresh);
})();
