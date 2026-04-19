import init, { World, Direction, GameStatus, InitOutput } from "../pkg/snake_game.js";
import { SoundManager } from "./engine/sound";
import { Renderer } from "./engine/renderer";

interface GameConfig {
  width: number;
  cellSize: number;
}

/**
 * Main game orchestrator for Snake.WASM.
 */
class SnakeGame {
  private world: World;
  private sound: SoundManager;
  private renderer: Renderer;
  private fps: number = 10;
  private config: GameConfig;
  private scoreValue: HTMLElement;
  private highScoreValue: HTMLElement;

  constructor(wasm: InitOutput, world: World, sound: SoundManager, config: GameConfig) {
    this.world = world;
    this.sound = sound;
    this.config = config;
    
    this.scoreValue = document.getElementById("score")!;
    this.highScoreValue = document.getElementById("high-score")!;
    
    const canvas = document.getElementById("snake-canvas") as HTMLCanvasElement;
    const ctx = canvas.getContext("2d")!;
    canvas.width = config.width * config.cellSize;
    canvas.height = config.width * config.cellSize;
    
    this.renderer = new Renderer({
      ctx,
      world,
      cellSize: config.cellSize,
      worldSize: config.width,
      wasmMemory: wasm.memory
    });
    this.attachControls();
    this.renderLoop();
  }

  /**
   * Initializes the game engine and WASM module.
   */
  static async init() {
    const wasm = await init();
    const config: GameConfig = {
      cellSize: parseInt((import.meta.env.VITE_CELL_SIZE as string) || "20"),
      width: parseInt((import.meta.env.VITE_WORLD_WIDTH as string) || "32")
    };
    const world = World.new(config.width, Math.floor(Math.random() * config.width * config.width));
    const sound = new SoundManager();
    
    return new SnakeGame(wasm, world, sound, config);
  }

  private attachControls() {
    window.addEventListener("keydown", (e) => this.handleKeyDown(e));
    document.querySelectorAll(".ctrl-btn").forEach(btn => {
      btn.addEventListener("pointerdown", () => {
        const dir = (btn as HTMLElement).dataset.dir;
        if (dir) this.handleInput(Direction[dir as keyof typeof Direction]);
      });
    });
    document.getElementById("start-btn")?.addEventListener("click", () => this.start());
    document.getElementById("restart-btn")?.addEventListener("click", () => this.restart());
    this.attachDifficultySelectors();
  }

  private attachDifficultySelectors() {
    const diffButtons = document.querySelectorAll(".btn-diff");
    diffButtons.forEach(btn => {
      btn.addEventListener("click", () => {
        diffButtons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        this.fps = parseInt((btn as HTMLElement).dataset.fps || "10");
      });
    });
  }

  private handleKeyDown(e: KeyboardEvent) {
    const map: Record<string, Direction> = {
      ArrowUp: Direction.Up, w: Direction.Up,
      ArrowDown: Direction.Down, s: Direction.Down,
      ArrowLeft: Direction.Left, a: Direction.Left,
      ArrowRight: Direction.Right, d: Direction.Right
    };
    if (map[e.key] !== undefined) this.handleInput(map[e.key]);
    if (e.key === "Enter") this.handleEnter();
  }

  private handleEnter() {
    const startOverlay = document.getElementById("start-overlay");
    const gameOverOverlay = document.getElementById("game-over-overlay");
    const startHidden = startOverlay?.classList.contains("hidden");
    const overHidden = gameOverOverlay?.classList.contains("hidden");
    if (!startHidden) this.start();
    else if (!overHidden) this.restart();
  }

  private handleInput(dir: Direction) {
    this.world.change_snake_direction(dir);
    this.sound.playMove();
  }

  private start() {
    this.sound.init();
    document.getElementById("start-overlay")?.classList.add("hidden");
    document.getElementById("game-over-overlay")?.classList.add("hidden");
    this.world.start_game();
    this.logicLoop();
  }

  private restart() {
    this.world.restart_game(Math.floor(Math.random() * this.config.width * this.config.width));
    this.start();
  }

  private renderLoop() {
    this.renderer.paint();
    requestAnimationFrame(() => this.renderLoop());
  }

  private logicLoop() {
    if (this.world.game_status() !== GameStatus.Played) return;
    
    const oldScore = this.world.score();
    this.world.step();
    this.handleScoreChange(oldScore);
    this.updateUI();
    
    if (this.world.game_status() === GameStatus.Lost) {
      this.sound.playGameOver();
      this.gameOver();
      return;
    }

    setTimeout(() => this.logicLoop(), 1000 / (this.fps + Math.floor(this.world.score() / 5)));
  }

  private handleScoreChange(oldScore: number) {
    if (this.world.score() > oldScore) {
      this.sound.playEat();
      const idx = this.world.reward_cell();
      const x = (idx % this.config.width) * this.config.cellSize + this.config.cellSize / 2;
      const y = Math.floor(idx / this.config.width) * this.config.cellSize + this.config.cellSize / 2;
      this.renderer.particles.spawn(x, y, "#f85149");
    }
  }

  private updateUI() {
    const score = this.world.score();
    this.scoreValue.textContent = score.toString();
    const stored = localStorage.getItem("snake-high-score");
    const lastHigh = parseInt(stored || "0");
    if (score > lastHigh) {
      localStorage.setItem("snake-high-score", score.toString());
      this.highScoreValue.textContent = score.toString();
    }
  }

  private gameOver() {
    document.getElementById("final-score")!.textContent = `Score: ${this.world.score()}`;
    document.getElementById("game-over-overlay")?.classList.remove("hidden");
  }
}

SnakeGame.init();
