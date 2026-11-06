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
  var openModal;
  openModal = function (spec, urgent) {
    lastFocus = document.activeElement;
    if (spec) {
      var sel = $('#fSpec');
      $$('option', sel).forEach(function (o) { if (o.textContent === spec) sel.value = o.value; });
    }
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(function () { modal.classList.add('is-open'); });
    setTimeout(function () { $('#fNome').focus(); }, 150);
  };
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

  /* Protocolo: DDMM + sequência do dia (ex.: 051101, 051102...) */
  function pad2(n) { return (n < 10 ? '0' : '') + n; }
  function nextProtocol() {
    var now = new Date(), ddmm = pad2(now.getDate()) + pad2(now.getMonth() + 1), key = 'vetere_proto', n = 1;
    try {
      var saved = JSON.parse(localStorage.getItem(key) || 'null');
      var day = now.getFullYear() + '-' + ddmm;
      if (saved && saved.day === day) n = saved.n + 1;
      localStorage.setItem(key, JSON.stringify({ day: day, n: n }));
    } catch (err) {
      n = Math.floor((now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds()) / 15) % 99 + 1;
    }
    return ddmm + pad2(n);
  }

  var protoBox = $('#protocol');
  function showForm() { protoBox.hidden = true; form.hidden = false; $('.modal__sub').hidden = false; }
  var _open = openModal;
  openModal = function (spec, urgent) { showForm(); _open(spec, urgent); };
  $('#pClose').addEventListener('click', closeModal);

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var d = new FormData(form), nome = (d.get('nome') || '').trim(), hora = d.get('horario') || '', err = $('#err');
    if (!nome || !hora) { err.hidden = false; (!nome ? $('#fNome') : $('#fHora')).focus(); return; }
    err.hidden = true;
    var spec = d.get('especialidade'), urgent = /URGÊNCIA/i.test(spec),
        pet = (d.get('pet') || '').trim() || 'não informado',
        proto = nextProtocol();
    var lines = [
      (urgent ? '🚨 *URGÊNCIA* – ' : '') + '*Solicitação de agendamento – VETÈRE*',
      '',
      '🔖 Protocolo: *' + proto + '*',
      '👤 Tutor: ' + nome,
      '🐾 Pet: ' + pet,
      '🐶🐱 Espécie: ' + d.get('especie'),
      '🩺 Especialidade: ' + spec,
      '🕐 Horário agendado: ' + hora + ' (' + d.get('turno') + ')'
    ];
    var url = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(lines.join('\n'));
    $('#pNum').textContent = proto;
    $('#pTutor').textContent = nome;
    $('#pPet').textContent = pet;
    $('#pHora').textContent = hora;
    $('#pSpec').textContent = spec;
    $('#pWa').href = url;
    form.hidden = true; $('.modal__sub').hidden = true;
    protoBox.hidden = false;
    form.reset();
    $('#pWa').focus();
  });
})();

