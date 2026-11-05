(function () {
  'use strict';

  /* ====== CONFIGURAÇÃO: troque pelo número real (DDI + DDD + número, só dígitos) ====== */
  var WHATSAPP_NUMBER = '5581997967332';
  /* ==================================================================================== */

  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  $('#year').textContent = new Date().getFullYear();
  $('#waFloat').href = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' +
    encodeURIComponent('🚨 Olá, VETÈRE! Preciso de atendimento de emergência para o meu pet.');

  /* Header sólido ao rolar */
  var header = $('.header');
  function onScroll() { header.classList.toggle('is-solid', window.scrollY > 40); }
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();

  /* Menu mobile */
  var burger = $('#burger'), nav = $('#nav');
  burger.addEventListener('click', function () {
    var open = nav.classList.toggle('open');
    burger.setAttribute('aria-expanded', open);
  });
  $$('a', nav).forEach(function (a) {
    a.addEventListener('click', function () { nav.classList.remove('open'); burger.setAttribute('aria-expanded', 'false'); });
  });

  /* Fade-in ao rolar */
  var revealEls = $$('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.12 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else { revealEls.forEach(function (el) { el.classList.add('in'); }); }

  /* Hero slider */
  var slides = $$('.slide'), dotsBox = $('#heroDots'), cur = 0;
  slides.forEach(function (_, i) { var s = document.createElement('span'); if (i === 0) s.className = 'on'; dotsBox.appendChild(s); });
  setInterval(function () {
    slides[cur].classList.remove('is-active'); dotsBox.children[cur].classList.remove('on');
    cur = (cur + 1) % slides.length;
    slides[cur].classList.add('is-active'); dotsBox.children[cur].classList.add('on');
  }, 6500);

  /* Filtro de especialidades */
  var tabs = $$('.tab'), cards = $$('.card');
  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      tabs.forEach(function (t) { t.classList.remove('is-active'); t.setAttribute('aria-selected', 'false'); });
      tab.classList.add('is-active'); tab.setAttribute('aria-selected', 'true');
      var f = tab.dataset.filter;
      cards.forEach(function (c) {
        var show = f === 'all' || c.dataset.cat === f;
        if (show) {
          c.classList.remove('is-gone');
          requestAnimationFrame(function () { requestAnimationFrame(function () { c.classList.remove('is-hidden'); }); });
        } else {
          c.classList.add('is-hidden');
          setTimeout(function () { if (c.classList.contains('is-hidden')) c.classList.add('is-gone'); }, 350);
        }
      });
    });
  });

  /* Carrossel de depoimentos */
  var quotes = $$('.quote'), qd = $('#qdots'), qi = 0, timer;
  quotes.forEach(function () { qd.appendChild(document.createElement('span')); });
  function showQ(n) {
    quotes[qi].classList.remove('is-active'); qd.children[qi].classList.remove('on');
    qi = (n + quotes.length) % quotes.length;
    quotes[qi].classList.add('is-active'); qd.children[qi].classList.add('on');
  }
  qd.children[0].classList.add('on');
  function auto() { clearInterval(timer); timer = setInterval(function () { showQ(qi + 1); }, 7000); }
  $('#prev').addEventListener('click', function () { showQ(qi - 1); auto(); });
  $('#next').addEventListener('click', function () { showQ(qi + 1); auto(); });
  auto();

  /* Modal de agendamento */
  var modal = $('#modal'), form = $('#form'), lastFocus = null;
  function openModal(spec, urgent) {
    lastFocus = document.activeElement;
    if (spec) {
      var sel = $('#fSpec');
      $$('option', sel).forEach(function (o) { if (o.textContent === spec) sel.value = o.value; });
    }
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(function () { modal.classList.add('is-open'); });
    setTimeout(function () { $('#fNome').focus(); }, 150);
  }
  function closeModal() {
    modal.classList.remove('is-open');
    document.body.style.overflow = '';
    setTimeout(function () { modal.hidden = true; if (lastFocus) lastFocus.focus(); }, 300);
  }
  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-open-modal]');
    if (t) { e.preventDefault(); openModal(t.dataset.spec); }
  });
  $('#mClose').addEventListener('click', closeModal);
  modal.addEventListener('click', function (e) { if (e.target === modal) closeModal(); });
  document.addEventListener('keydown', function (e) {
    if (modal.hidden) return;
    if (e.key === 'Escape') closeModal();
    if (e.key === 'Tab') { /* prende o foco dentro do modal */
      var f = $$('button,input,select,a[href]', modal).filter(function (x) { return !x.disabled && x.offsetParent !== null || x.type === 'radio'; });
      var visible = f.filter(function (x) { return x.type !== 'radio' || x.checked; });
      if (!visible.length) return;
      var first = visible[0], last = visible[visible.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var d = new FormData(form), nome = (d.get('nome') || '').trim(), err = $('#err');
    if (!nome) { err.hidden = false; $('#fNome').focus(); return; }
    err.hidden = true;
    var spec = d.get('especialidade'), urgent = /URGÊNCIA/i.test(spec);
    var lines = [
      (urgent ? '🚨 *URGÊNCIA* – ' : '') + '*Solicitação de agendamento – VETÈRE*',
      '',
      '👤 Tutor: ' + nome,
      '🐾 Pet: ' + ((d.get('pet') || '').trim() || 'não informado'),
      '🐶🐱 Espécie: ' + d.get('especie'),
      '🩺 Especialidade: ' + spec,
      '🕐 Turno desejado: ' + d.get('turno')
    ];
    var url = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(lines.join('\n'));
    window.open(url, '_blank', 'noopener');
    closeModal();
    form.reset();
  });
})();