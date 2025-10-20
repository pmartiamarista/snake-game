/* tslint:disable */
/* eslint-disable */
export enum Direction {
  Up = 0,
  Right = 1,
  Down = 2,
  Left = 3,
}
export enum GameStatus {
  Won = 0,
  Lost = 1,
  Played = 2,
  Paused = 3,
}
export class World {
  private constructor();
  free(): void;
  [Symbol.dispose](): void;
  static new(width: number, snake_idx: number): World;
  width(): number;
  start_game(): void;
  restart_game(snake_idx: number): void;
  toggle_pause(): void;
  game_status(): GameStatus | undefined;
  game_status_text(): string;
  game_button_text(): string;
  reward_cell(): number;
  snake_head_idx(): number;
  change_snake_direction(direction: Direction): void;
  snake_length(): number;
  snake_cells(): number;
  score(): number;
  step(): void;
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly __wbg_world_free: (a: number, b: number) => void;
  readonly world_new: (a: number, b: number) => number;
  readonly world_width: (a: number) => number;
  readonly world_start_game: (a: number) => void;
  readonly world_restart_game: (a: number, b: number) => void;
  readonly world_toggle_pause: (a: number) => void;
  readonly world_game_status: (a: number) => number;
  readonly world_game_status_text: (a: number) => [number, number];
  readonly world_game_button_text: (a: number) => [number, number];
  readonly world_reward_cell: (a: number) => number;
  readonly world_snake_head_idx: (a: number) => number;
  readonly world_change_snake_direction: (a: number, b: number) => void;
  readonly world_snake_length: (a: number) => number;
  readonly world_snake_cells: (a: number) => number;
  readonly world_score: (a: number) => number;
  readonly world_step: (a: number) => void;
  readonly __wbindgen_export_0: WebAssembly.Table;
  readonly __wbindgen_free: (a: number, b: number, c: number) => void;
  readonly __wbindgen_start: () => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;
/**
* Instantiates the given `module`, which can either be bytes or
* a precompiled `WebAssembly.Module`.
*
* @param {{ module: SyncInitInput }} module - Passing `SyncInitInput` directly is deprecated.
*
* @returns {InitOutput}
*/
export function initSync(module: { module: SyncInitInput } | SyncInitInput): InitOutput;

/**
* If `module_or_path` is {RequestInfo} or {URL}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {{ module_or_path: InitInput | Promise<InitInput> }} module_or_path - Passing `InitInput` directly is deprecated.
*
* @returns {Promise<InitOutput>}
*/
export default function __wbg_init (module_or_path?: { module_or_path: InitInput | Promise<InitInput> } | InitInput | Promise<InitInput>): Promise<InitOutput>;
