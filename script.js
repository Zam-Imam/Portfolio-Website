(function () {
    'use strict';

    // -------------------------------------------------------------------------
    // CUSTOM CURSOR
    // Only runs on devices with a real mouse (not touch screens)
    // -------------------------------------------------------------------------
    if (window.matchMedia('(pointer: fine)').matches) {
        var cur = document.getElementById('cur');
        var curR = document.getElementById('curR');
        var curStar = document.getElementById('curStar');

        // Current mouse position and smoothed positions for the ring and star
        var mx = 0, my = 0, rx = 0, ry = 0, sx = 0, sy = 0;

        // Move the main cursor dot instantly to the mouse position
        document.addEventListener('mousemove', function (e) {
            mx = e.clientX;
            my = e.clientY;
            cur.style.left = mx + 'px';
            cur.style.top = my + 'px';
        });

        // Smoothly animate the ring and star to lag slightly behind the cursor
        (function loop() {
            rx += (mx - rx) * 0.1;
            ry += (my - ry) * 0.1;
            curR.style.left = rx + 'px';
            curR.style.top = ry + 'px';

            sx += (mx - sx) * 0.06;
            sy += (my - sy) * 0.06;
            curStar.style.left = sx + 'px';
            curStar.style.top = sy + 'px';

            requestAnimationFrame(loop);
        })();

        // Enlarge the cursor when hovering over interactive or highlighted elements
        var hoverDepth = 0;
        document.querySelectorAll('a, button, .proj-card, .sg-tag, .stat-cell, .contact-form-wrap').forEach(function (el) {
            el.addEventListener('mouseenter', function () {
                hoverDepth++;
                cur.classList.add('big');
                curR.classList.add('big');
                curStar.classList.add('show');
            });
            el.addEventListener('mouseleave', function () {
                hoverDepth--;
                // Only shrink back when fully outside all hover targets
                if (hoverDepth <= 0) {
                    hoverDepth = 0;
                    cur.classList.remove('big');
                    curR.classList.remove('big');
                    curStar.classList.remove('show');
                }
            });
        });
    }

    // -------------------------------------------------------------------------
    // SCROLL REVEAL
    // Adds the 'visible' class to elements with class 'reveal' when they
    // enter the viewport, triggering their fade-in CSS transition
    // -------------------------------------------------------------------------
    var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
            if (e.isIntersecting) {
                e.target.classList.add('visible');
                io.unobserve(e.target); // Stop watching once revealed
            }
        });
    }, { threshold: 0.05 });

    document.querySelectorAll('.reveal').forEach(function (el) {
        io.observe(el);
    });

    // -------------------------------------------------------------------------
    // NAV HIGHLIGHT ON SCROLL
    // Highlights the active nav link based on which section is currently in view
    // -------------------------------------------------------------------------
    var navAs = document.querySelectorAll('.nav-links a');
    var ids = ['about', 'skills', 'projects', 'contact'];

    window.addEventListener('scroll', function () {
        var current = '';
        ids.forEach(function (id) {
            var section = document.getElementById(id);
            if (section && window.scrollY >= section.offsetTop - 140) current = id;
        });
        navAs.forEach(function (a) {
            a.style.color = a.getAttribute('href') === '#' + current ? 'var(--lime)' : '';
        });
    }, { passive: true });

    // -------------------------------------------------------------------------
    // MOBILE HAMBURGER MENU
    // Toggles the mobile nav drawer open/closed
    // -------------------------------------------------------------------------
    var btn = document.getElementById('hamburger');
    var nav = document.getElementById('mobileNav');

    // Close the mobile menu and reset button state
    function close() {
        nav.classList.remove('open');
        btn.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
    }

    // Toggle open/closed when the hamburger button is clicked
    btn.addEventListener('click', function () {
        var isOpen = nav.classList.toggle('open');
        btn.classList.toggle('open', isOpen);
        btn.setAttribute('aria-expanded', String(isOpen));
    });

    // Close the menu when any nav link inside it is clicked
    nav.querySelectorAll('a').forEach(function (a) {
        a.addEventListener('click', close);
    });

    // Close the menu when clicking anywhere outside of it
    document.addEventListener('click', function (e) {
        if (!btn.contains(e.target) && !nav.contains(e.target)) close();
    });

    // Close the menu when the Escape key is pressed
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') close();
    });

    // -------------------------------------------------------------------------
    // CONTACT FORM
    // Sends form data via EmailJS without needing a backend server
    // Replace these keys with your own from emailjs.com if you fork this project
    // -------------------------------------------------------------------------
    var EMAILJS_PUBLIC_KEY = 'hZBSvociWlftrIVDM';
    var EMAILJS_SERVICE_ID = 'service_bmmvi2q';
    var EMAILJS_TEMPLATE_ID = 'template_m1o8flg';

    // Set up EmailJS with the public key
    if (typeof emailjs !== 'undefined') {
        emailjs.init(EMAILJS_PUBLIC_KEY);
    }

    var form = document.getElementById('contactForm');
    var submitBtn = document.getElementById('cf-submit');
    var statusEl = document.getElementById('cf-status');

    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();

            var name = document.getElementById('cf-name').value.trim();
            var email = document.getElementById('cf-email').value.trim();
            var message = document.getElementById('cf-message').value.trim();

            // Make sure all fields are filled in
            if (!name || !email || !message) {
                showStatus('Please fill in all fields.', 'error');
                return;
            }

            // Basic email format check
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                showStatus('Please enter a valid email address.', 'error');
                return;
            }

            // Make sure the EmailJS script loaded correctly
            if (typeof emailjs === 'undefined') {
                showStatus('Email service not loaded. Please refresh and try again.', 'error');
                return;
            }

            // Show the loading state on the button while sending
            submitBtn.classList.add('loading');
            statusEl.className = 'form-status';
            statusEl.textContent = '';

            // Send the email using EmailJS
            emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
                from_name: name,
                from_email: email,
                message: message
            }).then(function () {
                submitBtn.classList.remove('loading');
                showStatus('Message sent successfully! Check your inbox.', 'success');
                form.reset();
            }, function (err) {
                submitBtn.classList.remove('loading');
                console.error('EmailJS error:', err);
                var errMsg = (err && err.text) ? err.text : 'Unknown error';
                showStatus('Error: ' + errMsg, 'error');
            });
        });
    }

    // Show a status message below the submit button
    function showStatus(msg, type) {
        statusEl.textContent = msg;
        statusEl.className = 'form-status ' + type;
    }
})();