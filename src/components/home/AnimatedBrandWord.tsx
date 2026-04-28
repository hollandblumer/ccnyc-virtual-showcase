"use client";

import WiggleText from "./WiggleText";

type AnimatedBrandWordProps = {
  className?: string;
  text: string;
};

const WORD_WIDTHS: Record<string, number> = {
  CCNYC: 350,
};

export default function AnimatedBrandWord({
  className,
  text,
}: AnimatedBrandWordProps) {
  return (
    <WiggleText
      amplitude={2}
      amplitudeMin={0}
      className={className}
      height={110}
      pulseDelay={0}
      pulseLetterDelay={320}
      pulseSpeed={0.00115}
      size={74}
      text={text}
      timeScale={0.007}
      width={WORD_WIDTHS[text] ?? 350}
      xFalloff={1.25}
      xPulseSpread={3.8}
      yFrequency={0.3}
      yWindow={10}
      yWindowSpread={0.24}
    />
  );
}
