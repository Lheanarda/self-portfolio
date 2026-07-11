import type { AtmosphereScene } from "@/data/portfolio";
import { createCreatures } from "./creatures";

const TAU = Math.PI * 2;
const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
const lerp = (from: number, to: number, amount: number) => from + (to - from) * amount;
const smooth = (from: number, to: number, value: number) => {
  const amount = clamp((value - from) / (to - from), 0, 1);
  return amount * amount * (3 - 2 * amount);
};

const COLOR_RAMP = [
  [0, 15, 126, 138],
  [60, 13, 105, 122],
  [150, 11, 75, 98],
  [250, 10, 59, 92],
  [420, 8, 44, 72],
  [650, 6, 32, 55],
  [900, 5, 23, 41],
  [1200, 4, 15, 29],
  [1600, 3, 10, 20],
  [2100, 2, 6, 13],
  [2800, 1, 4, 9],
  [3600, 1, 2, 5],
  [4800, 0, 1, 3],
  [6200, 0, 0, 1],
  [8000, 0, 0, 0],
] as const;

type SnowParticle = {
  x: number;
  y: number;
  radius: number;
  parallax: number;
  phase: number;
  alpha: number;
};

type PlanktonFlash = {
  x: number;
  y: number;
  parallax: number;
  life: number;
  duration: number;
  radius: number;
};

type Amphipod = {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  phase: number;
  scale: number;
  retargetIn: number;
};

type FloorGeometry = Readonly<{
  remaining: number;
  y: number;
  lightAlpha: number;
  centerX: number;
}>;

export type SeaRenderState = Readonly<{
  time: number;
  depth: number;
  depthDelta: number;
  now: number;
  reducedMotion: boolean;
  deltaTime: number;
}>;

