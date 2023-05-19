import React, { useEffect, useMemo } from "react";
import dynamic from "next/dynamic";

import p5Types from "p5";
import { Center } from "@chakra-ui/react";

const Sketch = dynamic(() => import("react-p5").then((mod) => mod.default), {
  ssr: false,
});

interface Props {
  isSpinning: boolean;
  setIsSpinEnd: React.Dispatch<React.SetStateAction<boolean>>;
}

const ROULETTE_NUM = 6;
const RATE = 1 / ROULETTE_NUM;
const PI = 3.14159265358979323846;

const rouletteColors = [
  "rgba(197, 48, 48, 1)",
  "rgba(26, 32, 44, 1)",
  "rgba(197, 48, 48, 1)",
  "rgba(26, 32, 44, 1)",
  "rgba(197, 48, 48, 1)",
  "rgba(246, 173, 85, 1)",
];

const rouletteText = ["1000", "0", "1000", "0", "1000", "3000"];

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

    p5.stroke("rgba(95, 55, 14, 1)");
    p5.strokeWeight(5);
    p5.fill(rouletteColors[i]);
    p5.arc(0, 0, 330, 330, 0, PI * 2 * RATE, p5.PIE);
    p5.pop();

    p5.push();
    p5.rotate(radians);
    p5.translate(100, 60);
    p5.rotate(-radians);
    p5.textFont("Abril Fatface");
    p5.textSize(32);
    p5.textAlign(p5.CENTER, p5.CENTER);
    p5.fill(255);
    p5.text(rouletteText[i], 0, 0);
    p5.pop();
  }
  p5.noLoop();
};

// 追加：フラグ変数
let hasSpinToEnd = false;

const updateAngleSpeed = (
  p5: p5Types,
  isSpinning: boolean,
  setIsSpinEnd: any
) => {
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
        if (!hasSpinToEnd) {
          setTimeout(() => {
            setIsSpinEnd(true);
            hasSpinToEnd = true;
          }, 3000);
        }
      }
    }
  }
  p5.noLoop();
};

// 下向きの三角形（針）を描画する関数を追加
const drawNeedle = (p5: p5Types) => {
  p5.push();
  p5.fill("#ff0000"); // 三角形の色
  p5.stroke(255);
  p5.strokeWeight(3);
  p5.triangle(0, -150, -10, -175, 10, -175);
  p5.pop();
};

export const Roulette: React.FC<Props> = (props: Props) => {
  const preload = (p5: p5Types) => {
    // Load the pattern image
  };
  const setup = (p5: p5Types, canvasParentRef: Element) => {
    p5.createCanvas(360, 360).parent(canvasParentRef);

    drawRoulette(p5, angle);
    drawNeedle(p5);
  };

  const draw = (p5: p5Types) => {
    p5.background("rgba(47,133,90, 1)");
    p5.translate(p5.width / 2, p5.height / 2);

    updateAngleSpeed(p5, props.isSpinning, props.setIsSpinEnd);

    angle += angleSpeed;

    drawRoulette(p5, angle);
    drawNeedle(p5);
    p5.loop();
  };
  return (
    <>
      <Center h="100%">
        <Sketch preload={preload} setup={setup} draw={draw} />
      </Center>
    </>
  );
};
