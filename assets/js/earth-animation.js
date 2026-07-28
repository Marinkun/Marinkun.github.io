const EARTH_RADIUS = 100;
const XINYANG_LAT = 32.1239;
const XINYANG_LON = 114.0672;

function latLonToVector3(lat, lon, radius) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  const x = -radius * Math.sin(phi) * Math.cos(theta);
  const y = radius * Math.cos(phi);
  const z = radius * Math.sin(phi) * Math.sin(theta);
  return new THREE.Vector3(x, y, z);
}

function initEarthAnimation() {
  const container = document.getElementById('earth-intro');
  if (!container) return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 2000);
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);

  const starGeometry = new THREE.BufferGeometry();
  const starCount = 3000;
  const starPositions = new Float32Array(starCount * 3);
  for (let i = 0; i < starCount * 3; i += 3) {
    starPositions[i] = (Math.random() - 0.5) * 2000;
    starPositions[i + 1] = (Math.random() - 0.5) * 2000;
    starPositions[i + 2] = (Math.random() - 0.5) * 2000;
  }
  starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
  const starMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 1.5, transparent: true, opacity: 0.8 });
  const stars = new THREE.Points(starGeometry, starMaterial);
  scene.add(stars);

  const earthGroup = new THREE.Group();
  scene.add(earthGroup);

  const earthGeometry = new THREE.SphereGeometry(EARTH_RADIUS, 64, 64);
  const earthCanvas = document.createElement('canvas');
  earthCanvas.width = 2048;
  earthCanvas.height = 1024;
  const earthCtx = earthCanvas.getContext('2d');
  const gradient = earthCtx.createLinearGradient(0, 0, 0, 1024);
  gradient.addColorStop(0, '#0a1628');
  gradient.addColorStop(0.3, '#0d2137');
  gradient.addColorStop(0.5, '#1a3a5c');
  gradient.addColorStop(0.7, '#0d2137');
  gradient.addColorStop(1, '#0a1628');
  earthCtx.fillStyle = gradient;
  earthCtx.fillRect(0, 0, 2048, 1024);

  for (let i = 0; i < 150; i++) {
    const x = Math.random() * 2048;
    const y = Math.random() * 1024;
    const size = Math.random() * 80 + 20;
    const landGradient = earthCtx.createRadialGradient(x, y, 0, x, y, size);
    landGradient.addColorStop(0, 'rgba(30, 80, 50, 0.6)');
    landGradient.addColorStop(0.5, 'rgba(20, 60, 40, 0.4)');
    landGradient.addColorStop(1, 'rgba(10, 40, 30, 0)');
    earthCtx.fillStyle = landGradient;
    earthCtx.fillRect(x - size, y - size, size * 2, size * 2);
  }

  for (let i = 0; i < 80; i++) {
    const x = Math.random() * 2048;
    const y = Math.random() * 1024;
    const w = Math.random() * 200 + 50;
    const h = Math.random() * 15 + 3;
    earthCtx.fillStyle = 'rgba(40, 100, 60, 0.5)';
    earthCtx.beginPath();
    earthCtx.ellipse(x, y, w, h, Math.random() * Math.PI, 0, Math.PI * 2);
    earthCtx.fill();
  }

  const earthTexture = new THREE.CanvasTexture(earthCanvas);
  const earthMaterial = new THREE.MeshPhongMaterial({
    map: earthTexture,
    bumpScale: 2,
    specular: new THREE.Color(0x333333),
    shininess: 10,
  });
  const earth = new THREE.Mesh(earthGeometry, earthMaterial);
  earthGroup.add(earth);

  const atmosphereGeometry = new THREE.SphereGeometry(EARTH_RADIUS * 1.03, 64, 64);
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
        float intensity = pow(0.65 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
        gl_FragColor = vec4(0.3, 0.6, 1.0, 1.0) * intensity;
      }
    `,
    blending: THREE.AdditiveBlending,
    side: THREE.BackSide,
    transparent: true,
  });
  const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
  earthGroup.add(atmosphere);

  const markerPosition = latLonToVector3(XINYANG_LAT, XINYANG_LON, EARTH_RADIUS * 1.01);
  const markerGeometry = new THREE.RingGeometry(1, 1.5, 32);
  const markerMaterial = new THREE.MeshBasicMaterial({ color: 0x00ffff, side: THREE.DoubleSide, transparent: true, opacity: 0.9 });
  const marker = new THREE.Mesh(markerGeometry, markerMaterial);
  marker.position.copy(markerPosition);
  marker.lookAt(new THREE.Vector3(0, 0, 0));
  marker.rotateZ(Math.PI / 4);
  earthGroup.add(marker);

  const pulseGeometry = new THREE.RingGeometry(0.5, 3, 32);
  const pulseMaterial = new THREE.MeshBasicMaterial({ color: 0x00ffff, side: THREE.DoubleSide, transparent: true, opacity: 0.6 });
  const pulse = new THREE.Mesh(pulseGeometry, pulseMaterial);
  pulse.position.copy(markerPosition);
  pulse.lookAt(new THREE.Vector3(0, 0, 0));
  earthGroup.add(pulse);

  const linesGeometry = new THREE.BufferGeometry();
  const lineCount = 12;
  const linePositions = [];
  for (let i = 0; i < lineCount; i++) {
    const angle = (i / lineCount) * Math.PI * 2;
    const radius = EARTH_RADIUS * 1.05;
    for (let j = 0; j < 20; j++) {
      const t = j / 20;
      const r = radius + t * 80;
      linePositions.push(
        Math.cos(angle) * r * 0.3 + markerPosition.x * (1 + t * 0.5),
        Math.sin(angle * 0.7) * r * 0.2 + markerPosition.y * (1 + t * 0.3),
        markerPosition.z * (1 + t * 0.8)
      );
    }
  }
  linesGeometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
  const linesMaterial = new THREE.PointsMaterial({ color: 0x00ffff, size: 0.5, transparent: true, opacity: 0.6 });
  const dataLines = new THREE.Points(linesGeometry, linesMaterial);
  earthGroup.add(dataLines);

  const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
  scene.add(ambientLight);
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
  directionalLight.position.set(50, 30, 50);
  scene.add(directionalLight);

  camera.position.set(0, 50, 400);

  const targetXinyang = latLonToVector3(XINYANG_LAT, XINYANG_LON, EARTH_RADIUS * 1.6);

  let animationPhase = 0;
  let phaseStartTime = 0;
  const clock = new THREE.Clock();
  let pulseScale = 1;
  let pulseDirection = 1;

  function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  function animate() {
    requestAnimationFrame(animate);
    const elapsed = clock.getElapsedTime();
    const delta = clock.getDelta();

    stars.rotation.y += 0.0001;
    stars.rotation.x += 0.00005;

    pulseScale += pulseDirection * delta * 1.5;
    if (pulseScale > 3) pulseDirection = -1;
    if (pulseScale < 1) pulseDirection = 1;
    pulse.scale.set(pulseScale, pulseScale, 1);
    pulse.material.opacity = 0.8 - (pulseScale - 1) * 0.25;

    if (animationPhase === 0) {
      earth.rotation.y += 0.002;
      if (elapsed > 1.5) {
        animationPhase = 1;
        phaseStartTime = elapsed;
      }
    } else if (animationPhase === 1) {
      const phaseDuration = 3;
      const t = Math.min((elapsed - phaseStartTime) / phaseDuration, 1);
      const eased = easeInOutCubic(t);

      const startPos = new THREE.Vector3(0, 50, 400);
      const endPos = targetXinyang.clone().multiplyScalar(2.5);
      camera.position.lerpVectors(startPos, endPos, eased);

      const startTarget = new THREE.Vector3(0, 0, 0);
      const endTarget = latLonToVector3(XINYANG_LAT, XINYANG_LON, EARTH_RADIUS);
      const lookTarget = new THREE.Vector3().lerpVectors(startTarget, endTarget, eased);
      camera.lookAt(lookTarget);

      const targetRot = -XINYANG_LON * Math.PI / 180 + Math.PI;
      earth.rotation.y = targetRot * eased;

      if (t >= 1) {
        animationPhase = 2;
        phaseStartTime = elapsed;
      }
    } else if (animationPhase === 2) {
      const phaseDuration = 2;
      const t = Math.min((elapsed - phaseStartTime) / phaseDuration, 1);
      const eased = easeInOutCubic(t);

      const startPos = targetXinyang.clone().multiplyScalar(2.5);
      const endPos = targetXinyang.clone().multiplyScalar(1.15);
      camera.position.lerpVectors(startPos, endPos, eased);

      camera.lookAt(latLonToVector3(XINYANG_LAT, XINYANG_LON, EARTH_RADIUS));

      marker.scale.set(1 + eased, 1 + eased, 1);
      dataLines.material.opacity = 0.6 * eased;

      if (t >= 1) {
        animationPhase = 3;
        phaseStartTime = elapsed;
      }
    } else if (animationPhase === 3) {
      const phaseDuration = 1;
      const t = Math.min((elapsed - phaseStartTime) / phaseDuration, 1);

      document.getElementById('earth-intro').style.opacity = 1 - t;
      document.getElementById('page-content').style.opacity = t;

      if (t >= 1) {
        document.getElementById('earth-intro').style.display = 'none';
        document.getElementById('page-content').style.position = 'relative';
        animationPhase = 4;
      }
    } else if (animationPhase === 4) {
      return;
    }

    renderer.render(scene, camera);
  }

  animate();

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initEarthAnimation);
} else {
  initEarthAnimation();
}
