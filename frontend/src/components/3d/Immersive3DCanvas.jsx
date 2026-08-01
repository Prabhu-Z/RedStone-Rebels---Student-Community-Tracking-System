import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const Immersive3DCanvas = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    // 1. Scene, Camera & Renderer Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    container.appendChild(renderer.domElement);

    // 2. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xd4af37, 2, 50);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    // 3. Galaxy/Starfield (4,000 Gold-Tinted Stars)
    const starGeometry = new THREE.BufferGeometry();
    const starCount = 3500;
    const starPos = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount * 3; i += 3) {
      starPos[i] = (Math.random() - 0.5) * 150;
      starPos[i + 1] = (Math.random() - 0.5) * 150;
      starPos[i + 2] = (Math.random() - 0.5) * 150;

      const isGold = Math.random() > 0.8;
      starColors[i] = isGold ? 0.83 : 1;
      starColors[i + 1] = isGold ? 0.68 : 1;
      starColors[i + 2] = isGold ? 0.21 : 1;
    }

    starGeometry.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    starGeometry.setAttribute('color', new THREE.BufferAttribute(starColors, 3));

    const starMaterial = new THREE.PointsMaterial({
      size: 0.15,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
    });
    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);

    // 4. Central Community Network Nodes
    const nodeGroup = new THREE.Group();
    const nodes = [];
    const nodeCount = 40;

    for (let i = 0; i < nodeCount; i++) {
      const geometry = new THREE.IcosahedronGeometry(Math.random() * 0.4 + 0.2, 0);
      const material = new THREE.MeshPhongMaterial({
        color: 0xd4af37,
        wireframe: Math.random() > 0.5,
        emissive: 0xd4af37,
        emissiveIntensity: 0.4,
        shininess: 100,
      });
      const mesh = new THREE.Mesh(geometry, material);

      mesh.position.set(
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20,
        -i * 4
      );

      mesh.userData = {
        rotationSpeed: (Math.random() - 0.5) * 0.02,
        floatOffset: Math.random() * Math.PI * 2,
        initialY: mesh.position.y,
      };

      nodeGroup.add(mesh);
      nodes.push(mesh);
    }
    scene.add(nodeGroup);

    // 5. Connecting Lines (Single LineSegments Draw Call for Performance)
    const linePositions = [];
    for (let i = 0; i < nodes.length - 1; i++) {
      linePositions.push(nodes[i].position.x, nodes[i].position.y, nodes[i].position.z);
      linePositions.push(nodes[i + 1].position.x, nodes[i + 1].position.y, nodes[i + 1].position.z);
    }
    const lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0xd4af37, transparent: true, opacity: 0.2 });
    const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(lines);

    camera.position.z = 10;

    // 6. Direct Window Scroll Listener (Zero React State Re-renders)
    let scrollTarget = 0;
    let currentScroll = 0;

    const handleScroll = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      scrollTarget = maxScroll > 0 ? window.scrollY / maxScroll : 0;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // 7. Render Loop with Delta Time
    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      // Smooth scroll interpolation (60 FPS)
      currentScroll += (scrollTarget - currentScroll) * 0.06;

      // Move camera smoothly through depth based on scroll
      camera.position.z = 10 - currentScroll * 150;
      camera.position.x = Math.sin(currentScroll * Math.PI) * 2;
      camera.position.y = Math.cos(currentScroll * Math.PI) * 1;

      camera.lookAt(0, 0, camera.position.z - 20);

      // Ambient rotations
      stars.rotation.y = elapsedTime * 0.02;
      stars.rotation.x = elapsedTime * 0.01;

      // Node animation & emissive pulsing
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        node.rotation.x += node.userData.rotationSpeed;
        node.rotation.y += node.userData.rotationSpeed;

        node.position.y = node.userData.initialY + Math.sin(elapsedTime + node.userData.floatOffset) * 0.2;

        const dist = Math.abs(node.position.z - camera.position.z);
        if (dist < 15) {
          node.material.emissiveIntensity = 0.8 + Math.sin(elapsedTime * 5) * 0.2;
        } else {
          node.material.emissiveIntensity = 0.3;
        }
      }

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth || window.innerWidth;
      const newHeight = container.clientHeight || window.innerHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      starGeometry.dispose();
      starMaterial.dispose();
      lineGeometry.dispose();
      lineMaterial.dispose();
      renderer.dispose();
    };
  }, []); // Run ONCE on mount for 60 FPS performance!

  return <div ref={mountRef} className="fixed inset-0 w-full h-full z-0 bg-transparent pointer-events-none" />;
};

export default Immersive3DCanvas;
