// 일반적인 이미지 저장 동작 제한. 동적으로 생성하는 갤러리 이미지에도 적용.
(()=>{
 const isImageArea=target=>target instanceof Element&&Boolean(target.closest('img,.cover-photo,.gallery-thumb,#photo-stage'));
 document.addEventListener('contextmenu',event=>{if(isImageArea(event.target))event.preventDefault()},true);
 document.addEventListener('dragstart',event=>{if(isImageArea(event.target))event.preventDefault()},true);
 const protect=root=>{
  if(root instanceof HTMLImageElement)root.draggable=false;
  if(root.querySelectorAll)root.querySelectorAll('img').forEach(img=>{img.draggable=false;img.style.pointerEvents='none'});
 };
 protect(document);
 new MutationObserver(records=>records.forEach(record=>record.addedNodes.forEach(protect))).observe(document.body,{childList:true,subtree:true});
})();
