import { World } from "../../pkg/snake_game";
import { ParticleSystem } from "./particles";

interface RendererConfig {
  ctx: CanvasRenderingContext2D;
  world: World;
  cellSize: number;
  worldSize: number;
  wasmMemory: WebAssembly.Memory;
}

/**
 * Handles canvas-based rendering for the Snake game.
 */
export class Renderer {
  public particles: ParticleSystem = new ParticleSystem();
  private config: RendererConfig;
  private initialized: boolean = false;

  constructor(config: RendererConfig) {
    this.config = config;
  }

  resize(newCellSize: number) {
    const { ctx, worldSize } = this.config;
    const { canvas } = ctx;
    const dpr = window.devicePixelRatio || 1;
    const cssSize = worldSize * newCellSize;

    if (cssSize <= 0) return;

    this.config.cellSize = newCellSize;

    ctx.setTransform(1, 0, 0, 1, 0, 0);

    canvas.style.width = `${cssSize}px`;
    canvas.style.height = `${cssSize}px`;

    canvas.width = cssSize * dpr;
    canvas.height = cssSize * dpr;
    ctx.scale(dpr, dpr);

    this.initialized = true;
  }

  /**
   * Performs a full frame draw including grid, reward, snake, and particles.
   */
  paint() {
    if (!this.initialized) return;

    const { ctx, worldSize, cellSize } = this.config;
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, worldSize * cellSize, worldSize * cellSize);
    this.drawGrid();
    this.drawReward();
    this.drawSnake();
    this.particles.update();
    this.particles.draw(this.config.ctx);
  }

  private drawGrid() {
    this.config.ctx.beginPath();
    this.config.ctx.strokeStyle = "rgba(48, 54, 61, 0.3)";
    for (let i = 0; i <= this.config.worldSize; i++) {
      const pos = i * this.config.cellSize;
      this.config.ctx.moveTo(pos, 0);
      this.config.ctx.lineTo(pos, this.config.ctx.canvas.height);
      this.config.ctx.moveTo(0, pos);
      this.config.ctx.lineTo(this.config.ctx.canvas.width, pos);
    }
    this.config.ctx.stroke();
  }

  private drawReward() {
    const idx = this.config.world.reward_cell();
    const x = (idx % this.config.worldSize) * this.config.cellSize;
    const y = Math.floor(idx / this.config.worldSize) * this.config.cellSize;

    this.config.ctx.shadowBlur = 15;
    this.config.ctx.shadowColor = "#f85149";
    this.config.ctx.fillStyle = "#f85149";
    this.config.ctx.beginPath();
    this.drawRoundedRect(x + 2, y + 2, this.config.cellSize - 4, this.config.cellSize - 4, 4);
    this.config.ctx.fill();
    this.config.ctx.shadowBlur = 0;
  }

  private drawRoundedRect(x: number, y: number, w: number, h: number, r: number) {
    if (this.config.ctx.roundRect) {
      this.config.ctx.roundRect(x, y, w, h, r);
    } else {
      this.config.ctx.moveTo(x + r, y);
      this.config.ctx.arcTo(x + w, y, x + w, y + h, r);
      this.config.ctx.arcTo(x + w, y + h, x, y + h, r);
      this.config.ctx.arcTo(x, y + h, x, y, r);
      this.config.ctx.arcTo(x, y, x + w, y, r);
    }
  }

  private drawSnake() {
    const length = this.config.world.snake_length();
    const cells = new Uint32Array(this.config.wasmMemory.buffer, this.config.world.snake_cells(), length);

    cells.forEach((cell, index) => {
      const x = (cell % this.config.worldSize) * this.config.cellSize;
      const y = Math.floor(cell / this.config.worldSize) * this.config.cellSize;

      this.config.ctx.shadowBlur = index === 0 ? 10 : 0;
      this.config.ctx.shadowColor = "#58a6ff";
      const green = Math.min(255, 120 + index * 2);
      this.config.ctx.fillStyle = index === 0 ? "#58a6ff" : `rgb(124, 58, ${green})`;

      this.config.ctx.beginPath();
      this.drawRoundedRect(x + 1, y + 1, this.config.cellSize - 2, this.config.cellSize - 2, index === 0 ? 6 : 4);
      this.config.ctx.fill();
    });
    this.config.ctx.shadowBlur = 0;
  }
}

