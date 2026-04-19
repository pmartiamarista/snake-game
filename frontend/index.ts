import init, { World, Direction, GameStatus, InitOutput } from "../pkg/snake_game.js";
import { SoundManager } from "./engine/sound";
import { Renderer } from "./engine/renderer";
import { StorageProvider, LocalStorageProvider } from "./engine/storage";

interface GameDependencies {
  wasm: InitOutput;
  world: World;
  sound: SoundManager;
  storage: StorageProvider;
  config: GameConfig;
}

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
  private storage: StorageProvider;
  private renderer: Renderer;
  private fps: number = 12;
  private config: GameConfig;
  private lastFrameTime: number = 0;
  private accumulator: number = 0;
  private scoreValue!: HTMLElement;
  private highScoreValue!: HTMLElement;

  constructor(deps: GameDependencies) {
    this.world = deps.world;
    this.sound = deps.sound;
    this.storage = deps.storage;
    this.config = deps.config;
    
    this.bindUI();
    
    const canvas = document.getElementById("snake-canvas") as HTMLCanvasElement;
    const ctx = canvas.getContext("2d")!;
    
    this.renderer = new Renderer({
      ctx,
      world: deps.world,
      cellSize: deps.config.cellSize,
      worldSize: deps.config.width,
      wasmMemory: deps.wasm.memory
    });
    
    requestAnimationFrame(() => {
      this.renderer.resize(this.config.cellSize);
    });

    this.attachControls();
    this.setupResizeObserver();
    this.renderLoop(performance.now());
  }

  private bindUI() {
    this.scoreValue = document.getElementById("score")!;
    this.highScoreValue = document.getElementById("high-score")!;
  }

  private setupResizeObserver() {
    const target = document.querySelector("main") as HTMLElement;
    const observer = new ResizeObserver(() => {
      const newCellSize = computeCellSize(this.config.width);
      if (newCellSize === this.config.cellSize) return;

      const isPlaying = this.world.game_status() === GameStatus.Played;
      if (isPlaying) {
        this.world.toggle_pause();
        this.config.cellSize = newCellSize;
        this.renderer.resize(newCellSize);
        this.world.toggle_pause();
      } else {
        this.config.cellSize = newCellSize;
        this.renderer.resize(newCellSize);
      }
    });
    observer.observe(target);
  }

  private attachControls() {
    window.addEventListener("keydown", (e) => this.handleKeyDown(e));
    document.querySelectorAll(".ctrl-btn").forEach(btn => {
      btn.addEventListener("pointerdown", (e) => {
        e.preventDefault();
        const dir = (btn as HTMLElement).dataset.dir;
        if (dir) this.handleInput(Direction[dir as keyof typeof Direction]);
      });
    });
    document.getElementById("start-btn")?.addEventListener("click", () => this.start());
    document.getElementById("restart-btn")?.addEventListener("click", () => this.restart());
    document.getElementById("mobile-pause")?.addEventListener("pointerdown", (e) => {
      e.preventDefault();
      this.handleActionKey();
    });
  }


  private handleKeyDown(e: KeyboardEvent) {
    if (e.repeat) return;

    const map: Record<string, Direction> = {
      ArrowUp: Direction.Up, w: Direction.Up,
      ArrowDown: Direction.Down, s: Direction.Down,
      ArrowLeft: Direction.Left, a: Direction.Left,
      ArrowRight: Direction.Right, d: Direction.Right
    };

    if (map[e.key] !== undefined) {
      this.handleInput(map[e.key]);
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      this.handleActionKey();
    }
  }

  private handleActionKey() {
    const startOverlay = document.getElementById("start-overlay");
    const gameOverOverlay = document.getElementById("game-over-overlay");
    const startHidden = startOverlay?.classList.contains("hidden");
    const overHidden = gameOverOverlay?.classList.contains("hidden");

    if (!startHidden) {
      this.start();
    } else if (!overHidden) {
      this.restart();
    } else {
      this.world.toggle_pause();
      const isPaused = this.world.game_status() === GameStatus.Paused;
      document.getElementById("pause-overlay")?.classList.toggle("hidden", !isPaused);
    }
  }

  private handleInput(dir: Direction) {
    this.world.change_snake_direction(dir);
    this.sound.playMove();
  }

  public start() {
    this.sound.init();
    document.getElementById("start-overlay")?.classList.add("hidden");
    document.getElementById("game-over-overlay")?.classList.add("hidden");
    document.getElementById("pause-overlay")?.classList.add("hidden");
    this.lastFrameTime = performance.now();
    this.accumulator = 0;
    this.world.start_game();
  }

  private restart() {
    this.world.restart_game(Math.floor(Math.random() * this.config.width * this.config.width));
    this.start();
  }

  private renderLoop(timestamp: number) {
    if (this.world.game_status() === GameStatus.Played) {
      const delta = timestamp - this.lastFrameTime;
      this.accumulator += delta;
      
      const stepDuration = 1000 / (this.fps + Math.floor(this.world.score() / 5));
      
      while (this.accumulator >= stepDuration) {
        const oldScore = this.world.score();
        this.world.step();
        this.handleScoreChange(oldScore);
        this.updateUI();
        
        if (this.world.game_status() === GameStatus.Lost) {
          this.sound.playGameOver();
          this.gameOver();
          break;
        }
        this.accumulator -= stepDuration;
      }
    }
    
    this.lastFrameTime = timestamp;
    this.renderer.paint();
    requestAnimationFrame((t) => this.renderLoop(t));
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
    const stored = this.storage.getItem("snake-high-score");
    const lastHigh = parseInt(stored || "0");
    if (score > lastHigh) {
      this.storage.setItem("snake-high-score", score.toString());
      this.highScoreValue.textContent = score.toString();
    }
  }

  private gameOver() {
    document.getElementById("final-score")!.textContent = `Score: ${this.world.score()}`;
    document.getElementById("game-over-overlay")?.classList.remove("hidden");
  }
}

