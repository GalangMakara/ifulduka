import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface ThreeDCardProps {
  imageSrc: string;
}

export default function ThreeDCard({ imageSrc }: ThreeDCardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!containerRef.current || !canvasRef.current) return;

    const container = containerRef.current;
    const canvas = canvasRef.current;

    // 1. Scene, Camera, Renderer setup
    const scene = new THREE.Scene();

    const rect = container.getBoundingClientRect();
    const camera = new THREE.PerspectiveCamera(45, rect.width / rect.height, 0.1, 100);
    camera.position.set(0, 1.2, 9.5);
    camera.lookAt(0, 0.8, 0);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      preserveDrawingBuffer: true,
    });
    renderer.setSize(rect.width, rect.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // 2. Lights setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    // Dynamic key light for high-contrast shadows and specular highlights
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.5);
    keyLight.position.set(5, 5, 4);
    scene.add(keyLight);

    // Soft fill light from the opposite side
    const fillLight = new THREE.DirectionalLight(0x88ccff, 0.6);
    fillLight.position.set(-5, -3, 2);
    scene.add(fillLight);

    // 3. Card Mesh setup
    // Load ID Card texture
    const textureLoader = new THREE.TextureLoader();
    const cardTexture = textureLoader.load(imageSrc, (texture) => {
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.minFilter = THREE.LinearMipmapLinearFilter;
      texture.generateMipmaps = true;
    });

    // Create front and back textures
    // To prevent text from appearing backward on the back face, mirror wrap wrapS
    const backTexture = textureLoader.load(imageSrc, (texture) => {
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.wrapS = THREE.RepeatWrapping;
      texture.repeat.x = -1; // Mirror horizontally
    });

    // Sleek chamfered looking thick box
    const cardWidth = 2.8;
    const cardHeight = 4.4;
    const cardThickness = 0.22; // Thicker card
    const geometry = new THREE.BoxGeometry(cardWidth, cardHeight, cardThickness);

    // Materials array: [right, left, top, bottom, front, back]
    const materials = [
      new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.4, metalness: 0.6 }), // right
      new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.4, metalness: 0.6 }), // left
      new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.4, metalness: 0.6 }), // top
      new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.4, metalness: 0.6 }), // bottom
      new THREE.MeshStandardMaterial({
        map: cardTexture,
        roughness: 0.15,
        metalness: 0.1,
      }), // front (shiny gloss laminate)
      new THREE.MeshStandardMaterial({
        map: backTexture,
        roughness: 0.15,
        metalness: 0.1,
      }), // back (sleek mirrored backside)
    ];

    const cardGroup = new THREE.Group();
    const cardMesh = new THREE.Mesh(geometry, materials);
    cardGroup.add(cardMesh);

    // A small metal ring/torus at the top center of the card
    const ringGeometry = new THREE.TorusGeometry(0.14, 0.03, 8, 24);
    const ringMaterial = new THREE.MeshStandardMaterial({
      color: 0xdddddd,
      metalness: 0.9,
      roughness: 0.2,
    });
    const ringMesh = new THREE.Mesh(ringGeometry, ringMaterial);
    ringMesh.position.set(0, 2.2 + 0.08, 0); // Position torus looping through top edge
    ringMesh.rotation.y = Math.PI / 2;
    cardGroup.add(ringMesh);

    // A 3D lanyard strap loop connected from the ring (seamless closed loop)
    const lanyardPoints = [
      new THREE.Vector3(0, 2.38, 0),
      new THREE.Vector3(-0.2, 2.8, 0.1),
      new THREE.Vector3(-0.6, 4.0, 0.3),
      new THREE.Vector3(-0.9, 5.2, 0.4),
      new THREE.Vector3(-0.6, 6.4, 0.2),
      new THREE.Vector3(0, 6.9, -0.2), // arches backward over the neck
      new THREE.Vector3(0.6, 6.4, 0.2),
      new THREE.Vector3(0.9, 5.2, 0.4),
      new THREE.Vector3(0.6, 4.0, 0.3),
      new THREE.Vector3(0.2, 2.8, 0.1),
    ];
    const lanyardCurve = new THREE.CatmullRomCurve3(lanyardPoints, true); // true = closed curve
    const lanyardGeometry = new THREE.TubeGeometry(lanyardCurve, 64, 0.05, 8, true); // true = closed tube
    const lanyardMaterial = new THREE.MeshStandardMaterial({
      color: 0x52525b, // Space gray strap
      roughness: 0.85,
      metalness: 0.1,
    });
    const lanyardMesh = new THREE.Mesh(lanyardGeometry, lanyardMaterial);
    cardGroup.add(lanyardMesh);

    scene.add(cardGroup);

    // 4. Interaction variables (dragging, auto-rotation, inertia)
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    let targetRotationX = 0.2; // default slight tilt
    let targetRotationY = 0;
    const damping = 0.08;

    // Event listeners
    const handlePointerDown = (e: PointerEvent) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (!isDragging) {
        // Subtle hover tilt (parallax) when not dragging
        const bound = container.getBoundingClientRect();
        const x = (e.clientX - bound.left) / bound.width - 0.5; // -0.5 to 0.5
        const y = (e.clientY - bound.top) / bound.height - 0.5;  // -0.5 to 0.5
        targetRotationY = x * 0.8;
        targetRotationX = y * 0.8;
        return;
      }

      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;

      targetRotationY += deltaX * 0.015;
      targetRotationX += deltaY * 0.015;

      // Limit pitch to prevent card flipping upside down vertically
      targetRotationX = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, targetRotationX));

      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const handlePointerUp = () => {
      isDragging = false;
    };

    container.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);

    // 5. Animation loop
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Auto rotation on Y axis when not dragging
      if (!isDragging) {
        // Slow constant rotation
        targetRotationY += 0.006;
      }

      // Smooth interpolation (damping/inertia)
      cardGroup.rotation.y += (targetRotationY - cardGroup.rotation.y) * damping;
      cardGroup.rotation.x += (targetRotationX - cardGroup.rotation.x) * damping;

      // Subtle wobble effect
      const time = Date.now() * 0.001;
      cardGroup.position.y = Math.sin(time) * 0.08;

      renderer.render(scene, camera);
    };

    animate();

    // 6. Responsive Resize logic
    const handleResize = () => {
      if (!containerRef.current) return;
      const bounds = containerRef.current.getBoundingClientRect();
      camera.aspect = bounds.width / bounds.height;
      camera.updateProjectionMatrix();
      renderer.setSize(bounds.width, bounds.height);
    };

    const resizeObserver = new ResizeObserver(() => {
      handleResize();
    });
    resizeObserver.observe(container);

    // 7. Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      container.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      resizeObserver.disconnect();

      // Dispose webgl resources
      geometry.dispose();
      materials.forEach((m) => m.dispose());
      ringGeometry.dispose();
      ringMaterial.dispose();
      lanyardGeometry.dispose();
      lanyardMaterial.dispose();
      cardTexture.dispose();
      backTexture.dispose();
      renderer.dispose();
    };
  }, [imageSrc]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full flex items-center justify-center relative select-none"
      style={{ touchAction: 'none' }}
    >
      <canvas ref={canvasRef} className="w-full h-full max-w-full max-h-full" />
    </div>
  );
}
