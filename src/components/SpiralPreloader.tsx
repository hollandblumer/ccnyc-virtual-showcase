"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

const POSTER_COUNT = 18;

const VERTEX_SHADER = `
  uniform float uTime;
  uniform float uOffset;
  varying vec2 vUv;
  varying float vWave;

  void main() {
    vUv = uv;
    vec3 pos = position;

    float wave = sin(pos.x * 1.5 + uTime * 0.8 + uOffset) * 0.2;
    wave += cos(pos.y * 1.2 + uTime * 0.6 + uOffset) * 0.15;

    float corners = pow(uv.x - 0.5, 2.0) + pow(uv.y - 0.5, 2.0);
    pos.z += wave * (1.0 + corners * 4.0);

    vWave = wave;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const FRAGMENT_SHADER = `
  uniform sampler2D uTexture;
  uniform vec3 uTint;
  varying float vWave;
  varying vec2 vUv;

  void main() {
    vec4 tex = texture2D(uTexture, vUv);
    float light = 0.88 + vWave * 0.55;
    float edgeFade =
      smoothstep(0.0, 0.05, vUv.x) *
      smoothstep(1.0, 0.95, vUv.x) *
      smoothstep(0.0, 0.05, vUv.y) *
      smoothstep(1.0, 0.95, vUv.y);

    gl_FragColor = vec4(tex.rgb * uTint * light * 1.15, tex.a * edgeFade * 0.96);
  }
`;

function pseudoRandom(seed: number) {
  const value = Math.sin(seed * 12.9898) * 43758.5453;
  return value - Math.floor(value);
}

const POSTERS = Array.from({ length: POSTER_COUNT }, (_, index) => ({
  id: index,
  angle: pseudoRandom(index + 1) * Math.PI * 2,
  radius: 2 + pseudoRandom(index + 11) * 5,
  depth: pseudoRandom(index + 21),
  rotationZ: pseudoRandom(index + 31) * Math.PI,
  speed: 0.03 + pseudoRandom(index + 41) * 0.05,
  rotSpeed: (pseudoRandom(index + 51) - 0.5) * 0.01,
  wobble: pseudoRandom(index + 61) * Math.PI * 2,
  offset: pseudoRandom(index + 71) * 20,
  tint: 0.9 + pseudoRandom(index + 81) * 0.18,
  textureUrl: `https://picsum.photos/seed/ccnyc-spiral-${index + 1}/512/768`,
}));

type PosterMesh = THREE.Mesh<
  THREE.PlaneGeometry,
  THREE.ShaderMaterial
> & {
  userData: {
    speed: number;
    rotSpeed: number;
    baseAngle: number;
    radius: number;
    wobble: number;
  };
};

function resetPoster(mesh: PosterMesh, initial = false) {
  mesh.position.x = Math.cos(mesh.userData.baseAngle) * mesh.userData.radius;
  mesh.position.y = Math.sin(mesh.userData.baseAngle) * mesh.userData.radius;
  mesh.position.z = initial ? -(mesh.userData.wobble / (Math.PI * 2)) * 40 : 5;
  mesh.rotation.z = mesh.userData.baseAngle;
  mesh.rotation.x = 0;
}

export default function SpiralPreloader() {
  const [hidden, setHidden] = useState(false);
  const sceneRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const finish = window.setTimeout(() => setHidden(true), 3800);
    return () => window.clearTimeout(finish);
  }, []);

  useEffect(() => {
    const mountNode = sceneRef.current;

    if (!mountNode) return;

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x000000, 1, 40);

    const camera = new THREE.PerspectiveCamera(
      60,
      mountNode.clientWidth / mountNode.clientHeight,
      0.1,
      1000,
    );
    camera.position.z = 10;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mountNode.clientWidth, mountNode.clientHeight);
    renderer.setClearColor(0x000000, 0);
    mountNode.appendChild(renderer.domElement);

    const geometry = new THREE.PlaneGeometry(1.8, 2.4, 32, 32);
    const loader = new THREE.TextureLoader();
    loader.setCrossOrigin("anonymous");

    const posters: PosterMesh[] = POSTERS.map((poster) => {
      const texture = loader.load(poster.textureUrl);
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;

      const material = new THREE.ShaderMaterial({
        vertexShader: VERTEX_SHADER,
        fragmentShader: FRAGMENT_SHADER,
        uniforms: {
          uTime: { value: 0 },
          uOffset: { value: poster.offset },
          uTint: {
            value: new THREE.Color(0xffffff).multiplyScalar(poster.tint),
          },
          uTexture: { value: texture },
        },
        side: THREE.DoubleSide,
        transparent: true,
      });

      const mesh = new THREE.Mesh(geometry, material) as PosterMesh;
      mesh.userData = {
        speed: poster.speed,
        rotSpeed: poster.rotSpeed,
        baseAngle: poster.angle,
        radius: poster.radius,
        wobble: poster.wobble,
      };
      resetPoster(mesh, true);
      scene.add(mesh);
      return mesh;
    });

    const clock = new THREE.Clock();

    const handleResize = () => {
      if (!sceneRef.current) return;

      camera.aspect = sceneRef.current.clientWidth / sceneRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(sceneRef.current.clientWidth, sceneRef.current.clientHeight);
    };

    window.addEventListener("resize", handleResize);

    let frameId = 0;

    const animate = () => {
      frameId = window.requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      posters.forEach((mesh) => {
        mesh.position.z -= mesh.userData.speed;
        mesh.position.x += Math.sin(time * 0.5 + mesh.userData.wobble) * 0.005;
        mesh.rotation.z += mesh.userData.rotSpeed;
        mesh.rotation.x += mesh.userData.rotSpeed * 0.5;
        mesh.material.uniforms.uTime.value = time;

        if (mesh.position.z < -35) {
          resetPoster(mesh);
        }
      });

      camera.position.x = Math.sin(time * 0.2) * 0.3;
      camera.position.y = Math.cos(time * 0.2) * 0.3;
      camera.lookAt(0, 0, -20);

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener("resize", handleResize);

      posters.forEach((mesh) => {
        mesh.material.uniforms.uTexture.value.dispose();
        mesh.material.dispose();
        scene.remove(mesh);
      });

      geometry.dispose();
      renderer.dispose();
      mountNode.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
      aria-hidden={hidden}
      className={`spiral-loader${hidden ? " spiral-loader--hidden" : ""}`}
    >
      <div className="spiral-loader__veil" />
      <div className="spiral-loader__scene" ref={sceneRef} />
      <div className="spiral-loader__core">
        <p className="spiral-loader__status">Loading...</p>
      </div>
    </div>
  );
}