function seededRandom(seed: number) {
  let state = seed >>> 0;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

export function ambientColor(depth: number): readonly [number, number, number] {
  if (depth <= COLOR_RAMP[0][0]) {
    return [COLOR_RAMP[0][1], COLOR_RAMP[0][2], COLOR_RAMP[0][3]];
  }

  for (let index = 1; index < COLOR_RAMP.length; index += 1) {
    const next = COLOR_RAMP[index];
    if (depth <= next[0]) {
      const previous = COLOR_RAMP[index - 1];
      const amount = (depth - previous[0]) / (next[0] - previous[0]);
      return [
        lerp(previous[1], next[1], amount),
        lerp(previous[2], next[2], amount),
        lerp(previous[3], next[3], amount),
      ];
    }
  }

  return [0, 0, 0];
}

export class PortfolioSea {
  private readonly context: CanvasRenderingContext2D;
  private readonly creatures;
  private readonly random = seededRandom(47);
  private width = 0;
  private height = 0;
  private dpr = 1;
  private snow: SnowParticle[] = [];
  private plankton: PlanktonFlash[] = [];
  private amphipods: Amphipod[] = [];
  private readonly floorBumps: number[];
  private lightsOnAt = -1;

  constructor(
    private readonly canvas: HTMLCanvasElement,
    private readonly scene: AtmosphereScene,
    private readonly maxDepth: number,
  ) {
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Portfolio sea canvas requires a 2D rendering context.");
    this.context = context;
    this.creatures = createCreatures(scene);
    this.floorBumps = Array.from(
      { length: 120 },
      (_, index) =>
        Math.sin(index * 0.9) * 4 + Math.sin(index * 2.7 + 1.3) * 2.5 + Math.sin(index * 0.31) * 6,
    );
    this.resize();
  }

  resize() {
    this.dpr = Math.min(2, window.devicePixelRatio || 1);
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = Math.round(this.width * this.dpr);
    this.canvas.height = Math.round(this.height * this.dpr);
    this.context.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    this.initializeSnow();
  }

  private initializeSnow() {
    const count = clamp(Math.round((this.width * this.height) / 8600), 60, 210);
    this.snow = Array.from({ length: count }, () => ({
      x: this.random() * this.width,
      y: this.random() * this.height,
      radius: 0.4 + this.random() * 1.5,
      parallax: 0.35 + this.random() * 0.9,
      phase: this.random() * TAU,
      alpha: 0.2 + this.random() * 0.55,
    }));
  }

  private drawSurface(time: number, depth: number) {
    const context = this.context;
    const { width, height } = this;
    const { sheetUntilDepth, sunUntilDepth, raysUntilDepth } = this.scene.surface;

    if (depth < sheetUntilDepth) {
      const alpha = 1 - depth / sheetUntilDepth;
      const baseY = height * 0.055 - depth * 3.4;
      for (let pass = 0; pass < 2; pass += 1) {
        context.strokeStyle = `rgba(215, 250, 248, ${(pass ? 0.12 : 0.3) * alpha})`;
        context.lineWidth = pass ? 4 : 1.6;
        context.beginPath();
        for (let x = -10; x <= width + 10; x += 14) {
          const y =
            baseY +
            Math.sin(x * 0.011 + time * 0.9 + pass) * 6 +
            Math.sin(x * 0.027 - time * 0.6) * 3.4;
          if (x === -10) context.moveTo(x, y);
          else context.lineTo(x, y);
        }
        context.stroke();
      }
    }

    if (depth < sunUntilDepth) {
      const alpha = Math.pow(1 - depth / sunUntilDepth, 1.4);
      const x = width * 0.66;
      const y = height * 0.15 - depth * 2.1;
      const radius = 46 + Math.sin(time * 2.1) * 3 + Math.sin(time * 3.7) * 2;
      context.save();
      context.globalCompositeOperation = "lighter";
      const halo = context.createRadialGradient(x, y, 0, x, y, radius * 6.4);
      halo.addColorStop(0, `rgba(160, 235, 230, ${0.13 * alpha})`);
      halo.addColorStop(1, "rgba(160, 235, 230, 0)");
      context.fillStyle = halo;
      context.beginPath();
      context.arc(x, y, radius * 6.4, 0, TAU);
      context.fill();
      const core = context.createRadialGradient(x, y, 0, x, y, radius);
      core.addColorStop(0, `rgba(240, 255, 252, ${0.85 * alpha})`);
      core.addColorStop(0.7, `rgba(220, 250, 246, ${0.5 * alpha})`);
      core.addColorStop(1, "rgba(220, 250, 246, 0)");
      context.fillStyle = core;
      context.beginPath();
      context.arc(x, y, radius, 0, TAU);
      context.fill();
      context.restore();
    }

    if (depth < raysUntilDepth) {
      const alpha = Math.pow(1 - depth / raysUntilDepth, 1.6);
      context.save();
      context.globalCompositeOperation = "lighter";
      for (let index = 0; index < 6; index += 1) {
        const x = width * (0.05 + 0.17 * index) + Math.sin(time * 0.06 + index * 1.31) * 46;
        const topWidth = 24 + (index % 3) * 18;
        const slant = 90 + Math.sin(time * 0.045 + index) * 44;
        const ray = context.createLinearGradient(0, -40, 0, height);
        ray.addColorStop(0, `rgba(200, 245, 240, ${0.085 * alpha})`);
        ray.addColorStop(1, "rgba(200, 245, 240, 0)");
        context.fillStyle = ray;
        context.beginPath();
        context.moveTo(x, -40);
        context.lineTo(x + topWidth, -40);
        context.lineTo(x + topWidth * 3.4 + slant, height);
        context.lineTo(x + slant - topWidth * 1.2, height);
        context.closePath();
        context.fill();
      }
      context.restore();
    }
  }

  private drawTrenchWalls(time: number, depth: number, reducedMotion: boolean) {
    const context = this.context;
    const { width, height } = this;
    const amount = smooth(
      this.scene.trench.wallsStartDepth,
      this.scene.trench.wallsFullDepth,
      depth,
    );
    if (amount <= 0.005) return;
    const scroll = depth * 3.1;
    const baseWidth = width * (0.045 + 0.125 * amount);
    const jaggedAt = (y: number, side: number) => {
      const position = (y + scroll) * 0.013 + side * 37.7;
      return (
        Math.sin(position) * 14 +
        Math.sin(position * 2.63 + 1.4) * 8 +
        Math.sin(position * 0.47) * 30
      );
    };

    [0, 1].forEach((side) => {
      const direction = side ? -1 : 1;
      const originX = side ? width + 24 : -24;
      context.beginPath();
      context.moveTo(originX, -24);
      for (let index = 0; index <= 30; index += 1) {
        const y = -24 + (index / 30) * (height + 48);
        context.lineTo(originX + direction * (baseWidth + jaggedAt(y, side) * amount), y);
      }
      context.lineTo(originX, height + 24);
      context.closePath();
      const wall = context.createLinearGradient(
        side ? width : 0,
        0,
        side ? width - baseWidth * 2.6 : baseWidth * 2.6,
        0,
      );
      wall.addColorStop(0, `rgba(9, 14, 18, ${0.95 * amount})`);
      wall.addColorStop(0.7, `rgba(5, 9, 12, ${0.8 * amount})`);
      wall.addColorStop(1, "rgba(3, 6, 8, 0)");
      context.fillStyle = wall;
      context.fill();
      context.strokeStyle = `rgba(122, 168, 178, ${0.09 * amount})`;
      context.lineWidth = 1;
      context.stroke();

      for (let fleck = 0; fleck < 6; fleck += 1) {
        const y =
          ((((fleck * 613.7 + side * 271 - scroll) % (height + 120)) + (height + 120)) %
            (height + 120)) -
          60;
        const x = originX + direction * (baseWidth + jaggedAt(y, side) * amount) - direction * 3;
        const pulse = reducedMotion
          ? 0.55
          : 0.3 + 0.7 * Math.max(0, Math.sin(time * 0.7 + fleck * 2.1 + side * 3));
        const alpha = 0.45 * amount * pulse;
        if (alpha <= 0.02) continue;
        const glow = context.createRadialGradient(x, y, 0, x, y, 5);
        glow.addColorStop(0, `rgba(100, 240, 210, ${alpha})`);
        glow.addColorStop(1, "rgba(100, 240, 210, 0)");
        context.fillStyle = glow;
        context.beginPath();
        context.arc(x, y, 5, 0, TAU);
        context.fill();
      }
    });
  }

  private floorGeometry(depth: number): FloorGeometry | null {
    const remaining = this.maxDepth - depth;
    if (remaining > this.scene.floor.visibleWithinMeters) return null;
    const y =
      this.height * 0.84 +
      remaining * ((this.height * 1.08) / this.scene.floor.visibleWithinMeters);
    return {
      remaining,
      y,
      lightAlpha: smooth(
        this.scene.floor.lightsWithinMeters,
        this.scene.floor.lightsWithinMeters - 90,
        remaining,
      ),
      centerX: this.width * 0.5,
    };
  }

  private drawFloor(
    time: number,
    depth: number,
    now: number,
    reducedMotion: boolean,
    deltaTime: number,
  ) {
    const geometry = this.floorGeometry(depth);
    if (!geometry) {
      this.lightsOnAt = -1;
      return;
    }
    const context = this.context;
    const { width, height } = this;
    const { remaining, y, centerX } = geometry;
    let lightAlpha = geometry.lightAlpha;

    if (lightAlpha > 0.01 && this.lightsOnAt < 0) this.lightsOnAt = now;
    if (this.lightsOnAt > 0 && !reducedMotion) {
      const elapsed = (now - this.lightsOnAt) / 1000;
      if (elapsed < 0.9) {
        const gate =
          elapsed < 0.12 ? 1 : elapsed < 0.22 ? 0.2 : elapsed < 0.34 ? 1 : elapsed < 0.42 ? 0.4 : 1;
        lightAlpha *= gate;
      }
    }

    const poolRadius = width * 0.31;
    const apexY = -height * 0.32;
    if (lightAlpha > 0.01) {
      context.save();
      context.globalCompositeOperation = "lighter";
      [-width * 0.09, width * 0.09].forEach((offset) => {
        const apexX = centerX + offset * 0.4;
        const light = context.createLinearGradient(0, apexY, 0, y);
        light.addColorStop(0, `rgba(255, 236, 202, ${0.02 * lightAlpha})`);
        light.addColorStop(0.55, `rgba(255, 236, 202, ${0.075 * lightAlpha})`);
        light.addColorStop(1, `rgba(255, 236, 202, ${0.13 * lightAlpha})`);
        context.fillStyle = light;
        context.beginPath();
        context.moveTo(apexX - 26, apexY);
        context.lineTo(apexX + 26, apexY);
        context.lineTo(centerX + offset + poolRadius * 0.78, y + 30);
        context.lineTo(centerX + offset - poolRadius * 0.78, y + 30);
        context.closePath();
        context.fill();
      });
      context.restore();
    }

    if (y < height + 60) {
      context.save();
      context.beginPath();
      context.moveTo(-20, y + this.floorBumps[0]);
      const step = (width + 40) / 90;
      for (let index = 1; index <= 90; index += 1) {
        const x = -20 + index * step;
        context.lineTo(x, y + this.floorBumps[index % this.floorBumps.length]);
      }
      context.lineTo(width + 20, height + 80);
      context.lineTo(-20, height + 80);
      context.closePath();
      const sediment = context.createLinearGradient(0, y - 10, 0, height + 60);
      sediment.addColorStop(0, "rgba(10, 9, 6, 1)");
      sediment.addColorStop(1, "rgba(2, 2, 1, 1)");
      context.fillStyle = sediment;
      context.fill();

      if (lightAlpha > 0.01) {
        context.save();
        context.clip();
        const pool = context.createRadialGradient(centerX, y + 14, 0, centerX, y + 14, poolRadius);
        pool.addColorStop(0, `rgba(226, 196, 148, ${0.5 * lightAlpha})`);
        pool.addColorStop(0.55, `rgba(170, 142, 102, ${0.3 * lightAlpha})`);
        pool.addColorStop(1, "rgba(120, 98, 70, 0)");
        context.fillStyle = pool;
        context.beginPath();
        context.ellipse(centerX, y + 14, poolRadius, poolRadius * 0.5, 0, 0, TAU);
        context.fill();

        context.strokeStyle = `rgba(30, 24, 14, ${0.5 * lightAlpha})`;
        context.lineWidth = 1.4;
        for (let row = 0; row < 5; row += 1) {
          const rowY = y + 16 + row * 13;
          context.beginPath();
          for (let x = centerX - poolRadius; x <= centerX + poolRadius; x += 12) {
            const rippleY = rowY + Math.sin(x * 0.05 + row * 2.2) * 2.4;
            if (x <= centerX - poolRadius) context.moveTo(x, rippleY);
            else context.lineTo(x, rippleY);
          }
          context.stroke();
        }

        const cucumberX = centerX + poolRadius * 0.68;
        const cucumberY = y + 26;
        context.fillStyle = `rgba(184, 150, 132, ${0.4 * lightAlpha})`;
        context.beginPath();
        context.ellipse(cucumberX, cucumberY, 16, 5.4, -0.08, 0, TAU);
        context.fill();
        context.fillStyle = `rgba(120, 92, 80, ${0.35 * lightAlpha})`;
        for (let index = 0; index < 5; index += 1) {
          context.beginPath();
          context.arc(cucumberX - 12 + index * 6, cucumberY - 4.6, 1.5, 0, TAU);
          context.fill();
        }
        context.restore();
      }
      context.restore();
    }

    if (remaining < 70 && lightAlpha > 0.2) {
      if (this.amphipods.length === 0) {
        this.amphipods = Array.from({ length: 8 }, () => ({
          x: centerX + (this.random() - 0.5) * poolRadius * 1.6,
          y: y - 20 - this.random() * height * 0.3,
          targetX: centerX,
          targetY: y - 60,
          phase: this.random() * TAU,
          scale: 0.75 + this.random() * 0.6,
          retargetIn: 0,
        }));
      }
      const motionDelta = reducedMotion ? 0 : deltaTime;
      const easing = 1 - Math.exp(-deltaTime * 2.1);
      this.amphipods.forEach((amphipod) => {
        amphipod.retargetIn -= motionDelta;
        if (amphipod.retargetIn <= 0) {
          amphipod.targetX = centerX + (this.random() - 0.5) * poolRadius * 1.5;
          amphipod.targetY = y - 8 - this.random() * 130;
          amphipod.retargetIn = 0.7 + this.random() * 1.6;
        }
        if (!reducedMotion) {
          amphipod.x +=
            (amphipod.targetX - amphipod.x) * easing +
            Math.sin(time * 7 + amphipod.phase) * 66 * deltaTime;
          amphipod.y +=
            (amphipod.targetY - amphipod.y) * easing +
            Math.cos(time * 6.1 + amphipod.phase) * 54 * deltaTime;
        }
        const heading = Math.atan2(amphipod.targetY - amphipod.y, amphipod.targetX - amphipod.x);
        const alpha =
          lightAlpha * (1 - clamp(Math.abs(amphipod.x - centerX) / poolRadius, 0, 1) * 0.6);
        context.save();
        context.translate(amphipod.x, amphipod.y);
        context.rotate(heading * 0.35);
        context.scale(amphipod.scale, amphipod.scale);
        context.fillStyle = `rgba(255, 246, 228, ${0.85 * alpha})`;
        context.beginPath();
        context.moveTo(-7, 0);
        context.quadraticCurveTo(-2, -6.4, 5, -3.4);
        context.quadraticCurveTo(8.4, -1.6, 7, 1.4);
        context.quadraticCurveTo(1, 4.6, -5, 3);
        context.quadraticCurveTo(-7.6, 2, -7, 0);
        context.fill();
        context.strokeStyle = `rgba(255, 246, 228, ${0.6 * alpha})`;
        context.lineWidth = 0.7;
        context.beginPath();
        context.moveTo(6.6, -2.4);
        context.quadraticCurveTo(11, -5, 13.4, -3.2);
        context.moveTo(6.9, -1.4);
        context.quadraticCurveTo(11.4, -2.4, 14, -0.6);
        context.stroke();
        context.restore();
      });
    } else if (remaining > 120) {
      this.amphipods = [];
    }
  }

  private drawPlankton(
    time: number,
    depth: number,
    depthDelta: number,
    reducedMotion: boolean,
    deltaTime: number,
  ) {
    if (reducedMotion) {
      this.plankton = [];
      return;
    }
    let intensity = smooth(750, 1500, depth);
    const floor = this.floorGeometry(depth);
    if (floor) intensity *= 1 - floor.lightAlpha * 0.9;
    if (intensity <= 0.01) {
      this.plankton = [];
      return;
    }
    if (this.plankton.length < 12 && this.random() < 1.8 * intensity * deltaTime) {
      this.plankton.push({
        x: this.random() * this.width,
        y: this.random() * this.height,
        parallax: 0.5 + this.random() * 0.7,
        life: 0,
        duration: 0.9 + this.random() * 1.7,
        radius: 1.1 + this.random() * 2.1,
      });
    }

    const context = this.context;
    context.save();
    context.globalCompositeOperation = "lighter";
    for (let index = this.plankton.length - 1; index >= 0; index -= 1) {
      const flash = this.plankton[index];
      flash.life += deltaTime;
      flash.y -= depthDelta * 1.12 * flash.parallax;
      if (flash.life >= flash.duration || flash.y < -30 || flash.y > this.height + 30) {
        this.plankton.splice(index, 1);
        continue;
      }
      const phase = flash.life / flash.duration;
      const alpha = Math.sin(phase * Math.PI) * intensity;
      const radius = flash.radius * (2.6 + phase * 3.2);
      const glow = context.createRadialGradient(flash.x, flash.y, 0, flash.x, flash.y, radius * 3);
      glow.addColorStop(0, `rgba(110, 242, 214, ${0.5 * alpha})`);
      glow.addColorStop(0.4, `rgba(110, 242, 214, ${0.14 * alpha})`);
      glow.addColorStop(1, "rgba(110, 242, 214, 0)");
      context.fillStyle = glow;
      context.beginPath();
      context.arc(flash.x, flash.y, radius * 3, 0, TAU);
      context.fill();
    }
    context.restore();
  }

  private drawSnow(
    time: number,
    depth: number,
    depthDelta: number,
    reducedMotion: boolean,
    deltaTime: number,
  ) {
    const context = this.context;
    const floor = this.floorGeometry(depth);
    const depthBoost = 0.5 + 0.5 * clamp(depth / 900, 0, 1);
    this.snow.forEach((particle) => {
      if (!reducedMotion) {
        particle.y -= depthDelta * 1.12 * particle.parallax;
        particle.y += 7 * particle.parallax * deltaTime;
        particle.x += Math.sin(time * 0.5 + particle.phase) * 7.2 * particle.parallax * deltaTime;
      }
      if (particle.y < -8) {
        particle.y = this.height + 8;
        particle.x = this.random() * this.width;
      }
      if (particle.y > this.height + 8) {
        particle.y = -8;
        particle.x = this.random() * this.width;
      }
      if (particle.x < -8) particle.x = this.width + 8;
      if (particle.x > this.width + 8) particle.x = -8;

      let alpha = particle.alpha * depthBoost;
      let fill = `rgba(214, 232, 236, ${alpha})`;
      if (floor && floor.lightAlpha > 0.02 && particle.y < floor.y) {
        const spread =
          ((particle.y + this.height * 0.32) / (floor.y + this.height * 0.32)) *
          (this.width * 0.36);
        if (Math.abs(particle.x - floor.centerX) < spread) {
          alpha = Math.min(1, alpha * 2.6 * floor.lightAlpha + 0.12);
          fill = `rgba(255, 240, 214, ${alpha})`;
        }
      }
      context.fillStyle = fill;
      context.beginPath();
      context.arc(particle.x, particle.y, particle.radius, 0, TAU);
      context.fill();
    });
  }

  render(state: SeaRenderState) {
    const { time, depth, depthDelta, now, reducedMotion } = state;
    const deltaTime = clamp(state.deltaTime || 1 / 60, 0.001, 0.1);
    this.context.clearRect(0, 0, this.width, this.height);
    this.drawSurface(time, depth);
    this.drawTrenchWalls(time, depth, reducedMotion);

    this.creatures.forEach((creature) => {
      const transit = (depth - creature.depth) / creature.span;
      if (transit < -1.15 || transit > 1.15) return;
      const alpha = clamp((1 - Math.abs(transit)) * 2.4, 0, 1);
      if (alpha <= 0.01) return;
      creature.draw(this.context, {
        time,
        transit,
        alpha,
        width: this.width,
        height: this.height,
      });
    });

    this.drawPlankton(time, depth, depthDelta, reducedMotion, deltaTime);
    this.drawFloor(time, depth, now, reducedMotion, deltaTime);
    this.drawSnow(time, depth, depthDelta, reducedMotion, deltaTime);
  }
}
