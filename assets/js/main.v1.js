/* ИП Каразей: выкрас и список покупок */
(function () {
  'use strict';

  var WA = 'https://wa.me/375295007108';

  function fmt(n) { return String(n).replace('.', ','); }

  /* ---------- меню ---------- */
  function initDrawer() {
    var b = document.getElementById('burger');
    var d = document.getElementById('drawer');
    var x = document.getElementById('drawerX');
    if (!b || !d) return;
    var last = null;
    function open() {
      last = document.activeElement;
      d.hidden = false; b.setAttribute('aria-expanded', 'true');
      document.body.classList.add('is-locked');
      if (x) x.focus({ preventScroll: true });
    }
    function close() {
      d.hidden = true; b.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('is-locked');
      if (last) last.focus({ preventScroll: true });
    }
    b.addEventListener('click', function () { d.hidden ? open() : close(); });
    if (x) x.addEventListener('click', close);
    d.addEventListener('click', function (e) {
      if (e.target.closest('a')) { close(); return; }
      if (!e.target.closest('.drawer__in')) close();
    });
    document.addEventListener('keydown', function (e) {
      if (d.hidden) return;
      if (e.key === 'Escape') { close(); return; }
      if (e.key !== 'Tab') return;
      var it = d.querySelectorAll('a, button');
      if (!it.length) return;
      var f = it[0], l = it[it.length - 1];
      if (e.shiftKey && document.activeElement === f) { e.preventDefault(); l.focus(); }
      else if (!e.shiftKey && document.activeElement === l) { e.preventDefault(); f.focus(); }
    });
  }

  /* ---------- выкрас ---------- */
  function initPaint() {
    var wall = document.getElementById('wallColor');
    if (!wall) return;
    var tex = document.getElementById('wallTex');
    var capC = document.getElementById('capColor');
    var capT = document.getElementById('capTex');
    var sws = document.getElementById('sws');
    var texs = document.getElementById('texs');
    var layers = document.getElementById('layers');
    var area = document.getElementById('area');
    var areaLbl = document.getElementById('areaLbl');
    var outPaint = document.getElementById('outPaint');
    var outCans = document.getElementById('outCans');
    var outPrimer = document.getElementById('outPrimer');
    var outTools = document.getElementById('outTools');

    var state = { color: '', name: '', tex: 'matt', texName: 'матовая', area: 30, layers: 2 };

    function bank(n) {
      var packs = [];
      if (n <= 0) return '—';
      var rest = n;
      var big = Math.floor(rest / 9);
      rest = rest - big * 9;
      var mid = Math.floor(rest / 5);
      rest = rest - mid * 5;
      var small = Math.ceil(rest / 2.5);
      if (big) packs.push(big + '×9');
      if (mid) packs.push(mid + '×5');
      if (small) packs.push(small + '×2,5');
      return packs.join(' + ') + ' л';
    }

    function render() {
      wall.style.background = state.color;
      capC.textContent = state.name;
      capT.textContent = state.texName;
      if (tex) tex.className = 'paint__tex tex-' + state.tex;
      areaLbl.textContent = state.area + ' м²';

      var liters = state.area * state.layers / 7.5;
      var primer = state.area * 0.1;

      outPaint.textContent = fmt(Math.round(liters * 10) / 10);
      outCans.textContent = bank(Math.ceil(liters));
      outPrimer.textContent = fmt(Math.round(primer * 10) / 10);
      outTools.textContent = state.area > 45 ? '2 + 2' : '1 + 1';
    }

    sws.addEventListener('click', function (e) {
      var b = e.target.closest('.sw');
      if (!b) return;
      [].forEach.call(sws.children, function (s) { s.classList.toggle('is-on', s === b); });
      state.color = b.getAttribute('data-c');
      state.name = b.getAttribute('data-n');
      render();
    });
    var first = sws.querySelector('.sw');
    if (first) { first.classList.add('is-on'); state.color = first.getAttribute('data-c'); state.name = first.getAttribute('data-n'); }
    else { state.color = '#C9BFA8'; state.name = 'Тёплый лён'; }

    texs.addEventListener('click', function (e) {
      var b = e.target.closest('.tab');
      if (!b) return;
      [].forEach.call(texs.children, function (t) { t.classList.toggle('is-on', t === b); });
      state.tex = b.getAttribute('data-tex');
      state.texName = b.getAttribute('data-n');
      render();
    });

    layers.addEventListener('click', function (e) {
      var b = e.target.closest('.tab');
      if (!b) return;
      [].forEach.call(layers.children, function (t) { t.classList.toggle('is-on', t === b); });
      state.layers = parseInt(b.getAttribute('data-l'), 10);
      render();
    });

    area.addEventListener('input', function () {
      state.area = parseInt(area.value, 10);
      render();
    });

    render();
  }

  /* ---------- список покупок ---------- */
  function initShop() {
    var list = document.getElementById('shopList');
    if (!list) return;
    var rL = document.getElementById('rL');
    var rW = document.getElementById('rW');
    var rH = document.getElementById('rH');
    var works = document.getElementById('works');
    var areaLbl = document.getElementById('shopArea');
    var send = document.getElementById('shopSend');

    var on = { plaster: true, putty: true, paint: true, oboi: false, laminat: false };

    function num(el, def) {
      var v = parseFloat(String(el.value).replace(',', '.'));
      return isFinite(v) && v > 0 ? v : def;
    }

    function render() {
      var L = num(rL, 4), W = num(rW, 3), H = num(rH, 2.7);
      var perimeter = 2 * (L + W);
      var walls = Math.max(0, perimeter * H - 3.6);
      var ceiling = L * W;
      var floor = L * W;
      var rows = [];

      areaLbl.textContent = fmt(Math.round(walls)) + ' м² стен · ' + fmt(Math.round(floor * 10) / 10) + ' м² пола';

      if (on.plaster) {
        var pl = Math.ceil(walls * 15 / 30);
        rows.push(['Штукатурка гипсовая', pl + ' меш. по 30 кг']);
      }
      if (on.putty) {
        var put = Math.ceil(walls * 2.4 / 25);
        rows.push(['Шпаклёвка финишная', put + ' меш. по 25 кг']);
        rows.push(['Стеклохолст', Math.ceil(walls * 1.1) + ' м²']);
        rows.push(['Грунт глубокий', Math.ceil(walls * 0.1) + ' л']);
      }
      if (on.paint) {
        var paint = Math.ceil(walls * 2 / 7.5);
        rows.push(['Краска на 2 слоя', paint + ' л']);
        rows.push(['Малярный скотч', Math.max(2, Math.round(perimeter / 12)) + ' рул.']);
      }
      if (on.oboi) {
        var rolls = Math.ceil(walls * 1.1 / 5.3);
        rows.push(['Обои 0,53 × 10 м', rolls + ' рул.']);
        rows.push(['Клей для обоев', Math.max(1, Math.ceil(rolls / 5)) + ' уп.']);
      }
      if (on.laminat) {
        var lam = Math.ceil(floor * 1.05 * 10) / 10;
        rows.push(['Ламинат с запасом 5%', fmt(lam) + ' м²']);
        rows.push(['Подложка', fmt(Math.round(floor * 10) / 10) + ' м²']);
        rows.push(['Плинтус', Math.ceil(perimeter * 1.05) + ' м']);
      }

      if (!rows.length) {
        list.innerHTML = '<li class="empty">Отметьте работы слева — список появится здесь.</li>';
      } else {
        list.innerHTML = rows.map(function (r) {
          return '<li><span>' + r[0] + '</span><b>' + r[1] + '</b></li>';
        }).join('');
      }

      var text = 'Список покупок с сайта (Каразей)\n' +
        'Комната: ' + fmt(L) + ' × ' + fmt(W) + ' м, высота ' + fmt(H) + ' м\n' +
        'Стены: ' + fmt(Math.round(walls)) + ' м², пол: ' + fmt(Math.round(floor * 10) / 10) + ' м²\n' +
        'Работы: ' + rows.length + ' позиций\n\n' +
        rows.map(function (r) { return '· ' + r[0] + ': ' + r[1]; }).join('\n');
      if (send) send.href = WA + '?text=' + encodeURIComponent(text);
    }

    [rL, rW, rH].forEach(function (el) { el.addEventListener('input', render); });
    works.addEventListener('click', function (e) {
      var b = e.target.closest('.chk');
      if (!b) return;
      var k = b.getAttribute('data-w');
      on[k] = !on[k];
      b.classList.toggle('is-on', on[k]);
      render();
    });

    render();
  }

  /* ---------- заявка ---------- */
  function initForm() {
    var f = document.getElementById('leadForm');
    if (!f) return;
    var ok = document.getElementById('formOk');
    var out = document.getElementById('okText');
    var send = document.getElementById('okSend');
    var copy = document.getElementById('okCopy');

    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var n = document.getElementById('fName'), t = document.getElementById('fTel');
      var w = document.getElementById('fWhat'), note = document.getElementById('fNote');
      var bad = false;
      [n, t].forEach(function (el) {
        if (!el.value.trim()) { el.style.borderColor = '#B4703F'; bad = true; }
        else { el.style.borderColor = ''; }
      });
      if (bad) return;
      var text = 'Заявка на замер (Каразей)\nИмя: ' + n.value.trim() +
        '\nКонтакт: ' + t.value.trim() + '\nРаботы: ' + w.value +
        (note.value.trim() ? '\nОбъект: ' + note.value.trim() : '');
      out.textContent = text;
      if (send) send.href = WA + '?text=' + encodeURIComponent(text);
      if (ok.hidden) {
        ok.hidden = false;
        [].forEach.call(f.querySelectorAll('input, select, textarea, .form__b'), function (el) { el.disabled = true; });
      }
    });

    if (copy) {
      copy.addEventListener('click', function () {
        var text = (out.textContent || '');
        if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text);
        else {
          var ta = document.createElement('textarea');
          ta.value = text; document.body.appendChild(ta); ta.select();
          document.execCommand('copy'); document.body.removeChild(ta);
        }
        copy.textContent = 'Скопировано';
        setTimeout(function () { copy.textContent = 'Скопировать'; }, 1800);
      });
    }
  }

  function boot() {
    initDrawer(); initPaint(); initShop(); initForm();
    var y = document.getElementById('year');
    if (y) y.textContent = new Date().getFullYear();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
