# Changelog

All notable changes to this project will be documented in this file.

## [1.2.2] - 2026-04-20

### Added
- **Unified Action Keys**: Full `Enter` and `Space` support for Start, Restart, and Pause/Resume actions from any screen.
- **Explicit Deployment Control**: Added `VITE_BASE_URL` to environment configuration for reliable subpath hosting.

### Changed
- **Bootstrapper Refactor**: Keyboard listeners are now initialized immediately upon WASM readiness, enabling "Press Enter to Start" on the first load.
- **Dynamic Base Path**: Frontend now respects `VITE_BASE_URL` for asset resolution.

### Fixed
- **GitHub Pages Asset 404s**: Synchronized GitHub Actions workflow (`static.yml`) with correct environment variable mapping and project standards.
- **Health Check Versioning**: Synchronized server status endpoint with project version.

## [1.2.1] - 2026-04-19

### Added
- **Pause Modal**: Responsive overlay that appears when the game is paused, providing clear visual feedback.
- **Mobile Pause Controls**: Dedicated ⏸ button integrated into the touch control grid for mobile responsiveness.
- **Improved UX**: "START GAME" label and ergonomic button placements.

### Changed
- **Unified Engine Refactor**: Migrated game logic into the `requestAnimationFrame` loop. This eliminates "stopping" or stuttering on mobile caused by browser timer throttling during touch events.
- **Frame-Locked Stepping**: Implemented high-precision `performance.now()` accumulator for consistent snake speed regardless of device refresh rate (60Hz/120Hz).

### Fixed
- **Expansion Bug**: Fixed `ResizeObserver` logic to correctly detect and expand the board when the browser window is enlarged.
- **Input Hitching**: Blocked default browser behaviors (scrolling, magnification) on directional buttons to ensure zero-lag input on mobile.

## [1.2.0] - 2026-04-19

### Added
- `StorageProvider` abstraction to decouple high-score persistence from game logic.
- `LocalStorageProvider` implementation for browser-based storage.

### Changed
- Refactored `SnakeGame` constructor to use a `GameDependencies` object, adhering to strict parameter limits and improving testability.
- Modernized Vite configuration: removed `vite-plugin-top-level-await` in favor of native ESNext support.
- Optimized bundle size by eliminating the TLA plugin and its heavy `@swc/core` dependency.
- Fixed server integration by resetting Vite `base` to `/`.

### Removed
- `wee_alloc` global allocator from Rust core (deprecated/vulnerable); now uses the default high-performance WASM allocator.
- Deleted dead code: `frontend/bootstrap.js`.

### Fixed
- Replaced magic number sentinel (`1000`) in `World` logic with a named constant `WORLD_FULL_SENTINEL` (set to `usize::MAX`).

### Added
- High-DPI (DPR) canvas scaling support for sharp rendering on mobile and retina displays.
- Dynamic `cellSize` computation based on viewport dimensions.
- Adaptive grid density (`worldSize`) for ultra-narrow screens (e.g., iPhone SE).
- `ResizeObserver` for robust orientation change and viewport reflow management.
- Support for iOS safe-area insets (`viewport-fit=cover`, `env(safe-area-inset-bottom)`).

### Changed
- Decoupled `Renderer` initialization from constructor to handle asynchronous layout reflow.
- Standardized environment variables with `VITE_` prefix for client-side exposure.
- Obsoleted fixed `CELL_SIZE` environment variable in favor of dynamic calculation.

### Fixed
- Bug where the snake would "disappear" or appear tiny on mobile devices due to DPR mismatch.
- Horizontal overflow issues on small viewports.
- Mobile controls overlapping the game board or sitting under home indicators.


## [1.0.0] - 2026-04-19

### Added
- Modularized Rust core (`snake`, `world`, `utils` modules).
- Unit tests for `World` and `Snake` logic.
- `CHANGELOG.md` for version tracking.
- Game engine modules (`frontend/engine/particles.ts`, `renderer.ts`, `sound.ts`).
- CSS styling system (`frontend/index.css`) with modern design.
- Favicon with emoji snake to eliminate 404 errors.
- `js-sys` dependency for Rust-based random number generation.

### Changed
- Migrated frontend build system from Webpack to Vite for faster development cycles.
- Upgraded `wasm-bindgen` to `0.2.118`.
- Refactored `Makefile` for robust `build-all` and `wasm` targets.
- Optimized `.gitignore` to exclude generated artifacts from tracking.
- Switched to standard `cargo build` instead of `rustup run stable`.
- Moved random number generation from JavaScript to Rust using `js-sys::Math::random()`.
- Updated TypeScript configuration for Vite compatibility.
- Enhanced Vite configuration with proper WASM file serving and fs permissions.
- Major frontend refactoring with game engine architecture.
- Updated package dependencies (esbuild, @types/node, vite plugins).

### Fixed
- Version mismatch between `wasm-bindgen` CLI and library.
- Git tracking of generated WASM/JS files in `frontend/public`.
- 403 Forbidden errors for WASM file loading in dev server.
- 404 error for favicon.ico requests.
- Dependency conflicts between esbuild and vite versions.
