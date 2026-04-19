.PHONY: run check fmt clippy build release clean wasm dev start build-all test preview

run:
	@cargo fmt
	@cargo clippy --quiet
	@echo "This is a WASM library project. Use 'make dev' for development or 'make build-all' for production build."

check:
	@cargo fmt -- --check
	@cargo clippy

fmt:
	@cargo fmt

clippy:
	@cargo clippy

test:
	@cargo test

build:
	@cargo build

release:
	@cargo build --release
	@echo "WASM library built - use 'make build-all' for full frontend build"

wasm:
	@PATH="$(HOME)/.cargo/bin:$$PATH" cargo build --target wasm32-unknown-unknown --release
	@PATH="$(HOME)/.cargo/bin:$$PATH" wasm-bindgen target/wasm32-unknown-unknown/release/snake_game.wasm --out-dir pkg --target web
	@cp pkg/*.wasm pkg/*.js pkg/*.d.ts frontend/public/ 2>/dev/null || true

dev:
	@make wasm
	@cd frontend && npm run dev

build-all:
	@make wasm
	@cd frontend && npm run build

start:
	@make build-all
	@npm start

preview:
	@make build-all
	@cd frontend && npm run preview

clean:
	@cargo clean
	@rm -rf pkg/*
	@cd frontend && npm run clean
	@rm -rf frontend/dist
