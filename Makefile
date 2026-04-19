.PHONY: run check fmt clippy build release clean wasm dev start build-all test

run:
	@cargo fmt
	@cargo clippy --quiet
	@cargo run

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
	@./target/release/snake_game

wasm:
	@cargo build --target wasm32-unknown-unknown --release
	@wasm-bindgen target/wasm32-unknown-unknown/release/snake_game.wasm --out-dir pkg --target web
	@cp pkg/*.wasm pkg/*.js pkg/*.d.ts frontend/public/

dev:
	@make wasm
	@cd frontend && npm run dev

build-all:
	@make wasm
	@cd frontend && npm run build

start:
	@npm start

clean:
	@cargo clean
	@rm -rf pkg/*
	@cd frontend && npm run clean
