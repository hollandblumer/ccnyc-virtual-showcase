"use client";

import { useEffect, useId, useMemo, useState } from "react";

type WiggleTextProps = {
  amplitude?: number;
  amplitudeMin?: number;
  className?: string;
  fontSrc?: string;
  height: number;
  offsetX?: number;
  plainLetterCount?: number;
  pulseDelay?: number;
  pulseLetterDelay?: number;
  pulseSpeed?: number;
  timeScale?: number;
  xFalloff?: number;
  xPulseSpread?: number;
  yWindow?: number;
  yWindowSpread?: number;
  yFrequency?: number;
  size: number;
  text: string;
  width: number;
};

export default function WiggleText({
  amplitude = 2,
  amplitudeMin = 0,
  className,
  fontSrc = "/fonts/SVN-Gilroy-SemiBold.otf",
  height,
  offsetX = 0,
  plainLetterCount = 0,
  pulseDelay = 0,
  pulseLetterDelay = 0,
  pulseSpeed = 0,
  timeScale = 0.007,
  xFalloff = 0,
  xPulseSpread = 0,
  yWindow = 10,
  yWindowSpread = 0,
  yFrequency = 0.3,
  size,
  text,
  width,
}: WiggleTextProps) {
  const frameId = useId();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (
        typeof event.data === "object" &&
        event.data !== null &&
        "type" in event.data &&
        "id" in event.data &&
        event.data.type === "wiggle-text-ready" &&
        event.data.id === frameId
      ) {
        setIsLoaded(true);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [frameId]);

  const srcDoc = useMemo(() => {
    const safeFrameId = JSON.stringify(frameId);
    const safeFontSrc = JSON.stringify(fontSrc);
    const safeText = JSON.stringify(text);
    const safeWidth = JSON.stringify(width);
    const safeHeight = JSON.stringify(height);
    const safeSize = JSON.stringify(size);
    const safeOffsetX = JSON.stringify(offsetX);
    const safePlainLetterCount = JSON.stringify(plainLetterCount);
    const safeAmplitude = JSON.stringify(amplitude);
    const safeAmplitudeMin = JSON.stringify(amplitudeMin);
    const safeLetterCount = JSON.stringify(Math.max(text.length, 1));
    const safePulseDelay = JSON.stringify(pulseDelay);
    const safePulseLetterDelay = JSON.stringify(pulseLetterDelay);
    const safePulseSpeed = JSON.stringify(pulseSpeed);
    const safeTimeScale = JSON.stringify(timeScale);
    const safeXFalloff = JSON.stringify(xFalloff);
    const safeXPulseSpread = JSON.stringify(xPulseSpread);
    const safeYWindow = JSON.stringify(yWindow);
    const safeYWindowSpread = JSON.stringify(yWindowSpread);
    const safeYFrequency = JSON.stringify(yFrequency);

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <style>
    html, body {
      margin: 0;
      width: 100%;
      height: 100%;
      overflow: hidden;
      background: transparent;
    }
    body {
      display: flex;
      justify-content: center;
      align-items: center;
    }
    canvas {
      display: block;
      width: 100%;
      height: 100%;
    }
  </style>
</head>
<body>
<script src="https://cdn.jsdelivr.net/npm/p5@2.0.0/lib/p5.min.js"><\/script>
<script>
  p5.disableFriendlyErrors = true;
  const FRAME_ID = ${safeFrameId};
  let font, txt, wiggle, glyphModels = [], glyphShaders = [], glyphOffsets = [], glyphActivations = [];
  const plainLetterCount = ${safePlainLetterCount};

  async function setup() {
    createCanvas(${safeWidth}, ${safeHeight}, WEBGL);
    setAttributes({ antialias: true, alpha: true });
    font = await loadFont(${safeFontSrc});
    textSize(${safeSize});
    textFont(font);
    textAlign(CENTER, CENTER);
    txt = font.textToModel(${safeText}, 0, 0, { sampleFactor: 0.5 });
    wiggle = baseMaterialShader().modify(() => {
      const t = uniformFloat(() => millis());
      getWorldInputs((inputs) => {
        const y = inputs.position.y;
        const x = inputs.position.x;
        const normalizedX = clamp((x + ${safeWidth} * 0.5) / ${safeWidth}, 0.0, 1.0);
        const letterCount = float(${safeLetterCount});
        const letterIndex = min(letterCount - 1.0, floor(normalizedX * letterCount));
        const letterProgress = letterCount > 1.0 ? letterIndex / (letterCount - 1.0) : 0.0;
        const letterWindow = mix(${safeYWindow}, ${safeYWindow} * (1.0 + ${safeYWindowSpread}), letterProgress);
        const normalizedY = y / max(letterWindow, 0.001);
        const falloff = max(0.0, 1.0 - normalizedY * normalizedY);
        const stagger = max(0.0, (x + 22.0) * 28.0);
        const localTime = max(0.0, t - stagger);
        const activation = min(1.0, localTime * 0.0035);
        const rawPulseTime = t - ${safePulseDelay} - letterIndex * ${safePulseLetterDelay};
        const pulseStarted = step(0.0, rawPulseTime);
        const letterPulseTime = max(0.0, rawPulseTime);
        const letterPulseSpeed = ${safePulseSpeed} * mix(1.0, 1.32, letterProgress);
        const letterPhase = letterProgress * ${safeXPulseSpread} + letterIndex * 0.73;
        const runningPulse = 0.5 + 0.5 * sin(letterPulseTime * letterPulseSpeed + letterPhase);
        const pulse = ${safePulseSpeed} > 0.0
          ? mix(1.0, runningPulse, pulseStarted)
          : 1.0;
        const baseAmplitude = mix(${safeAmplitude}, ${safeAmplitudeMin}, pow(letterProgress, ${safeXFalloff}));
        const activeAmplitude = mix(${safeAmplitudeMin}, baseAmplitude, pulse);
        inputs.position.x += activeAmplitude * sin(localTime * ${safeTimeScale} + y * ${safeYFrequency}) * falloff * activation;
        return inputs;
      });
    });

    if (plainLetterCount > 0) {
      const chars = Array.from(${safeText});
      const tracking = ${safeSize} * 0.035;
      const glyphWidths = chars.map((char) => Math.max(1, textWidth(char)));
      const totalWidth = glyphWidths.reduce((sum, glyphWidth) => sum + glyphWidth, 0) + tracking * Math.max(0, chars.length - 1);
      let cursor = -totalWidth * 0.5;

      chars.forEach((char, index) => {
        const glyphWidth = glyphWidths[index];
        glyphOffsets.push(cursor + glyphWidth * 0.5);
        cursor += glyphWidth + tracking;
        glyphModels.push(font.textToModel(char, 0, 0, { sampleFactor: 0.5 }));
        glyphActivations.push(1);
        glyphShaders.push(
          baseMaterialShader().modify(() => {
            const t = uniformFloat(() => millis());
            const active = uniformFloat(() => glyphActivations[index]);
            getWorldInputs((inputs) => {
              const y = inputs.position.y;
              const normalizedY = y / 10.0;
              const falloff = max(0.0, 1.0 - normalizedY * normalizedY);
              const pulseTime = max(0.0, t - ${safePulseDelay});
              const pulse = ${safePulseSpeed} > 0.0 ? (0.5 + 0.5 * cos(pulseTime * ${safePulseSpeed})) : 1.0;
              const activeAmplitude = mix(${safeAmplitudeMin}, ${safeAmplitude}, pulse);
              inputs.position.x += activeAmplitude * sin(t * ${safeTimeScale} + y * ${safeYFrequency}) * falloff * active;
              return inputs;
            });
          })
        );
      });
    }

    requestAnimationFrame(() => {
      window.parent.postMessage({ type: 'wiggle-text-ready', id: FRAME_ID }, '*');
    });
  }

  function draw() {
    clear();
    noStroke();
    fill('#111111');

    if (plainLetterCount > 0 && glyphModels.length) {
      const len = glyphModels.length;
      const safeLen = Math.max(1, len);
      const cycle = millis() * 0.00075;
      const start = Math.floor(cycle) % safeLen;

      for (let i = 0; i < len; i++) {
        let shouldBePlain = false;
        for (let j = 0; j < plainLetterCount; j++) {
          if ((start + j) % safeLen === i) {
            shouldBePlain = true;
          }
        }
        const target = shouldBePlain ? 0.0 : 1.0;
        glyphActivations[i] += (target - glyphActivations[i]) * 0.08;
      }

      for (let i = 0; i < len; i++) {
        shader(glyphShaders[i]);
        push();
        translate(${safeOffsetX} + glyphOffsets[i], 0, 0);
        model(glyphModels[i]);
        pop();
      }
      return;
    }

    if (!txt || !wiggle) return;
    shader(wiggle);
    translate(${safeOffsetX}, 0, 0);
    model(txt);
  }
</script>
</body>
</html>`;
  }, [amplitude, amplitudeMin, fontSrc, frameId, height, offsetX, plainLetterCount, pulseDelay, pulseLetterDelay, pulseSpeed, size, text, timeScale, width, xFalloff, xPulseSpread, yFrequency, yWindow, yWindowSpread]);

  return (
    <iframe
      aria-hidden="true"
      className={className}
      sandbox="allow-scripts allow-same-origin"
      srcDoc={srcDoc}
      style={{
        background: "transparent",
        border: 0,
        height: `${height}px`,
        opacity: isLoaded ? 1 : 0,
        overflow: "hidden",
        transition: "opacity 120ms linear",
        visibility: isLoaded ? "visible" : "hidden",
        width: `${width}px`,
      }}
      title={`${text}-wiggle`}
    />
  );
}
