/* ============================================================
 * 板块6：账号运营（自媒体选题库）
 * 职场成长 / 副业变现 / 个人提升 三大赛道 · 每日热点选题 + 长期储备库
 * ============================================================ */
var ModIdeas = (function () {
  var OFF_KEY = 'paw.idea.offset';
  var TRACK = { psychology: '职场成长', parenting: '副业变现', career: '个人提升' };
  var dailyTrack = 'all', libFilter = 'all', kw = '';

  function offset() { try { return parseInt(sessionStorage.getItem(OFF_KEY) || '0', 10) || 0; } catch (e) { return 0; } }
  function bump() { try { sessionStorage.setItem(OFF_KEY, offset() + 1); } catch (e) {} }

  function dailyList() {
    var seedBase = Util.dayIndex() * 17 + offset() * 5;
    var out = [];
    Object.keys(TRACK).forEach(function (k, idx) {
      Util.seededPick(CONTENT.topics[k], seedBase + idx * 31, 2).forEach(function (x) {
        out.push({ track: k, t: x.t, dir: x.dir, aud: x.aud, form: x.form });
      });
    });
    return out.slice(0, 5);
  }

  function exists(title) { return DB.all('ideas').some(function (i) { return i.title === title; }); }

  function saveIdea(o, silent) {
    if (exists(o.t)) { if (!silent) Toast.show('该选题已在储备库中', 'info'); return false; }
    DB.insert('ideas', {
      title: o.t, track: o.track, dir: o.dir, aud: o.aud, form: o.form,
      status: 'todo', fav: true, from: 'auto', pushDate: Util.today()
    });
    if (!silent) Toast.show('已存入选题储备库', 'ok');
    return true;
  }

  function renderDaily() {
    document.getElementById('ideaDate').textContent = Util.humanDate() + ' · 每日自动更新';
    var chips = [['all', '全部赛道']].concat(Object.keys(TRACK).map(function (k) { return [k, TRACK[k]]; }));
    document.getElementById('ideaTrackFilter').innerHTML = chips.map(function (c) {
      return '<button class="chip' + (dailyTrack === c[0] ? ' on' : '') + '" data-v="' + c[0] + '">' + c[1] + '</button>';
    }).join('');

    var list = dailyList().filter(function (x) { return dailyTrack === 'all' || x.track === dailyTrack; });
    document.getElementById('ideaDaily').innerHTML = list.map(function (x, i) {
      return '<div class="item">' +
        '<div class="item-title">' + Util.esc(x.t) + '</div>' +
        '<div class="item-meta"><span class="tag accent">' + TRACK[x.track] + '</span><span class="tag info">' + Util.esc(x.form) + '</span></div>' +
        '<div class="item-note"><b>内容方向：</b>' + Util.esc(x.dir) + '<br/><b>受众切入点：</b>' + Util.esc(x.aud) + '</div>' +
        '<div class="item-actions">' +
        '<button class="btn btn-sm ' + (exists(x.t) ? '' : 'btn-primary') + '" data-save="' + i + '">' + (exists(x.t) ? '✓ 已在储备库' : '☆ 收藏进储备库') + '</button>' +
        '</div></div>';
    }).join('');
    document.getElementById('ideaDaily')._data = list;
  }

  function ideaHTML(it) {
    return '<div class="item ' + (it.status === 'done' ? 'status-done' : 'status-doing') + '">' +
      '<div class="item-title">' + Util.esc(it.title) + '</div>' +
      '<div class="item-meta">' +
      '<span class="tag accent">' + (TRACK[it.track] || '其他') + '</span>' +
      '<span class="tag ' + (it.status === 'done' ? 'ok' : 'warn') + '">' + (it.status === 'done' ? '已完成' : '待创作') + '</span>' +
      '<span class="tag info">' + Util.esc(it.form || '短视频') + '</span>' +
      '<span>' + (it.from === 'manual' ? '手动新增' : '每日推送') + ' · ' + Util.dateKey(it.createdAt) + '</span>' +
      '</div>' +
      ((it.dir || it.aud) ? '<div class="item-note">' + (it.dir ? '<b>内容方向：</b>' + Util.esc(it.dir) : '') +
        (it.aud ? '<br/><b>受众切入点：</b>' + Util.esc(it.aud) : '') + '</div>' : '') +
      '<div class="item-actions">' +
      '<button class="btn btn-sm" data-act="toggle" data-id="' + it.id + '">标为' + (it.status === 'done' ? '待创作' : '已完成') + '</button>' +
      '<button class="btn btn-sm" data-act="fav" data-id="' + it.id + '">' + (it.fav ? '★ 已收藏' : '☆ 收藏') + '</button>' +
      '<button class="btn btn-sm btn-danger" data-act="del" data-id="' + it.id + '">删除</button>' +
      '</div></div>';
  }

  var SCRIPT_TRACKS = [['psychology', '职场成长'], ['parenting', '副业变现'], ['career', '个人提升']];

  function scriptInLib(track, title) {
    return DB.all('ideas').some(function (i) { return i.title === title && i.track === track; });
  }

  function renderScripts() {
    document.getElementById('scriptDate').textContent = Util.humanDate() + ' · 每日自动生成';
    var data = SCRIPT_TRACKS.map(function (tr, idx) {
      var arr = (CONTENT.scripts && CONTENT.scripts[tr[0]]) || [];
      return Util.seededPick(arr, Util.dayIndex() * 11 + idx * 7 + 3, 1)[0];
    });
    document.getElementById('ideaScripts')._data = data;
    document.getElementById('ideaScripts').innerHTML = data.map(function (s, idx) {
      if (!s) return '';
      var inLib = scriptInLib(SCRIPT_TRACKS[idx][0], s.t);
      return '<div class="script-card">' +
        '<div class="script-head"><span class="tag accent">' + SCRIPT_TRACKS[idx][1] + '</span><span class="script-title">' + Util.esc(s.t) + '</span><span class="tag">' + s.text.length + ' 字</span></div>' +
        '<div class="readbox script-body">' + Util.esc(s.text) + '</div>' +
        '<div class="item-actions">' +
        '<button class="btn btn-sm" data-copy="' + idx + '">复制全文</button>' +
        '<button class="btn btn-sm ' + (inLib ? '' : 'btn-primary') + '" data-script="' + idx + '">' + (inLib ? '✓ 已存入储备库' : '存入选题储备库') + '</button>' +
        '</div></div>';
    }).join('');
  }

  function copyScript(idx) {
    var s = (document.getElementById('ideaScripts')._data || [])[idx];
    if (!s) return;
    var text = s.t + '\n\n' + s.text;
    function fb() { var ta = document.createElement('textarea'); ta.value = text; document.body.appendChild(ta); ta.select(); try { document.execCommand('copy'); Toast.show('脚本已复制到剪贴板', 'ok'); } catch (e) { Toast.show('复制失败，请手动选择文本', 'warn'); } document.body.removeChild(ta); }
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(function () { Toast.show('脚本已复制到剪贴板', 'ok'); }, fb);
    else fb();
  }

  function saveScript(idx) {
    var s = (document.getElementById('ideaScripts')._data || [])[idx];
    if (!s) return;
    var track = SCRIPT_TRACKS[idx][0];
    if (scriptInLib(track, s.t)) { Toast.show('该脚本已在储备库中', 'info'); return; }
    DB.insert('ideas', {
      title: s.t, track: track, dir: '每日口播脚本（约 ' + s.text.length + ' 字）', aud: '自媒体账号运营', form: '短视频/口播',
      status: 'todo', fav: true, from: 'script', pushDate: Util.today()
    });
    Toast.show('脚本已存入选题储备库', 'ok');
    renderScripts(); renderLib();
  }

  function renderLib() {
    var all = DB.all('ideas');
    var counts = {
      all: all.length,
      todo: all.filter(function (i) { return i.status === 'todo'; }).length,
      done: all.filter(function (i) { return i.status === 'done'; }).length,
      fav: all.filter(function (i) { return i.fav; }).length
    };
    Object.keys(TRACK).forEach(function (k) { counts[k] = all.filter(function (i) { return i.track === k; }).length; });

    document.getElementById('ideaStats').innerHTML = [
      { n: counts.all, l: '储备选题总量', x: '长期积累' },
      { n: counts.todo, l: '待创作', x: '可直接开工' },
      { n: counts.done, l: '已完成', x: '累计产出' },
      { n: all.filter(function (i) { return Util.dateKey(i.createdAt) === Util.today(); }).length, l: '今日新增', x: Util.today() }
    ].map(function (s) {
      return '<div class="stat"><div class="n">' + s.n + '</div><div class="l">' + s.l + '</div><div class="x">' + s.x + '</div></div>';
    }).join('');

    var chips = [['all', '全部'], ['todo', '待创作'], ['done', '已完成'], ['fav', '已收藏'],
      ['psychology', '职场成长'], ['parenting', '副业变现'], ['career', '个人提升']];
    document.getElementById('idFilters').innerHTML = chips.map(function (c) {
      return '<button class="chip' + (libFilter === c[0] ? ' on' : '') + '" data-v="' + c[0] + '">' + c[1] + ' ' + (counts[c[0]] || 0) + '</button>';
    }).join('');

    var list = all.filter(function (i) {
      if (libFilter === 'todo' || libFilter === 'done') { if (i.status !== libFilter) return false; }
      else if (libFilter === 'fav') { if (!i.fav) return false; }
      else if (libFilter !== 'all') { if (i.track !== libFilter) return false; }
      if (kw && (i.title + ' ' + (i.dir || '') + ' ' + (i.aud || '')).toLowerCase().indexOf(kw.toLowerCase()) < 0) return false;
      return true;
    }).sort(function (a, b) {
      if ((a.status === 'done') !== (b.status === 'done')) return a.status === 'done' ? 1 : -1;
      return b.createdAt - a.createdAt;
    });

    document.getElementById('idCount').textContent = '共 ' + all.length + ' 条 · 当前显示 ' + list.length + ' 条';
    document.getElementById('idList').innerHTML = list.length ? list.map(ideaHTML).join('')
      : '<div class="empty">储备库为空，可从上方每日推送中收藏，或手动新增选题</div>';

    var badge = document.getElementById('badgeIdeas');
    if (badge) badge.textContent = counts.todo;
  }

  function render() { renderDaily(); renderScripts(); renderLib(); }

  function init() {
    document.getElementById('ideaTrackFilter').addEventListener('click', function (e) {
      var b = e.target.closest('.chip'); if (!b) return;
      dailyTrack = b.dataset.v; renderDaily();
    });
    document.getElementById('ideaRefresh').addEventListener('click', function () {
      bump(); renderDaily(); Toast.show('已生成新一批热点选题', 'info');
    });
    document.getElementById('ideaSaveAll').addEventListener('click', function () {
      var n = 0;
      dailyList().forEach(function (x) { if (saveIdea(x, true)) n++; });
      Toast.show(n ? '已存入 ' + n + ' 条新选题' : '今日选题均已在储备库中', n ? 'ok' : 'info');
      render();
    });
    document.getElementById('ideaDaily').addEventListener('click', function (e) {
      var b = e.target.closest('button[data-save]'); if (!b) return;
      var d = (this._data || [])[parseInt(b.dataset.save, 10)]; if (!d) return;
      saveIdea(d); render();
    });
    document.getElementById('ideaScripts').addEventListener('click', function (e) {
      var copyBtn = e.target.closest('button[data-copy]');
      if (copyBtn) { copyScript(parseInt(copyBtn.dataset.copy, 10)); return; }
      var saveBtn = e.target.closest('button[data-script]');
      if (saveBtn) { saveScript(parseInt(saveBtn.dataset.script, 10)); }
    });

    document.getElementById('idAdd').addEventListener('click', function () {
      var t = document.getElementById('idTitle').value.trim();
      if (!t) { Toast.show('请输入选题标题', 'warn'); return; }
      DB.insert('ideas', {
        title: t,
        track: document.getElementById('idTrack').value,
        dir: document.getElementById('idDir').value.trim(),
        aud: document.getElementById('idAud').value.trim(),
        form: document.getElementById('idForm').value,
        status: document.getElementById('idStatus').value,
        fav: false, from: 'manual', pushDate: Util.today()
      });
      ['idTitle', 'idDir', 'idAud'].forEach(function (id) { document.getElementById(id).value = ''; });
      Toast.show('选题已加入储备库', 'ok'); render();
    });
    document.getElementById('idTitle').addEventListener('keydown', function (e) {
      if (e.key === 'Enter') document.getElementById('idAdd').click();
    });

    document.getElementById('idSearch').addEventListener('input', Util.debounce(function (e) {
      kw = e.target.value.trim(); renderLib();
    }, 200));
    document.getElementById('idFilters').addEventListener('click', function (e) {
      var b = e.target.closest('.chip'); if (!b) return;
      libFilter = b.dataset.v; renderLib();
    });
    document.getElementById('idList').addEventListener('click', function (e) {
      var b = e.target.closest('button[data-act]'); if (!b) return;
      var it = DB.find('ideas', b.dataset.id); if (!it) return;
      if (b.dataset.act === 'toggle') DB.update('ideas', it.id, { status: it.status === 'done' ? 'todo' : 'done' });
      else if (b.dataset.act === 'fav') DB.update('ideas', it.id, { fav: !it.fav });
      else if (b.dataset.act === 'del') { DB.remove('ideas', it.id); Toast.show('已删除选题', 'info'); }
      render();
    });
    document.getElementById('idExport').addEventListener('click', function () {
      var all = DB.all('ideas');
      if (!all.length) { Toast.show('储备库为空', 'warn'); return; }
      var csv = '选题标题,赛道,状态,形式,内容方向,受众切入点,创建日期\n' + all.map(function (i) {
        return ['"' + i.title + '"', TRACK[i.track] || '', i.status === 'done' ? '已完成' : '待创作',
          i.form || '', '"' + (i.dir || '') + '"', '"' + (i.aud || '') + '"', Util.dateKey(i.createdAt)].join(',');
      }).join('\n');
      Util.download('选题储备库_' + Util.today() + '.csv', '\ufeff' + csv);
      Toast.show('已导出 ' + all.length + ' 条选题', 'ok');
    });
  }

  return { init: init, render: render };
})();