/* ================= SISTEMA DA CLÍNICA (área da equipe) ================= */
(function () {
  'use strict';
  if (typeof supabase === 'undefined' || !document.getElementById('sys')) return;

  /* ====== CONFIGURAÇÃO: cole aqui os dois dados do Supabase (Project Settings > API) ====== */
  var SUPABASE_URL = 'https://qqkmzgiydslotoczonqk.supabase.co';
  var SUPABASE_KEY = 'sb_publishable_jCu3JlfAH0JSOTtfHVZGVA_PSJRTz9f';
  /* ======================================================================================= */

  var db = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
  var $ = function (s) { return document.querySelector(s); };

  /* Cada módulo: título, tabela, ordenação e campos [coluna, rótulo, tipo, obrigatório] */
  var M = {
    tutores: { t: 'Tutores', f: [['nome', 'Nome', 'text', 1], ['telefone', 'Telefone', 'tel'], ['email', 'E-mail', 'email']] },
    pets: { t: 'Pets', f: [['tutor_id', 'Tutor', 'ref:tutores:nome', 1], ['nome', 'Nome do pet', 'text', 1], ['especie', 'Espécie', 'sel:Cão,Gato,Outro'], ['raca', 'Raça', 'text'], ['nascimento', 'Nascimento', 'date']] },
    consultas: { t: 'Agenda', o: 'data_hora', asc: true, f: [['pet_id', 'Pet', 'ref:pets:nome', 1], ['data_hora', 'Data e hora', 'datetime-local', 1], ['motivo', 'Motivo', 'text'], ['status', 'Status', 'sel:agendada,realizada,cancelada']] },
    prontuarios: { t: 'Prontuário', o: 'data', f: [['pet_id', 'Pet', 'ref:pets:nome', 1], ['data', 'Data', 'date', 1], ['descricao', 'Atendimento', 'textarea', 1], ['medicamentos', 'Medicamentos', 'text']] },
    financeiro: { t: 'Financeiro', o: 'data', f: [['descricao', 'Descrição', 'text', 1], ['valor', 'Valor (R$)', 'number', 1], ['tipo', 'Tipo', 'sel:receita,despesa'], ['data', 'Data', 'date']] },
    estoque: { t: 'Estoque', o: 'item', asc: true, f: [['item', 'Item', 'text', 1], ['quantidade', 'Quantidade', 'number', 1], ['minimo', 'Mínimo', 'number'], ['unidade', 'Unidade', 'text']] }
  };
  var cur = 'tutores', rows = [], refs = {}, editId = null;

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return '&#' + c.charCodeAt(0) + ';'; }); }
  function isRef(f) { return f[2].indexOf('ref:') === 0; }
  function refCol(f) { return f[2].split(':')[2]; }

  /* Login */
  $('#sysLogin').addEventListener('submit', async function (e) {
    e.preventDefault();
    var r = await db.auth.signInWithPassword({ email: $('#sysEmail').value.trim(), password: $('#sysSenha').value });
    if (r.error) { $('#sysLerr').textContent = 'E-mail ou senha incorretos.'; return; }
    start();
  });
  $('#sysSair').addEventListener('click', async function () { await db.auth.signOut(); history.replaceState(null, '', location.pathname + location.search); location.reload(); });
  /* Abrir e fechar a área da equipe (link no rodapé ou endereço terminando em #sistema) */
  var sys = $('#sys'), booted = false;
  function openSys() {
    sys.hidden = false; document.body.style.overflow = 'hidden';
    if (!booted) { booted = true; db.auth.getSession().then(function (r) { if (r.data.session) start(); }); }
  }
  function closeSys() {
    sys.hidden = true; document.body.style.overflow = '';
    if (location.hash === '#sistema') history.replaceState(null, '', location.pathname + location.search);
  }
  document.addEventListener('click', function (e) {
    if (e.target.closest('[data-sys-open]')) { e.preventDefault(); openSys(); }
    else if (e.target.closest('[data-sys-close]')) closeSys();
  });
  if (location.hash === '#sistema') openSys();

  function start() {
    $('#sysLoginBox').hidden = true; $('#sysApp').hidden = false;
    $('#sysNav').innerHTML = Object.keys(M).map(function (k) { return '<button data-k="' + k + '">' + M[k].t + '</button>'; }).join('');
    go('tutores');
  }
  $('#sysNav').addEventListener('click', function (e) { if (e.target.dataset.k) go(e.target.dataset.k); });

  async function go(k) {
    cur = k; editId = null; refs = {}; $('#sysBusca').value = '';
    $('#sysTit').textContent = M[k].t;
    document.querySelectorAll('#sysNav button').forEach(function (b) { b.classList.toggle('on', b.dataset.k === k); });
    for (var f of M[k].f) {
      if (isRef(f)) {
        var src = f[2].split(':')[1];
        var r = await db.from(src).select('id,' + refCol(f)).order(refCol(f));
        refs[f[0]] = r.data || [];
      }
    }
    form(); load();
  }

  function form() {
    $('#sysFm').innerHTML = M[cur].f.map(function (f) {
      var t = f[2], id = 'sf_' + f[0], req = f[3] ? ' required' : '', h;
      if (isRef(f)) h = '<select id="' + id + '"' + req + '><option value="">Selecione…</option>' + refs[f[0]].map(function (o) { return '<option value="' + o.id + '">' + esc(o[refCol(f)]) + '</option>'; }).join('') + '</select>';
      else if (t.indexOf('sel:') === 0) h = '<select id="' + id + '">' + t.slice(4).split(',').map(function (o) { return '<option>' + o + '</option>'; }).join('') + '</select>';
      else if (t === 'textarea') h = '<textarea id="' + id + '"' + req + '></textarea>';
      else h = '<input id="' + id + '" type="' + t + '"' + (t === 'number' ? ' step="0.01"' : '') + req + '>';
      return '<label>' + f[1] + h + '</label>';
    }).join('') + '<button class="sys-btn">Salvar</button><button type="button" class="sys-ghost" id="sysCancel" hidden>Cancelar edição</button>';
    $('#sysCancel').onclick = function () { editId = null; form(); };
  }

  async function load() {
    var m = M[cur];
    var r = await db.from(cur).select('*').order(m.o || 'criado_em', { ascending: !!m.asc });
    if (r.error) { alert('Erro ao carregar: ' + r.error.message); return; }
    rows = r.data || [];
    $('#sysLista').innerHTML = '<tr>' + m.f.map(function (f) { return '<th>' + f[1] + '</th>'; }).join('') + '<th></th></tr>' +
      (rows.length ? rows.map(function (x, i) {
        var low = cur === 'estoque' && x.quantidade <= x.minimo ? ' class="sys-low"' : '';
        return '<tr' + low + '>' + m.f.map(function (f) {
          var v = x[f[0]];
          if (isRef(f)) { var o = refs[f[0]].find(function (o) { return o.id === v; }); v = o ? o[refCol(f)] : ''; }
          else if (f[2] === 'datetime-local' && v) v = new Date(v).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
          else if (f[2] === 'date' && v) v = v.split('-').reverse().join('/');
          return '<td>' + esc(v) + '</td>';
        }).join('') + '<td><button data-e="' + i + '">Editar</button><button data-d="' + x.id + '">Excluir</button></td></tr>';
      }).join('') : '<tr><td colspan="9">Nada cadastrado ainda. Preencha o formulário acima e clique em Salvar.</td></tr>');
    var s = 0, n = 0;
    if (cur === 'financeiro') {
      rows.forEach(function (x) { s += (x.tipo === 'receita' ? 1 : -1) * Number(x.valor); });
      $('#sysResumo').textContent = 'Saldo: R$ ' + s.toFixed(2).replace('.', ',');
    } else if (cur === 'estoque') {
      rows.forEach(function (x) { if (x.quantidade <= x.minimo) n++; });
      $('#sysResumo').textContent = n ? n + ' item(ns) no estoque mínimo ou abaixo (em vermelho).' : '';
    } else $('#sysResumo').textContent = '';
    filtra();
  }

  /* Busca por nome: filtra as linhas da lista (ignora acentos e maiúsculas) */
  function norm(s) { return s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase(); }
  function filtra() {
    var q = norm($('#sysBusca').value.trim()), trs = document.querySelectorAll('#sysLista tr');
    for (var i = 1; i < trs.length; i++) {
      var t = '';
      for (var c = 0; c < trs[i].cells.length - 1; c++) t += ' ' + trs[i].cells[c].textContent;
      trs[i].hidden = !!q && norm(t).indexOf(q) === -1;
    }
  }
  $('#sysBusca').addEventListener('input', filtra);

  /* Backup em CSV (separador ; e acentos corretos no Excel em português) */
  async function fetchAll(t) {
    var out = [], from = 0, r;
    do {
      r = await db.from(t).select('*').order('criado_em').range(from, from + 999);
      if (r.error) throw r.error;
      out = out.concat(r.data); from += 1000;
    } while (r.data.length === 1000);
    return out;
  }
  function csvCell(v) {
    if (v == null) return '';
    var s = String(v);
    if (/^[=@]/.test(s)) s = "'" + s;
    return /[";\n\r]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
  }
  async function baixa(t) {
    var cols = ['id'].concat(M[t].f.map(function (f) { return f[0]; }), 'criado_em');
    var data = await fetchAll(t);
    var linhas = [cols.join(';')].concat(data.map(function (x) { return cols.map(function (c) { return csvCell(x[c]); }).join(';'); }));
    var blob = new Blob(['\ufeff' + linhas.join('\r\n')], { type: 'text/csv;charset=utf-8' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'vetere-' + t + '-' + new Date().toLocaleDateString('sv-SE') + '.csv';
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 1000);
  }
  $('#sysCsv').addEventListener('click', async function () {
    try { await baixa(cur); } catch (err) { alert('Erro ao baixar: ' + (err.message || err)); }
  });
  $('#sysBackup').addEventListener('click', async function (e) {
    var b = e.currentTarget, txt = b.textContent;
    b.disabled = true; b.textContent = 'Gerando…';
    try {
      for (var k of Object.keys(M)) { await baixa(k); await new Promise(function (ok) { setTimeout(ok, 500); }); }
    } catch (err) { alert('Erro ao gerar o backup: ' + (err.message || err)); }
    b.disabled = false; b.textContent = txt;
  });

  /* Salvar (novo ou edição) */
  $('#sysFm').addEventListener('submit', async function (e) {
    e.preventDefault();
    var o = {};
    M[cur].f.forEach(function (f) {
      var v = $('#sf_' + f[0]).value;
      if (f[2] === 'datetime-local' && v) v = new Date(v).toISOString();
      o[f[0]] = v === '' ? null : v;
    });
    var r = await (editId ? db.from(cur).update(o).eq('id', editId) : db.from(cur).insert(o));
    if (r.error) { alert('Erro ao salvar: ' + r.error.message); return; }
    editId = null; form(); load();
  });

  /* Editar e excluir */
  $('#sysLista').addEventListener('click', async function (e) {
    var b = e.target;
    if (b.dataset.e !== undefined) {
      var x = rows[b.dataset.e]; editId = x.id;
      M[cur].f.forEach(function (f) {
        var v = x[f[0]];
        if (f[2] === 'datetime-local' && v) { var d = new Date(v); v = new Date(d - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16); }
        $('#sf_' + f[0]).value = v == null ? '' : v;
      });
      $('#sysCancel').hidden = false; $('#sys').scrollTop = 0;
    }
    if (b.dataset.d && confirm('Excluir este registro? Não dá para desfazer. Excluir um tutor também exclui os pets dele.')) {
      var r = await db.from(cur).delete().eq('id', b.dataset.d);
      if (r.error) alert('Erro ao excluir: ' + r.error.message);
      load();
    }
  });
})();