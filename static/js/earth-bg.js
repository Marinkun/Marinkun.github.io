(function() {
  const container = document.getElementById('earth-bg');
  if (!container) return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 2000);
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);

  const starGeometry = new THREE.BufferGeometry();
  const starCount = 2000;
  const positions = new Float32Array(starCount * 3);
  const sizes = new Float32Array(starCount);

  for (let i = 0; i < starCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 2000;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 2000;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 2000;
    sizes[i] = Math.random() * 2 + 0.5;
  }

  starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  starGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

  const starMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 1,
    transparent: true,
    opacity: 0.6,
    sizeAttenuation: true
  });

  const stars = new THREE.Points(starGeometry, starMaterial);
  scene.add(stars);

  const earthGroup = new THREE.Group();
  earthGroup.position.set(0, -120, -300);
  scene.add(earthGroup);

  const EARTH_RADIUS = 100;

  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  const bgGrad = ctx.createLinearGradient(0, 0, 0, 512);
  bgGrad.addColorStop(0, '#0a1628');
  bgGrad.addColorStop(0.5, '#0d2847');
  bgGrad.addColorStop(1, '#0a1628');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 1024, 512);

  for (let i = 0; i < 100; i++) {
    const x = Math.random() * 1024;
    const y = Math.random() * 512;
    const r = Math.random() * 60 + 15;
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, 'rgba(20, 70, 50, 0.7)');
    g.addColorStop(0.6, 'rgba(15, 50, 40, 0.5)');
    g.addColorStop(1, 'rgba(10, 30, 25, 0)');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  for (let i = 0; i < 50; i++) {
    const x = Math.random() * 1024;
    const y = Math.random() * 512;
    const w = Math.random() * 150 + 40;
    const h = Math.random() * 12 + 2;
    ctx.fillStyle = 'rgba(30, 80, 55, 0.6)';
    ctx.beginPath();
    ctx.ellipse(x, y, w, h, Math.random() * Math.PI, 0, Math.PI * 2);
    ctx.fill();
  }

  const gridCanvas = document.createElement('canvas');
  gridCanvas.width = 1024;
  gridCanvas.height = 512;
  const gctx = gridCanvas.getContext('2d');
  gctx.strokeStyle = 'rgba(0, 255, 255, 0.08)';
  gctx.lineWidth = 0.5;

  for (let i = 0; i <= 24; i++) {
    const y = (i / 24) * 512;
    gctx.beginPath();
    gctx.moveTo(0, y);
    gctx.lineTo(1024, y);
    gctx.stroke();
  }

  for (let i = 0; i <= 48; i++) {
    const x = (i / 48) * 1024;
    gctx.beginPath();
    gctx.moveTo(x, 0);
    gctx.lineTo(x, 512);
    gctx.stroke();
  }

  const earthGeometry = new THREE.SphereGeometry(EARTH_RADIUS, 64, 64);
  const earthTexture = new THREE.CanvasTexture(canvas);
  const gridTexture = new THREE.CanvasTexture(gridCanvas);

  const earthMaterial = new THREE.MeshPhongMaterial({
    map: earthTexture,
    specular: new THREE.Color(0x224466),
    shininess: 15,
  });

  const earth = new THREE.Mesh(earthGeometry, earthMaterial);
  earthGroup.add(earth);

  const gridGeometry = new THREE.SphereGeometry(EARTH_RADIUS * 1.005, 64, 64);
  const gridMaterial = new THREE.MeshBasicMaterial({
    map: gridTexture,
    transparent: true,
    opacity: 0.4,
    blending: THREE.AdditiveBlending,
  });
  const gridMesh = new THREE.Mesh(gridGeometry, gridMaterial);
  earthGroup.add(gridMesh);

  const atmosphereGeometry = new THREE.SphereGeometry(EARTH_RADIUS * 1.15, 64, 64);
  const atmosphereMaterial = new THREE.ShaderMaterial({
    vertexShader: `
      varying vec3 vNormal;
      void main() {
        vNormal = normalize(normalMatrix * normal);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      varying vec3 vNormal;
      void main() {
        float intensity = pow(0.7 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.5);
        gl_FragColor = vec4(0.0, 0.8, 1.0, 1.0) * intensity;
      }
    `,
    blending: THREE.AdditiveBlending,
    side: THREE.BackSide,
    transparent: true,
  });
  const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
  earthGroup.add(atmosphere);

  const ambientLight = new THREE.AmbientLight(0x404050, 0.6);
  scene.add(ambientLight);

  const dirLight = new THREE.DirectionalLight(0xffffff, 1);
  dirLight.position.set(80, 40, 60);
  scene.add(dirLight);

  const rimLight = new THREE.PointLight(0x00ffff, 0.5, 500);
  rimLight.position.set(-80, 20, -60);
  scene.add(rimLight);

  camera.position.set(0, 50, 500);
  camera.lookAt(0, -50, -300);

  let mouseX = 0;
  let mouseY = 0;
  let targetX = 0;
  let targetY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 20;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 10;
  });

  let time = 0;

  function animate() {
    requestAnimationFrame(animate);
    time += 0.003;

    earth.rotation.y += 0.0008;
    gridMesh.rotation.y += 0.0008;

    stars.rotation.y += 0.0001;
    stars.rotation.x += 0.00005;

    targetX += (mouseX - targetX) * 0.02;
    targetY += (mouseY - targetY) * 0.02;

    earthGroup.position.y = -120 + Math.sin(time * 0.5) * 5;

    camera.position.x = targetX;
    camera.position.y = 50 + targetY;
    camera.lookAt(0, -50, -300);

    renderer.render(scene, camera);
  }

  animate();

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
})();
