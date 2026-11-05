(function(){'use strict';var WHATSAPP_NUMBER='5581997967332';
var $=function(s,c){return(c||document).querySelector(s)},$$=function(s,c){return[].slice.call((c||document).querySelectorAll(s))};
$('#year').textContent=new Date().getFullYear();
$('#waFloat').href='https://wa.me/'+WHATSAPP_NUMBER+'?text='+encodeURIComponent('\ud83d\udea8 Olá, VETÈRE! Preciso de atendimento de emergência para o meu pet.');
var burger=$('#burger'),nav=$('#nav');
burger.addEventListener('click',function(){var o=nav.classList.toggle('open');burger.setAttribute('aria-expanded',o)});
if('IntersectionObserver' in window){var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.12});$$('.reveal').forEach(function(el){io.observe(el)})}else{$$('.reveal').forEach(function(el){el.classList.add('in')})}
var modal=$('#modal'),form=$('#form'),last=null;
function openModal(spec){last=document.activeElement;if(spec){var s=$('#fSpec');$$('option',s).forEach(function(o){if(o.textContent===spec)s.value=o.value})}
modal.hidden=false;document.body.style.overflow='hidden';requestAnimationFrame(function(){modal.classList.add('is-open')});setTimeout(function(){$('#fNome').focus()},150)}
function closeModal(){modal.classList.remove('is-open');document.body.style.overflow='';setTimeout(function(){modal.hidden=true;if(last)last.focus()},300)}
document.addEventListener('click',function(e){var t=e.target.closest('[data-open-modal]');if(t){e.preventDefault();openModal(t.dataset.spec)}});
$('#mClose').addEventListener('click',closeModal);
modal.addEventListener('click',function(e){if(e.target===modal)closeModal()});
document.addEventListener('keydown',function(e){if(!modal.hidden&&e.key==='Escape')closeModal()});
form.addEventListener('submit',function(e){e.preventDefault();var d=new FormData(form),nome=(d.get('nome')||'').trim(),err=$('#err');
if(!nome){err.hidden=false;$('#fNome').focus();return}err.hidden=true;
var spec=d.get('especialidade'),u=/URGÊNCIA/i.test(spec);
var L=[(u?'\ud83d\udea8 *URGÊNCIA* – ':'')+'*Solicitação de agendamento – VETÈRE*','','\ud83d\udc64 Tutor: '+nome,'\ud83d\udc3e Pet: '+((d.get('pet')||'').trim()||'não informado'),'Espécie: '+d.get('especie'),'Especialidade: '+spec,'Turno desejado: '+d.get('turno')];
window.open('https://wa.me/'+WHATSAPP_NUMBER+'?text='+encodeURIComponent(L.join('\n')),'_blank','noopener');closeModal();form.reset()});
})();