const serviceData = [
 {name:'Mechas e iluminação',image:'editorial-cabelo.webp',description:'Luz e dimensão para um visual com a sua expressão. Conte-nos como imagina o seu próximo cabelo.'},
 {name:'Coloração personalizada',image:'hero-panoramico.webp',description:'Uma escolha de cor que começa por conhecer os seus objetivos, preferências e rotina.'},
 {name:'Cortes femininos',image:'editorial-tecnica.webp',description:'Forma, movimento e expressão. Partilhe o estilo que procura e como gosta de cuidar do seu cabelo.'},
 {name:'Alisamentos',image:'editorial-cabelo.webp',description:'Converse connosco sobre a sua textura, os cuidados atuais e o resultado que gostaria de alcançar.'},
 {name:'Visagismo',image:'hero-panoramico.webp',description:'Um olhar personalizado sobre a relação entre o cabelo, a sua imagem e a forma como se quer expressar.'},
 {name:'Consultoria de cor',image:'editorial-cuidado.webp',description:'Explore tonalidades e possibilidades antes de escolher o seu próximo visual. O ponto de partida é a sua identidade.'}
];
const tabs = [...document.querySelectorAll('[data-tab]')];
function selectService(index, focus = false) {
 const service = serviceData[index];
 tabs.forEach((tab,i)=>{tab.setAttribute('aria-selected',String(i===index));tab.tabIndex=i===index?0:-1;});
 const panel = document.querySelector('#service-panel');
 panel.setAttribute('aria-labelledby',tabs[index].id);
 document.querySelector('#detail-title').textContent=service.name;
 document.querySelector('#detail-description').textContent=service.description;
 const image=document.querySelector('#detail-image');image.src='/assets/'+service.image;image.alt='Imagem editorial ilustrativa de '+service.name.toLowerCase()+', criada com IA';
 document.querySelector('#detail-contact').dataset.service=service.name;
 if(focus)tabs[index].focus();
 document.dispatchEvent(new CustomEvent('matisse:view-service'));
}
tabs.forEach((tab,index)=>{
 tab.addEventListener('click',()=>selectService(index));
 tab.addEventListener('keydown',event=>{
  let next=index;
  if(event.key==='ArrowDown'||event.key==='ArrowRight')next=(index+1)%tabs.length;
  else if(event.key==='ArrowUp'||event.key==='ArrowLeft')next=(index-1+tabs.length)%tabs.length;
  else if(event.key==='Home')next=0;
  else if(event.key==='End')next=tabs.length-1;
  else return;
  event.preventDefault();selectService(next,true);
 });
});
const rail=document.querySelector('#service-rail');
const dots=[...document.querySelectorAll('[data-slide]')];
dots.forEach((dot,index)=>dot.addEventListener('click',()=>{
 const card=rail.children[index];const left=card.offsetLeft-rail.children[0].offsetLeft;
 rail.scrollTo({left,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
 dots.forEach((d,i)=>d.setAttribute('aria-pressed',String(i===index)));
}));
