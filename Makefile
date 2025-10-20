.PHONY: run check fmt clippy build release clean wasm dev start build-all

# Run with formatting and linting
run:
	@cargo fmt
	@cargo clippy --quiet
	@cargo run

# Check code without running
check:
	@cargo fmt -- --check
	@cargo clippy

# Format code
fmt:
	@cargo fmt

# Lint code
clippy:
	@cargo clippy

# Build debug
build:
	@cargo build

# Build release
release:
	@cargo build --release
	@./target/release/snake_game

# Build WASM for web
wasm:
	@cargo build --target wasm32-unknown-unknown --release
	@wasm-bindgen target/wasm32-unknown-unknown/release/snake_game.wasm --out-dir pkg --target web
	@cp pkg/*.wasm pkg/*.js pkg/*.d.ts frontend/public/

# Development - build WASM and start dev server
dev:
	@make wasm
	@cd frontend && npm run dev

# Production build - build WASM and frontend
build-all:
	@make wasm
	@cd frontend && npm run build

# Start production server
start:
	@npm start

# Clean build artifacts
clean:
	@cargo clean
	@rm -rf pkg/*
	@cd frontend && npm run clean
