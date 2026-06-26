const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];

/* EDITAR URLS AQUÍ: reemplazar # por las páginas reales y image por URL/archivo local. */
const menus = {
  cursos: {
    title: 'Cursos On-Demand', text: 'Formaciones flexibles para aprender a tu ritmo.', image: '', button: '#categorias',
    left: [['Inteligencia Artificial','#'],['Programación y Desarrollo','#'],['Robótica y Electrónica','#'],['Marketing Digital','#'],['Docencia e Innovación','#'],['Gestión y Oficios','#']],
    mid: [['Introducción a IA','#','Nuevo'],['ChatGPT para productividad','#','Nuevo'],['Python desde cero','#','Nuevo'],['JavaScript moderno','#',''],['Arduino y ESP32','#',''],['Automatización con IA','#',''],['Diseño de landing pages','#','']]
  },
  capacitaciones: {
    title: 'Capacitaciones en Vivo', text: 'Encuentros guiados por mentores con práctica, consultas y seguimiento.', image: '', button: '#categorias',
    left: [['IA para docentes','#'],['Programación web','#'],['Electrónica aplicada','#'],['Robótica educativa','#'],['Marketing con IA','#'],['Productividad digital','#']],
    mid: [['Capacitación intensiva de IA','#','Nuevo'],['Workshop Arduino y ESP32','#','Nuevo'],['Laboratorio de Robótica','#','Nuevo'],['Excel y automatización','#',''],['Creación de contenidos con IA','#',''],['Herramientas para instituciones','#','']]
  },
  kids: {
    title: 'FEF Kid´s', text: 'Talleres, laboratorios y cursos para niños de 7 a 13 años.', image: '', button: '#kids',
    left: [['Robótica inicial','#'],['Programación creativa','#'],['Electrónica para niños','#'],['IA para chicos','#'],['Club de inventores','#']],
    mid: [['Taller de robots','#','Nuevo'],['Scratch y lógica','#','Nuevo'],['Laboratorio Maker','#',''],['Diseño 3D inicial','#',''],['Experimentos tecnológicos','#','']]
  },
  certificaciones: {
    title: 'Certificaciones', text: 'Certificaciones por UTN-FRT y COPIT. Próximamente capacitaciones con puntaje docente.', image: '', button: '#certificaciones',
    left: [['UTN-FRT','#'],['COPIT','#'],['Certificados FEF','#'],['Puntaje docente','#']],
    mid: [['Programas certificados','#','Nuevo'],['Capacitaciones profesionales','#',''],['Trayectos docentes','#','Pronto'],['Validación institucional','#','']]
  },
  instituciones: {
    title: 'Instituciones y Empresas', text: 'Soluciones de formación para equipos, escuelas, empresas y organizaciones.', image: '', button: '#instituciones',
    left: [['Empresas','#'],['Instituciones educativas','#'],['Convenios','#'],['Capacitaciones internas','#']],
    mid: [['Cursos para equipos','#',''],['Workshops institucionales','#',''],['Programas a medida','#','Nuevo'],['Alianzas estratégicas','#','']]
  }
};

const mega = $('#megaMenu');
const megaLeft = $('#megaLeft');
const megaMid = $('#megaMid');
const megaTitle = $('#megaTitle');
const megaText = $('#megaText');
const megaImage = $('#megaImage');
const megaBtn = $('#megaBtn');
let closeTimer;
function renderMega(key){
  const m = menus[key]; if(!m) return;
  megaTitle.textContent = m.title; megaText.textContent = m.text; megaBtn.href = m.button || '#';
  megaImage.style.backgroundImage = m.image ? `url('${m.image}')` : '';
  megaImage.innerHTML = m.image ? '' : '<span>Imagen ilustrativa<br><small>Agregar URL en app.js &gt; menus.image</small></span>';
  megaLeft.innerHTML = `<small>${key.toUpperCase()}</small>` + m.left.map(([t,u],i)=>`<a class="${i===0?'active':''}" href="${u}"><span><i class="ti ti-hexagon-plus"></i> ${t}</span><i class="ti ti-chevron-right"></i></a>`).join('');
  megaMid.innerHTML = m.mid.map(([t,u,b])=>`<a href="${u}"><span>${t}</span>${b?`<em>${b}</em>`:'<i class="ti ti-chevron-right"></i>'}</a>`).join('');
}
function showMega(key){clearTimeout(closeTimer); $$('.nav-item').forEach(n=>n.classList.toggle('active',n.dataset.menu===key)); renderMega(key); mega.classList.add('show'); mega.setAttribute('aria-hidden','false');}
function hideMega(){closeTimer=setTimeout(()=>{mega.classList.remove('show'); mega.setAttribute('aria-hidden','true'); $$('.nav-item').forEach(n=>n.classList.remove('active'));},120)}
$$('.nav-item').forEach(item=>{item.addEventListener('mouseenter',()=>showMega(item.dataset.menu)); item.addEventListener('mouseleave',hideMega);});
mega.addEventListener('mouseenter',()=>clearTimeout(closeTimer)); mega.addEventListener('mouseleave',hideMega);

