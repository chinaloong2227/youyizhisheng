/* ============================================================
   友谊之声 · 商务咨询 — 交互脚本（原生 JS，无依赖）
   这里只做两件小事，方便你理解“页面行为”怎么写：
     1) 窄屏汉堡菜单的开/合
     2) 页脚年份自动填当前年份
   ============================================================ */

(function () {
  'use strict';

  // ---- 1) 汉堡菜单：点击切换展开状态 ----
  var toggle = document.querySelector('.nav-toggle');
  var links = document.querySelector('.nav-links');

  if (toggle && links) {
    toggle.addEventListener('click', function () {
      // classList.toggle 返回切换后的状态：true=展开, false=收起
      var open = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });

    // 点完任一菜单项后自动收起，体验更好
    links.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        links.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // ---- 2) 页脚年份：不用每年手动改 ----
  var year = document.getElementById('year');
  if (year) {
    year.textContent = new Date().getFullYear();
  }
})();
