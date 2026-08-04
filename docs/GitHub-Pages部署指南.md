# 芋圆工作台 · GitHub Pages 自助部署指南

> 本指南让你**全程在浏览器网页端完成部署**，不需要在电脑上安装任何软件，也不需要让任何程序访问你的电脑。
> 整个过程只在 GitHub 的服务器上创建文件，**你本地电脑上的任何文件都不会被读取、删除或修改**。

---

## 一、前提说明（关于安全）

- 部署 = 把 `ai-workbench/` 里的静态文件（HTML/CSS/JS）上传到 GitHub 服务器。
- GitHub Pages 运行在 GitHub 云端，访问时由 GitHub 服务器把文件发给浏览器，**不经过你的电脑**。
- 你本地的 `ai-workbench/` 文件夹会原封不动地留在你电脑上，部署不影响它。
- 免费、永久；站点约 0.26 MB，完全在免费额度内。

---

## 二、操作步骤（约 5 分钟）

### 第 1 步：注册 / 登录 GitHub
打开 https://github.com ，注册或登录一个账号（免费）。

### 第 2 步：新建一个仓库（Repository）
1. 右上角点 **＋ → New repository**。
2. Repository name 填：`yuyuan-workbench`（这是你站点的地址一部分，**只能英文/数字/中划线**）。
3. 选 **Public**（公开，免费必选；别人只能看到页面，看不到你的待办/书库数据）。
4. 不要勾选 "Add a README" 等任何初始化选项（保持空仓库）。
5. 点 **Create repository**。

### 第 3 步：上传代码（解压后的文件）
1. 在你电脑上，把打包好的 `yuyuan-workbench-deploy.zip` 解压，得到 `ai-workbench` 文件夹。
2. 进入 `ai-workbench` 文件夹，全选里面**所有文件**（index.html、app.html、assets、docs、manifest.json、sw.js 等），直接**拖拽**到 GitHub 新建仓库页面的上传区。
   - 注意：把 `ai-workbench` **里面的内容**传到仓库根目录，不要连 `ai-workbench` 这层文件夹一起传（否则网址要多一级路径）。
3. 页面底部填提交说明（如 `init`），点 **Commit changes**。

### 第 4 步：开启 GitHub Pages
1. 仓库页点 **Settings → Pages**（左侧菜单）。
2. Source 选 **Deploy from a branch**。
3. Branch 选 **main**（或 master，看你提交到了哪个），目录选 **/ (root)**。
4. 点 **Save**。

### 第 5 步：等待并访问
1. 等 1～2 分钟（首次约 30 秒~几分钟）。
2. 页面会显示你的站点地址：
   `https://你的用户名.github.io/yuyuan-workbench/`
3. 浏览器打开它，用 `admin / admin888` 登录即可。

---

## 三、安装为手机 / 电脑 App（PWA）

- **电脑（Chrome/Edge）**：打开站点 → 地址栏右侧「安装」图标 → 确认 → 桌面/任务栏出现「芋圆工作台」。
- **安卓**：浏览器菜单 → 安装应用 / 添加到主屏幕。
- **iPhone**：Safari 分享 → 添加到主屏幕。

---

## 四、开启多端同步（桌面 ↔ 手机）

1. 打开 https://jsonbin.io 免费注册，新建一个 Bin，拿到 **Bin ID** 和 **Master Key**。
2. 在工作台「设置中心 → 云端同步」选 JSONBin.io，填入这两个值。
3. 电脑和手机填**相同**的 Bin ID + Key → 点「立即同步」即可合并。
   - 同步按时间戳合并、多端可同时用；你的数据存在各自浏览器 + 你的 JSONBin，GitHub 上看不到。

---

## 五、后续更新（改了内容要重新发布）

如果你让我改了工作台内容，我会重新给你一个部署 zip。你只需：
1. 解压 → 进入仓库 → 把旧文件删除、拖入新文件 → Commit。
2. GitHub Pages 会自动更新（通常几十秒内生效，可强制刷新 Ctrl/Cmd+Shift+R）。

---

## 六、重要安全提醒

- **不要把真实的 JSONBin Master Key 写进代码再上传**：Key 只存在你浏览器里，不会泄露；只要别手贱把它硬编码进代码即可。
- **公开仓库 ≠ 公开你的数据**：别人能看到登录页和前端代码，但你的待办/书库/打卡都在各自浏览器 + 你的 JSONBin 里，他人无法读取。
- 如果你连代码都不想公开：GitHub 提供私有仓库 + Pages（部分套餐收费），或改用 Netlify/Vercel 免费私有部署。
