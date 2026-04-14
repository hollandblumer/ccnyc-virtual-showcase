"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { MeshSurfaceSampler } from "three/examples/jsm/math/MeshSurfaceSampler.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";

import type { PosterRecord } from "./homeData";

type HomeSceneProps = {
  posters: PosterRecord[];
  activePosterId: number | null;
};

const PAPER_VERTEX_SHADER = `
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

const PAPER_FRAGMENT_SHADER = `
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

type FloatingPaperMesh = THREE.Mesh<THREE.PlaneGeometry, THREE.ShaderMaterial>;

function pseudoRandom(seed: number) {
  const value = Math.sin(seed * 12.9898) * 43758.5453;
  return value - Math.floor(value);
}

export default function HomeScene({
  posters,
  activePosterId,
}: HomeSceneProps) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const activeRef = useRef<number | null>(activePosterId);

  useEffect(() => {
    activeRef.current = activePosterId;
  }, [activePosterId]);

  useEffect(() => {
    const mountNode = mountRef.current;
    if (!mountNode) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xe7e0d8);
    scene.fog = new THREE.Fog(0xe7e0d8, 24, 80);

    const camera = new THREE.PerspectiveCamera(
      34,
      mountNode.clientWidth / mountNode.clientHeight,
      0.1,
      200,
    );
    camera.position.set(0, 8.5, 30);

    const renderer = new THREE.WebGLRenderer({ antialias: true, stencil: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mountNode.clientWidth, mountNode.clientHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mountNode.appendChild(renderer.domElement);

    const ambient = new THREE.AmbientLight(0xffffff, 1.45);
    scene.add(ambient);

    const key = new THREE.DirectionalLight(0xffffff, 1.85);
    key.position.set(12, 22, 10);
    key.castShadow = true;
    key.shadow.mapSize.set(2048, 2048);
    key.shadow.camera.left = -30;
    key.shadow.camera.right = 30;
    key.shadow.camera.top = 30;
    key.shadow.camera.bottom = -30;
    key.shadow.bias = -0.0002;
    scene.add(key);

    const fill = new THREE.DirectionalLight(0xfff2dc, 0.75);
    fill.position.set(-10, 10, 14);
    scene.add(fill);

    const wall = new THREE.Mesh(
      new THREE.PlaneGeometry(90, 42),
      new THREE.MeshStandardMaterial({ color: 0xe3dbd2, roughness: 1 }),
    );
    wall.position.set(0, 9, -15);
    scene.add(wall);

    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(90, 90),
      new THREE.MeshStandardMaterial({
        color: 0xe6ddd4,
        roughness: 1,
        metalness: 0,
      }),
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -8;
    floor.receiveShadow = true;
    scene.add(floor);

    const spillGroup = new THREE.Group();
    const spills = [
      { color: 0x3b7bd6, x: -1.1, z: 0.7, sx: 9.5, sz: 7 },
      { color: 0xe06543, x: 1.8, z: -0.8, sx: 10.2, sz: 7.6 },
      { color: 0xd5d53e, x: 0.2, z: 1.6, sx: 9.8, sz: 6.6 },
    ];
    spills.forEach((entry) => {
      const mesh = new THREE.Mesh(
        new THREE.CircleGeometry(1, 48),
        new THREE.MeshBasicMaterial({
          color: entry.color,
          transparent: true,
          opacity: 0.12,
          depthWrite: false,
        }),
      );
      mesh.rotation.x = -Math.PI / 2;
      mesh.position.set(entry.x, -7.94, entry.z);
      mesh.scale.set(entry.sx, entry.sz, 1);
      spillGroup.add(mesh);
    });
    scene.add(spillGroup);

    const dustPositions = new Float32Array(140 * 3);
    for (let i = 0; i < 140; i += 1) {
      dustPositions[i * 3] = (pseudoRandom(i + 1) - 0.5) * 65;
      dustPositions[i * 3 + 1] = pseudoRandom(i + 30) * 32 - 3;
      dustPositions[i * 3 + 2] = -6 - pseudoRandom(i + 60) * 20;
    }
    const dustGeometry = new THREE.BufferGeometry();
    dustGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(dustPositions, 3),
    );
    const dust = new THREE.Points(
      dustGeometry,
      new THREE.PointsMaterial({
        color: 0xcfc3b7,
        size: 0.12,
        transparent: true,
        opacity: 0.55,
      }),
    );
    scene.add(dust);

    const loader = new THREE.TextureLoader();
    loader.setCrossOrigin("anonymous");
    const maxAnisotropy = renderer.capabilities.getMaxAnisotropy();
    const textures = posters.map((poster) => {
      const texture = loader.load(poster.imageUrl);
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.minFilter = THREE.LinearMipmapLinearFilter;
      texture.magFilter = THREE.LinearFilter;
      texture.anisotropy = maxAnisotropy;
      return texture;
    });
    const wallPosterGeometry = new THREE.PlaneGeometry(3.4, 4.6);
    const floorPosterGeometry = new THREE.PlaneGeometry(3.4, 4.6);
    const floatingPaperGeometry = new THREE.PlaneGeometry(3.4, 4.6, 32, 32);

    const wallGroup = new THREE.Group();
    scene.add(wallGroup);
    const wallMeshes: THREE.Mesh[] = [];
    const wallPositions = [
      [-16, 8.5], [-12.3, 9.8], [-8.4, 8.9], [-4.8, 7.9],
      [4.4, 8.4], [8.6, 9.3], [12.2, 7.8], [16, 8.9],
      [-10.6, 4.5], [-5.5, 5.2], [6.5, 4.6], [13.8, 4.8],
    ];

    wallPositions.forEach((position, index) => {
      const poster = posters[index % posters.length];
      const mesh = new THREE.Mesh(
        wallPosterGeometry,
        new THREE.MeshStandardMaterial({
          map: textures[poster.id],
          roughness: 0.92,
          metalness: 0,
          polygonOffset: true,
          polygonOffsetFactor: -4,
          polygonOffsetUnits: -4,
        }),
      );
      mesh.position.set(position[0], position[1], -13.8 + pseudoRandom(index + 100) * 0.04);
      mesh.rotation.z = (pseudoRandom(index + 130) - 0.5) * 0.08;
      mesh.renderOrder = 2;
      mesh.userData.posterId = poster.id;
      wallMeshes.push(mesh);
      wallGroup.add(mesh);
    });

    const floorGroup = new THREE.Group();
    scene.add(floorGroup);
    const floorMeshes: THREE.Mesh[] = [];
    for (let i = 0; i < 24; i += 1) {
      const poster = posters[i % posters.length];
      const mesh = new THREE.Mesh(
        floorPosterGeometry,
        new THREE.MeshStandardMaterial({
          map: textures[poster.id],
          roughness: 0.96,
          metalness: 0,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.9,
        }),
      );
      const angle = pseudoRandom(i + 160) * Math.PI * 2;
      const radius = 10 + pseudoRandom(i + 190) * 16;
      mesh.position.set(
        Math.cos(angle) * radius,
        -7.92 + i * 0.001,
        Math.sin(angle) * radius + 1.5,
      );
      mesh.rotation.x = -Math.PI / 2;
      mesh.rotation.z = pseudoRandom(i + 220) * Math.PI;
      mesh.scale.setScalar(1);
      mesh.receiveShadow = true;
      mesh.userData.posterId = poster.id;
      floorMeshes.push(mesh);
      floorGroup.add(mesh);
    }

    const floatingGroup = new THREE.Group();
    scene.add(floatingGroup);
    const floatingMeshes: FloatingPaperMesh[] = [];
    const floatingMaterialDisposers: Array<() => void> = [];
    for (let i = 0; i < 16; i += 1) {
      const poster = posters[i % posters.length];
      const material = new THREE.ShaderMaterial({
        vertexShader: PAPER_VERTEX_SHADER,
        fragmentShader: PAPER_FRAGMENT_SHADER,
        uniforms: {
          uTime: { value: 0 },
          uOffset: { value: pseudoRandom(i + 470) * 20 },
          uTint: {
            value: new THREE.Color(0xffffff).multiplyScalar(
              0.94 + pseudoRandom(i + 500) * 0.18,
            ),
          },
          uTexture: { value: textures[poster.id] },
        },
        side: THREE.DoubleSide,
        transparent: true,
      });
      const mesh = new THREE.Mesh(
        floatingPaperGeometry,
        material,
      ) as FloatingPaperMesh;
      mesh.position.set(
        (pseudoRandom(i + 280) - 0.5) * 18,
        1.8 + pseudoRandom(i + 310) * 8,
        -4 - pseudoRandom(i + 340) * 18,
      );
      mesh.rotation.set(
        (pseudoRandom(i + 370) - 0.5) * 0.9,
        (pseudoRandom(i + 400) - 0.5) * 0.7,
        pseudoRandom(i + 430) * Math.PI,
      );
      mesh.userData = {
        seed: i,
        baseY: mesh.position.y,
        baseX: mesh.position.x,
        baseZ: mesh.position.z,
      };
      floatingMeshes.push(mesh);
      floatingGroup.add(mesh);
      floatingMaterialDisposers.push(() => material.dispose());
    }

    const sculptureGroup = new THREE.Group();
    scene.add(sculptureGroup);
    const sculptureScraps: THREE.Mesh[] = [];
    const sculptureMaterials: THREE.Material[] = [];
    let sculptureMask: THREE.Mesh | null = null;
    const fontLoader = new FontLoader();

    fontLoader.load(
      "https://threejs.org/examples/fonts/helvetiker_bold.typeface.json",
      (font) => {
        const textGeometry = new TextGeometry("C", {
          font,
          size: 12.5,
          depth: 2.6,
          curveSegments: 30,
          bevelEnabled: true,
          bevelThickness: 0.1,
          bevelSize: 0.1,
          bevelSegments: 8,
        });

        textGeometry.center();
        const maskMaterial = new THREE.MeshBasicMaterial({
          colorWrite: false,
          depthWrite: false,
          side: THREE.DoubleSide,
        });
        maskMaterial.stencilWrite = true;
        maskMaterial.stencilFunc = THREE.AlwaysStencilFunc;
        maskMaterial.stencilRef = 1;
        maskMaterial.stencilZPass = THREE.ReplaceStencilOp;

        sculptureMask = new THREE.Mesh(textGeometry.clone(), maskMaterial);
        sculptureGroup.add(sculptureMask);
        sculptureMaterials.push(maskMaterial);

        const samplerMesh = new THREE.Mesh(textGeometry);
        const sampler = new MeshSurfaceSampler(samplerMesh).build();
        const position = new THREE.Vector3();
        const normal = new THREE.Vector3();

        for (let i = 0; i < 800; i += 1) {
          sampler.sample(position, normal);
          const poster = posters[i % posters.length];
          const scrapMaterial = new THREE.MeshStandardMaterial({
            map: textures[poster.id],
            roughness: 0.98,
            metalness: 0,
            side: THREE.DoubleSide,
            stencilWrite: true,
            stencilFunc: THREE.EqualStencilFunc,
            stencilRef: 1,
          });
          sculptureMaterials.push(scrapMaterial);

          const width = 1.1 + pseudoRandom(i + 540) * 1.05;
          const height = 1.3 + pseudoRandom(i + 570) * 1.05;
          const scrap = new THREE.Mesh(
            new THREE.PlaneGeometry(width, height),
            scrapMaterial,
          );
          const offset = 0.02 + i * 0.002;
          scrap.position.copy(position).addScaledVector(normal, offset);

          const target = new THREE.Vector3().copy(position).add(normal);
          scrap.lookAt(target);
          scrap.rotation.z += pseudoRandom(i + 600) * Math.PI;
          scrap.rotation.x += (pseudoRandom(i + 630) - 0.5) * 0.1;
          scrap.rotation.y += (pseudoRandom(i + 660) - 0.5) * 0.1;
          scrap.castShadow = true;
          sculptureScraps.push(scrap);
          sculptureGroup.add(scrap);
        }

        samplerMesh.geometry.dispose();
        textGeometry.dispose();
      },
    );

    sculptureGroup.position.set(0, 2.85, -1.2);
    sculptureGroup.rotation.y = 0;

    const clock = new THREE.Clock();

    const handleResize = () => {
      if (!mountRef.current) return;
      camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    };

    window.addEventListener("resize", handleResize);

    let frameId = 0;

    const animate = () => {
      frameId = window.requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      floatingMeshes.forEach((mesh, index) => {
        mesh.position.y = mesh.userData.baseY + Math.sin(t * 0.8 + index) * 0.25;
        mesh.position.x = mesh.userData.baseX + Math.cos(t * 0.55 + index) * 0.18;
        mesh.position.z = mesh.userData.baseZ + Math.sin(t * 0.35 + index) * 0.35;
        mesh.rotation.z += 0.0012;
        mesh.rotation.x += Math.sin(t * 0.6 + index) * 0.0015;
        mesh.material.uniforms.uTime.value = t;
      });

      wallMeshes.forEach((mesh) => {
        const active = activeRef.current === mesh.userData.posterId;
        mesh.scale.setScalar(active ? 1.08 : 1);
        mesh.position.z = active ? -13.6 : -13.8;
      });

      floorMeshes.forEach((mesh) => {
        const active = activeRef.current === mesh.userData.posterId;
        const material = mesh.material as THREE.MeshStandardMaterial;
        material.opacity = active ? 1 : 0.82;
      });

      if (sculptureGroup.children.length > 0) {
        sculptureGroup.position.y = 2.85 + Math.sin(t * 0.9) * 0.18;
      }

      camera.position.x = 0;
      camera.position.y = 8.3 + Math.cos(t * 0.18) * 0.12;
      camera.lookAt(0, 2.9, -1.2);

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener("resize", handleResize);
      textures.forEach((texture) => texture.dispose());
      dustGeometry.dispose();
      wallPosterGeometry.dispose();
      floorPosterGeometry.dispose();
      floatingPaperGeometry.dispose();
      wallMeshes.forEach((mesh) => {
        (mesh.material as THREE.Material).dispose();
      });
      floorMeshes.forEach((mesh) => {
        (mesh.material as THREE.Material).dispose();
      });
      floatingMeshes.forEach((mesh) => {
        mesh.material.uniforms.uTexture.value = null;
      });
      floatingMaterialDisposers.forEach((dispose) => dispose());
      sculptureScraps.forEach((mesh) => {
        mesh.geometry.dispose();
      });
      sculptureMask?.geometry.dispose();
      sculptureMaterials.forEach((material) => material.dispose());
      renderer.dispose();
      mountNode.removeChild(renderer.domElement);
    };
  }, [posters]);

  return <div className="home-scene" ref={mountRef} />;
}
