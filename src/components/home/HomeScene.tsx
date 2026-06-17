"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

import type { PosterRecord } from "./homeData";

type HomeSceneProps = {
  posters: PosterRecord[];
  activePosterId: number | null;
};

type TwistingPosterMesh = THREE.Mesh<THREE.PlaneGeometry, THREE.ShaderMaterial>;

type ArcPosterMesh = THREE.Mesh<THREE.PlaneGeometry, THREE.ShaderMaterial>;
type OpacityMaterial = THREE.Material & { opacity: number };
type DetachedArcPoster = {
  arcMesh: ArcPosterMesh;
  floatingMesh: TwistingPosterMesh;
  start: THREE.Vector3;
  detachStart: number;
  detachEnd: number;
};

const TAU = Math.PI * 2;

const ARC_POSTER_VERTEX_SHADER = `
  uniform float uTime;
  uniform float uThetaCenter;
  uniform float uThetaSpan;
  uniform float uRadius;
  uniform float uWidth;
  uniform float uCupDepth;
  uniform float uFlutter;
  uniform float uTimeOffset;
  uniform float uZOffset;
  uniform float uUprightTilt;
  uniform float uTransition;
  uniform float uSwirlOffset;

  varying vec2 vUv;
  varying float vShade;

  void main() {
    vUv = uv;

    float t = uTime * 0.01 + uTimeOffset;
    float progress = smoothstep(0.0, 1.0, uTransition);
    float arcPos = uv.x - 0.5;
    float crossPos = uv.y - 0.5;
    float theta = uThetaCenter + arcPos * uThetaSpan;

    vec2 outward = vec2(cos(theta), sin(theta));
    vec2 tangent = vec2(-sin(theta), cos(theta));

    vec3 targetPos = vec3(cos(theta) * uRadius, sin(theta) * uRadius, uZOffset);
    targetPos.xy += tangent * crossPos * uWidth * 0.05;
    targetPos.xy += outward * crossPos * uUprightTilt;

    float swirlTheta = theta + (1.0 - progress) * uSwirlOffset * 4.0;
    float swirlRadius = uRadius * (0.45 + (1.0 - progress) * 1.35);
    vec3 startPos = vec3(
      cos(swirlTheta) * swirlRadius,
      sin(swirlTheta) * swirlRadius,
      -12.0 + uZOffset
    );

    vec3 pos = mix(startPos, targetPos, progress);

    float cup = sin(crossPos * 3.14159) * uCupDepth;
    pos.z += cup + sin(t + uv.x * 3.0) * 0.05 * uFlutter;

    vShade = 0.95 + cup * 0.15 + pos.z * 0.02;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const ARC_POSTER_FRAGMENT_SHADER = `
  uniform sampler2D tMap;
  uniform float uOpacity;

  varying vec2 vUv;
  varying float vShade;

  void main() {
    vec4 color = texture2D(tMap, vUv);
    if (color.a < 0.03) discard;
    color.rgb *= vShade;
    color.a *= uOpacity;
    gl_FragColor = color;
  }
