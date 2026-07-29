---
title: "关于我"
permalink: /about/
---

<div class="about-section">
<div class="about-card">
<h3>👋 个人简介</h3>
你好！我是 Haokun，一名热爱技术的 GIS 开发者。专注于空间信息处理、三维可视化和全栈开发。这是我的个人博客，记录我在技术、生活和学习上的点点滴滴。
</div>
</div>

<div class="about-section">
<h2 class="section-title">技术栈</h2>
<div class="skill-grid">
<div class="skill-item"><div class="skill-name">Python</div><div class="skill-level">熟练</div></div>
<div class="skill-item"><div class="skill-name">JavaScript</div><div class="skill-level">熟练</div></div>
<div class="skill-item"><div class="skill-name">Go</div><div class="skill-level">掌握</div></div>
<div class="skill-item"><div class="skill-name">React</div><div class="skill-level">熟练</div></div>
<div class="skill-item"><div class="skill-name">Vue</div><div class="skill-level">熟练</div></div>
<div class="skill-item"><div class="skill-name">Cesium</div><div class="skill-level">精通</div></div>
<div class="skill-item"><div class="skill-name">Three.js</div><div class="skill-level">熟练</div></div>
<div class="skill-item"><div class="skill-name">Node.js</div><div class="skill-level">熟练</div></div>
<div class="skill-item"><div class="skill-name">Django</div><div class="skill-level">掌握</div></div>
<div class="skill-item"><div class="skill-name">Docker</div><div class="skill-level">熟练</div></div>
<div class="skill-item"><div class="skill-name">Kubernetes</div><div class="skill-level">掌握</div></div>
<div class="skill-item"><div class="skill-name">PostGIS</div><div class="skill-level">熟练</div></div>
</div>
</div>

<div class="about-section">
<div class="about-card">
<h3>🎯 研究方向</h3>
- 三维地理信息系统（3D GIS）
- 倾斜摄影与三维建模
- 空间数据可视化
- WebGL / WebGPU 图形开发
- 遥感影像处理
</div>
</div>

<div class="about-section">
<div class="about-card">
<h3>⭐ 兴趣爱好</h3>
- 📚 阅读技术书籍和科幻小说
- 🎮 玩游戏放松
- 🏃 跑步健身
- ✍️ 写博客记录生活
- 📷 摄影
</div>
</div>

<div class="about-section">
<h2 class="section-title">联系方式</h2>
<div class="about-card">
<ul class="contact-list">
<li>
  <span class="contact-icon">G</span>
  <span class="contact-text">
    <a href="https://github.com/Marinkun" target="_blank" rel="noopener noreferrer">GitHub: @Marinkun</a>
  </span>
</li>
<li>
  <span class="contact-icon">@</span>
  <span class="contact-text">
    <span id="privacy-email">正在加载邮箱，请启用 JavaScript...</span>
    <noscript>（已启用邮箱防爬虫保护，请启用 JavaScript 查看）</noscript>
  </span>
</li>
<li>
  <span class="contact-icon">📍</span>
  <span class="contact-text">河南 · 信阳</span>
</li>
</ul>
<p style="margin-top:16px;font-size:0.85em;color:var(--text-muted);">
  💡 提示：本站联系方式已采用反爬虫与引用来源保护，防止第三方数据收集。
</p>
</div>
</div>

欢迎留言讨论，一起交流学习！

<script>
(function() {
  // 博客专用邮箱，按 obfuscated 方式拆分，静态源码中不出现完整邮箱字符串
  var parts = ['haokun', 'blog', 'proton', 'me'];
  var local = parts[0] + '.' + parts[1];
  var domain = parts[2] + '.' + parts[3];
  var email = local + '@' + domain;

  var el = document.getElementById('privacy-email');
  if (el) {
    var a = document.createElement('a');
    a.href = 'mai' + 'lto:' + email + '?subject=来自%20Haokun%20Blog%20的访客';
    a.rel = 'noopener';
    a.textContent = 'Email: ' + email;
    el.parentNode.replaceChild(a, el);
  }
})();
</script>
