"use client";

import { useEffect } from "react";

class ClassicalNoise {
  private grad3 = [
    [1, 1, 0],
    [-1, 1, 0],
    [1, -1, 0],
    [-1, -1, 0],
    [1, 0, 1],
    [-1, 0, 1],
    [1, 0, -1],
    [-1, 0, -1],
    [0, 1, 1],
    [0, -1, 1],
    [0, 1, -1],
    [0, -1, -1],
  ];

  private p = Array.from({ length: 256 }, () => Math.floor(Math.random() * 256));
  private perm = Array.from({ length: 512 }, (_, index) => this.p[index & 255]);

  private dot(g: number[], x: number, y: number, z: number) {
    return g[0] * x + g[1] * y + g[2] * z;
  }

  private mix(a: number, b: number, t: number) {
    return (1 - t) * a + t * b;
  }

  private fade(t: number) {
    return t * t * t * (t * (t * 6 - 15) + 10);
  }

  noise(x: number, y: number, z: number) {
    const floorX = Math.floor(x);
    const floorY = Math.floor(y);
    const floorZ = Math.floor(z);
    const X = floorX & 255;
    const Y = floorY & 255;
    const Z = floorZ & 255;

    x -= floorX;
    y -= floorY;
    z -= floorZ;

    const u = this.fade(x);
    const v = this.fade(y);
    const w = this.fade(z);

    const A = this.perm[X] + Y;
    const AA = this.perm[A] + Z;
    const AB = this.perm[A + 1] + Z;
    const B = this.perm[X + 1] + Y;
    const BA = this.perm[B] + Z;
    const BB = this.perm[B + 1] + Z;

    return this.mix(
      this.mix(
        this.mix(
          this.dot(this.grad3[this.perm[AA] % 12], x, y, z),
          this.dot(this.grad3[this.perm[BA] % 12], x - 1, y, z),
          u,
        ),
        this.mix(
          this.dot(this.grad3[this.perm[AB] % 12], x, y - 1, z),
          this.dot(this.grad3[this.perm[BB] % 12], x - 1, y - 1, z),
          u,
        ),
        v,
      ),
      this.mix(
        this.mix(
          this.dot(this.grad3[this.perm[AA + 1] % 12], x, y, z - 1),
          this.dot(this.grad3[this.perm[BA + 1] % 12], x - 1, y, z - 1),
          u,
        ),
        this.mix(
          this.dot(this.grad3[this.perm[AB + 1] % 12], x, y - 1, z - 1),
          this.dot(this.grad3[this.perm[BB + 1] % 12], x - 1, y - 1, z - 1),
          u,
        ),
        v,
      ),
      w,
    );
  }
}

export default function HomeInvertMask() {
  useEffect(() => {
    const circleCanvas = document.createElement("canvas");
    const blobCanvas = document.createElement("canvas");
    const circleCtx = circleCanvas.getContext("2d");
    const blobCtx = blobCanvas.getContext("2d");

    if (!circleCtx || !blobCtx) return;

    const perlin = new ClassicalNoise();
    let width = 0;
    let height = 0;
    let dpr = 1;
    let zOff = 0;
    let animationFrame = 0;

    const gap = 34;
    const contraction = 0.0035;
    const noiseThreshold = 0.26;
    const blobScale = 2.55;
    const blobBlur = 26;
    const blobCutoff = 128;
    const speed = 0.0035;

    const resize = () => {
      dpr = window.devicePixelRatio || 1;
      width = Math.max(1, Math.floor(window.innerWidth * dpr));
      height = Math.max(1, Math.floor(window.innerHeight * dpr));

      for (const canvas of [circleCanvas, blobCanvas]) {
        canvas.width = width;
        canvas.height = height;
      }
    };

    const buildUnifiedBlob = () => {
      circleCtx.clearRect(0, 0, width, height);
      blobCtx.clearRect(0, 0, width, height);
      circleCtx.fillStyle = "white";

      const scaledGap = gap * dpr;

      for (let x = -scaledGap; x < width + scaledGap; x += scaledGap) {
        for (let y = -scaledGap; y < height + scaledGap; y += scaledGap) {
          const noise = perlin.noise(
            x * (contraction / dpr),
            y * (contraction / dpr),
            zOff,
          );

          if (noise > noiseThreshold) {
            const size = (noise + 0.28) * scaledGap * blobScale;

            circleCtx.beginPath();
            circleCtx.arc(x, y, size, 0, Math.PI * 2);
            circleCtx.fill();
          }
        }
      }

      blobCtx.filter = `blur(${blobBlur * dpr}px)`;
      blobCtx.drawImage(circleCanvas, 0, 0);
      blobCtx.filter = "none";

      const image = blobCtx.getImageData(0, 0, width, height);
      const data = image.data;
      const smoothness = 4;

      for (let i = 0; i < data.length; i += 4) {
        const alpha = data[i + 3];

        if (alpha > blobCutoff + smoothness) {
          data[i + 3] = 255;
        } else if (alpha < blobCutoff - smoothness) {
          data[i + 3] = 0;
        } else {
          const factor = (alpha - (blobCutoff - smoothness)) / (smoothness * 2);
          data[i + 3] = factor * 255;
        }

        data[i] = 0;
        data[i + 1] = 0;
        data[i + 2] = 0;
      }

      blobCtx.putImageData(image, 0, 0);
    };

    const draw = () => {
      buildUnifiedBlob();

      document.documentElement.style.setProperty(
        "--home-invert-mask",
        `url(${blobCanvas.toDataURL("image/png")})`,
      );

      zOff += speed;
      animationFrame = requestAnimationFrame(draw);
    };

    resize();
    draw();
    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrame);
      document.documentElement.style.removeProperty("--home-invert-mask");
    };
  }, []);

  return null;
}
