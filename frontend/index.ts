import init, { World, Direction, GameStatus } from "../pkg/snake_game.js";
import { random } from "./utils/random";

async function main() {
  try {
    const wasm = await init();

    const CELL_SIZE = parseInt(process.env.CELL_SIZE || "10");
    const WORLD_WIDTH = parseInt(process.env.WORLD_WIDTH || "64");
    const BASE_FPS = parseInt(process.env.BASE_FPS || "3");
    const BASE_CELL_SIZE = parseInt(process.env.BASE_CELL_SIZE || "20");
    const snakeSpawnIndex = random(WORLD_WIDTH * WORLD_WIDTH);

    const world = World.new(WORLD_WIDTH, snakeSpawnIndex);
    let gameLoopId: number | null = null;

    const worldSize = world.width();

    const gameControlBtn = <HTMLButtonElement>(
      document.getElementById("game-control-btn")
    );
    const statusElement = <HTMLDivElement>document.getElementById("status");
    const canvas = <HTMLCanvasElement>document.getElementById("snake-canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = worldSize * CELL_SIZE;
    canvas.height = worldSize * CELL_SIZE;

    const updateUI = () => {
      const gameStatus = world.game_status();
      
      gameControlBtn.textContent = world.game_button_text();
      statusElement.textContent = world.game_status_text();
      
      if (gameStatus === GameStatus.Paused || gameStatus === GameStatus.Lost) {
        canvas.style.opacity = "0.5";
      } else {
        canvas.style.opacity = "1";
      }
    };

    const stopGameLoop = () => {
      if (gameLoopId !== null) {
        cancelAnimationFrame(gameLoopId);
        gameLoopId = null;
      }
    };

    const startGame = () => {
      stopGameLoop();
      world.start_game();
      play();
      updateUI();
    };

    const restartGame = () => {
      stopGameLoop();
      world.restart_game(random(WORLD_WIDTH * WORLD_WIDTH));
      play();
      updateUI();
    };

    const toggleGame = () => {
      const gameStatus = world.game_status();
      if (gameStatus === null || gameStatus === undefined) {
        startGame();
      } else if (gameStatus === GameStatus.Played || gameStatus === GameStatus.Paused) {
        world.toggle_pause();
        updateUI();
      } else if (gameStatus === GameStatus.Lost) {
        restartGame();
      }
    };

    gameControlBtn.addEventListener("click", toggleGame);

    document.addEventListener("keydown", event => {
      if (event.target === canvas || event.target === document.body) {
        switch (event.key) {
          case "Enter":
            toggleGame();
            break;
          case "ArrowUp":
          case "w":
          case "W":
            world.change_snake_direction(Direction.Up);
            break;
          case "ArrowRight":
          case "d":
          case "D":
            world.change_snake_direction(Direction.Right);
            break;
          case "ArrowDown":
          case "s":
          case "S":
            world.change_snake_direction(Direction.Down);
            break;
          case "ArrowLeft":
          case "a":
          case "A":
            world.change_snake_direction(Direction.Left);
            break;
        }
      }
    });

    const drawWorld = () => {
      ctx.strokeStyle = "#30363d";
      for (let x = 0; x <= worldSize; x++) {
        ctx.beginPath();
        ctx.moveTo(x * CELL_SIZE, 0);
        ctx.lineTo(x * CELL_SIZE, worldSize * CELL_SIZE);
        ctx.stroke();
      }
      for (let y = 0; y <= worldSize; y++) {
        ctx.beginPath();
        ctx.moveTo(0, y * CELL_SIZE);
        ctx.lineTo(worldSize * CELL_SIZE, y * CELL_SIZE);
        ctx.stroke();
      }
    };

    const drawReward = () => {
      const idx = world.reward_cell();
      const col = idx % worldSize;
      const row = Math.floor(idx / worldSize);
      ctx.fillStyle = "#f85149";
      ctx.fillRect(col * CELL_SIZE, row * CELL_SIZE, CELL_SIZE, CELL_SIZE);
    };

    const drawSnake = () => {
      const snakeCells = new Uint32Array(
        wasm.memory.buffer,
        world.snake_cells(),
        world.snake_length()
      );
      snakeCells.forEach((cell, index) => {
        const column = cell % worldSize;
        const row = Math.floor(cell / worldSize);
        ctx.fillStyle = index === 0 ? "#58a6ff" : "#7c3aed";
        ctx.fillRect(column * CELL_SIZE, row * CELL_SIZE, CELL_SIZE, CELL_SIZE);
      });
    };

    const paint = () => {
      drawWorld();
      drawReward();
      drawSnake();
    };

    const fps = Math.max(
      BASE_FPS,
      (WORLD_WIDTH * BASE_CELL_SIZE) / CELL_SIZE / 4
    );

    const play = () => {
      setTimeout(() => {
        const gameStatus = world.game_status();
        if (gameStatus === GameStatus.Played) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          world.step();
          paint();
          document.getElementById("score").textContent = `Score: ${world.score()}`;
        }
        
        if (gameStatus === GameStatus.Lost) {
          updateUI();
          stopGameLoop();
          return;
        }
        
        gameLoopId = requestAnimationFrame(play);
      }, 1000 / fps);
    };

    paint();
  } catch (error) {
    console.error("Failed to load WASM:", error);
  }
}

main();