const hamburgerPanel = $('#hamburgerPanel');
const menuBackdrop = $('#menuBackdrop');
function setPanel(open){
  hamburgerPanel.classList.toggle('show', open);
  if(menuBackdrop) menuBackdrop.classList.toggle('show', open);
  document.body.classList.toggle('menu-open', open);
}
function togglePanel(){ setPanel(!hamburgerPanel.classList.contains('show')); }
$('#hamburgerBtn').addEventListener('click', togglePanel);
$('#mobileMenuBtn').addEventListener('click', togglePanel);
if(menuBackdrop) menuBackdrop.addEventListener('click', () => setPanel(false));
$('#countrySelect').addEventListener('click', e => { e.stopPropagation(); $('#countrySelect').classList.toggle('open'); });
document.addEventListener('click', e => { if(!e.target.closest('.hamburger-panel')&&!e.target.closest('#hamburgerBtn')&&!e.target.closest('#mobileMenuBtn')) setPanel(false); if(!e.target.closest('#countrySelect')) $('#countrySelect').classList.remove('open'); });

const slider = $('#categorySlider');
$$('[data-slide]').forEach(btn => btn.addEventListener('click', () => slider.scrollBy({left: btn.dataset.slide === 'next' ? 340 : -340, behavior:'smooth'})));

const waBtn = $('#whatsappBtn'), waPanel = $('#waPanel'), toTop = $('#toTop');
waBtn.addEventListener('click', () => waPanel.classList.toggle('show'));
toTop.addEventListener('click', () => scrollTo({top:0, behavior:'smooth'}));
addEventListener('scroll', () => { toTop.classList.toggle('visible', scrollY > 420); });

document.addEventListener('click', e => { if(!e.target.closest('.float-actions')) waPanel.classList.remove('show'); });

const leadForm = $('#leadForm');
function fireConfetti(){ if(window.confetti){ confetti({particleCount:130,spread:80,origin:{y:.65}}); setTimeout(()=>confetti({particleCount:90,spread:100,origin:{y:.55}}),350); }}
function discountPopup(){
  Swal.fire({title:'Tu beneficio está activo',html:'<p>Usá este código al inscribirte:</p><div class="swal-code">FEF-50%OFF</div><br><a class="btn btn-primary" href="assets/docs/ebook-regalo-fef.pdf" download>Descargar E-book de regalo</a>',showConfirmButton:false,showCloseButton:true,didOpen:fireConfetti});
}
leadForm.addEventListener('submit', e => { e.preventDefault(); const data = Object.fromEntries(new FormData(leadForm)); localStorage.setItem('fef_lead', JSON.stringify({...data, createdAt:new Date().toISOString()})); discountPopup(); leadForm.reset(); });

function leadWelcomePopup(){
  Swal.fire({
    title:'Beneficio de inauguración',
    html:`<p>Completá tus datos y obtené 50% OFF más un E-book de regalo.</p>
      <div class="lead-form-popup">
        <label>Nombre<input id="swalNombre" type="text" placeholder="Tu nombre"></label>
        <label>Whatsapp<input id="swalWhatsapp" type="tel" placeholder="+54 9..."></label>
        <label>Email<input id="swalEmail" type="email" placeholder="tu@email.com"></label>
      </div>`,
    confirmButtonText:'Obtener 50% OFF',
    showCancelButton:true,
    cancelButtonText:'Más tarde',
    focusConfirm:false,
    preConfirm:()=>{
      const nombre = $('#swalNombre').value.trim();
      const whatsapp = $('#swalWhatsapp').value.trim();
      const email = $('#swalEmail').value.trim();
      if(!nombre || !whatsapp || !email){ Swal.showValidationMessage('Completá nombre, WhatsApp y email.'); return false; }
      if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){ Swal.showValidationMessage('Ingresá un email válido.'); return false; }
      return {nombre, whatsapp, email, createdAt:new Date().toISOString(), source:'welcome-popup'};
    }
  }).then(r=>{
    if(r.isConfirmed && r.value){
      localStorage.setItem('fef_lead', JSON.stringify(r.value));
      localStorage.setItem('fef_welcome_seen','1');
      discountPopup();
    }
  });
}
if(!localStorage.getItem('fef_welcome_seen')) setTimeout(leadWelcomePopup, 900);

