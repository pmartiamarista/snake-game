# Snake.WASM 🐍

A premium, high-performance Snake game built with a **Rust WASM** core and a **TypeScript** frontend. This project demonstrates a modern dual-loop architecture, procedural visual effects, and strict engineering standards.

## 🚀 Key Features

- **Dual-Loop Architecture**: High-fidelity 60FPS rendering loop decoupled from chunky game physics logic.
- **Rust WASM Core**: Optimized game state management with self-contained random generation via `js-sys`.
- **Premium Visuals**: Neon Dark aesthetic with glassmorphism UI and real-time particle feedback.
- **Procedural Audio**: Dynamic sound effects generated using the Web Audio API.
- **Modern Build Stack**: Powered by Vite 8.0.8, TypeScript 6.0.3, and Rust 2024.
- **Production Ready**: Express.js server with security headers and Gzip compression.

## 🏗️ Architecture

The project is designed with a strict separation of concerns, utilizing a layered approach that isolates the pure domain logic from integration details.

```
snake_game/
├── src/               # Rust Domain Logic
│   ├── snake/         # Snake body and movement state
│   ├── world/         # Game grid and collision logic
│   └── utils/         # Cross-platform utility traits
├── frontend/          # TypeScript Application Layer
│   ├── engine/        # Modular Game Engine (Renderer, Particles, Sound)
│   ├── index.ts       # Application Entry & Orchestration
│   └── index.css      # Design System & Token Definitions
├── pkg/               # Compiled WebAssembly Bindings
├── server/            # Production Node.js/Express Server
└── Makefile           # Central Build Orchestrator
```

## 🛠️ Project Standards

This codebase strictly adheres to the following engineering standards:

- **Zero-Comment Policy**: Clarity is achieved through expressive naming and modular structure; comments are prohibited in production code.
- **Naming & Intent**: Abbreviations are avoided in favor of descriptive names that explain purpose (e.g., `renderingContext` over `ctx`).
- **Complexity Limits**: Functions are capped at **40 lines**, and files at **300 lines** to ensure readability and single responsibility.
- **Parameter Constraints**: Functions accept a maximum of **4 parameters**; complex signatures are refactored into typed configuration objects.
- **Exact-Pinning**: All dependencies in `package.json` and `Cargo.toml` are pinned to exact versions for deterministic builds.
- **Explicit Error Handling**: Robust error propagation using `Result` and `Option` (Rust) and typed error handling (TS).
- **Testing Integrity**: Every public function requires at least one happy-path and one edge-case test to verify semantic invariants.

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd snake_game
   ```

2. **Install dependencies**
   ```bash
   # Root & Server dependencies
   npm install
   
   # Frontend Application dependencies
   cd frontend && npm install && cd ..
   ```

3. **Setup environment**
   ```bash
   cp env.template .env
   ```

## 🎮 Usage

### High-Level Commands
| Command | Profile | Description |
|----------|---------|-------------|
| `make dev` | Dev | Start WASM build with Vite hot-reload |
| `make build-all` | Prod | Full production build (WASM + Frontend) |
| `make start` | Prod | Launch Express server on port 3000 |

### Technical Reference
| Command | Description |
|----------|-------------|
| `make wasm` | Compile Rust to WebAssembly with wasm-bindgen glue |
| `make check` | Run cargo fmt and clippy for quality assurance |
| `make test` | Execute Rust unit and integration tests |
| `make clean` | Purge all build artifacts and node_modules |

## ⚙️ Configuration

Game parameters are managed via environment variables in the `.env` file:

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_WORLD_WIDTH` | Grid dimension of the game world | `32` |
| `VITE_CELL_SIZE` | Individual cell size in pixels | `20` |
| `PORT` | Production server listening port | `3000` |
| `DEV_SERVER_PORT` | Vite development server port | `8000` |
| `NODE_ENV` | Mode (`development` or `production`) | `development` |
| `HOT_RELOAD` | Enable HMR for frontend development | `true` |
| `COMPRESSION` | Enable Gzip compression in production | `true` |

## 🕹️ Controls
- **Movement**: Arrow Keys / WASD / Mobile D-pad
- **Commands**: `Enter` to Start or Restart (when Game Over)
- **Settings**: Real-time difficulty/speed selection on Home Screen

## 🐳 Deployment
```dockerfile
FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN make build-all
EXPOSE 3000
CMD ["npm", "start"]
```

## 📄 License
ISC License - Copyright (c) 2026

---