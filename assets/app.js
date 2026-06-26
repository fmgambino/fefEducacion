'use strict';
const ebookUrl = 'assets/ebook-regalo-fef.pdf';
const leadEndpoint = ''; // TODO: pegar aquí la URL REST/AJAX de WordPress para guardar leads.
const qs = s => document.querySelector(s);
const leadButtons = ['#openLeadModal','#openLeadModalCard','#openLeadModalBottom'];
const hasSeen = localStorage.getItem('fef_lead_seen') === '1';

function fireConfetti(){
  const duration = 1300;
  const end = Date.now() + duration;
  (function frame(){
    const particle = document.createElement('span');
    particle.style.cssText = `position:fixed;left:${Math.random()*100}vw;top:-10px;width:8px;height:14px;background:${Math.random()>.5?'#00E5FF':'#0050FF'};z-index:99999;border-radius:3px;pointer-events:none;transform:rotate(${Math.random()*360}deg);transition:transform 1.5s linear, top 1.5s linear, opacity 1.5s linear`;
    document.body.appendChild(particle);
    requestAnimationFrame(()=>{particle.style.top='110vh';particle.style.opacity='0';particle.style.transform+=` translateX(${(Math.random()-.5)*180}px)`});
    setTimeout(()=>particle.remove(),1600);
    if(Date.now()<end) requestAnimationFrame(frame);
  })();
}

function isValidEmail(email){return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)}
function isValidPhone(phone){return phone.replace(/\D/g,'').length >= 8}

async function saveLead(data){
  localStorage.setItem('fef_lead_data', JSON.stringify({...data, created_at:new Date().toISOString()}));
  if(!leadEndpoint) return {ok:true, local:true};
  const res = await fetch(leadEndpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)});
  if(!res.ok) throw new Error('No se pudo guardar el lead');
  return res.json();
}

async function showLeadModal(){
  const { value: formValues } = await Swal.fire({
    title:'Beneficio inaugural 50% OFF',
    html:`<p style="margin-top:0;color:#6f6f6f">Completá tus datos y recibí tu código exclusivo.</p>
      <input id="leadName" class="swal2-input" placeholder="Nombre completo" autocomplete="name">
      <input id="leadWhatsapp" class="swal2-input" placeholder="WhatsApp" autocomplete="tel">
      <input id="leadEmail" class="swal2-input" placeholder="Email" autocomplete="email">`,
    confirmButtonText:'Quiero mi descuento',
    confirmButtonColor:'#0050FF',
    showCancelButton:true,
    cancelButtonText:'Luego',
    focusConfirm:false,
    preConfirm:()=>{
      const name = qs('#leadName').value.trim();
      const whatsapp = qs('#leadWhatsapp').value.trim();
      const email = qs('#leadEmail').value.trim();
      if(name.length < 3) return Swal.showValidationMessage('Ingresá tu nombre completo');
      if(!isValidPhone(whatsapp)) return Swal.showValidationMessage('Ingresá un WhatsApp válido');
      if(!isValidEmail(email)) return Swal.showValidationMessage('Ingresá un email válido');
      return {name,whatsapp,email,source:'Landing FEF Educación',coupon:'FEF-50%OFF'};
    }
  });
  if(!formValues) return;
  try{
    await saveLead(formValues);
    localStorage.setItem('fef_lead_seen','1');
    fireConfetti();
    await Swal.fire({
      title:'¡Código habilitado!',
      html:`<div class="lead-code">FEF-50%OFF</div><p>Guardá este código para acceder al descuento inaugural.</p><a class="download-link" href="${ebookUrl}" download>Descargar E-book de regalo</a>`,
      icon:'success',
      confirmButtonText:'Perfecto',
      confirmButtonColor:'#0050FF'
    });
  }catch(error){
    Swal.fire('Atención','Tus datos quedaron guardados localmente. Revisá la conexión o configurá el endpoint de WordPress.','warning');
  }
}

leadButtons.forEach(id=>qs(id)?.addEventListener('click', showLeadModal));
qs('#mobileMenuBtn')?.addEventListener('click',()=>Swal.fire({title:'Menú FEF',showConfirmButton:false,html:`<div style="display:grid;gap:10px;text-align:left"><a href="#cursos">Cursos</a><a href="#beneficios">Beneficios</a><a href="#metodologia">Metodología</a><a href="#comunidad">Comunidad</a><a href="#contacto">Contacto</a></div>`}));
qs('#themeToggle')?.addEventListener('click',()=>{document.body.classList.toggle('dark');localStorage.setItem('fef_theme',document.body.classList.contains('dark')?'dark':'light')});
if(localStorage.getItem('fef_theme')==='dark') document.body.classList.add('dark');
window.addEventListener('load',()=>{ if(!hasSeen) setTimeout(showLeadModal, 900); });
