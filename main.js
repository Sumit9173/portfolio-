/* ============================================================
   main.js — All JavaScript for Sumit Ojha Portfolio
   Three.js 3D hero & background scenes + scroll reveal + UI
============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // LOADER ANIMATION (CAPPED AT 2.0s MAX)
  // ==========================================
  const loader = document.getElementById('loader');
  const LOADER_TARGET_TIME = 1800; // Target display time ~1.8s for visual feedback
  const loadStartTime = Date.now();

  function hideLoader() {
    if (loader && !loader.classList.contains('hidden')) {
      loader.classList.add('hidden');
      startHeroReveal();
    }
  }

  // Safety cap at 2.0s maximum regardless of page load speed
  const loaderSafetyCap = setTimeout(hideLoader, 2000);

  window.addEventListener('load', () => {
    const elapsed = Date.now() - loadStartTime;
    const remaining = Math.max(0, LOADER_TARGET_TIME - elapsed);
    setTimeout(() => {
      clearTimeout(loaderSafetyCap);
      hideLoader();
    }, Math.min(remaining, Math.max(0, 2000 - elapsed)));
  });

  // ==========================================
  // CUSTOM CURSOR
  // ==========================================
  const cursor = document.getElementById('cursor');
  const follower = document.getElementById('cursor-follower');
  let mx = 0, my = 0, fx = 0, fy = 0;

  if (cursor && follower) {
    document.addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY;
      cursor.style.left = mx + 'px';
      cursor.style.top = my + 'px';
    });

    function animateCursor() {
      fx += (mx - fx) * 0.12;
      fy += (my - fy) * 0.12;
      follower.style.left = fx + 'px';
      follower.style.top = fy + 'px';
      requestAnimationFrame(animateCursor);
    }
    animateCursor();

    document.querySelectorAll('a, button, .project-card, .skill-card, .tilt-card, .lang-card, .edu-card').forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('cursor-expanded'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-expanded'));
    });
  }

  // ==========================================
  // NAVBAR SCROLL
  // ==========================================
  const navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 60);
    });
  }

  // ==========================================
  // HAMBURGER MENU & MOBILE OVERLAY
  // ==========================================
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileClose = document.getElementById('mobileClose');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      mobileMenu.classList.toggle('open');
    });

    if (mobileClose) {
      mobileClose.addEventListener('click', () => {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('open');
      });
    }

    document.querySelectorAll('.mobile-link').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('open');
      });
    });
  }

  // ==========================================
  // SCROLL REVEAL (INTERSECTION OBSERVER)
  // ==========================================
  const revealEls = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = entry.target.style.animationDelay || '0s';
        const ms = parseFloat(delay) * 1000;
        setTimeout(() => entry.target.classList.add('revealed'), ms);
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealEls.forEach(el => revealObserver.observe(el));

  // ==========================================
  // COUNTER ANIMATION
  // ==========================================
  const statNums = document.querySelectorAll('.stat-num');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = +entry.target.dataset.val;
        let count = 0;
        const step = Math.ceil(target / 60);
        const timer = setInterval(() => {
          count += step;
          if (count >= target) { count = target; clearInterval(timer); }
          entry.target.textContent = count;
        }, 25);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  statNums.forEach(el => counterObserver.observe(el));

  // ==========================================
  // SKILL BAR ANIMATION
  // ==========================================
  const skillFills = document.querySelectorAll('.skill-fill');
  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.width = entry.target.dataset.width + '%';
        skillObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  skillFills.forEach(fill => skillObserver.observe(fill));

  // ==========================================
  // 3D CARD TILT
  // ==========================================
  document.querySelectorAll('.tilt-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(600px) rotateX(${-y * 10}deg) rotateY(${x * 10}deg) scale(1.02)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(600px) rotateX(0) rotateY(0) scale(1)';
    });
  });

  // ==========================================
  // HERO REVEAL ANIMATION
  // ==========================================
  function startHeroReveal() {
    const heroEls = document.querySelectorAll('#hero .reveal-up, #hero .reveal-right');
    heroEls.forEach((el, i) => {
      setTimeout(() => el.classList.add('revealed'), 150 + i * 100);
    });
  }

  // ==========================================
  // EMAILJS — LIVE CREDENTIALS
  // ==========================================
  const EMAILJS_PUBLIC_KEY  = 'U3XojJFiS4mGatqjd';
  const EMAILJS_SERVICE_ID  = 'service_8yrsbz7';
  const EMAILJS_TEMPLATE_ID = 'template_8m4pz0f';

  if (typeof emailjs !== 'undefined') {
    emailjs.init(EMAILJS_PUBLIC_KEY);
  }

  // ==========================================
  // CONTACT FORM — EMAILJS SEND
  // ==========================================
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', e => {
      e.preventDefault();

      const btn     = document.getElementById('submitBtn');
      const note    = document.getElementById('formNote');
      const btnText = btn.querySelector('.btn-text');
      const loader  = btn.querySelector('.btn-loader');

      const templateParams = {
        from_name:  document.getElementById('formName').value.trim(),
        from_email: document.getElementById('formEmail').value.trim(),
        subject:    document.getElementById('formSubject').value.trim() || 'Portfolio Contact',
        message:    document.getElementById('formMessage').value.trim(),
      };

      btn.disabled = true;
      btnText.style.display = 'none';
      loader.style.display  = 'inline';
      note.textContent = '';
      note.className = 'form-note';

      emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams)
        .then(() => {
          note.textContent = '✅ Message sent successfully! I\'ll get back to you soon.';
          note.className = 'form-note form-note--success';
          contactForm.reset();
          setTimeout(() => {
            note.textContent = '';
            note.className = 'form-note';
          }, 6000);
        })
        .catch(err => {
          console.error('[EmailJS] Send failed. Full error object:', err);
          console.error('Status:', err ? err.status : '', '| Text:', err ? err.text : '');
          note.textContent = '❌ Something went wrong. Please email me directly at ojhasumit677@gmail.com';
          note.className = 'form-note form-note--error';
        })
        .finally(() => {
          btn.disabled = false;
          btnText.style.display = 'inline';
          loader.style.display  = 'none';
        });
    });
  }

  // ==========================================
  // RESUME DOWNLOAD HANDLER & ERROR LOGGING
  // ==========================================
  const resumeBtn = document.getElementById('resumeDownloadBtn');
  if (resumeBtn) {
    resumeBtn.addEventListener('click', () => {
      const resumeUrl = resumeBtn.getAttribute('href') || 'resume.pdf';
      fetch(resumeUrl, { method: 'HEAD' })
        .then(response => {
          if (!response.ok) {
            console.error(`[Resume Download Error] File "${resumeUrl}" returned HTTP status: ${response.status} ${response.statusText}`);
          }
        })
        .catch(err => {
          console.error(`[Resume Download Error] Failed to fetch or verify "${resumeUrl}":`, err);
        });
    });
  }

  // ==========================================
  // THREE.JS SCENES INITIALIZATION
  // ==========================================
  initHeroScene();
  initAboutScene();
  initContactScene();

}); // End DOMContentLoaded


// ============================================================
// THREE.JS HERO 3D SCENE (ROTATING TORUS KNOT / ICOSAHEDRON + MOUSE PARALLAX)
// ============================================================
function initHeroScene() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(canvas.clientWidth, canvas.clientHeight);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(65, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
  camera.position.z = 24;

  // Root group for mouse tilt parallax
  const heroGroup = new THREE.Group();
  scene.add(heroGroup);

  // Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
  scene.add(ambientLight);

  const tealLight = new THREE.PointLight(0x00E5C7, 4, 60);
  tealLight.position.set(15, 15, 15);
  scene.add(tealLight);

  const violetLight = new THREE.PointLight(0x7C6FFF, 4, 60);
  violetLight.position.set(-15, -15, 10);
  scene.add(violetLight);

  // --- MAIN 3D OBJECT: DUAL MESH CENTERPIECE ---
  // Outer Wireframe Icosahedron
  const outerGeo = new THREE.IcosahedronGeometry(7, 2);
  const outerMat = new THREE.MeshBasicMaterial({
    color: 0x00E5C7,
    wireframe: true,
    transparent: true,
    opacity: 0.32,
  });
  const outerMesh = new THREE.Mesh(outerGeo, outerMat);
  heroGroup.add(outerMesh);

  // Inner TorusKnot in Soft Violet
  const innerGeo = new THREE.TorusKnotGeometry(4.2, 1.2, 120, 20, 2, 3);
  const innerMat = new THREE.MeshStandardMaterial({
    color: 0x7C6FFF,
    emissive: 0x3d3580,
    roughness: 0.2,
    metalness: 0.8,
    wireframe: true,
    transparent: true,
    opacity: 0.75,
  });
  const innerMesh = new THREE.Mesh(innerGeo, innerMat);
  heroGroup.add(innerMesh);

  // Vertex Glowing Dots
  const pointsGeo = new THREE.IcosahedronGeometry(7.1, 2);
  const pointsMat = new THREE.PointsMaterial({
    color: 0x00E5C7,
    size: 0.22,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending,
  });
  const pointsMesh = new THREE.Points(pointsGeo, pointsMat);
  heroGroup.add(pointsMesh);

  // --- BACKGROUND PARTICLE FIELD ---
  const isMobile = window.innerWidth < 768;
  const particleCount = isMobile ? 50 : 140;
  const positions = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount; i++) {
    positions[i * 3]     = (Math.random() - 0.5) * 80;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 60;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 40 - 15;
  }
  const particleGeo = new THREE.BufferGeometry();
  particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const particleMat = new THREE.PointsMaterial({
    color: 0x00E5C7,
    size: isMobile ? 0.16 : 0.2,
    transparent: true,
    opacity: 0.5,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  const particles = new THREE.Points(particleGeo, particleMat);
  scene.add(particles);

  // Scale down on smaller screens
  function handleScale() {
    const w = window.innerWidth;
    const scaleFactor = w < 480 ? 0.42 : (w < 768 ? 0.52 : 0.85);
    heroGroup.scale.set(scaleFactor, scaleFactor, scaleFactor);
  }
  handleScale();

  // Mouse Parallax Target
  let mouseX = 0, mouseY = 0;
  let targetX = 0, targetY = 0;
  document.addEventListener('mousemove', e => {
    mouseX = (e.clientX / window.innerWidth - 0.5);
    mouseY = (e.clientY / window.innerHeight - 0.5);
  });

  // Tab Visibility Check (pause rendering when tab is inactive)
  let isTabActive = true;
  document.addEventListener('visibilitychange', () => {
    isTabActive = !document.hidden;
  });

  // Resize listener
  function onResize() {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
    handleScale();
  }
  window.addEventListener('resize', onResize);

  // Render Loop
  const clock = new THREE.Clock();
  function animate() {
    requestAnimationFrame(animate);
    if (!isTabActive) return;

    const t = clock.getElapsedTime();

    // Auto rotations
    outerMesh.rotation.y = t * 0.12;
    outerMesh.rotation.x = Math.sin(t * 0.08) * 0.15;

    innerMesh.rotation.y = -t * 0.18;
    innerMesh.rotation.z = t * 0.1;

    pointsMesh.rotation.y = t * 0.12;
    pointsMesh.rotation.x = Math.sin(t * 0.08) * 0.15;

    // Particle drift
    particles.rotation.y = t * 0.015;

    // Mouse Parallax smoothly lerped
    targetX = mouseX * 0.5;
    targetY = -mouseY * 0.3;
    heroGroup.rotation.y += (targetX - heroGroup.rotation.y) * 0.05;
    heroGroup.rotation.x += (targetY - heroGroup.rotation.x) * 0.05;

    // Light pulse
    tealLight.intensity = 3.5 + Math.sin(t * 1.5) * 1.0;
    violetLight.intensity = 3.5 + Math.cos(t * 1.2) * 1.0;

    renderer.render(scene, camera);
  }
  animate();
}

// ============================================================
// THREE.JS ABOUT SCENE
// ============================================================
function initAboutScene() {
  const canvas = document.getElementById('aboutCanvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(canvas.clientWidth, canvas.clientHeight);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
  camera.position.z = 12;

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
  scene.add(ambientLight);

  const pLight = new THREE.PointLight(0x00E5C7, 4, 40);
  pLight.position.set(5, 5, 8);
  scene.add(pLight);

  const pLight2 = new THREE.PointLight(0x7C6FFF, 3, 30);
  pLight2.position.set(-5, -5, 5);
  scene.add(pLight2);

  const knotGeo = new THREE.TorusKnotGeometry(3, 0.8, 120, 20, 2, 3);
  const knotMat = new THREE.MeshStandardMaterial({
    color: 0x151C2C, emissive: 0x221d50, roughness: 0.1, metalness: 0.9,
  });
  const knot = new THREE.Mesh(knotGeo, knotMat);
  scene.add(knot);

  const knotWireMat = new THREE.MeshStandardMaterial({
    color: 0x00E5C7, emissive: 0x00E5C7, emissiveIntensity: 0.5,
    wireframe: true, transparent: true, opacity: 0.35,
  });
  const knotWire = new THREE.Mesh(knotGeo, knotWireMat);
  scene.add(knotWire);

  let isTabActive = true;
  document.addEventListener('visibilitychange', () => { isTabActive = !document.hidden; });

  function onResize() {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  }
  window.addEventListener('resize', onResize);

  let clock = new THREE.Clock();
  function animate() {
    requestAnimationFrame(animate);
    if (!isTabActive) return;
    const t = clock.getElapsedTime();
    knot.rotation.x = t * 0.2;
    knot.rotation.y = t * 0.15;
    knotWire.rotation.x = -t * 0.15;
    knotWire.rotation.y = t * 0.2;
    pLight.intensity = 3.5 + Math.sin(t * 2) * 1;
    renderer.render(scene, camera);
  }
  animate();
}

// ============================================================
// THREE.JS CONTACT SCENE
// ============================================================
function initContactScene() {
  const canvas = document.getElementById('contactCanvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(canvas.clientWidth, canvas.clientHeight);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 200);
  camera.position.z = 30;

  const pLight = new THREE.PointLight(0x00E5C7, 2, 80);
  pLight.position.set(10, 10, 20);
  scene.add(pLight);

  const count = window.innerWidth < 768 ? 120 : 400;
  const pos = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    pos[i*3]   = (Math.random()-0.5) * 100;
    pos[i*3+1] = (Math.random()-0.5) * 60;
    pos[i*3+2] = (Math.random()-0.5) * 40 - 20;
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const mat = new THREE.PointsMaterial({ color: 0x00E5C7, size: 0.2, transparent: true, opacity: 0.4, blending: THREE.AdditiveBlending, depthWrite: false });
  const pts = new THREE.Points(geo, mat);
  scene.add(pts);

  let isTabActive = true;
  document.addEventListener('visibilitychange', () => { isTabActive = !document.hidden; });

  function onResize() {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  }
  window.addEventListener('resize', onResize);

  let clock = new THREE.Clock();
  function animate() {
    requestAnimationFrame(animate);
    if (!isTabActive) return;
    const t = clock.getElapsedTime();
    pts.rotation.y = t * 0.01;
    pts.rotation.x = Math.sin(t * 0.05) * 0.1;
    renderer.render(scene, camera);
  }
  animate();
}
