(function () {
    'use strict';

    // Cursor — only on real mouse devices
    if (window.matchMedia('(pointer: fine)').matches) {
        var cur = document.getElementById('cur');
        var curR = document.getElementById('curR');
        var curStar = document.getElementById('curStar');
        var mx = 0, my = 0, rx = 0, ry = 0, sx = 0, sy = 0;

        document.addEventListener('mousemove', function (e) {
            mx = e.clientX; my = e.clientY;
            cur.style.left = mx + 'px'; cur.style.top = my + 'px';
        });

        (function loop() {
            rx += (mx - rx) * 0.1; ry += (my - ry) * 0.1;
            curR.style.left = rx + 'px'; curR.style.top = ry + 'px';
            sx += (mx - sx) * 0.06; sy += (my - sy) * 0.06;
            curStar.style.left = sx + 'px'; curStar.style.top = sy + 'px';
            requestAnimationFrame(loop);
        })();

        document.querySelectorAll('a, button, .proj-card, .sg-tag, .stat-cell').forEach(function (el) {
            el.addEventListener('mouseenter', function () {
                cur.classList.add('big'); curR.classList.add('big'); curStar.classList.add('show');
            });
            el.addEventListener('mouseleave', function () {
                cur.classList.remove('big'); curR.classList.remove('big'); curStar.classList.remove('show');
            });
        });
    }

    // Scroll reveal
    var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
            if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
        });
    }, { threshold: 0.05 });
    document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });

    // Active nav highlight
    var navAs = document.querySelectorAll('.nav-links a');
    var ids = ['about', 'skills', 'projects', 'contact'];
    window.addEventListener('scroll', function () {
        var cur = '';
        ids.forEach(function (id) {
            var s = document.getElementById(id);
            if (s && window.scrollY >= s.offsetTop - 140) cur = id;
        });
        navAs.forEach(function (a) {
            a.style.color = a.getAttribute('href') === '#' + cur ? 'var(--lime)' : '';
        });
    }, { passive: true });

    // Hamburger
    var btn = document.getElementById('hamburger');
    var nav = document.getElementById('mobileNav');
    function close() { nav.classList.remove('open'); btn.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); }
    btn.addEventListener('click', function () 
    {
        var o = nav.classList.toggle('open');
        btn.classList.toggle('open', o);
        btn.setAttribute('aria-expanded', String(o));
    });
    nav.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', close); });
    document.addEventListener('click', function (e) { if (!btn.contains(e.target) && !nav.contains(e.target)) close(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });

})();