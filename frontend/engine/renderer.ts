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

  constructor(config: RendererConfig) {
    this.config = config;
  }

  /**
   * Performs a full frame draw including grid, reward, snake, and particles.
   */
  paint() {
    this.config.ctx.fillStyle = "#000";
    this.config.ctx.fillRect(0, 0, this.config.ctx.canvas.width, this.config.ctx.canvas.height);
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
    this.config.ctx.roundRect(x + 2, y + 2, this.config.cellSize - 4, this.config.cellSize - 4, 4);
    this.config.ctx.fill();
    this.config.ctx.shadowBlur = 0;
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
      this.config.ctx.roundRect(x + 1, y + 1, this.config.cellSize - 2, this.config.cellSize - 2, index === 0 ? 6 : 4);
      this.config.ctx.fill();
    });
    this.config.ctx.shadowBlur = 0;
  }
}

