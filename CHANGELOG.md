# Changelog

All notable changes to this project will be documented in this file.

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