/**
 * Orchestrates the pre-flight checks and engine initialization.
 */
class Bootstrapper {
  static async run() {
    const statusEl = document.getElementById("loading-status")!;
    const startBtn = document.getElementById("start-btn") as HTMLButtonElement;

    const updateStatus = (msg: string, isError = false) => {
      statusEl.textContent = msg;
      statusEl.style.color = isError ? "var(--accent-red)" : "var(--text-dim)";
    };

    try {
      updateStatus("Checking browser compatibility...");
      if (typeof WebAssembly !== "object") {
        throw new Error("WebAssembly is not supported.");
      }

      updateStatus("Loading engine...");
      const wasm = await init();
      
      updateStatus("Preparing assets...");
      await document.fonts.ready;

      updateStatus("Systems ready.");
      this.enableEngine(wasm, startBtn, updateStatus);
    } catch (err) {
      updateStatus(`Error: ${err instanceof Error ? err.message : String(err)}`, true);
    }
  }

  private static enableEngine(wasm: InitOutput, btn: HTMLButtonElement, updateStatus: (m: string) => void) {
    btn.disabled = false;
    btn.textContent = "START GAME";
    
    btn.addEventListener("click", () => {
      updateStatus("Active");
      const baseWorldWidth = parseInt((import.meta.env.VITE_WORLD_WIDTH as string) || "32");
      const worldWidth = computeWorldWidth(baseWorldWidth);
      const cellSize = computeCellSize(worldWidth);

      const config: GameConfig = {
        cellSize,
        width: worldWidth
      };
      const world = World.new(config.width, Math.floor(Math.random() * config.width * config.width));
      const game = new SnakeGame({
        wasm,
        world,
        sound: new SoundManager(),
        storage: new LocalStorageProvider(),
        config
      });
      game.start();
    });
  }
}

function computeCellSize(worldWidth: number): number {
  const header = document.querySelector("header");
  const headerHeight = header ? header.getBoundingClientRect().height : 64;

  const isMobile = window.innerWidth <= 768;
  const controlsReserved = isMobile ? 180 : 0;
  const safeAreaBottom = 24;

  const availableWidth = window.innerWidth - 16;
  const availableHeight = window.innerHeight
    - headerHeight
    - controlsReserved
    - safeAreaBottom
    - 16;

  const availableSize = Math.min(availableWidth, availableHeight);
  const rawCellSize = Math.floor(availableSize / worldWidth);

  return Math.max(8, rawCellSize);
}

function computeWorldWidth(baseWidth: number): number {
  if (window.innerWidth < 400) return Math.min(baseWidth, 24);
  return baseWidth;
}

Bootstrapper.run();
