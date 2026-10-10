// 사진 순서는 아래 목록 순서입니다. 추가/삭제/순서 변경은 이 목록만 수정하세요.
// 같은 파일명으로 images 폴더의 사진을 교체하면 코드 수정 없이 바뀝니다.
const GALLERY_FILES = [
 '01.jpg', '02.jpg', '03.jpg', '04.jpg', '05.jpg', '06.jpg', '07.jpg', '08.jpg', '09.jpg', '10.jpg', '11.jpg', '12.jpg', '13.jpg', '14.jpg', '15.jpg', '16.jpg', '17.jpg', '18.jpg'
];
const GALLERY_PHOTOS = GALLERY_FILES.map((file,i)=>({src:'images/'+file,alt:`호영과 우진의 웨딩 사진 ${i+1}`}));
const grid=document.querySelector('#gallery-grid'),more=document.querySelector('#gallery-more'),photoModal=document.querySelector('#photo-modal'),stage=document.querySelector('#photo-stage');
let activePhoto=0,lastThumb=null,previousOverflow='',touchStart=null;
function photoContent(index){
 const photo=GALLERY_PHOTOS[index];
 if(photo.src){const img=document.createElement('img');img.src=photo.src;img.alt=photo.alt;img.loading='lazy';img.decoding='async';img.draggable=false;return img}
 const box=document.createElement('div');box.className='gallery-placeholder';const number=document.createElement('span');number.textContent=String(index+1).padStart(2,'0');box.append(number,document.createTextNode('사진을 넣을 자리'));return box;
}
function showPhoto(index){activePhoto=(index+GALLERY_PHOTOS.length)%GALLERY_PHOTOS.length;stage.replaceChildren(photoContent(activePhoto));document.querySelector('#photo-position').textContent=`${activePhoto+1} / ${GALLERY_PHOTOS.length}`}
function closePhoto(){photoModal.close();document.body.style.overflow=previousOverflow;lastThumb?.focus()}
GALLERY_PHOTOS.forEach((photo,index)=>{const button=document.createElement('button');button.type='button';button.className='gallery-thumb';button.setAttribute('aria-label',`${index+1}번 사진 확대`);button.hidden=index>=9;button.append(photoContent(index));button.onclick=()=>{lastThumb=button;previousOverflow=document.body.style.overflow;showPhoto(index);photoModal.showModal();document.body.style.overflow='hidden'};grid.append(button)});
more.hidden=GALLERY_PHOTOS.length<=9;
more.onclick=()=>{Array.from(grid.children).slice(9).forEach((thumb,i)=>{thumb.hidden=false;thumb.classList.add('gallery-reveal');thumb.style.animationDelay=`${i*35}ms`});more.setAttribute('aria-expanded','true');grid.children[9]?.focus();more.hidden=true};
document.querySelector('#photo-close').onclick=closePhoto;
document.querySelector('#photo-prev').onclick=()=>showPhoto(activePhoto-1);
document.querySelector('#photo-next').onclick=()=>showPhoto(activePhoto+1);
photoModal.addEventListener('cancel',e=>{e.preventDefault();closePhoto()});
photoModal.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'){e.preventDefault();showPhoto(activePhoto-1)}if(e.key==='ArrowRight'){e.preventDefault();showPhoto(activePhoto+1)}});
stage.addEventListener('touchstart',e=>{touchStart={x:e.changedTouches[0].clientX,y:e.changedTouches[0].clientY}},{passive:true});
stage.addEventListener('touchend',e=>{if(!touchStart)return;const dx=e.changedTouches[0].clientX-touchStart.x,dy=e.changedTouches[0].clientY-touchStart.y;if(Math.abs(dx)>45&&Math.abs(dx)>Math.abs(dy))showPhoto(activePhoto+(dx<0?1:-1));touchStart=null},{passive:true});
