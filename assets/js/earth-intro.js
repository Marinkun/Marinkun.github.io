(function() {
  const introContainer = document.getElementById('earth-intro');
  if (!introContainer) return;

  const hasVisited = sessionStorage.getItem('earthIntroDone');
  if (hasVisited) {
    introContainer.style.display = 'none';
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
    return;
  }

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 2000);
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  introContainer.appendChild(renderer.domElement);

  const EARTH_RADIUS = 100;
  const XINYANG_LAT = 32.1239;
  const XINYANG_LON = 114.0672;

  function latLonToVec3(lat, lon, r) {
    const phi = (90 - lat) * Math.PI / 180;
    const theta = (lon + 180) * Math.PI / 180;
    return new THREE.Vector3(
      -r * Math.sin(phi) * Math.cos(theta),
      r * Math.cos(phi),
      r * Math.sin(phi) * Math.sin(theta)
    );
  }

  const starGeo = new THREE.BufferGeometry();
  const starCount = 3000;
  const starPos = new Float32Array(starCount * 3);
  for (let i = 0; i < starCount * 3; i += 3) {
    starPos[i] = (Math.random() - 0.5) * 2000;
    starPos[i + 1] = (Math.random() - 0.5) * 2000;
    starPos[i + 2] = (Math.random() - 0.5) * 2000;
  }
  starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
  const stars = new THREE.Points(starGeo, new THREE.PointsMaterial({ color: 0xffffff, size: 1.2, transparent: true, opacity: 0.8 }));
  scene.add(stars);

  const earthGroup = new THREE.Group();
  scene.add(earthGroup);

  const earthGeo = new THREE.SphereGeometry(EARTH_RADIUS, 64, 64);

  const texCanvas = document.createElement('canvas');
  texCanvas.width = 2048;
  texCanvas.height = 1024;
  const tctx = texCanvas.getContext('2d');
  const grad = tctx.createLinearGradient(0, 0, 0, 1024);
  grad.addColorStop(0, '#0a1628');
  grad.addColorStop(0.3, '#0d2137');
  grad.addColorStop(0.5, '#1a3a5c');
  grad.addColorStop(0.7, '#0d2137');
  grad.addColorStop(1, '#0a1628');
  tctx.fillStyle = grad;
  tctx.fillRect(0, 0, 2048, 1024);

  for (let i = 0; i < 150; i++) {
    const x = Math.random() * 2048;
    const y = Math.random() * 1024;
    const r = Math.random() * 80 + 20;
    const g = tctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, 'rgba(30, 80, 50, 0.6)');
    g.addColorStop(1, 'rgba(10, 40, 30, 0)');
    tctx.fillStyle = g;
    tctx.fillRect(x - r, y - r, r * 2, r * 2);
  }

  for (let i = 0; i < 80; i++) {
    const x = Math.random() * 2048;
    const y = Math.random() * 1024;
    tctx.fillStyle = 'rgba(40, 100, 60, 0.5)';
    tctx.beginPath();
    tctx.ellipse(x, y, Math.random() * 200 + 50, Math.random() * 15 + 3, Math.random() * Math.PI, 0, Math.PI * 2);
    tctx.fill();
  }

  const earthTex = new THREE.CanvasTexture(texCanvas);
  const earth = new THREE.Mesh(earthGeo, new THREE.MeshPhongMaterial({ map: earthTex, shininess: 10 }));
  earthGroup.add(earth);

  const atmoGeo = new THREE.SphereGeometry(EARTH_RADIUS * 1.08, 64, 64);
  const atmoMat = new THREE.ShaderMaterial({
    vertexShader: 'varying vec3 vN;void main(){vN=normalize(normalMatrix*normal);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
    fragmentShader: 'varying vec3 vN;void main(){float i=pow(0.65-dot(vN,vec3(0.,0.,1.)),2.);gl_FragColor=vec4(0.,1.,1.,1.)*i;}',
    blending: THREE.AdditiveBlending,
    side: THREE.BackSide,
    transparent: true,
  });
  earthGroup.add(new THREE.Mesh(atmoGeo, atmoMat));

  const markerPos = latLonToVec3(XINYANG_LAT, XINYANG_LON, EARTH_RADIUS * 1.01);
  const markerGeo = new THREE.RingGeometry(1, 1.8, 32);
  const marker = new THREE.Mesh(markerGeo, new THREE.MeshBasicMaterial({ color: 0x00ffff, side: THREE.DoubleSide, transparent: true, opacity: 0.9 }));
  marker.position.copy(markerPos);
  marker.lookAt(0, 0, 0);
  marker.rotateZ(Math.PI / 4);
  earthGroup.add(marker);

  const pulseGeo = new THREE.RingGeometry(0.5, 4, 32);
  const pulse = new THREE.Mesh(pulseGeo, new THREE.MeshBasicMaterial({ color: 0x00ffff, side: THREE.DoubleSide, transparent: true, opacity: 0.5 }));
  pulse.position.copy(markerPos);
  pulse.lookAt(0, 0, 0);
  earthGroup.add(pulse);

  scene.add(new THREE.AmbientLight(0x404040, 0.5));
  const dlight = new THREE.DirectionalLight(0xffffff, 1.2);
  dlight.position.set(50, 30, 50);
  scene.add(dlight);

  const targetPos = latLonToVec3(XINYANG_LAT, XINYANG_LON, EARTH_RADIUS * 1.5);
  camera.position.set(0, 80, 500);

  let phase = 0;
  let phaseStart = 0;
  const clock = new THREE.Clock();
  let pulseScale = 1;
  let pulseDir = 1;

  function ease(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  function animate() {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();
    const d = clock.getDelta();

    stars.rotation.y += 0.0002;

    pulseScale += pulseDir * d * 2;
    if (pulseScale > 4) pulseDir = -1;
    if (pulseScale < 1) pulseDir = 1;
    pulse.scale.set(pulseScale, pulseScale, 1);
    pulse.material.opacity = 0.7 - (pulseScale - 1) * 0.2;

    if (phase === 0) {
      earth.rotation.y += 0.003;
      if (t > 1) { phase = 1; phaseStart = t; }
    } else if (phase === 1) {
      const dur = 3;
      const p = Math.min((t - phaseStart) / dur, 1);
      const e = ease(p);

      const sp = new THREE.Vector3(0, 80, 500);
      const ep = targetPos.clone().multiplyScalar(3);
      camera.position.lerpVectors(sp, ep, e);
      camera.lookAt(new THREE.Vector3().lerpVectors(new THREE.Vector3(0, 0, 0), latLonToVec3(XINYANG_LAT, XINYANG_LON, EARTH_RADIUS), e));

      earth.rotation.y = (-XINYANG_LON * Math.PI / 180 + Math.PI) * e;

      if (p >= 1) { phase = 2; phaseStart = t; }
    } else if (phase === 2) {
      const dur = 2;
      const p = Math.min((t - phaseStart) / dur, 1);
      const e = ease(p);

      camera.position.lerp(targetPos.clone().multiplyScalar(1.2), e);
      camera.lookAt(latLonToVec3(XINYANG_LAT, XINYANG_LON, EARTH_RADIUS));

      marker.scale.set(1 + e, 1 + e, 1);

      if (p >= 1) { phase = 3; phaseStart = t; }
    } else if (phase === 3) {
      const dur = 1.2;
      const p = Math.min((t - phaseStart) / dur, 1);

      introContainer.style.opacity = 1 - p;

      if (p >= 1) {
        phase = 4;
        introContainer.style.display = 'none';
        introContainer.classList.add('hidden');
        sessionStorage.setItem('earthIntroDone', '1');

        const reveals = document.querySelectorAll('.reveal');
        reveals.forEach((el, i) => {
          setTimeout(() => el.classList.add('visible'), i * 100);
        });
      }
    } else if (phase === 4) {
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
})();
