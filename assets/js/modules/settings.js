/* ============================================================
 * 设置中心：账号权限 / 云端同步 / 数据管理 / 外观偏好
 * ============================================================ */
var ModSettings = (function () {
  var importMode = 'merge';

  function renderUsers() {
    var me = (Auth.session() || {}).u;
    var list = Auth.users();
    document.getElementById('userList').innerHTML = list.map(function (u) {
      return '<div class="item" style="display:flex;align-items:center;gap:10px;flex-wrap:wrap">' +
        '<div class="grow"><b>' + Util.esc(u.u) + '</b>' +
        (u.u === me ? ' <span class="tag ok">当前登录</span>' : '') +
        (u.role === 'owner' ? ' <span class="tag accent">管理员</span>' : '') +
        '<div class="small muted">' + Util.esc(u.note || '—') + ' · 创建于 ' + Util.dateKey(u.createdAt) + '</div></div>' +
        '<button class="btn btn-sm btn-danger" data-del="' + u.id + '"' + (u.u === me ? ' disabled title="不能删除当前登录账号"' : '') + '>删除</button>' +
        '</div>';
    }).join('');
  }

  function renderSync() {
    var s = DB.settings().sync || {};
    document.getElementById('syMode').value = s.mode || 'off';
    document.getElementById('syAuto').value = s.auto === false ? '0' : '1';
    document.getElementById('syBin').value = s.binId || '';
    document.getElementById('syKey').value = s.key || '';
    document.getElementById('syUrl').value = s.url || '';
    document.getElementById('syToken').value = s.token || '';
    document.getElementById('syOwner').value = s.owner || '';
    document.getElementById('syRepo').value = s.repo || '';
    document.getElementById('syPath').value = s.path || 'sync-data.json';
    document.getElementById('syBranch').value = s.branch || 'main';
    document.getElementById('syGhToken').value = s.ghToken || '';
    document.getElementById('syPass').value = s.pass || '';
    toggleSyncFields();
    var last = DB.settings().lastSyncAt;
    var modeText = (s.mode === 'jsonbin') ? 'JSONBin.io' : (s.mode === 'github') ? 'GitHub 仓库（加密）' : (s.mode === 'custom') ? '自定义接口' : '';
    document.getElementById('syInfo').innerHTML =
      '当前状态：' + (s.mode && s.mode !== 'off' ? '<b>已启用（' + modeText + '）</b>' : '未启用，数据仅保存在本机浏览器') +
      '　|　上次同步：' + (last ? Util.shortTime(last) : '从未同步') +
      '　|　网络：' + (navigator.onLine ? '在线' : '离线') +
      '<br/>说明：同步采用「按记录时间戳合并」策略，多设备可同时使用；删除操作以墓碑方式传播，不会被旧数据复活。';
  }

  function toggleSyncFields() {
    var m = document.getElementById('syMode').value;
    document.querySelectorAll('.jsonbin-only').forEach(function (el) { el.classList.toggle('hidden', m !== 'jsonbin'); });
    document.querySelectorAll('.custom-only').forEach(function (el) { el.classList.toggle('hidden', m !== 'custom'); });
    document.querySelectorAll('.github-only').forEach(function (el) { el.classList.toggle('hidden', m !== 'github'); });
  }

  function renderDbStats() {
    var raw = DB.raw();
    var size = 0;
    try { size = (localStorage.getItem(DB.KEY) || '').length; } catch (e) {}
    document.getElementById('dbStats').innerHTML = [
      { n: DB.all('todos').length, l: '待办记录' },
      { n: DB.all('books').length + DB.all('notes').length, l: '书籍 + 读书笔记' },
      { n: DB.all('langLogs').length + DB.all('expLogs').length, l: '英语 + 表达打卡' },
      { n: (size / 1024).toFixed(1) + ' KB', l: '本地占用空间' }
    ].map(function (s) {
      return '<div class="stat"><div class="n" style="font-size:20px">' + s.n + '</div><div class="l">' + s.l + '</div></div>';
    }).join('');
  }

  function render() {
    renderUsers(); renderSync(); renderDbStats();
    document.getElementById('stTheme').value = Theme.get();
    document.getElementById('stOwner').value = DB.settings().ownerName || '';
  }

  function init() {
    document.getElementById('userList').addEventListener('click', function (e) {
      var b = e.target.closest('button[data-del]'); if (!b || b.disabled) return;
      var r = Auth.removeUser(b.dataset.del);
      Toast.show(r.ok ? '账号已删除' : r.msg, r.ok ? 'ok' : 'warn');
      renderUsers();
    });

    document.getElementById('nuAdd').addEventListener('click', function () {
      var u = document.getElementById('nuUser').value.trim();
      var p = document.getElementById('nuPwd').value;
      if (p.length < 6) { Toast.show('密码至少 6 位', 'warn'); return; }
      Auth.addUser(u, p, document.getElementById('nuNote').value.trim()).then(function (r) {
        Toast.show(r.ok ? '账号创建成功' : r.msg, r.ok ? 'ok' : 'err');
        if (r.ok) { document.getElementById('nuUser').value = ''; document.getElementById('nuPwd').value = ''; document.getElementById('nuNote').value = ''; renderUsers(); }
      });
    });

    document.getElementById('cpBtn').addEventListener('click', function () {
      var me = (Auth.session() || {}).u;
      var o = document.getElementById('cpOld').value, n = document.getElementById('cpNew').value;
      if (n.length < 6) { Toast.show('新密码至少 6 位', 'warn'); return; }
      Auth.changePwd(me, o, n).then(function (r) {
        Toast.show(r.ok ? '密码已更新，请牢记新密码' : r.msg, r.ok ? 'ok' : 'err');
        if (r.ok) { document.getElementById('cpOld').value = ''; document.getElementById('cpNew').value = ''; }
      });
    });

    document.getElementById('syMode').addEventListener('change', toggleSyncFields);
    document.getElementById('syySave').addEventListener('click', function () {
      DB.saveSettings({
        sync: {
          mode: document.getElementById('syMode').value,
          auto: document.getElementById('syAuto').value === '1',
          binId: document.getElementById('syBin').value.trim(),
          key: document.getElementById('syKey').value.trim(),
          url: document.getElementById('syUrl').value.trim(),
          token: document.getElementById('syToken').value.trim(),
          owner: document.getElementById('syOwner').value.trim(),
          repo: document.getElementById('syRepo').value.trim(),
          path: document.getElementById('syPath').value.trim() || 'sync-data.json',
          branch: document.getElementById('syBranch').value.trim() || 'main',
          ghToken: document.getElementById('syGhToken').value.trim(),
          pass: document.getElementById('syPass').value.trim()
        }
      });
      Toast.show('同步配置已保存', 'ok');
      renderSync();
      if (window.App) App.updateSyncChip();
    });
    document.getElementById('syTest').addEventListener('click', function () {
      if (document.getElementById('syMode').value === 'off') { Toast.show('请先选择同步方式并保存配置', 'warn'); return; }
      Sync.test();
    });
    document.getElementById('syNow').addEventListener('click', function () { Sync.now(true).then(renderSync); });
    document.getElementById('syGenCode').addEventListener('click', function () {
      if (document.getElementById('syMode').value === 'off') { Toast.show('请先选择同步方式并保存配置', 'warn'); return; }
      var code = Sync.makeCode();
      if (!code) { Toast.show('生成同步码失败', 'err'); return; }
      document.getElementById('syCode').value = code;
      document.getElementById('syCode').select();
      try { document.execCommand('copy'); Toast.show('同步码已生成并复制，去手机端粘贴即可', 'ok'); }
      catch (e) { Toast.show('同步码已生成，请手动复制', 'ok'); }
    });
    document.getElementById('syApplyCode').addEventListener('click', function () {
      var code = document.getElementById('syCode').value.trim();
      if (!code) { Toast.show('请先粘贴同步码', 'warn'); return; }
      if (Sync.applyCode(code)) {
        Toast.show('同步码已应用，云端配置已配好', 'ok');
        renderSync();
        if (window.App) App.updateSyncChip();
        Sync.now(true).then(renderSync);
      } else { Toast.show('同步码无效或格式错误', 'err'); }
    });

    document.getElementById('dtExport').addEventListener('click', function () {
      Util.download('工作台数据备份_' + Util.today() + '.json', DB.exportJSON());
      Toast.show('数据已导出', 'ok');
    });
    document.getElementById('dtImport').addEventListener('click', function () { importMode = 'merge'; document.getElementById('dtFile').click(); });
    document.getElementById('dtImportReplace').addEventListener('click', function () { importMode = 'replace'; document.getElementById('dtFile').click(); });
    document.getElementById('dtFile').addEventListener('change', function (e) {
      var f = e.target.files[0]; if (!f) return;
      var reader = new FileReader();
      reader.onload = function () {
        try {
          DB.importJSON(reader.result, importMode);
          Toast.show('数据导入成功（' + (importMode === 'merge' ? '合并' : '覆盖') + '）', 'ok');
          if (window.App) App.refreshAll();
          render();
        } catch (err) { Toast.show('导入失败：文件格式不正确', 'err'); }
      };
      reader.readAsText(f);
      e.target.value = '';
    });
    document.getElementById('dtClear').addEventListener('click', function () {
      if (this.dataset.confirm !== '1') {
        this.dataset.confirm = '1';
        this.textContent = '再次点击确认清空（不可恢复）';
        var self = this;
        setTimeout(function () { self.dataset.confirm = '0'; self.textContent = '清空本机缓存'; }, 5000);
        return;
      }
      try { localStorage.removeItem(DB.KEY); } catch (e) {}
      Toast.show('本机缓存已清空，即将重新登录', 'info');
      setTimeout(function () { Auth.logout(); location.replace('./index.html'); }, 900);
    });

    document.getElementById('stSave').addEventListener('click', function () {
      Theme.set(document.getElementById('stTheme').value);
      DB.saveSettings({ ownerName: document.getElementById('stOwner').value.trim() });
      Toast.show('偏好已保存', 'ok');
    });
  }

  return { init: init, render: render };
})();
