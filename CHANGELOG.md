# Changelog

All notable changes to this project will be documented in this file.

## [1.0.0] - 2026-04-19

### Added
- Modularized Rust core (`snake`, `world`, `utils` modules).
- Unit tests for `World` and `Snake` logic.
- `CHANGELOG.md` for version tracking.

### Changed
- Upgraded `wasm-bindgen` to `0.2.118`.
- Refactored `Makefile` for robust `build-all` and `wasm` targets.
- Optimized `.gitignore` to exclude generated artifacts from tracking.
- Switched to standard `cargo build` instead of `rustup run stable`.

### Fixed
- Version mismatch between `wasm-bindgen` CLI and library.
- Git tracking of generated WASM/JS files in `frontend/public`.
