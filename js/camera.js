(() => {
  window.mountScrollCamera = () => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const host = document.createElement('div');
    host.className = 'scroll-camera';
    host.setAttribute('aria-hidden', 'true');
    document.body.append(host);

    try {
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 40);
      camera.position.set(0, 0, 7);

      const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(host.clientWidth, host.clientHeight);
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      host.append(renderer.domElement);

      scene.add(new THREE.AmbientLight(0xffffff, 2.1));
      const keyLight = new THREE.DirectionalLight(0xffe2ad, 3.4);
      keyLight.position.set(-3, 4, 6);
      scene.add(keyLight);
      const rimLight = new THREE.PointLight(0x52c7ad, 18, 12);
      rimLight.position.set(3, 1, -2);
      scene.add(rimLight);

      const cameraGroup = new THREE.Group();
      scene.add(cameraGroup);
      const bodyShape = new THREE.Shape();
      const left = -0.95, right = 0.95, bottom = -0.62, top = 0.62, radius = 0.16;
      bodyShape.moveTo(left + radius, bottom);
      bodyShape.lineTo(right - radius, bottom);
      bodyShape.quadraticCurveTo(right, bottom, right, bottom + radius);
      bodyShape.lineTo(right, top - radius);
      bodyShape.quadraticCurveTo(right, top, right - radius, top);
      bodyShape.lineTo(left + radius, top);
      bodyShape.quadraticCurveTo(left, top, left, top - radius);
      bodyShape.lineTo(left, bottom + radius);
      bodyShape.quadraticCurveTo(left, bottom, left + radius, bottom);

      const body = new THREE.Mesh(
        new THREE.ExtrudeGeometry(bodyShape, { depth: 0.58, bevelEnabled: true, bevelSegments: 3, bevelSize: 0.06, bevelThickness: 0.06 }),
        new THREE.MeshStandardMaterial({ color: 0x11110f, roughness: 0.32, metalness: 0.36 })
      );
      body.position.z = -0.29;
      cameraGroup.add(body);

      const darkMetal = new THREE.MeshStandardMaterial({ color: 0x173d3b, metalness: 0.72, roughness: 0.22 });
      const lensGlass = new THREE.MeshStandardMaterial({ color: 0x40a89c, metalness: 0.64, roughness: 0.12, emissive: 0x103d3b });
      const lens = new THREE.Group();
      lens.position.set(0.08, -0.02, 0.39);
      cameraGroup.add(lens);

      const accentMetal = new THREE.MeshStandardMaterial({ color: 0xd97756, metalness: 0.48, roughness: 0.24 });
      for (const [z, outer, inner, material] of [[0, 0.53, 0.45, darkMetal], [0.13, 0.44, 0.36, accentMetal], [0.26, 0.35, 0.29, darkMetal]]) {
        const ring = new THREE.Mesh(new THREE.TorusGeometry(outer, outer - inner, 12, 64), material);
        ring.position.z = z;
        lens.add(ring);
      }

      const glass = new THREE.Mesh(new THREE.CircleGeometry(0.29, 48), lensGlass);
      glass.position.z = 0.275;
      lens.add(glass);
      const glint = new THREE.Mesh(new THREE.CircleGeometry(0.12, 32), new THREE.MeshBasicMaterial({ color: 0xbce9db, transparent: true, opacity: 0.8 }));
      glint.position.set(-0.09, 0.12, 0.29);
      lens.add(glint);

      const topDial = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.12, 32), darkMetal);
      topDial.position.set(-0.56, 0.69, -0.01);
      cameraGroup.add(topDial);
      const shutter = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.11, 0.1, 24), new THREE.MeshStandardMaterial({ color: 0xd97756, metalness: 0.28, roughness: 0.4 }));
      shutter.position.set(0.43, 0.69, 0.02);
      cameraGroup.add(shutter);

      const resize = () => {
        const width = host.clientWidth;
        const height = host.clientHeight;
        if (!width || !height) return;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
      };
      const resizeObserver = new ResizeObserver(resize);
      resizeObserver.observe(host);

      let frame = 0;
      let scrollProgress = 0;
      const updateScroll = () => {
        const range = document.documentElement.scrollHeight - window.innerHeight;
        scrollProgress = range > 0 ? window.scrollY / range : 0;
        const travel = window.matchMedia('(max-width: 560px)').matches ? 20 : 38;
        host.style.transform = `translate3d(0, ${scrollProgress * travel}vh, 0)`;
        if (reducedMotion) render();
      };
      const render = () => {
        const progress = scrollProgress;
        cameraGroup.position.y = (0.53 - progress * 1.06) + Math.sin(progress * Math.PI * 4) * 0.08;
        cameraGroup.position.x = Math.sin(progress * Math.PI * 2) * 0.13;
        cameraGroup.rotation.x = -0.12 + progress * 0.26;
        cameraGroup.rotation.y = -0.32 + Math.sin(progress * Math.PI * 2) * 0.34;
        cameraGroup.rotation.z = -0.06 + progress * 0.12;
        renderer.render(scene, camera);
      };
      const animate = () => {
        render();
        frame = requestAnimationFrame(animate);
      };

      window.addEventListener('scroll', updateScroll, { passive: true });
      updateScroll();
      if (!reducedMotion) animate();
      window.addEventListener('pagehide', () => {
        cancelAnimationFrame(frame);
        resizeObserver.disconnect();
        renderer.dispose();
      }, { once: true });
    } catch (error) {
      host.remove();
      console.warn('The decorative 3D camera could not be started.', error);
    }
  };
})();
