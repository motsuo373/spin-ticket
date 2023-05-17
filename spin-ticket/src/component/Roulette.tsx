import React from "react";
import dynamic from "next/dynamic";

import p5Types from "p5";
import { Center } from "@chakra-ui/react";

const Sketch = dynamic(() => import("react-p5").then((mod) => mod.default), {
  ssr: false,
});

interface Props {
  isSpinning: boolean;
}

const ROULETTE_NUM = 6;
const RATE = 1 / ROULETTE_NUM;
const PI = 3.14159265358979323846;

const rouletteColors = [
  "rgba(170, 221, 221, 1)",
  "rgba(255, 187, 187, 1)",
  "rgba(255, 255, 187, 1)",
  "rgba(255, 187, 221, 1)",
  "rgba(153, 221, 255, 1)",
  "rgba(170, 221, 170, 1)",
];

const rouletteText = ["1000", "3000", "0", "1000", "1000", "0"];

// 現在の角度
let angle = 0;
// 回転速度
let angleSpeed = 0.2;
let hasIncreasedSpeed = false;
let reachedTarget = false;

let targetAngle = 180 - 122;

const drawRoulette = (p5: p5Types, angle: number) => {
  for (let i = 0; i < ROULETTE_NUM; i++) {
    p5.push();
    const radians = p5.radians(angle + i * 360 * RATE);
    p5.rotate(radians);

    p5.stroke("rgba(0, 0, 0, 1)");
    p5.fill(rouletteColors[i]);
    p5.arc(0, 0, 350, 350, 0, PI * 2 * RATE, p5.PIE);
    p5.pop();

    p5.push();
    p5.rotate(radians);
    p5.translate(100, 60);
    p5.rotate(-radians);
    p5.textSize(20);
    p5.textAlign(p5.CENTER, p5.CENTER);
    p5.fill(0);
    p5.text(rouletteText[i], 0, 0);
    p5.pop();
  }
};

const updateAngleSpeed = (isSpinning: boolean) => {
  if (isSpinning) {
    if (!hasIncreasedSpeed) {
      angleSpeed = 10;
      hasIncreasedSpeed = true;
    }
    if (!reachedTarget && angleSpeed > 1) {
      angleSpeed -= 0.01;
    } else if (Math.trunc(angle) % 360 === targetAngle) {
      reachedTarget = true;
    }

    if (reachedTarget) {
      angleSpeed -= 0.005;
      if (angleSpeed < 0) {
        angleSpeed = 0;
      }
    }
  }
};

export const Roulette: React.FC<Props> = (props: Props) => {
  const preload = (p5: p5Types) => {
    // Load the pattern image
  };

  const setup = (p5: p5Types, canvasParentRef: Element) => {
    p5.createCanvas(400, 400).parent(canvasParentRef);
    drawRoulette(p5, angle);
  };

  const draw = (p5: p5Types) => {
    p5.background("rgba(255,255,255, 1)");
    p5.translate(p5.width / 2, p5.height / 2);

    updateAngleSpeed(props.isSpinning);

    angle += angleSpeed;

    drawRoulette(p5, angle);
  };

  return (
    <>
      <Center h="100%">
        <Sketch preload={preload} setup={setup} draw={draw} />
      </Center>
    </>
  );
};
