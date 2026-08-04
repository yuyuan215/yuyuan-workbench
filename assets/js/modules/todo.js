/* ============================================================
 * 板块1：今日待办
 * 工作项目管理 / 重要节点追踪 / 日常事务 / 老板私人事务统筹
 * ============================================================ */
var ModTodo = (function () {
  var filter = { cat: 'all', status: 'all', kw: '' };
  var editingId = null;

  var STATUS = {
    doing: { label: '进行中', cls: 'info' },
    done: { label: '已完成', cls: 'ok' },
    delay: { label: '延期', cls: 'warn' }
  };
  var PRI = { high: { label: '高优先级', cls: 'err' }, mid: { label: '中优先级', cls: 'info' }, low: { label: '低优先级', cls: '' } };

  // 私人事务自动识别关键词
  var PRIVATE_KW = ['老板私人', '私人', '家里', '家人', '家属', '体检', '机票', '酒店', '订餐', '生日', '礼品', '礼物',
    '接送', '孩子', '子女', '车辆', '保养', '物业', '缴费', '就医', '挂号', '健身', '旅行', '签证', '搬家', '装修', '保险'];

  function autoCat(title, chosen) {
    if (chosen === 'private') return 'private';
    var t = String(title);
    for (var i = 0; i < PRIVATE_KW.length; i++) if (t.indexOf(PRIVATE_KW[i]) >= 0) return 'private';
    return 'work';
  }

  /** 逾期自动标记为延期 */
  function syncOverdue() {
    var today = Util.today(), changed = false;
    DB.all('todos').forEach(function (t) {
      if (t.status === 'doing' && t.due && t.due < today) {
        t.status = 'delay'; t.updatedAt = Date.now(); changed = true;
      }
    });
    if (changed) DB.persist(true);
  }

  function add() {
    var title = document.getElementById('tdTitle').value.trim();
    if (!title) { Toast.show('请输入待办内容', 'warn'); return; }
    var chosen = document.getElementById('tdCat').value;
    var cat = autoCat(title, chosen);
    DB.insert('todos', {
      title: title,
      cat: cat,
      pri: document.getElementById('tdPri').value,
      due: document.getElementById('tdDue').value || '',
      status: document.getElementById('tdStatus').value,
      note: document.getElementById('tdNote').value.trim(),
      doneAt: document.getElementById('tdStatus').value === 'done' ? Date.now() : 0
    });
    document.getElementById('tdTitle').value = '';
    document.getElementById('tdNote').value = '';
    if (cat === 'private' && chosen !== 'private') Toast.show('已自动归类为「老板私人事务」', 'info');
    else Toast.show('待办已添加', 'ok');
    render();
  }

  function setStatus(id, st) {
    DB.update('todos', id, { status: st, doneAt: st === 'done' ? Date.now() : 0 });
    render();
  }

  function del(id) { DB.remove('todos', id); Toast.show('已删除', 'info'); render(); }

  function clearDone() {
    var list = DB.all('todos').filter(function (t) { return t.status === 'done'; });
    if (!list.length) { Toast.show('当前没有已完成任务', 'info'); return; }
    list.forEach(function (t) { DB.remove('todos', t.id); });
    Toast.show('已清除 ' + list.length + ' 项已完成任务', 'ok');
    render();
  }

  function saveEdit(id) {
    var box = document.querySelector('[data-edit="' + id + '"]');
    DB.update('todos', id, {
      title: box.querySelector('.e-title').value.trim(),
      cat: box.querySelector('.e-cat').value,
      pri: box.querySelector('.e-pri').value,
      due: box.querySelector('.e-due').value,
      status: box.querySelector('.e-status').value,
      note: box.querySelector('.e-note').value.trim()
    });
    editingId = null;
    Toast.show('已保存修改', 'ok');
    render();
  }

  function itemHTML(t) {
    if (editingId === t.id) {
      return '<div class="item" data-edit="' + t.id + '">' +
        '<div class="inline-form">' +
        '<div class="full"><input class="e-title" type="text" value="' + Util.esc(t.title) + '" /></div>' +
        '<label class="field" style="margin:0"><span>分类</span><select class="e-cat">' +
        '<option value="work"' + (t.cat === 'work' ? ' selected' : '') + '>工作事项</option>' +
        '<option value="private"' + (t.cat === 'private' ? ' selected' : '') + '>老板私人事务</option></select></label>' +
        '<label class="field" style="margin:0"><span>优先级</span><select class="e-pri">' +
        ['high', 'mid', 'low'].map(function (p) { return '<option value="' + p + '"' + (t.pri === p ? ' selected' : '') + '>' + PRI[p].label + '</option>'; }).join('') +
        '</select></label>' +
        '<label class="field" style="margin:0"><span>截止日期</span><input class="e-due" type="date" value="' + Util.esc(t.due || '') + '" /></label>' +
        '<label class="field" style="margin:0"><span>状态</span><select class="e-status">' +
        ['doing', 'done', 'delay'].map(function (s) { return '<option value="' + s + '"' + (t.status === s ? ' selected' : '') + '>' + STATUS[s].label + '</option>'; }).join('') +
        '</select></label>' +
        '<div class="full"><textarea class="e-note" placeholder="备注补充">' + Util.esc(t.note || '') + '</textarea></div>' +
        '<div class="full row"><button class="btn btn-primary btn-sm" data-act="save" data-id="' + t.id + '">保存</button>' +
        '<button class="btn btn-sm" data-act="cancel">取消</button></div>' +
        '</div></div>';
    }

    var overdue = t.due && t.due < Util.today() && t.status !== 'done';
    var st = STATUS[t.status] || STATUS.doing;
    var meta = [];
    meta.push('<span class="tag ' + st.cls + '">' + st.label + '</span>');
    meta.push('<span class="tag ' + (t.cat === 'private' ? 'accent' : '') + '">' + (t.cat === 'private' ? '老板私人事务' : '工作事项') + '</span>');
    if (t.pri && PRI[t.pri]) meta.push('<span class="tag ' + PRI[t.pri].cls + '">' + PRI[t.pri].label + '</span>');
    if (t.due) meta.push('<span class="tag ' + (overdue ? 'err' : '') + '">截止 ' + t.due + (overdue ? ' · 已逾期' : '') + '</span>');
    meta.push('<span>创建 ' + Util.shortTime(t.createdAt) + '</span>');

    return '<div class="item status-' + t.status + (t.status === 'done' ? ' done' : '') + '">' +
      '<div class="item-title">' + Util.esc(t.title) + '</div>' +
      '<div class="item-meta">' + meta.join('') + '</div>' +
      (t.note ? '<div class="item-note">' + Util.esc(t.note) + '</div>' : '') +
      '<div class="item-actions">' +
      '<button class="btn btn-sm" data-act="st" data-st="doing" data-id="' + t.id + '">进行中</button>' +
      '<button class="btn btn-sm" data-act="st" data-st="done" data-id="' + t.id + '">已完成</button>' +
      '<button class="btn btn-sm" data-act="st" data-st="delay" data-id="' + t.id + '">延期</button>' +
      '<button class="btn btn-sm" data-act="edit" data-id="' + t.id + '">编辑</button>' +
      '<button class="btn btn-sm btn-danger" data-act="del" data-id="' + t.id + '">删除</button>' +
      '</div></div>';
  }

  function renderFilters() {
    var box = document.getElementById('tdFilters');
    var cats = [['all', '全部分类'], ['work', '工作事项'], ['private', '老板私人事务']];
    var sts = [['all', '全部状态'], ['doing', '进行中'], ['done', '已完成'], ['delay', '延期']];
    box.innerHTML =
      cats.map(function (c) { return '<button class="chip' + (filter.cat === c[0] ? ' on' : '') + '" data-f="cat" data-v="' + c[0] + '">' + c[1] + '</button>'; }).join('') +
      '<span style="width:10px"></span>' +
      sts.map(function (s) { return '<button class="chip' + (filter.status === s[0] ? ' on' : '') + '" data-f="status" data-v="' + s[0] + '">' + s[1] + '</button>'; }).join('');
  }

  function render() {
    syncOverdue();
    var all = DB.all('todos');
    var today = Util.today();

    // 统计
    var doing = all.filter(function (t) { return t.status === 'doing'; }).length;
    var delay = all.filter(function (t) { return t.status === 'delay'; }).length;
    var doneToday = all.filter(function (t) { return t.status === 'done' && Util.dateKey(t.doneAt || t.updatedAt) === today; }).length;
    var todayDue = all.filter(function (t) { return t.due === today && t.status !== 'done'; }).length;
    var privateN = all.filter(function (t) { return t.cat === 'private' && t.status !== 'done'; }).length;
    var wkStart = Util.dateKey(Date.now() - 6 * 86400000);
    var weekDone = all.filter(function (t) { return t.status === 'done' && t.doneAt && Util.dateKey(t.doneAt) >= wkStart; }).length;
    var weekNew = all.filter(function (t) { return Util.dateKey(t.createdAt) >= wkStart; }).length;

    document.getElementById('todoStats').innerHTML = [
      { n: doing, l: '进行中', x: '需推进的事项' },
      { n: todayDue, l: '今日到期', x: '截止日为今天' },
      { n: delay, l: '延期 / 逾期', x: '需重点关注' },
      { n: doneToday, l: '今日已完成', x: '当日战果' },
      { n: weekDone, l: '近7天完成', x: '本周战果' },
      { n: weekNew, l: '近7天新增', x: '近期负载' }
    ].map(function (s) {
      return '<div class="stat"><div class="n">' + s.n + '</div><div class="l">' + s.l + '</div><div class="x">' + s.x + '</div></div>';
    }).join('');

    renderFilters();

    var list = all.filter(function (t) {
      if (filter.cat !== 'all' && t.cat !== filter.cat) return false;
      if (filter.status !== 'all' && t.status !== filter.status) return false;
      if (filter.kw) {
        var k = filter.kw.toLowerCase();
        if ((t.title + ' ' + (t.note || '')).toLowerCase().indexOf(k) < 0) return false;
      }
      return true;
    }).sort(function (a, b) {
      var w = { delay: 0, doing: 1, done: 2 };
      if (w[a.status] !== w[b.status]) return w[a.status] - w[b.status];
      var p = { high: 0, mid: 1, low: 2 };
      if (p[a.pri] !== p[b.pri]) return (p[a.pri] || 1) - (p[b.pri] || 1);
      if (a.due && b.due && a.due !== b.due) return a.due < b.due ? -1 : 1;
      return b.createdAt - a.createdAt;
    });

    document.getElementById('todoCount').textContent = '共 ' + list.length + ' 项';
    document.getElementById('todoList').innerHTML = list.length
      ? list.map(itemHTML).join('')
      : '<div class="empty">暂无符合条件的待办，先在上方添加一条吧</div>';

    // 当日汇总
    document.getElementById('todoDateLabel').textContent = Util.humanDate();
    var work = all.filter(function (t) { return t.cat === 'work' && t.status !== 'done'; });
    var priv = all.filter(function (t) { return t.cat === 'private' && t.status !== 'done'; });
    function brief(arr) {
      return arr.length
        ? '<ul style="margin:6px 0 0;padding-left:18px">' + arr.slice(0, 8).map(function (t) {
            return '<li>' + Util.esc(t.title) + (t.due ? ' <span class="muted small">（' + t.due + '）</span>' : '') + '</li>';
          }).join('') + '</ul>' + (arr.length > 8 ? '<div class="small muted" style="margin-top:4px">等共 ' + arr.length + ' 项</div>' : '')
        : '<div class="small muted" style="margin-top:6px">暂无未完成事项</div>';
    }
    document.getElementById('todoSummary').innerHTML =
      '<div class="grid g2">' +
      '<div><b>工作事项（' + work.length + '）</b>' + brief(work) + '</div>' +
      '<div><b>老板私人事务（' + privateN + '）</b>' + brief(priv) + '</div>' +
      '</div>' +
      '<div class="divider"></div>' +
      '<div class="small muted">完成率：' + (all.length ? Math.round(all.filter(function (t) { return t.status === 'done'; }).length / all.length * 100) : 0) +
      '% · 累计事项 ' + all.length + ' 项 · 已完成 ' + all.filter(function (t) { return t.status === 'done'; }).length + ' 项</div>';

    var badge = document.getElementById('badgeTodo');
    if (badge) badge.textContent = doing + delay;
  }

  function init() {
    document.getElementById('tdAdd').addEventListener('click', add);
    document.getElementById('tdTitle').addEventListener('keydown', function (e) { if (e.key === 'Enter') add(); });
    document.getElementById('tdNote').addEventListener('keydown', function (e) { if (e.key === 'Enter') add(); });
    document.getElementById('tdClearDone').addEventListener('click', clearDone);
    document.getElementById('tdSearch').addEventListener('input', Util.debounce(function (e) {
      filter.kw = e.target.value.trim(); render();
    }, 200));

    document.getElementById('tdFilters').addEventListener('click', function (e) {
      var b = e.target.closest('.chip'); if (!b) return;
      filter[b.dataset.f] = b.dataset.v; render();
    });

    document.getElementById('todoList').addEventListener('click', function (e) {
      var b = e.target.closest('button[data-act]'); if (!b) return;
      var act = b.dataset.act, id = b.dataset.id;
      if (act === 'st') setStatus(id, b.dataset.st);
      else if (act === 'edit') { editingId = id; render(); }
      else if (act === 'cancel') { editingId = null; render(); }
      else if (act === 'save') saveEdit(id);
      else if (act === 'del') del(id);
    });
  }

  return { init: init, render: render };
})();