`;

const TWISTING_POSTER_VERTEX_SHADER = `
  uniform float uTime;
  uniform float uPhase;
  uniform float uSpeed;

  varying vec2 vUv;
  varying float vDepth;

  void main() {
    vUv = uv;

    vec3 pos = position;
    float t = uTime * 1.15 + uPhase;
    float cx = uv.x - 0.5;
    float cy = uv.y - 0.5;
    float edge = pow(sin(uv.x * 3.14159265), 0.65);

    float twist = sin(uv.y * 3.14159265 + t * 1.6);
    pos.z += cx * twist * 0.42;
    pos.x += cx * twist * 0.08;

    pos.z += sin(uv.x * 6.28318 + t * 1.2) * 0.06;
    pos.y += sin(uv.x * 3.14159 + t * 1.4) * 0.025;

    pos.z += sin(t * 2.3 + uv.y * 10.0) * 0.085 * edge;
    pos.x += cos(t * 2.0 + uv.y * 8.0) * 0.025 * edge;

    pos.z += uSpeed * 0.16 * sin(uv.y * 3.14159);
    pos.x += uSpeed * 0.035 * cy;

    vDepth = pos.z;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const TWISTING_POSTER_FRAGMENT_SHADER = `
  uniform sampler2D tMap;
  uniform float uOpacity;

  varying vec2 vUv;
  varying float vDepth;

  void main() {
    vec4 color = texture2D(tMap, vUv);
    float shade = 0.96 + vDepth * 0.1;
    color.rgb *= shade;
    color.a *= uOpacity;
    gl_FragColor = color;
  }
`;

function pseudoRandom(seed: number) {
  const value = Math.sin(seed * 12.9898) * 43758.5453;
  return value - Math.floor(value);
}

function pseudoRange(seed: number, min: number, max: number) {
  return min + (max - min) * pseudoRandom(seed);
}

export default function HomeScene({ posters, activePosterId }: HomeSceneProps) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const activeRef = useRef<number | null>(activePosterId);

  useEffect(() => {
    activeRef.current = activePosterId;
  }, [activePosterId]);

  useEffect(() => {
    const mountNode = mountRef.current;
    if (!mountNode) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xece7df);
    scene.fog = new THREE.Fog(0xece7df, 18, 74);

    const camera = new THREE.PerspectiveCamera(
      35,
      mountNode.clientWidth / mountNode.clientHeight,
      0.1,
      200,
    );
    camera.position.set(0, 2.65, 34);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      stencil: true,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mountNode.clientWidth, mountNode.clientHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mountNode.appendChild(renderer.domElement);

    const ambient = new THREE.AmbientLight(0xffffff, 1.55);
    scene.add(ambient);

    const key = new THREE.DirectionalLight(0xfff7eb, 2.05);
    key.position.set(12, 24, 13);
    key.castShadow = true;
    key.shadow.mapSize.set(2048, 2048);
    key.shadow.camera.left = -30;
    key.shadow.camera.right = 30;
    key.shadow.camera.top = 30;
    key.shadow.camera.bottom = -30;
    key.shadow.bias = -0.0002;
    scene.add(key);

    const fill = new THREE.DirectionalLight(0xfff2dc, 0.92);
    fill.position.set(-12, 10, 16);
    scene.add(fill);

    const wall = new THREE.Mesh(
      new THREE.PlaneGeometry(90, 42),
      new THREE.MeshStandardMaterial({
        color: 0xe8e2da,
        roughness: 1,
        transparent: true,
        opacity: 1,
      }),
    );
    wall.position.set(0, 9, -20);
    wall.renderOrder = 0;
    scene.add(wall);

    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(90, 90),
      new THREE.MeshStandardMaterial({
        color: 0xe8dfd6,
        roughness: 1,
        metalness: 0,
        transparent: true,
        opacity: 1,
      }),
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -8;
    floor.receiveShadow = true;
    scene.add(floor);

    const sculptureShadow = new THREE.Mesh(
      new THREE.CircleGeometry(1, 64),
      new THREE.MeshBasicMaterial({
        color: 0x5d554d,
        transparent: true,
        opacity: 0.14,
        depthWrite: false,
      }),
    );
    sculptureShadow.rotation.x = -Math.PI / 2;
    sculptureShadow.position.set(0, -7.93, -1.2);
    sculptureShadow.scale.set(11.4, 4.4, 1);
    sculptureShadow.renderOrder = 2;
    scene.add(sculptureShadow);

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
    const textureByPosterId = new Map(
      posters.map((poster, index) => [poster.id, textures[index]]),
    );
    const wallPosterGeometry = new THREE.PlaneGeometry(3.55, 4.73);
    const smallWallPosterGeometry = new THREE.PlaneGeometry(1.35, 1.85);
    const leftWallPosterGeometry = new THREE.PlaneGeometry(3.05, 4.25);
    const floorPosterGeometry = new THREE.PlaneGeometry(3.4, 4.6);
    const twistingPosterGeometry = new THREE.PlaneGeometry(2.35, 3.3, 48, 18);

    const wallMeshes: THREE.Mesh[] = [];
    const smallWallMeshes: THREE.Mesh[] = [];
    const leftWallMeshes: THREE.Mesh[] = [];

    const smallWallPosterData = [
      { x: -17.8, y: 10.7, scale: 1.2, rotation: -0.16, posterOffset: 2 },
      { x: -12.4, y: 13.8, scale: 0.82, rotation: 0.12, posterOffset: 4 },
      { x: -5.4, y: 9.15, scale: 0.95, rotation: -0.08, posterOffset: 6 },
      { x: 0.8, y: 7.7, scale: 0.72, rotation: 0.16, posterOffset: 1 },
      { x: 3.1, y: 11.85, scale: 0.9, rotation: -0.12, posterOffset: 5 },
    ];

    // Removed back-plane small wall poster images.

    const leftWallPosterData = [
      { x: -21.5, y: 7.0, scale: 1.28, rotation: -0.52, posterOffset: 3 },
      { x: -18.5, y: 3.4, scale: 1.08, rotation: 0.34, posterOffset: 7 },
      { x: -14.9, y: 11.0, scale: 0.92, rotation: -0.22, posterOffset: 1 },
    ];

    // Removed back-plane left wall poster images.

    const floorGroup = new THREE.Group();
    scene.add(floorGroup);
    const floorMeshes: THREE.Mesh[] = [];
    for (let i = 0; i < 24; i += 1) {
      const poster = posters[i % posters.length];
      const mesh = new THREE.Mesh(
        floorPosterGeometry,
        new THREE.MeshStandardMaterial({
          map: textureByPosterId.get(poster.id),
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
        Math.max(Math.sin(angle) * radius + 4.5, -10.5),
      );
      mesh.rotation.x = -Math.PI / 2;
      mesh.rotation.z = pseudoRandom(i + 220) * Math.PI;
      mesh.scale.setScalar(1);
      mesh.renderOrder = 3;
      mesh.receiveShadow = true;
      mesh.userData.posterId = poster.id;
      floorMeshes.push(mesh);
      floorGroup.add(mesh);
    }

    const twistingPosterGroup = new THREE.Group();
    scene.add(twistingPosterGroup);
    const twistingPosters: TwistingPosterMesh[] = [];
    const twistingPosterPositions = [
      [-13.8, 10.4, 2.8],
      [-15.6, 14.2, 3.8],
      [15.4, 8.6, -3.8],
    ];

    twistingPosterPositions.forEach((position, index) => {
      const poster = posters[index % posters.length];
      const side = index % 2 === 0 ? -1 : 1;
      const material = new THREE.ShaderMaterial({
        vertexShader: TWISTING_POSTER_VERTEX_SHADER,
        fragmentShader: TWISTING_POSTER_FRAGMENT_SHADER,
        uniforms: {
          tMap: { value: textureByPosterId.get(poster.id) },
          uTime: { value: 0 },
          uPhase: { value: pseudoRandom(index + 720) * Math.PI * 2 },
          uSpeed: { value: 0 },
          uOpacity: { value: 0.98 },
        },
        side: THREE.DoubleSide,
        transparent: true,
      });
      const mesh = new THREE.Mesh(
        twistingPosterGeometry,
        material,
      ) as TwistingPosterMesh;
      const reclined = index === 1;
      const pitch = reclined
        ? -Math.PI / 2 + (pseudoRandom(index + 750) - 0.5) * 0.38
        : (pseudoRandom(index + 750) - 0.5) * 0.7;
      const yaw = reclined
        ? side * (0.08 + pseudoRandom(index + 780) * 0.16)
        : side * (0.28 + pseudoRandom(index + 780) * 0.36);
      mesh.position.set(position[0], position[1], position[2]);
      mesh.rotation.set(pitch, yaw, (pseudoRandom(index + 810) - 0.5) * 0.64);
      mesh.scale.setScalar(1.12 + pseudoRandom(index + 840) * 0.26);
      mesh.renderOrder = 5;
      mesh.castShadow = true;
      mesh.userData = {
        baseX: mesh.position.x,
        baseY: mesh.position.y,
        baseZ: mesh.position.z,
        pitchBase: mesh.rotation.x,
        yawBase: mesh.rotation.y,
        rollBase: mesh.rotation.z,
        phase: pseudoRandom(index + 870) * Math.PI * 2,
        verticalAmp: 0.32 + pseudoRandom(index + 900) * 0.24,
        horizontalAmp: 0.16 + pseudoRandom(index + 930) * 0.16,
        depthAmp: 0.18 + pseudoRandom(index + 960) * 0.2,
        tiltAmp: 0.045 + pseudoRandom(index + 990) * 0.035,
      };
      twistingPosters.push(mesh);
      twistingPosterGroup.add(mesh);
    });

    const sculptureGroup = new THREE.Group();
    scene.add(sculptureGroup);
    const arcPosterGeometry = new THREE.PlaneGeometry(1, 1, 40, 24);
    const arcPosters: ArcPosterMesh[] = [];
    const detachedArcPosters: DetachedArcPoster[] = [];
    const detachedPosterConfigs = [
      {
        arcIndex: 4,
        start: new THREE.Vector3(-2.2, 11.7, -1.55),
        base: new THREE.Vector3(-6.4, 15.25, -0.8),
        rotation: new THREE.Euler(-0.18, -0.22, 1.8),
        scale: 1.44,
        detachStart: 7.0,
        detachEnd: 8.9,
        phaseSeed: 1880,
        motionSeed: 1900,
        verticalAmp: 0.5,
        horizontalAmp: 0.3,
        depthAmp: 0.34,
        tiltAmp: 0.085,
      },
      {
        arcIndex: 13,
        start: new THREE.Vector3(2.2, 11.5, -1.55),
        base: new THREE.Vector3(5.6, 14.45, -1.1),
        rotation: new THREE.Euler(-0.12, 0.24, -1.65),
        scale: 1.43,
        detachStart: 9.8,
        detachEnd: 11.7,
        phaseSeed: 2000,
        motionSeed: 2020,
        verticalAmp: 0.48,
        horizontalAmp: 0.3,
        depthAmp: 0.34,
        tiltAmp: 0.082,
      },
    ];
    const arcStart = Math.PI * 0.2;
    const arcEnd = Math.PI * 1.8;
    const layerCount = 70;
    const posterCount = 18;
    const outerRadius = 5.5;
    const radiusStep = 0.025;

    for (let layer = 0; layer < layerCount; layer += 1) {
      const layerT = layer / (layerCount - 1);
      const shift = Math.sin(layer * 0.4) * 0.1;
      const radius = outerRadius - layer * radiusStep;
      const posterSpanBase = 1.3 / radius;

      for (let i = 0; i < posterCount; i += 1) {
        const arcT = i / (posterCount - 1);
        const thetaCenter = arcStart + shift + (arcEnd - arcStart) * arcT;
        const texture =
          layer === 0 && i === 3
            ? textures[8]
            : layer === 0 && i === 4
              ? textures[9]
              : layer === 0 && i === 5
                ? textures[10]
                : layer === 0 && i === 6
                  ? textures[11]
                  : layer === 0 && i === 7
                    ? textures[12]
                    : layer === 0 && i === 8
                      ? textures[13]
                      : layer === 0 && i === 9
                        ? textures[14]
                        : layer === 0 && i === 10
                          ? textures[15]
                          : layer === 0 && i === 11
                            ? textures[16]
                            : layer === 0 && i === 12
                              ? textures[17]
                              : textures[(layer * 3 + i) % textures.length];
        const material = new THREE.ShaderMaterial({
          vertexShader: ARC_POSTER_VERTEX_SHADER,
          fragmentShader: ARC_POSTER_FRAGMENT_SHADER,
          uniforms: {
            tMap: { value: texture },
            uTime: { value: 0 },
            uThetaCenter: {
              value: thetaCenter,
            },
            uThetaSpan: {
              value: posterSpanBase,
            },
            uRadius: { value: radius },
            uWidth: {
              value: pseudoRange(layer * 97 + i + 1800, 1.1, 1.6),
            },
            uCupDepth: {
              value: 0.5 + (0.3 - 0.5) * layerT,
            },
            uFlutter: { value: pseudoRange(layer * 97 + i + 2000, 0.8, 1.2) },
            uTimeOffset: { value: pseudoRange(layer * 97 + i + 2100, 0, TAU) },
            uZOffset: { value: -layer * 0.02 },
            uUprightTilt: { value: 0.2 + (0.4 - 0.2) * layerT },
            uTransition: { value: 0 },
            uSwirlOffset: { value: pseudoRange(layer * 97 + i + 2250, 3, 6) },
            uOpacity: { value: 1 },
          },
          side: THREE.DoubleSide,
          transparent: true,
        });
        const mesh = new THREE.Mesh(
          arcPosterGeometry,
          material,
        ) as ArcPosterMesh;
        mesh.rotation.set(
          pseudoRange(layer * 97 + i + 2300, -0.03, 0.03),
          pseudoRange(layer * 97 + i + 2400, -0.03, 0.03),
          pseudoRange(layer * 97 + i + 2500, -0.02, 0.02),
        );
        mesh.renderOrder = 4;
        mesh.castShadow = true;
        const detachedConfig = detachedPosterConfigs.find(
          (config) => layer === 0 && config.arcIndex === i,
        );
        if (detachedConfig) {
          const detachedMaterial = new THREE.ShaderMaterial({
            vertexShader: TWISTING_POSTER_VERTEX_SHADER,
            fragmentShader: TWISTING_POSTER_FRAGMENT_SHADER,
            uniforms: {
              tMap: { value: texture },
              uTime: { value: 0 },
              uPhase: {
                value: pseudoRandom(detachedConfig.phaseSeed) * Math.PI * 2,
              },
              uSpeed: { value: 0 },
              uOpacity: { value: 0 },
            },
            side: THREE.DoubleSide,
            transparent: true,
          });
          const detachedFloatingPoster = new THREE.Mesh(
            twistingPosterGeometry,
            detachedMaterial,
          ) as TwistingPosterMesh;
          detachedFloatingPoster.position.copy(detachedConfig.start);
          detachedFloatingPoster.rotation.copy(detachedConfig.rotation);
          detachedFloatingPoster.scale.setScalar(detachedConfig.scale);
          detachedFloatingPoster.renderOrder = 6;
          detachedFloatingPoster.castShadow = true;
          detachedFloatingPoster.userData = {
            baseX: detachedConfig.base.x,
            baseY: detachedConfig.base.y,
            baseZ: detachedConfig.base.z,
            pitchBase: detachedConfig.rotation.x,
            yawBase: detachedConfig.rotation.y,
            rollBase: detachedConfig.rotation.z,
            phase: pseudoRandom(detachedConfig.motionSeed) * Math.PI * 2,
            verticalAmp: detachedConfig.verticalAmp,
            horizontalAmp: detachedConfig.horizontalAmp,
            depthAmp: detachedConfig.depthAmp,
            tiltAmp: detachedConfig.tiltAmp,
          };
          detachedArcPosters.push({
            arcMesh: mesh,
            floatingMesh: detachedFloatingPoster,
            start: detachedConfig.start,
            detachStart: detachedConfig.detachStart,
            detachEnd: detachedConfig.detachEnd,
          });
          twistingPosterGroup.add(detachedFloatingPoster);
        }
        arcPosters.push(mesh);
        sculptureGroup.add(mesh);
      }
    }

    [arcStart, arcEnd].forEach((theta, endIndex) => {
      for (let k = 0; k < 4; k += 1) {
        const seed = endIndex * 211 + k;
        const material = new THREE.ShaderMaterial({
          vertexShader: ARC_POSTER_VERTEX_SHADER,
          fragmentShader: ARC_POSTER_FRAGMENT_SHADER,
          uniforms: {
            tMap: { value: textures[(endIndex * 5 + k) % textures.length] },
            uTime: { value: 0 },
            uThetaCenter: {
              value: theta + pseudoRange(seed + 2600, -0.03, 0.03),
            },
            uThetaSpan: { value: pseudoRange(seed + 2700, 0.12, 0.18) },
            uRadius: {
              value: pseudoRange(
                seed + 2800,
                outerRadius - 0.08,
                outerRadius + 0.05,
              ),
            },
            uWidth: { value: pseudoRange(seed + 2900, 1.0, 1.4) },
            uCupDepth: { value: pseudoRange(seed + 3000, 0.35, 0.52) },
            uFlutter: { value: pseudoRange(seed + 3100, 0.95, 1.2) },
            uTimeOffset: { value: pseudoRange(seed + 3200, 0, TAU) },
            uZOffset: { value: pseudoRange(seed + 3300, -0.02, 0.02) },
            uUprightTilt: { value: pseudoRange(seed + 3400, 0.18, 0.3) },
            uTransition: { value: 0 },
            uSwirlOffset: { value: pseudoRange(seed + 3450, 3, 6) },
            uOpacity: { value: 1 },
          },
          side: THREE.DoubleSide,
          transparent: true,
        });
        const mesh = new THREE.Mesh(
          arcPosterGeometry,
          material,
        ) as ArcPosterMesh;
        mesh.rotation.set(
          pseudoRange(seed + 3500, -0.08, 0.08),
          pseudoRange(seed + 3600, -0.08, 0.08),
          pseudoRange(seed + 3700, -0.08, 0.08),
        );
        mesh.renderOrder = 4;
        mesh.castShadow = true;
        arcPosters.push(mesh);
        sculptureGroup.add(mesh);
      }
    });

    sculptureGroup.position.set(0, 2.65, -1.2);
    sculptureGroup.rotation.set(0, 0, 0);
    sculptureGroup.scale.setScalar(1.7);

    const revealMaterials: Array<{
      material: OpacityMaterial;
      baseOpacity: number;
    }> = [];

    const registerRevealMaterial = (
      material: THREE.Material | THREE.Material[],
    ) => {
      if (Array.isArray(material)) {
        material.forEach(registerRevealMaterial);
        return;
      }

      if (!("opacity" in material)) return;

      const opacityMaterial = material as OpacityMaterial;
      const baseOpacity = opacityMaterial.opacity;
      opacityMaterial.transparent = true;
      opacityMaterial.opacity = 0;
      revealMaterials.push({ material: opacityMaterial, baseOpacity });
    };

    [wall, floor, sculptureShadow, spillGroup, dust, floorGroup].forEach(
      (object) => {
        object.traverse((child) => {
          if (child instanceof THREE.Mesh || child instanceof THREE.Points) {
            registerRevealMaterial(child.material);
          }
        });
      },
    );

    const clock = new THREE.Clock();

    const handleResize = () => {
      if (!mountRef.current) return;
      camera.aspect =
        mountRef.current.clientWidth / mountRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(
        mountRef.current.clientWidth,
        mountRef.current.clientHeight,
      );
    };

    window.addEventListener("resize", handleResize);

    let frameId = 0;

    const animate = () => {
      frameId = window.requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      const surroundingsReveal = THREE.MathUtils.smoothstep(t, 3.75, 5.45);
      wall.visible = surroundingsReveal > 0.01;
      dust.visible = surroundingsReveal > 0.01;
      floor.visible = surroundingsReveal > 0.01;
      floorGroup.visible = surroundingsReveal > 0.01;
      sculptureShadow.visible = surroundingsReveal > 0.01;
      spillGroup.visible = surroundingsReveal > 0.01;
      revealMaterials.forEach(({ material, baseOpacity }) => {
        material.opacity = baseOpacity * surroundingsReveal;
      });

      twistingPosters.forEach((mesh) => {
        const drift = t * 0.62 + mesh.userData.phase;
        mesh.position.x =
          mesh.userData.baseX +
          Math.cos(drift * 0.85) * mesh.userData.horizontalAmp;
        mesh.position.y =
          mesh.userData.baseY + Math.sin(drift) * mesh.userData.verticalAmp;
        mesh.position.z =
          mesh.userData.baseZ + Math.cos(drift * 0.7) * mesh.userData.depthAmp;
        mesh.rotation.x =
          mesh.userData.pitchBase +
          Math.sin(drift * 0.9) * mesh.userData.tiltAmp;
        mesh.rotation.y =
          mesh.userData.yawBase +
          Math.sin(drift * 0.58) * mesh.userData.tiltAmp;
        mesh.rotation.z =
          mesh.userData.rollBase +
          Math.cos(drift * 0.72) * mesh.userData.tiltAmp;
        mesh.material.uniforms.uTime.value = t;
        mesh.material.uniforms.uSpeed.value =
          0.32 + Math.sin(drift * 1.2) * 0.12;
        mesh.material.uniforms.uOpacity.value =
          (0.98 - Math.sin(drift) * 0.04) * surroundingsReveal;
      });

      wallMeshes.forEach((mesh) => {
        const active = activeRef.current === mesh.userData.posterId;
        mesh.scale.setScalar(active ? 1.08 : 1);
        mesh.position.z = active ? -19.32 : -19.48;
      });

      floorMeshes.forEach((mesh) => {
        const active = activeRef.current === mesh.userData.posterId;
        const material = mesh.material as THREE.MeshStandardMaterial;
        material.opacity = (active ? 1 : 0.82) * surroundingsReveal;
      });

      const cTransition = THREE.MathUtils.smoothstep(t, 0, 7.4);
      arcPosters.forEach((mesh) => {
        mesh.material.uniforms.uTime.value = t;
        mesh.material.uniforms.uTransition.value = cTransition;
      });
      detachedArcPosters.forEach(
        ({ arcMesh, floatingMesh, start, detachStart, detachEnd }) => {
          const detachProgress = THREE.MathUtils.smoothstep(
            t,
            detachStart,
            detachEnd,
          );
          const drift = t * 0.62 + floatingMesh.userData.phase;
          const targetX =
            floatingMesh.userData.baseX +
            Math.cos(drift * 0.85) * floatingMesh.userData.horizontalAmp;
          const targetY =
            floatingMesh.userData.baseY +
            Math.sin(drift) * floatingMesh.userData.verticalAmp;
          const targetZ =
            floatingMesh.userData.baseZ +
            Math.cos(drift * 0.7) * floatingMesh.userData.depthAmp;

          arcMesh.material.uniforms.uOpacity.value = 1 - detachProgress;
          floatingMesh.position.x = THREE.MathUtils.lerp(
            start.x,
            targetX,
            detachProgress,
          );
          floatingMesh.position.y = THREE.MathUtils.lerp(
            start.y,
            targetY,
            detachProgress,
          );
          floatingMesh.position.z = THREE.MathUtils.lerp(
            start.z,
            targetZ,
            detachProgress,
          );
          floatingMesh.rotation.x =
            floatingMesh.userData.pitchBase +
            Math.sin(drift * 0.9) * floatingMesh.userData.tiltAmp;
          floatingMesh.rotation.y =
            floatingMesh.userData.yawBase +
            Math.sin(drift * 0.58) * floatingMesh.userData.tiltAmp;
          floatingMesh.rotation.z =
            floatingMesh.userData.rollBase +
            Math.cos(drift * 0.72) * floatingMesh.userData.tiltAmp;
          floatingMesh.material.uniforms.uTime.value = t;
          floatingMesh.material.uniforms.uSpeed.value =
            (0.36 + Math.sin(drift * 1.2) * 0.14) * detachProgress;
          floatingMesh.material.uniforms.uOpacity.value =
            detachProgress * surroundingsReveal;
        },
      );
      const introLift = (1 - THREE.MathUtils.smoothstep(t, 0, 4.2)) * 0.35;
      sculptureGroup.position.y = 2.65 + introLift + Math.sin(t * 0.9) * 0.12;
      const introSpin = 1 - THREE.MathUtils.smoothstep(t, 0, 4.0);
      sculptureGroup.rotation.z =
        introSpin * Math.PI * 2.15 + Math.sin(t * 0.3) * 0.015;

      camera.position.x = 0;
      camera.position.y = 2.78 + Math.cos(t * 0.18) * 0.04;
      const introPush = Math.sin(
        THREE.MathUtils.smoothstep(t, 0, 4.0) * Math.PI,
      );
      camera.position.z = 39 - introPush * 5;
      camera.lookAt(0, 2.75, -1.2);

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener("resize", handleResize);
      textures.forEach((texture) => texture.dispose());
      sculptureShadow.geometry.dispose();
      (sculptureShadow.material as THREE.Material).dispose();
      dustGeometry.dispose();
      wallPosterGeometry.dispose();
      smallWallPosterGeometry.dispose();
      leftWallPosterGeometry.dispose();
      floorPosterGeometry.dispose();
      twistingPosterGeometry.dispose();
      arcPosterGeometry.dispose();
      wallMeshes.forEach((mesh) => {
        (mesh.material as THREE.Material).dispose();
      });
      smallWallMeshes.forEach((mesh) => {
        (mesh.material as THREE.Material).dispose();
      });
      leftWallMeshes.forEach((mesh) => {
        (mesh.material as THREE.Material).dispose();
      });
      floorMeshes.forEach((mesh) => {
        (mesh.material as THREE.Material).dispose();
      });
      twistingPosters.forEach((mesh) => {
        mesh.material.dispose();
      });
      detachedArcPosters.forEach(({ floatingMesh }) => {
        floatingMesh.material.dispose();
      });
      arcPosters.forEach((mesh) => {
        mesh.material.dispose();
      });
      renderer.dispose();
      mountNode.removeChild(renderer.domElement);
    };
  }, [posters]);

  return <div className="home-scene" ref={mountRef} />;
}
