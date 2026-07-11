import type { AtmosphereScene, CreatureId } from "@/data/portfolio";

const TAU = Math.PI * 2;

type CreatureFrame = Readonly<{
  time: number;
  transit: number;
  alpha: number;
  width: number;
  height: number;
}>;

export type SeaCreature = Readonly<{
  id: CreatureId;
  depth: number;
  span: number;
  draw: (context: CanvasRenderingContext2D, frame: CreatureFrame) => void;
}>;

type Placement = AtmosphereScene["creatures"][number];

type SchoolFish = Readonly<{
  phase: number;
  speed: number;
  radiusX: number;
  radiusY: number;
  blink: number;
  size: number;
}>;

function seededRandom(seed: number) {
  let state = seed >>> 0;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

function transitY(frame: CreatureFrame, gain = 0.78) {
  return frame.height * (0.5 - frame.transit * gain);
}

function createSiphonophore(placement: Placement): SeaCreature {
  return {
    ...placement,
    draw(context, frame) {
      const { time, width, height, alpha } = frame;
      const centerY = transitY(frame, 0.72);
      const pointCount = 64;
      const drift = Math.sin(time * 0.045) * 0.05;
      const points: Array<readonly [number, number, number]> = [];

      for (let index = 0; index <= pointCount; index += 1) {
        const ratio = index / pointCount;
        points.push([
          width * (-0.12 + drift) + ratio * width * 1.24,
          centerY +
            Math.sin(ratio * 5.6 + time * 0.38) * height * 0.05 +
            (ratio - 0.5) * height * 0.24,
          ratio,
        ]);
      }

      context.save();
      context.globalAlpha = alpha;
      context.strokeStyle = "rgba(185, 232, 238, 0.13)";
      context.lineWidth = 1.4;
      context.beginPath();
      points.forEach(([x, y], index) => (index ? context.lineTo(x, y) : context.moveTo(x, y)));
      context.stroke();

      const pulse = ((time * 0.13) % 1.6) - 0.3;
      const secondPulse = pulse - 0.5;
      for (let index = 0; index <= pointCount; index += 2) {
        const [x, y, ratio] = points[index];
        const [nextX, nextY] = points[Math.min(index + 2, pointCount)];
        const rotation = Math.atan2(nextY - y, nextX - x);
        const radius = 3.4 + 2.4 * (0.5 + 0.5 * Math.sin(ratio * 23.7 + 1.7));

        context.fillStyle = "rgba(190, 235, 240, 0.12)";
        context.beginPath();
        context.ellipse(x, y, radius * 1.6, radius, rotation, 0, TAU);
        context.fill();
        context.strokeStyle = "rgba(200, 240, 245, 0.08)";
        context.lineWidth = 0.8;
        context.stroke();

        if (index % 4 === 0) {
          context.strokeStyle = "rgba(170, 220, 230, 0.065)";
          context.lineWidth = 0.9;
          context.beginPath();
          context.moveTo(x, y + radius * 0.7);
          context.quadraticCurveTo(
            x - 5,
            y + 16,
            x + Math.sin(time * 0.7 + index * 0.8) * 5,
            y + 30 + (index % 8) * 2,
          );
          context.stroke();
        }

        const glow =
          Math.exp(-Math.pow((ratio - pulse) / 0.055, 2)) +
          0.55 * Math.exp(-Math.pow((ratio - secondPulse) / 0.05, 2));
        if (glow > 0.02) {
          const gradient = context.createRadialGradient(x, y, 0, x, y, 15);
          gradient.addColorStop(0, `rgba(120, 245, 215, ${0.5 * glow})`);
          gradient.addColorStop(1, "rgba(120, 245, 215, 0)");
          context.fillStyle = gradient;
          context.beginPath();
          context.arc(x, y, 15, 0, TAU);
          context.fill();
        }
      }
      context.restore();
    },
  };
}

function createScatteringLayer(placement: Placement): SeaCreature {
  const random = seededRandom(800);
  const bodies = Array.from({ length: 84 }, (_, index) => ({
    horizontal: random(),
    vertical: random() - 0.5,
    phase: random() * TAU,
    speed: 0.05 + random() * 0.11,
    length: 2.6 + random() * 4.8,
    twinkle: 1.4 + random() * 2.8,
    glint: index % 6 === 0,
  }));

  return {
    ...placement,
    draw(context, frame) {
      const { time, width, height, alpha } = frame;
      const centerY = transitY(frame, 0.8);
      const thickness = height * 0.15;
      context.save();

      const layer = context.createLinearGradient(
        0,
        centerY - thickness * 0.8,
        0,
        centerY + thickness * 0.8,
      );
      layer.addColorStop(0, "rgba(96, 136, 150, 0)");
      layer.addColorStop(0.5, `rgba(96, 136, 150, ${0.055 * alpha})`);
      layer.addColorStop(1, "rgba(96, 136, 150, 0)");
      context.fillStyle = layer;
      context.fillRect(0, centerY - thickness * 0.8, width, thickness * 1.6);

      bodies.forEach((body) => {
        const drift =
          (body.horizontal +
            time * 0.004 * (0.4 + body.speed) +
            Math.sin(time * body.speed + body.phase) * 0.015) %
          1;
        const x = ((drift + 1) % 1) * width;
        const y =
          centerY +
          body.vertical * thickness +
          Math.sin(time * body.speed * 3.1 + body.phase * 2) * 4;
        const direction = Math.cos(time * body.speed + body.phase) >= 0 ? 1 : -1;
        const bodyAlpha = (0.06 + 0.1 * Math.abs(body.vertical) * 2) * alpha;
        context.strokeStyle = `rgba(168, 205, 215, ${bodyAlpha})`;
        context.lineWidth = 1.1;
        context.beginPath();
        context.moveTo(x - body.length * direction, y + 0.4);
        context.lineTo(x + body.length * direction, y - 0.4);
        context.stroke();

        if (!body.glint) return;
        const twinkle = Math.pow(Math.max(0, Math.sin(time * body.twinkle + body.phase * 3)), 10);
        if (twinkle <= 0.03) return;
        const glow = context.createRadialGradient(x, y, 0, x, y, 4.5);
        glow.addColorStop(0, `rgba(140, 250, 225, ${0.5 * twinkle * alpha})`);
        glow.addColorStop(1, "rgba(140, 250, 225, 0)");
        context.fillStyle = glow;
        context.beginPath();
        context.arc(x, y, 4.5, 0, TAU);
        context.fill();
      });
      context.restore();
    },
  };
}

function drawLanternfish(
  context: CanvasRenderingContext2D,
  fish: SchoolFish,
  x: number,
  y: number,
  direction: number,
  time: number,
  alpha: number,
) {
  context.save();
  context.translate(x, y);
  context.scale(direction * fish.size, fish.size);
  context.fillStyle = `rgba(88, 116, 128, ${0.3 * alpha})`;
  context.beginPath();
  context.moveTo(-15, 0);
  context.quadraticCurveTo(-6, -5.4, 4, -4.2);
  context.quadraticCurveTo(11, -2.6, 14, 0);
  context.quadraticCurveTo(11, 2.6, 4, 4.4);
  context.quadraticCurveTo(-6, 5.6, -15, 0);
  context.fill();
  context.beginPath();
  context.moveTo(-14, 0);
  context.lineTo(-20, -4.5);
  context.lineTo(-17.5, 0);
  context.lineTo(-20, 4.5);
  context.closePath();
  context.fill();
  context.fillStyle = `rgba(190, 225, 235, ${0.5 * alpha})`;
  context.beginPath();
  context.arc(9, -1, 1.4, 0, TAU);
  context.fill();

  [-11, -8, -5, -2, 1, 4, 7, 10].forEach((offset, index) => {
    const blink = Math.pow(
      Math.max(0, Math.sin(time * fish.blink + index * 1.71 + fish.phase * 2.3)),
      22,
    );
    const dotAlpha = (0.16 + 0.84 * blink) * alpha;
    const radius = 1.15 + blink * 1.15;
    const glow = context.createRadialGradient(offset, 3.6, 0, offset, 3.6, radius * 3.4);
    glow.addColorStop(0, `rgba(140, 250, 225, ${dotAlpha})`);
    glow.addColorStop(1, "rgba(140, 250, 225, 0)");
    context.fillStyle = glow;
    context.beginPath();
    context.arc(offset, 3.6, radius * 3.4, 0, TAU);
    context.fill();
  });
  context.restore();
}

function createLanternfish(placement: Placement): SeaCreature {
  const random = seededRandom(1210);
  const school: SchoolFish[] = Array.from({ length: 11 }, () => ({
    phase: random() * TAU,
    speed: 0.24 + random() * 0.22,
    radiusX: 0.09 + random() * 0.16,
    radiusY: 0.05 + random() * 0.11,
    blink: 2.2 + random() * 3.4,
    size: 0.8 + random() * 0.5,
  }));

  return {
    ...placement,
    draw(context, frame) {
      const { time, width, height, alpha } = frame;
      const centerY = transitY(frame, 0.7);
      const centerX = width * (0.56 + 0.2 * Math.sin(time * 0.06));
      school.forEach((fish) => {
        const x = centerX + Math.sin(time * fish.speed + fish.phase) * width * fish.radiusX;
        const y =
          centerY + Math.cos(time * fish.speed * 0.83 + fish.phase * 1.7) * height * fish.radiusY;
        const velocity = Math.cos(time * fish.speed + fish.phase);
        drawLanternfish(context, fish, x, y, velocity >= 0 ? 1 : -1, time, alpha);
      });
    },
  };
}

function createAnglerfish(placement: Placement): SeaCreature {
  return {
    ...placement,
    draw(context, frame) {
      const { time, width, alpha } = frame;
      const centerY = transitY(frame, 0.66);
      const centerX = width * 0.71 + Math.sin(time * 0.05) * width * 0.03;
      const lureX = centerX - Math.min(150, width * 0.12) + Math.sin(time * 0.55) * 26;
      const lureY = centerY - 26 + Math.sin(time * 0.41 + 1.2) * 15;
      const flicker =
        0.66 + 0.34 * (0.5 + 0.25 * Math.sin(time * 6.1) + 0.25 * Math.sin(time * 9.7));
      const glowAlpha = alpha * flicker;
      const bodyX = centerX + Math.min(70, width * 0.06);

      context.save();
      const body = new Path2D();
      body.moveTo(bodyX - 62, centerY + 6);
      body.quadraticCurveTo(bodyX - 66, centerY - 44, bodyX - 8, centerY - 52);
      body.quadraticCurveTo(bodyX + 66, centerY - 58, bodyX + 96, centerY - 14);
      body.quadraticCurveTo(bodyX + 112, centerY + 12, bodyX + 88, centerY + 30);
      body.quadraticCurveTo(bodyX + 40, centerY + 52, bodyX - 22, centerY + 44);
      body.quadraticCurveTo(bodyX - 58, centerY + 36, bodyX - 62, centerY + 6);
      const bodyGradient = context.createRadialGradient(lureX, lureY, 10, lureX, lureY, 320);
      bodyGradient.addColorStop(0, `rgba(52, 84, 86, ${0.34 * glowAlpha})`);
      bodyGradient.addColorStop(0.45, `rgba(20, 32, 36, ${0.5 * alpha})`);
      bodyGradient.addColorStop(1, `rgba(6, 10, 13, ${0.62 * alpha})`);
      context.fillStyle = bodyGradient;
      context.fill(body);

      context.save();
      context.clip(body);
      const face = context.createRadialGradient(lureX, lureY, 4, lureX, lureY, 190);
      face.addColorStop(0, `rgba(126, 214, 196, ${0.3 * glowAlpha})`);
      face.addColorStop(0.5, `rgba(80, 140, 132, ${0.1 * glowAlpha})`);
      face.addColorStop(1, "rgba(80, 140, 132, 0)");
      context.fillStyle = face;
      context.fillRect(bodyX - 140, centerY - 100, 280, 200);
      context.restore();

      const gape = 0.16 + 0.05 * Math.sin(time * 0.5);
      context.fillStyle = `rgba(1, 2, 4, ${0.85 * alpha})`;
      context.beginPath();
      context.moveTo(bodyX - 62, centerY + 4);
      context.quadraticCurveTo(
        bodyX - 30,
        centerY - 4 - 60 * gape,
        bodyX - 2,
        centerY - 6 - 40 * gape,
      );
      context.quadraticCurveTo(bodyX - 26, centerY + 8, bodyX - 8, centerY + 26);
      context.quadraticCurveTo(bodyX - 40, centerY + 26, bodyX - 62, centerY + 4);
      context.fill();

      context.strokeStyle = `rgba(230, 255, 247, ${0.32 * glowAlpha})`;
      context.lineWidth = 1.1;
      for (let index = 0; index < 7; index += 1) {
        const ratio = index / 6;
        const x = bodyX - 57 + index * 8.2;
        const y = centerY - 1 - 46 * gape * (0.35 + 0.65 * Math.sin(0.4 + ratio * 2.6));
        const length = 7 + (index % 3) * 3.5;
        context.beginPath();
        context.moveTo(x, y);
        context.quadraticCurveTo(x + 3.4, y + length * 0.55, x + 1.2, y + length);
        context.stroke();
      }

      context.fillStyle = `rgba(170, 235, 225, ${0.28 * glowAlpha})`;
      context.beginPath();
      context.arc(bodyX - 18, centerY - 24, 3.1, 0, TAU);
      context.fill();
      context.strokeStyle = `rgba(150, 220, 210, ${0.14 * glowAlpha})`;
      context.lineWidth = 1;
      context.beginPath();
      context.moveTo(bodyX - 26, centerY - 46);
      context.quadraticCurveTo((bodyX - 26 + lureX) / 2 - 14, centerY - 78, lureX, lureY);
      context.stroke();

      let lure = context.createRadialGradient(lureX, lureY, 0, lureX, lureY, 95);
      lure.addColorStop(0, `rgba(120, 245, 215, ${0.16 * glowAlpha})`);
      lure.addColorStop(1, "rgba(120, 245, 215, 0)");
      context.fillStyle = lure;
      context.beginPath();
      context.arc(lureX, lureY, 95, 0, TAU);
      context.fill();
      lure = context.createRadialGradient(lureX, lureY, 0, lureX, lureY, 7);
      lure.addColorStop(0, `rgba(242, 255, 249, ${0.95 * glowAlpha})`);
      lure.addColorStop(1, "rgba(242, 255, 249, 0)");
      context.fillStyle = lure;
      context.beginPath();
      context.arc(lureX, lureY, 7, 0, TAU);
      context.fill();
      context.restore();
    },
  };
}

function createDumboOctopus(placement: Placement): SeaCreature {
  return {
    ...placement,
    draw(context, frame) {
      const { time, width, height, alpha } = frame;
      const centerY = transitY(frame, 0.7) + Math.sin(time * 0.5) * 9;
      const horizontalAnchor = width >= 720 ? 0.86 : 0.74;
      const centerX = width * (horizontalAnchor - 0.05 * Math.sin(time * 0.045 + 2));
      const tilt = Math.sin(time * 0.35) * 0.13;
      const flap = Math.sin(time * 0.85);
      context.save();

      const wash = context.createRadialGradient(
        centerX - width * 0.28,
        centerY - 40,
        20,
        centerX - width * 0.28,
        centerY - 40,
        width * 0.42,
      );
      wash.addColorStop(0, `rgba(255, 238, 214, ${0.055 * alpha})`);
      wash.addColorStop(1, "rgba(255, 238, 214, 0)");
      context.fillStyle = wash;
      context.fillRect(0, 0, width, height);

      context.translate(centerX, centerY);
      context.rotate(tilt);
      [-1, 1].forEach((side) => {
        context.save();
        context.translate(side * 40, -30);
        context.rotate(side * (0.62 + flap * 0.5));
        const fin = context.createRadialGradient(0, 0, 2, 0, 0, 26);
        fin.addColorStop(0, `rgba(214, 166, 178, ${0.42 * alpha})`);
        fin.addColorStop(1, `rgba(180, 128, 142, ${0.16 * alpha})`);
        context.fillStyle = fin;
        context.beginPath();
        context.ellipse(0, 0, 25, 11, 0, 0, TAU);
        context.fill();
        context.restore();
      });

      const mantle = context.createRadialGradient(-22, -26, 8, 0, -4, 78);
      mantle.addColorStop(0, `rgba(222, 178, 190, ${0.5 * alpha})`);
      mantle.addColorStop(0.55, `rgba(186, 136, 150, ${0.4 * alpha})`);
      mantle.addColorStop(1, `rgba(120, 80, 94, ${0.22 * alpha})`);
      context.fillStyle = mantle;
      context.beginPath();
      context.ellipse(0, -8, 52, 46, 0, 0, TAU);
      context.fill();

      context.beginPath();
      context.moveTo(-50, 8);
      for (let index = 0; index <= 8; index += 1) {
        const x = -50 + (index / 8) * 100;
        const wobble = Math.sin(time * 1.25 + index * 1.4) * 4;
        const y = 34 + Math.sin(index * 1.05 + 0.6) * 7 + wobble;
        context.quadraticCurveTo(x - 6.25, y + 13, x, y);
      }
      context.quadraticCurveTo(52, 2, 50, -2);
      context.lineTo(-50, -2);
      context.closePath();
      const skirt = context.createLinearGradient(0, -2, 0, 46);
      skirt.addColorStop(0, `rgba(196, 146, 160, ${0.4 * alpha})`);
      skirt.addColorStop(1, `rgba(140, 94, 108, ${0.24 * alpha})`);
      context.fillStyle = skirt;
      context.fill();

      [-1, 1].forEach((side) => {
        context.fillStyle = `rgba(34, 20, 28, ${0.75 * alpha})`;
        context.beginPath();
        context.arc(side * 19, -14, 4.4, 0, TAU);
        context.fill();
        context.fillStyle = `rgba(255, 240, 230, ${0.4 * alpha})`;
        context.beginPath();
        context.arc(side * 19 - 1.4, -15.6, 1.2, 0, TAU);
        context.fill();
      });
      context.restore();
    },
  };
}

const factories: Readonly<Record<CreatureId, (placement: Placement) => SeaCreature>> = {
  siphonophore: createSiphonophore,
  "scattering-layer": createScatteringLayer,
  lanternfish: createLanternfish,
  anglerfish: createAnglerfish,
  "dumbo-octopus": createDumboOctopus,
};

export function createCreatures(scene: AtmosphereScene): readonly SeaCreature[] {
  return scene.creatures.map((placement) => factories[placement.id](placement));
}
