# Snake Game 🐍

A modern Snake game built with **Rust WASM** backend and **TypeScript** frontend, featuring a clean architecture and production-ready build system.

## 🚀 Features

- **Rust WASM Backend**: High-performance game logic
- **TypeScript Frontend**: Modern web interface with Webpack
- **Express Server**: Production-ready static file serving
- **Dark Theme**: GitHub-inspired design
- **Responsive Controls**: Arrow keys + WASD support
- **Game States**: Ready, Playing, Paused, Lost
- **Score System**: Track your progress
- **Accessibility**: ARIA labels and keyboard navigation

## 🏗️ Architecture

```
snake_game/
├── src/           # Rust source code
├── frontend/       # TypeScript + Webpack
├── server/         # Express.js server
├── pkg/           # WASM build output
└── target/        # Rust build artifacts
```

## 🛠️ Prerequisites

- **Rust** (latest stable)
- **Node.js** (v16+)
- **npm** or **yarn**

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd snake_game
   ```

2. **Install dependencies**
   ```bash
   # Root dependencies (Express server)
   npm install
   
   # Frontend dependencies
   cd frontend
   npm install
   cd ..
   ```

3. **Setup environment**
   ```bash
   # Copy environment template
   cp env.template .env
   # Edit .env with your preferences
   ```

## 🎮 Usage

### Development

```bash
# Option 1: Using Makefile (recommended)
make dev

# Option 2: Using npm scripts
cd frontend && npm run dev
# Or from root: npm run dev:frontend
```

### Production

```bash
# Option 1: Using Makefile (recommended)
make build-all
make start

# Option 2: Using npm scripts
npm run build
npm start
```

### Individual Commands

```bash
# Makefile commands
make wasm         # Build WASM only
make check         # Check Rust code quality
make fmt           # Format Rust code
make clippy        # Lint Rust code
make clean         # Clean all artifacts

# npm scripts
npm run build:wasm     # Build WASM only
npm run build:frontend # Build frontend only
cd frontend && npm run clean  # Clean frontend artifacts
```

## 🎯 Game Controls

- **Start/Pause/Resume**: `Enter` key or click button
- **Movement**: Arrow keys or `WASD`
- **Restart**: `Enter` key or click button (when lost)

## ⚙️ Configuration

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3000` | Server port |
| `NODE_ENV` | `development` | Environment mode |
| `WORLD_WIDTH` | `64` | Game world size |
| `CELL_SIZE` | `10` | Cell size in pixels |
| `BASE_FPS` | `3` | Base game speed |
| `BASE_CELL_SIZE` | `20` | Base cell size for FPS calculation |
| `DEV_SERVER_PORT` | `8000` | Development server port |
| `HOT_RELOAD` | `true` | Enable hot reload in dev |
| `COMPRESSION` | `true` | Enable gzip compression |

### Game Settings

Game parameters are configured via environment variables in `.env` file:

```bash
# Game Configuration
WORLD_WIDTH=64
CELL_SIZE=10
BASE_FPS=3
BASE_CELL_SIZE=20
```

## 🔧 Development

### Project Structure

- **`src/lib.rs`**: Rust game logic (World, Snake, GameStatus)
- **`frontend/index.ts`**: TypeScript game interface
- **`frontend/webpack.config.js`**: Build configuration
- **`server/index.js`**: Express server
- **`pkg/`**: Generated WASM bindings

### Makefile Commands

```bash
make build-all    # Full build: WASM + Frontend
make start        # Run Express server
make dev          # WASM build + Webpack dev server
make test         # Run Rust unit tests
make clean        # Remove all build artifacts
```

### Installation

1. **Install dependencies**
   ```bash
   npm install
   cd frontend && npm install
   ```

2. **Build and Run**
   ```bash
   make build-all
   make start
   ```

## ⚙️ Development

### Project Structure

- **`src/`**: Modular Rust game logic (`snake`, `world`, `utils`).
- **`frontend/`**: TypeScript interface and Webpack configuration.
- **`server/`**: Production Express server.
- **`pkg/`**: Generated WASM bindings.

### Quality Assurance

- **Rust**: idiomatic patterns, no comments, high modularity.
- **Testing**: logic verified via `src/world/tests.rs` and `src/snake/tests.rs`.

## 📁 File Structure

```
snake_game/
├── .gitignore              # Git ignore rules
├── env.template           # Environment template
├── package.json           # Root package config
├── Cargo.toml             # Rust dependencies
├── Makefile               # Rust build commands
├── src/
│   └── lib.rs             # Main Rust code
├── frontend/
│   ├── package.json       # Frontend dependencies
│   ├── webpack.config.js  # Build configuration
│   ├── tsconfig.json      # TypeScript config
│   ├── index.ts           # Main frontend code
│   ├── utils/
│   │   └── random.js      # Utility functions
│   └── public/
│       ├── index.html      # HTML template
│       └── *.wasm         # WASM files
├── server/
│   └── index.js           # Express server
└── pkg/                   # WASM build output
```

## 🚀 Deployment

### Local Production

```bash
# Option 1: Using Makefile (recommended)
make build-all
make start

# Option 2: Using npm scripts
npm run build
npm start
```

### Docker (Optional)

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN make build-all
EXPOSE 3000
CMD ["make", "start"]
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

ISC License - see LICENSE file for details

## 🎯 Future Enhancements

- [ ] High score persistence
- [ ] Multiple difficulty levels
- [ ] Sound effects
- [ ] Mobile touch controls
- [ ] Multiplayer support
- [ ] Custom themes

---