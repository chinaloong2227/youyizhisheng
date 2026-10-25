/* ============================================================
   友谊之声 · 首页英雄区动态画布
   原理（教学点）：
     - 用 <canvas> 画一层「粒子流动网络 + 金色涟漪」，营造现代科技感
     - 纯原生 JS，零依赖；用 requestAnimationFrame 做动画循环
     - 适配高分屏(devicePixelRatio)、窗口缩放、标签隐藏暂停
     - 尊重系统「减少动态效果」偏好：开启时只画一帧静态图
   想调风格？改下面的 BLUE / GOLD 与粒子数量即可。
   ============================================================ */
(function () {
  var canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');

  var reduceMotion = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var dpr = Math.min(window.devicePixelRatio || 1, 2);
  var W = 0, H = 0;
  var particles = [];
  var ripples = [];
  var BLUE = [27, 58, 107];   // 品牌深蓝
  var GOLD = [201, 162, 39];  // 品牌金
  var LINK_DIST = 120;        // 粒子连线的最大距离

  function rgba(c, a) {
    return 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',' + a + ')';
  }

  function resize() {
    var rect = canvas.getBoundingClientRect();
    W = rect.width;
    H = rect.height;
    canvas.width = Math.floor(W * dpr);
    canvas.height = Math.floor(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    initParticles();
  }

  function initParticles() {
    // 粒子数量随面积自适应，移动端更少、桌面端更多
    var count = Math.max(26, Math.min(70, Math.round(W * H / 13000)));
    particles = [];
    for (var i = 0; i < count; i++) {
      var gold = Math.random() < 0.22;
      particles.push({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.28,
        vy: (Math.random() - 0.5) * 0.28,
        r: gold ? 1.5 + Math.random() * 1.4 : 1.1 + Math.random() * 1.1,
        c: gold ? GOLD : BLUE
      });
    }
  }

  function spawnRipple() {
    if (ripples.length >= 6) return;
    ripples.push({
      x: Math.random() * W,
      y: Math.random() * H,
      r: 0,
      max: 60 + Math.random() * 120,
      a: 0.5
    });
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // 1) 更新粒子位置
    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;
    }

    // 2) 近距离粒子连线（蓝色细线，越近越亮）
    for (var i = 0; i < particles.length; i++) {
      for (var j = i + 1; j < particles.length; j++) {
        var a = particles[i], b = particles[j];
        var dx = a.x - b.x, dy = a.y - b.y;
        var d = Math.sqrt(dx * dx + dy * dy);
        if (d < LINK_DIST) {
          var alpha = (1 - d / LINK_DIST) * 0.14;
          ctx.strokeStyle = rgba(BLUE, alpha);
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    // 3) 画粒子点
    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];
      ctx.fillStyle = rgba(p.c, 0.6);
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }

    // 4) 画金色涟漪（呼应太极 logo 的波纹）
    for (var k = ripples.length - 1; k >= 0; k--) {
      var rp = ripples[k];
      rp.r += 0.9;
      rp.a *= 0.985;
      if (rp.a < 0.02 || rp.r > rp.max) {
        ripples.splice(k, 1);
        continue;
      }
      ctx.strokeStyle = rgba(GOLD, rp.a);
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.arc(rp.x, rp.y, rp.r, 0, Math.PI * 2);
      ctx.stroke();
    }
  }

  var raf = null;
  function loop() {
    draw();
    raf = requestAnimationFrame(loop);
  }

  resize();
  window.addEventListener('resize', resize);

  if (reduceMotion) {
    draw(); // 仅静态一帧
  } else {
    setInterval(spawnRipple, 1600);
    loop();
    // 标签页隐藏时暂停，省电
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) {
        if (raf) cancelAnimationFrame(raf);
      } else {
        loop();
      }
    });
  }
})();
